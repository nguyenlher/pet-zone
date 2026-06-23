import { apiFetch } from './apiClient';
import { CreateOrderPayload, Order, PaginatedResult } from '@/types';

export interface SpringPageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function createOrder(payload: CreateOrderPayload, token?: string): Promise<Order> {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return apiFetch<Order>('/public/order/create', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
}

export async function getOrderById(orderId: string, token?: string): Promise<Order> {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return apiFetch<Order>(`/public/order/${orderId}`, {
    method: 'GET',
    headers,
    cache: 'no-store',
  });
}

export async function getUserOrders(
  page: number = 0,
  size: number = 10,
  token: string
): Promise<PaginatedResult<Order>> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiFetch<SpringPageResponse<Order>>(
    `/public/order/user?page=${page}&size=${size}&sort=createdAt,desc`,
    {
      method: 'GET',
      headers,
      cache: 'no-store',
    }
  );

  return {
    items: response.content || [],
    totalElements: response.totalElements || 0,
    totalPages: response.totalPages || 0,
    page: response.number || 0,
    size: response.size || size,
  };
}
