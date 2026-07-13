// src/pages/DashboardPage.jsx
import { useMemo } from 'react';
import { 
  Users, ShoppingBag, Package, ShoppingCart, 
  Clock, Printer 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import SalesChart from '../components/SalesChart';
import { useOrderStats } from '../hooks/useStatistics';

// Direct API count fetchers
const fetchCounts = async () => {
  try {
    const [usersRes, petsRes, productsRes, ordersRes, recentOrdersRes] = await Promise.all([
      api.get('/api/public/users?page=0&size=1').catch(() => ({ data: { totalElements: 0 } })),
      api.get('/api/public/pets?page=0&size=1').catch(() => ({ data: { totalElements: 0 } })),
      api.get('/api/public/products?page=0&size=1').catch(() => ({ data: { totalElements: 0 } })),
      api.get('/api/public/order?page=0&size=1').catch(() => ({ data: { totalElements: 0 } })),
      api.get('/api/public/order?page=0&size=5&sort=createdAt,desc').catch(() => ({ data: { content: [] } })),
    ]);

    const recentOrders = recentOrdersRes.data?.content || (Array.isArray(recentOrdersRes.data) ? recentOrdersRes.data : []);

    return {
      totalUsers: usersRes.data.totalElements || 0,
      totalPets: petsRes.data.totalElements || 0,
      totalProducts: productsRes.data.totalElements || 0,
      totalOrders: ordersRes.data.totalElements || 0,
      recentOrders: recentOrders.slice(0, 5),
    };
  } catch (error) {
    console.error('Error fetching dashboard counts:', error);
    return {
      totalUsers: 0,
      totalPets: 0,
      totalProducts: 0,
      totalOrders: 0,
      recentOrders: [],
    };
  }
};

const formatVND = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value || 0);
};

