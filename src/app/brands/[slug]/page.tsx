import React from "react";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, ChevronRight } from "lucide-react";
import { getBrand } from "@/lib/actions/brands";
import { getCategoriesByBrand } from "@/lib/actions/products";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  // Await params (required in Next.js 15)
  const { slug } = await params;
  
  // First, we need to find the brand by slug
  // Since we don't have a direct getBrandBySlug function, we'll get all brands and find by slug
  const { getBrands } = await import("@/lib/actions/brands");
  const brands = await getBrands();
  const brand = brands.find(b => b.slug === slug);

  if (!brand) {
    return {
      title: "Brand Not Found | Hava Group",
    };
  }

  return {
    title: `${brand.name} | Hava Group`,
    description: brand.description || `Explore ${brand.name} products and categories.`,
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  // Await params (required in Next.js 15)
  const { slug } = await params;
  
  // Get all brands and find by slug (since we don't have getBrandBySlug)
  const { getBrands } = await import("@/lib/actions/brands");
  const brands = await getBrands();
  const brand = brands.find(b => b.slug === slug);

  if (!brand) {
    notFound();
  }

  // Get categories for this brand
  const categories = await getCategoriesByBrand(brand.id);

  return (
    <div className="min-h-screen bg-background pt-24 lg:pt-28">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/brands">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Brands
            </Link>
          </Button>
        </div>

      {/* Brand Header */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Brand Logo */}
          <div className="relative w-32 h-32 rounded-2xl bg-muted overflow-hidden shrink-0">
            {brand.logoUrl ? (
              <Image
                src={brand.logoUrl}
                alt={`${brand.name} logo`}
                fill
                className="object-contain p-4"
                sizes="128px"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Brand Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <h1 className="text-4xl font-bold">{brand.name}</h1>
            
            {brand.description && (
              <p className="text-lg text-muted-foreground max-w-2xl">
                {brand.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {brand._count?.products && brand._count.products > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {brand._count.products} Product{brand._count.products !== 1 ? 's' : ''}
                </Badge>
              )}
              {brand._count?.catalogues && brand._count.catalogues > 0 && (
                <Badge variant="outline" className="text-sm">
                  {brand._count.catalogues} Catalogue{brand._count.catalogues !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator className="mb-12" />

      {/* Categories Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Product Categories</h2>
          <p className="text-muted-foreground">
            Explore {brand.name} products by category
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No categories found</h3>
            <p className="mt-2 text-muted-foreground">
              This brand doesn't have any products in our catalog yet.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/products">
                  <Package className="mr-2 h-4 w-4" />
                  Browse All Products
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="group hover:shadow-lg transition-all">
                <Link href={`/products?brand=${brand.id}&category=${category.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          View {brand.name} products in this category
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* View All Products Button */}
        {categories.length > 0 && (
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href={`/products?brand=${brand.id}`}>
                <Package className="mr-2 h-4 w-4" />
                View All {brand.name} Products
              </Link>
            </Button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
