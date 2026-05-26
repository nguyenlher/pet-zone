// src/pages/DashboardPage.jsx
import { Users, ShoppingBag, Package, ShoppingCart, TrendingUp, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

// Simple count fetchers - direct API calls without statistics service
const fetchCounts = async () => {
  try {
    const [usersRes, petsRes, productsRes, ordersRes] = await Promise.all([
      api.get('/api/public/users?page=0&size=1').catch(() => ({ data: { totalElements: 0 } })),
      api.get('/api/public/pets?page=0&size=1').catch(() => ({ data: { totalElements: 0 } })),
      api.get('/api/public/products?page=0&size=1').catch(() => ({ data: { totalElements: 0 } })),
      api.get('/api/public/order?page=0&size=1').catch(() => ({ data: { totalElements: 0 } })),
    ]);

    return {
      totalUsers: usersRes.data.totalElements || 0,
      totalPets: petsRes.data.totalElements || 0,
      totalProducts: productsRes.data.totalElements || 0,
      totalOrders: ordersRes.data.totalElements || 0,
    };
  } catch (error) {
    console.error('Error fetching counts:', error);
    return {
      totalUsers: 0,
      totalPets: 0,
      totalProducts: 0,
      totalOrders: 0,
    };
  }
};

export default function DashboardPage() {
  const { data: counts, isLoading } = useQuery({
    queryKey: ['dashboard-counts'],
    queryFn: fetchCounts,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const stats = [
    {
      id: 'users',
      label: 'Total Users',
      value: counts?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Registered customers',
    },
    {
      id: 'pets',
      label: 'Total Pets',
      value: counts?.totalPets || 0,
      icon: ShoppingBag,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'Available pets',
    },
    {
      id: 'products',
      label: 'Total Products',
      value: counts?.totalProducts || 0,
      icon: Package,
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      description: 'Products in store',
    },
    {
      id: 'orders',
      label: 'Total Orders',
      value: counts?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
      description: 'All time orders',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-sm p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to PetStore Admin</h1>
        <p className="text-emerald-100">Here's an overview of your store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={24} className={stat.iconColor} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href="/items/pets"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <ShoppingBag size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Manage Pets</p>
              <p className="text-xs text-gray-500">Add or edit pets</p>
            </div>
          </a>

          <a
            href="/items/products"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Package size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Manage Products</p>
              <p className="text-xs text-gray-500">Add or edit products</p>
            </div>
          </a>

          <a
            href="/orders"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Clock size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">View Orders</p>
              <p className="text-xs text-gray-500">Process orders</p>
            </div>
          </a>

          <a
            href="/reports"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">View Reports</p>
              <p className="text-xs text-gray-500">Analytics & stats</p>
            </div>
          </a>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Gateway</span>
              <span className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Services</span>
              <span className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                All Running
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Users size={16} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium">New user registered</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <ShoppingCart size={16} className="text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium">New order received</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <ShoppingBag size={16} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium">Pet added to catalog</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
