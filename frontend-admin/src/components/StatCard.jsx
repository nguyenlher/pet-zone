// src/components/StatCard.jsx
import {
  DollarSign, ShoppingBag, Users, Truck,
  TrendingUp, TrendingDown,
} from 'lucide-react';

const iconMap = { DollarSign, ShoppingBag, Users, Truck };

export default function StatCard({ label, formatted, change, positive, icon }) {
  const Icon = iconMap[icon] || DollarSign;

  return (
    <div className="bg-white rounded-none border border-neutral-200 p-5 flex items-center justify-between hover:border-black transition-colors duration-150 cursor-default">
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{label}</span>
        <span className="text-2xl font-extrabold text-black font-mono tracking-tight">{formatted}</span>
        <div className={`flex items-center gap-1 text-[11px] font-mono font-semibold ${positive ? 'text-black' : 'text-neutral-500'}`}>
          {positive ? <TrendingUp size={12} className="text-black" /> : <TrendingDown size={12} className="text-neutral-500" />}
          <span>{positive ? '+' : '-'}{change}% vs tháng trước</span>
        </div>
      </div>

      <div className="w-10 h-10 rounded-none border border-neutral-200 bg-neutral-50 flex items-center justify-center flex-shrink-0 text-black">
        <Icon size={18} />
      </div>
    </div>
  );
}
