package com.petstore.orderservice.unit.domain.service;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InOrder;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import com.petstore.orderservice.api.dto.ProductDTO;
import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.model.OrderItem;
import com.petstore.orderservice.domain.model.OrderShippingDetail;
import com.petstore.orderservice.domain.model.enums.ItemType;
import com.petstore.orderservice.domain.model.enums.OrderStatus;
import com.petstore.orderservice.domain.publisher.OrderPublisher;
import com.petstore.orderservice.domain.repository.OrderRepository;
import com.petstore.orderservice.domain.service.OrderPersistenceService;
import com.petstore.orderservice.domain.service.impl.OrderServiceImpl;
import com.petstore.orderservice.exception.InsufficientStockException;
import com.petstore.orderservice.infra.client.PetServiceClient;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private PetServiceClient petServiceClient;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderPersistenceService orderPersistenceService;

    @Mock
    private OrderPublisher orderPublisher;

    private OrderServiceImpl orderService;

    private UUID userId;
    private UUID productAId;
    private UUID productBId;
    private UUID productCId;
    private OrderShippingDetail shippingDetail;

    @BeforeEach
    void setUp() {
        orderService = new OrderServiceImpl(
                petServiceClient,
                orderRepository,
                orderPersistenceService,
                orderPublisher
        );

        userId = UUID.randomUUID();
        productAId = UUID.randomUUID();
        productBId = UUID.randomUUID();
        productCId = UUID.randomUUID();

        shippingDetail = OrderShippingDetail.builder()
                .name("John Doe")
                .phone("0912345678")
                .address("123 Main St")
                .city("HCM")
                .paymentMethod("vnpay")
                .build();
    }

    private List<OrderItem> createThreeItems() {
        return List.of(
                OrderItem.builder()
                        .itemType(ItemType.PRODUCT)
                        .itemId(productAId)
                        .quantity(2)
                        .build(),
                OrderItem.builder()
                        .itemType(ItemType.PRODUCT)
                        .itemId(productBId)
                        .quantity(5)
                        .build(),
                OrderItem.builder()
                        .itemType(ItemType.PRODUCT)
                        .itemId(productCId)
                        .quantity(1)
                        .build()
        );
    }

    private void mockProductsMetadata() {
        when(petServiceClient.getProductById(productAId)).thenReturn(
                ProductDTO.builder().id(productAId).name("Product A").price(100.0).build()
        );
        when(petServiceClient.getProductById(productBId)).thenReturn(
                ProductDTO.builder().id(productBId).name("Product B").price(50.0).build()
        );
        when(petServiceClient.getProductById(productCId)).thenReturn(
                ProductDTO.builder().id(productCId).name("Product C").price(30.0).build()
        );
    }

    @Test
    @DisplayName("P0-Bug3: When 3rd item is out of stock, items 1 and 2 must be rolled back (compensating action) with exact quantities")
    void createOrder_partialStockFailure_triggersCompensatingRollback() {
        // Arrange
        mockProductsMetadata();
        List<OrderItem> items = createThreeItems();

        // Product A and B succeed, Product C fails
        doNothing().when(petServiceClient).reserveStock(productAId, 2);
        doNothing().when(petServiceClient).reserveStock(productBId, 5);
        doThrow(new InsufficientStockException("Product C is out of stock"))
                .when(petServiceClient).reserveStock(productCId, 1);

        // Act & Assert
        assertThatThrownBy(() -> orderService.createOrder(userId, items, shippingDetail, null))
                .isInstanceOf(InsufficientStockException.class)
                .hasMessageContaining("Product C is out of stock");

        // Verify compensating rollback: Item 1 and 2 restored with exact quantities
        InOrder inOrder = inOrder(petServiceClient);
        inOrder.verify(petServiceClient).reserveStock(productAId, 2);
        inOrder.verify(petServiceClient).reserveStock(productBId, 5);
        inOrder.verify(petServiceClient).reserveStock(productCId, 1);
        inOrder.verify(petServiceClient).restoreStock(productAId, 2);
        inOrder.verify(petServiceClient).restoreStock(productBId, 5);

        // Product C was never reserved, so it must NEVER be restored
        verify(petServiceClient, never()).restoreStock(eq(productCId), any());

        // Database and Kafka must NEVER be called
        verify(orderPersistenceService, never()).saveOrder(any());
        verify(orderPublisher, never()).publishOrderCreated(any());
    }

    @Test
    @DisplayName("P0-Bug3: When database save fails, all 3 previously reserved items must be rolled back (compensating action)")
    void createOrder_databaseSaveFailure_triggersFullCompensatingRollback() {
        // Arrange
        mockProductsMetadata();
        List<OrderItem> items = createThreeItems();

        // All 3 items successfully reserved
        doNothing().when(petServiceClient).reserveStock(productAId, 2);
        doNothing().when(petServiceClient).reserveStock(productBId, 5);
        doNothing().when(petServiceClient).reserveStock(productCId, 1);

        // Database persistence throws exception (e.g., DB error, constraint violation)
        when(orderPersistenceService.saveOrder(any(Order.class)))
                .thenThrow(new DataIntegrityViolationException("Database constraint violation"));

        // Act & Assert
        assertThatThrownBy(() -> orderService.createOrder(userId, items, shippingDetail, null))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("Database constraint violation");

        // Verify full compensating rollback: all 3 items restored
        verify(petServiceClient).restoreStock(productAId, 2);
        verify(petServiceClient).restoreStock(productBId, 5);
        verify(petServiceClient).restoreStock(productCId, 1);

        // Kafka event must NEVER be published when order save fails
        verify(orderPublisher, never()).publishOrderCreated(any());
    }

    @Test
    @DisplayName("P0-Bug3: When all items succeed and DB persists, order is created and published without rollback")
    void createOrder_success_persistsAndPublishesWithoutRollback() {
        // Arrange
        mockProductsMetadata();
        List<OrderItem> items = createThreeItems();

        doNothing().when(petServiceClient).reserveStock(productAId, 2);
        doNothing().when(petServiceClient).reserveStock(productBId, 5);
        doNothing().when(petServiceClient).reserveStock(productCId, 1);

        UUID savedOrderId = UUID.randomUUID();
        when(orderPersistenceService.saveOrder(any(Order.class))).thenAnswer(invocation -> {
            Order orderArg = invocation.getArgument(0);
            return Order.builder()
                    .id(savedOrderId)
                    .userId(orderArg.getUserId())
                    .items(orderArg.getItems())
                    .shippingDetail(orderArg.getShippingDetail())
                    .subtotalAmount(orderArg.getSubtotalAmount())
                    .totalAmount(orderArg.getTotalAmount())
                    .status(orderArg.getStatus())
                    .build();
        });

        // Act
        Order result = orderService.createOrder(userId, items, shippingDetail, null);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(savedOrderId);
        assertThat(result.getStatus()).isEqualTo(OrderStatus.PENDING_PAYMENT);

        // Verify stock was reserved, no rollback occurred
        verify(petServiceClient).reserveStock(productAId, 2);
        verify(petServiceClient).reserveStock(productBId, 5);
        verify(petServiceClient).reserveStock(productCId, 1);
        verify(petServiceClient, never()).restoreStock(any(), any());

        // Verify DB persistence and Kafka publishing occurred
        verify(orderPersistenceService).saveOrder(any(Order.class));
        verify(orderPublisher).publishOrderCreated(any(Order.class));
    }
}
