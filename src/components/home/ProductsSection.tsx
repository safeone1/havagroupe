"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Lock,
  Shield,
  Zap,
  DoorOpen,
  Key,
  Wifi,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const ProductsSection = () => {
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

      // Products grid cascading animation
      gsap.fromTo(
        ".product-card",
        { y: 60, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 70%",
            end: "bottom 40%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Floating icons animation
      gsap.to(".floating-icon", {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
      });

      // Background gradient animation
      gsap.fromTo(
        ".gradient-bg",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 2,
          ease: "power2.out",
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

  const products = [
    {
      id: "locks",
      title: "Security Locks",
      description: "Premium locks for residential and commercial security",
      icon: Lock,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      features: ["High Security", "Durable Materials", "Modern Design"],
    },
    {
      id: "fire-doors",
      title: "Fire Doors",
      description:
        "Fire-resistant doors meeting international safety standards",
      icon: Shield,
      gradient: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
      features: ["Fire Resistant", "Safety Certified", "Multiple Sizes"],
    },
    {
      id: "smart-products",
      title: "Connected Products",
      description: "Smart building solutions with IoT connectivity",
      icon: Wifi,
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      features: ["IoT Enabled", "Remote Control", "Smart Integration"],
    },
    {
      id: "door-hardware",
      title: "Door Hardware",
      description: "Complete range of door hardware and accessories",
      icon: DoorOpen,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      features: ["Complete Range", "Quality Materials", "Easy Installation"],
    },
    {
      id: "access-control",
      title: "Access Control",
      description: "Advanced access control systems for modern buildings",
      icon: Key,
      gradient: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50",
      features: ["Digital Access", "User Management", "Audit Trails"],
    },
    {
      id: "innovative-solutions",
      title: "Innovative Solutions",
      description: "Cutting-edge building technology and automation",
      icon: Zap,
      gradient: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      features: ["Automation", "Energy Efficient", "Future Ready"],
    },
  ];

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-white overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="gradient-bg absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-[#911828]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="gradient-bg absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-blue-500/5 to-transparent rounded-full blur-2xl"></div>
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
              Products
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#911828]/50 rounded-full"></div>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive building solutions from security to smart technology
          </p>
        </div>

        {/* Products Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#911828]/20 overflow-hidden"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}
              ></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`floating-icon w-16 h-16 ${product.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <product.icon
                    className={`w-8 h-8 text-gray-700 group-hover:text-[#911828] transition-colors duration-300`}
                  />
                </div>

                {/* Title and Description */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#911828] transition-colors duration-300">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {product.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center text-sm text-gray-500"
                    >
                      <div className="w-1.5 h-1.5 bg-[#911828] rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href={`/products/${product.id}`}
                  className="inline-flex items-center text-[#911828] font-semibold hover:text-[#7a1422] transition-colors duration-300 group/link"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#911828]/20 rounded-3xl transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-[#911828] text-white text-lg font-semibold rounded-full hover:bg-[#7a1422] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            View All Products
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
