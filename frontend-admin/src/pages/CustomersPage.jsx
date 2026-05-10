// src/pages/CustomersPage.jsx
import { useState } from 'react';
import { Users, UserPlus, TrendingUp, Search, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useUsers, useSearchUsers, useUserStatistics, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
import CustomerModal from '../components/CustomerModal';

export default function CustomersPage() {
  const [page, setPage] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [togglingUserId, setTogglingUserId] = useState(null);
  const pageSize = 20;

  // Mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Fetch data
  const { data: userStats } = useUserStatistics();
  const { data: usersData, isLoading } = searchKeyword 
    ? useSearchUsers(searchKeyword, page, pageSize)
    : useUsers(page, pageSize);

  const users = usersData?.content || [];
  const totalPages = usersData?.totalPages || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKeyword(searchInput);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchKeyword('');
    setPage(0);
  };

  const handleAddCustomer = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleToggleActive = async (userId, currentStatus) => {
    // Prevent double click
    if (togglingUserId === userId) {
      console.log('Already toggling, ignoring click');
      return;
    }
    
    console.log('Toggle clicked for user:', userId, 'Current status:', currentStatus, 'Will change to:', !currentStatus);
    setTogglingUserId(userId);
    try {
      const result = await updateUserMutation.mutateAsync({ 
        userId, 
        data: { isActive: !currentStatus } 
      });
      console.log('Toggle success! API response:', result);
      console.log('New isActive value from API:', result?.isActive);
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      console.error('Error details:', error.response?.data);
      alert(`Failed to update user status: ${error.response?.data?.message || error.message}`);
    } finally {
      setTogglingUserId(null);
    }
  };

  const handleDeleteCustomer = async (userId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteUserMutation.mutateAsync(userId);
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user');
      }
    }
    setActiveMenuId(null);
  };

  const handleModalSubmit = async (data) => {
    try {
      if (editingUser) {
        await updateUserMutation.mutateAsync({ userId: editingUser.id, data });
      } else {
        await createUserMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save user:', error);
      alert('Failed to save user');
    }
  };

  const toggleMenu = (e, userId) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === userId ? null : userId);
  };

  const stats = [
    { 
      label: 'Total Customers', 
      value: userStats?.totalCustomers || '0', 
      icon: Users, 
      color: 'bg-purple-100', 
      iconColor: 'text-purple-600' 
    },
    { 
      label: 'New This Month', 
      value: `+${userStats?.newThisMonth || 0}`, 
      icon: UserPlus, 
      color: 'bg-emerald-100', 
      iconColor: 'text-emerald-600' 
    },
    { 
      label: 'Retention Rate', 
      value: `${userStats?.retentionRate || 0}%`, 
      icon: TrendingUp, 
      color: 'bg-blue-100', 
      iconColor: 'text-blue-600' 
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center`}>
              <s.icon size={20} className={s.iconColor} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search customers by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors duration-150"
          >
            Search
          </button>
          {searchKeyword && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-150"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">All Customers</h2>
          <button 
            onClick={handleAddCustomer}
            className="px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors duration-150 cursor-pointer"
          >
            Add Customer
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500">Loading customers...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500">
              {searchKeyword ? 'No customers found matching your search' : 'No customers yet'}
            </div>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Orders</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Spent</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Active</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;
                  const colors = ['#F87171', '#60A5FA', '#34D399', '#A78BFA', '#FB923C', '#F472B6'];
                  const color = colors[Math.abs(user.id?.charCodeAt(0) || 0) % colors.length];

                  return (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-100 cursor-pointer">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" 
                            style={{ background: color }}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-700 font-medium">{user.totalOrders || 0}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">
                        ${(user.totalSpent || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          disabled={togglingUserId === user.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Toggle clicked for user:', user.id, 'Current status:', user.isActive);
                            handleToggleActive(user.id, user.isActive);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                            togglingUserId === user.id 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'cursor-pointer'
                          } ${
                            user.isActive ? 'bg-emerald-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              user.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-right relative">
                        <button
                          onClick={(e) => toggleMenu(e, user.id)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {activeMenuId === user.id && (
                          <div className="absolute right-8 top-10 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEditCustomer(user); }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Edit size={16} /> Edit
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteCustomer(user.id); }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {page + 1} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingUser}
        title={editingUser ? "Edit Customer" : "Add Customer"}
      />
    </div>
  );
}
