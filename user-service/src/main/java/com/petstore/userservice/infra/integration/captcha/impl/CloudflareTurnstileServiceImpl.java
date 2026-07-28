package com.petstore.userservice.infra.integration.captcha.impl;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.petstore.userservice.api.dto.request.TurnstileVerifyRequest;
import com.petstore.userservice.api.dto.response.TurnstileVerifyResponse;
import com.petstore.userservice.infra.integration.captcha.CaptchaService;
import com.petstore.userservice.utils.properties.CaptchaProperties;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Cloudflare Turnstile implementation of CaptchaService.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CloudflareTurnstileServiceImpl implements CaptchaService {

    private final CaptchaProperties captchaProperties;
    private final RestClient restClient;

    @Override
    public boolean verify(String token, String remoteIp) {
        if (!captchaProperties.isEnabled()) {
            log.debug("Captcha verification is disabled via configuration. Bypassing check.");
            return true;
        }

        if (!StringUtils.hasText(token)) {
            log.warn("Captcha verification rejected: token is null or empty.");
            return false;
        }

        try {
            TurnstileVerifyRequest request = TurnstileVerifyRequest.builder()
                    .secret(captchaProperties.getSecretKey())
                    .response(token)
                    .remoteip(StringUtils.hasText(remoteIp) ? remoteIp : null)
                    .build();

            TurnstileVerifyResponse response = restClient.post()
                    .uri(captchaProperties.getVerifyUrl())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(TurnstileVerifyResponse.class);

            if (response != null && response.isSuccess()) {
                log.debug("Captcha verification succeeded for challengeTs: {}", response.getChallengeTs());
                return true;
            }

            log.warn("Captcha verification failed. Error codes: {}", 
                    response != null ? response.getErrorCodes() : "null response");
            return false;
        } catch (RestClientException ex) {
            log.error("Error communicating with Cloudflare Turnstile verification API: {}", ex.getMessage(), ex);
            return false;
        } catch (Exception ex) {
            log.error("Unexpected error during captcha verification: {}", ex.getMessage(), ex);
            return false;
        }
    }
}
