"use client";

import React, { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductSearch } from "@/components/products/ProductSearch";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Pagination } from "@/components/products/Pagination";
import { ProductsGridLoading } from "@/components/products/ProductsLoading";
import { AlertCircle, SlidersHorizontal, X, Filter, ShoppingBag } from "lucide-react";
import { 
  type ProductsResponse, 
  type ProductFilters as FilterParams 
} from "@/lib/actions/products";
import { useProductPage } from "@/hooks/useProductPage";
import { type FilterBadge } from "@/types/products";

interface ProductPageClientProps {
  initialData: ProductsResponse;
  initialFilters: FilterParams;
}

/**
 * Memoized Error Fallback Component with better UX
 */
const ErrorFallback = memo(({ 
  message, 
  onRetry 
}: { 
  message: string; 
  onRetry: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-4 text-center"
    role="alert"
    aria-live="polite"
  >
    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
      <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
    </div>
    <h3 className="text-xl font-semibold mb-3">Error</h3>
    <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
    <Button 
      onClick={onRetry} 
      variant="outline"
      className="min-w-[120px]"
    >
      Try Again
    </Button>
  </motion.div>
));
ErrorFallback.displayName = "ErrorFallback";

/**
 * Memoized Filter Badge Component with smooth animations
 */
const FilterBadgeComponent = memo(({ badge }: { badge: FilterBadge }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    layout
  >
    <Badge 
      variant="secondary" 
      className="flex items-center gap-2 pl-3 pr-2 py-1.5 text-sm"
    >
      <span>{badge.label}</span>
      <button
        onClick={badge.onRemove}
        className="ml-1 hover:bg-background/20 rounded-full p-1 transition-colors"
        aria-label={`Remove ${badge.label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  </motion.div>
));
FilterBadgeComponent.displayName = "FilterBadgeComponent";

/**
 * Memoized No Results Component with better UX
 */
const NoResults = memo(({ 
  hasActiveFilters, 
  onClearFilters 
}: { 
  hasActiveFilters: boolean; 
  onClearFilters: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16"
  >
    <div className="mx-auto w-20 h-20 mb-6 rounded-full bg-muted flex items-center justify-center">
      <ShoppingBag className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
    </div>
    <h3 className="text-xl font-semibold mb-3">No products found</h3>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
      {hasActiveFilters 
        ? "No products match your current filters."
        : "No products available."
      }
    </p>
    {hasActiveFilters && (
      <Button 
        onClick={onClearFilters} 
        variant="outline"
        className="min-w-[140px]"
      >
        Clear all filters
      </Button>
    )}
  </motion.div>
));
NoResults.displayName = "NoResults";

/**
 * Memoized Mobile Filters Toggle with smooth animations
 */
const MobileFiltersToggle = memo(({ 
  showFilters, 
  onToggle,
  filtersCount
}: { 
  showFilters: boolean; 
  onToggle: () => void;
  filtersCount: number;
}) => (
  <div className="lg:hidden mb-6">
    <Button
      variant="outline"
      onClick={onToggle}
      className="w-full relative"
      aria-expanded={showFilters}
      aria-controls="mobile-filters"
    >
      <SlidersHorizontal className="mr-2 h-4 w-4" />
      {showFilters ? "Hide Filters" : "Show Filters"}
      {filtersCount > 0 && (
        <Badge 
          variant="secondary" 
          className="ml-2 px-1.5 py-0.5 text-xs"
        >
          {filtersCount}
        </Badge>
      )}
    </Button>
    
    <AnimatePresence>
      {showFilters && (
        <motion.div
          id="mobile-filters"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="mt-4 p-4 border rounded-lg bg-card">
            <ProductFilters />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
));
MobileFiltersToggle.displayName = "MobileFiltersToggle";

/**
 * Enhanced ProductPageClient with better performance and UX
 */
export default function ProductPageClient({ 
  initialData, 
  initialFilters 
}: ProductPageClientProps) {
  const {
    productsData,
    loading,
    error,
    showFilters,
    currentFilters,
    hasActiveFilters,
    activeFilterBadges,
    setShowFilters,
    handleSearchChange,
    clearAllFilters,
    retryFetch,
  } = useProductPage({ initialData, initialFilters });

  // Memoized values for performance
  const activeFiltersCount = useMemo(() => 
    activeFilterBadges.length, 
    [activeFilterBadges]
  );

  const resultsText = useMemo(() => {
    if (loading || productsData.totalCount === 0) return "";
    
    const start = ((currentFilters.page || 1) - 1) * 12 + 1;
    const end = Math.min((currentFilters.page || 1) * 12, productsData.totalCount);
    
    return `Showing ${start}-${end} of ${productsData.totalCount} products`;
  }, [loading, productsData.totalCount, currentFilters.page]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Clean Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ProductSearch
            initialSearch={currentFilters.search}
            onSearchChange={handleSearchChange}
            className="max-w-lg"
          />
        </motion.div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          {/* Desktop Sidebar Filters */}
          <motion.div 
            className="hidden lg:block lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold">Filters</h2>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </div>
              <ProductFilters />
            </div>
          </motion.div>

          {/* Mobile Filters Toggle */}
          <MobileFiltersToggle
            showFilters={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
            filtersCount={activeFiltersCount}
          />

          {/* Main Content Area */}
          <motion.div 
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {/* Error State */}
            {error.hasError && (
              <ErrorFallback
                message={error.message}
                onRetry={retryFetch}
              />
            )}

            {/* Success State */}
            {!error.hasError && (
              <>
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-3">
                    {loading ? (
                      <div className="space-y-2">
                        <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground font-medium">
                          {resultsText}
                        </p>
                        
                        {hasActiveFilters && (
                          <div className="flex flex-wrap gap-2">
                            <AnimatePresence mode="popLayout">
                              {activeFilterBadges.map((badge) => (
                                <FilterBadgeComponent key={badge.key} badge={badge} />
                              ))}
                            </AnimatePresence>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearAllFilters}
                              className="h-7 px-3 text-xs hover:bg-muted"
                            >
                              Clear all
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Product Grid with loading state */}
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ProductsGridLoading />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="products"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductGrid products={productsData.products} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* No Results State */}
                {!loading && productsData.products.length === 0 && (
                  <NoResults 
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={clearAllFilters}
                  />
                )}

                {/* Enhanced Pagination */}
                {!loading && productsData.totalPages > 1 && (
                  <motion.div 
                    className="mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Pagination
                      currentPage={productsData.currentPage}
                      totalPages={productsData.totalPages}
                      hasNextPage={productsData.hasNextPage}
                      hasPreviousPage={productsData.hasPreviousPage}
                    />
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
