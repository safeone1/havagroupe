"use client";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

// Product categories showcased on landing (icons / placeholders)
const productCategories = [
  { key: "locks", title: "Locks", desc: "High–security locking systems.", icon: "🔒", href: "/produits/serrures" },
  { key: "fire-doors", title: "Fire Doors", desc: "Certified fire resistant doors.", icon: "🚪", href: "/produits/portes-coupe-feu" },
  { key: "connected", title: "Connected Products", desc: "Smart & IoT building devices.", icon: "📡", href: "/produits/connectes" },
  { key: "access", title: "Access Control", desc: "Modern access & entry control.", icon: "🛡️", href: "/produits/controle-acces" },
  { key: "hardware", title: "Architectural Hardware", desc: "Quality hinges & fittings.", icon: "⚙️", href: "/produits/quincaillerie" },
  { key: "automation", title: "Automation", desc: "Smooth door & system automation.", icon: "🤖", href: "/produits/automation" },
];

// 18 represented brands
const brandLogos = [
  "TESA", "Yale", "Vetra", "3F", "Kale Kilit", "JIS", "CEAM", "Ozen", "Nobel", "Omni", "Janus", "Saheco", "Samet", "Metra", "Steely", "Roper", "3 Stars", "Tayg",
].map((name) => ({ name, logo: "/images/bg.png" })); // placeholder logos

