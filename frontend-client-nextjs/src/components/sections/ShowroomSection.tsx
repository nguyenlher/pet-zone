'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const InteractiveShowroom3D = dynamic(
  () => import('../3d/InteractiveShowroom3D').then((mod) => mod.InteractiveShowroom3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] rounded-3xl bg-stone-900 animate-pulse flex items-center justify-center text-stone-500">
        Đang khởi động 3D Studio...
      </div>
    ),
  }
);

export const ShowroomSection: React.FC = () => {
  return (
    <section id="showroom" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <InteractiveShowroom3D />
    </section>
  );
};
