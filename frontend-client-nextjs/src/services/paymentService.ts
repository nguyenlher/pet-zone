import { apiFetch } from './apiClient';

export interface PaymentCallbackResult {
  code: string;
  message: string;
  transactionId?: string;
  status?: string;
  success: boolean;
  orderId?: string;
}

export async function verifyVNPayCallback(queryParams: Record<string, string>): Promise<PaymentCallbackResult> {
  const searchParams = new URLSearchParams(queryParams);
  return apiFetch<PaymentCallbackResult>(`/public/payments/callback/VNPAY?${searchParams.toString()}`, {
    method: 'GET',
    cache: 'no-store',
  });
}
