import { apiFetch } from './apiClient';

export interface UserProfile {
  id: string;
  keycloakId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

export async function getUserProfile(token: string): Promise<UserProfile> {
  return apiFetch<UserProfile>('/me/profile', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
}
