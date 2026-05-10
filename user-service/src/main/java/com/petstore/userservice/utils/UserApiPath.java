package com.petstore.userservice.utils;

public class UserApiPath {
    // Base paths for authentication levels
    public static final String AUTH_BASE = "/auth";
    public static final String PUBLIC_BASE = "/public";
    public static final String PRIVATE_BASE = "/private";
    public static final String ME_BASE = "/me";

    // Auth endpoints (no authentication required)
    public static final String AUTH_REGISTER = "/register";
    public static final String AUTH_LOGIN = "/login";
    public static final String AUTH_LOGOUT = "/logout";
    public static final String AUTH_FORGOT_PASSWORD = "/forgot-password";
    public static final String AUTH_RESET_PASSWORD = "/reset-password/{keycloakId}";
    public static final String AUTH_REFRESH = "/refresh";

    // Public User endpoints (JWT authentication required - user-facing)
    public static final String PUBLIC_USER_BASE = "/public/users";
    public static final String USER_PROFILE = "/profile";
    public static final String USER_BY_ID = "/{userId}";

    // Private User endpoints (X-API-Key required - service-to-service)
    public static final String PRIVATE_USER_BASE = "/private/users";

    // Shipping Info
    public static final String SHIPPING_BASE = "/{userId}/shipping-info";
    public static final String SHIPPING_BY_ID = "/{userId}/shipping-info/{infoId}";
    public static final String SHIPPING_SET_DEFAULT = "/{userId}/shipping-info/{infoId}/default";

    // Favorites
    public static final String FAVORITE_BASE = "/favorites";
    public static final String FAVORITE_BY_PET = "/favorites/{petId}";
}
