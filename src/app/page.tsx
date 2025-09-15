"use client";

import React, { Suspense, lazy } from "react";
import { Header } from "@/components/layout";

const HeroSection = lazy(() => import("@/components/home/HeroSection"));
const AboutSection = lazy(() => import("@/components/home/AboutSection"));
const ProductsSection = lazy(() => import("@/components/home/ProductsSection"));
const BrandsSection = lazy(() => import("@/components/home/BrandsSection"));
const ContactSection = lazy(() => import("@/components/home/ContactSection"));
const Footer = lazy(() => import("@/components/layout/Footer"));
// Loading component
const SectionSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-96 bg-gray-200 rounded-lg"></div>
  </div>
);

const HomePage = () => {

  return (
    <div className="min-h-screen bg-white font-montserrat">
      <Header />
      <main className="page-content pt-24 lg:pt-28">
        <HeroSection />
        <Suspense fallback={<SectionSkeleton />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ProductsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <BrandsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection />
        </Suspense>
      </main>
      <Suspense fallback={<SectionSkeleton />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default HomePage;
