import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserOrders } from '@/services/orderService';
import { Order } from '@/types';
import { Package, CreditCard, Banknote, ArrowRight, ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lịch sử đơn hàng | Super Pet Zone 3D',
  description: 'Quản lý và theo dõi danh sách đơn hàng của bạn tại Super Pet Zone 3D.',
};

interface AccountOrdersPageProps {
  searchParams: Promise<{ page?: string }>;
}

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'text-amber-800', bg: 'bg-amber-100' },
  PENDING_PAYMENT: { label: 'Chờ thanh toán', color: 'text-blue-800', bg: 'bg-blue-100' },
  PROCESSING: { label: 'Đang xử lý', color: 'text-indigo-800', bg: 'bg-indigo-100' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'text-emerald-800', bg: 'bg-emerald-100' },
  DELIVERING: { label: 'Đang giao', color: 'text-sky-800', bg: 'bg-sky-100' },
  DELIVERED: { label: 'Đã giao thành công', color: 'text-green-800', bg: 'bg-green-100' },
  CANCELLED: { label: 'Đã hủy', color: 'text-rose-800', bg: 'bg-rose-100' },
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
    <main className="min-h-screen bg-slate-50/60 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link href="/" className="hover:text-amber-600 transition-colors">
                Trang chủ
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Tài khoản</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Lịch sử đơn hàng của bạn
            </h1>
          </div>
          <div className="text-sm text-gray-600 bg-white border border-gray-100 px-4 py-2 rounded-2xl shadow-sm self-start sm:self-auto">
            Tổng cộng: <span className="font-bold text-gray-900">{totalElements}</span> đơn hàng
          </div>
        </div>

        {fetchError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            Không thể tải danh sách đơn hàng lúc này. Vui lòng thử lại sau!
          </div>
        )}

        {/* Orders list */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Bạn chưa có đơn hàng nào</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              Khám phá các sản phẩm và thú cưng 3D để bắt đầu đặt đơn hàng đầu tiên của bạn.
            </p>
            <Link
              href="/category/all"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm shadow-md shadow-orange-500/20 hover:opacity-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Khám phá sản phẩm</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusMap[order.orderStatus] || {
                label: order.orderStatus,
                color: 'text-gray-800',
                bg: 'bg-gray-100',
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
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-amber-200 transition-all p-5 md:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs md:text-sm font-bold text-gray-900">
                          #{order.orderId}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Ngày đặt: {formattedDate}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-gray-500 block">Tổng thanh toán:</span>
                      <span className="text-lg font-bold text-amber-600">
                        {order.totalAmount.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="py-3 space-y-2">
                    {order.items &&
                      order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs sm:text-sm text-gray-700">
                          <span className="truncate pr-4">
                            • {item.name} <span className="text-gray-400">x{item.quantity}</span>
                          </span>
                          <span className="font-medium flex-shrink-0">
                            {item.subtotalPrice.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      ))}
                    {order.items && order.items.length > 3 && (
                      <p className="text-xs text-gray-400 italic">
                        và thêm {order.items.length - 3} sản phẩm khác...
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 inline-flex items-center gap-1.5">
                      {order.shipping?.paymentMethod === 'VNPAY' ? (
                        <>
                          <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                          <span>Cổng VNPay</span>
                        </>
                      ) : (
                        <>
                          <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Thanh toán COD</span>
                        </>
                      )}
                    </span>
                    <Link
                      href={`/order/${order.orderId}`}
                      className="text-xs md:text-sm font-semibold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1"
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
              <div className="flex items-center justify-center gap-2 pt-6">
                {currentPage > 1 && (
                  <Link
                    href={`/account/orders?page=${currentPage - 1}`}
                    className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    ← Trang trước
                  </Link>
                )}

                <span className="text-sm font-medium text-gray-600 px-3">
                  Trang {currentPage} / {totalPages}
                </span>

                {currentPage < totalPages && (
                  <Link
                    href={`/account/orders?page=${currentPage + 1}`}
                    className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
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
