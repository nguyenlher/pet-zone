// src/pages/ReportsPage.jsx
import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';
import SalesChart from '../components/SalesChart';
import { useOrderStats, useTopSellingPets, useSalesChartData } from '../hooks/useStatistics';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-gray-300">
            {p.name === 'revenue' ? 'Revenue: $' : 'Orders: '}{p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};



const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function ReportsPage() {
  // Calculate date ranges
  const { startDate: last12MonthsStart, endDate: today } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }, []);

  const { startDate: last7DaysStart } = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return {
      startDate: start.toISOString().split('T')[0],
    };
  }, []);

  // Fetch data
  const { data: orderStats } = useOrderStats(last12MonthsStart, today);
  const { data: topPets, isLoading: topPetsLoading } = useTopSellingPets(5, last12MonthsStart, today);
  const { data: salesData } = useSalesChartData(last7DaysStart, today);

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    if (!salesData?.metrics) {
      return [
        { label: 'Total Revenue', value: '$0', change: '0%', positive: true, icon: DollarSign },
        { label: 'Gross Profit', value: '$0', change: '0%', positive: true, icon: TrendingUp },
        { label: 'Total Expenses', value: '$0', change: '0%', positive: false, icon: TrendingDown },
        { label: 'Net Income', value: '$0', change: '0%', positive: true, icon: DollarSign },
      ];
    }

    const { totalIncome, totalExpenses, netProfit, profitMargin } = salesData.metrics;
    const grossProfit = totalIncome * 0.3; // Estimate 30% gross margin

    return [
      { 
        label: 'Total Revenue', 
        value: formatCurrency(totalIncome), 
        change: `${profitMargin >= 0 ? '+' : ''}${profitMargin}%`, 
        positive: profitMargin >= 0,
        icon: DollarSign 
      },
      { 
        label: 'Gross Profit', 
        value: formatCurrency(grossProfit), 
        change: `${profitMargin >= 0 ? '+' : ''}${(profitMargin * 0.5).toFixed(1)}%`, 
        positive: true,
        icon: TrendingUp 
      },
      { 
        label: 'Total Expenses', 
        value: formatCurrency(totalExpenses), 
        change: '+5%', 
        positive: false,
        icon: TrendingDown 
      },
      { 
        label: 'Net Income', 
        value: formatCurrency(netProfit), 
        change: `${profitMargin >= 0 ? '+' : ''}${profitMargin}%`, 
        positive: netProfit >= 0,
        icon: DollarSign 
      },
    ];
  }, [salesData]);

  // Format monthly data for bar chart
  const monthlyData = useMemo(() => {
    if (!salesData?.data || salesData.data.length === 0) {
      return [];
    }

    // Group by month
    const monthlyMap = new Map();
    salesData.data.forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { month: monthLabel, revenue: 0, orders: 0 });
      }
      
      const current = monthlyMap.get(monthKey);
      current.revenue += item.income || 0;
      current.orders += 1;
    });

    return Array.from(monthlyMap.values());
  }, [salesData]);



  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Financial performance and statistical overview</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-150 cursor-pointer">
          <Download size={14} />
          Export PDF
        </button>
      </div>

      {/* Order Statistics */}
      {orderStats && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Order Statistics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{orderStats.totalOrders}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl">
              <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{orderStats.completedOrders}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl">
              <p className="text-xs text-orange-600 font-medium uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{orderStats.pendingOrders}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl">
              <p className="text-xs text-red-600 font-medium uppercase tracking-wider">Cancelled</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{orderStats.cancelledOrders}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sales Analytics */}
      <SalesChart />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{s.label}</p>
                <Icon size={16} className="text-gray-400" />
              </div>
              <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
              <p className={`text-xs font-semibold mt-1 flex items-center gap-1 ${s.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                {s.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {s.change} vs last period
              </p>
            </div>
          );
        })}
      </div>

      {/* Monthly Revenue Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">Monthly Revenue</h2>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" /> Revenue</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-indigo-300 inline-block" /> Orders</span>
          </div>
        </div>
        <div className="h-64" style={{ minHeight: '256px' }}>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="orders" fill="#A5B4FC" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Top Selling Pets</h2>
        {topPetsLoading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : topPets?.content && topPets.content.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Rank</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Pet Name</th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Quantity Sold</th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topPets.content.map((pet) => (
                  <tr key={pet.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 text-sm font-semibold text-gray-900">#{pet.rank}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <Package size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-800">{pet.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right text-sm text-gray-600">{pet.quantitySold}</td>
                    <td className="py-3 text-right text-sm font-semibold text-gray-900">{formatCurrency(pet.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">No top selling pets data available</div>
        )}
      </div>
    </div>
  );
}
