'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Rotate3d, ZoomIn, ShieldCheck, Award, Heart } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { useCart } from '../../context/CartContext';
import { PRODUCTS } from '../../data/mockData';

export const InteractiveShowroom3D: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeMaterial, setActiveMaterial] = useState<'ceramic' | 'matte' | 'glossy'>('ceramic');
  const [activeColor, setActiveColor] = useState('#D9654B');
  const { addToCart } = useCart();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const showcaseProduct = PRODUCTS[2]; // Luna Collar Pro / Collar 3D showcase

  return (
    <div className="w-full bg-[#141517] text-white rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden relative shadow-2xl border border-white/10">
      {/* Background radial glow */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: activeColor }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Interactive Specs & Configurator */}
        <div className="lg:col-span-5 space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D4F442] text-xs font-semibold tracking-wider uppercase backdrop-blur-md border border-white/10">
            <Rotate3d className="w-4 h-4" />
            3D Studio Showroom
          </div>

          <div className="space-y-3">
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Luna Collar Pro & AirTag Edition
            </h3>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Tương tác 360 độ trực tiếp trong không gian 3 chiều. Kiểm tra chi tiết đường may da sinh học thuần chay và khóa nam châm chống trượt.
            </p>
          </div>

          {/* Color Switcher */}
          <div className="space-y-2 pt-2">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
              Màu da thiết kế:
            </span>
            <div className="flex items-center gap-3">
              {[
                { name: 'Terracotta', hex: '#D9654B' },
                { name: 'Forest Green', hex: '#2D4A3E' },
                { name: 'Amber Gold', hex: '#D4AF37' },
                { name: 'Onyx Black', hex: '#2A2A2A' },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => setActiveColor(c.hex)}
                  className={`w-9 h-9 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                    activeColor === c.hex
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[#141517] scale-110'
                      : 'hover:scale-105 opacity-70'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  aria-label={`Select ${c.name}`}
                />
              ))}
            </div>
          </div>

          {/* Specs List */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#D4F442] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">AirTag Ready</span>
                <span className="text-stone-400 text-[11px]">Khoang chứa giấu kín</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
              <Award className="w-4 h-4 text-[#D4F442] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Vegan Leather</span>
                <span className="text-stone-400 text-[11px]">Da thực vật êm lông</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-2 flex items-center gap-4">
            <MagneticButton
              onClick={() => addToCart(showcaseProduct, 1, activeColor)}
              className="px-7 py-3.5 rounded-full bg-[#D4F442] hover:bg-[#c6e936] text-black font-bold text-sm shadow-xl transition-transform"
            >
              Thêm Bản Phối Này (320.000đ)
            </MagneticButton>
          </div>
        </div>

        {/* Right 3D Canvas with 360 Orbit */}
        <div className="lg:col-span-7 h-[380px] sm:h-[460px] lg:h-[500px] w-full rounded-2xl bg-gradient-to-br from-stone-900 via-[#18191c] to-[#121315] relative border border-white/10 overflow-hidden">
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-stone-300 border border-white/10">
            <Rotate3d className="w-3.5 h-3.5 text-[#D4F442]" />
            <span>Kéo chuột để xoay 360°</span>
          </div>

          {isClient ? (
            <Canvas
              camera={{ position: [0, 1.5, 4], fov: 42 }}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={1.2} />
              <directionalLight position={[4, 6, 4]} intensity={2.0} />
              <directionalLight position={[-4, -2, -2]} intensity={0.5} color="#D4F442" />

              <Suspense fallback={null}>
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
                  <group rotation={[0.2, 0, 0]}>
                    {/* 3D Collar Ring Mesh */}
                    <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
                      <torusGeometry args={[1.3, 0.16, 32, 100]} />
                      <meshStandardMaterial
                        color={activeColor}
                        roughness={0.35}
                        metalness={0.15}
                      />
                    </mesh>

                    {/* AirTag Capsule Holder */}
                    <mesh position={[0, -0.1, 1.3]} rotation={[0, 0, 0]} castShadow>
                      <cylinderGeometry args={[0.34, 0.34, 0.12, 32]} />
                      <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
                    </mesh>

                    {/* AirTag Front Face Silver */}
                    <mesh position={[0, -0.1, 1.37]} rotation={[Math.PI / 2, 0, 0]}>
                      <cylinderGeometry args={[0.26, 0.26, 0.02, 32]} />
                      <meshStandardMaterial color="#EEEEEE" metalness={0.9} roughness={0.1} />
                    </mesh>

                    {/* Titan Magnetic Buckle */}
                    <group position={[0, 0, -1.3]} rotation={[0, 0, 0]}>
                      <mesh castShadow>
                        <boxGeometry args={[0.6, 0.28, 0.24]} />
                        <meshStandardMaterial
                          color="#222222"
                          metalness={0.9}
                          roughness={0.15}
                        />
                      </mesh>
                      <mesh position={[0.15, 0, 0.13]}>
                        <boxGeometry args={[0.1, 0.15, 0.04]} />
                        <meshStandardMaterial color="#D4F442" metalness={0.5} roughness={0.3} />
                      </mesh>
                    </group>

                    {/* Engraved Pet Zone Charm */}
                    <group position={[0.7, -0.7, 0.9]} rotation={[0.3, 0.4, 0]}>
                      <mesh castShadow>
                        <cylinderGeometry args={[0.25, 0.25, 0.04, 32]} />
                        <meshStandardMaterial
                          color="#D4AF37"
                          metalness={0.95}
                          roughness={0.1}
                        />
                      </mesh>
                      {/* Charm ring loop */}
                      <mesh position={[0, 0.28, 0]}>
                        <torusGeometry args={[0.08, 0.02, 16, 32]} />
                        <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.1} />
                      </mesh>
                    </group>
                  </group>
                </Float>

                <ContactShadows
                  position={[0, -1.4, 0]}
                  opacity={0.6}
                  scale={5}
                  blur={2}
                  far={4}
                  color="#000000"
                />
                <OrbitControls
                  enableZoom={true}
                  minDistance={2.5}
                  maxDistance={6}
                  autoRotate={true}
                  autoRotateSpeed={0.8}
                />
              </Suspense>
            </Canvas>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-500">
              Đang kết nối 3D Studio...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
