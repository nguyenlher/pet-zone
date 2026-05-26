package com.petstore.orderservice.infra.publisher.impl;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.publisher.OrderPublisher;
import com.petstore.orderservice.infra.publisher.message.OrderCanceledMessage;
import com.petstore.orderservice.infra.publisher.message.OrderConfirmedMessage;
import com.petstore.orderservice.infra.publisher.message.OrderCreatedMessage;
import com.petstore.orderservice.infra.publisher.message.OrderItemMessage;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderPublisherImpl implements OrderPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.kafka.topics.order.created}")
    private String orderCreatedTopic;

    @Value("${app.kafka.topics.order.confirmed}")
    private String orderConfirmedTopic;

    @Value("${app.kafka.topics.order.canceled}")
    private String orderCanceledTopic;

    @Override
    public void publishOrderCreated(Order order) {
        OrderCreatedMessage message = OrderCreatedMessage.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .items(order.getItems().stream()
                        .map(item -> OrderItemMessage.builder()
                                .itemType(item.getItemType())
                                .itemId(item.getItemId())
                                .itemName(item.getItemName())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .subtotalAmount(item.getSubtotalAmount())
                                .build())
                        .collect(Collectors.toList()))
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .build();

        kafkaTemplate.send(orderCreatedTopic, order.getId().toString(), message);
        log.info("Published OrderCreatedMessage for order: {}", order.getId());
    }

    @Override
    public void publishOrderConfirmed(Order order) {
        OrderConfirmedMessage message = OrderConfirmedMessage.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .status(order.getStatus().name())
                .confirmedAt(order.getUpdatedAt())
                .build();

        kafkaTemplate.send(orderConfirmedTopic, order.getId().toString(), message);
        log.info("Published OrderConfirmedMessage for order: {}", order.getId());
    }

    @Override
    public void publishOrderCanceled(Order order, String reason) {
        OrderCanceledMessage message = OrderCanceledMessage.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .reason(reason)
                .status(order.getStatus().name())
                .canceledAt(order.getUpdatedAt())
                .build();

        kafkaTemplate.send(orderCanceledTopic, order.getId().toString(), message);
        log.info("Published OrderCanceledMessage for order: {}", order.getId());
    }
}
