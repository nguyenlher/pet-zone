// src/utils/jwtUtils.js

/**
 * Decode JWT token without verification (client-side only)
 * @param {string} token - JWT token
 * @returns {object} Decoded payload
 */
export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Get roles from JWT token
 * @param {string} token - JWT access token
 * @returns {string[]} Array of roles
 */
export const getRolesFromToken = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return [];

  // Keycloak stores roles in different places depending on configuration
  // Check realm_access.roles first (realm roles)
  const realmRoles = decoded.realm_access?.roles || [];
  
  // Check resource_access for client-specific roles
  const clientRoles = [];
  if (decoded.resource_access) {
    Object.values(decoded.resource_access).forEach((client) => {
      if (client.roles) {
        clientRoles.push(...client.roles);
      }
    });
  }

  // Combine and deduplicate
  return [...new Set([...realmRoles, ...clientRoles])];
};

/**
 * Check if user has specific role
 * @param {string} token - JWT access token
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export const hasRole = (token, role) => {
  const roles = getRolesFromToken(token);
  return roles.includes(role);
};

/**
 * Check if user has ADMIN role
 * @param {string} token - JWT access token
 * @returns {boolean}
 */
export const isAdmin = (token) => {
  return hasRole(token, 'ADMIN');
};

/**
 * Get user info from JWT token
 * @param {string} token - JWT access token
 * @returns {object} User info
 */
export const getUserInfoFromToken = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  return {
    sub: decoded.sub,
    email: decoded.email,
    name: decoded.name,
    preferred_username: decoded.preferred_username,
    given_name: decoded.given_name,
    family_name: decoded.family_name,
    roles: getRolesFromToken(token),
  };
};

/**
 * Check if token is expired
 * @param {string} token - JWT access token
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};
