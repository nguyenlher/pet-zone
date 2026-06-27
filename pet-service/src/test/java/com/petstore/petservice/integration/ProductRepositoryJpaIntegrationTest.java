package com.petstore.petservice.integration;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.petstore.petservice.domain.model.enums.ProductCategory;
import com.petstore.petservice.domain.model.enums.ProductStatus;
import com.petstore.petservice.infra.entity.ProductEntity;
import com.petstore.petservice.infra.repository.jpa.JpaProductRepository;

import jakarta.persistence.EntityManager;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ProductRepositoryJpaIntegrationTest {

    @Autowired
    private JpaProductRepository jpaProductRepository;

    @Autowired
    private EntityManager entityManager;

    private UUID testProductId;

    @BeforeEach
    void setUp() {
        // Create a real test product in PostgreSQL
        ProductEntity product = ProductEntity.builder()
                .name("Integration Test Product - Dog Chew")
                .brand("TestBrand")
                .category(ProductCategory.FOOD)
                .price(BigDecimal.valueOf(150000.00))
                .stockQuantity(10)
                .soldCount(0)
                .status(ProductStatus.AVAILABLE)
                .description("A test product for verifying JPQL enum comparisons on PostgreSQL")
                .build();

        ProductEntity saved = jpaProductRepository.saveAndFlush(product);
        testProductId = saved.getId();
        entityManager.clear(); // Clear persistence context so queries hit real DB
    }

    @AfterEach
    void tearDown() {
        if (testProductId != null) {
            jpaProductRepository.findById(testProductId).ifPresent(p -> {
                jpaProductRepository.delete(p);
                jpaProductRepository.flush();
            });
        }
    }

    @Test
    @DisplayName("P1 Verify Bug 5: decrementStockAtomic with fully-qualified enum runs on real PostgreSQL without translation warning or error")
    void decrementStockAtomic_success_withEnumStatus() {
        int quantityToReserve = 3;

        // Call atomic decrement query
        int affectedRows = jpaProductRepository.decrementStockAtomic(testProductId, quantityToReserve);

        assertThat(affectedRows).as("Exactly 1 row should be updated").isEqualTo(1);

        entityManager.clear();

        Optional<ProductEntity> updatedOpt = jpaProductRepository.findById(testProductId);
        assertThat(updatedOpt).isPresent();

        ProductEntity updated = updatedOpt.get();
        assertThat(updated.getStockQuantity()).as("Stock should be decremented from 10 to 7").isEqualTo(7);
        assertThat(updated.getSoldCount()).as("Sold count should be incremented from 0 to 3").isEqualTo(3);
        assertThat(updated.getStatus()).as("Status must remain AVAILABLE").isEqualTo(ProductStatus.AVAILABLE);
    }

    @Test
    @DisplayName("P1 Verify Bug 5: decrementStockAtomic fails when quantity exceeds stock")
    void decrementStockAtomic_failsWhenQuantityExceedsStock() {
        int excessiveQuantity = 999;

        int affectedRows = jpaProductRepository.decrementStockAtomic(testProductId, excessiveQuantity);

        assertThat(affectedRows).as("0 rows should be updated due to stockQuantity < quantity").isEqualTo(0);

        entityManager.clear();

        ProductEntity unchanged = jpaProductRepository.findById(testProductId).orElseThrow();
        assertThat(unchanged.getStockQuantity()).isEqualTo(10);
        assertThat(unchanged.getSoldCount()).isEqualTo(0);
    }

    @Test
    @DisplayName("P1 Verify Bug 5: restoreStockAtomic with fully-qualified enum restores stock and updates status in real PostgreSQL")
    void restoreStockAtomic_success_withEnumStatus() {
        // First decrement 4 units
        jpaProductRepository.decrementStockAtomic(testProductId, 4);
        entityManager.clear();

        // Then restore 4 units
        int affectedRows = jpaProductRepository.restoreStockAtomic(testProductId, 4);
        assertThat(affectedRows).as("1 row should be updated on restore").isEqualTo(1);

        entityManager.clear();

        ProductEntity restored = jpaProductRepository.findById(testProductId).orElseThrow();
        assertThat(restored.getStockQuantity()).as("Stock should be restored back to 10").isEqualTo(10);
        assertThat(restored.getSoldCount()).as("Sold count should be restored back to 0").isEqualTo(0);
        assertThat(restored.getStatus()).as("Status should be AVAILABLE").isEqualTo(ProductStatus.AVAILABLE);
    }

    @Test
    @DisplayName("P1 Verify Bug 5: decrementStockAtomic does not update if product status is OUT_OF_STOCK")
    void decrementStockAtomic_failsWhenProductNotAvailable() {
        // Change product status to OUT_OF_STOCK directly
        ProductEntity product = jpaProductRepository.findById(testProductId).orElseThrow();
        product.setStatus(ProductStatus.OUT_OF_STOCK);
        jpaProductRepository.saveAndFlush(product);
        entityManager.clear();

        // Attempt decrement when status != AVAILABLE
        int affectedRows = jpaProductRepository.decrementStockAtomic(testProductId, 1);
        assertThat(affectedRows).as("0 rows should be updated because status is OUT_OF_STOCK").isEqualTo(0);

        // Verify restoreStockAtomic restores it back to AVAILABLE when stock becomes > 0
        int restoreAffected = jpaProductRepository.restoreStockAtomic(testProductId, 5);
        assertThat(restoreAffected).isEqualTo(1);

        entityManager.clear();
        ProductEntity recovered = jpaProductRepository.findById(testProductId).orElseThrow();
        assertThat(recovered.getStatus()).as("Restoring stock > 0 should switch status to AVAILABLE via CASE WHEN enum").isEqualTo(ProductStatus.AVAILABLE);
    }
}
