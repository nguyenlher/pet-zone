// src/pages/OrdersPage.jsx
import { useState } from 'react';
import OrdersTable from '../components/OrdersTable';
import OrderDetailPanel from '../components/OrderDetailPanel';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { useOrders, useUpdateOrderStatus, useDeleteOrder } from '../hooks/useOrders';

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { data: ordersData, isLoading, error } = useOrders(page, pageSize);
  const updateStatusMutation = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();

  const handleExportCSV = () => {
    // TODO: Implement CSV export functionality
    console.log('Exporting orders to CSV...');
  };

  const handleUpdateStatus = (order) => {
    setOrderToUpdate(order);
  };

  const handleStatusSubmit = async (newStatus) => {
    if (!orderToUpdate) return;
    
    try {
      await updateStatusMutation.mutateAsync({
        orderId: orderToUpdate.orderId,
        status: newStatus,
      });
      setOrderToUpdate(null);
      // Close detail panel if it's the same order
      if (selectedOrder?.orderId === orderToUpdate.orderId) {
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
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert(error.response?.data?.message || 'Failed to delete order');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">Error loading orders: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mt-0.5">Manage and track all customer orders</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors duration-150 cursor-pointer shadow-sm shadow-emerald-500/30"
        >
          Export CSV
        </button>
      </div>

      <OrdersTable 
        orders={ordersData?.content || []}
        isLoading={isLoading}
        totalPages={ordersData?.totalPages || 0}
        currentPage={page}
        onPageChange={setPage}
        onRowClick={setSelectedOrder}
        onUpdateStatus={handleUpdateStatus}
        onDeleteOrder={handleDeleteOrder}
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
