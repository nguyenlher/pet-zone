import { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, ContactShadows, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        color: '#78716c',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{
          width: 48, height: 48,
          border: '3px solid #e7e5e4',
          borderTopColor: '#f59e0b',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <span style={{ fontSize: 13, fontWeight: 500 }}>
          Loading 3D... {progress.toFixed(0)}%
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  );
}

function AnimatedModel({ url }) {
  const { scene, animations } = useGLTF(url);
  const groupRef = useRef();
  const mixerRef = useRef();

  useEffect(() => {
    if (groupRef.current) {
      scene.position.set(0, 0, 0);
      scene.scale.set(1, 1, 1);
      scene.rotation.set(0, 0, 0);

      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      scene.position.x -= center.x;
      scene.position.y -= center.y;
      scene.position.z -= center.z;

      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const scale = 2.5 / maxDim;
        groupRef.current.scale.setScalar(scale);
      }

      const newBox = new THREE.Box3().setFromObject(groupRef.current);
      const yOffset = -newBox.min.y;
      groupRef.current.position.y = yOffset;
    }

    if (animations && animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(scene);
      const action = mixerRef.current.clipAction(animations[0]);
      action.play();
    }

    return () => {
      if (mixerRef.current) mixerRef.current.stopAllAction();
    };
  }, [scene, animations]);

  useFrame((_, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

export default function Pet3DViewer({ modelUrl }) {
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const containerRef = useRef();
  const canvasWrapRef = useRef();

  const handleContextLost = useCallback((e) => {
    e.preventDefault();
    setTimeout(() => setCanvasKey(k => k + 1), 500);
  }, []);

  const handleContextRestored = useCallback(() => {
    console.info('WebGL context restored');
  }, []);

  useEffect(() => {
    const canvas = canvasWrapRef.current?.querySelector('canvas');
    if (!canvas) return;
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [canvasKey, handleContextLost, handleContextRestored]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  if (hasError) {
    return (
      <div className="viewer-3d-error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        <p>Unable to load 3D model</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`viewer-3d-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <div ref={canvasWrapRef} style={{ width: '100%', height: '100%' }}>
        <Canvas
          key={canvasKey}
          camera={{ position: [3, 2, 4], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: false,
          }}
          dpr={[1, 1.5]}
          onError={() => setHasError(true)}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />
          <directionalLight position={[-3, 4, -5]} intensity={0.4} />
          <hemisphereLight skyColor="#ffffff" groundColor="#b0b0b0" intensity={0.4} />

          <Suspense fallback={<Loader />}>
            <AnimatedModel url={modelUrl} />
            <ContactShadows position={[0, -1, 0]} opacity={0.35} scale={8} blur={2.5} far={4} />
          </Suspense>

          <OrbitControls
            enablePan={false}
            minDistance={2}
            maxDistance={8}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={1.5}
            target={[0, 0, 0]}
          />
        </Canvas>
      </div>

      <div className="viewer-3d-hints">
        <span>Drag to rotate | Scroll to zoom</span>
      </div>

      <button className="viewer-3d-fullscreen" onClick={toggleFullscreen} title="Toggle fullscreen">
        {isFullscreen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        )}
      </button>

      <div className="viewer-3d-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
        3D
      </div>
    </div>
  );
}
