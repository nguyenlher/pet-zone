import { useState, useEffect } from 'react';
import { X, UploadCloud, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';
import { usePetTypes } from '../hooks/useProducts';
import axios from 'axios';

export default function ProductModal({ isOpen, onClose, onSubmit, initialData = null, title = "Add Product" }) {
  const { data: petTypesData } = usePetTypes();
  const petTypes = petTypesData?.content || [];

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'FOOD',
    petTypeId: '',
    price: '',
    stockQuantity: '',
    description: '',
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: initialData.name || '',
        brand: initialData.brand || '',
        category: initialData.category || 'FOOD',
        petTypeId: initialData.petTypeId || '',
        price: initialData.price || '',
        stockQuantity: initialData.stockQuantity || '',
        description: initialData.description || '',
      });

      // Load existing images
      if (initialData.images && initialData.images.length > 0) {
        setUploadedImages(initialData.images.map(img => img.imageUrl));
      } else if (initialData.imageUrls && initialData.imageUrls.length > 0) {
        setUploadedImages(initialData.imageUrls);
      } else {
        setUploadedImages([]);
      }
    } else {
      setFormData({
        name: '',
        brand: '',
        category: 'FOOD',
        petTypeId: '',
        price: '',
        stockQuantity: '',
        description: '',
      });
      setUploadedImages([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'products');

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090'}/api/media/upload-image`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        return response.data.url;
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...urls]);
    } catch (error) {
      console.error('Failed to upload images:', error);
      alert('Failed to upload images');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : 0,
      stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : 0,
      petTypeId: formData.petTypeId || null,
      imageUrls: uploadedImages,
    };
    
    onSubmit(submitData);
  };

  const categories = [
    { value: 'FOOD', label: 'Thức ăn (Food)' },
    { value: 'ACCESSORY', label: 'Phụ kiện (Accessory)' },
    { value: 'CLOTHING', label: 'Quần áo (Clothing)' },
    { value: 'HOUSING', label: 'Chuồng & Nệm (Housing)' },
    { value: 'OTHER', label: 'Khác (Other)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-[1px] p-4 overflow-y-auto">
      <div className="bg-white rounded-none border border-neutral-200 w-full max-w-2xl shadow-2xl overflow-hidden my-8 max-h-[calc(100vh-4rem)]">
        <div className="flex justify-between items-center p-5 border-b border-neutral-200 sticky top-0 z-10 bg-white">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-black">{title}</h2>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono mt-0.5">Product configuration &amp; inventory parameters</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black transition-colors cursor-pointer p-1.5 hover:bg-neutral-100 rounded-none">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
          <div className="space-y-5">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1.5">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-none focus:outline-none focus:border-black transition-colors text-xs placeholder:text-neutral-400"
                  placeholder="e.g. Premium Cat Tree"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1.5">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-none focus:outline-none focus:border-black transition-colors text-xs placeholder:text-neutral-400"
                  placeholder="e.g. PetZone"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1.5">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-none focus:outline-none focus:border-black transition-colors text-xs"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1.5">Pet Type Compatibility</label>
                <select
                  name="petTypeId"
                  value={formData.petTypeId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-none focus:outline-none focus:border-black transition-colors text-xs"
                >
                  <option value="">All Pet Types</option>
                  {petTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1.5">Price (VND) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1000"
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-none focus:outline-none focus:border-black transition-colors text-xs font-mono placeholder:text-neutral-400"
                  placeholder="e.g. 150000"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1.5">Stock Quantity</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-none focus:outline-none focus:border-black transition-colors text-xs font-mono placeholder:text-neutral-400"
                  placeholder="e.g. 100"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1.5">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-none focus:outline-none focus:border-black transition-colors text-xs resize-none placeholder:text-neutral-400"
                placeholder="Write a description of the product..."
              />
            </div>

            {/* Image Upload Section */}
            <div className="pt-4 border-t border-neutral-200">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-3 flex items-center gap-2">
                <ImageIcon size={14} className="text-neutral-700" />
                Product Images
              </h3>
              
              <div className="bg-neutral-50 p-4 rounded-none border border-neutral-200">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Upload Images</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-dashed border-neutral-300 rounded-none hover:border-black transition-colors">
                      {uploadingImage ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-black" />
                          <span className="text-xs text-neutral-600 uppercase tracking-wider font-mono">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={16} className="text-neutral-400" />
                          <span className="text-xs text-neutral-600 uppercase tracking-wider font-mono">Click to upload images</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {/* Image Preview */}
                {uploadedImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative group border border-neutral-200 bg-white">
                        <img 
                          src={url} 
                          alt={`Upload ${index + 1}`} 
                          className="w-full h-20 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="text-[11px] text-neutral-400 mt-2 font-mono">
                  Upload multiple images. First image will be used as the catalog thumbnail.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-neutral-200 rounded-none text-xs font-bold uppercase tracking-wider text-neutral-700 hover:border-black transition-colors cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-black text-white rounded-none text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {initialData ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
