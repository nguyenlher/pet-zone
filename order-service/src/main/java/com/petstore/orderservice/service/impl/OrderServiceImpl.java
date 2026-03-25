package com.petstore.orderservice.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

import com.petstore.orderservice.dto.PetDTO;
import com.petstore.orderservice.dto.request.CancelOrderRequest;
import com.petstore.orderservice.dto.request.CreateOrderRequest;
import com.petstore.orderservice.dto.request.OrderItemRequest;
import com.petstore.orderservice.dto.response.CancelOrderResponse;
import com.petstore.orderservice.dto.response.CreateOrderResponse;
import com.petstore.orderservice.dto.response.OrderItemResponse;
import com.petstore.orderservice.model.Order;
import com.petstore.orderservice.model.OrderItem;
import com.petstore.orderservice.model.enums.OrderStatus;
import com.petstore.orderservice.repository.OrderRepository;
import com.petstore.orderservice.service.OrderService;

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
    public CreateOrderResponse createOrder(CreateOrderRequest request) {

        Set<UUID> petIds = request.getItems().stream()
                .map(OrderItemRequest::getPetId)
                .collect(Collectors.toSet());

        Map<UUID, PetDTO> petDTOMap = new ConcurrentHashMap<>();

        petIds.parallelStream().forEach(petId -> {
            PetDTO pet = petRestClient.get()
                    .uri("/api/pets/{id}", petId)
                    .retrieve()
                    .body(PetDTO.class);
            if (pet != null) petDTOMap.put(petId, pet);
        });

        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemRequest : request.getItems()) {
            PetDTO pet = petDTOMap.get(itemRequest.getPetId());
            if (pet == null) {
                throw new RuntimeException("Pet not found: " + itemRequest.getPetId());
            }
            OrderItem orderItem = OrderItem.builder()
                    .petId(pet.getId())
                    .quantity(itemRequest.getQuantity())
                    .build();
            orderItems.add(orderItem);
        }

        double subtotalAmount = orderItems.stream()
                .mapToDouble(item -> {
                    PetDTO pet = petDTOMap.get(item.getPetId());
                    return pet.getPrice() * item.getQuantity();
                })
                .sum();
        double discountAmount = 0;
        double shippingFee = 0;
        double totalAmount = subtotalAmount + shippingFee - discountAmount;

        List<OrderItemResponse> itemResponses = orderItems.stream()
                .map(item -> {
                    PetDTO pet = petDTOMap.get(item.getPetId());
                    return OrderItemResponse.builder()
                            .id(pet.getId())
                            .name(pet.getName())
                            .quantity(item.getQuantity())
                            .price(pet.getPrice())
                            .subtotalPrice(pet.getPrice() * item.getQuantity())
                            .build();
                })
                .collect(Collectors.toList());

        return CreateOrderResponse.builder()
                .userId(request.getUserId())
                .subtotalAmount(subtotalAmount)
                .discountAmount(discountAmount)
                .shippingFee(shippingFee)
                .totalAmount(totalAmount)
                .items(itemResponses)
                .orderStatus(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public CancelOrderResponse cancelOrder(CancelOrderRequest request) {
        Optional<Order> order = orderRepository.findById(request.getOrderId());
        if (order.isEmpty()) {
            throw new RuntimeException("Order not found: " + request.getOrderId());
        }

        Order existingOrder = order.get();

        if (existingOrder.getStatus() == OrderStatus.CONFIRM) {
            throw new RuntimeException("Cannot cancel confirmed order: " + request.getOrderId());
        }

        if (existingOrder.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Order already canceled: " + request.getOrderId());
        }

        return CancelOrderResponse.builder()
                .orderId(request.getOrderId())
                .orderStatus(OrderStatus.CANCELLED)
                .updatedAt(LocalDateTime.now())
                .message("Order canceled successfully")
                .build();
    }
}