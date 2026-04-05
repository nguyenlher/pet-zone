package com.petstore.paymentservice.utils.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Component
@ConfigurationProperties(prefix = "vnpay")
@Getter
@Setter
public class VNPayProperties {

    private String tmnCode;

    private String hashSecret;

    private String payUrl;

    private String returnUrl;

    private String ipnUrl;

    private String currency;

    private String version;

    private String command;

    private String orderType;

    public String getCurrencyCode() {
        return currency;
    }
}
