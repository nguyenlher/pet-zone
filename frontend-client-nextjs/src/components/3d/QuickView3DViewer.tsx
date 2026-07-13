'use client';

import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { RealPet3DModel } from './RealPet3DModel';
import { PetProductModel } from './PetProductModel';
import { Play, Pause, AlertCircle } from 'lucide-react';

interface QuickView3DViewerProps {
  modelUrl?: string;
  isPet?: boolean;
  productName: string;
  productColor?: string;
}

class ThreeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('3D Model viewer render error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-neutral-100 text-neutral-600">
            <AlertCircle className="w-8 h-8 text-neutral-400 mb-2" />
            <p className="text-xs font-mono font-medium">Không thể hiển thị mô hình 3D trên thiết bị này.</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export const QuickView3DViewer: React.FC<QuickView3DViewerProps> = ({
  modelUrl,
  isPet = false,
  productName,
  productColor = '#EAE5D9',
}) => {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[360px] bg-neutral-100 border border-neutral-200 overflow-hidden select-none touch-none">
      {/* Play/Pause Auto-rotate toggle */}
      <div className="absolute top-3 right-3 z-10">
        <button
          type="button"
          onClick={() => setAutoRotate((r) => !r)}
          className="p-1.5 bg-white/90 border border-neutral-300 hover:bg-black hover:text-white hover:border-black text-black text-xs transition-colors cursor-pointer"
          title={autoRotate ? 'Tạm dừng xoay' : 'Tự động xoay'}
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Optimized Canvas centered for mobile & desktop */}
      <ThreeErrorBoundary>
        <Canvas
          // Cap DPR at [1, 1.5] to prevent mobile GPU thermal throttling / lag on Retina displays
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 3.2], fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          onPointerDown={() => setAutoRotate(false)}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[4, 6, 4]} intensity={1.5} />
          <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#FFF8F0" />

          <Suspense fallback={null}>
            {modelUrl ? (
              <RealPet3DModel
                key={modelUrl}
                modelUrl={modelUrl}
                autoRotate={autoRotate}
                scaleMultiplier={1}
                position={[0, 0, 0]}
                centerTop={false}
              />
            ) : (
              <PetProductModel
                color={productColor}
                autoRotate={autoRotate}
              />
            )}

            {/* Lightweight contact shadow below centered model */}
            <ContactShadows
              position={[0, -0.9, 0]}
              opacity={0.4}
              scale={3.5}
              blur={2}
              far={3}
              resolution={256}
            />
            <Environment preset="city" />

            <OrbitControls
              target={[0, 0, 0]}
              enablePan={false}
              enableZoom={true}
              minDistance={1.4}
              maxDistance={4.2}
              autoRotate={autoRotate}
              autoRotateSpeed={1.8}
              maxPolarAngle={Math.PI / 2 + 0.15}
              minPolarAngle={Math.PI / 6}
            />
          </Suspense>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};

export default QuickView3DViewer;
