"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Footer entrance animation
      gsap.fromTo(
        ".footer-content",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            end: "bottom 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Footer sections stagger animation
      gsap.fromTo(
        ".footer-section",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            end: "bottom 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Social icons animation
      gsap.fromTo(
        ".social-icon",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".social-icons",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { name: "Products", href: "#products" },
    { name: "Brands", href: "#brands" },
    { name: "Contact", href: "#contact" },
  ];

  const productCategories = [
    { name: "Security Locks", href: "/products/locks" },
    { name: "Fire Doors", href: "/products/fire-doors" },
    { name: "Smart Products", href: "/products/smart-products" },
    { name: "Door Hardware", href: "/products/door-hardware" },
    { name: "Access Control", href: "/products/access-control" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#911828] via-blue-500 to-[#911828]"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#911828]/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="footer-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="footer-section lg:col-span-1 space-y-6">
            <div>
              <Link href="/" className="flex items-center space-x-3 group mb-4">
                <div className="w-12 h-12 bg-[#911828] rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white group-hover:text-[#911828] transition-colors duration-300">
                    HAVA HARD TRADE
                  </h1>
                  <p className="text-xs text-gray-400">
                    Building Solutions Since 2007
                  </p>
                </div>
              </Link>
              <p className="text-gray-400 leading-relaxed">
                Leading provider of innovative building solutions in Morocco,
                representing 18 international brands with a commitment to
                quality, innovation, and customer satisfaction.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300">
                <Mail className="w-4 h-4 text-[#911828]" />
                <span className="text-sm">contact@havagroup.ma</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300">
                <Phone className="w-4 h-4 text-[#911828]" />
                <span className="text-sm">+212 5XX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300">
                <MapPin className="w-4 h-4 text-[#911828]" />
                <span className="text-sm">Casablanca, Morocco</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold text-white mb-6 relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#911828] rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold text-white mb-6 relative">
              Products
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#911828] rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {productCategories.map((category, index) => (
                <li key={index}>
                  <Link
                    href={category.href}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 block"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold text-white mb-6 relative">
              Connect With Us
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#911828] rounded-full"></div>
            </h3>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Stay updated with the latest building solutions and industry news.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-8">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:border-[#911828] focus:ring-1 focus:ring-[#911828] transition-all duration-300 text-white placeholder-gray-400"
                />
                <button className="px-6 py-3 bg-[#911828] hover:bg-[#7a1422] text-white rounded-r-lg transition-colors duration-300 font-medium">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-gray-400 text-sm mb-4">
                Follow us on social media
              </p>
              <div className="social-icons flex space-x-4">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="social-icon w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#911828] transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-content mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} HAVA HARD TRADE. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                href="/sitemap"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
