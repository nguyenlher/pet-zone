package com.petstore.userservice.utils;

public class UserApiPath {
    // Auth
    public static final String AUTH_BASE = "/api/auth";
    public static final String AUTH_REGISTER = "/register";
    public static final String AUTH_LOGIN = "/login";
    public static final String AUTH_LOGOUT = "/logout";
    public static final String AUTH_FORGOT_PASSWORD = "/forgot-password";
    public static final String AUTH_RESET_PASSWORD = "/reset-password/{keycloakId}";
    public static final String AUTH_REFRESH = "/refresh";

    // Public User APIs (no authentication required)
    public static final String PUBLIC_USER_BASE = "/api/public/users";

    // Private User APIs (authentication required)
    public static final String PRIVATE_USER_BASE = "/api/private/users";

    // Legacy User paths (deprecated - use PUBLIC or PRIVATE instead)
    @Deprecated
    public static final String USER_BASE = "/api/user";
    @Deprecated
    public static final String USER_PROFILE = "/profile";
    @Deprecated
    public static final String USER_BY_ID = "/{userId}";

    // Shipping Info
    public static final String SHIPPING_BASE = "/{userId}/shipping-info";
    public static final String SHIPPING_BY_ID = "/{userId}/shipping-info/{infoId}";
    public static final String SHIPPING_SET_DEFAULT = "/{userId}/shipping-info/{infoId}/default";

    // Favorites
    public static final String FAVORITE_BASE = "/{userId}/favorites";
}
