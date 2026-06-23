package com.petstore.orderservice.domain.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import com.petstore.orderservice.api.dto.PetDTO;
import com.petstore.orderservice.api.dto.ProductDTO;
import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.model.OrderItem;
import com.petstore.orderservice.domain.model.OrderShippingDetail;
import com.petstore.orderservice.domain.model.enums.ItemType;
import com.petstore.orderservice.domain.model.enums.OrderStatus;
import com.petstore.orderservice.domain.publisher.OrderPublisher;
import com.petstore.orderservice.domain.repository.OrderRepository;
import com.petstore.orderservice.domain.service.OrderService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final RestClient petRestClient;
    private final OrderRepository orderRepository;
    private final OrderPublisher orderPublisher;

    public OrderServiceImpl(
            @Qualifier("petRestClient") RestClient petRestClient,
            OrderRepository orderRepository,
            OrderPublisher orderPublisher) {
        this.petRestClient = petRestClient;
        this.orderRepository = orderRepository;
        this.orderPublisher = orderPublisher;
    }

    @Override
    public Order createOrder(UUID userId, List<OrderItem> items, OrderShippingDetail shippingDetail, String discountCode) {

        // Validate items
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }
        
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

        // Separate pets and products
        Set<UUID> petIds = items.stream()
                .filter(item -> item.getItemType() == ItemType.PET)
                .map(OrderItem::getItemId)
                .filter(id -> id != null)  // Extra safety check
                .collect(Collectors.toSet());

        Set<UUID> productIds = items.stream()
                .filter(item -> item.getItemType() == ItemType.PRODUCT)
                .map(OrderItem::getItemId)
                .filter(id -> id != null)  // Extra safety check
                .collect(Collectors.toSet());

        // Fetch pets data
        Map<UUID, PetDTO> petDTOMap = new ConcurrentHashMap<>();
        petIds.parallelStream().forEach(petId -> {
            if (petId == null) return;
            try {
                PetDTO pet = petRestClient.get()
                        .uri("/private/pets/{petId}", petId)
                        .retrieve()
                        .body(PetDTO.class);
                if (pet != null) petDTOMap.put(petId, pet);
            } catch (Exception e) {
                log.error("Failed to fetch pet: {}", petId, e);
            }
        });

        // Fetch products data
        Map<UUID, ProductDTO> productDTOMap = new ConcurrentHashMap<>();
        productIds.parallelStream().forEach(productId -> {
            if (productId == null) return;
            try {
                ProductDTO product = petRestClient.get()
                        .uri("/private/products/{productId}", productId)
                        .retrieve()
                        .body(ProductDTO.class);
                if (product != null) productDTOMap.put(productId, product);
            } catch (Exception e) {
                log.error("Failed to fetch product: {}", productId, e);
            }
        });

        // Enrich items with data
        List<OrderItem> enrichedItems = items.stream()
                .map(item -> {
                    if (item.getItemType() == ItemType.PET) {
                        PetDTO pet = petDTOMap.get(item.getItemId());
                        if (pet == null) {
                            throw new IllegalArgumentException("Pet not found or unavailable: " + item.getItemId() + ". Please remove this item from your cart and try again.");
                        }
                        return OrderItem.builder()
                                .itemType(ItemType.PET)
                                .itemId(pet.getId())
                                .itemName(pet.getName())
                                .unitPrice(pet.getPrice())
                                .quantity(item.getQuantity())
                                .subtotalAmount(pet.getPrice() * item.getQuantity())
                                .build();
                    } else { // PRODUCT
                        ProductDTO product = productDTOMap.get(item.getItemId());
                        if (product == null) {
                            throw new IllegalArgumentException("Product not found or unavailable: " + item.getItemId() + ". Please remove this item from your cart and try again.");
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

        double subtotalAmount = enrichedItems.stream()
                .mapToDouble(OrderItem::getSubtotalAmount)
                .sum();
        double discountAmount = 0;
        double shippingFee = 0;
        double totalAmount = subtotalAmount + shippingFee - discountAmount;

        // Xác định status dựa trên payment method
        OrderStatus initialStatus = OrderStatus.PENDING; // Default cho COD
        if (shippingDetail != null && "vnpay".equalsIgnoreCase(shippingDetail.getPaymentMethod())) {
            initialStatus = OrderStatus.PENDING_PAYMENT; // Chờ thanh toán VNPay
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
                
        Order savedOrder = orderRepository.save(order);

        // Publish order created event
        try {
            orderPublisher.publishOrderCreated(savedOrder);
        } catch (Exception e) {
            log.error("Failed to publish order created event for order: {}", savedOrder.getId(), e);
        }

        return savedOrder;
    }

    @Override
    public Order cancelOrder(UUID orderId, String reason) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isEmpty()) {
            throw new RuntimeException("Order not found: " + orderId);
        }

        Order existingOrder = order.get();

        if (existingOrder.getStatus() == OrderStatus.CONFIRM) {
            throw new RuntimeException("Cannot cancel confirmed order: " + orderId);
        }

        if (existingOrder.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Order already canceled: " + orderId);
        }

        existingOrder.setStatus(OrderStatus.CANCELLED);
        existingOrder.setUpdatedAt(LocalDateTime.now());
        Order savedOrder = orderRepository.save(existingOrder);

        // Publish order canceled event
        try {
            orderPublisher.publishOrderCanceled(savedOrder, reason);
        } catch (Exception e) {
            log.error("Failed to publish order canceled event for order: {}", savedOrder.getId(), e);
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
                    orderPublisher.publishOrderCanceled(order, "Payment failed: " + reason);
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
