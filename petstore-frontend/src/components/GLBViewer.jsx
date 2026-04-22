import { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Center } from '@react-three/drei';

function Model({ url }) {
  useEffect(() => {
    if (import.meta.env.DEV) {
      const originalWarn = console.warn;
      console.warn = (...args) => {
        const msg = args[0];
        if (typeof msg === 'string' && (
          msg.includes('THREE.Clock') ||
          msg.includes('WebGLProgram') ||
          msg.includes('X4122')
        )) return;
        originalWarn(...args);
      };
      return () => { console.warn = originalWarn; };
    }
  }, []);
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

function Loader() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#0f0f1a', color: '#a78bfa', gap: 12,
    }}>
      <div style={{
        width: 44, height: 44,
        border: '3px solid #2d1b69',
        borderTopColor: '#a855f7',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Loading model...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function GLBViewer({ url, background = '#0f0f1a' }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background }}>
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 1.5, 4], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#c084fc" />

          {/* Model */}
          <Model url={url} />

          {/* Ground shadow */}
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
          />

          {/* Environment lighting (HDRI) */}
          <Environment preset="city" />

          {/* Controls: orbit, zoom, pan */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            minDistance={1}
            maxDistance={20}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
