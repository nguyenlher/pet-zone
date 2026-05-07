// src/pages/ReportsPage.jsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { FileText, Download } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', revenue: 42000, orders: 380 },
  { month: 'Feb', revenue: 55000, orders: 490 },
  { month: 'Mar', revenue: 48000, orders: 410 },
  { month: 'Apr', revenue: 63000, orders: 570 },
  { month: 'May', revenue: 71000, orders: 640 },
  { month: 'Jun', revenue: 58000, orders: 520 },
  { month: 'Jul', revenue: 82650, orders: 740 },
  { month: 'Aug', revenue: 67000, orders: 600 },
];

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

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Financial performance overview</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-150 cursor-pointer">
          <Download size={14} />
          Export PDF
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '$486,650', change: '+18%', positive: true },
          { label: 'Gross Profit', value: '$192,340', change: '+12%', positive: true },
          { label: 'Total Expenses', value: '$94,210', change: '+5%', positive: false },
          { label: 'Net Income', value: '$98,130', change: '+22%', positive: true },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
            <p className={`text-xs font-semibold mt-1 ${s.positive ? 'text-emerald-600' : 'text-red-500'}`}>
              {s.change} vs last year
            </p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">Monthly Revenue</h2>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" /> Revenue</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-indigo-300 inline-block" /> Orders</span>
          </div>
        </div>
        <div className="h-64">
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
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Reports</h2>
        <div className="flex flex-col gap-3">
          {[
            { name: 'Q3 2024 Financial Report', date: 'Jul 31, 2024', size: '2.4 MB' },
            { name: 'Monthly Sales Summary – June', date: 'Jun 30, 2024', size: '1.8 MB' },
            { name: 'Customer Acquisition Report', date: 'Jun 15, 2024', size: '3.1 MB' },
            { name: 'Inventory Status Report', date: 'Jun 1, 2024', size: '0.9 MB' },
          ].map((r) => (
            <div key={r.name} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                <FileText size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{r.name}</p>
                <p className="text-xs text-gray-400">{r.date} · {r.size}</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer">
                <Download size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
