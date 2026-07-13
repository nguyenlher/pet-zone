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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-none bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
          <span className="font-mono text-xs leading-relaxed">{error}</span>
        </div>
      )}

      {/* Order ID Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
          Mã đơn hàng (Order ID) <span className="text-neutral-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
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
            className="w-full pl-10 pr-4 py-3 rounded-none border border-neutral-200 bg-white focus:outline-none focus:border-black font-mono text-xs sm:text-sm text-black transition-colors placeholder:font-sans placeholder:text-neutral-400"
          />
        </div>
        <p className="mt-1.5 text-[11px] text-neutral-500 font-mono">
          Mã định danh gồm chuỗi ký tự được cung cấp ngay sau khi bạn đặt hàng thành công.
        </p>
      </div>

      {/* Phone Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
          Số điện thoại nhận hàng <span className="text-neutral-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
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
            className="w-full pl-10 pr-4 py-3 rounded-none border border-neutral-200 bg-white focus:outline-none focus:border-black text-sm text-black transition-colors placeholder:text-neutral-400"
          />
        </div>
        <p className="mt-1.5 text-[11px] text-neutral-500 font-mono">
          Số điện thoại dùng làm lớp bảo mật xác thực đúng chủ sở hữu của đơn hàng.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-none bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border border-white border-t-transparent animate-spin" />
            <span>Đang tìm kiếm đơn hàng...</span>
          </>
        ) : (
          <>
            <span>Kiểm tra tiến độ đơn hàng</span>
            <Search className="w-4 h-4 text-white" />
          </>
        )}
      </button>
    </form>
  );
}
