import { Suspense, useState, useCallback, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, ContactShadows, Center } from '@react-three/drei';

function Model({ url }) {
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
  const [key, setKey] = useState(0);
  const canvasRef = useRef(null);

  const handleContextLost = useCallback((e) => {
    e.preventDefault();
    setTimeout(() => setKey(k => k + 1), 500);
  }, []);

  const handleContextRestored = useCallback(() => {
    console.info('WebGL context restored');
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [key, handleContextLost, handleContextRestored]);

  return (
    <div ref={canvasRef} style={{ position: 'relative', width: '100%', height: '100%', background }}>
      <Suspense fallback={<Loader />}>
        <Canvas
          key={key}
          camera={{ position: [0, 1.5, 4], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
          dpr={1}
          gl={{
            powerPreference: 'default',
            antialias: true,
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false,
          }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />
          <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#c084fc" />
          <hemisphereLight skyColor="#c084fc" groundColor="#1a0533" intensity={0.3} />

          <Model url={url} />

          <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={10} blur={2} far={4} />

          <OrbitControls minDistance={1} maxDistance={20} />
        </Canvas>
      </Suspense>
    </div>
  );
}
