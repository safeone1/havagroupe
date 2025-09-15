import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Optimized loading component for products page
 * Provides accessible loading states with proper ARIA labels
 */
export function ProductsLoading() {
  return (
    <div className="min-h-screen bg-background" role="status" aria-label="Loading products">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-96 max-w-lg" />
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-3">
            <Skeleton className="h-6 w-64 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only">Loading products...</span>
    </div>
  );
}

/**
 * Compact loading component for when filters are applied
 */
export function ProductsGridLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Loading products">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
      <span className="sr-only">Loading products...</span>
    </div>
  );
}
