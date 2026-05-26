// src/pages/ProductsPage.jsx
import { useState } from 'react';
import { Package, Plus, Search, ShoppingBag, TrendingUp, Filter, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import ProductModal from '../components/ProductModal';
import { productService } from '../services/productService';

export default function ProductsPage() {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const pageSize = 10;

  // Mutations
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Fetch data
  const { data: productsData, isLoading } = useProducts(page, pageSize);

  const products = productsData?.content || [];
  const totalPages = productsData?.totalPages || 0;
  const totalElements = productsData?.totalElements || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality can be implemented later if backend supports it
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = async (product) => {
    try {
      // Fetch full product details before editing
      const fullProductData = await productService.getProductById(product.id);
      setEditingProduct(fullProductData);
      setIsModalOpen(true);
      setActiveMenuId(null);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      alert('Failed to load product details');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductMutation.mutateAsync(productId);
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product');
      }
    }
    setActiveMenuId(null);
  };

  const handleModalSubmit = async (data) => {
    try {
      if (editingProduct) {
        await updateProductMutation.mutateAsync({ id: editingProduct.id, data });
      } else {
        await createProductMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product');
    }
  };

  const toggleMenu = (e, productId) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === productId ? null : productId);
  };

  const stats = [
    { 
      label: 'Total Products', 
      value: totalElements, 
      icon: Package, 
      color: 'bg-purple-100', 
      iconColor: 'text-purple-600' 
    },
    { 
      label: 'Available', 
      value: products.filter(p => p.status === 'AVAILABLE').length,
      icon: ShoppingBag, 
      color: 'bg-emerald-100', 
      iconColor: 'text-emerald-600' 
    },
    { 
      label: 'Out of Stock', 
      value: products.filter(p => p.status === 'OUT_OF_STOCK').length,
      icon: TrendingUp, 
      color: 'bg-red-100', 
      iconColor: 'text-red-600' 
    },
  ];

  const getCategoryLabel = (category) => {
    const labels = {
      FOOD: 'Food',
      TOY: 'Toy',
      ACCESSORY: 'Accessory',
      HEALTH: 'Health',
      GROOMING: 'Grooming',
      HOUSING: 'Housing',
      OTHER: 'Other',
    };
    return labels[category] || category;
  };

  const getThumbnailUrl = (product) => {
    if (!product.images || product.images.length === 0) return null;
    const thumbnail = product.images.find(img => img.isThumbnail);
    return thumbnail ? thumbnail.imageUrl : product.images[0].imageUrl;
  };

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
              placeholder="Search products by name or brand..."
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

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">All Products</h2>
          <button 
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors duration-150 cursor-pointer"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500">Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500">
              No products found
            </div>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sold</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const thumbnailUrl = getThumbnailUrl(product);
                  return (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-100 cursor-pointer">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {thumbnailUrl ? (
                            <img src={thumbnailUrl} alt={product.name} className="w-10 h-10 rounded-xl object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                              <Package size={20} className="text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-400">{product.brand || 'No brand'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-700">{getCategoryLabel(product.category)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          product.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 
                          product.status === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {product.status === 'AVAILABLE' ? 'Available' : 
                           product.status === 'OUT_OF_STOCK' ? 'Out of Stock' : 
                           product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price || 0)}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-700">{product.stockQuantity || 0}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-700">{product.soldCount || 0}</td>
                      <td className="px-4 py-3.5 text-right relative">
                        <button
                          onClick={(e) => toggleMenu(e, product.id)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {activeMenuId === product.id && (
                          <div className="absolute right-8 top-10 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEditProduct(product); }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <Edit size={16} /> Edit
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id); }}
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

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingProduct}
        title={editingProduct ? "Edit Product" : "Add Product"}
      />
    </div>
  );
}
