package com.petstore.orderservice.api.controller.priv;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.orderservice.api.dto.UserDTO;
import com.petstore.orderservice.api.dto.request.UpdateOrderStatusRequest;
import com.petstore.orderservice.api.dto.response.CreateOrderResponse;
import com.petstore.orderservice.api.dto.response.MessageResponse;
import com.petstore.orderservice.api.dto.response.OrderItemResponse;
import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.model.enums.OrderStatus;
import com.petstore.orderservice.domain.repository.OrderRepository;
import com.petstore.orderservice.domain.service.OrderService;
import com.petstore.orderservice.infra.client.UserClient;
import com.petstore.orderservice.utils.apipaths.OrderApiPath;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Private Order Controller for inter-service communication and admin operations
 * Used by other microservices (payment-service, etc.) and admin panel
 */
@RestController
@RequestMapping(OrderApiPath.PRIVATE_ORDER_BASE)
@RequiredArgsConstructor
@Slf4j
public class PrivateOrderController {

    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final UserClient userClient;

    @GetMapping("/{id}")
    public ResponseEntity<CreateOrderResponse> getOrderById(@PathVariable UUID id) {
        log.info("Private API: Getting order by id: {}", id);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));

        CreateOrderResponse response = toCreateOrderResponse(order);
        
        // Fetch user information
        try {
            UserDTO user = userClient.getUserById(order.getUserId());
            response.setUser(user);
        } catch (Exception e) {
            log.warn("Failed to fetch user info for order: {}, userId: {}", order.getId(), order.getUserId(), e);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get all orders with pagination (Admin)
     */
    @GetMapping
    public ResponseEntity<Page<CreateOrderResponse>> getAllOrders(Pageable pageable) {
        log.info("Private API: Admin getting all orders");
        Page<Order> orders = orderService.getAllOrders(pageable);
        Page<CreateOrderResponse> response = orders.map(order -> {
            CreateOrderResponse orderResponse = toCreateOrderResponse(order);
            try {
                UserDTO user = userClient.getUserById(order.getUserId());
                orderResponse.setUser(user);
            } catch (Exception e) {
                log.warn("Failed to fetch user info for order: {}", order.getId(), e);
            }
            return orderResponse;
        });
        return ResponseEntity.ok(response);
    }

    /**
     * Update order status (Admin)
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<CreateOrderResponse> updateOrderStatus(
            @PathVariable UUID id,
            @RequestBody UpdateOrderStatusRequest request) {
        log.info("Private API: Admin updating order status - orderId: {}, newStatus: {}", id, request.getStatus());
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
        
        // Update status
        order.setStatus(request.getStatus());
        order.setUpdatedAt(java.time.LocalDateTime.now());
        order = orderRepository.save(order);
        
        CreateOrderResponse response = toCreateOrderResponse(order);
        
        // Fetch user information
        try {
            UserDTO user = userClient.getUserById(order.getUserId());
            response.setUser(user);
        } catch (Exception e) {
            log.warn("Failed to fetch user info for order: {}", order.getId(), e);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Delete order (Admin) - Only allowed for CANCELLED or PAYMENT_FAILED orders
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteOrder(@PathVariable UUID id) {
        log.info("Private API: Admin deleting order - orderId: {}", id);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
        
        // Check if order can be deleted
        if (order.getStatus() != OrderStatus.CANCELLED && order.getStatus() != OrderStatus.PAYMENT_FAILED) {
            return ResponseEntity.badRequest().body(MessageResponse.builder()
                    .message("Only orders with status CANCELLED or PAYMENT_FAILED can be deleted")
                    .success(false)
                    .build());
        }
        
        orderRepository.deleteById(id);
        
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Order deleted successfully")
                .success(true)
                .build());
    }

    private CreateOrderResponse toCreateOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .itemType(item.getItemType())
                        .id(item.getItemId())
                        .name(item.getItemName())
                        .quantity(item.getQuantity())
                        .price(item.getUnitPrice())
                        .subtotalPrice(item.getSubtotalAmount())
                        .build())
                .collect(Collectors.toList());

        return CreateOrderResponse.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .subtotalAmount(order.getSubtotalAmount())
                .discountAmount(order.getDiscountAmount())
                .shippingFee(order.getShippingFee())
                .totalAmount(order.getTotalAmount())
                .orderStatus(order.getStatus())
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
