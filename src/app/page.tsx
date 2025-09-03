import NavBar from "@/components/NavBar";
import Image from "next/image";
import React from "react";

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
];

const categories = [
  { name: "Purificateurs", icon: "🌬️" },
  { name: "Ventilateurs", icon: "🌀" },
  { name: "Humidificateurs", icon: "💧" },
];

const Page = () => {
  return (
    <div>
      <NavBar isHome className="" />
      {/* Hero Section */}
      <section className="relative h-[60svh] flex items-center justify-center bg-gradient-to-br from-primary/10 to-white">
        <Image
          src={"/images/bg.png"}
          className="object-cover absolute  inset-0   opacity-30"
          fill
          alt="bg"
        />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 drop-shadow-lg">
            Bienvenue chez Hava
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 mb-6">
            Découvrez nos solutions innovantes pour un air sain et frais chez
            vous.
          </p>
          <a
            href="#products"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition"
          >
            Voir les produits
          </a>
        </div>
      </section>

      {/* Products Showcase */}
      <section id="products" className="py-16 bg-white">
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
                <a
                  href="#"
                  className="text-primary font-medium hover:underline"
                >
                  En savoir plus
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-white">
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
                <span className="text-5xl mb-3">{cat.icon}</span>
                <span className="text-lg font-semibold text-primary">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
