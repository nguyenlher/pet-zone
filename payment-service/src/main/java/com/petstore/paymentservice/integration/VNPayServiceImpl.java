package com.petstore.paymentservice.integration;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TimeZone;
import java.util.TreeMap;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petstore.paymentservice.dto.request.CreatePaymentRequest;
import com.petstore.paymentservice.dto.response.PaymentCallbackResponse;
import com.petstore.paymentservice.dto.response.PaymentResponse;
import com.petstore.paymentservice.client.OrderClient;
import com.petstore.paymentservice.client.OrderInfo;
import com.petstore.paymentservice.model.Payment;
import com.petstore.paymentservice.model.enums.PaymentMethod;
import com.petstore.paymentservice.model.enums.PaymentStatus;
import com.petstore.paymentservice.publisher.PaymentPublisher;
import com.petstore.paymentservice.publisher.event.SendNotificationEvent;
import com.petstore.paymentservice.repository.PaymentRepository;
import com.petstore.paymentservice.service.strategy.PaymentStrategy;
import com.petstore.paymentservice.utils.properties.VNPayProperties;
import com.petstore.paymentservice.utils.vnpay.VNPayUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class VNPayServiceImpl implements PaymentStrategy {

    private final VNPayProperties vnPayConfig;
    private final PaymentRepository paymentRepository;
    private final OrderClient orderClient;
    private final PaymentPublisher paymentPublisher;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public PaymentMethod getPaymentMethod() {
        return PaymentMethod.VNPAY;
    }

    @Override
    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request, String ipAddress) {
        Optional<PaymentResponse> existing = resolveExistingPayment(request.getOrderId());
        if (existing.isPresent())
            return existing.get();

        OrderInfo order = orderClient.getOrder(request.getOrderId());

        String txnRef = VNPayUtils.getRandomTxnRef(8);
        long amount = (long) (order.totalAmount() * 100);

        Map<String, String> vnpParams = new TreeMap<>();
        vnpParams.put("vnp_Version", vnPayConfig.getVersion());
        vnpParams.put("vnp_Command", vnPayConfig.getCommand());
        vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(amount));
        vnpParams.put("vnp_CurrCode", vnPayConfig.getCurrencyCode());
        vnpParams.put("vnp_TxnRef", txnRef);
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang: " + order.id());
        vnpParams.put("vnp_OrderType", vnPayConfig.getOrderType());
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnpParams.put("vnp_IpAddr", ipAddress);
        vnpParams.put("vnp_BankCode", "NCB");

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnpParams.put("vnp_CreateDate", formatter.format(cld.getTime()));
        cld.add(Calendar.MINUTE, 15);
        vnpParams.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<Map.Entry<String, String>> itr = vnpParams.entrySet().iterator();
        while (itr.hasNext()) {
            Map.Entry<String, String> entry = itr.next();
            String fieldValue = entry.getValue();
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(entry.getKey()).append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII))
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String secureHash = VNPayUtils.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        String paymentUrl = vnPayConfig.getPayUrl() + "?" + query + "&vnp_SecureHash=" + secureHash;

        Payment payment = Payment.builder()
                .orderId(order.id())
                .userId(order.userId())
                .transactionId(txnRef)
                .amount(order.totalAmount())
                .paymentMethod(PaymentMethod.VNPAY)
                .status(PaymentStatus.PENDING)
                .expiredAt(LocalDateTime.now().plusMinutes(15))
                .createdAt(LocalDateTime.now())
                .build();

        Payment saved = paymentRepository.save(payment);

        return PaymentResponse.builder()
                .id(saved.getId())
                .orderId(order.id())
                .paymentUrl(paymentUrl)
                .status(PaymentStatus.PENDING)
                .build();
    }

    @Override
    @Transactional
    public PaymentCallbackResponse handleReturn(Map<String, String> params) {
        String vnpSecureHash = params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (fieldNames.indexOf(fieldName) < fieldNames.size() - 1) {
                    hashData.append('&');
                }
            }
        }

        if (!VNPayUtils.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString()).equals(vnpSecureHash)) {
            throw new IllegalArgumentException("Invalid secure hash");
        }

        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionNo = params.get("vnp_TransactionNo");

        Payment payment = paymentRepository.findByTransactionId(txnRef)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + txnRef));

        Optional<PaymentCallbackResponse> validation = validatePaymentForCallback(payment, transactionNo);
        if (validation.isPresent())
            return validation.get();

        PaymentStatus newStatus = "00".equals(responseCode) ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;
        payment.setStatus(newStatus);
        payment.setUpdatedAt(LocalDateTime.now());
        Payment saved = paymentRepository.save(payment);

        try {
            if (newStatus == PaymentStatus.SUCCESS) {
                paymentPublisher.publishPaymentSucceeded(saved);
                eventPublisher.publishEvent(new SendNotificationEvent(saved.getUserId()));
            } else {
                paymentPublisher.publishPaymentFailed(saved, "VNPay responseCode=" + responseCode);
            }
        } catch (Exception e) {
            log.error("Failed to publish payment event", e);
        }

        return PaymentCallbackResponse.builder()
                .code(responseCode)
                .message("00".equals(responseCode) ? "Payment successful" : "Payment failed")
                .transactionId(transactionNo)
                .status(newStatus.name())
                .build();
    }

    private Optional<PaymentResponse> resolveExistingPayment(UUID orderId) {
        return paymentRepository.findByOrderId(orderId).map(existing -> {
            if (existing.getStatus() == PaymentStatus.SUCCESS) {
                throw new IllegalStateException("Payment already exists for order: " + orderId);
            }
            if (existing.getStatus() == PaymentStatus.PENDING
                    && existing.getExpiredAt() != null
                    && existing.getExpiredAt().isAfter(LocalDateTime.now())) {
                return PaymentResponse.builder()
                        .id(existing.getId())
                        .orderId(existing.getOrderId())
                        .paymentUrl(vnPayConfig.getPayUrl() + "?vnp_TxnRef=" + existing.getTransactionId())
                        .status(existing.getStatus())
                        .build();
            }
            existing.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(existing);
            return null;
        });
    }

    private Optional<PaymentCallbackResponse> validatePaymentForCallback(Payment payment, String transactionNo) {
        if (payment.getStatus() != PaymentStatus.PENDING) {
            return Optional.of(PaymentCallbackResponse.builder()
                    .code("99").message("Payment already processed")
                    .transactionId(transactionNo).status(payment.getStatus().name()).build());
        }
        if (payment.getExpiredAt() != null && payment.getExpiredAt().isBefore(LocalDateTime.now())) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setUpdatedAt(LocalDateTime.now());
            Payment saved = paymentRepository.save(payment);
            try {
                paymentPublisher.publishPaymentFailed(saved, "Payment expired");
            } catch (Exception e) {
                log.error("Failed to publish expired payment event", e);
            }
            return Optional.of(PaymentCallbackResponse.builder()
                    .code("99").message("Payment expired")
                    .transactionId(transactionNo).status(PaymentStatus.FAILED.name()).build());
        }
        return Optional.empty();
    }
}
