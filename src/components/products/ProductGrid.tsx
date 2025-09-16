"use client";

import React, { memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Package, ImageIcon } from "lucide-react";
import { type ProductWithRelations } from "@/lib/actions/products";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: ProductWithRelations[];
  className?: string;
}

interface ProductCardProps {
  product: ProductWithRelations;
  index: number;
}

/**
 * Memoized ProductCard component with enhanced accessibility and performance
 */
const ProductCard = memo(({ product, index }: ProductCardProps) => {
  const primaryImage = useMemo(
    () => product.imageUrls?.[0]?.url || "/images/placeholder.png",
    [product.imageUrls]
  );

  const hasMultipleImages = useMemo(
    () => product.imageUrls && product.imageUrls.length > 1,
    [product.imageUrls]
  );

  const imageCount = useMemo(
    () => product.imageUrls?.length || 0,
    [product.imageUrls]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05, // Stagger animation
        ease: "easeOut",
      }}
      layout
    >
      <Link
        href={`/products/${product.slug}`}
        className="block"
        aria-label={`View details for ${product.name}`}
      >
        <Card className="group overflow-hidden transition-all hover:shadow-xl border-0 shadow-sm p-0 cursor-pointer">
          {/* Image Container with Enhanced Accessibility */}
          <div className="relative w-full h-48 overflow-hidden bg-muted/50">
            <Image
              src={primaryImage}
              alt={`${product.name} - ${product.brand.name} product image`}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={index < 8} // Prioritize first 8 images
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />

            {/* Multiple Images Indicator */}
            {hasMultipleImages && (
              <Badge
                variant="secondary"
                className="absolute top-3 right-3 text-xs bg-black/70 text-white border-0 shadow-sm"
              >
                <ImageIcon className="w-3 h-3 mr-1" />+{imageCount - 1}
              </Badge>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-full items-center justify-center">
                <div className="bg-white text-black shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 px-4 py-2 rounded-md flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </div>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <CardContent className="p-4 space-y-2">
            {/* Brand Badge */}
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="text-xs font-medium px-2 py-1"
              >
                {product.brand.name}
              </Badge>
            </div>

            {/* Category Badge */}
            {product.category && (
              <div className="flex items-center">
                <Badge
                  variant="secondary"
                  className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground"
                >
                  {product.category.name}
                </Badge>
              </div>
            )}

            {/* Product Name */}
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
});
ProductCard.displayName = "ProductCard";

/**
 * Enhanced ProductGrid with better performance and animations
 */
export function ProductGrid({ products, className }: ProductGridProps) {
  // Memoize the empty state to avoid re-renders
  const emptyState = useMemo(
    () => (
      <motion.div
        className={cn("text-center py-16", className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
          <Package
            className="h-10 w-10 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <h3 className="text-xl font-semibold mb-3">No products found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          No products match your current criteria.
        </p>
      </motion.div>
    ),
    [className]
  );

  if (products.length === 0) {
    return emptyState;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
      aria-label="Product grid"
    >
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <div
            key={product.id}
            aria-label={`Product: ${product.name} by ${product.brand.name}`}
          >
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
