// src/pages/CustomersPage.jsx
import { useState, useMemo } from 'react';
import { Users, UserPlus, Plus, TrendingUp, MoreVertical, Edit, Trash2, RotateCcw } from 'lucide-react';
import { useUsers, useSearchUsers, useUserStatistics, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
import CustomerModal from '../components/CustomerModal';
import CustomerDetailDrawer from '../components/CustomerDetailDrawer';
import { ColumnFilter, ColumnSort, CardHeaderSearch } from '../components/TableControls';
import Pagination from '../components/Pagination';

const STATUSES = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'INACTIVE', label: 'Đã tạm khóa' },
];

export default function CustomersPage() {
  const [page, setPage] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOption, setSortOption] = useState('createdAt,desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [togglingUserId, setTogglingUserId] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [pageSize, setPageSize] = useState(10);

  // Mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Fetch data
  const { data: userStats } = useUserStatistics();
  const allUsersQuery = useUsers(page, pageSize);
  const searchUsersQuery = useSearchUsers(searchKeyword, page, pageSize);

  const usersData = searchKeyword ? searchUsersQuery.data : allUsersQuery.data;
  const isLoading = searchKeyword ? searchUsersQuery.isLoading : allUsersQuery.isLoading;

  const users = useMemo(() => usersData?.content || [], [usersData]);
  const totalPages = usersData?.totalPages || 0;

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (statusFilter !== 'ALL') {
      const activeBool = statusFilter === 'ACTIVE';
      result = result.filter(u => u.isActive === activeBool);
    }

    const [sortField, sortDirection] = sortOption.split(',');
    result.sort((a, b) => {
      let aVal = a[sortField] || 0;
      let bVal = b[sortField] || 0;
      if (sortField === 'createdAt') {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      }
      return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
    });

    return result;
  }, [users, statusFilter, sortOption]);

  const selectAll = filteredUsers.length > 0 && filteredUsers.every(u => selectedIds.has(u.id));

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.size} khách hàng đã chọn?`)) {
      try {
        await Promise.all(Array.from(selectedIds).map(id => deleteUserMutation.mutateAsync(id)));
        if (selectedCustomer && selectedIds.has(selectedCustomer.id)) {
          setSelectedCustomer(null);
        }
        setSelectedIds(new Set());
      } catch (err) {
        console.error('Failed to delete customers:', err);
        alert('Không thể xóa một số khách hàng');
      }
    }
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setStatusFilter('ALL');
    setSortOption('createdAt,desc');
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
    if (togglingUserId === userId) return;
    
    setTogglingUserId(userId);
    try {
      await updateUserMutation.mutateAsync({ 
        userId, 
        data: { isActive: !currentStatus } 
      });
      if (selectedCustomer?.id === userId) {
        setSelectedCustomer(prev => ({ ...prev, isActive: !currentStatus }));
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      alert(`Không thể cập nhật trạng thái: ${error.response?.data?.message || error.message}`);
    } finally {
      setTogglingUserId(null);
    }
  };

  const handleDeleteCustomer = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      try {
        await deleteUserMutation.mutateAsync(userId);
        if (selectedCustomer?.id === userId) {
          setSelectedCustomer(null);
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Không thể xóa khách hàng');
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
      alert('Không thể lưu thông tin khách hàng');
    }
  };

  const toggleMenu = (e, userId) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === userId ? null : userId);
  };

  const stats = [
    { 
      label: 'TỔNG KHÁCH HÀNG', 
      value: userStats?.totalCustomers || '0', 
      icon: Users, 
    },
    { 
      label: 'MỚI TRONG THÁNG', 
      value: `+${userStats?.newThisMonth || 0}`, 
      icon: UserPlus, 
    },
    { 
      label: 'TỶ LỆ QUAY LẠI', 
      value: `${userStats?.retentionRate || 0}%`, 
      icon: TrendingUp, 
    },
  ];

  const isFiltered = Boolean(searchKeyword || statusFilter !== 'ALL' || sortOption !== 'createdAt,desc');

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

      {/* Customers Table with Column-based Filters */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-neutral-200 gap-4">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Tài khoản khách hàng</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Quản lý danh bạ người dùng &amp; trạng thái truy cập</p>
          </div>

          {selectedIds.size > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-600 font-medium">Đã chọn {selectedIds.size} mục</span>
              <button
                onClick={handleBulkDelete}
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
              <CardHeaderSearch 
                value={searchKeyword}
                onChange={(val) => {
                  setSearchKeyword(val);
                  setPage(0);
                }}
                placeholder="Tìm tên, email, số điện thoại..."
              />
              <button 
                onClick={handleAddCustomer}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-md transition-colors cursor-pointer shadow-sm shrink-0"
              >
                <Plus size={14} /> Thêm
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-semibold text-neutral-600">
                <th className="px-4 py-3 w-12 text-center text-neutral-400 font-mono font-medium">#</th>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-neutral-300 accent-neutral-900 cursor-pointer"
                  />
                </th>
                <th className="px-5 py-3">Khách hàng</th>
                <th className="px-4 py-3">
                  <ColumnSort 
                    label="Đơn hàng"
                    sortField="totalOrders"
                    currentSort={sortOption}
                    onSort={setSortOption}
                  />
                </th>
                <th className="px-4 py-3">
                  <ColumnSort 
                    label="Tổng chi tiêu"
                    sortField="totalSpent"
                    currentSort={sortOption}
                    onSort={setSortOption}
                  />
                </th>
                <th className="px-4 py-3">
                  <ColumnSort 
                    label="Ngày tham gia"
                    sortField="createdAt"
                    currentSort={sortOption}
                    onSort={setSortOption}
                  />
                </th>
                <th className="px-4 py-3">
                  <ColumnFilter 
                    label="Trạng thái"
                    activeValue={statusFilter}
                    options={STATUSES}
                    onChange={setStatusFilter}
                  />
                </th>
                <th className="text-right px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-900 border-t-transparent mx-auto mb-3" />
                    <p className="text-xs font-medium text-neutral-500">Đang tải khách hàng...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-neutral-400">
                    <Users size={32} className="stroke-[1.5] mx-auto mb-2 text-neutral-300" />
                    <p className="text-xs font-medium text-neutral-500">
                      {searchKeyword ? 'Không có khách hàng nào khớp với từ khóa' : 'Không tìm thấy khách hàng nào phù hợp'}
                    </p>
                    {isFiltered && (
                      <button
                        onClick={handleResetFilters}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer"
                      >
                        <RotateCcw size={12} /> Đặt lại bộ lọc
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => {
                    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
                    const isSelected = selectedCustomer?.id === user.id;
                    const itemNumber = page * pageSize + index + 1;

                    return (
                      <tr 
                        key={user.id} 
                        onClick={() => setSelectedCustomer(user)}
                        className={`border-b border-neutral-100 hover:bg-neutral-50/70 transition-colors duration-100 cursor-pointer ${
                          isSelected ? 'bg-neutral-100/70' : ''
                        }`}
                      >
                        <td className="px-4 py-3.5 text-xs font-mono text-neutral-400 text-center font-semibold">
                          {String(itemNumber).padStart(2, '0')}
                        </td>
                        <td className="px-4 py-3.5" onClick={(e) => { e.stopPropagation(); toggleSelect(user.id); }}>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(user.id)}
                            onChange={() => {}}
                            className="w-4 h-4 rounded border-neutral-300 accent-neutral-900 cursor-pointer"
                          />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-none bg-black flex items-center justify-center text-white text-[11px] font-mono font-bold flex-shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-black uppercase tracking-wider">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-[11px] text-neutral-400 font-mono">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs font-mono text-neutral-700 font-semibold">{user.totalOrders || 0}</td>
                        <td className="px-4 py-3.5 text-xs font-mono font-semibold text-black">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user.totalSpent || 0)}
                        </td>
                        <td className="px-4 py-3.5 text-xs font-mono text-neutral-500">
                          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={togglingUserId === user.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleActive(user.id, user.isActive);
                              }}
                              className={`relative inline-flex h-5 w-9 items-center rounded-none border transition-colors focus:outline-none ${
                                togglingUserId === user.id 
                                   ? 'opacity-40 cursor-not-allowed' 
                                  : 'cursor-pointer'
                              } ${
                                user.isActive ? 'bg-emerald-600 border-emerald-600' : 'bg-red-500 border-red-500'
                              }`}
                              title={user.isActive ? 'Nhấn để khóa tài khoản' : 'Nhấn để kích hoạt'}
                            >
                              <span
                                className={`inline-block h-3.5 w-3.5 transform bg-white transition-transform ${
                                  user.isActive ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                            <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                              user.isActive ? 'text-emerald-700' : 'text-red-600'
                            }`}>
                              {user.isActive ? 'HOẠT ĐỘNG' : 'TẠM KHÓA'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => toggleMenu(e, user.id)}
                            className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-none transition-colors cursor-pointer"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeMenuId === user.id && (
                            <div className="absolute right-8 top-10 w-36 bg-white rounded-none shadow-xl border border-neutral-200 py-1 z-20">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEditCustomer(user); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                              >
                                <Edit size={14} /> Chỉnh sửa
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteCustomer(user.id); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} /> Xóa
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!isLoading && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={usersData?.totalElements || filteredUsers.length}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                itemName="khách hàng"
              />
            )}
          </div>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingUser}
        title={editingUser ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
      />

      {selectedCustomer && (
        <CustomerDetailDrawer
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onEdit={handleEditCustomer}
          onToggleActive={handleToggleActive}
          onDelete={handleDeleteCustomer}
          isToggling={togglingUserId === selectedCustomer.id}
        />
      )}
    </div>
  );
}
