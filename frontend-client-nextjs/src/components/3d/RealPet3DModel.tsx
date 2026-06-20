'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

interface RealPet3DModelProps {
  modelUrl: string;
  mousePos?: { x: number; y: number };
  autoRotate?: boolean;
  scaleMultiplier?: number;
}

export const RealPet3DModel: React.FC<RealPet3DModelProps> = ({
  modelUrl,
  mousePos = { x: 0, y: 0 },
  autoRotate = true,
  scaleMultiplier = 1,
}) => {
  const { scene } = useGLTF(modelUrl);
  const groupRef = useRef<THREE.Group>(null);

  // Clone scene with shadows enabled and dynamically normalize bounding box scale
  const { clonedScene, normalizedScale } = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Ensure all world transforms are calculated before measuring bounding box
    clone.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDimension = Math.max(size.x, size.y, size.z);

    // Target visual size is 1.9 units in 3D world space
    // Automatically adapts for 1x models (maxDimension ~1) and 100x models (maxDimension ~100)
    const TARGET_SIZE = 1.9;
    const computedScale = maxDimension > 0 ? (TARGET_SIZE / maxDimension) * scaleMultiplier : 1.75;

    return {
      clonedScene: clone,
      normalizedScale: computedScale,
    };
  }, [scene, scaleMultiplier]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Natural smooth rotation towards mouse position
      const targetRotationY = autoRotate
        ? groupRef.current.rotation.y + delta * 0.45
        : mousePos.x * 0.8;
      const targetRotationX = mousePos.y * 0.25;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      <Float speed={2} rotationIntensity={0.15} floatIntensity={0.25}>
        <Center top cacheKey={modelUrl}>
          <primitive object={clonedScene} scale={normalizedScale} />
        </Center>
      </Float>
    </group>
  );
};
