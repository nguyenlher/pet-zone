'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import { RealPet3DModel } from './RealPet3DModel';
import { PET_3D_MODELS, Pet3DModelItem } from '@/constants/pet3dModels';
import { RotateCw, Shuffle, Sparkles } from 'lucide-react';

export const PetModelViewer: React.FC = () => {
  const [petIndex, setPetIndex] = useState<number>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Select random pet on every initial page load / refresh
    const randomIndex = Math.floor(Math.random() * PET_3D_MODELS.length);
    setPetIndex(randomIndex);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  const handleNextPet = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPetIndex((prev) => {
      let next = Math.floor(Math.random() * PET_3D_MODELS.length);
      if (next === prev) {
        next = (prev + 1) % PET_3D_MODELS.length;
      }
      return next;
    });
  };

  const currentPet: Pet3DModelItem = PET_3D_MODELS[petIndex] || PET_3D_MODELS[0];

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
      {/* Subtle Background Ambient Radial Glow */}
      <div className="absolute inset-0 opacity-40 blur-3xl pointer-events-none bg-[radial-gradient(circle_at_50%_50%,_#D4F442_0%,_transparent_65%)]" />

      {/* Floating 3D Badge: Pet Name & Breed */}
      <div className="absolute top-5 left-5 z-10 flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-sm text-xs font-bold text-stone-900">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{currentPet.name} — {currentPet.breed}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold">
            {currentPet.type === 'DOG' ? 'Chó' : 'Mèo'} 3D
          </span>
        </div>
        <span className="text-[11px] font-medium text-stone-500 pl-1 flex items-center gap-1">
          <RotateCw className="w-3 h-3 text-stone-400 animate-spin" style={{ animationDuration: '6s' }} />
          Rê chuột để đổi góc nhìn
        </span>
      </div>

      {/* Button: Change Pet (Đổi bé khác) */}
      <div className="absolute top-5 right-5 z-10">
        <button
          onClick={handleNextPet}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-black border border-stone-200/90 shadow-sm hover:shadow text-xs font-semibold transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Xem ngẫu nhiên bé thú cưng khác"
        >
          <Shuffle className="w-3.5 h-3.5 text-stone-500" />
          <span>Đổi bé khác</span>
        </button>
      </div>

      {/* 3D Canvas */}
      {isClient ? (
        <Canvas
          camera={{ position: [0, 1.2, 4.2], fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-5, 3, -2]} intensity={0.8} color="#FFF5EA" />
          <pointLight position={[0, 3, 2]} intensity={0.6} />

          <Suspense fallback={null}>
            <RealPet3DModel
              key={currentPet.id}
              modelUrl={currentPet.modelUrl}
              mousePos={mousePos}
              autoRotate={autoRotate}
              scaleMultiplier={currentPet.scale || 1}
            />
            <ContactShadows
              position={[0, -0.4, 0]}
              opacity={0.45}
              scale={5}
              blur={2.4}
              far={4}
            />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-2 text-stone-400">
            <RotateCw className="w-8 h-8 animate-spin" />
            <span className="text-sm">Đang nạp mô hình 3D...</span>
          </div>
        </div>
      )}
    </div>
  );
};
