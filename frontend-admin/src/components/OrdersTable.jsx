// src/components/OrdersTable.jsx
import { useState, useCallback } from 'react';
import { ChevronDown, MoreHorizontal, ChevronUp } from 'lucide-react';
import StatusBadge from './StatusBadge';

const STATUSES = ['Any status', 'Paid', 'Delivered', 'Completed'];
const SORT_OPTIONS = ['Sort by Date', 'Date Ascending', 'Date Descending'];
const PRICE_RANGES = ['$100–$1500', '$100–$500', '$500–$1000', '$1000–$1500'];

function FilterDropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 cursor-pointer bg-white"
      >
        {value}
        <ChevronDown size={14} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[160px] overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-100 cursor-pointer ${opt === value ? 'text-emerald-600 font-semibold bg-emerald-50' : 'text-gray-700'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersTable({ orders = [], isLoading, totalPages, currentPage, onPageChange, onRowClick }) {
  const [statusFilter, setStatusFilter] = useState('Any status');
  const [priceRange, setPriceRange] = useState('$100–$1500');
  const [sortOption, setSortOption] = useState('Sort by Date');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map((o) => o.orderId)));
    }
    setSelectAll(!selectAll);
  }, [selectAll]);

  // Filter
  let filteredOrders = orders.filter((o) => {
    // Map backend status to string or adjust comparison
    const orderStatus = o.orderStatus ? o.orderStatus : 'Any status';
    if (statusFilter !== 'Any status' && orderStatus !== statusFilter.toUpperCase()) return false;
    
    const [min, max] = priceRange.replace('$', '').split('–').map(Number);
    if (o.totalAmount < min || o.totalAmount > max) return false;
    return true;
  });

  // Sort
  if (sortOption === 'Date Ascending') {
    filteredOrders = [...filteredOrders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sortOption === 'Date Descending') {
    filteredOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Filter Bar */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <FilterDropdown value={statusFilter} options={STATUSES} onChange={setStatusFilter} />
          <FilterDropdown value={priceRange} options={PRICE_RANGES} onChange={setPriceRange} />
        </div>
        <FilterDropdown value={sortOption} options={SORT_OPTIONS} onChange={setSortOption} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 cursor-pointer accent-gray-900"
                />
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Order #</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                  No orders match the current filters
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = selectedIds.has(order.orderId);
                return (
                  <tr
                    key={order.orderId}
                    onClick={() => onRowClick(order)}
                    className={`border-b border-gray-50 cursor-pointer transition-colors duration-100 ${
                      isSelected ? 'bg-emerald-50/50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-5 py-3.5" onClick={(e) => { e.stopPropagation(); toggleSelect(order.orderId); }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(order.orderId)}
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-gray-900"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-gray-900">{order.orderId ? order.orderId.substring(0, 8) : 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: '#10b981' }}
                        >
                          U
                        </div>
                        <span className="text-sm font-medium text-gray-800">User</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-gray-900">${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-150 cursor-pointer">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/30">
        <span className="text-xs text-gray-400">
          Showing {filteredOrders.length} of {orders.length} orders
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                p === 1 ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