const Page = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const brandsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero intro animation
    if (heroRef.current) {
      const tl = gsap.timeline();
      tl.from(heroRef.current.querySelectorAll(".hero-animate"), {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });
    }

    // About slide in from sides
    if (aboutRef.current) {
      gsap.from(aboutRef.current.querySelector(".about-content"), {
        scrollTrigger: { trigger: aboutRef.current, start: "top 80%" },
        opacity: 0,
        x: -60,
        duration: 0.9,
        ease: "power2.out",
      });
    }

    // Products grid stagger
    if (productsRef.current) {
      gsap.from(productsRef.current.querySelectorAll(".prod-card"), {
        scrollTrigger: { trigger: productsRef.current, start: "top 75%" },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.out",
      });
    }

    // Brands grid stagger
    if (brandsRef.current) {
      gsap.from(brandsRef.current.querySelectorAll(".brand-item"), {
        scrollTrigger: { trigger: brandsRef.current, start: "top 75%" },
        opacity: 0,
        y: 40,
        rotateX: 35,
        transformOrigin: "top center",
        duration: 0.6,
        stagger: 0.05,
        ease: "back.out(1.7)",
      });
    }

    // Contact form fields bounce subtle on hover (CSS+GSAP combination)
    if (contactRef.current) {
      const inputs = contactRef.current.querySelectorAll(".contact-field");
      inputs.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          gsap.to(el, { y: -3, duration: 0.25, ease: "power2.out" });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(el, { y: 0, duration: 0.3, ease: "power2.inOut" });
        });
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/85 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <NavBar />
        </div>
      </div>
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section
          ref={heroRef}
          className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden bg-neutral-900 text-white"
        >
          <Image
            src="/images/bg.png"
            alt="Modern building"
            fill
            priority
            className="object-cover opacity-55" 
          />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-6">
            <h1 className="hero-animate text-4xl md:text-6xl font-bold tracking-tight font-[family-name:var(--font-montserrat)]">
              Welcome to <span className="text-primary-foreground">HAVA HARD TRADE</span>
            </h1>
            <p className="hero-animate text-lg md:text-2xl text-white/80 font-medium">
              Innovative Building Solutions Since 2007
            </p>
            <div className="hero-animate">
              <Link
                href="#products"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                Explore Products
              </Link>
            </div>
          </div>
        </section>

        {/* About */}
        <section
          ref={aboutRef}
          id="about"
          className="relative py-24 bg-gradient-to-b from-white to-white/70"
        >
          <div className="max-w-4xl mx-auto px-6 about-content text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-[family-name:var(--font-montserrat)]">
              About Us
            </h2>
            <p className="text-neutral-700 leading-relaxed text-lg">
              From classic locks to fire doors and connected products, HAVA HARD TRADE has established itself as a key player in Morocco&apos;s building market since 2007, representing a dozen international brands across modern retail, traditional hardware, e-commerce, and large-scale projects such as hospitals and hotels. <br className="hidden md:block" /> Values: <span className="font-semibold">Partnership</span>, <span className="font-semibold">Creativity</span>, <span className="font-semibold">Ethics</span>, <span className="font-semibold">Team Spirit</span>.
            </p>
          </div>
        </section>

        {/* Products / Categories */}
        <section id="products" ref={productsRef} className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-[family-name:var(--font-montserrat)]">
                Product Categories
              </h2>
              <p className="text-neutral-600 max-w-xl">
                A diversified portfolio bringing reliability, safety and innovation to modern building environments.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {productCategories.map((cat) => (
                <Link
                  key={cat.key}
                  href={cat.href}
                  className="prod-card group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-neutral-50 border border-neutral-200/70 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-4xl drop-shadow-sm group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </span>
                    <span className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm tracking-wide">
                      {cat.key.toUpperCase().slice(0,3)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-neutral-900">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-neutral-600 flex-1">
                    {cat.desc}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-1 text-primary font-medium text-sm">
                    <span>Learn more</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-primary/10 via-transparent to-transparent" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Brands */}
        <section id="brands" ref={brandsRef} className="py-24 bg-neutral-50/60 border-y">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center font-[family-name:var(--font-montserrat)]">Brands We Represent</h2>
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {brandLogos.map((brand) => (
                <div
                  key={brand.name}
                  className="brand-item relative group aspect-square rounded-xl bg-white border border-neutral-200 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/0 transition-colors" />
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={120}
                    height={120}
                    className="object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <span className="absolute bottom-2 left-2 right-2 text-center text-[11px] font-medium tracking-wide text-neutral-600 group-hover:text-primary transition-colors">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" ref={contactRef} className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6 grid gap-12 md:grid-cols-5">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-[family-name:var(--font-montserrat)]">Contact Us</h2>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Have a project or need product guidance? Reach out and our team will respond shortly.
              </p>
              <ul className="text-sm text-neutral-700 space-y-2">
                <li><span className="font-semibold">Email:</span> contact@hava.ma</li>
                <li><span className="font-semibold">Phone:</span> +212 6 00 00 00 00</li>
                <li><span className="font-semibold">Address:</span> Casablanca, Morocco</li>
              </ul>
            </div>
            <form className="md:col-span-3 grid gap-5">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium text-neutral-700">Name</label>
                <input id="name" name="name" type="text" className="contact-field rounded-lg border border-neutral-300 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm" placeholder="Your name" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium text-neutral-700">Email</label>
                <input id="email" name="email" type="email" className="contact-field rounded-lg border border-neutral-300 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm" placeholder="you@example.com" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-medium text-neutral-700">Message</label>
                <textarea id="message" name="message" rows={5} className="contact-field resize-none rounded-lg border border-neutral-300 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm" placeholder="How can we help?" />
              </div>
              <div>
                <button type="submit" className="contact-field inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-white font-semibold shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 mt-0">
        <div className="max-w-7xl mx-auto px-6 grid gap-10 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-montserrat)]">HAVA HARD TRADE</h3>
            <p className="text-sm leading-relaxed text-white/80 max-w-xl">
              From classic locks to fire doors and connected products, we represent international leaders in the Moroccan building market since 2007. Partnership, Creativity, Ethics & Team Spirit drive everything we do.
            </p>
          </div>
          <div>
            <h4 className="text-sm uppercase font-semibold mb-4 tracking-wide">Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:underline">Home</Link></li>
              <li><Link href="#about" className="hover:underline">About</Link></li>
              <li><Link href="#products" className="hover:underline">Products</Link></li>
              <li><Link href="#brands" className="hover:underline">Brands</Link></li>
              <li><Link href="#contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm uppercase font-semibold mb-4 tracking-wide">Social</h4>
            <div className="flex gap-3 text-white/80">
              {['X','In','Fb'].map(s => (
                <span key={s} className="h-9 w-9 inline-flex items-center justify-center rounded-full ring-1 ring-white/30 hover:bg-white/10 text-xs font-semibold tracking-wide">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center text-[11px] mt-10 tracking-wide opacity-80">
          © {new Date().getFullYear()} HAVA HARD TRADE. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Page;
