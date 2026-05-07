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
import org.springframework.web.client.RestClient;

import com.petstore.orderservice.api.dto.PetDTO;
import com.petstore.orderservice.api.dto.response.PaymentResponse;
import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.model.OrderItem;
import com.petstore.orderservice.domain.model.OrderShippingDetail;
import com.petstore.orderservice.domain.model.enums.OrderStatus;
import com.petstore.orderservice.domain.publisher.OrderPublisher;
import com.petstore.orderservice.domain.repository.OrderRepository;
import com.petstore.orderservice.domain.service.OrderService;
import com.petstore.orderservice.infra.client.PaymentClient;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final RestClient petRestClient;
    private final OrderRepository orderRepository;
    private final PaymentClient paymentClient;
    private final OrderPublisher orderPublisher;

    public OrderServiceImpl(
            @Qualifier("petRestClient") RestClient petRestClient,
            OrderRepository orderRepository,
            PaymentClient paymentClient,
            OrderPublisher orderPublisher) {
        this.petRestClient = petRestClient;
        this.orderRepository = orderRepository;
        this.paymentClient = paymentClient;
        this.orderPublisher = orderPublisher;
    }

    @Override
    public Order createOrder(UUID userId, List<OrderItem> items, OrderShippingDetail shippingDetail, String discountCode) {

        Set<UUID> petIds = items.stream()
                .map(OrderItem::getPetId)
                .collect(Collectors.toSet());

        Map<UUID, PetDTO> petDTOMap = new ConcurrentHashMap<>();

        petIds.parallelStream().forEach(petId -> {
            PetDTO pet = petRestClient.get()
                    .uri("/private/pets/{petId}", petId)
                    .retrieve()
                    .body(PetDTO.class);
            if (pet != null) petDTOMap.put(petId, pet);
        });

        List<OrderItem> enrichedItems = items.stream()
                .map(item -> {
                    PetDTO pet = petDTOMap.get(item.getPetId());
                    if (pet == null) {
                        throw new RuntimeException("Pet not found: " + item.getPetId());
                    }
                    return OrderItem.builder()
                            .petId(pet.getId())
                            .petName(pet.getName())
                            .unitPrice(pet.getPrice())
                            .quantity(item.getQuantity())
                            .subtotalAmount(pet.getPrice() * item.getQuantity())
                            .build();
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

        // Nếu là VNPay, tạo payment URL
        if (initialStatus == OrderStatus.PENDING_PAYMENT) {
            try {
                PaymentResponse paymentResponse = paymentClient.createPayment(
                        savedOrder.getId(),
                        "VNPAY",
                        savedOrder.getTotalAmount()
                );
                // Lưu payment URL vào order (có thể thêm field mới hoặc return riêng)
                log.info("Payment URL created for order {}: {}", savedOrder.getId(), paymentResponse.getPaymentUrl());
            } catch (Exception e) {
                log.error("Failed to create payment URL for order: {}", savedOrder.getId(), e);
                // Rollback order hoặc mark as failed
                savedOrder.setStatus(OrderStatus.PAYMENT_FAILED);
                orderRepository.save(savedOrder);
                throw new RuntimeException("Failed to create payment: " + e.getMessage());
            }
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
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    // Method để update order status từ Kafka event
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
}
