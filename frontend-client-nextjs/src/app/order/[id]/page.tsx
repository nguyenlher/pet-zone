import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@/auth';
import { getOrderById } from '@/services/orderService';
import { Order, OrderStatus } from '@/types';
import { Search, CheckCircle2, CreditCard, Banknote, ArrowRight, ChevronRight, Package } from 'lucide-react';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Chi tiết đơn hàng #${id.slice(0, 8)} | Pet Zone 3D`,
    description: 'Xem chi tiết thông tin đơn hàng, trạng thái xử lý và địa chỉ nhận hàng tại Pet Zone 3D.',
  };
}

const statusMap: Record<string, { label: string; color: string; bg: string; border: string }> = {
  PENDING: { label: 'CHỜ XÁC NHẬN', color: 'text-black', bg: 'bg-neutral-100', border: 'border-neutral-300' },
  PENDING_PAYMENT: { label: 'CHỜ THANH TOÁN VNPAY', color: 'text-black', bg: 'bg-neutral-100', border: 'border-neutral-300' },
  PROCESSING: { label: 'ĐANG CHUẨN BỊ', color: 'text-black', bg: 'bg-neutral-100', border: 'border-neutral-300' },
  CONFIRMED: { label: 'ĐÃ XÁC NHẬN', color: 'text-white', bg: 'bg-black', border: 'border-black' },
  DELIVERING: { label: 'ĐANG VẬN CHUYỂN', color: 'text-black', bg: 'bg-neutral-100', border: 'border-neutral-300' },
  DELIVERED: { label: 'GIAO THÀNH CÔNG', color: 'text-white', bg: 'bg-black', border: 'border-black' },
  CANCELLED: { label: 'ĐÃ HỦY', color: 'text-neutral-500', bg: 'bg-neutral-50', border: 'border-neutral-200' },
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const session = await auth();
  const accessToken = (session as any)?.accessToken as string | undefined;

  let order: Order | null = null;
  let errorMsg: string | null = null;

  try {
    order = await getOrderById(id, accessToken);
  } catch (err: any) {
    console.error(`Failed to fetch order ${id}:`, err);
    errorMsg = 'Không tìm thấy đơn hàng hoặc đơn hàng không tồn tại.';
  }

  if (!order || errorMsg) {
    return (
      <main className="min-h-screen bg-white text-black pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-200">
        <div className="max-w-xl mx-auto border border-neutral-200 p-8 sm:p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-6 border border-neutral-200 flex items-center justify-center">
            <Search className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-black mb-3">
            Không tìm thấy đơn hàng
          </h1>
          <p className="text-neutral-500 text-xs mb-8 leading-relaxed font-mono">
            Mã đơn hàng <span className="font-semibold text-black">{id}</span> không hợp lệ hoặc đã bị xóa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/order/lookup"
              className="w-full sm:w-auto px-6 py-3.5 border border-neutral-300 text-black font-bold hover:bg-neutral-100 transition-colors text-xs uppercase tracking-widest text-center"
            >
              Tra cứu đơn khác
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-black hover:bg-neutral-800 text-white font-bold transition-colors text-xs uppercase tracking-widest text-center"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const statusInfo = statusMap[order.orderStatus] || {
    label: order.orderStatus,
    color: 'text-black',
    bg: 'bg-neutral-100',
    border: 'border-neutral-300',
  };

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString('vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Mới tạo';

  return (
    <main className="min-h-screen bg-white text-black pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-neutral-400">
          <Link href="/" className="hover:text-black transition-colors uppercase">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/order/lookup" className="hover:text-black transition-colors uppercase">
            Đơn hàng
          </Link>
          <span>/</span>
          <span className="text-black font-semibold">#{order.orderId.slice(0, 8)}</span>
        </div>

        {/* Success header banner */}
        <div className="border border-neutral-200 p-8 sm:p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-6 bg-black text-white flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 block mb-2">Order Confirmed</span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-black mb-3">
            Đặt hàng thành công
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm max-w-lg mx-auto mb-6 leading-relaxed">
            Cảm ơn bạn đã lựa chọn Pet Zone. Đơn hàng của bạn đã được ghi nhận và đang trong quá trình chuẩn bị đóng gói.
          </p>
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-neutral-200 bg-neutral-50 text-xs font-mono text-neutral-600">
            <span>MÃ ĐƠN:</span>
            <span className="font-bold text-black select-all">{order.orderId}</span>
          </div>
        </div>

        {/* Order overview grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Info & Status */}
          <div className="border border-neutral-200 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                Trạng thái đơn hàng
              </h3>
              <span className={`text-[10px] font-mono px-3 py-1 font-bold border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                {statusInfo.label}
              </span>
            </div>
            <dl className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <dt className="text-neutral-500 uppercase tracking-wider text-[11px]">Thời gian đặt:</dt>
                <dd className="font-mono text-black">{formattedDate}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-neutral-500 uppercase tracking-wider text-[11px]">Phương thức thanh toán:</dt>
                <dd className="font-medium text-black flex items-center gap-1.5">
                  {order.shipping?.paymentMethod === 'VNPAY' ? (
                    <span className="inline-flex items-center gap-1.5 font-bold uppercase text-xs">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>VNPay</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-bold uppercase text-xs">
                      <Banknote className="w-3.5 h-3.5" />
                      <span>COD (Tiền mặt)</span>
                    </span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-neutral-500 uppercase tracking-wider text-[11px]">Loại tài khoản:</dt>
                <dd className="text-black font-mono text-xs">
                  {order.userId ? 'Thành viên' : 'Khách vãng lai'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Shipping Detail */}
          <div className="border border-neutral-200 p-6 sm:p-8 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black pb-4 border-b border-neutral-200">
              Thông tin nhận hàng
            </h3>
            {order.shipping ? (
              <dl className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <dt className="text-neutral-500 uppercase tracking-wider text-[11px]">Người nhận:</dt>
                  <dd className="font-bold text-black">{order.shipping.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500 uppercase tracking-wider text-[11px]">Số điện thoại:</dt>
                  <dd className="font-mono text-black">{order.shipping.phone}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500 uppercase tracking-wider text-[11px]">Tỉnh / Thành phố:</dt>
                  <dd className="text-black">{order.shipping.city}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500 uppercase tracking-wider text-[11px] shrink-0">Địa chỉ:</dt>
                  <dd className="text-black text-right">{order.shipping.address}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-xs text-neutral-400 font-mono">Chưa có thông tin vận chuyển chi tiết.</p>
            )}
          </div>
        </div>

        {/* Ordered items table */}
        <div className="border border-neutral-200">
          <div className="p-5 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
              <Package className="w-4 h-4 text-black" />
              <span>Sản phẩm trong đơn ({order.items?.length || 0})</span>
            </h3>
          </div>
          <div className="divide-y divide-neutral-200">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border border-neutral-200 bg-neutral-100 text-black font-mono">
                        {item.itemType}
                      </span>
                      <h4 className="text-sm font-bold text-black truncate">{item.name}</h4>
                    </div>
                    <p className="text-xs font-mono text-neutral-500">
                      Đơn giá: {item.price.toLocaleString('vi-VN')} đ × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold font-mono text-black">
                      {item.subtotalPrice.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-neutral-400 font-mono">
                Không có chi tiết sản phẩm.
              </div>
            )}
          </div>

          {/* Pricing summary */}
          <div className="bg-neutral-50 p-6 sm:p-8 border-t border-neutral-200 space-y-3 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span className="uppercase tracking-wider text-[11px]">Tạm tính:</span>
              <span className="font-mono text-black">{order.subtotalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-black">
                <span className="uppercase tracking-wider text-[11px]">Giảm giá:</span>
                <span className="font-mono font-bold">-{order.discountAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span className="uppercase tracking-wider text-[11px]">Phí vận chuyển:</span>
              <span className="font-mono">
                {order.shippingFee === 0 ? (
                  <span className="font-bold text-black">Miễn phí</span>
                ) : (
                  <span className="text-black">{order.shippingFee.toLocaleString('vi-VN')} đ</span>
                )}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-4 border-t border-neutral-200">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-black">Tổng thanh toán:</span>
              <span className="text-xl font-bold font-mono text-black tracking-tight">
                {order.totalAmount.toLocaleString('vi-VN')} <span className="text-xs text-neutral-500">VND</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            href="/order/lookup"
            className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors flex items-center gap-2 group"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-colors" />
            <span>Tra cứu đơn hàng khác</span>
          </Link>

          <Link
            href="/category/all"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-black hover:bg-neutral-800 text-white font-bold transition-colors text-xs uppercase tracking-widest"
          >
            <span>Tiếp tục mua sắm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
