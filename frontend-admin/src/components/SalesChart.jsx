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
      <div className="bg-black text-white px-3 py-2 rounded-none border border-neutral-800 shadow-xl text-xs font-mono">
        <p className="font-bold mb-1 uppercase tracking-wider">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} className="flex items-center justify-between gap-4">
            <span className="text-neutral-400 capitalize">{entry.name}:</span>
            <span className="font-bold">${entry.value?.toLocaleString()}</span>
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
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
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
      date: new Date(item.date).toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' }),
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
        label: 'Doanh Thu', 
        value: formatCurrency(totalIncome), 
        change: `${profitMargin >= 0 ? '+' : ''}${profitMargin}%`, 
        positive: profitMargin >= 0 
      },
      { 
        label: 'Chi Phí', 
        value: formatCurrency(totalExpenses), 
        change: '+0.00%', 
        positive: true 
      },
      { 
        label: 'Lợi Nhuận Ròng', 
        value: formatCurrency(netProfit), 
        change: `${profitMargin >= 0 ? '+' : ''}${profitMargin}%`, 
        positive: netProfit >= 0 
      },
    ];
  }, [salesData]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm flex items-center justify-center h-96">
        <div className="text-xs text-neutral-400 font-medium">Đang nạp dữ liệu biểu đồ...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm flex flex-col gap-5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <h2 className="text-sm font-semibold text-neutral-900">Phân Tích Doanh Thu</h2>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 text-xs font-medium text-neutral-800 border border-neutral-200 rounded-md px-3 py-1.5 hover:bg-neutral-50 transition-colors duration-150 cursor-pointer bg-white"
          >
            <span>{range}</span>
            <ChevronDown size={13} className="text-neutral-400" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-9 bg-white border border-neutral-200 rounded-md shadow-lg z-10 min-w-[140px] p-1">
              {ranges.map((r) => (
                <button
                  key={r}
                  onClick={() => { setRange(r); setShowDropdown(false); }}
                  className={`block w-full text-left px-3 py-1.5 text-xs font-medium rounded-md hover:bg-neutral-100 transition-colors duration-150 cursor-pointer ${
                    r === range ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-700'
                  }`}
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
            <span className="text-xs text-neutral-500 font-medium">{metric.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-neutral-900 font-mono tabular-nums tracking-tight">{metric.value}</span>
              <span className={`text-xs font-mono font-medium flex items-center gap-0.5 ${metric.positive ? 'text-emerald-700' : 'text-neutral-500'}`}>
                <TrendingUp size={11} />
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-56" style={{ minHeight: '224px', width: '100%' }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000000" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#737373" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#737373" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#737373' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 10, fill: '#737373' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#000000" strokeWidth={2} fill="url(#incomeGrad)" dot={false} activeDot={{ r: 4, fill: '#000000' }} />
              <Area type="monotone" dataKey="expenses" stroke="#737373" strokeWidth={1.5} fill="url(#expensesGrad)" dot={false} activeDot={{ r: 4, fill: '#737373' }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-xs font-mono text-neutral-400">
            Không có dữ liệu trong khoảng thời gian đã chọn
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 pt-2 border-t border-neutral-100 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-black rounded-none" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-black">Doanh thu</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-neutral-400 rounded-none" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Chi phí</span>
        </div>
      </div>
    </div>
  );
}
