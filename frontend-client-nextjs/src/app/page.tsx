'use client';

import React from 'react';
import { Navbar } from '@/components/sections/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { CategoriesSection } from '@/components/sections/CategoriesSection';
import { FeaturedProductsSection } from '@/components/sections/FeaturedProductsSection';
import { ShowroomSection } from '@/components/sections/ShowroomSection';
import { TrustSection } from '@/components/sections/TrustSection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#FAFAF8] text-[#121316]">
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <ShowroomSection />
      <TrustSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
