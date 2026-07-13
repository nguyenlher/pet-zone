// src/components/ProductDetailDrawer.jsx
import React, { useState } from 'react';
import { X, Package, Edit, Trash2, Tag, Layers, TrendingUp, AlertTriangle } from 'lucide-react';
import StatusBadge from './StatusBadge';

// Format VND currency
const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount || 0);
};

export default function ProductDetailDrawer({ product, onClose, onEdit, onDelete }) {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Extract all product image URLs
  const allImages = [
    ...(product.thumbnailUrl ? [product.thumbnailUrl] : []),
    ...((product.images || []).map(img => typeof img === 'string' ? img : img.imageUrl).filter(Boolean)),
    ...((product.imageUrls || []).filter(Boolean)),
  ].filter((url, index, self) => self.indexOf(url) === index);

  const currentImage = allImages[activeImageIndex] || product.thumbnailUrl;
  const isOutOfStock = (product.stockQuantity || 0) <= 0;

  const handleEdit = () => {
    onClose();
    onEdit(product);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      onClose();
      onDelete(product.id);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 cursor-pointer animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md sm:max-w-lg bg-white shadow-2xl z-50 flex flex-col border-l border-neutral-200 animate-slideIn">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none border border-neutral-200 bg-neutral-50 flex items-center justify-center text-black">
              <Package size={16} />
            </div>
            <div>
              <h2 className="font-bold text-black text-xs uppercase tracking-wider">Product Overview</h2>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                SKU: #{product.id ? String(product.id).substring(0, 8).toUpperCase() : 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-none border border-neutral-200 bg-white hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X size={16} className="text-black" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Visual & Gallery */}
          <div className="p-5 border-b border-neutral-200 bg-neutral-50/50">
            <div className="relative aspect-video w-full bg-white border border-neutral-200 flex items-center justify-center overflow-hidden">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-neutral-300">
                  <Package size={40} />
                  <span className="text-[10px] font-mono mt-2 uppercase tracking-widest text-neutral-400">No Image Available</span>
                </div>
              )}

              {/* Out of stock banner */}
              {isOutOfStock && (
                <div className="absolute bottom-3 left-3 right-3 bg-red-600 text-white px-3 py-1.5 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider">
                  <AlertTriangle size={14} />
                  Out of Stock
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-14 h-14 shrink-0 rounded-none border overflow-hidden cursor-pointer transition-all ${
                      activeImageIndex === idx ? 'border-black ring-1 ring-black' : 'border-neutral-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Status */}
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                  {product.brand || 'General Brand'} • {product.category || 'Accessories'}
                </span>
                <h1 className="text-lg font-black text-black uppercase tracking-tight mt-0.5">
                  {product.name}
                </h1>
              </div>
              <StatusBadge status={product.status || (isOutOfStock ? 'OUT_OF_STOCK' : 'AVAILABLE')} />
            </div>

            <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">Retail Price</span>
              <span className="text-base font-extrabold font-mono text-black">
                {formatVND(product.price)}
              </span>
            </div>
          </div>

          {/* Inventory & Commercial Metrics */}
          <div className="p-5 border-b border-neutral-200">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono mb-3">
              Inventory &amp; Sales Metrics
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 border border-neutral-100 bg-neutral-50/50">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">In Stock</span>
                <span className={`font-bold font-mono text-sm ${isOutOfStock ? 'text-red-600' : 'text-black'}`}>
                  {product.stockQuantity || 0} units
                </span>
              </div>
              <div className="p-3 border border-neutral-100 bg-neutral-50/50">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Total Sold</span>
                <span className="font-bold text-black font-mono text-sm">
                  {product.soldCount || 0} units
                </span>
              </div>
              <div className="p-3 border border-neutral-100 bg-neutral-50/50">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Category</span>
                <span className="font-bold uppercase text-black font-mono">{product.category || 'FOOD'}</span>
              </div>
              <div className="p-3 border border-neutral-100 bg-neutral-50/50">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Pet Compatibility</span>
                <span className="font-bold uppercase text-black font-mono">
                  {product.petTypeName || 'All Pets'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="p-5 border-b border-neutral-200">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono mb-2">
                Product Description
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line bg-neutral-50/50 p-3.5 border border-neutral-100">
                {product.description}
              </p>
            </div>
          )}

          {/* Meta Timestamps */}
          <div className="p-5">
            <div className="text-[11px] font-mono text-neutral-400 space-y-1">
              <p>CREATED: {product.createdAt ? new Date(product.createdAt).toLocaleString('vi-VN') : '—'}</p>
              {product.updatedAt && (
                <p>LAST MODIFIED: {new Date(product.updatedAt).toLocaleString('vi-VN')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-neutral-200 flex items-center gap-3 bg-neutral-50/50">
          <button
            onClick={handleEdit}
            className="flex-1 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors rounded-none cursor-pointer"
          >
            <Edit size={14} />
            Edit Product
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-none cursor-pointer bg-white"
            title="Delete Product"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
