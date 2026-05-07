package com.petstore.userservice.infra.mapper;

import java.util.Map;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import com.petstore.userservice.api.dto.response.AuthResponse;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AuthMapper {
    
    default AuthResponse toAuthResponse(Map<String, Object> tokenData) {
        if (tokenData == null) {
            return null;
        }
        
        return AuthResponse.builder()
                .accessToken((String) tokenData.get("access_token"))
                .refreshToken((String) tokenData.get("refresh_token"))
                .tokenType((String) tokenData.get("token_type"))
                .expiresIn((Integer) tokenData.get("expires_in"))
                .refreshExpiresIn((Integer) tokenData.get("refresh_expires_in"))
                .build();
    }
}
