import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Tag, Folder, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ProductWithRelations } from "@/lib/actions/products";

interface RelatedProductsSectionProps {
  products: ProductWithRelations[];
  className?: string;
}

export default function RelatedProductsSection({ products, className }: RelatedProductsSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Produits similaires</h2>
        <Button variant="outline" asChild>
          <Link href="/products" className="gap-2">
            Voir tous les produits
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-wrap justify-start gap-2">
        {products.map((product) => (
          <RelatedProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

interface RelatedProductCardProps {
  product: ProductWithRelations;
}

function RelatedProductCard({ product }: RelatedProductCardProps) {
  const primaryImage = product.imageUrls?.[0]?.url;

  return (
    <div className="w-[160px] group bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Product Image - Full width and height */}
        <div className="relative w-full aspect-square bg-muted overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              sizes="160px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-md" />
        </div>

        {/* Product Info */}
        <div className="p-2 space-y-1">
          {/* Product Name */}
          <h3 className="font-medium text-xs leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Brand and Category - More compact */}
          <div className="flex flex-wrap gap-1">
            {product.brand && (
              <Badge variant="outline" className="text-[9px] gap-1 px-1 py-0.5 h-4">
                <Tag className="h-2 w-2" />
                {product.brand.name}
              </Badge>
            )}
            
            {product.category && (
              <Badge variant="secondary" className="text-[9px] gap-1 px-1 py-0.5 h-4">
                <Folder className="h-2 w-2" />
                {product.category.name}
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

