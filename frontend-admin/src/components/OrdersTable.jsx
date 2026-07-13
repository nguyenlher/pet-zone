// src/components/OrdersTable.jsx
import { useState, useCallback } from 'react';
import { MoreHorizontal, Edit, Trash2, RotateCcw, ShoppingCart } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { ColumnFilter, ColumnSort, CardHeaderSearch } from './TableControls';

// Format VND currency
const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

import { ORDER_STATUSES } from '../constants/orderFilters';
import Pagination from './Pagination';

export default function OrdersTable({ 
  orders = [], 
  totalCount,
  isLoading, 
  totalPages, 
  currentPage = 0, 
  pageSize = 10,
  onPageChange, 
  onPageSizeChange,
  onRowClick,
  onUpdateStatus,
  onDeleteOrder,
  onBulkDeleteOrders,
  onExportCSV,
  searchQuery = '',
  onSearchChange,
  statusFilter = 'ALL',
  onStatusFilterChange,
  sortOption = 'createdAt,desc',
  onSortChange,
  onResetFilters,
  isFiltered = false,
}) {
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

  const selectAll = selectedIds.size === orders.length && orders.length > 0;

  const toggleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orders.map((o) => o.orderId || o.id)));
    }
  }, [selectAll, orders]);

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
      alert('Chỉ đơn hàng có trạng thái ĐÃ HỦY hoặc THANH TOÁN THẤT BẠI mới có thể xóa');
      return;
    }
    
    const orderId = order.orderId || order.id;
    if (window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${orderId ? orderId.substring(0, 8).toUpperCase() : ''}?`)) {
      onDeleteOrder(orderId);
    }
  };

  const canDelete = (status) => {
    return status === 'CANCELLED' || status === 'PAYMENT_FAILED';
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
      {/* Table Card Header with Search and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-neutral-200 gap-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Danh sách đơn hàng</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Quản lý và theo dõi quy trình giao dịch &amp; vận chuyển</p>
        </div>

        {selectedIds.size > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-600 font-medium">Đã chọn {selectedIds.size} đơn</span>
            <button
              onClick={() => onBulkDeleteOrders && onBulkDeleteOrders(Array.from(selectedIds))}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Xóa đã chọn</span>
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-2.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 font-medium transition-colors cursor-pointer"
            >
              Bỏ chọn
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            {onSearchChange && (
              <CardHeaderSearch 
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Tìm mã đơn, khách hàng, email..."
              />
            )}
            <button 
              onClick={onExportCSV}
              className="px-3.5 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Xuất file CSV
            </button>
          </div>
        )}
      </div>

      {/* Table with Header Column Filters */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-semibold text-neutral-600">
              <th className="px-4 py-3 w-12 text-center text-neutral-400 font-mono font-medium">#</th>
              <th className="px-4 py-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-neutral-300 accent-neutral-900 cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 w-36">Mã đơn hàng</th>
              <th className="px-4 py-3 min-w-[200px]">Khách hàng</th>
              <th className="px-4 py-3 w-44">
                <ColumnFilter 
                  label="Trạng thái"
                  activeValue={statusFilter}
                  options={ORDER_STATUSES}
                  onChange={onStatusFilterChange}
                />
              </th>
              <th className="px-4 py-3 w-40">
                <ColumnSort 
                  label="Tổng tiền"
                  sortField="totalAmount"
                  currentSort={sortOption}
                  onSort={onSortChange}
                />
              </th>
              <th className="px-4 py-3 w-44">
                <ColumnSort 
                  label="Ngày tạo"
                  sortField="createdAt"
                  currentSort={sortOption}
                  onSort={onSortChange}
                />
              </th>
              <th className="px-4 py-3 w-12 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-12">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-7 w-7 border-2 border-neutral-900 border-t-transparent mx-auto mb-2" />
                  </div>
                  <span className="text-xs text-neutral-500 font-medium">Đang tải danh sách đơn hàng...</span>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-neutral-400">
                  <ShoppingCart size={32} className="stroke-[1.5] mx-auto mb-2 text-neutral-300" />
                  <p className="text-xs font-medium text-neutral-500">
                    Không tìm thấy đơn hàng nào phù hợp
                  </p>
                  {isFiltered && (
                    <button
                      onClick={onResetFilters}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer"
                    >
                      <RotateCcw size={12} /> Đặt lại bộ lọc
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              orders.map((order, index) => {
                const orderId = order.orderId || order.id;
                const isSelected = selectedIds.has(orderId);
                const itemNumber = (currentPage || 0) * (pageSize || 20) + index + 1;
                return (
                  <tr
                    key={orderId || index}
                    onClick={() => onRowClick(order)}
                    className={`cursor-pointer transition-colors duration-100 ${
                      isSelected ? 'bg-neutral-50' : 'hover:bg-neutral-50/70'
                    }`}
                  >
                    <td className="px-4 py-3.5 text-xs font-mono text-neutral-400 text-center font-medium tabular-nums w-12">
                      {String(itemNumber).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-3.5 text-center w-10" onClick={(e) => { e.stopPropagation(); toggleSelect(orderId); }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(orderId)}
                        className="w-4 h-4 rounded border-neutral-300 accent-neutral-900 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-neutral-900 whitespace-nowrap w-36">
                      #{orderId ? orderId.substring(0, 8).toUpperCase() : 'N/A'}
                    </td>
                    <td className="px-4 py-3.5 min-w-[200px]">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-neutral-900">
                          {order.user 
                            ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'Khách vãng lai'
                            : 'Khách vãng lai'}
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {order.user?.email || order.shippingAddress?.phone || 'Chưa có liên hệ'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap w-44">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-neutral-900 tabular-nums whitespace-nowrap w-40">
                      {formatVND(order.totalAmount || 0)}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-neutral-500 font-mono whitespace-nowrap w-44">
                      {order.createdAt 
                        ? new Date(order.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right relative w-12" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block text-left">
                        <button
                          onClick={(e) => toggleMenu(e, orderId)}
                          className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {activeMenuId === orderId && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                            <div className="absolute right-0 top-8 w-40 bg-white rounded-md shadow-lg border border-neutral-200 py-1 z-20">
                              <button
                                onClick={(e) => handleUpdateStatus(e, order)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                              >
                                <Edit size={14} /> Cập nhật trạng thái
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, order)}
                                disabled={!canDelete(order.orderStatus)}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors ${
                                  canDelete(order.orderStatus)
                                    ? 'text-red-600 hover:bg-red-50 cursor-pointer'
                                    : 'text-neutral-300 cursor-not-allowed'
                                }`}
                                title={!canDelete(order.orderStatus) ? 'Chỉ đơn hàng CANCELLED hoặc PAYMENT_FAILED mới có thể xoá' : ''}
                              >
                                <Trash2 size={14} /> Xoá đơn hàng
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
      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount || orders.length}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          itemName="đơn hàng"
        />
      )}
    </div>
  );
}
