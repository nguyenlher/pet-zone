import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserOrders } from '@/services/orderService';
import { Order } from '@/types';
import { Package, CreditCard, Banknote, ArrowRight, ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lịch sử đơn hàng | Pet Zone',
  description: 'Quản lý và theo dõi danh sách đơn hàng của bạn tại Pet Zone.',
};

interface AccountOrdersPageProps {
  searchParams: Promise<{ page?: string }>;
}

const statusMap: Record<string, { label: string; color: string; bg: string; border: string }> = {
  PENDING: { label: 'CHỜ XÁC NHẬN', color: 'text-black', bg: 'bg-neutral-100', border: 'border-neutral-300' },
  PENDING_PAYMENT: { label: 'CHỜ THANH TOÁN', color: 'text-black', bg: 'bg-neutral-100', border: 'border-neutral-300' },
  PROCESSING: { label: 'ĐANG XỬ LÝ', color: 'text-black', bg: 'bg-neutral-100', border: 'border-neutral-300' },
  CONFIRMED: { label: 'ĐÃ XÁC NHẬN', color: 'text-white', bg: 'bg-black', border: 'border-black' },
  DELIVERING: { label: 'ĐANG GIAO', color: 'text-black', bg: 'bg-neutral-100', border: 'border-neutral-300' },
  DELIVERED: { label: 'ĐÃ GIAO', color: 'text-white', bg: 'bg-black', border: 'border-black' },
  CANCELLED: { label: 'ĐÃ HỦY', color: 'text-neutral-500', bg: 'bg-neutral-50', border: 'border-neutral-200' },
};

export default async function AccountOrdersPage({ searchParams }: AccountOrdersPageProps) {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin?callbackUrl=/account/orders');
  }

  const accessToken = (session as any)?.accessToken as string | undefined;
  if (!accessToken) {
    redirect('/auth/signin?callbackUrl=/account/orders');
  }

  const rawParams = await searchParams;
  const currentPage = Math.max(1, parseInt(rawParams.page || '1', 10));
  const pageSize = 8;

  let orders: Order[] = [];
  let totalPages = 1;
  let totalElements = 0;
  let fetchError = false;

  try {
    const result = await getUserOrders(currentPage - 1, pageSize, accessToken);
    orders = result.items;
    totalPages = Math.max(1, result.totalPages);
    totalElements = result.totalElements;
  } catch (err) {
    console.error('Failed to fetch user orders:', err);
    fetchError = true;
  }

  return (
    <main className="min-h-screen bg-white text-black pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-2">
              <Link href="/" className="hover:text-black transition-colors uppercase">
                Trang chủ
              </Link>
              <span>/</span>
              <span className="text-black font-semibold uppercase">Tài khoản</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-black">
              Lịch sử đơn hàng
            </h1>
          </div>
          <div className="text-xs font-mono text-neutral-600 border border-neutral-200 bg-neutral-50 px-4 py-2 self-start sm:self-auto uppercase tracking-wider">
            Tổng cộng: <span className="font-bold text-black">{totalElements}</span> đơn
          </div>
        </div>

        {fetchError && (
          <div className="p-4 border border-neutral-300 bg-neutral-50 text-black text-xs font-mono">
            Không thể tải danh sách đơn hàng lúc này. Vui lòng thử lại sau.
          </div>
        )}

        {/* Orders list */}
        {orders.length === 0 ? (
          <div className="border border-neutral-200 p-12 sm:p-16 text-center">
            <div className="w-12 h-12 mx-auto mb-6 border border-neutral-200 flex items-center justify-center">
              <Package className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-base font-bold uppercase tracking-wider text-black mb-2">Bạn chưa có đơn hàng nào</h2>
            <p className="text-neutral-500 text-xs max-w-sm mx-auto mb-8 font-mono">
              Khám phá bộ sưu tập và thú cưng 3D để bắt đầu đơn hàng đầu tiên của bạn.
            </p>
            <Link
              href="/category/all"
              className="inline-flex items-center gap-3 px-8 py-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Khám phá sản phẩm</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = statusMap[order.orderStatus] || {
                label: order.orderStatus,
                color: 'text-black',
                bg: 'bg-neutral-100',
                border: 'border-neutral-300',
              };

              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'N/A';

              return (
                <div
                  key={order.orderId}
                  className="border border-neutral-200 hover:border-black transition-colors p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs sm:text-sm font-bold text-black">
                          #{order.orderId}
                        </span>
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 font-bold border ${status.bg} ${status.color} ${status.border}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-neutral-400 mt-1">Ngày đặt: {formattedDate}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block">Tổng thanh toán:</span>
                      <span className="text-base font-bold font-mono text-black">
                        {order.totalAmount.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="py-4 space-y-2">
                    {order.items &&
                      order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-neutral-700">
                          <span className="truncate pr-4 font-medium">
                            • {item.name} <span className="text-neutral-400 font-mono">x{item.quantity}</span>
                          </span>
                          <span className="font-mono font-medium text-black shrink-0">
                            {item.subtotalPrice.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      ))}
                    {order.items && order.items.length > 3 && (
                      <p className="text-[11px] text-neutral-400 font-mono italic">
                        + thêm {order.items.length - 3} sản phẩm khác...
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-xs text-neutral-600 inline-flex items-center gap-2">
                      {order.shipping?.paymentMethod === 'VNPAY' ? (
                        <>
                          <CreditCard className="w-3.5 h-3.5 text-black" />
                          <span className="text-[11px] font-mono uppercase">VNPay</span>
                        </>
                      ) : (
                        <>
                          <Banknote className="w-3.5 h-3.5 text-black" />
                          <span className="text-[11px] font-mono uppercase">COD (Tiền mặt)</span>
                        </>
                      )}
                    </span>
                    <Link
                      href={`/order/${order.orderId}`}
                      className="text-xs font-bold uppercase tracking-wider text-black hover:text-neutral-600 transition-colors flex items-center gap-1.5"
                    >
                      <span>Xem chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                {currentPage > 1 && (
                  <Link
                    href={`/account/orders?page=${currentPage - 1}`}
                    className="px-4 py-2 border border-neutral-200 text-xs font-mono uppercase tracking-wider text-black hover:bg-neutral-100 transition-colors"
                  >
                    ← Trang trước
                  </Link>
                )}

                <span className="text-xs font-mono uppercase tracking-wider text-neutral-600 px-4">
                  {currentPage} / {totalPages}
                </span>

                {currentPage < totalPages && (
                  <Link
                    href={`/account/orders?page=${currentPage + 1}`}
                    className="px-4 py-2 border border-neutral-200 text-xs font-mono uppercase tracking-wider text-black hover:bg-neutral-100 transition-colors"
                  >
                    Trang sau →
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
