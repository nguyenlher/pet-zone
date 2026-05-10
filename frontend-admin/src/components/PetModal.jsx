import { useState, useEffect, useMemo } from 'react';
import { X, UploadCloud, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';
import { useBreeds, usePetTypes } from '../hooks/usePets';
import { petService } from '../services/petService';
import axios from 'axios';

const PET_COLORS = [
  { id: 'Red', color: '#ff0000', label: 'Red' },
  { id: 'Blue', color: '#0000ff', label: 'Blue' },
  { id: 'Green', color: '#008000', label: 'Green' },
  { id: 'Yellow', color: '#ffff00', label: 'Yellow' },
  { id: 'Black', color: '#000000', label: 'Black' },
  { id: 'White', color: '#ffffff', label: 'White' },
  { id: 'Grey', color: '#808080', label: 'Grey' },
  { id: 'Brown', color: '#8b4513', label: 'Brown' },
  { id: 'Orange', color: '#ffa500', label: 'Orange' },
  { id: 'Pink', color: '#ffc0cb', label: 'Pink' },
  { id: 'Purple', color: '#800080', label: 'Purple' },
];

export default function PetModal({ isOpen, onClose, onSubmit, initialData = null, title = "Add Pet" }) {
  const { data: breedsData } = useBreeds();
  const { data: petTypesData } = usePetTypes();
  
  // API returns array directly, not wrapped in {content: [...]}
  const breeds = useMemo(() => {
    if (!breedsData) return [];
    return Array.isArray(breedsData) ? breedsData : (breedsData.content || []);
  }, [breedsData]);
  
  const petTypes = useMemo(() => {
    if (!petTypesData) return [];
    return Array.isArray(petTypesData) ? petTypesData : (petTypesData.content || []);
  }, [petTypesData]);

  const [formData, setFormData] = useState({
    name: '',
    breedId: '',
    gender: 'MALE',
    price: '',
    description: '',
    status: 'AVAILABLE',
    weight: '',
    birthDate: '',
    colors: [],
    furType: 'SHORT',
    healthStatus: 'EXCELLENT',
    vaccinated: false,
  });

  const [selectedPetType, setSelectedPetType] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImageFiles, setSelectedImageFiles] = useState([]); // Store File objects
  const [selectedModelFile, setSelectedModelFile] = useState(null); // Store File object
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingModel, setUploadingModel] = useState(false);

  const [isNewPetType, setIsNewPetType] = useState(false);
  const [newPetTypeName, setNewPetTypeName] = useState('');
  
  const [isNewBreed, setIsNewBreed] = useState(false);
  const [newBreedName, setNewBreedName] = useState('');

  const [showColorPicker, setShowColorPicker] = useState(false);

  // Compute filtered breeds - MUST be before early return to maintain hooks order
  const filteredBreeds = useMemo(() => {
    if (!selectedPetType) return breeds;
    
    // Convert selectedPetType to string for comparison
    const selectedPetTypeStr = String(selectedPetType);
    
    return breeds.filter(b => {
      const breedPetTypeId = b.petType?.id || b.petTypeId;
      return breedPetTypeId && String(breedPetTypeId) === selectedPetTypeStr;
    });
  }, [selectedPetType, breeds]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        name: '',
        breedId: '',
        gender: 'MALE',
        price: '',
        description: '',
        status: 'AVAILABLE',
        weight: '',
        birthDate: '',
        colors: [],
        furType: 'SHORT',
        healthStatus: 'EXCELLENT',
        vaccinated: false,
        model3dUrl: '',
      });
      setSelectedPetType('');
      setUploadedImages([]);
      setSelectedImageFiles([]);
      setSelectedModelFile(null);
      setIsNewPetType(false);
      setNewPetTypeName('');
      setIsNewBreed(false);
      setNewBreedName('');
      setShowColorPicker(false);
      return;
    }

    if (initialData) {
      const formattedData = {
        name: initialData.name || '',
        breedId: initialData.breedId || '',
        gender: initialData.gender || 'MALE',
        price: initialData.price !== undefined && initialData.price !== null ? String(initialData.price) : '',
        description: initialData.description || '',
        status: initialData.status || 'AVAILABLE',
        weight: initialData.weight !== undefined && initialData.weight !== null ? String(initialData.weight) : '',
        birthDate: initialData.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : '',
        colors: initialData.colors || [],
        furType: initialData.furType || 'SHORT',
        healthStatus: initialData.healthStatus || 'EXCELLENT',
        vaccinated: initialData.vaccinated || false,
        model3dUrl: initialData.model3d?.modelUrl || initialData.model3dUrl || '',
      };
      
      setFormData(formattedData);

      // Set pet type from initialData.petTypeId or from breed
      let petTypeIdToSet = initialData.petTypeId;
      
      // If petTypeId is not in response, try to get it from breed
      if (!petTypeIdToSet && initialData.breedId && breeds.length > 0) {
        const breed = breeds.find(b => String(b.id) === String(initialData.breedId));
        if (breed) {
          petTypeIdToSet = breed.petTypeId;
        }
      }
      
      // Convert to string to match select value type
      if (petTypeIdToSet) {
        const petTypeIdStr = String(petTypeIdToSet);
        setSelectedPetType(petTypeIdStr);
      } else {
        setSelectedPetType('');
      }

      // Load existing images
      if (initialData.images && initialData.images.length > 0) {
        setUploadedImages(initialData.images.map(img => img.imageUrl));
      } else if (initialData.imageUrls && initialData.imageUrls.length > 0) {
        setUploadedImages(initialData.imageUrls);
      } else {
        setUploadedImages([]);
      }
      
      // Clear selected files when editing (we already have uploaded URLs)
      setSelectedImageFiles([]);
      setSelectedModelFile(null);
    }
  }, [initialData, isOpen, breeds]); // Add breeds to dependencies

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleColor = (colorId) => {
    setFormData(prev => {
      const currentColors = prev.colors || [];
      if (currentColors.includes(colorId)) {
        return { ...prev, colors: currentColors.filter(c => c !== colorId) };
      } else {
        return { ...prev, colors: [...currentColors, colorId] };
      }
    });
  };

  const handlePetTypeChange = (e) => {
    const value = e.target.value;
    if (value === 'NEW') {
      setIsNewPetType(true);
      setSelectedPetType('');
    } else {
      setIsNewPetType(false);
      setSelectedPetType(value);
    }
    setFormData(prev => ({ ...prev, breedId: '' })); // Reset breed when pet type changes
  };

  const handleBreedChange = (e) => {
    const value = e.target.value;
    if (value === 'NEW') {
      setIsNewBreed(true);
      setFormData(prev => ({ ...prev, breedId: '' }));
    } else {
      setIsNewBreed(false);
      setFormData(prev => ({ ...prev, breedId: value }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Store the File objects for later upload
    setSelectedImageFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setUploadedImages(prev => [...prev, ...previewUrls]);
  };

  const handleRemoveImage = (index) => {
    setUploadedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // Revoke object URL to free memory
      if (prev[index].startsWith('blob:')) {
        URL.revokeObjectURL(prev[index]);
      }
      return newImages;
    });
    
    // Also remove from selected files if it's a new file
    setSelectedImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleModelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store the File object for later upload
    setSelectedModelFile(file);
    setFormData(prev => ({ ...prev, model3dUrl: file.name })); // Show filename as placeholder
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUploadingImage(true);
      setUploadingModel(true);
      
      let finalImageUrls = [...uploadedImages.filter(url => !url.startsWith('blob:'))]; // Keep existing URLs
      let finalModelUrl = formData.model3dUrl;

      // Handle new Pet Type creation
      let finalPetTypeId = selectedPetType;
      if (isNewPetType && newPetTypeName.trim()) {
        const newTypeData = await petService.createPetType({ name: newPetTypeName.trim(), description: '', isActive: true });
        finalPetTypeId = newTypeData.id;
      }

      // Handle new Breed creation
      let finalBreedId = formData.breedId;
      if (isNewBreed && newBreedName.trim()) {
        const newBreedData = await petService.createBreed({ name: newBreedName.trim(), description: '', petTypeId: finalPetTypeId, isActive: true });
        finalBreedId = newBreedData.id;
      }
      
      // Upload new images if any
      if (selectedImageFiles.length > 0) {
        const uploadPromises = selectedImageFiles.map(async (file) => {
          const formDataObj = new FormData();
          formDataObj.append('file', file);
          formDataObj.append('folder', 'pets');

          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090'}/api/media/upload-image`,
            formDataObj,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            }
          );
          return response.data.url;
        });

        const newImageUrls = await Promise.all(uploadPromises);
        finalImageUrls = [...finalImageUrls, ...newImageUrls];
      }
      
      // Upload new 3D model if any
      if (selectedModelFile) {
        const formDataObj = new FormData();
        formDataObj.append('file', selectedModelFile);
        formDataObj.append('publicId', `pet_model_${Date.now()}`);

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090'}/api/media/upload-model`,
          formDataObj,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        
        finalModelUrl = response.data.url;
      }
      
      const submitData = {
        ...formData,
        breedId: finalBreedId,
        price: formData.price ? parseFloat(formData.price) : 0,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        colors: formData.colors || [],
        vaccinated: formData.vaccinated === true || formData.vaccinated === 'true',
        imageUrls: finalImageUrls,
        model3dUrl: finalModelUrl,
      };
      
      // Remove empty strings for optional numeric/date fields
      if (!submitData.birthDate) delete submitData.birthDate;
      if (submitData.weight === null) delete submitData.weight;
      if (!submitData.model3dUrl || submitData.model3dUrl === formData.model3dUrl) delete submitData.model3dUrl;
      
      onSubmit(submitData);
    } catch (error) {
      console.error('Failed to upload files:', error);
      alert('Failed to upload files: ' + error.message);
    } finally {
      setUploadingImage(false);
      setUploadingModel(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden my-8 max-h-[calc(100vh-4rem)]">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1.5 hover:bg-gray-200 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
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
                  value={isNewPetType ? 'NEW' : selectedPetType}
                  onChange={handlePetTypeChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                >
                  <option value="">Select Type</option>
                  {petTypes.map(type => (
                    <option key={type.id} value={String(type.id)}>{type.name}</option>
                  ))}
                  <option value="NEW" className="text-emerald-600 font-semibold">+ Add New Pet Type...</option>
                </select>
                {isNewPetType && (
                  <input
                    type="text"
                    value={newPetTypeName}
                    onChange={e => setNewPetTypeName(e.target.value)}
                    placeholder="Enter new pet type name..."
                    className="mt-2 w-full px-4 py-2.5 bg-white border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    required={isNewPetType}
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Breed *</label>
                <select
                  name="breedId"
                  value={isNewBreed ? 'NEW' : formData.breedId}
                  onChange={handleBreedChange}
                  required={!isNewBreed}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                >
                  <option value="">Select Breed</option>
                  {filteredBreeds.map(breed => (
                    <option key={breed.id} value={String(breed.id)}>{breed.name}</option>
                  ))}
                  <option value="NEW" className="text-emerald-600 font-semibold">+ Add New Breed...</option>
                </select>
                {isNewBreed && (
                  <input
                    type="text"
                    value={newBreedName}
                    onChange={e => setNewBreedName(e.target.value)}
                    placeholder="Enter new breed name..."
                    className="mt-2 w-full px-4 py-2.5 bg-white border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    required={isNewBreed}
                  />
                )}
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
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Colors</label>
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-left flex items-center justify-between min-h-[44px]"
                >
                  <div className="flex flex-wrap gap-1">
                    {formData.colors && formData.colors.length > 0 ? (
                      formData.colors.map(cId => {
                        const colorDef = PET_COLORS.find(c => c.id === cId);
                        if (!colorDef) return null;
                        return (
                          <span key={cId} className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full text-xs font-medium text-gray-700">
                            <span className="w-2 h-2 rounded-full border border-gray-200 shadow-sm" style={{ background: colorDef.color }} />
                            {colorDef.label}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-gray-400">Select colors...</span>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs ml-2">▼</span>
                </button>

                {showColorPicker && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowColorPicker(false)}></div>
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg p-3 top-full left-0">
                      <div className="flex flex-wrap gap-2">
                        {PET_COLORS.map(color => {
                          const isSelected = (formData.colors || []).includes(color.id);
                          return (
                            <button
                              type="button"
                              key={color.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleColor(color.id);
                              }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                                isSelected 
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500' 
                                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              <span 
                                className="w-3 h-3 rounded-full border border-gray-200 shadow-sm" 
                                style={{ background: color.color }}
                              />
                              {color.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Fur Type</label>
                <select
                  name="furType"
                  value={formData.furType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                >
                  <option value="SHORT">Short</option>
                  <option value="LONG">Long</option>
                  <option value="CURLY">Curly</option>
                  <option value="HAIRLESS">Hairless</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Health Status</label>
                <select
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                >
                  <option value="EXCELLENT">Excellent</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                  <option value="NEEDS_CARE">Needs Care</option>
                </select>
              </div>
              <div className="flex items-center pt-7">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="vaccinated"
                    checked={formData.vaccinated}
                    onChange={handleChange}
                    className="w-5 h-5 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">Vaccinated</span>
                </label>
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

            {/* Image Upload Section */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ImageIcon size={16} className="text-emerald-500" />
                Pet Images
              </h3>
              
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
                      <UploadCloud size={18} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {selectedImageFiles.length > 0 
                          ? `${selectedImageFiles.length} file(s) selected` 
                          : 'Click to select images'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {/* Image Preview */}
                {uploadedImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Upload ${index + 1}`} 
                          className="w-full h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  Select multiple images. They will be uploaded when you save the pet.
                </p>
              </div>
            </div>

            {/* 3D Model Section */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <UploadCloud size={16} className="text-emerald-500" />
                3D Model
              </h3>
              
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload 3D Model (.glb, .gltf)</label>
                <label className="cursor-pointer block">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
                    <UploadCloud size={18} className={selectedModelFile || formData.model3dUrl ? "text-emerald-500" : "text-gray-400"} />
                    <span className={`text-sm ${selectedModelFile || formData.model3dUrl ? "text-emerald-600 font-medium" : "text-gray-600"}`}>
                      {selectedModelFile 
                        ? `Selected: ${selectedModelFile.name}` 
                        : formData.model3dUrl 
                          ? 'Model uploaded ✓' 
                          : 'Click to select 3D model'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".glb,.gltf"
                    onChange={handleModelUpload}
                    className="hidden"
                  />
                </label>
                
                <p className="text-xs text-gray-500 mt-2">
                  Select a 3D model file (.glb or .gltf). It will be uploaded when you save the pet.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              disabled={uploadingImage || uploadingModel}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadingImage || uploadingModel}
              className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 shadow-sm shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploadingImage || uploadingModel ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                initialData ? 'Save Changes' : 'Add Pet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
