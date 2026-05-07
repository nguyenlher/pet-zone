// src/pages/PetsPage.jsx
import { useState } from 'react';
import { PawPrint, Plus, Search, Tag, Dog, Filter, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { usePets, useCreatePet, useUpdatePet, useDeletePet } from '../hooks/usePets';
import PetModal from '../components/PetModal';

export default function PetsPage() {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const pageSize = 10;

  // Mutations
  const createPetMutation = useCreatePet();
  const updatePetMutation = useUpdatePet();
  const deletePetMutation = useDeletePet();

  // Fetch data
  const { data: petsData, isLoading } = usePets(page, pageSize);

  const pets = petsData?.content || [];
  const totalPages = petsData?.totalPages || 0;
  const totalElements = petsData?.totalElements || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality can be implemented later if backend supports it
  };

  const handleClearSearch = () => {
    setSearchInput('');
  };

  const handleAddPet = () => {
    setEditingPet(null);
    setIsModalOpen(true);
  };

  const handleEditPet = (pet) => {
    setEditingPet(pet);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await deletePetMutation.mutateAsync(petId);
      } catch (error) {
        console.error('Failed to delete pet:', error);
        alert('Failed to delete pet');
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
    } catch (error) {
      console.error('Failed to save pet:', error);
      alert('Failed to save pet');
    }
  };

  const toggleMenu = (e, petId) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === petId ? null : petId);
  };

  const stats = [
    { 
      label: 'Total Pets', 
      value: totalElements, 
      icon: PawPrint, 
      color: 'bg-purple-100', 
      iconColor: 'text-purple-600' 
    },
    { 
      label: 'Available', 
      value: pets.filter(p => p.status === 'AVAILABLE').length, // Mock stat
      icon: Dog, 
      color: 'bg-emerald-100', 
      iconColor: 'text-emerald-600' 
    },
    { 
      label: 'Sold', 
      value: pets.filter(p => p.status === 'SOLD').length, // Mock stat
      icon: Tag, 
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
              placeholder="Search pets by name or breed..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            className="px-4 py-2.5 bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors duration-150 flex items-center gap-2"
          >
            <Filter size={16} /> Filters
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors duration-150"
          >
            Search
          </button>
        </form>
      </div>

      {/* Pets Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">All Pets</h2>
          <button 
            onClick={handleAddPet}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors duration-150 cursor-pointer"
          >
            <Plus size={16} /> Add Pet
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500">Loading pets...</div>
          </div>
        ) : pets.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500">
              No pets found
            </div>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pet</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Breed</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Added</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet) => {
                  return (
                    <tr key={pet.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-100 cursor-pointer">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {pet.mainImageUrl ? (
                            <img src={pet.mainImageUrl} alt={pet.name} className="w-10 h-10 rounded-xl object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                              <PawPrint size={20} className="text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{pet.name}</p>
                            <p className="text-xs text-gray-400">{pet.gender || 'Unknown'} • {pet.age || 0} months</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-700">{pet.breedName || 'N/A'}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          pet.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 
                          pet.status === 'SOLD' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {pet.status || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pet.price || 0)}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">
                        {new Date(pet.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 text-right relative">
                        <button
                          onClick={(e) => toggleMenu(e, pet.id)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {activeMenuId === pet.id && (
                          <div className="absolute right-8 top-10 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEditPet(pet); }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <Edit size={16} /> Edit
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeletePet(pet.id); }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <PetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingPet}
        title={editingPet ? "Edit Pet" : "Add Pet"}
      />
    </div>
  );
}
