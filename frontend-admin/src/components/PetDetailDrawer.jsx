// src/components/PetDetailDrawer.jsx
import React, { useState } from 'react';
import { X, PawPrint, Edit, Trash2, Box, Calendar, Weight, Activity, ShieldCheck, Tag } from 'lucide-react';
import StatusBadge from './StatusBadge';

// Format VND currency
const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount || 0);
};

export default function PetDetailDrawer({ pet, onClose, onEdit, onDelete }) {
  if (!pet) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Collect all available pet images
  const allImages = [
    ...(pet.thumbnailUrl ? [pet.thumbnailUrl] : []),
    ...((pet.imageUrls || []).filter(url => url !== pet.thumbnailUrl)),
    ...((pet.images || []).map(img => typeof img === 'string' ? img : img.imageUrl).filter(url => url && url !== pet.thumbnailUrl)),
  ];

  const currentImage = allImages[activeImageIndex] || pet.thumbnailUrl;
  const has3DModel = Boolean(pet.model3dUrl || pet.modelUrl);

  const handleEdit = () => {
    onClose();
    onEdit(pet);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${pet.name}"?`)) {
      onClose();
      onDelete(pet.id);
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
              <PawPrint size={16} />
            </div>
            <div>
              <h2 className="font-bold text-black text-xs uppercase tracking-wider">Pet Profile</h2>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                ID: {pet.id ? String(pet.id).substring(0, 8).toUpperCase() : 'N/A'}
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
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-neutral-300">
                  <PawPrint size={40} />
                  <span className="text-[10px] font-mono mt-2 uppercase tracking-widest text-neutral-400">No Image Available</span>
                </div>
              )}

              {/* 3D Indicator Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {has3DModel ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-black text-white border border-black shadow-sm">
                    <Box size={12} className="text-emerald-400" />
                    3D Model Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-white/90 text-neutral-500 border border-neutral-200">
                    No 3D Model
                  </span>
                )}
              </div>
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
                    <img src={img} alt={`${pet.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Core Info & Price Header */}
          <div className="p-5 border-b border-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                  {pet.petTypeName || 'Pet'} • {pet.breedName || 'General Breed'}
                </span>
                <h1 className="text-lg font-black text-black uppercase tracking-tight mt-0.5">
                  {pet.name}
                </h1>
              </div>
              <StatusBadge status={pet.status} />
            </div>

            <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">List Price</span>
              <span className="text-base font-extrabold font-mono text-black">
                {formatVND(pet.price)}
              </span>
            </div>
          </div>

          {/* Biological / Spec Attributes */}
          <div className="p-5 border-b border-neutral-200">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono mb-3">
              Biological Specifications
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 border border-neutral-100 bg-neutral-50/50">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Gender</span>
                <span className="font-bold uppercase text-black font-mono">{pet.gender || 'Unknown'}</span>
              </div>
              <div className="p-3 border border-neutral-100 bg-neutral-50/50">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Age</span>
                <span className="font-bold text-black font-mono">
                  {pet.ageInMonths ? `${pet.ageInMonths} months` : 'N/A'}
                </span>
              </div>
              <div className="p-3 border border-neutral-100 bg-neutral-50/50">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Weight</span>
                <span className="font-bold text-black font-mono">
                  {pet.weight ? `${pet.weight} kg` : 'N/A'}
                </span>
              </div>
              <div className="p-3 border border-neutral-100 bg-neutral-50/50">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">Fur Type</span>
                <span className="font-bold uppercase text-black font-mono">{pet.furType || 'Standard'}</span>
              </div>
            </div>

            {/* Health & Medical Status */}
            <div className="mt-3 p-3 border border-neutral-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600 flex items-center gap-1.5">
                  <Activity size={13} className="text-neutral-400" />
                  Health Condition:
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  {pet.healthStatus || 'EXCELLENT'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-100 pt-2">
                <span className="text-xs text-neutral-600 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-neutral-400" />
                  Vaccination Record:
                </span>
                <span className={`text-xs font-mono font-bold ${pet.vaccinated ? 'text-emerald-700' : 'text-neutral-400'}`}>
                  {pet.vaccinated ? 'VACCINATED' : 'NOT RECORDED'}
                </span>
              </div>
              {pet.birthDate && (
                <div className="flex items-center justify-between border-t border-neutral-100 pt-2">
                  <span className="text-xs text-neutral-600 flex items-center gap-1.5">
                    <Calendar size={13} className="text-neutral-400" />
                    Birth Date:
                  </span>
                  <span className="text-xs font-mono text-neutral-700">
                    {new Date(pet.birthDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {pet.description && (
            <div className="p-5 border-b border-neutral-200">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono mb-2">
                Description &amp; Personality
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line bg-neutral-50/50 p-3.5 border border-neutral-100">
                {pet.description}
              </p>
            </div>
          )}

          {/* Meta Timestamps */}
          <div className="p-5">
            <div className="text-[11px] font-mono text-neutral-400 space-y-1">
              <p>CREATED: {pet.createdAt ? new Date(pet.createdAt).toLocaleString('vi-VN') : '—'}</p>
              {pet.updatedAt && (
                <p>LAST MODIFIED: {new Date(pet.updatedAt).toLocaleString('vi-VN')}</p>
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
            Edit Pet
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-none cursor-pointer bg-white"
            title="Delete Pet"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
