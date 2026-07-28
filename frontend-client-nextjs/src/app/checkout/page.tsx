import React from 'react';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { getUserProfile } from '@/services/userService';
import CheckoutClientView from '@/components/checkout/CheckoutClientView';

export const metadata: Metadata = {
  title: 'Thanh toán an toàn | Pet Zone 3D',
  description: 'Hoàn tất thông tin giao hàng và chọn phương thức thanh toán COD hoặc VNPay bảo mật tại Pet Zone 3D.',
};

export default async function CheckoutPage() {
  const session = await auth();
  const accessToken = (session as any)?.accessToken as string | undefined;

  let initialUser: {
    name?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
  } | null = null;

  if (session?.user) {
    initialUser = {
      name: session.user.name || null,
      phone: null,
      address: null,
      city: 'Hồ Chí Minh',
    };

    if (accessToken) {
      try {
        const profile = await getUserProfile(accessToken);
        if (profile) {
          const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
          initialUser = {
            name: fullName || session.user.name || null,
            phone: profile.phone || null,
            address: profile.address || null,
            city: 'Hồ Chí Minh',
          };
        }
      } catch (err) {
        // Fallback gracefully to basic session data if profile fails
        console.warn('Could not fetch user profile for checkout prefill:', err);
      }
    }
  }

  return (
    <main className="min-h-screen bg-white text-black pt-24 md:pt-28 pb-24 relative">
      <CheckoutClientView initialUser={initialUser} accessToken={accessToken || null} />
    </main>
  );
}
