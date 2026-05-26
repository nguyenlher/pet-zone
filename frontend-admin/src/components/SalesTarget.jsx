// src/components/SalesTarget.jsx
import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useOrderStats } from '../hooks/useStatistics';

const OUTER_COLORS = ['#10B981', '#F3F4F6'];
const INNER_COLORS = ['#6366F1', '#F3F4F6'];

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
        outerData: [{ name: 'Monthly Progress', value: 0 }, { name: 'Remaining', value: 100 }],
        innerData: [{ name: 'Daily Progress', value: 0 }, { name: 'Remaining', value: 100 }],
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
    const dailyAchieved = Math.floor(monthlyAchieved / today.getDate()); // Average per day
    const dailyPct = Math.min(100, Math.round((dailyAchieved / dailyTarget) * 100));

    return {
      outerData: [
        { name: 'Monthly Progress', value: monthlyPct },
        { name: 'Remaining', value: 100 - monthlyPct },
      ],
      innerData: [
        { name: 'Daily Progress', value: dailyPct },
        { name: 'Remaining', value: 100 - dailyPct },
      ],
      monthlyProgress: monthlyPct,
      dailyProgress: dailyPct,
    };
  }, [orderStats, today]);

  const currentMonth = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-center h-96">
        <div className="text-gray-500">Loading target data...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Sales Target</h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{currentMonth}</span>
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
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-900">{monthlyProgress}%</span>
          <span className="text-xs text-gray-400">Achieved</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-gray-500">Monthly</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-gray-500">Daily</span>
        </div>
      </div>

      {/* Targets */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
          <div>
            <p className="text-xs text-gray-400 font-medium">Daily Target</p>
            <p className="text-lg font-bold text-gray-900">{orderStats?.completedOrders ? Math.floor(orderStats.completedOrders / today.getDate()) : 0}</p>
          </div>
          <div className={`flex items-center gap-1 text-xs font-semibold ${dailyProgress >= 50 ? 'text-emerald-500' : 'text-red-500'}`}>
            {dailyProgress >= 50 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{dailyProgress >= 50 ? '+' : '-'}{Math.abs(dailyProgress - 50)}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
          <div>
            <p className="text-xs text-gray-400 font-medium">Monthly Target</p>
            <p className="text-lg font-bold text-gray-900">{orderStats?.completedOrders || 0}</p>
          </div>
          <div className={`flex items-center gap-1 text-xs font-semibold ${monthlyProgress >= 50 ? 'text-emerald-500' : 'text-red-500'}`}>
            {monthlyProgress >= 50 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{monthlyProgress >= 50 ? '+' : '-'}{Math.abs(monthlyProgress - 50)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
