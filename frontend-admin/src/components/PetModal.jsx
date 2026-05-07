import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Link as LinkIcon } from 'lucide-react';
import { useBreeds, usePetTypes } from '../hooks/usePets';

export default function PetModal({ isOpen, onClose, onSubmit, initialData = null, title = "Add Pet" }) {
  const { data: breedsData } = useBreeds();
  const { data: petTypesData } = usePetTypes();
  const breeds = breedsData?.content || [];
  const petTypes = petTypesData?.content || [];

  const [formData, setFormData] = useState({
    name: '',
    breedId: '',
    gender: 'MALE',
    price: '',
    description: '',
    status: 'AVAILABLE',
    sourceImageFor3D: '',
    weight: '',
    height: '',
    birthDate: '',
  });

  const [selectedPetType, setSelectedPetType] = useState('');

  useEffect(() => {
    if (initialData) {
      // Find the breed to set the correct pet type
      const currentBreed = breeds.find(b => b.id === initialData.breedId);
      if (currentBreed) {
        setSelectedPetType(currentBreed.petTypeId || '');
      }

      setFormData({
        name: initialData.name || '',
        breedId: initialData.breedId || '',
        gender: initialData.gender || 'MALE',
        price: initialData.price || '',
        description: initialData.description || '',
        status: initialData.status || 'AVAILABLE',
        sourceImageFor3D: initialData.sourceImageFor3D || '',
        weight: initialData.weight || '',
        height: initialData.height || '',
        birthDate: initialData.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        name: '',
        breedId: '',
        gender: 'MALE',
        price: '',
        description: '',
        status: 'AVAILABLE',
        sourceImageFor3D: '',
        weight: '',
        height: '',
        birthDate: '',
      });
      setSelectedPetType('');
    }
  }, [initialData, isOpen, breeds]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePetTypeChange = (e) => {
    setSelectedPetType(e.target.value);
    setFormData(prev => ({ ...prev, breedId: '' })); // Reset breed when pet type changes
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : 0,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      height: formData.height ? parseFloat(formData.height) : null,
    };
    // Remove empty strings for optional numeric/date fields
    if (!submitData.birthDate) delete submitData.birthDate;
    if (submitData.weight === null) delete submitData.weight;
    if (submitData.height === null) delete submitData.height;
    
    onSubmit(submitData);
  };

  const filteredBreeds = selectedPetType 
    ? breeds.filter(b => b.petType?.id === selectedPetType || b.petTypeId === selectedPetType)
    : breeds;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden my-8">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1.5 hover:bg-gray-200 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Pet Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  placeholder="e.g. Max, Bella..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (VND) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1000"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  placeholder="e.g. 5000000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Pet Type</label>
                <select
                  value={selectedPetType}
                  onChange={handlePetTypeChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                >
                  <option value="">Select Type</option>
                  {petTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Breed *</label>
                <select
                  name="breedId"
                  value={formData.breedId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                >
                  <option value="">Select Breed</option>
                  {filteredBreeds.map(breed => (
                    <option key={breed.id} value={breed.id}>{breed.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="UNKNOWN">Unknown</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="SOLD">Sold</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  step="0.1"
                  min="0.1"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  step="0.1"
                  min="1"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm resize-none"
                placeholder="Write a little bit about the pet..."
              />
            </div>

            {/* 3D Model Image Area */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <UploadCloud size={16} className="text-emerald-500" />
                3D Model Generation
              </h3>
              
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL for 3D Generation</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="url"
                      name="sourceImageFor3D"
                      value={formData.sourceImageFor3D}
                      onChange={handleChange}
                      placeholder="https://example.com/pet-image.jpg"
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    />
                  </div>
                  <button 
                    type="button"
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    Generate 3D
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Paste a clear, front-facing image URL of the pet to generate a 3D model using Tripo API. The process may take a few minutes.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
            >
              {initialData ? 'Save Changes' : 'Add Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
