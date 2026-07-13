// src/components/SalesTarget.jsx
import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useOrderStats } from '../hooks/useStatistics';

const OUTER_COLORS = ['#000000', '#F5F5F5'];
const INNER_COLORS = ['#737373', '#F5F5F5'];

export default function SalesTarget() {
  // Get current month data
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startDate = startOfMonth.toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];

  const { data: orderStats, isLoading } = useOrderStats(startDate, endDate);

  // Calculate progress
  const { outerData, innerData, monthlyProgress, dailyProgress } = useMemo(() => {
    if (!orderStats) {
      return {
        outerData: [{ name: 'Mục tiêu tháng', value: 0 }, { name: 'Còn lại', value: 100 }],
        innerData: [{ name: 'Mục tiêu ngày', value: 0 }, { name: 'Còn lại', value: 100 }],
        monthlyProgress: 0,
        dailyProgress: 0,
      };
    }

    // Monthly target: assume 500 orders per month
    const monthlyTarget = 500;
    const monthlyAchieved = orderStats.completedOrders || 0;
    const monthlyPct = Math.min(100, Math.round((monthlyAchieved / monthlyTarget) * 100));

    // Daily target: assume 20 orders per day
    const dailyTarget = 20;
    const dailyAchieved = Math.floor(monthlyAchieved / today.getDate());
    const dailyPct = Math.min(100, Math.round((dailyAchieved / dailyTarget) * 100));

    return {
      outerData: [
        { name: 'Mục tiêu tháng', value: monthlyPct },
        { name: 'Còn lại', value: 100 - monthlyPct },
      ],
      innerData: [
        { name: 'Mục tiêu ngày', value: dailyPct },
        { name: 'Còn lại', value: 100 - dailyPct },
      ],
      monthlyProgress: monthlyPct,
      dailyProgress: dailyPct,
    };
  }, [orderStats, today]);

  const currentMonth = today.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm flex items-center justify-center h-96">
        <div className="text-xs text-neutral-400 font-medium">Đang nạp dữ liệu mục tiêu...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm flex flex-col gap-5 select-none">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <h2 className="text-sm font-semibold text-neutral-900">Mục Tiêu Doanh Số</h2>
        <span className="text-xs font-mono text-neutral-600 border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 rounded">
          {currentMonth}
        </span>
      </div>

      {/* Donut Chart */}
      <div className="flex items-center justify-center relative" style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            {/* Outer ring - Monthly */}
            <Pie
              data={outerData}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={78}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              {outerData.map((_, i) => (
                <Cell key={i} fill={OUTER_COLORS[i]} />
              ))}
            </Pie>
            {/* Inner ring - Daily */}
            <Pie
              data={innerData}
              cx="50%"
              cy="50%"
              innerRadius={36}
              outerRadius={54}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              {innerData.map((_, i) => (
                <Cell key={i} fill={INNER_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}%`, name]}
              contentStyle={{ borderRadius: '0px', border: '1px solid #262626', backgroundColor: '#000000', color: '#FFFFFF', fontSize: '11px', fontFamily: 'monospace' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-black font-mono tracking-tight">{monthlyProgress}%</span>
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Đạt được</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 text-xs py-1 border-t border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
          <span className="text-xs font-medium text-neutral-800">Tháng</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
          <span className="text-xs font-medium text-neutral-500">Ngày</span>
        </div>
      </div>

      {/* Targets */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between p-3 rounded-md bg-neutral-50 border border-neutral-100">
          <div>
            <p className="text-xs font-medium text-neutral-500">Mục tiêu ngày</p>
            <p className="text-sm font-bold text-neutral-900 font-mono tracking-tight mt-0.5">{orderStats?.completedOrders ? Math.floor(orderStats.completedOrders / today.getDate()) : 0} đơn</p>
          </div>
          <div className={`flex items-center gap-1 text-xs font-mono font-bold ${dailyProgress >= 50 ? 'text-emerald-700' : 'text-neutral-500'}`}>
            <TrendingUp size={13} />
            <span>{dailyProgress}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-md bg-neutral-50 border border-neutral-100">
          <div>
            <p className="text-xs font-medium text-neutral-500">Mục tiêu tháng</p>
            <p className="text-sm font-bold text-neutral-900 font-mono tracking-tight mt-0.5">{orderStats?.completedOrders || 0} / 500 đơn</p>
          </div>
          <div className={`flex items-center gap-1 text-xs font-mono font-bold ${monthlyProgress >= 50 ? 'text-emerald-700' : 'text-neutral-500'}`}>
            <TrendingUp size={13} />
            <span>{monthlyProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
