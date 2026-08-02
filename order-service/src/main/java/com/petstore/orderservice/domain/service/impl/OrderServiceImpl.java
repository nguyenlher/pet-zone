package com.petstore.orderservice.domain.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petstore.orderservice.api.dto.PetDTO;
import com.petstore.orderservice.api.dto.ProductDTO;
import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.model.OrderItem;
import com.petstore.orderservice.domain.model.OrderShippingDetail;
import com.petstore.orderservice.domain.model.enums.ItemType;
import com.petstore.orderservice.domain.model.enums.OrderStatus;
import com.petstore.orderservice.domain.publisher.OrderPublisher;
import com.petstore.orderservice.domain.repository.OrderRepository;
import com.petstore.orderservice.domain.service.OrderPersistenceService;
import com.petstore.orderservice.domain.service.OrderService;
import com.petstore.orderservice.exception.OrderNotFoundException;
import com.petstore.orderservice.infra.client.PetServiceClient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.petstore.orderservice.domain.service.OrderDelayQueueService;
import org.springframework.beans.factory.annotation.Value;

import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final PetServiceClient petServiceClient;
    private final OrderRepository orderRepository;
    private final OrderPersistenceService orderPersistenceService;
    private final OrderPublisher orderPublisher;
    private final OrderDelayQueueService orderDelayQueueService;
    private final RedissonClient redissonClient;

    @Value("${app.order.payment-timeout-minutes:15}")
    private long paymentTimeoutMinutes = 15;

    @Override
    public Order createOrder(UUID userId, List<OrderItem> items, OrderShippingDetail shippingDetail, String discountCode) {

        // 1. Validate items
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }
        
        validateOrderItems(items);
        
        // 2. Separate pets and products
        Set<UUID> petIds = items.stream()
                .filter(item -> item.getItemType() == ItemType.PET)
                .map(OrderItem::getItemId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Set<UUID> productIds = items.stream()
                .filter(item -> item.getItemType() == ItemType.PRODUCT)
                .map(OrderItem::getItemId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // 3. Fetch data from pet-service (controlled sequential execution, no ForkJoinPool parallelStream)
        Map<UUID, PetDTO> petDTOMap = fetchPetsData(petIds);
        Map<UUID, ProductDTO> productDTOMap = fetchProductsData(productIds);

        // 4. Enrich and validate items with pricing and metadata BEFORE reserving stock
        List<OrderItem> enrichedItems = enrichOrderItems(items, petDTOMap, productDTOMap);

        // 5. RESERVE STOCK & PET (Non-transactional, with compensating rollback on partial failure)
        List<OrderItem> successfullyReservedItems = new ArrayList<>();
        try {
            for (OrderItem item : enrichedItems) {
                if (item.getItemType() == ItemType.PRODUCT) {
                    petServiceClient.reserveStock(item.getItemId(), item.getQuantity());
                    successfullyReservedItems.add(item);
                    log.info("Reserved {} units of product: {}", item.getQuantity(), item.getItemId());
                } else if (item.getItemType() == ItemType.PET) {
                    petServiceClient.reservePet(item.getItemId());
                    successfullyReservedItems.add(item);
                    log.info("Reserved pet: {}", item.getItemId());
                }
            }
        } catch (Exception e) {
            log.error("Failed to reserve items during order creation, triggering compensating rollback...", e);
            rollbackReservation(successfullyReservedItems);
            throw e;
        }

        // 6. Calculate amounts
        double subtotalAmount = enrichedItems.stream()
                .mapToDouble(OrderItem::getSubtotalAmount)
                .sum();
        double discountAmount = 0;
        double shippingFee = 0;
        double totalAmount = subtotalAmount + shippingFee - discountAmount;

        // 7. Determine initial status
        OrderStatus initialStatus = OrderStatus.PENDING;
        if (shippingDetail != null && "vnpay".equalsIgnoreCase(shippingDetail.getPaymentMethod())) {
            initialStatus = OrderStatus.PENDING_PAYMENT;
        }

        Order order = Order.builder()
                .userId(userId)
                .items(enrichedItems)
                .shippingDetail(shippingDetail)
                .subtotalAmount(subtotalAmount)
                .discountAmount(discountAmount)
                .shippingFee(shippingFee)
                .totalAmount(totalAmount)
                .status(initialStatus)
                .createdAt(LocalDateTime.now())
                .build();

        // 8. Persist order in isolated DB transaction (with compensating rollback if DB fails)
        Order savedOrder;
        try {
            savedOrder = orderPersistenceService.saveOrder(order);
        } catch (Exception e) {
            log.error("Failed to persist order in database, triggering compensating rollback for reserved items...", e);
            rollbackReservation(successfullyReservedItems);
            throw e;
        }

        // 9. Publish order created event (after DB transaction is committed)
        try {
            orderPublisher.publishOrderCreated(savedOrder);
        } catch (Exception e) {
            log.error("Failed to publish order created event for order: {}", savedOrder.getId(), e);
        }

        // 10. Schedule payment timeout in Redis Delay Queue if order requires online payment
        if (savedOrder.getStatus() == OrderStatus.PENDING_PAYMENT) {
            orderDelayQueueService.schedulePaymentTimeout(savedOrder.getId(), paymentTimeoutMinutes);
        }

        return savedOrder;
    }
    
    // Helper methods
    private void validateOrderItems(List<OrderItem> items) {
        for (OrderItem item : items) {
            if (item.getItemType() == null) {
                throw new IllegalArgumentException("Item type is required");
            }
            if (item.getItemId() == null) {
                throw new IllegalArgumentException("Item ID is required");
            }
            if (item.getQuantity() <= 0) {
                throw new IllegalArgumentException("Item quantity must be greater than 0");
            }
        }
    }
    
    private Map<UUID, PetDTO> fetchPetsData(Set<UUID> petIds) {
        Map<UUID, PetDTO> petDTOMap = new HashMap<>();
        for (UUID petId : petIds) {
            if (petId == null) continue;
            try {
                PetDTO pet = petServiceClient.getPetById(petId);
                if (pet != null) {
                    petDTOMap.put(petId, pet);
                }
            } catch (Exception e) {
                log.error("Failed to fetch pet: {}", petId, e);
            }
        }
        return petDTOMap;
    }
    
    private Map<UUID, ProductDTO> fetchProductsData(Set<UUID> productIds) {
        Map<UUID, ProductDTO> productDTOMap = new HashMap<>();
        for (UUID productId : productIds) {
            if (productId == null) continue;
            try {
                ProductDTO product = petServiceClient.getProductById(productId);
                if (product != null) {
                    productDTOMap.put(productId, product);
                }
            } catch (Exception e) {
                log.error("Failed to fetch product: {}", productId, e);
            }
        }
        return productDTOMap;
    }
    
    private List<OrderItem> enrichOrderItems(
            List<OrderItem> items,
            Map<UUID, PetDTO> petDTOMap,
            Map<UUID, ProductDTO> productDTOMap) {
        
        return items.stream()
                .map(item -> {
                    if (item.getItemType() == ItemType.PET) {
                        PetDTO pet = petDTOMap.get(item.getItemId());
                        if (pet == null) {
                            throw new IllegalArgumentException("Pet not found or unavailable: " + item.getItemId());
                        }
                        return OrderItem.builder()
                                .itemType(ItemType.PET)
                                .itemId(pet.getId())
                                .itemName(pet.getName())
                                .unitPrice(pet.getPrice())
                                .quantity(item.getQuantity())
                                .subtotalAmount(pet.getPrice() * item.getQuantity())
                                .build();
                    } else {
                        ProductDTO product = productDTOMap.get(item.getItemId());
                        if (product == null) {
                            throw new IllegalArgumentException("Product not found or unavailable: " + item.getItemId());
                        }
                        return OrderItem.builder()
                                .itemType(ItemType.PRODUCT)
                                .itemId(product.getId())
                                .itemName(product.getName())
                                .unitPrice(product.getPrice())
                                .quantity(item.getQuantity())
                                .subtotalAmount(product.getPrice() * item.getQuantity())
                                .build();
                    }
                })
                .collect(Collectors.toList());
    }
    
    private void rollbackReservation(List<OrderItem> reservedItems) {
        if (reservedItems == null || reservedItems.isEmpty()) {
            return;
        }
        log.warn("Rolling back reservation for {} items", reservedItems.size());
        for (OrderItem item : reservedItems) {
            try {
                if (item.getItemType() == ItemType.PRODUCT) {
                    petServiceClient.restoreStock(item.getItemId(), item.getQuantity());
                    log.info("Compensating action: restored {} units of product: {}", item.getQuantity(), item.getItemId());
                } else if (item.getItemType() == ItemType.PET) {
                    petServiceClient.restorePet(item.getItemId());
                    log.info("Compensating action: restored pet: {}", item.getItemId());
                }
            } catch (Exception e) {
                log.error("Failed to rollback item during compensating action: id={}, type={}",
                        item.getItemId(), item.getItemType(), e);
            }
        }
    }

    @Override
    public Order cancelOrder(UUID orderId, String reason) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isEmpty()) {
            throw new OrderNotFoundException("Order not found: " + orderId);
        }

        Order existingOrder = order.get();

        if (existingOrder.getStatus() == OrderStatus.CONFIRM) {
            throw new IllegalStateException("Cannot cancel confirmed order: " + orderId);
        }

        if (existingOrder.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Order already cancelled: " + orderId);
        }

        existingOrder.setStatus(OrderStatus.CANCELLED);
        existingOrder.setUpdatedAt(LocalDateTime.now());
        Order savedOrder = orderRepository.save(existingOrder);
        orderDelayQueueService.cancelPaymentTimeout(orderId);

        // Publish order cancelled event
        try {
            orderPublisher.publishOrderCancelled(savedOrder, reason);
        } catch (Exception e) {
            log.error("Failed to publish order cancelled event for order: {}", savedOrder.getId(), e);
        }

        return savedOrder;
    }

    @Override
    public Order getOrderById(UUID orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }

    @Override
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    @Override
    public Page<Order> getUserOrders(UUID userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable);
    }

    // Method to update order status from Kafka payment event with distributed locking
    @Transactional
    public void updateOrderStatusFromPayment(UUID orderId, OrderStatus newStatus) {
        RLock lock = redissonClient.getLock("order:lock:" + orderId);
        boolean acquired = false;
        try {
            acquired = lock.tryLock(5, 15, TimeUnit.SECONDS);
            if (!acquired) {
                log.warn("Could not acquire distributed lock for order: {} during payment status update", orderId);
                throw new IllegalStateException("Could not acquire distributed lock for order: " + orderId);
            }

            Optional<Order> orderOpt = orderRepository.findById(orderId);
            if (orderOpt.isPresent()) {
                Order order = orderOpt.get();
                if (order.getStatus() == OrderStatus.CANCELLED) {
                    log.warn("Order {} was already CANCELLED (e.g. timed out). Ignoring payment status update to {}",
                            orderId, newStatus);
                    return;
                }
                order.setStatus(newStatus);
                order.setUpdatedAt(LocalDateTime.now());
                orderRepository.save(order);
                orderDelayQueueService.cancelPaymentTimeout(orderId);
                log.info("Updated order {} status to {}", orderId, newStatus);

                if (newStatus == OrderStatus.CONFIRM) {
                    try {
                        orderPublisher.publishOrderConfirmed(order);
                    } catch (Exception e) {
                        log.error("Failed to publish order confirmed event for order: {}", orderId, e);
                    }
                }
            } else {
                log.error("Order not found for payment update: {}", orderId);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Interrupted while waiting for lock during payment update for order: {}", orderId, e);
            throw new IllegalStateException("Interrupted while waiting for lock on order: " + orderId, e);
        } finally {
            if (acquired && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    /**
     * Compensating transaction: Cancel order when payment fails
     * This is part of the Saga pattern to ensure data consistency
     */
    @Transactional
    public void cancelOrderDueToPaymentFailure(UUID orderId, String reason) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            
            // Only cancel if order is in PENDING_PAYMENT status
            if (order.getStatus() == OrderStatus.PENDING_PAYMENT) {
                order.setStatus(OrderStatus.PAYMENT_FAILED);
                order.setUpdatedAt(LocalDateTime.now());
                orderRepository.save(order);
                orderDelayQueueService.cancelPaymentTimeout(orderId);
                
                // Publish order cancelled event for other services (e.g., inventory service)
                try {
                    orderPublisher.publishOrderCancelled(order, "Payment failed: " + reason);
                } catch (Exception e) {
                    log.error("Failed to publish order cancelled event", e);
                }
                
                log.info("Order {} cancelled due to payment failure: {}", orderId, reason);
            } else {
                log.warn("Cannot cancel order {} - current status: {}", orderId, order.getStatus());
            }
        } else {
            log.error("Order not found for payment failure cancellation: {}", orderId);
        }
    }

    @Override
    @Transactional
    public Order updateOrderStatus(UUID orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found: " + orderId));
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        Order updatedOrder = orderRepository.save(order);
        log.info("Order status updated successfully - orderId: {}, newStatus: {}", orderId, status);

        if (status == OrderStatus.CONFIRM) {
            try {
                orderPublisher.publishOrderConfirmed(updatedOrder);
            } catch (Exception e) {
                log.error("Failed to publish order confirmed event for order: {}", orderId, e);
            }
        }

        return updatedOrder;
    }

    @Override
    @Transactional
    public void deleteOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found: " + orderId));

        // Allow deletion only for terminal cancel/failed states
        if (order.getStatus() != OrderStatus.CANCELLED && order.getStatus() != OrderStatus.PAYMENT_FAILED) {
            throw new IllegalStateException("Only orders with status CANCELLED or PAYMENT_FAILED can be deleted");
        }

        orderRepository.deleteById(orderId);
        log.info("Order {} deleted successfully", orderId);
    }
}

