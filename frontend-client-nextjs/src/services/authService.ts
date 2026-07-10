import { apiFetch } from './apiClient';

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthMessageResponse {
  message: string;
  success: boolean;
}

export const authService = {
  /**
   * Registers a new user via API Gateway -> user-service -> Keycloak & user_db
   */
  async register(data: RegisterRequest): Promise<AuthMessageResponse> {
    return apiFetch<AuthMessageResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Triggers forgot password email via API Gateway -> user-service -> Keycloak
   */
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return apiFetch<ForgotPasswordResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim() }),
    });
  },
};
