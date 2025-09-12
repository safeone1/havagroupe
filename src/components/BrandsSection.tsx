"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const BrandsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Brands grid cascading animation
      gsap.fromTo(
        ".brand-card",
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 70%",
            end: "bottom 40%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Continuous floating animation for brand cards
      gsap.to(".brand-card", {
        y: -5,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.2,
      });

      // Background elements animation
      gsap.fromTo(
        ".brand-bg-element",
        { scale: 0, opacity: 0, rotation: -45 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 2,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 40%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const brands = [
    "TESA",
    "YALE",
    "Vetra",
    "3F",
    "KALE KILIT",
    "JIS",
    "CEAM",
    "OZEN",
    "NOBEL",
    "OMNI",
    "JANUS",
    "SAHECO",
    "SAMET",
    "METRA",
    "STEELY",
    "ROPER",
    "3 STARS",
    "TAYG",
  ];

  return (
    <section
      id="brands"
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="brand-bg-element absolute top-10 left-10 w-32 h-32 bg-[#911828]/5 rounded-full blur-2xl"></div>
        <div className="brand-bg-element absolute top-1/3 right-20 w-24 h-24 bg-blue-500/5 rounded-full blur-xl"></div>
        <div className="brand-bg-element absolute bottom-20 left-1/3 w-40 h-40 bg-[#911828]/3 rounded-full blur-3xl"></div>
        <div className="brand-bg-element absolute bottom-1/4 right-10 w-28 h-28 bg-green-500/5 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Our{" "}
            <span className="text-[#911828] relative">
              Brands
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#911828]/50 rounded-full"></div>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Representing 18 internationally recognized brands in building
            solutions
          </p>
        </div>

        {/* Brands Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8"
        >
          {brands.map((brand, index) => (
            <div
              key={index}
              className="brand-card group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#911828]/30 overflow-hidden cursor-pointer"
            >
              {/* Hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#911828]/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#911828]/10 to-blue-500/10 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform scale-150"></div>

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Brand Logo Placeholder */}
                <div className="w-full h-16 bg-gray-100 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-50 transition-colors duration-300 overflow-hidden">
                  <Image
                    src={`/images/brands/${brand}.svg`}
                    alt={`${brand} logo`}
                    width={80}
                    height={40}
                    className="max-w-full max-h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
                    onError={(e) => {
                      // Fallback to text if image doesn&apos;t exist
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling!.classList.remove(
                        "hidden"
                      );
                    }}
                  />
                  <div className="hidden text-gray-600 font-semibold text-sm group-hover:text-[#911828] transition-colors duration-300">
                    {brand}
                  </div>
                </div>

                {/* Brand Name */}
                <h3 className="text-sm font-bold text-gray-800 group-hover:text-[#911828] transition-colors duration-300 transform group-hover:scale-105">
                  {brand}
                </h3>
              </div>

              {/* Hover border effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#911828]/20 rounded-2xl transition-colors duration-300"></div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-[#911828]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-[#911828]/10 rounded-full mb-6">
            <span className="text-[#911828] font-semibold">
              Trusted International Partners
            </span>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Each brand represents excellence in their respective fields, from
            traditional security solutions to cutting-edge smart building
            technologies. Together, they form our comprehensive portfolio of
            building solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
