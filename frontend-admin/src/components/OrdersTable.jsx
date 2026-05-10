// src/components/OrdersTable.jsx
import { useState, useCallback, useMemo } from 'react';
import { ChevronDown, MoreHorizontal, Search, X, Edit, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

const STATUSES = [
  { value: 'ALL', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PENDING_PAYMENT', label: 'Pending Payment' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' },
];

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Newest First' },
  { value: 'createdAt,asc', label: 'Oldest First' },
  { value: 'totalAmount,desc', label: 'Highest Amount' },
  { value: 'totalAmount,asc', label: 'Lowest Amount' },
];

const PRICE_RANGES = [
  { value: 'ALL', label: 'All Prices', min: 0, max: Infinity },
  { value: '0-1000000', label: 'Under 1M VND', min: 0, max: 1000000 },
  { value: '1000000-5000000', label: '1M - 5M VND', min: 1000000, max: 5000000 },
  { value: '5000000-10000000', label: '5M - 10M VND', min: 5000000, max: 10000000 },
  { value: '10000000-999999999', label: 'Over 10M VND', min: 10000000, max: Infinity },
];

// Format VND currency
const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

function FilterDropdown({ value, options, onChange, label }) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value) || options[0];
  
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 cursor-pointer bg-white"
      >
        {selectedOption.label}
        <ChevronDown size={14} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-[180px] overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-100 cursor-pointer ${
                  opt.value === value ? 'text-emerald-600 font-semibold bg-emerald-50' : 'text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function OrdersTable({ 
  orders = [], 
  isLoading, 
  totalPages, 
  currentPage, 
  onPageChange, 
  onRowClick,
  onUpdateStatus,
  onDeleteOrder 
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priceRange, setPriceRange] = useState('ALL');
  const [sortOption, setSortOption] = useState('createdAt,desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeMenuId, setActiveMenuId] = useState(null);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((order) => {
        const orderId = order.orderId?.toLowerCase() || '';
        const customerName = order.user 
          ? `${order.user.firstName} ${order.user.lastName}`.toLowerCase()
          : '';
        const customerEmail = order.user?.email?.toLowerCase() || '';
        
        return orderId.includes(query) || 
               customerName.includes(query) || 
               customerEmail.includes(query);
      });
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((order) => order.orderStatus === statusFilter);
    }

    // Price range filter
    if (priceRange !== 'ALL') {
      const range = PRICE_RANGES.find(r => r.value === priceRange);
      if (range) {
        result = result.filter((order) => 
          order.totalAmount >= range.min && order.totalAmount <= range.max
        );
      }
    }

    // Sort
    const [sortField, sortDirection] = sortOption.split(',');
    result.sort((a, b) => {
      let aVal, bVal;
      
      if (sortField === 'createdAt') {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      } else if (sortField === 'totalAmount') {
        aVal = a.totalAmount || 0;
        bVal = b.totalAmount || 0;
      }
      
      return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
    });

    return result;
  }, [orders, searchQuery, statusFilter, priceRange, sortOption]);

  const selectAll = selectedIds.size === filteredOrders.length && filteredOrders.length > 0;

  const toggleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map((o) => o.orderId)));
    }
  }, [selectAll, filteredOrders]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const toggleMenu = (e, orderId) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === orderId ? null : orderId);
  };

  const handleUpdateStatus = (e, order) => {
    e.stopPropagation();
    setActiveMenuId(null);
    onUpdateStatus(order);
  };

  const handleDelete = (e, order) => {
    e.stopPropagation();
    setActiveMenuId(null);
    
    // Check if order can be deleted
    if (order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'PAYMENT_FAILED') {
      alert('Only orders with status CANCELLED or PAYMENT_FAILED can be deleted');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete order #${order.orderId.substring(0, 8).toUpperCase()}?`)) {
      onDeleteOrder(order.orderId);
    }
  };

  const canDelete = (status) => {
    return status === 'CANCELLED' || status === 'PAYMENT_FAILED';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search Bar */}
      <div className="p-5 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Customer name, or Email..."
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <FilterDropdown 
            value={statusFilter} 
            options={STATUSES} 
            onChange={setStatusFilter}
            label="Status"
          />
          <FilterDropdown 
            value={priceRange} 
            options={PRICE_RANGES} 
            onChange={setPriceRange}
            label="Price Range"
          />
        </div>
        <FilterDropdown 
          value={sortOption} 
          options={SORT_OPTIONS} 
          onChange={setSortOption}
          label="Sort"
        />
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
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                  </div>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                  {searchQuery ? 'No orders found matching your search' : 'No orders match the current filters'}
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
                      <span className="text-sm font-semibold text-gray-900">
                        #{order.orderId ? order.orderId.substring(0, 8).toUpperCase() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {order.user ? (
                          <>
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ 
                                background: ['#F87171', '#60A5FA', '#34D399', '#A78BFA', '#FB923C', '#F472B6'][
                                  Math.abs(order.user.id?.charCodeAt(0) || 0) % 6
                                ]
                              }}
                            >
                              {`${order.user.firstName?.[0] || ''}${order.user.lastName?.[0] || ''}`}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-gray-900">
                                {order.user.firstName} {order.user.lastName}
                              </span>
                              <span className="text-xs text-gray-400">{order.user.email}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ background: '#9CA3AF' }}
                            >
                              ?
                            </div>
                            <span className="text-sm font-medium text-gray-500">Unknown User</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatVND(order.totalAmount || 0)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button 
                          onClick={(e) => toggleMenu(e, order.orderId)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-150 cursor-pointer"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {activeMenuId === order.orderId && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                            <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                              <button
                                onClick={(e) => handleUpdateStatus(e, order)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Edit size={16} /> Update Status
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, order)}
                                disabled={!canDelete(order.orderStatus)}
                                className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                                  canDelete(order.orderStatus)
                                    ? 'text-red-600 hover:bg-red-50 cursor-pointer'
                                    : 'text-gray-400 cursor-not-allowed opacity-50'
                                }`}
                                title={!canDelete(order.orderStatus) ? 'Only CANCELLED or PAYMENT_FAILED orders can be deleted' : ''}
                              >
                                <Trash2 size={16} /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/30">
        <span className="text-xs text-gray-400">
          Showing {filteredOrders.length} of {orders.length} orders
          {selectedIds.size > 0 && ` • ${selectedIds.size} selected`}
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-xs text-gray-600 px-2">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
