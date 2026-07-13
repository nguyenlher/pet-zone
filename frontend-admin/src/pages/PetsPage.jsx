// src/pages/PetsPage.jsx
import { useState, useMemo } from 'react';
import { PawPrint, Plus, Dog, MoreVertical, Edit, Trash2, RotateCcw } from 'lucide-react';
import { usePets, useCreatePet, useUpdatePet, useDeletePet } from '../hooks/usePets';
import PetModal from '../components/PetModal';
import StatusBadge from '../components/StatusBadge';
import PetDetailDrawer from '../components/PetDetailDrawer';
import { petService } from '../services/petService';
import { ColumnFilter, ColumnSort, CardHeaderSearch } from '../components/TableControls';
import Pagination from '../components/Pagination';

const STATUSES = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'AVAILABLE', label: 'Sẵn sàng đón' },
  { value: 'SOLD', label: 'Đã bán' },
  { value: 'RESERVED', label: 'Đã giữ chỗ' },
];

const GENDERS = [
  { value: 'ALL', label: 'Tất cả giới tính' },
  { value: 'MALE', label: 'Đực' },
  { value: 'FEMALE', label: 'Cái' },
];

export default function PetsPage() {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [sortOption, setSortOption] = useState('createdAt,desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [pageSize, setPageSize] = useState(10);

  // Mutations
  const createPetMutation = useCreatePet();
  const updatePetMutation = useUpdatePet();
  const deletePetMutation = useDeletePet();

  // Fetch data
  const { data: petsData, isLoading, error, isError } = usePets(page, pageSize);

  const pets = useMemo(() => petsData?.content || [], [petsData]);
  const totalPages = petsData?.totalPages || 0;
  const totalElements = petsData?.totalElements || 0;

  // Filter and sort pets
  const filteredPets = useMemo(() => {
    let result = [...pets];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.breedName && p.breedName.toLowerCase().includes(q)) ||
        (p.petTypeName && p.petTypeName.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(p => p.status === statusFilter);
    }

    if (genderFilter !== 'ALL') {
      result = result.filter(p => p.gender === genderFilter);
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
  }, [pets, searchQuery, statusFilter, genderFilter, sortOption]);

  const selectAll = filteredPets.length > 0 && filteredPets.every(p => selectedIds.has(p.id));

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
      setSelectedIds(new Set(filteredPets.map(p => p.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.size} thú cưng đã chọn?`)) {
      try {
        await Promise.all(Array.from(selectedIds).map(id => deletePetMutation.mutateAsync(id)));
        if (selectedPet && selectedIds.has(selectedPet.id)) {
          setSelectedPet(null);
        }
        setSelectedIds(new Set());
      } catch (err) {
        console.error('Failed to delete pets:', err);
        alert('Không thể xóa một số thú cưng');
      }
    }
  };

  // Early return for error
  if (isError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-none p-5">
          <h2 className="text-red-900 font-bold uppercase tracking-wider text-xs mb-2">Lỗi khi tải dữ liệu thú cưng</h2>
          <p className="text-red-700 text-xs font-mono">{error?.message || 'Lỗi không xác định'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-black text-white text-xs uppercase font-bold tracking-widest rounded-none hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setGenderFilter('ALL');
    setSortOption('createdAt,desc');
  };

  const handleAddPet = () => {
    setEditingPet(null);
    setIsModalOpen(true);
  };

  const handleEditPet = async (pet) => {
    try {
      const fullPetData = await petService.getPetById(pet.id);
      if (!fullPetData.petTypeId && fullPetData.breedId) {
        try {
          const breedData = await petService.getBreedById(fullPetData.breedId);
          fullPetData.petTypeId = breedData.petTypeId;
        } catch (err) {
          console.error('Failed to fetch breed details:', err);
        }
      }
      setEditingPet(fullPetData);
      setIsModalOpen(true);
      setActiveMenuId(null);
    } catch (error) {
      console.error('Failed to fetch pet details:', error);
      alert('Không thể tải chi tiết thú cưng');
    }
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thú cưng này?')) {
      try {
        await deletePetMutation.mutateAsync(petId);
        if (selectedPet?.id === petId) {
          setSelectedPet(null);
        }
      } catch (error) {
        console.error('Failed to delete pet:', error);
        alert('Không thể xóa thú cưng');
      }
    }
    setActiveMenuId(null);
  };

  const handleModalSubmit = async (data) => {
    try {
      if (editingPet) {
        await updatePetMutation.mutateAsync({ id: editingPet.id, data });
      } else {
        await createPetMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
      setEditingPet(null);
    } catch (error) {
      console.error('Failed to save pet:', error);
      alert('Không thể lưu thông tin thú cưng');
    }
  };

  const toggleMenu = (e, petId) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === petId ? null : petId);
  };

  const stats = [
    { 
      label: 'TỔNG THÚ CƯNG', 
      value: totalElements, 
      icon: PawPrint, 
    },
    { 
      label: 'SẴN SÀNG ĐÓN', 
      value: pets.filter(p => p.status === 'AVAILABLE').length, 
      icon: Dog, 
    },
    { 
      label: 'ĐÃ BÁN', 
      value: pets.filter(p => p.status === 'SOLD').length, 
      icon: PawPrint, 
    },
  ];

  const isFiltered = Boolean(searchQuery || statusFilter !== 'ALL' || genderFilter !== 'ALL' || sortOption !== 'createdAt,desc');

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-none h-8 w-8 border-2 border-black border-t-transparent mx-auto mb-4" />
          <p className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Đang tải dữ liệu thú cưng...</p>
        </div>
      </div>
    );
  }

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

      {/* Pets Table with Column-based Filters */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-neutral-200 gap-4">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Danh sách thú cưng</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Quản lý thú cưng hiện có trong kho dữ liệu</p>
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
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Tìm tên, giống loài..."
              />
              <button 
                onClick={handleAddPet}
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
                <th className="px-5 py-3">
                  <ColumnFilter 
                    label="Thú cưng & Giới tính"
                    activeValue={genderFilter}
                    options={GENDERS}
                    onChange={setGenderFilter}
                  />
                </th>
                <th className="px-4 py-3">Loài</th>
                <th className="px-4 py-3">Giống</th>
                <th className="px-4 py-3">
                  <ColumnFilter 
                    label="Trạng thái"
                    activeValue={statusFilter}
                    options={STATUSES}
                    onChange={setStatusFilter}
                  />
                </th>
                <th className="px-4 py-3">
                  <ColumnSort 
                    label="Giá"
                    sortField="price"
                    currentSort={sortOption}
                    onSort={setSortOption}
                  />
                </th>
                <th className="px-4 py-3">
                  <ColumnSort 
                    label="Ngày thêm"
                    sortField="createdAt"
                    currentSort={sortOption}
                    onSort={setSortOption}
                  />
                </th>
                <th className="text-right px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-900 border-t-transparent mx-auto mb-3" />
                    <p className="text-xs font-medium text-neutral-500">Đang tải thú cưng...</p>
                  </td>
                </tr>
              ) : filteredPets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-neutral-400">
                    <PawPrint size={32} className="stroke-[1.5] mx-auto mb-2 text-neutral-300" />
                    <p className="text-xs font-medium text-neutral-500">
                      {searchQuery ? 'Không tìm thấy thú cưng nào phù hợp' : 'Không có thú cưng nào'}
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
                filteredPets.map((pet, index) => {
                    const isSelected = selectedPet?.id === pet.id;
                    const itemNumber = page * pageSize + index + 1;
                    return (
                      <tr 
                        key={pet.id} 
                        onClick={() => setSelectedPet(pet)}
                        className={`border-b border-neutral-100 hover:bg-neutral-50/70 transition-colors duration-100 cursor-pointer ${
                          isSelected ? 'bg-neutral-100/70' : ''
                        }`}
                      >
                        <td className="px-4 py-3.5 text-xs font-mono text-neutral-400 text-center font-semibold">
                          {String(itemNumber).padStart(2, '0')}
                        </td>
                        <td className="px-4 py-3.5" onClick={(e) => { e.stopPropagation(); toggleSelect(pet.id); }}>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(pet.id)}
                            onChange={() => {}}
                            className="w-4 h-4 rounded border-neutral-300 accent-neutral-900 cursor-pointer"
                          />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {pet.thumbnailUrl ? (
                              <img src={pet.thumbnailUrl} alt={pet.name} className="w-10 h-10 rounded-none border border-neutral-200 object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-none border border-neutral-200 bg-neutral-50 flex items-center justify-center">
                                <PawPrint size={18} className="text-neutral-400" />
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-bold text-black uppercase tracking-wider">{pet.name}</p>
                              <p className="text-[11px] text-neutral-400 font-mono">
                                {pet.gender === 'MALE' ? 'Đực' : pet.gender === 'FEMALE' ? 'Cái' : (pet.gender || 'Chưa rõ')} • {pet.ageInMonths || 0} tháng
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-neutral-700">{pet.petTypeName || '—'}</td>
                        <td className="px-4 py-3.5 text-xs text-neutral-700">{pet.breedName || '—'}</td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={pet.status} />
                        </td>
                        <td className="px-4 py-3.5 text-xs font-mono font-semibold text-black">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pet.price || 0)}
                        </td>
                        <td className="px-4 py-3.5 text-xs font-mono text-neutral-500">
                          {new Date(pet.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-4 py-3.5 text-right relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => toggleMenu(e, pet.id)}
                            className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-none transition-colors cursor-pointer"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeMenuId === pet.id && (
                            <div className="absolute right-8 top-10 w-36 bg-white rounded-none shadow-lg border border-neutral-200 py-1 z-20">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEditPet(pet); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer font-medium"
                              >
                                <Edit size={14} /> Chỉnh sửa
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeletePet(pet.id); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-medium"
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
                totalItems={totalElements || filteredPets.length}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                itemName="thú cưng"
              />
            )}
          </div>

      <PetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPet(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingPet}
        title={editingPet ? "Chỉnh sửa thú cưng" : "Thêm thú cưng mới"}
      />

      {selectedPet && (
        <PetDetailDrawer
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          onEdit={handleEditPet}
          onDelete={handleDeletePet}
        />
      )}
    </div>
  );
}
