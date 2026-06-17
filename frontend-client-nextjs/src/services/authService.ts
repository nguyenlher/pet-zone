import { apiFetch } from './apiClient';

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export const authService = {
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
