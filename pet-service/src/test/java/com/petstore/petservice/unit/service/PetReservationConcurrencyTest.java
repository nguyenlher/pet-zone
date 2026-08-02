package com.petstore.petservice.unit.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.locks.ReentrantLock;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.AbstractPlatformTransactionManager;
import org.springframework.transaction.support.DefaultTransactionStatus;
import org.springframework.transaction.support.TransactionTemplate;

import com.petstore.petservice.domain.model.Pet;
import com.petstore.petservice.domain.model.enums.PetStatus;
import com.petstore.petservice.domain.repository.PetRepository;
import com.petstore.petservice.domain.service.impl.PetReservationServiceImpl;
import com.petstore.petservice.exception.PetNotAvailableException;

@ExtendWith(MockitoExtension.class)
class PetReservationConcurrencyTest {

    @Mock
    private PetRepository petRepository;

    @Mock
    private RedissonClient redissonClient;

    @Mock
    private RLock rLock;

    private ReentrantLock reentrantLock;
    private TransactionTemplate transactionTemplate;
    private PetReservationServiceImpl petReservationService;

    private final AtomicBoolean lockHeldDuringTxCommit = new AtomicBoolean(false);

    @BeforeEach
    void setUp() {
        reentrantLock = new ReentrantLock();

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
                if (reentrantLock.isHeldByCurrentThread()) {
                    lockHeldDuringTxCommit.set(true);
                }
            }

            @Override
            protected void doRollback(DefaultTransactionStatus status) {
            }
        };

        transactionTemplate = new TransactionTemplate(txManager);

        petReservationService = new PetReservationServiceImpl(
                petRepository,
                redissonClient,
                transactionTemplate
        );
    }

    @Test
    @DisplayName("Verify concurrent reservation for the same Pet: exactly 1 succeeds, 1 fails with PetNotAvailableException (prevents Double Booking)")
    void reservePet_concurrentTwoThreads_preventsDoubleBooking() throws Exception {
        UUID petId = UUID.randomUUID();
        AtomicReference<PetStatus> petStatus = new AtomicReference<>(PetStatus.AVAILABLE);

        when(petRepository.reservePetAtomic(eq(petId)))
                .thenAnswer(invocation -> {
                    if (petStatus.compareAndSet(PetStatus.AVAILABLE, PetStatus.RESERVED)) {
                        return 1; // reserved successfully
                    }
                    return 0; // already reserved
                });

        when(petRepository.findById(eq(petId)))
                .thenAnswer(invocation -> Optional.of(
                        Pet.builder()
                                .id(petId)
                                .name("Milo")
                                .status(petStatus.get())
                                .build()
                ));

        int numThreads = 2;
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(numThreads);

        List<Throwable> exceptions = Collections.synchronizedList(new ArrayList<>());
        List<Future<?>> futures = new ArrayList<>();

        for (int i = 0; i < numThreads; i++) {
            futures.add(executor.submit(() -> {
                try {
                    startLatch.await();
                    petReservationService.reservePet(petId);
                } catch (Throwable t) {
                    exceptions.add(t);
                } finally {
                    doneLatch.countDown();
                }
            }));
        }

        startLatch.countDown();
        boolean completed = doneLatch.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        assertThat(completed).isTrue();
        assertThat(exceptions).hasSize(1);
        assertThat(exceptions.get(0)).isInstanceOf(PetNotAvailableException.class);
        assertThat(petStatus.get()).isEqualTo(PetStatus.RESERVED);
    }

    @Test
    @DisplayName("Verify restorePet executes atomic restoration from RESERVED to AVAILABLE")
    void restorePet_success() {
        UUID petId = UUID.randomUUID();
        when(petRepository.restorePetAtomic(eq(petId))).thenReturn(1);

        petReservationService.restorePet(petId);

        verify(petRepository).restorePetAtomic(petId);
    }

    @Test
    @DisplayName("Verify confirmPetSold executes atomic status transition to SOLD")
    void confirmPetSold_success() {
        UUID petId = UUID.randomUUID();
        when(petRepository.confirmPetSoldAtomic(eq(petId))).thenReturn(1);

        petReservationService.confirmPetSold(petId);

        verify(petRepository).confirmPetSoldAtomic(petId);
    }

    @Test
    @DisplayName("Verify reservePet throws PetNotAvailableException when pet is already SOLD")
    void reservePet_alreadySold_throwsException() {
        UUID petId = UUID.randomUUID();

        when(petRepository.reservePetAtomic(eq(petId))).thenReturn(0);
        when(petRepository.findById(eq(petId))).thenReturn(Optional.of(
                Pet.builder()
                        .id(petId)
                        .name("Buddy")
                        .status(PetStatus.SOLD)
                        .build()
        ));

        assertThatThrownBy(() -> petReservationService.reservePet(petId))
                .isInstanceOf(PetNotAvailableException.class)
                .hasMessageContaining("Pet is not available for purchase");
    }
}
