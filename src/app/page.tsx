"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import BrandsSection from "@/components/BrandsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize smooth scroll behavior
    const ctx = gsap.context(() => {
      // Set up global animations
      gsap.set("body", { overflow: "hidden" });

      // Page entrance animation
      gsap
        .timeline()
        .to("body", { overflow: "auto", duration: 0.1 })
        .from(".page-content", {
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-white font-montserrat">
      <Header />
      <main className="page-content">
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <BrandsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
