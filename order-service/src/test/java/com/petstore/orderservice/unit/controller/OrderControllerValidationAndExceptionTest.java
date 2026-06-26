package com.petstore.orderservice.unit.controller;

import java.util.UUID;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.notNullValue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.petstore.orderservice.api.controller.publ.OrderController;
import com.petstore.orderservice.domain.service.OrderService;
import com.petstore.orderservice.exception.GlobalExceptionHandler;
import com.petstore.orderservice.exception.OrderNotFoundException;
import com.petstore.orderservice.infra.client.PaymentClient;
import com.petstore.orderservice.infra.client.UserClient;
import com.petstore.orderservice.utils.apipaths.OrderApiPath;

@ExtendWith(MockitoExtension.class)
class OrderControllerValidationAndExceptionTest {

    private MockMvc mockMvc;

    @Mock
    private OrderService orderService;

    @Mock
    private PaymentClient paymentClient;

    @Mock
    private UserClient userClient;

    @BeforeEach
    void setUp() {
        OrderController orderController = new OrderController(orderService, paymentClient, userClient);
        mockMvc = MockMvcBuilders.standaloneSetup(orderController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("P1 Verify Bug 4: createOrder with empty payload returns 400 with clear validation error messages instead of 500")
    void createOrder_emptyPayload_returns400BadRequest() throws Exception {
        mockMvc.perform(post(OrderApiPath.ORDER_BASE + OrderApiPath.ORDER_CREATE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors.items").value("Items list cannot be empty"))
                .andExpect(jsonPath("$.errors.shipping").value("Shipping details are required"));
    }

    @Test
    @DisplayName("P1 Verify Bug 4: createOrder with invalid item and shipping fields returns 400 Bad Request with field errors")
    void createOrder_invalidNestedFields_returns400BadRequest() throws Exception {
        String invalidPayload = """
                {
                    "items": [
                        {
                            "itemType": null,
                            "itemId": null,
                            "quantity": 0
                        }
                    ],
                    "shipping": {
                        "name": "",
                        "phone": "",
                        "address": "",
                        "city": "",
                        "paymentMethod": ""
                    }
                }
                """;

        mockMvc.perform(post(OrderApiPath.ORDER_BASE + OrderApiPath.ORDER_CREATE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors", notNullValue()));
    }

    @Test
    @DisplayName("P1 Verify Bug 4: cancelOrder with non-existent ID returns 404 Not Found instead of 500")
    void cancelOrder_nonExistentId_returns404NotFound() throws Exception {
        UUID nonExistentId = UUID.randomUUID();
        when(orderService.cancelOrder(any(UUID.class), any()))
                .thenThrow(new OrderNotFoundException("Order not found with id: " + nonExistentId));

        String requestJson = String.format("""
                {
                    "orderId": "%s",
                    "reason": "Customer request"
                }
                """, nonExistentId);

        mockMvc.perform(post(OrderApiPath.ORDER_BASE + OrderApiPath.ORDER_CANCEL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message", containsString("Order not found with id: " + nonExistentId)));
    }

    @Test
    @DisplayName("P1 Verify Bug 4: cancelOrder with empty payload (missing orderId) returns 400 Bad Request instead of 500")
    void cancelOrder_emptyPayload_returns400BadRequest() throws Exception {
        mockMvc.perform(post(OrderApiPath.ORDER_BASE + OrderApiPath.ORDER_CANCEL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors.orderId").value("Order ID is required"));
    }

    @Test
    @DisplayName("P1 Verify Bug 4: cancelOrder on already confirmed or cancelled order returns 400 Bad Request instead of 500")
    void cancelOrder_invalidState_returns400BadRequest() throws Exception {
        UUID orderId = UUID.randomUUID();
        when(orderService.cancelOrder(any(UUID.class), any()))
                .thenThrow(new IllegalStateException("Cannot cancel confirmed order: " + orderId));

        String requestJson = String.format("""
                {
                    "orderId": "%s",
                    "reason": "Late request"
                }
                """, orderId);

        mockMvc.perform(post(OrderApiPath.ORDER_BASE + OrderApiPath.ORDER_CANCEL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message", containsString("Cannot cancel confirmed order")));
    }
}
