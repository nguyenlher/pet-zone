package com.petstore.orderservice.api.controller.publ;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

import com.petstore.orderservice.api.dto.UserDTO;
import com.petstore.orderservice.api.dto.request.CancelOrderRequest;
import com.petstore.orderservice.api.dto.request.CreateOrderRequest;
import com.petstore.orderservice.api.dto.response.CancelOrderResponse;
import com.petstore.orderservice.api.dto.response.CreateOrderResponse;
import com.petstore.orderservice.api.dto.response.OrderItemResponse;
import com.petstore.orderservice.api.dto.response.ShippingDetailResponse;
import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.model.OrderItem;
import com.petstore.orderservice.domain.model.OrderShippingDetail;
import com.petstore.orderservice.domain.service.OrderService;
import com.petstore.orderservice.infra.client.PaymentClient;
import com.petstore.orderservice.infra.client.UserClient;
import com.petstore.orderservice.utils.apipaths.OrderApiPath;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Order Controller
 * Handles both user and admin order operations
 */
@Slf4j
@RestController
@RequestMapping(OrderApiPath.ORDER_BASE)
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final PaymentClient paymentClient;
    private final UserClient userClient;

    // ==================== USER ENDPOINTS ====================

    @PostMapping(OrderApiPath.ORDER_CREATE)
    public ResponseEntity<CreateOrderResponse> createOrder(
            @RequestBody CreateOrderRequest request,
            HttpServletRequest httpRequest) {
        List<OrderItem> items = request.getItems().stream()
                .map(item -> OrderItem.builder()
                        .itemType(item.getItemType())
                        .itemId(item.getItemId())
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        OrderShippingDetail shippingDetail = null;
        if (request.getShipping() != null) {
            shippingDetail = OrderShippingDetail.builder()
                    .name(request.getShipping().getName())
                    .phone(request.getShipping().getPhone())
                    .address(request.getShipping().getAddress())
                    .city(request.getShipping().getCity())
                    .paymentMethod(request.getShipping().getPaymentMethod())
                    .build();
        }

        // Extract internal userId if user is authenticated; otherwise null for guest
        UUID userId = request.getUserId();
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            UUID resolvedUserId = userClient.getInternalUserIdFromBearer(authHeader);
            if (resolvedUserId != null) {
                userId = resolvedUserId;
            }
        }

        Order order = orderService.createOrder(userId, items, shippingDetail, request.getDiscountCode());

        CreateOrderResponse response = toCreateOrderResponse(order);
        
        // Nếu là VNPay, lấy payment URL từ payment service
        if (order.getStatus() == com.petstore.orderservice.domain.model.enums.OrderStatus.PENDING_PAYMENT) {
            try {
                com.petstore.orderservice.api.dto.response.PaymentResponse paymentResponse = 
                    paymentClient.createPayment(order.getId(), "VNPAY");
                response.setPaymentUrl(paymentResponse.getPaymentUrl());
            } catch (Exception e) {
                // Log error nhưng vẫn trả về order, frontend có thể retry
                log.error("Failed to create payment URL for order: {}", order.getId(), e);
            }
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CreateOrderResponse> getOrderById(@PathVariable UUID id) {
        Order order = orderService.getOrderById(id);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toCreateOrderResponse(order));
    }

    @PostMapping(OrderApiPath.ORDER_CANCEL)
    public ResponseEntity<CancelOrderResponse> cancelOrder(@RequestBody CancelOrderRequest request) {
        Order order = orderService.cancelOrder(request.getOrderId(), request.getReason());

        CancelOrderResponse response = CancelOrderResponse.builder()
                .orderId(order.getId())
                .orderStatus(order.getStatus())
                .updatedAt(order.getUpdatedAt())
                .message("Order canceled successfully")
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user")
    public ResponseEntity<Page<CreateOrderResponse>> getUserOrders(
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest request,
            Pageable pageable) {
        if (jwt == null) {
            return org.springframework.http.ResponseEntity.status(401).build();
        }
        String authHeader = request.getHeader("Authorization");
        java.util.UUID userId = userClient.getInternalUserIdFromBearer(authHeader);
        if (userId == null) {
            log.warn("Could not resolve internal user id for Keycloak subject: {}", jwt.getSubject());
            return org.springframework.http.ResponseEntity.status(401).build();
        }
        Page<Order> orders = orderService.getUserOrders(userId, pageable);
        return ResponseEntity.ok(orders.map(this::toCreateOrderResponse));
    }

    // ==================== ADMIN ENDPOINTS ====================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<CreateOrderResponse>> getAllOrders(Pageable pageable) {
        log.info("Admin API: Getting all orders");
        Page<Order> orders = orderService.getAllOrders(pageable);
        Page<CreateOrderResponse> response = orders.map(order -> {
            CreateOrderResponse orderResponse = toCreateOrderResponse(order);
            // Fetch user information
            try {
                UserDTO user = userClient.getUserById(order.getUserId());
                orderResponse.setUser(user);
            } catch (Exception e) {
                log.warn("Failed to fetch user info for order: {}, userId: {}", order.getId(), order.getUserId(), e);
            }
            return orderResponse;
        });
        return ResponseEntity.ok(response);
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

        ShippingDetailResponse shippingResponse = null;
        if (order.getShippingDetail() != null) {
            shippingResponse = ShippingDetailResponse.builder()
                    .name(order.getShippingDetail().getName())
                    .phone(order.getShippingDetail().getPhone())
                    .address(order.getShippingDetail().getAddress())
                    .city(order.getShippingDetail().getCity())
                    .paymentMethod(order.getShippingDetail().getPaymentMethod())
                    .build();
        }

        return CreateOrderResponse.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .subtotalAmount(order.getSubtotalAmount())
                .discountAmount(order.getDiscountAmount())
                .shippingFee(order.getShippingFee())
                .totalAmount(order.getTotalAmount())
                .orderStatus(order.getStatus())
                .items(itemResponses)
                .shipping(shippingResponse)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
