"use client";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Carousel from "@/components/ui/carousel";
import { Vortex } from "@/components/ui/vortex";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
const products = [
  {
    name: "Purificateur d'air",
    image: "/images/bg.png",
    description: "Respirez un air pur avec Hava.",
  },
  {
    name: "Ventilateur intelligent",
    image: "/images/bg.png",
    description: "Fraîcheur et technologie réunies.",
  },
  {
    name: "Humidificateur",
    image: "/images/bg.png",
    description: "Gardez l'air ambiant optimal.",
  },
  {
    name: "Purificateur d'air",
    image: "/images/bg.png",
    description: "Respirez un air pur avec Hava.",
  },
  {
    name: "Ventilateur intelligent",
    image: "/images/bg.png",
    description: "Fraîcheur et technologie réunies.",
  },
];

const categories = [
  { name: "Purificateurs", icon: "🌬️" },
  { name: "Ventilateurs", icon: "🌀" },
  { name: "Humidificateurs", icon: "💧" },
];

const carouselSlides = products.map((prod) => ({
  title: prod.name,
  button: "Découvrir",
  src: prod.image,
}));

const brands = [
  { name: "Dyson", logo: "/images/bg.png" },
  { name: "Philips", logo: "/images/bg.png" },
  { name: "Xiaomi", logo: "/images/bg.png" },
  { name: "Rowenta", logo: "/images/bg.png" },
  { name: "Sharp", logo: "/images/bg.png" },
];

