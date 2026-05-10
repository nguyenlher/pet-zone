// src/components/SalesChart.jsx
import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { useSalesChartData } from '../hooks/useStatistics';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: entry.color }} />
            <span className="text-gray-300 capitalize">{entry.name}:</span>
            <span className="font-semibold">${entry.value?.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const formatYAxis = (value) => {
  if (value >= 1000) return `${value / 1000}k`;
  return value;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function SalesChart() {
  const [range, setRange] = useState('This Week');
  const [showDropdown, setShowDropdown] = useState(false);

  const ranges = ['This Week', 'This Month', 'This Quarter', 'This Year'];

  // Calculate date range based on selection
  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    let start, end;

    switch (range) {
      case 'This Week':
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        end = today;
        break;
      case 'This Month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = today;
        break;
      case 'This Quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        end = today;
        break;
      case 'This Year':
        start = new Date(today.getFullYear(), 0, 1);
        end = today;
        break;
      default:
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        end = today;
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }, [range]);

  const { data: salesData, isLoading } = useSalesChartData(startDate, endDate);

  // Format chart data
  const chartData = useMemo(() => {
    if (!salesData?.data) return [];
    return salesData.data.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      income: item.income,
      expenses: item.expenses,
    }));
  }, [salesData]);

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!salesData?.metrics) return [];
    const { totalIncome, totalExpenses, netProfit, profitMargin } = salesData.metrics;
    
    return [
      { 
        label: 'Income', 
        value: formatCurrency(totalIncome), 
        change: `${profitMargin >= 0 ? '+' : ''}${profitMargin}%`, 
        positive: profitMargin >= 0 
      },
      { 
        label: 'Expenses', 
        value: formatCurrency(totalExpenses), 
        change: '+0.00%', 
        positive: true 
      },
      { 
        label: 'Net Profit', 
        value: formatCurrency(netProfit), 
        change: `${profitMargin >= 0 ? '+' : ''}${profitMargin}%`, 
        positive: netProfit >= 0 
      },
    ];
  }, [salesData]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-center h-96">
        <div className="text-gray-500">Loading sales data...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Sales Analytics</h2>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
          >
            {range}
            <ChevronDown size={14} />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-9 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden min-w-[140px]">
              {ranges.map((r) => (
                <button
                  key={r}
                  onClick={() => { setRange(r); setShowDropdown(false); }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${r === range ? 'text-emerald-600 font-semibold' : 'text-gray-700'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center gap-6 flex-wrap">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-400 font-medium">{metric.label}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-gray-900">{metric.value}</span>
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${metric.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                <TrendingUp size={10} />
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-52" style={{ minHeight: '208px', width: '100%' }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2.5} fill="url(#incomeGrad)" dot={false} activeDot={{ r: 5, fill: '#10B981' }} />
              <Area type="monotone" dataKey="expenses" stroke="#6366F1" strokeWidth={2} fill="url(#expensesGrad)" dot={false} activeDot={{ r: 5, fill: '#6366F1' }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No data available for selected period
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-500">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-xs text-gray-500">Expenses</span>
        </div>
      </div>
    </div>
  );
}
