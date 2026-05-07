// src/components/SalesTarget.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const outerData = [
  { name: 'Monthly Progress', value: 72 },
  { name: 'Remaining', value: 28 },
];
const innerData = [
  { name: 'Daily Progress', value: 45 },
  { name: 'Remaining', value: 55 },
];

const OUTER_COLORS = ['#10B981', '#F3F4F6'];
const INNER_COLORS = ['#6366F1', '#F3F4F6'];

export default function SalesTarget() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Sales Target</h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">July 2024</span>
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
          <span className="text-2xl font-bold text-gray-900">72%</span>
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
            <p className="text-lg font-bold text-gray-900">650</p>
          </div>
          <div className="flex items-center gap-1 text-red-500 text-xs font-semibold">
            <TrendingDown size={14} />
            <span>-8%</span>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
          <div>
            <p className="text-xs text-gray-400 font-medium">Monthly Target</p>
            <p className="text-lg font-bold text-gray-900">14,500</p>
          </div>
          <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold">
            <TrendingUp size={14} />
            <span>+12%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
