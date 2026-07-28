// src/pages/ProductsPage.jsx
import { useState, useMemo } from 'react';
import { Package, Plus, ShoppingBag, TrendingUp, MoreVertical, Edit, Trash2, RotateCcw } from 'lucide-react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import ProductModal from '../components/ProductModal';
import StatusBadge from '../components/StatusBadge';
import ProductDetailDrawer from '../components/ProductDetailDrawer';
import { productService } from '../services/productService';
import { ColumnFilter, ColumnSort, CardHeaderSearch } from '../components/TableControls';
import Pagination from '../components/Pagination';

const CATEGORIES = [
  { value: 'ALL', label: 'Tất cả danh mục' },
  { value: 'FOOD', label: 'Thức ăn' },
  { value: 'ACCESSORY', label: 'Phụ kiện' },
  { value: 'CLOTHING', label: 'Quần áo' },
  { value: 'HOUSING', label: 'Chuồng & Nệm' },
  { value: 'OTHER', label: 'Khác' },
];

const STATUSES = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'AVAILABLE', label: 'Còn hàng' },
  { value: 'OUT_OF_STOCK', label: 'Hết hàng' },
  { value: 'DISCONTINUED', label: 'Ngừng kinh doanh' },
];

export default function ProductsPage() {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOption, setSortOption] = useState('createdAt,desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [pageSize, setPageSize] = useState(10);

  // Mutations
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Fetch data
  const { data: productsData, isLoading } = useProducts(page, pageSize);

  const products = useMemo(() => productsData?.content || [], [productsData]);
  const totalPages = productsData?.totalPages || 0;
  const totalElements = productsData?.totalElements || 0;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(p => p.status === statusFilter);
    }

    if (categoryFilter !== 'ALL') {
      result = result.filter(p => p.category === categoryFilter);
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
  }, [products, searchQuery, statusFilter, categoryFilter, sortOption]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = selectedIds.size === filteredProducts.length && filteredProducts.length > 0;

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.size} sản phẩm đã chọn?`)) {
      try {
        await Promise.all(Array.from(selectedIds).map(id => deleteProductMutation.mutateAsync(id)));
        if (selectedProduct && selectedIds.has(selectedProduct.id)) {
          setSelectedProduct(null);
        }
        setSelectedIds(new Set());
      } catch (err) {
        console.error('Failed to delete products:', err);
        alert('Không thể xóa một số sản phẩm');
      }
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
    setSortOption('createdAt,desc');
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = async (product) => {
    try {
      const fullProductData = await productService.getProductById(product.id);
      setEditingProduct(fullProductData);
      setIsModalOpen(true);
      setActiveMenuId(null);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      alert('Không thể tải chi tiết sản phẩm');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteProductMutation.mutateAsync(productId);
        if (selectedProduct?.id === productId) {
          setSelectedProduct(null);
        }
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Không thể xóa sản phẩm');
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
      alert('Không thể lưu sản phẩm');
    }
  };

  const toggleMenu = (e, productId) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === productId ? null : productId);
  };

  const stats = [
    { 
      label: 'TỔNG SẢN PHẨM', 
      value: totalElements, 
      icon: Package, 
    },
    { 
      label: 'CÒN HÀNG', 
      value: products.filter(p => p.status === 'AVAILABLE').length, 
      icon: ShoppingBag, 
    },
    { 
      label: 'HẾT HÀNG', 
      value: products.filter(p => p.status === 'OUT_OF_STOCK').length, 
      icon: TrendingUp, 
    },
  ];

  const getCategoryLabel = (category) => {
    const labels = {
      FOOD: 'Thức ăn',
      TOY: 'Đồ chơi',
      ACCESSORY: 'Phụ kiện',
      HEALTH: 'Sức khỏe',
      GROOMING: 'Vệ sinh',
      HOUSING: 'Chuồng nệm',
      OTHER: 'Khác',
    };
    return labels[category] || category;
  };

  const getThumbnailUrl = (product) => {
    if (!product.images || product.images.length === 0) return null;
    const thumbnail = product.images.find(img => img.isThumbnail);
    return thumbnail ? thumbnail.imageUrl : product.images[0].imageUrl;
  };

  const isFiltered = Boolean(searchQuery || categoryFilter !== 'ALL' || statusFilter !== 'ALL' || sortOption !== 'createdAt,desc');

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

      {/* Products Table with Column-based Filters */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-neutral-200 gap-4">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Danh mục sản phẩm</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Quản lý phụ kiện, thức ăn và vật dụng thú cưng</p>
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
                placeholder="Tìm tên sản phẩm, nhãn hiệu..."
              />
              <button 
                onClick={handleAddProduct}
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
                    <th className="px-5 py-3">Sản phẩm</th>
                    <th className="px-4 py-3">
                      <ColumnFilter 
                        label="Danh mục"
                        activeValue={categoryFilter}
                        options={CATEGORIES}
                        onChange={setCategoryFilter}
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
                        label="Kho hàng"
                        sortField="stockQuantity"
                        currentSort={sortOption}
                        onSort={setSortOption}
                      />
                    </th>
                    <th className="px-4 py-3">
                      <ColumnSort 
                        label="Đã bán"
                        sortField="soldCount"
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
                        <p className="text-xs font-medium text-neutral-500">Đang tải sản phẩm...</p>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-16 text-neutral-400">
                        <Package size={32} className="stroke-[1.5] mx-auto mb-2 text-neutral-300" />
                        <p className="text-xs font-medium text-neutral-500">Không tìm thấy sản phẩm nào phù hợp</p>
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
                    filteredProducts.map((product, index) => {
                      const thumbnailUrl = getThumbnailUrl(product);
                      const isSelected = selectedProduct?.id === product.id;
                      const isChecked = selectedIds.has(product.id);
                      const itemNumber = page * pageSize + index + 1;
                      return (
                        <tr 
                          key={product.id} 
                          onClick={() => setSelectedProduct(product)}
                          className={`border-b border-neutral-100 hover:bg-neutral-50/70 transition-colors duration-100 cursor-pointer ${
                            isChecked ? 'bg-neutral-100/80' : isSelected ? 'bg-neutral-100/70' : ''
                          }`}
                        >
                          <td className="px-4 py-3.5 text-xs font-mono text-neutral-400 text-center font-medium tabular-nums">
                            {String(itemNumber).padStart(2, '0')}
                          </td>
                          <td className="px-4 py-3.5" onClick={(e) => { e.stopPropagation(); toggleSelect(product.id); }}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSelect(product.id)}
                              className="w-4 h-4 rounded border-neutral-300 accent-neutral-900 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              {thumbnailUrl ? (
                                <img src={thumbnailUrl} alt={product.name} className="w-10 h-10 rounded-none border border-neutral-200 object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-none border border-neutral-200 bg-neutral-50 flex items-center justify-center">
                                  <Package size={18} className="text-neutral-400" />
                                </div>
                              )}
                              <div>
                                <p className="text-xs font-bold text-black uppercase tracking-wider">{product.name}</p>
                                <p className="text-[11px] text-neutral-400 font-mono">{product.brand || 'Chưa có nhãn'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-neutral-700">{getCategoryLabel(product.category)}</td>
                          <td className="px-4 py-3.5">
                            <StatusBadge status={product.status} />
                          </td>
                          <td className="px-4 py-3.5 text-xs font-mono font-semibold text-black">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price || 0)}
                          </td>
                          <td className="px-4 py-3.5 text-xs font-mono text-neutral-700">{product.stockQuantity || 0}</td>
                          <td className="px-4 py-3.5 text-xs font-mono text-neutral-700">{product.soldCount || 0}</td>
                          <td className="px-4 py-3.5 text-right relative" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => toggleMenu(e, product.id)}
                              className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-none transition-colors cursor-pointer"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {activeMenuId === product.id && (
                              <div className="absolute right-8 top-10 w-36 bg-white rounded-none shadow-lg border border-neutral-200 py-1 z-20">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleEditProduct(product); }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer font-medium"
                                >
                                  <Edit size={14} /> Chỉnh sửa
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id); }}
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
                totalItems={totalElements || filteredProducts.length}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                itemName="sản phẩm"
              />
            )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingProduct}
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      />

      {selectedProduct && (
        <ProductDetailDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}
    </div>
  );
}
