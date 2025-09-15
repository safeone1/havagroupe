"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ArrowRight } from "lucide-react";
import { BrandWithCounts } from "@/lib/actions/brands";
import { cn } from "@/lib/utils";

interface BrandGridProps {
  brands: BrandWithCounts[];
  loading?: boolean;
  className?: string;
}

interface BrandCardProps {
  brand: BrandWithCounts;
  className?: string;
}

function BrandCard({ brand, className }: BrandCardProps) {
  const productCount = brand._count?.products || 0;
  const catalogueCount = brand._count?.catalogues || 0;

  return (
    <Card className={cn("group overflow-hidden transition-all hover:shadow-lg", className)}>
      <Link href={`/brands/${brand.slug}`}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Brand Logo */}
            <div className="relative w-20 h-20 rounded-full bg-muted overflow-hidden">
              {brand.logoUrl ? (
                <Image
                  src={brand.logoUrl}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain p-2"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Brand Name */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {brand.name}
              </h3>
              
              {/* Description */}
              {brand.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {brand.description}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-4 text-sm">
              {productCount > 0 && (
                <Badge variant="secondary">
                  {productCount} Product{productCount !== 1 ? 's' : ''}
                </Badge>
              )}
              {catalogueCount > 0 && (
                <Badge variant="outline">
                  {catalogueCount} Catalogue{catalogueCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            {/* Arrow indicator */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

function BrandCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BrandGrid({ brands, loading = false, className }: BrandGridProps) {
  if (loading) {
    return (
      <div className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}>
        {Array.from({ length: 8 }).map((_, index) => (
          <BrandCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No brands found</h3>
        <p className="mt-2 text-muted-foreground">
          There are no brands available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      className
    )}>
      {brands.map((brand) => (
        <BrandCard key={brand.id} brand={brand} />
      ))}
    </div>
  );
}
