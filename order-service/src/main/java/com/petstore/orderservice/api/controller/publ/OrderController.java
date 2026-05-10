package com.petstore.orderservice.api.controller.publ;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.orderservice.api.dto.UserDTO;
import com.petstore.orderservice.api.dto.request.CancelOrderRequest;
import com.petstore.orderservice.api.dto.request.CreateOrderRequest;
import com.petstore.orderservice.api.dto.response.CancelOrderResponse;
import com.petstore.orderservice.api.dto.response.CreateOrderResponse;
import com.petstore.orderservice.api.dto.response.OrderItemResponse;
import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.model.OrderItem;
import com.petstore.orderservice.domain.model.OrderShippingDetail;
import com.petstore.orderservice.domain.service.OrderService;
import com.petstore.orderservice.infra.client.PaymentClient;
import com.petstore.orderservice.infra.client.UserClient;
import com.petstore.orderservice.utils.apipaths.OrderApiPath;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(OrderApiPath.ORDER_BASE)
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final PaymentClient paymentClient;
    private final UserClient userClient;

    @PostMapping(OrderApiPath.ORDER_CREATE)
    public ResponseEntity<CreateOrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        List<OrderItem> items = request.getItems().stream()
                .map(item -> OrderItem.builder()
                        .petId(item.getPetId())
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

        Order order = orderService.createOrder(request.getUserId(), items, shippingDetail, request.getDiscountCode());

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

    @GetMapping
    public ResponseEntity<Page<CreateOrderResponse>> getAllOrders(Pageable pageable) {
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
                        .id(item.getPetId())
                        .name(item.getPetName())
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
