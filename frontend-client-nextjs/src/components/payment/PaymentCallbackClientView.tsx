'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, AlertTriangle, Package, PhoneCall } from 'lucide-react';

interface PaymentCallbackClientViewProps {
  result: {
    success: boolean;
    orderId: string;
    message: string;
    transactionId: string;
  };
  responseCode?: string;
}

export default function PaymentCallbackClientView({
  result,
  responseCode,
}: PaymentCallbackClientViewProps) {
  const router = useRouter();
  const { clearCart, restoreCart, cart } = useCart();
  const [hasBackup, setHasBackup] = useState(false);

  useEffect(() => {
    try {
      if (result.success) {
        clearCart();
        localStorage.removeItem('petzone_cart_backup');
        sessionStorage.removeItem('pending_vnpay_order');
      } else {
        const backup = localStorage.getItem('petzone_cart_backup');
        if (backup && JSON.parse(backup).length > 0) {
          setHasBackup(true);
        }
      }
    } catch {
      // Ignore
    }
  }, [result.success, clearCart]);

  const handleRestoreCartAndRetry = () => {
    try {
      const backup = localStorage.getItem('petzone_cart_backup');
      if (backup) {
        const parsed = JSON.parse(backup);
        restoreCart(parsed);
      }
    } catch {
      // Ignore
    }
    router.push('/checkout');
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-stone-900 pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-24 left-1/3 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-lg mx-auto bg-white rounded-3xl border border-stone-200/90 shadow-xl p-8 sm:p-10 text-center">
        {result.success ? (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider px-3.5 py-1 bg-emerald-100 text-emerald-800 rounded-full mb-3">
              Giao dịch VNPay thành công
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2 tracking-tight">
              Thanh Toán Hoàn Tất!
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mb-6 leading-relaxed">
              Đơn hàng của bạn đã được thanh toán trực tuyến qua cổng VNPay. Chúng tôi sẽ nhanh chóng đóng gói và vận chuyển đến bạn.
            </p>

            <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 mb-6 text-left text-xs space-y-2.5 font-mono text-stone-700 border border-stone-200/60">
              {result.orderId && (
                <div className="flex justify-between">
                  <span className="text-stone-400 font-sans">Mã đơn hàng:</span>
                  <span className="font-bold text-stone-900">{result.orderId}</span>
                </div>
              )}
              {result.transactionId && (
                <div className="flex justify-between">
                  <span className="text-stone-400 font-sans">Mã GD VNPay:</span>
                  <span className="font-semibold text-stone-800">{result.transactionId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-stone-400 font-sans">Phương thức:</span>
                <span className="font-bold text-blue-600 font-sans">Cổng VNPay (QR / ATM / Thẻ)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {result.orderId ? (
                <Link
                  href={`/order/${result.orderId}`}
                  className="flex-1 py-3.5 px-6 rounded-full bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all text-center inline-flex items-center justify-center gap-2 group"
                >
                  <span>Xem chi tiết đơn hàng</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <Link
                  href="/"
                  className="flex-1 py-3.5 px-6 rounded-full bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all text-center"
                >
                  Về trang chủ
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-inner">
              <XCircle className="w-10 h-10" />
            </div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider px-3.5 py-1 bg-rose-100 text-rose-800 rounded-full mb-3">
              Thanh toán chưa hoàn tất
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2 tracking-tight">
              Giao Dịch Không Thành Công
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mb-5 leading-relaxed">
              {result.message || 'Giao dịch qua VNPay chưa hoàn tất hoặc bị gián đoạn.'}
            </p>

            {/* Explanatory alert */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-left text-xs text-amber-800 space-y-1.5 mb-6">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Đơn hàng của bạn vẫn được lưu trữ an toàn</span>
              </div>
              <p className="text-amber-700 leading-relaxed pl-5">
                Nếu cổng VNPay Sandbox báo lỗi &quot;Website chưa được phê duyệt&quot; (mã 71), bạn có thể đổi sang hình thức <strong>Thanh toán khi nhận hàng (COD)</strong> hoặc kiểm tra lại thông tin đơn hàng bên dưới.
              </p>
            </div>

            {result.orderId && (
              <div className="bg-stone-50 rounded-2xl p-4 mb-6 text-left text-xs space-y-2 font-mono text-stone-700 border border-stone-200/60">
                <div className="flex justify-between">
                  <span className="text-stone-400 font-sans">Mã đơn đã tạo:</span>
                  <span className="font-bold text-stone-900">{result.orderId}</span>
                </div>
                {responseCode && (
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-sans">Mã lỗi VNPay:</span>
                    <span className="font-semibold text-rose-600">{responseCode}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {hasBackup && (
                <button
                  type="button"
                  onClick={handleRestoreCartAndRetry}
                  className="w-full py-3.5 px-6 rounded-full bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all text-center inline-flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-45" />
                  <span>Khôi phục giỏ hàng & Đổi sang COD</span>
                </button>
              )}

              {result.orderId ? (
                <Link
                  href={`/order/${result.orderId}`}
                  className="w-full py-3.5 px-6 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-800 font-bold text-xs uppercase tracking-wider transition-all text-center inline-flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4 text-stone-500" />
                  <span>Xem trạng thái đơn hàng này</span>
                </Link>
              ) : (
                <Link
                  href="/checkout"
                  className="w-full py-3.5 px-6 rounded-full bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all text-center"
                >
                  Thử lại tại trang Thanh toán
                </Link>
              )}

              <Link
                href="/order/lookup"
                className="text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors pt-1"
              >
                Tra cứu đơn hàng bằng số điện thoại
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
