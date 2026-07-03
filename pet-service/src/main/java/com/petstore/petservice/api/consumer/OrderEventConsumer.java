package com.petstore.petservice.api.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petstore.petservice.api.consumer.message.OrderCancelledMessage;
import com.petstore.petservice.api.consumer.message.OrderItemMessage;
import com.petstore.petservice.domain.service.StockReservationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventConsumer {
    
    private final StockReservationService stockReservationService;
    private final ObjectMapper objectMapper;
    
    @KafkaListener(
        topics = "${app.kafka.topics.order.cancelled:order.cancelled}",
        groupId = "${spring.kafka.consumer.group-id:pet-service-group}"
    )
    public void handleOrderCancelled(@Payload String payload, Acknowledgment acknowledgment) {
        try {
            OrderCancelledMessage message = objectMapper.readValue(payload, OrderCancelledMessage.class);
            log.info("Received order cancelled event - orderId: {}", message.getOrderId());
            
            // Restore stock for all product items
            if (message.getItems() != null) {
                for (OrderItemMessage item : message.getItems()) {
                    if ("PRODUCT".equals(item.getItemType())) {
                        log.info("Restoring stock - productId: {}, quantity: {}", 
                                 item.getItemId(), item.getQuantity());
                        stockReservationService.restoreStock(item.getItemId(), item.getQuantity());
                    }
                }
            }
            
            acknowledgment.acknowledge();
            log.info("Successfully processed order cancelled event - orderId: {}", message.getOrderId());
            
        } catch (Exception e) {
            log.error("Failed to process order cancelled event", e);
        }
    }
}
