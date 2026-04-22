import { useEffect } from 'react';
import GLBViewer from '../components/GLBViewer';

const MODEL_URL = '/models/pet-store.glb';

export default function Store3D() {
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (footer) footer.style.display = 'none';
    return () => { if (footer) footer.style.display = ''; };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 80,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      <GLBViewer url={MODEL_URL} />
    </div>
  );
}
