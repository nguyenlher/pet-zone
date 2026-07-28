'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, AlertTriangle, Package } from 'lucide-react';

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
    <main className="min-h-screen bg-white text-black pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto border border-neutral-200 p-8 sm:p-12 text-center">
        {result.success ? (
          <>
            <div className="w-12 h-12 mx-auto mb-6 bg-black text-white flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 bg-neutral-100 text-black border border-neutral-300 mb-4">
              Giao dịch VNPay thành công
            </span>
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-black mb-3">
              Thanh toán hoàn tất
            </h1>
            <p className="text-neutral-500 text-xs sm:text-sm mb-6 leading-relaxed font-mono">
              Đơn hàng của bạn đã được thanh toán trực tuyến qua cổng VNPay. Chúng tôi sẽ nhanh chóng chuẩn bị và vận chuyển đến bạn.
            </p>

            <div className="border border-neutral-200 bg-neutral-50 p-5 mb-8 text-left text-xs space-y-2.5 font-mono text-neutral-800">
              {result.orderId && (
                <div className="flex justify-between">
                  <span className="text-neutral-500 uppercase text-[11px]">Mã đơn hàng:</span>
                  <span className="font-bold text-black">{result.orderId}</span>
                </div>
              )}
              {result.transactionId && (
                <div className="flex justify-between">
                  <span className="text-neutral-500 uppercase text-[11px]">Mã GD VNPay:</span>
                  <span className="font-medium text-black">{result.transactionId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-500 uppercase text-[11px]">Phương thức:</span>
                <span className="font-bold text-black uppercase">Cổng VNPay</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {result.orderId ? (
                <Link
                  href={`/order/${result.orderId}`}
                  className="flex-1 py-4 px-6 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest transition-colors text-center inline-flex items-center justify-center gap-2 group"
                >
                  <span>Xem chi tiết đơn hàng</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href="/"
                  className="flex-1 py-4 px-6 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest transition-colors text-center"
                >
                  Về trang chủ
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 mx-auto mb-6 border border-neutral-300 bg-neutral-100 text-black flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
            <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 bg-neutral-100 text-black border border-neutral-300 mb-4">
              Thanh toán chưa hoàn tất
            </span>
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-black mb-3">
              Giao dịch không thành công
            </h1>
            <p className="text-neutral-500 text-xs sm:text-sm mb-6 leading-relaxed font-mono">
              {result.message || 'Giao dịch qua VNPay chưa hoàn tất hoặc bị gián đoạn.'}
            </p>

            {/* Explanatory alert */}
            <div className="p-4 border border-neutral-300 bg-neutral-50 text-left text-xs text-neutral-800 space-y-2 mb-6">
              <div className="flex items-center gap-2 font-bold uppercase text-[11px] text-black">
                <AlertTriangle className="w-4 h-4 text-black shrink-0" />
                <span>Đơn hàng của bạn vẫn được lưu trữ an toàn</span>
              </div>
              <p className="text-neutral-600 leading-relaxed font-mono text-[11px]">
                Nếu cổng VNPay Sandbox báo lỗi &quot;Website chưa được phê duyệt&quot; (mã 71), bạn có thể đổi sang hình thức <strong>Thanh toán khi nhận hàng (COD)</strong> hoặc kiểm tra lại thông tin đơn hàng bên dưới.
              </p>
            </div>

            {result.orderId && (
              <div className="border border-neutral-200 bg-neutral-50 p-4 mb-6 text-left text-xs space-y-2 font-mono text-neutral-800">
                <div className="flex justify-between">
                  <span className="text-neutral-500 uppercase text-[11px]">Mã đơn:</span>
                  <span className="font-bold text-black">{result.orderId}</span>
                </div>
                {responseCode && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500 uppercase text-[11px]">Mã phản hồi:</span>
                    <span className="font-bold text-black">{responseCode}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {hasBackup && (
                <button
                  type="button"
                  onClick={handleRestoreCartAndRetry}
                  className="w-full py-4 px-6 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest transition-colors text-center inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Khôi phục giỏ hàng & Đổi sang COD</span>
                </button>
              )}

              {result.orderId ? (
                <Link
                  href={`/order/${result.orderId}`}
                  className="w-full py-3.5 px-6 border border-neutral-300 hover:bg-neutral-100 text-black font-bold text-xs uppercase tracking-widest transition-colors text-center inline-flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4 text-black" />
                  <span>Xem trạng thái đơn hàng này</span>
                </Link>
              ) : (
                <Link
                  href="/checkout"
                  className="w-full py-4 px-6 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest transition-colors text-center"
                >
                  Thử lại tại trang Thanh toán
                </Link>
              )}

              <Link
                href="/order/lookup"
                className="text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-black transition-colors pt-2"
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
