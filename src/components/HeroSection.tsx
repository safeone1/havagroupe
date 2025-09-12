"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Building2, Shield, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero background animation
      gsap.fromTo(
        ".hero-bg",
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: "power2.out" }
      );

      // Main title animation
      gsap.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.5 }
      );

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.8 }
      );

      // CTA button animation
      gsap.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 1.1,
        }
      );

      // Features animation
      gsap.fromTo(
        ".feature-item",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          delay: 1.4,
        }
      );

      // Floating animation for decorative elements
      gsap.to(".floating-element", {
        y: -20,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.5,
      });

      // Parallax effect on scroll
      gsap.to(".hero-bg", {
        y: "50%",
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: Shield, text: "Security Solutions", delay: 0 },
    { icon: Building2, text: "Building Innovation", delay: 0.2 },
    { icon: Zap, text: "Smart Technology", delay: 0.4 },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white"
    >
      {/* Background */}
      <div className="hero-bg absolute inset-0 bg-gradient-to-br from-blue-50/20 via-white to-gray-50/30">
        {/* Geometric shapes */}
        <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-[#911828]/10 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="floating-element absolute bottom-40 left-1/4 w-16 h-16 bg-[#911828]/20 rounded-full blur-lg"></div>
        <Image
          src={"/images/bg.jpg"}
          fill
          quality={100}
          alt="des"
          className="object-cover opacity-90 hero-bg "
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Title */}
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-tight"
          >
            Welcome to{" "}
            <span className="text-[#911828] relative">
              HAVA
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#911828]/30 rounded-full"></div>
            </span>
            <br />
            <span className="text-gray-700">HARD TRADE</span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl lg:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            Innovative Building Solutions Since{" "}
            <span className="font-bold text-[#911828]">2007</span>
            <br />
            <span className="text-lg md:text-xl text-gray-500">
              From classic locks to fire doors and connected products
            </span>
          </p>

          {/* CTA Button */}
          <div ref={ctaRef} className="flex justify-center">
            <Link
              href="#products"
              className="group inline-flex items-center px-8 py-4 bg-[#911828] text-white text-lg font-semibold rounded-full hover:bg-[#7a1422] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              Explore Products
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Features */}
          <div
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-12"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-item flex flex-col items-center space-y-4 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:bg-white/70 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#911828]/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-[#911828]" />
                </div>
                <span className="text-gray-700 font-medium">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
