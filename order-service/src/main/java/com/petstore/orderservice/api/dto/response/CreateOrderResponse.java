package com.petstore.orderservice.api.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.petstore.orderservice.api.dto.UserDTO;
import com.petstore.orderservice.domain.model.enums.OrderStatus;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateOrderResponse {
    UUID orderId;
    UUID userId;
    UserDTO user;  // Thông tin chi tiết của user
    double subtotalAmount;
    double discountAmount;
    double shippingFee;
    double totalAmount;
    OrderStatus orderStatus;
    List<OrderItemResponse> items;
    String paymentUrl;  // URL thanh toán VNPay (nếu có)
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
