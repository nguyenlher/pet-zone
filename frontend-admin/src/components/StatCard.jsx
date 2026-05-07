// src/components/StatCard.jsx
import {
  DollarSign, ShoppingBag, Users, Truck,
  TrendingUp, TrendingDown,
} from 'lucide-react';

const iconMap = { DollarSign, ShoppingBag, Users, Truck };

export default function StatCard({ label, formatted, change, positive, icon, color, iconColor }) {
  const Icon = iconMap[icon] || DollarSign;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200 group cursor-default">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
        <span className="text-2xl font-bold text-gray-900">{formatted}</span>
        <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{positive ? '+' : '-'}{change}% vs last month</span>
        </div>
      </div>

      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
        <Icon size={22} className={iconColor} />
      </div>
    </div>
  );
}
