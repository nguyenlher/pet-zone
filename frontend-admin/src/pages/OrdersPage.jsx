// src/pages/OrdersPage.jsx
import { useState, useMemo } from 'react';
import { ShoppingCart, CheckCircle2, Clock } from 'lucide-react';
import OrdersTable from '../components/OrdersTable';
import OrderDetailPanel from '../components/OrderDetailPanel';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { useOrders, useUpdateOrderStatus, useDeleteOrder } from '../hooks/useOrders';

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOption, setSortOption] = useState('createdAt,desc');
  const [pageSize, setPageSize] = useState(10);

  const { data: ordersData, isLoading, error } = useOrders(page, pageSize);
  const updateStatusMutation = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();

  const ordersList = useMemo(() => {
    return Array.isArray(ordersData) ? ordersData : (ordersData?.content || []);
  }, [ordersData]);

  const filteredOrders = useMemo(() => {
    let result = [...ordersList];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((order) => {
        const orderId = (order.orderId || order.id || '').toLowerCase();
        const customerName = order.user 
          ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.toLowerCase().trim() || 'khách vãng lai'
          : 'khách vãng lai';
        const customerEmail = order.user?.email?.toLowerCase() || '';
        
        return orderId.includes(q) || 
               customerName.includes(q) || 
               customerEmail.includes(q);
      });
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((order) => order.orderStatus === statusFilter);
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
  }, [ordersList, searchQuery, statusFilter, sortOption]);

  const stats = useMemo(() => {
    const total = ordersData?.totalElements || ordersList.length;
    const completed = ordersList.filter(o => o.orderStatus === 'DELIVERED').length;
    const pending = ordersList.filter(o => o.orderStatus === 'PENDING' || o.orderStatus === 'PENDING_PAYMENT').length;

    return [
      { label: 'TỔNG ĐƠN HÀNG', value: total, icon: ShoppingCart },
      { label: 'ĐÃ GIAO HÀNG', value: completed, icon: CheckCircle2 },
      { label: 'ĐANG CHỜ XỬ LÝ', value: pending, icon: Clock },
    ];
  }, [ordersData, ordersList]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setSortOption('createdAt,desc');
  };

  const handleExportCSV = () => {
    console.log('Exporting orders to CSV...');
  };

  const handleUpdateStatus = (order) => {
    setOrderToUpdate(order);
  };

  const handleStatusSubmit = async (newStatus) => {
    if (!orderToUpdate) return;
    
    const updateId = orderToUpdate.orderId || orderToUpdate.id;
    try {
      await updateStatusMutation.mutateAsync({
        orderId: updateId,
        status: newStatus,
      });
      setOrderToUpdate(null);
      // Close detail panel if it's the same order
      const currentSelectedId = selectedOrder?.orderId || selectedOrder?.id;
      if (currentSelectedId === updateId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrderMutation.mutateAsync(orderId);
      // Close detail panel if it's the deleted order
      const currentSelectedId = selectedOrder?.orderId || selectedOrder?.id;
      if (currentSelectedId === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert(error.response?.data?.message || 'Không thể xóa đơn hàng');
    }
  };

  const handleBulkDeleteOrders = async (orderIds) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${orderIds.length} đơn hàng đã chọn?`)) {
      try {
        await Promise.all(orderIds.map(id => deleteOrderMutation.mutateAsync(id)));
        if (selectedOrder && orderIds.includes(selectedOrder.orderId || selectedOrder.id)) {
          setSelectedOrder(null);
        }
      } catch (err) {
        console.error('Failed to delete some orders:', err);
        alert('Một số đơn hàng không thể xóa (chỉ đơn hàng ĐÃ HỦY hoặc THANH TOÁN THẤT BẠI mới có thể xóa)');
      }
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="border border-red-200 bg-red-50 p-5 rounded-none text-xs font-mono text-red-700">
          LỖI KHI TẢI DANH SÁCH ĐƠN HÀNG: {error.message}
        </div>
      </div>
    );
  }

  const isFiltered = Boolean(searchQuery || statusFilter !== 'ALL' || sortOption !== 'createdAt,desc');

  return (
    <div className="flex flex-col gap-6">
      {/* Header stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-none border border-neutral-200 p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">{s.label}</p>
              <p className="text-2xl font-bold font-mono text-black">{s.value}</p>
            </div>
            <div className="w-10 h-10 border border-neutral-200 bg-neutral-50 flex items-center justify-center">
              <s.icon size={18} className="text-neutral-700" />
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table with Column-based Filters */}
      <OrdersTable 
        orders={filteredOrders}
        totalCount={ordersData?.totalElements || filteredOrders.length}
        isLoading={isLoading}
        totalPages={ordersData?.totalPages || Math.ceil((filteredOrders.length || 1) / pageSize)}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRowClick={setSelectedOrder}
        onUpdateStatus={handleUpdateStatus}
        onDeleteOrder={handleDeleteOrder}
        onBulkDeleteOrders={handleBulkDeleteOrders}
        onExportCSV={handleExportCSV}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
      />

      {selectedOrder && (
        <OrderDetailPanel 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteOrder}
        />
      )}

      {orderToUpdate && (
        <UpdateStatusModal
          order={orderToUpdate}
          onClose={() => setOrderToUpdate(null)}
          onSubmit={handleStatusSubmit}
        />
      )}
    </div>
  );
}
