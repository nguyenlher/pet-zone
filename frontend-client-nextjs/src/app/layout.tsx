import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { QuickViewModal } from '@/components/ui/QuickViewModal';
import { ToastNotification } from '@/components/ui/ToastNotification';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pet Zone — Đồ Thú Cưng Thiết Kế & Hữu Cơ Cao Cấp',
  description:
    'Nền tảng thương mại điện tử chuyên cung cấp thức ăn hữu cơ sấy lạnh, bát gốm sứ công thái học 3D và phụ kiện cao cấp cho thú cưng hiện đại.',
  keywords: [
    'pet zone',
    'đồ thú cưng',
    'thức ăn chó mèo hữu cơ',
    'bát gốm 3D',
    'vòng cổ airtag',
    'phụ kiện thú cưng',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${plusJakarta.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-[#FAFAF8] text-[#121316] font-sans antialiased selection:bg-[#D4F442] selection:text-black">
        <AuthProvider>
          <CartProvider>
            <CartDrawer />
            <QuickViewModal />
            <ToastNotification />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
