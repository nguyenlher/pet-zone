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

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final PetServiceClient petServiceClient;
    private final OrderRepository orderRepository;
    private final OrderPersistenceService orderPersistenceService;
    private final OrderPublisher orderPublisher;

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

        // 5. RESERVE STOCK (Non-transactional, with compensating rollback on partial failure)
        List<OrderItem> successfullyReservedItems = new ArrayList<>();
        try {
            for (OrderItem item : enrichedItems) {
                if (item.getItemType() == ItemType.PRODUCT) {
                    petServiceClient.reserveStock(item.getItemId(), item.getQuantity());
                    successfullyReservedItems.add(item);
                    log.info("Reserved {} units of product: {}", item.getQuantity(), item.getItemId());
                }
            }
        } catch (Exception e) {
            log.error("Failed to reserve stock during order creation, triggering compensating rollback...", e);
            rollbackStockReservation(successfullyReservedItems);
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
            log.error("Failed to persist order in database, triggering compensating rollback for reserved stock...", e);
            rollbackStockReservation(successfullyReservedItems);
            throw e;
        }

        // 9. Publish order created event (after DB transaction is committed)
        try {
            orderPublisher.publishOrderCreated(savedOrder);
        } catch (Exception e) {
            log.error("Failed to publish order created event for order: {}", savedOrder.getId(), e);
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
    
    private void rollbackStockReservation(List<OrderItem> reservedItems) {
        if (reservedItems == null || reservedItems.isEmpty()) {
            return;
        }
        log.warn("Rolling back stock reservation for {} items", reservedItems.size());
        for (OrderItem item : reservedItems) {
            try {
                petServiceClient.restoreStock(item.getItemId(), item.getQuantity());
                log.info("Compensating action: restored {} units of product: {}", item.getQuantity(), item.getItemId());
            } catch (Exception e) {
                log.error("Failed to rollback stock during compensating action for product: {}", item.getItemId(), e);
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

    // Method để update order status từ Kafka event
    @Transactional
    public void updateOrderStatusFromPayment(UUID orderId, OrderStatus newStatus) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(newStatus);
            order.setUpdatedAt(LocalDateTime.now());
            orderRepository.save(order);
            log.info("Updated order {} status to {}", orderId, newStatus);
        } else {
            log.error("Order not found for payment update: {}", orderId);
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
}
