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
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.petstore.orderservice.api.dto.PetDTO;
import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.model.OrderItem;
import com.petstore.orderservice.domain.model.enums.OrderStatus;
import com.petstore.orderservice.domain.repository.OrderRepository;
import com.petstore.orderservice.domain.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService {

    private final RestClient petRestClient;
    private final OrderRepository orderRepository;

    public OrderServiceImpl(
            @Qualifier("petRestClient") RestClient petRestClient,
            OrderRepository orderRepository) {
        this.petRestClient = petRestClient;
        this.orderRepository = orderRepository;
    }

    @Override
    public Order createOrder(UUID userId, List<OrderItem> items, String discountCode) {

        Set<UUID> petIds = items.stream()
                .map(OrderItem::getPetId)
                .collect(Collectors.toSet());

        Map<UUID, PetDTO> petDTOMap = new ConcurrentHashMap<>();

        petIds.parallelStream().forEach(petId -> {
            PetDTO pet = petRestClient.get()
                    .uri("/api/pets/{id}", petId)
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

        return Order.builder()
                .userId(userId)
                .items(enrichedItems)
                .subtotalAmount(subtotalAmount)
                .discountAmount(discountAmount)
                .shippingFee(shippingFee)
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
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
        return existingOrder;
    }
}
