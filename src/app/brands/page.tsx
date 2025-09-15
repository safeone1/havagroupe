import React from "react";
import { Metadata } from "next";
import { BrandGrid } from "@/components/brands/BrandGrid";
import { getBrands } from "@/lib/actions/brands";

export const metadata: Metadata = {
  title: "Brands | Hava Group",
  description: "Explore our collection of trusted brands and their products.",
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="min-h-screen bg-background pt-24 lg:pt-28">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Brands</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated collection of trusted brands, each offering 
            high-quality products and innovative solutions.
          </p>
        </div>

        {/* Brand Grid */}
        <BrandGrid brands={brands} />
      </div>
    </div>
  );
}