export default function DashboardPage() {
  // Query 30-day window for statistics
  const { startDate: last30DaysStart, endDate: today } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }, []);

  const { data: counts, isLoading: countsLoading } = useQuery({
    queryKey: ['dashboard-counts'],
    queryFn: fetchCounts,
    refetchInterval: 30000,
  });

  const { data: orderStats } = useOrderStats(last30DaysStart, today);

  const stats = [
    {
      id: 'users',
      label: 'Tổng Khách Hàng',
      value: counts?.totalUsers || 0,
      icon: Users,
      description: 'Người dùng trong hệ thống',
    },
    {
      id: 'pets',
      label: 'Thú Cưng Trong Kho',
      value: counts?.totalPets || 0,
      icon: ShoppingBag,
      description: 'Thú cưng sẵn sàng bán',
    },
    {
      id: 'products',
      label: 'Sản Phẩm Trong Cửa Hàng',
      value: counts?.totalProducts || 0,
      icon: Package,
      description: 'Vật phẩm & thức ăn',
    },
    {
      id: 'orders',
      label: 'Tổng Đơn Hàng',
      value: counts?.totalOrders || 0,
      icon: ShoppingCart,
      description: 'Tất cả đơn đã ghi nhận',
    },
  ];

  if (countsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center font-mono">
          <div className="w-7 h-7 border-2 border-neutral-900 border-t-transparent animate-spin rounded-full mx-auto mb-3"></div>
          <p className="text-xs text-neutral-500 font-medium">Đang nạp dữ liệu bảng điều khiển...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 select-none pb-8">
      {/* Welcome & Report Header Banner */}
      <div className="bg-white border border-neutral-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-neutral-900" />
            <span className="text-xs font-semibold text-neutral-500">
              Bảng điều khiển
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            TRANG QUẢN TRỊ
          </h1>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-medium text-neutral-700 rounded-md transition-colors cursor-pointer"
          >
            <Printer size={13} />
            <span>In Báo Cáo</span>
          </button>
        </div>
      </div>

      {/* Row 1: Key Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white border border-neutral-200 p-5 rounded-lg shadow-sm hover:border-neutral-300 transition-colors duration-150 flex items-center justify-between"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-neutral-500">
                {stat.label}
              </span>
              <span className="text-2xl font-bold text-neutral-900 font-mono tabular-nums tracking-tight">
                {stat.value.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-400 mt-0.5">
                {stat.description}
              </span>
            </div>
            <div className="w-10 h-10 border border-neutral-100 bg-neutral-50 rounded-md flex items-center justify-center text-neutral-700 shrink-0">
              <stat.icon size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Order Pipeline Breakdown (Tổng đơn hàng -> Đang xử lý -> Đã hoàn thành -> Đã huỷ) */}
      <div className="bg-white rounded-lg border border-neutral-200 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-900 mb-3 pb-2.5 border-b border-neutral-100">
          Tình Trạng Xử Lý Đơn Hàng (30 ngày qua)
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Tổng đơn hàng */}
          <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-md">
            <p className="text-xs text-neutral-500 font-medium">Tổng Đơn Hàng</p>
            <p className="text-xl font-bold text-neutral-900 font-mono tabular-nums tracking-tight mt-1">
              {orderStats?.totalOrders || counts?.totalOrders || 0}
            </p>
          </div>
          {/* 2. Đang xử lý */}
          <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-md">
            <p className="text-xs text-amber-800 font-medium">Đang Xử Lý</p>
            <p className="text-xl font-bold text-amber-700 font-mono tabular-nums tracking-tight mt-1">
              {orderStats?.pendingOrders || 0}
            </p>
          </div>
          {/* 3. Đã hoàn thành */}
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-md">
            <p className="text-xs text-emerald-800 font-medium">Đã Hoàn Thành</p>
            <p className="text-xl font-bold text-emerald-700 font-mono tabular-nums tracking-tight mt-1">
              {orderStats?.completedOrders || 0}
            </p>
          </div>
          {/* 4. Đã huỷ */}
          <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-md">
            <p className="text-xs text-rose-800 font-medium">Đã Hủy</p>
            <p className="text-xl font-bold text-rose-700 font-mono tabular-nums tracking-tight mt-1">
              {orderStats?.cancelledOrders || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: Financial Analytics (SalesChart Full Width) */}
      <div className="w-full">
        <SalesChart />
      </div>

      {/* Row 4: Recent Real Orders from DB (Full Width) */}
      <div className="bg-white border border-neutral-200 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              Đơn Hàng Gần Đây
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Dữ liệu thời gian thực từ cơ sở dữ liệu</p>
          </div>
          <a
            href="/orders"
            className="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Xem tất cả →
          </a>
        </div>

        <div className="space-y-2.5">
          {(!counts?.recentOrders || counts.recentOrders.length === 0) ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              Chưa có đơn hàng nào được ghi nhận trong cơ sở dữ liệu
            </div>
          ) : (
            counts.recentOrders.map((order, index) => {
              const orderId = order.orderId || order.id || '';
              const shortCode = orderId ? `#${orderId.substring(0, 8).toUpperCase()}` : '#N/A';
              const customerName = order.user
                ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.email
                : (order.shipping?.name || 'Khách vãng lai');
              const customerSub = order.user ? (order.user.email || 'Thành viên') : 'Không có tài khoản';
              const amount = Number(order.totalAmount || 0);
              const orderStatus = order.orderStatus || order.status;
              const dateDisplay = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('vi-VN')
                : '—';

              return (
                <a
                  key={orderId || index}
                  href="/orders"
                  className="flex items-center justify-between p-3 rounded-md hover:bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-all duration-150 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {order.user ? (
                      <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                        {`${order.user.firstName?.[0] || ''}${order.user.lastName?.[0] || ''}`.toUpperCase() || 'U'}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 text-xs font-medium shrink-0">
                        ?
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-neutral-900">
                          {shortCode}
                        </span>
                        <span className="text-neutral-300">•</span>
                        <span className="text-xs font-medium text-neutral-800 truncate">
                          {customerName}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                        {customerSub} • {dateDisplay}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="text-xs font-semibold font-mono tabular-nums text-neutral-900">
                      {formatVND(amount)}
                    </span>
                    <StatusBadge status={orderStatus} />
                  </div>
                </a>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Actions (Thao Tác Nhanh) */}
      <div className="bg-white border border-neutral-200 p-5 rounded-lg shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-900 mb-3 pb-2.5 border-b border-neutral-100">
          Thao Tác Nhanh
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href="/items/pets"
            className="flex items-center gap-3.5 p-3.5 border border-neutral-200 bg-white hover:border-neutral-400 transition-colors duration-150 rounded-md group cursor-pointer"
          >
            <div className="w-9 h-9 border border-neutral-100 bg-neutral-50 rounded-md flex items-center justify-center text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors shrink-0">
              <ShoppingBag size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900">Quản Lý Thú Cưng</p>
              <p className="text-xs text-neutral-400 mt-0.5">Thêm hoặc cập nhật</p>
            </div>
          </a>

          <a
            href="/items/products"
            className="flex items-center gap-3.5 p-3.5 border border-neutral-200 bg-white hover:border-neutral-400 transition-colors duration-150 rounded-md group cursor-pointer"
          >
            <div className="w-9 h-9 border border-neutral-100 bg-neutral-50 rounded-md flex items-center justify-center text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors shrink-0">
              <Package size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900">Quản Lý Sản Phẩm</p>
              <p className="text-xs text-neutral-400 mt-0.5">Hàng hóa & tồn kho</p>
            </div>
          </a>

          <a
            href="/orders"
            className="flex items-center gap-3.5 p-3.5 border border-neutral-200 bg-white hover:border-neutral-400 transition-colors duration-150 rounded-md group cursor-pointer"
          >
            <div className="w-9 h-9 border border-neutral-100 bg-neutral-50 rounded-md flex items-center justify-center text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors shrink-0">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900">Xem Đơn Hàng</p>
              <p className="text-xs text-neutral-400 mt-0.5">Xử lý giao dịch</p>
            </div>
          </a>

          <a
            href="/customers"
            className="flex items-center gap-3.5 p-3.5 border border-neutral-200 bg-white hover:border-neutral-400 transition-colors duration-150 rounded-md group cursor-pointer"
          >
            <div className="w-9 h-9 border border-neutral-100 bg-neutral-50 rounded-md flex items-center justify-center text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors shrink-0">
              <Users size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900">Quản Lý Khách Hàng</p>
              <p className="text-xs text-neutral-400 mt-0.5">Danh bạ người dùng</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
