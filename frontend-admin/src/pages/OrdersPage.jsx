// src/pages/OrdersPage.jsx
import { useState } from 'react';
import OrdersTable from '../components/OrdersTable';
import OrderDetailPanel from '../components/OrderDetailPanel';
import { useOrders } from '../hooks/useOrders';

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { data: ordersData, isLoading, error } = useOrders(page, pageSize);

  const handleExportCSV = () => {
    // TODO: Implement CSV export functionality
    console.log('Exporting orders to CSV...');
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
      />

      {selectedOrder && (
        <OrderDetailPanel order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
