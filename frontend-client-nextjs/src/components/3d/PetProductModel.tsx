'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface PetProductModelProps {
  color?: string;
  mousePos?: { x: number; y: number };
  autoRotate?: boolean;
}

export const PetProductModel: React.FC<PetProductModelProps> = ({
  color = '#EAE5D9',
  mousePos = { x: 0, y: 0 },
  autoRotate = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const bowlRef = useRef<THREE.Mesh>(null);
  const foodRef = useRef<THREE.Group>(null);
  const decorRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smoothly interpolate rotation towards mouse position with float physics
      const targetRotationY = autoRotate
        ? groupRef.current.rotation.y + delta * 0.45
        : mousePos.x * 0.8;
      const targetRotationX = mousePos.y * 0.4 + 0.35; // Slight tilt towards viewer

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

    if (decorRef.current) {
      decorRef.current.rotation.y -= delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={1.2}>
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.5}>
        {/* Main Ergonomic Pet Ceramic Bowl */}
        <group position={[0, 0, 0]}>
          {/* Bowl Base Stand (minimal bamboo/matte wooden cylinder) */}
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[1.35, 1.45, 0.4, 48]} />
            <meshStandardMaterial
              color="#D8CCA8"
              roughness={0.7}
              metalness={0.05}
            />
          </mesh>

          {/* Non-slip Rubber Base Ring */}
          <mesh position={[0, -0.68, 0]}>
            <torusGeometry args={[1.38, 0.04, 16, 48]} />
            <meshStandardMaterial color="#2B2B2B" roughness={0.9} />
          </mesh>

          {/* Ergonomic Tilted Ceramic Bowl */}
          <group position={[0, 0.1, 0]} rotation={[-0.15, 0, 0]}>
            {/* Outer Ceramic Shell */}
            <mesh ref={bowlRef} castShadow receiveShadow>
              <cylinderGeometry args={[1.5, 1.15, 0.85, 64, 1, true]} />
              <meshStandardMaterial
                color={color}
                roughness={0.25}
                metalness={0.1}
                envMapIntensity={1.2}
              />
            </mesh>

            {/* Bowl Rim Smooth Lip */}
            <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.48, 0.08, 24, 64]} />
              <meshStandardMaterial
                color={color}
                roughness={0.2}
                metalness={0.15}
              />
            </mesh>

            {/* Bowl Inner Bottom */}
            <mesh position={[0, -0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[1.15, 64]} />
              <meshStandardMaterial
                color={color}
                roughness={0.3}
                metalness={0.05}
              />
            </mesh>

            {/* Premium Gold Accent Ring or Logo Badge */}
            <mesh position={[0, 0, 1.34]} rotation={[0.15, 0, 0]}>
              <boxGeometry args={[0.4, 0.15, 0.02]} />
              <meshStandardMaterial
                color="#D4AF37"
                metalness={0.85}
                roughness={0.2}
              />
            </mesh>

            {/* Organic Kibbles / Treats in Bowl */}
            <group ref={foodRef} position={[0, 0.05, 0]}>
              {/* Healthy Salmon Kibbles */}
              <mesh position={[0, -0.1, 0]} rotation={[-0.1, 0, 0]}>
                <cylinderGeometry args={[1.22, 1.05, 0.3, 32]} />
                <meshStandardMaterial
                  color="#634735"
                  roughness={0.9}
                  metalness={0.0}
                />
              </mesh>

              {/* Scattered Crispy Organic Treats on Top */}
              {[
                { x: -0.4, y: 0.12, z: 0.2, r: 0.14, c: '#E29578' },
                { x: 0.3, y: 0.14, z: -0.3, r: 0.16, c: '#8D6E63' },
                { x: 0.1, y: 0.16, z: 0.4, r: 0.13, c: '#D4A373' },
                { x: -0.2, y: 0.15, z: -0.2, r: 0.15, c: '#E29578' },
                { x: 0.45, y: 0.11, z: 0.1, r: 0.14, c: '#8D6E63' },
              ].map((kibble, i) => (
                <mesh key={i} position={[kibble.x, kibble.y, kibble.z]}>
                  <sphereGeometry args={[kibble.r, 12, 12]} />
                  <meshStandardMaterial color={kibble.c} roughness={0.8} />
                </mesh>
              ))}
            </group>
          </group>
        </group>

        {/* Orbiting Playful 3D Micro-props */}
        <group ref={decorRef}>
          {/* Floating Bone Accent */}
          <group position={[2.2, 0.8, -0.5]} rotation={[0.4, 0.3, 0.2]}>
            <Float speed={3} rotationIntensity={0.8} floatIntensity={0.6}>
              <mesh castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.65, 16]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.32, 0.08]}>
                <sphereGeometry args={[0.13, 16, 16]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.32, -0.08]}>
                <sphereGeometry args={[0.13, 16, 16]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
              </mesh>
              <mesh position={[0, -0.32, 0.08]}>
                <sphereGeometry args={[0.13, 16, 16]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
              </mesh>
              <mesh position={[0, -0.32, -0.08]}>
                <sphereGeometry args={[0.13, 16, 16]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
              </mesh>
            </Float>
          </group>

          {/* Floating Fish Biscuit Accent */}
          <group position={[-2.1, 0.5, 0.8]} rotation={[-0.3, 0.5, -0.2]}>
            <Float speed={2.8} rotationIntensity={0.9} floatIntensity={0.5}>
              <mesh castShadow>
                <coneGeometry args={[0.3, 0.65, 16]} />
                <meshStandardMaterial color="#FFA07A" roughness={0.5} />
              </mesh>
              <mesh position={[0, -0.38, 0]} rotation={[0, 0, Math.PI]}>
                <coneGeometry args={[0.22, 0.28, 16]} />
                <meshStandardMaterial color="#FF7F50" roughness={0.5} />
              </mesh>
            </Float>
          </group>

          {/* Floating Treat Pack Miniature */}
          <group position={[1.8, -0.6, 1.2]} rotation={[0.2, -0.4, 0.1]}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.4}>
              <RoundedBox args={[0.55, 0.8, 0.18]} radius={0.06} smoothness={4} castShadow>
                <meshStandardMaterial
                  color="#D4F442"
                  roughness={0.3}
                  metalness={0.2}
                />
              </RoundedBox>
            </Float>
          </group>
        </group>
      </Float>
    </group>
  );
};
