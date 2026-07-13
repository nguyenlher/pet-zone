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
      className="relative w-full h-[460px] sm:h-[520px] lg:h-[600px] rounded-none bg-neutral-50 border border-neutral-200 overflow-hidden select-none group"
    >
      {/* Floating 3D Badge: Pet Name & Breed */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-200 text-xs font-bold text-black uppercase tracking-wider">
          <span className="w-1.5 h-1.5 bg-black" />
          <span>{currentPet.name} — {currentPet.breed}</span>
          <span className="text-[10px] px-1 py-0.5 bg-neutral-100 text-neutral-600 font-medium">
            {currentPet.type === 'DOG' ? 'Chó' : 'Mèo'} 3D
          </span>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 pl-0.5 flex items-center gap-1">
          <RotateCw className="w-2.5 h-2.5 text-neutral-400" />
          Rê chuột để đổi góc nhìn
        </span>
      </div>

      {/* Button: Change Pet */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleNextPet}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 text-black border border-neutral-200 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          title="Xem ngẫu nhiên bé thú cưng khác"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Đổi mẫu</span>
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
