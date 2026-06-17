'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderById } from '@/services/orderService';
import { Search, AlertCircle, Hash, Phone, ArrowRight } from 'lucide-react';

export default function OrderLookupForm() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizePhone = (p: string) => p.replace(/\s+/g, '').replace(/^(\+84)/, '0');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanOrderId = orderId.trim();
    const cleanPhone = phone.trim();

    if (!cleanOrderId) {
      setError('Vui lòng nhập mã đơn hàng của bạn');
      return;
    }

    if (!cleanPhone) {
      setError('Vui lòng nhập số điện thoại đặt hàng');
      return;
    }

    setIsLoading(true);

    try {
      const order = await getOrderById(cleanOrderId);
      if (!order) {
        setError('Không tìm thấy đơn hàng với mã này trên hệ thống.');
        setIsLoading(false);
        return;
      }

      // Verify phone number
      const orderPhone = normalizePhone(order.shipping?.phone || '');
      const inputPhone = normalizePhone(cleanPhone);

      if (orderPhone !== inputPhone) {
        setError('Số điện thoại không khớp với thông tin đã đăng ký trên đơn hàng này.');
        setIsLoading(false);
        return;
      }

      // Success, route to order detail
      router.push(`/order/${cleanOrderId}`);
    } catch (err: any) {
      console.error('Order lookup failed:', err);
      setError('Không tìm thấy đơn hàng hoặc mã đơn hàng không đúng định dạng.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">{error}</span>
        </div>
      )}

      {/* Order ID Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
          Mã đơn hàng (Order ID) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Hash className="w-4 h-4" />
          </div>
          <input
            type="text"
            required
            value={orderId}
            onChange={(e) => {
              setOrderId(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Ví dụ: 456afe14-d13d-4c8c-a7b6-..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 font-mono text-xs sm:text-sm text-stone-900 transition-all placeholder:font-sans placeholder:text-stone-400"
          />
        </div>
        <p className="mt-1.5 text-[11px] text-stone-400">
          Mã định danh gồm chuỗi ký tự được cung cấp ngay sau khi bạn đặt hàng thành công.
        </p>
      </div>

      {/* Phone Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
          Số điện thoại nhận hàng <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Phone className="w-4 h-4" />
          </div>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Ví dụ: 0912345678"
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 text-sm text-stone-900 transition-all placeholder:text-stone-400"
          />
        </div>
        <p className="mt-1.5 text-[11px] text-stone-400">
          Số điện thoại dùng làm lớp bảo mật xác thực đúng chủ sở hữu của đơn hàng.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-stone-900 hover:bg-black text-white font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Đang tìm kiếm đơn hàng...</span>
          </>
        ) : (
          <>
            <span>Kiểm tra tiến độ đơn hàng</span>
            <Search className="w-4 h-4 text-[#D4F442]" />
          </>
        )}
      </button>
    </form>
  );
}
