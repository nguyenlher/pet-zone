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

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'text-amber-800', bg: 'bg-amber-100' },
  PENDING_PAYMENT: { label: 'Chờ thanh toán VNPay', color: 'text-blue-800', bg: 'bg-blue-100' },
  PROCESSING: { label: 'Đang chuẩn bị hàng', color: 'text-indigo-800', bg: 'bg-indigo-100' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'text-emerald-800', bg: 'bg-emerald-100' },
  DELIVERING: { label: 'Đang vận chuyển', color: 'text-sky-800', bg: 'bg-sky-100' },
  DELIVERED: { label: 'Giao hàng thành công', color: 'text-green-800', bg: 'bg-green-100' },
  CANCELLED: { label: 'Đã hủy', color: 'text-rose-800', bg: 'bg-rose-100' },
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
      <main className="min-h-screen bg-[#FAFAF8] text-stone-900 pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-stone-200/90 shadow-xl p-8 sm:p-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 mb-2 tracking-tight">
            Không tìm thấy đơn hàng
          </h1>
          <p className="text-stone-500 text-sm mb-6 leading-relaxed">
            Mã đơn hàng <span className="font-mono font-semibold text-stone-800">{id}</span> không hợp lệ hoặc đã bị xóa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/order/lookup"
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-stone-200 text-stone-700 font-bold hover:bg-stone-50 transition-colors text-xs uppercase tracking-wider"
            >
              Tra cứu đơn khác
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-900 hover:bg-black text-white font-bold transition-all text-xs uppercase tracking-wider shadow-md"
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
    color: 'text-stone-800',
    bg: 'bg-stone-100',
  };

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString('vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Mới tạo';

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-stone-900 pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-2">
          <Link href="/" className="hover:text-stone-900 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/order/lookup" className="hover:text-stone-900 transition-colors">
            Đơn hàng
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-mono">#{order.orderId.slice(0, 8)}</span>
        </div>

        {/* Success header banner */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-7 sm:p-9 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 mb-2 tracking-tight">
            ĐẶT HÀNG THÀNH CÔNG!
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto mb-5 leading-relaxed">
            Cảm ơn bạn đã lựa chọn Pet Zone. Đơn hàng của bạn đã được ghi nhận và đang trong quá trình chuẩn bị đóng gói cẩn thận.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-100 text-xs font-mono text-stone-700 border border-stone-200/60">
            <span className="text-stone-400">Mã đơn:</span>
            <span className="font-bold text-stone-900 select-all">{order.orderId}</span>
          </div>
        </div>

        {/* Order overview grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Info & Status */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-7 space-y-4">
            <h3 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>Trạng thái đơn hàng</span>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${statusInfo.bg} ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </h3>
            <dl className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between">
                <dt className="text-stone-500">Thời gian đặt:</dt>
                <dd className="font-semibold text-stone-900">{formattedDate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Phương thức thanh toán:</dt>
                <dd className="font-semibold text-stone-900 flex items-center gap-1.5">
                  {order.shipping?.paymentMethod === 'VNPAY' ? (
                    <span className="text-blue-700 inline-flex items-center gap-1.5 font-bold">
                      <CreditCard className="w-4 h-4" />
                      <span>Cổng VNPay</span>
                    </span>
                  ) : (
                    <span className="text-stone-900 inline-flex items-center gap-1.5 font-bold">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>Thanh toán COD</span>
                    </span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Loại tài khoản:</dt>
                <dd className="text-stone-700 font-semibold">
                  {order.userId ? 'Thành viên Pet Zone' : 'Khách (Guest)'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Shipping Detail */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-7 space-y-4">
            <h3 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-100">
              Địa chỉ nhận hàng
            </h3>
            {order.shipping ? (
              <dl className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex">
                  <dt className="w-28 text-stone-500 flex-shrink-0">Người nhận:</dt>
                  <dd className="font-bold text-stone-900">{order.shipping.name}</dd>
                </div>
                <div className="flex">
                  <dt className="w-28 text-stone-500 flex-shrink-0">Số điện thoại:</dt>
                  <dd className="font-semibold text-stone-900">{order.shipping.phone}</dd>
                </div>
                <div className="flex">
                  <dt className="w-28 text-stone-500 flex-shrink-0">Tỉnh/TP:</dt>
                  <dd className="text-stone-900 font-medium">{order.shipping.city}</dd>
                </div>
                <div className="flex">
                  <dt className="w-28 text-stone-500 flex-shrink-0">Địa chỉ:</dt>
                  <dd className="text-stone-900 font-medium">{order.shipping.address}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-xs text-stone-400">Chưa có thông tin vận chuyển chi tiết.</p>
            )}
          </div>
        </div>

        {/* Ordered items table */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-7 border-b border-stone-100 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-stone-400" />
              <span>Danh sách sản phẩm</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
              {order.items?.length || 0} sản phẩm
            </span>
          </div>
          <div className="divide-y divide-stone-100">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} className="p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono">
                        {item.itemType}
                      </span>
                      <h4 className="text-sm font-bold text-stone-900 truncate">{item.name}</h4>
                    </div>
                    <p className="text-xs text-stone-500">
                      Đơn giá: {item.price.toLocaleString('vi-VN')} đ × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-extrabold text-stone-900">
                      {item.subtotalPrice.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-stone-400">
                Không có chi tiết sản phẩm.
              </div>
            )}
          </div>

          {/* Pricing summary */}
          <div className="bg-stone-50/70 p-6 sm:p-7 border-t border-stone-100 space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Tạm tính tiền hàng:</span>
              <span className="font-semibold text-stone-900">{order.subtotalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Ưu đãi giảm giá:</span>
                <span className="font-bold">-{order.discountAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Phí vận chuyển:</span>
              <span>
                {order.shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold">Miễn phí</span>
                ) : (
                  <span className="font-semibold text-stone-900">{order.shippingFee.toLocaleString('vi-VN')} đ</span>
                )}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-4 border-t border-stone-200/80">
              <span className="text-sm sm:text-base font-extrabold text-stone-900">Tổng thanh toán:</span>
              <span className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {order.totalAmount.toLocaleString('vi-VN')} <span className="text-xs font-semibold text-stone-500 uppercase">VND</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            href="/order/lookup"
            className="text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1.5 group"
          >
            <Search className="w-4 h-4 text-stone-400 group-hover:text-stone-900 transition-colors" />
            <span>Tra cứu lại đơn hàng bằng số điện thoại</span>
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/category/all"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-stone-900 hover:bg-black text-white font-bold transition-all shadow-md text-xs uppercase tracking-wider group"
            >
              <span>Tiếp tục mua sắm</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
