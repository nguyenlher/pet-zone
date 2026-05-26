import { useEffect, useRef } from 'react';

export default function Store3D() {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Ẩn footer
    const footer = document.querySelector('footer');
    if (footer) footer.style.display = 'none';
    return () => { if (footer) footer.style.display = ''; };
  }, []);

  useEffect(() => {
    // Dùng absolute URL để tránh Vite/React Router SPA fallback
    const origin = window.location.origin; // http://localhost:5173
    if (iframeRef.current) {
      iframeRef.current.src = `${origin}/unity_build/index.html`;
    }
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 80,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#0f0f1a',
    }}>
      <iframe
        ref={iframeRef}
        title="Pet Store 3D"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
        allow="autoplay; fullscreen"
        // sandbox cho phép Unity chạy scripts, nhưng cô lập khỏi parent
        sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
        onLoad={(e) => e.target.contentWindow?.focus()}
      />
    </div>
  );
}