const Page = () => {
  // automatic carousel logic
  const [carouselIndex, setCarouselIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const brandsRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 3500); // 3.5 seconds
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const sections = [
      heroRef,
      carouselRef,
      brandsRef,
      productsRef,
      categoriesRef,
      whyRef,
    ];
    sections.forEach((ref, i) => {
      if (ref.current) {
        gsap.from(ref.current, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }
    });
  }, []);

  return (
    <div>
      <NavBar isHome className="" />
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-[70svh] flex items-center justify-center  overflow-hidden"
      >
        <Vortex className="absolute inset-0 h-full w-full" />
        <Image
          src={"/images/bg.png"}
          className="object-cover absolute inset-0 mix-blend-screen "
          fill
          alt="bg"
        />
        <div className="absolute  z-10 text-center max-w-2xl mx-auto px-5">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 drop-shadow-lg">
            Bienvenue chez Hava
          </h1>
          <p className="text-lg md:text-2xl text-white mb-6">
            Découvrez nos solutions innovantes pour un air sain et frais chez
            vous.
          </p>
          <Link
            href="#products"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition"
          >
            Voir les produits
          </Link>
        </div>
      </section>

      {/* Carousel Section */}
      {/* Brands Section */}
      <section ref={brandsRef} className="py-12 bg-white border-t">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary">
            Nos Marques
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {brands.map((brand, idx) => {
              const slug = brand.name.toLowerCase().replace(/\s+/g, "-");
              return (
                <Link
                  key={idx}
                  href={`/marques/${slug}`}
                  className="flex flex-col items-center group hover:scale-105 transition"
                >
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={80}
                    height={80}
                    className="rounded-full mb-2 object-cover shadow group-hover:ring-2 group-hover:ring-primary"
                  />
                  <p className="text-base font-semibold text-gray-700 group-hover:text-primary">
                    {brand.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section
        ref={carouselRef}
        className="py-16 bg-white flex flex-col items-center w-full overflow-x-hidden"
      >
        <h2 className="text-3xl font-bold text-center mb-10 text-primary">
          En vedette
        </h2>
        <div className="w-full flex justify-center">
          <Carousel
            slides={carouselSlides}
            current={carouselIndex}
            setCurrent={setCarouselIndex}
          />
        </div>
      </section>

      {/* Products Showcase */}
      <section ref={productsRef} id="products" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-primary">
            Nos Produits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((prod, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl shadow p-6 flex flex-col items-center hover:scale-105 transition"
              >
                <Image
                  src={prod.image}
                  alt={prod.name}
                  width={180}
                  height={180}
                  className="rounded-lg mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {prod.name}
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  {prod.description}
                </p>
                <Link
                  href="#"
                  className="text-primary font-medium hover:underline"
                >
                  En savoir plus
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section
        ref={categoriesRef}
        className="py-16 bg-gradient-to-br from-primary/5 to-white"
      >
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-primary">
            Catégories
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center bg-white rounded-xl shadow p-6 w-40 hover:bg-primary/10 transition"
              >
                <Link href={""} className="text-5xl mb-3">
                  {cat.icon}
                </Link>
                <Link href={""} className="text-lg font-semibold text-primary">
                  {cat.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Hava Section */}
      <section ref={whyRef} className="py-16 bg-white border-t">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-primary">
            Pourquoi choisir Hava ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow hover:scale-105 transition">
              <Link className="text-4xl mb-3" href={""}>
                🔒
              </Link>
              <h3 className="font-semibold text-lg mb-2 text-primary">
                Qualité & Sécurité
              </h3>
              <p className="text-gray-600">
                Des produits certifiés pour garantir un air sain et sécurisé
                chez vous.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow hover:scale-105 transition">
              <Link className="text-4xl mb-3" href={""}>
                ⚡
              </Link>
              <h3 className="font-semibold text-lg mb-2 text-primary">
                Technologie Innovante
              </h3>
              <p className="text-gray-600">
                Des solutions connectées et intelligentes pour un confort
                optimal.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow hover:scale-105 transition">
              <Link className="text-4xl mb-3" href={""}>
                💡
              </Link>
              <h3 className="font-semibold text-lg mb-2 text-primary">
                Simplicité d&apos;utilisation
              </h3>
              <p className="text-gray-600">
                Des appareils faciles à installer et à utiliser au quotidien.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <footer className="bg-primary text-white py-10 mt-16 border-t">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-10 justify-between items-start">
          <div className="flex-1 min-w-[250px]">
            <h3 className="text-2xl font-bold mb-4">HaVa HaRD TRaDE</h3>
            <p className="text-sm leading-relaxed mb-4">
              De la serrure classique en passant par la porte coupe feu, vers
              les produits innovants connectés,
              <br />
              HaVa HaRD TRaDE Link développé sa présence dans le marché du
              bâtiment au Maroc comme acteur incontournable.
              <br />
              <br />
              Créée en 2007, la société HaVa HaRD TRaDE représente actuellement
              une dizaine de marques internationales leader dans le domaine du
              bâtiment.
              <br />
              <br />
              Sa présence dans le secteur moderne (grandes surfaces de
              bricolages), dans le secteur traditionnel (droguerie et revendeur
              de quincaillerie), sur le e-commerce (marketplace et drop
              shipping) et sur des projets de grande envergure (parkings
              publics, hôpitaux, hôtels) rend de la société HaVa HaRD TRaDE l’un
              des leaders sur le marché marocain.
              <br />
              <br />
              Enfin, « Partenariat, créativité, éthique et esprit d’équipe »
              telles sont les valeurs que la société HaVa HaRD TRaDE s’est
              engagée à respecter vis à vis de ses partenaires.
            </p>
          </div>
          <div className="flex-1 min-w-[200px]">
            <h4 className="text-lg font-semibold mb-3">Liens utiles</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:underline">
                  accueil
                </Link>
              </li>
              <li>
                <Link href="/marques" className="hover:underline">
                  Marques
                </Link>
              </li>
              <li>
                <Link href="/produits" className="hover:underline">
                  Produits
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex-1 min-w-[200px]">
            <h4 className="text-lg font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                Email :{" "}
                <Link href="mailto:contact@hava.ma" className="underline">
                  contact@hava.ma
                </Link>
              </li>
              <li>
                Téléphone :{" "}
                <Link href="tel:+212600000000" className="underline">
                  +212 6 00 00 00 00
                </Link>
              </li>
              <li>adresse : Casablanca, Maroc</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs mt-8 opacity-70">
          &copy; {new Date().getFullYear()} HaVa HaRD TRaDE. Tous droits
          réservés.
        </div>
      </footer>
    </div>
  );
};

export default Page;
