'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import { PetProductModel } from './PetProductModel';
import { Sparkles, Eye, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';

const COLOR_OPTIONS = [
  { name: 'Oatmeal', hex: '#EAE5D9', bg: 'bg-[#EAE5D9]' },
  { name: 'Sage Green', hex: '#A3B18A', bg: 'bg-[#A3B18A]' },
  { name: 'Terracotta', hex: '#D68C72', bg: 'bg-[#D68C72]' },
  { name: 'Onyx Black', hex: '#262626', bg: 'bg-[#262626]' },
];

export const PetModelViewer: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setAutoRotate(false)}
      onMouseLeave={() => {
        setAutoRotate(true);
        setMousePos({ x: 0, y: 0 });
      }}
      className="relative w-full h-[460px] sm:h-[520px] lg:h-[600px] rounded-3xl bg-gradient-to-b from-[#F5F3EF] via-[#ECE9E2] to-[#E5E1D8] border border-stone-200/80 shadow-inner overflow-hidden select-none group"
    >
      {/* Background Ambient Glow */}
      <div
        className="absolute inset-0 opacity-40 blur-3xl pointer-events-none transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${selectedColor.hex} 0%, transparent 65%)`,
        }}
      />

      {/* Floating 3D Badge & Status */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 text-xs font-semibold text-stone-800 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          Mô hình 3D tương tác
        </motion.span>
        <span className="text-[11px] font-medium text-stone-500 pl-1 flex items-center gap-1">
          <RotateCw className="w-3 h-3 text-stone-400 animate-spin" style={{ animationDuration: '6s' }} />
          Rê chuột để đổi góc nhìn
        </span>
      </div>

      {/* Color Customization Pills */}
      <div className="absolute bottom-6 left-6 z-10 bg-white/85 backdrop-blur-md p-2 rounded-2xl border border-stone-200/80 shadow-lg flex items-center gap-2">
        <span className="text-xs font-medium text-stone-600 px-2 hidden sm:inline">Màu men sứ:</span>
        <div className="flex items-center gap-1.5">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedColor(c)}
              className={`w-7 h-7 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${c.bg} ${
                selectedColor.name === c.name
                  ? 'ring-2 ring-black ring-offset-2 scale-110 shadow-sm'
                  : 'hover:scale-105 opacity-80'
              }`}
              title={c.name}
              aria-label={`Select color ${c.name}`}
            />
          ))}
        </div>
      </div>

      {/* Hotspot Floating Tag Right */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 right-6 z-10 hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-stone-200/90 shadow-md"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <div className="text-left">
          <p className="text-[11px] font-bold text-stone-900 leading-tight">Độ dốc 15° Chuẩn Khoa Học</p>
          <p className="text-[10px] text-stone-500">Giảm 75% áp lực xương cổ</p>
        </div>
      </motion.div>

      {/* 3D Canvas */}
      {isClient ? (
        <Canvas
          camera={{ position: [0, 1.2, 4.5], fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />
          <directionalLight position={[-5, 3, -2]} intensity={0.6} color="#FFF5EA" />
          <pointLight position={[0, 4, 2]} intensity={0.8} />

          <Suspense fallback={null}>
            <PetProductModel
              color={selectedColor.hex}
              mousePos={mousePos}
              autoRotate={autoRotate}
            />
            <ContactShadows
              position={[0, -1.05, 0]}
              opacity={0.45}
              scale={6}
              blur={2.4}
              far={4}
            />
            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-2 text-stone-400">
            <RotateCw className="w-8 h-8 animate-spin" />
            <span className="text-sm">Đang tải không gian 3D...</span>
          </div>
        </div>
      )}
    </div>
  );
};
