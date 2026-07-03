package com.petstore.petservice.unit.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.AbstractPlatformTransactionManager;
import org.springframework.transaction.support.DefaultTransactionStatus;
import org.springframework.transaction.support.TransactionTemplate;

import com.petstore.petservice.domain.model.Product;
import com.petstore.petservice.domain.model.enums.ProductStatus;
import com.petstore.petservice.domain.repository.ProductRepository;
import com.petstore.petservice.domain.service.ProductService;
import com.petstore.petservice.domain.service.impl.StockReservationServiceImpl;
import com.petstore.petservice.exception.InsufficientStockException;

@ExtendWith(MockitoExtension.class)
class StockReservationConcurrencyTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductService productService;

    @Mock
    private RedissonClient redissonClient;

    @Mock
    private RLock rLock;

    private ReentrantLock reentrantLock;
    private TransactionTemplate transactionTemplate;
    private StockReservationServiceImpl stockReservationService;

    // Tracker for verifying lock is held while transaction commits
    private final AtomicBoolean lockHeldDuringTxCommit = new AtomicBoolean(false);

    @BeforeEach
    void setUp() {
        reentrantLock = new ReentrantLock();

        // Delegate Redisson RLock calls to real ReentrantLock for thread-safe synchronization
        when(redissonClient.getLock(any(String.class))).thenReturn(rLock);

        try {
            when(rLock.tryLock(anyLong(), anyLong(), any(TimeUnit.class)))
                    .thenAnswer(invocation -> {
                        long timeout = invocation.getArgument(0);
                        TimeUnit unit = invocation.getArgument(2);
                        return reentrantLock.tryLock(timeout, unit);
                    });
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        when(rLock.isHeldByCurrentThread()).thenAnswer(invocation -> reentrantLock.isHeldByCurrentThread());

        doAnswer(invocation -> {
            reentrantLock.unlock();
            return null;
        }).when(rLock).unlock();

        // Custom TransactionManager to verify lock is held during transaction commit
        PlatformTransactionManager txManager = new AbstractPlatformTransactionManager() {
            @Override
            protected Object doGetTransaction() {
                return new Object();
            }

            @Override
            protected void doBegin(Object transaction, TransactionDefinition definition) {
            }

            @Override
            protected void doCommit(DefaultTransactionStatus status) {
                // Verify that the distributed lock is still held by the current thread during commit
                if (reentrantLock.isHeldByCurrentThread()) {
                    lockHeldDuringTxCommit.set(true);
                }
            }

            @Override
            protected void doRollback(DefaultTransactionStatus status) {
            }
        };

        transactionTemplate = new TransactionTemplate(txManager);

        stockReservationService = new StockReservationServiceImpl(
                productRepository,
                productService,
                redissonClient,
                transactionTemplate
        );
    }

    @Test
    @DisplayName("P1 Verify: 2 threads concurrently reserve product with stock=1 - exactly 1 succeeds, no race condition, total reserved <= initial stock")
    void reserveStock_concurrentTwoThreads_noRaceCondition() throws Exception {
        UUID productId = UUID.randomUUID();
        int initialStock = 1;
        AtomicInteger remainingStock = new AtomicInteger(initialStock);

        // Atomic decrement behavior: returns 1 affected row if stock >= quantity, else 0
        when(productRepository.decrementStockAtomic(eq(productId), eq(1)))
                .thenAnswer(invocation -> {
                    while (true) {
                        int cur = remainingStock.get();
                        if (cur >= 1) {
                            if (remainingStock.compareAndSet(cur, cur - 1)) {
                                return 1; // 1 row updated
                            }
                        } else {
                            return 0; // out of stock
                        }
                    }
                });

        // When affectedRows == 0, productService is consulted to build exception
        when(productService.getProductById(productId))
                .thenAnswer(invocation -> {
                    Product product = new Product();
                    product.setId(productId);
                    product.setStockQuantity(remainingStock.get());
                    product.setStatus(ProductStatus.AVAILABLE);
                    return product;
                });

        int numThreads = 2;
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        CountDownLatch readyLatch = new CountDownLatch(numThreads);
        CountDownLatch startLatch = new CountDownLatch(1);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger insufficientStockCount = new AtomicInteger(0);
        List<Throwable> exceptions = Collections.synchronizedList(new ArrayList<>());

        List<Future<?>> futures = new ArrayList<>();

        for (int i = 0; i < numThreads; i++) {
            futures.add(executor.submit(() -> {
                readyLatch.countDown();
                try {
                    startLatch.await(); // wait for both threads to be ready
                    stockReservationService.reserveStock(productId, 1);
                    successCount.incrementAndGet();
                } catch (InsufficientStockException e) {
                    insufficientStockCount.incrementAndGet();
                } catch (Throwable t) {
                    exceptions.add(t);
                }
            }));
        }

        // Wait for all threads to be ready, then trigger simultaneous execution
        readyLatch.await(5, TimeUnit.SECONDS);
        startLatch.countDown();

        for (Future<?> f : futures) {
            f.get(5, TimeUnit.SECONDS);
        }

        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);

        // Assertions
        assertThat(exceptions).as("There should be no unexpected exceptions").isEmpty();
        assertThat(successCount.get()).as("Exactly 1 thread must successfully reserve stock").isEqualTo(1);
        assertThat(insufficientStockCount.get()).as("Exactly 1 thread must receive InsufficientStockException").isEqualTo(1);
        assertThat(remainingStock.get()).as("Stock must not drop below 0 (no overselling)").isEqualTo(0);
        assertThat(reentrantLock.isLocked()).as("Lock must be completely unlocked after execution").isFalse();
        assertThat(lockHeldDuringTxCommit.get()).as("Lock must be held while Spring transaction commits").isTrue();
    }

    @Test
    @DisplayName("Verify transaction commits BEFORE lock is released")
    void reserveStock_transactionCommitsBeforeLockRelease() {
        UUID productId = UUID.randomUUID();

        when(productRepository.decrementStockAtomic(eq(productId), eq(2))).thenReturn(1);

        stockReservationService.reserveStock(productId, 2);

        // Verify that during commit, lock was actively held by the executing thread
        assertThat(lockHeldDuringTxCommit.get()).isTrue();
        // And after reserveStock returns, lock is released
        assertThat(reentrantLock.isLocked()).isFalse();
    }
}
