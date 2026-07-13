'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Plus, Minus, Check, Box, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { PET_3D_MODELS } from '@/constants/pet3dModels';
import { isPetItem } from '@/types';

// Dynamic import with ssr: false for mobile & bundle optimization
const QuickView3DViewer = dynamic(
  () => import('../3d/QuickView3DViewer'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[300px] sm:min-h-[360px] flex flex-col items-center justify-center bg-neutral-100 text-neutral-500 font-mono text-xs p-6 text-center">
        <div className="w-5 h-5 border-2 border-black border-t-transparent animate-spin mb-3" />
        <span className="uppercase tracking-wider">Đang nạp mô hình 3D...</span>
        <span className="text-[10px] text-neutral-400 mt-1 font-mono">Tối ưu hóa đồ họa WebGL</span>
      </div>
    ),
  }
);

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, cart, setIsCartOpen } = useCart();
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [viewMode, setViewMode] = useState<'image' | '3d'>('image');
  const [isHoveredOnImage, setIsHoveredOnImage] = useState(false);

  // Check if current product is a pet (unique living individual)
  const isPet = quickViewProduct ? isPetItem(quickViewProduct) : false;

  const isItemInCart = quickViewProduct
    ? cart.some((item) => item.product.id === quickViewProduct.id)
    : false;

  // Resolve displayName formatted as Type + Breed for pets (e.g. Chó Poodle, Mèo Bengal)
  const displayName = useMemo(() => {
    if (!quickViewProduct) return '';
    if (!isPetItem(quickViewProduct)) return quickViewProduct.name;

    let breed = quickViewProduct.breedName;
    if (!breed) {
      const match = quickViewProduct.name.match(/^.+?\s*\((.+?)\)$/);
      breed = match ? match[1].trim() : quickViewProduct.name;
    }

    const type =
      quickViewProduct.petTypeName ||
      (breed.toLowerCase().includes('mèo') || quickViewProduct.description?.toLowerCase().includes('mèo')
        ? 'Mèo'
        : 'Chó');

    if (!breed.toLowerCase().startsWith('chó') && !breed.toLowerCase().startsWith('mèo')) {
      return `${type} ${breed}`;
    }
    return breed;
  }, [quickViewProduct]);

  // Reset state when product opens or changes
  useEffect(() => {
    if (quickViewProduct) {
      setQuantity(1);
      setViewMode('image');
      setActiveImageIndex(0);
      setSelectedColor(quickViewProduct.colors?.[0]?.name);
    }
  }, [quickViewProduct?.id]);

  // Resolve matching 3D model for pet
  const resolvedModelUrl = useMemo(() => {
    if (!quickViewProduct) return undefined;
    if (quickViewProduct.modelUrl) return quickViewProduct.modelUrl;

    const searchStr = `${quickViewProduct.name} ${(quickViewProduct.tags || []).join(' ')} ${
      quickViewProduct.specs?.['Giống'] || ''
    }`.toLowerCase();

    const matched = PET_3D_MODELS.find(
      (m) =>
        searchStr.includes(m.breed.toLowerCase()) ||
        searchStr.includes(m.name.toLowerCase()) ||
        searchStr.includes(m.id.toLowerCase()) ||
        m.breed.toLowerCase().includes(searchStr)
    );

    if (matched) return matched.modelUrl;

    if (isPet) {
      const isCat = searchStr.includes('mèo') || searchStr.includes('cat');
      return isCat ? PET_3D_MODELS[12].modelUrl : PET_3D_MODELS[0].modelUrl;
    }

    return undefined;
  }, [quickViewProduct, isPet]);

  const images = useMemo(() => {
    if (!quickViewProduct) return [];
    return [quickViewProduct.image, quickViewProduct.hoverImage].filter(
      (img, idx, arr) => Boolean(img) && arr.indexOf(img) === idx
    );
  }, [quickViewProduct]);

  const currentColor = selectedColor || quickViewProduct?.colors?.[0]?.name;
  const selectedColorObj = quickViewProduct?.colors?.find((c) => c.name === currentColor);
  const currentColorHex = selectedColorObj?.hex || '#171717';

  // Slideshow auto-advance: only for image list, NEVER auto-advance in 3D mode
  useEffect(() => {
    if (!quickViewProduct || viewMode !== 'image' || isHoveredOnImage || images.length <= 1) {
      return;
    }
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [quickViewProduct, viewMode, isHoveredOnImage, images.length]);

  const handleAdd = () => {
    if (!quickViewProduct) return;
    if (isPet && isItemInCart) {
      setQuickViewProduct(null);
      setIsCartOpen(true);
      return;
    }
    addToCart(quickViewProduct, isPet ? 1 : quantity, currentColor);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setQuickViewProduct(null);
    }, 1000);
  };

  const formattedPrice = quickViewProduct
    ? new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(quickViewProduct.price)
    : '';

  return (
    <AnimatePresence>
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewProduct(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.98, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.98, opacity: 0, y: 10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-white rounded-none shadow-2xl overflow-hidden z-10 border border-neutral-200"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-3 right-3 z-30 w-8 h-8 rounded-none bg-white border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-4 h-4 text-black" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Media Viewport */}
            <div className="p-6 bg-neutral-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-200">
              {/* Media Switcher Tab: Shows 2 tabs for pets, single tab for other products */}
              <div className="flex border border-neutral-200 bg-white mb-4">
                <button
                  type="button"
                  onClick={() => setViewMode('image')}
                  className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isPet ? 'border-r border-neutral-200' : ''
                  } ${
                    viewMode === 'image'
                      ? 'bg-black text-white'
                      : 'bg-white text-neutral-600 hover:text-black'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Hình ảnh ({images.length})</span>
                </button>
                {isPet && (
                  <button
                    type="button"
                    onClick={() => setViewMode('3d')}
                    className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      viewMode === '3d'
                        ? 'bg-black text-white'
                        : 'bg-white text-neutral-600 hover:text-black'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>Mô hình 3D</span>
                  </button>
                )}
              </div>

              {/* Viewport Content */}
              {!isPet || viewMode === 'image' ? (
                <div
                  onMouseEnter={() => setIsHoveredOnImage(true)}
                  onMouseLeave={() => setIsHoveredOnImage(false)}
                  className="flex flex-col justify-between flex-1"
                >
                  <div>
                    <div className="relative aspect-square rounded-none overflow-hidden bg-white border border-neutral-200">
                      <img
                        src={images[activeImageIndex]}
                        alt={displayName || quickViewProduct.name}
                        className="w-full h-full object-cover transition-opacity duration-300"
                      />
                      {images.length > 1 && (
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/75 text-white text-[10px] font-mono uppercase tracking-wider">
                          {activeImageIndex + 1} / {images.length}
                        </div>
                      )}
                    </div>

                    {/* Image Navigation Dots: click to switch image (always shown, even if 1 image) */}
                    <div className="flex items-center justify-center gap-1.5 mt-2.5">
                      {(images.length > 0 ? images : [quickViewProduct.image]).map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={() => setActiveImageIndex(dotIdx)}
                          className="p-1 cursor-pointer transition-all"
                          title={`Chuyển đến ảnh ${dotIdx + 1}`}
                        >
                          <span
                            className={`block rounded-full transition-all ${
                              activeImageIndex === dotIdx
                                ? 'w-1.5 h-1.5 bg-black scale-110'
                                : 'w-1.5 h-1.5 bg-neutral-300 hover:bg-neutral-500'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Thumbnails with Outer Selection Frame & Dimming */}
                  <div className="flex items-center gap-2.5 mt-4">
                    {images.map((img, i) => {
                      const isSelected = activeImageIndex === i;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setViewMode('image');
                            setActiveImageIndex(i);
                          }}
                          className={`relative w-14 h-14 p-0.5 rounded-none transition-all cursor-pointer ${
                            isSelected
                              ? 'border-2 border-black bg-white ring-1 ring-black/10'
                              : 'border border-neutral-200 bg-neutral-100 hover:border-neutral-300'
                          }`}
                          title={`Ảnh ${i + 1}`}
                        >
                          <div className="w-full h-full overflow-hidden relative">
                            <img
                              src={img}
                              alt="thumb"
                              className={`w-full h-full object-cover transition-opacity duration-200 ${
                                isSelected ? 'opacity-100' : 'opacity-40'
                              }`}
                            />
                            {!isSelected && (
                              <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-between flex-1">
                  <div className="relative aspect-square rounded-none overflow-hidden bg-white border border-neutral-200">
                    <QuickView3DViewer
                      modelUrl={resolvedModelUrl}
                      isPet={isPet}
                      productName={displayName || quickViewProduct.name}
                      productColor={currentColorHex}
                    />
                  </div>

                  {/* 3D Gesture info */}
                  <div className="mt-4 font-mono text-xs">
                    <div className="p-2.5 border border-neutral-200 bg-white flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                        Thao tác
                      </span>
                      <span className="text-black font-semibold text-[11px]">
                        Xoay 360° & Thu phóng
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Product Details */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div>
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                  {quickViewProduct.category}
                </span>

                <h2 className={`text-xl font-bold text-black tracking-wide mt-1 ${isPet ? '' : 'uppercase'}`}>
                  {displayName}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-neutral-700 font-semibold text-xs">
                    <Star className="w-3.5 h-3.5 fill-neutral-400 text-neutral-400 mr-1" />
                    {quickViewProduct.rating}
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">
                    ({quickViewProduct.reviewsCount} đánh giá)
                  </span>
                </div>

                <div className="text-xl font-bold font-mono text-black tracking-tight mt-3">
                  {formattedPrice}
                </div>

                <p className="text-neutral-600 text-xs mt-3 leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {/* Colors */}
                {quickViewProduct.colors && (
                  <div className="mt-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-black block mb-2">
                      Phiên bản màu:
                    </span>
                    <div className="flex items-center gap-2">
                      {quickViewProduct.colors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          className={`px-3 py-1.5 rounded-none text-xs font-medium border flex items-center gap-2 cursor-pointer transition-colors ${
                            currentColor === c.name
                              ? 'border-black bg-black text-white'
                              : 'border-neutral-200 bg-white text-neutral-700 hover:border-black'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-none border border-neutral-300"
                            style={{ backgroundColor: c.hex }}
                          />
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specs */}
                {quickViewProduct.specs && (
                  <div className="mt-4 pt-4 border-t border-neutral-100 grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(quickViewProduct.specs).map(([k, v]) => (
                      <div key={k} className="p-2 bg-neutral-50 border border-neutral-100 rounded-none">
                        <span className="text-neutral-400 block text-[9px] uppercase font-mono font-bold tracking-wider">
                          {k}
                        </span>
                        <span className="text-black font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Qty */}
                <div className="flex flex-col gap-1">
                  <div
                    className={`flex items-center border rounded-none px-2 py-1.5 self-start ${
                      isPet
                        ? 'border-neutral-200 bg-neutral-100 opacity-80 cursor-not-allowed'
                        : 'border-neutral-200 bg-white'
                    }`}
                  >
                    <button
                      type="button"
                      disabled={isPet || quantity <= 1}
                      onClick={() => !isPet && setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1 text-neutral-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title={
                        isPet
                          ? 'Mỗi thú cưng là một cá thể độc lập duy nhất (Số lượng: 1)'
                          : 'Giảm số lượng'
                      }
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold font-mono text-black">{quantity}</span>
                    <button
                      type="button"
                      disabled={isPet}
                      onClick={() => !isPet && setQuantity((q) => q + 1)}
                      className="p-1 text-neutral-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title={
                        isPet
                          ? 'Mỗi thú cưng là một cá thể độc lập duy nhất (Số lượng: 1)'
                          : 'Tăng số lượng'
                      }
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Add CTA */}
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 py-3.5 px-6 rounded-none font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    (isPet && isItemInCart) || isAdded
                      ? 'bg-neutral-900 text-white'
                      : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                >
                  {(isPet && isItemInCart) || isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Đã có trong giỏ</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm giỏ hàng</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
