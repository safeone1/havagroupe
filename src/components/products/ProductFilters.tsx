"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, RefreshCw } from "lucide-react";
import { type Brand, type Category } from "@/generated/prisma";
import {
  getBrandsWithProducts,
  getRootCategoriesWithProducts,
  getCategoriesByBrand,
  getSubcategoriesByCategory,
  getBrandsByCategory,
} from "@/lib/actions/products";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

interface ProductFiltersProps {
  className?: string;
}

interface FilterState {
  brandId?: number;
  categoryId?: number;
  subcategoryId?: number;
}

interface LoadingState {
  brands: boolean;
  categories: boolean;
  subcategories: boolean;
}

/**
 * Enhanced ProductFilters component with better UX and performance
 */
export function ProductFilters({ className }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse initial values from URL
  const initialFilters = useMemo(() => {
    const brandId = searchParams.get("brand")
      ? parseInt(searchParams.get("brand")!)
      : undefined;
    const categoryId = searchParams.get("category")
      ? parseInt(searchParams.get("category")!)
      : undefined;
    const subcategoryId = searchParams.get("subcategory")
      ? parseInt(searchParams.get("subcategory")!)
      : undefined;

    // If subcategory is selected, clear category to avoid conflicts
    return {
      brandId,
      categoryId: subcategoryId ? undefined : categoryId,
      subcategoryId,
    };
  }, [searchParams]);

  // State management
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  // Sync local filter state with URL params when they change
  useEffect(() => {
    const brandId = searchParams.get("brand")
      ? parseInt(searchParams.get("brand")!)
      : undefined;
    const categoryId = searchParams.get("category")
      ? parseInt(searchParams.get("category")!)
      : undefined;
    const subcategoryId = searchParams.get("subcategory")
      ? parseInt(searchParams.get("subcategory")!)
      : undefined;

    // If subcategory is selected, clear category to avoid conflicts
    setFilters({
      brandId,
      categoryId: subcategoryId ? undefined : categoryId,
      subcategoryId,
    });
  }, [searchParams]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    brands: false,
    categories: false,
    subcategories: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Debounce filter changes to avoid excessive API calls
  const debouncedFilters = useDebounce(filters, 300);

  // Memoized computed values
  const isAnyLoading = useMemo(
    () => Object.values(loading).some(Boolean),
    [loading]
  );

  // Error handler with toast notification
  const handleError = useCallback((error: unknown, context: string) => {
    console.error(`Failed to ${context}:`, error);
    setError(`Failed to ${context}`);
    toast.error(`Failed to ${context}. Please try again.`);
  }, []);

  // Data loading functions with error handling
  const loadInitialData = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, brands: true, categories: true }));
      setError(null);

      const [brandsData, categoriesData] = await Promise.all([
        getBrandsWithProducts(),
        getRootCategoriesWithProducts(),
      ]);

      setBrands(brandsData);
      setCategories(categoriesData);
    } catch (error) {
      handleError(error, "load initial data");
    } finally {
      setLoading((prev) => ({ ...prev, brands: false, categories: false }));
    }
  }, [handleError]);

  const loadCategoriesByBrand = useCallback(
    async (brandId: number) => {
      try {
        setLoading((prev) => ({ ...prev, categories: true }));
        const categoriesData = await getCategoriesByBrand(brandId);
        setCategories(categoriesData);
      } catch (error) {
        handleError(error, "load categories");
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }
    },
    [handleError]
  );

  const loadBrandsByCategory = useCallback(
    async (categoryId: number) => {
      try {
        setLoading((prev) => ({ ...prev, brands: true }));
        const brandsData = await getBrandsByCategory(categoryId);
        setBrands(brandsData);
      } catch (error) {
        handleError(error, "load brands");
      } finally {
        setLoading((prev) => ({ ...prev, brands: false }));
      }
    },
    [handleError]
  );

  const loadSubcategories = useCallback(
    async (categoryId: number, brandId?: number) => {
      try {
        setLoading((prev) => ({ ...prev, subcategories: true }));
        const subcategoriesData = await getSubcategoriesByCategory(
          categoryId,
          brandId
        );
        setSubcategories(subcategoriesData);
      } catch (error) {
        handleError(error, "load subcategories");
      } finally {
        setLoading((prev) => ({ ...prev, subcategories: false }));
      }
    },
    [handleError]
  );

  // Filter change handlers
  const handleBrandChange = useCallback(
    (value: string) => {
      const brandId = value === "all" ? undefined : parseInt(value);
      setFilters({
        brandId,
        categoryId: undefined,
        subcategoryId: undefined,
      });

      // Load related data
      if (brandId) {
        setCategories([]);
        setSubcategories([]);
        loadCategoriesByBrand(brandId);
      } else {
        setSubcategories([]);
        loadInitialData();
      }
    },
    [loadCategoriesByBrand, loadInitialData]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      const categoryId = value === "all" ? undefined : parseInt(value);
      setFilters((prev) => ({
        ...prev,
        categoryId,
        subcategoryId: undefined, // Clear subcategory when category changes
      }));

      setSubcategories([]);
      if (categoryId) {
        loadSubcategories(categoryId, filters.brandId);
        if (!filters.brandId) {
          setBrands([]);
          loadBrandsByCategory(categoryId);
        }
      }
    },
    [filters.brandId, loadSubcategories, loadBrandsByCategory]
  );

  const handleSubcategoryChange = useCallback((value: string) => {
    const subcategoryId = value === "all" ? undefined : parseInt(value);
    setFilters((prev) => ({
      ...prev,
      subcategoryId,
      categoryId: subcategoryId ? undefined : prev.categoryId, // Clear category when subcategory is selected
    }));
  }, []);

  const retryLoadData = useCallback(() => {
    setError(null);
    loadInitialData();
  }, [loadInitialData]);

  // Effects
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Update URL when debounced filters change (only if they actually changed)
  useEffect(() => {
    // Skip if this is the initial mount to avoid unnecessary navigation
    const currentUrlFilters = {
      brandId: searchParams.get("brand")
        ? parseInt(searchParams.get("brand")!)
        : undefined,
      categoryId: searchParams.get("category")
        ? parseInt(searchParams.get("category")!)
        : undefined,
      subcategoryId: searchParams.get("subcategory")
        ? parseInt(searchParams.get("subcategory")!)
        : undefined,
    };

    // Only update URL if filters have actually changed from what's in the URL
    if (
      JSON.stringify(debouncedFilters) !== JSON.stringify(currentUrlFilters)
    ) {
      const params = new URLSearchParams(searchParams.toString());

      // Update parameters
      if (debouncedFilters.brandId) {
        params.set("brand", debouncedFilters.brandId.toString());
      } else {
        params.delete("brand");
      }

      // Handle category and subcategory relationship properly
      if (debouncedFilters.subcategoryId) {
        // When subcategory is selected, clear category and set subcategory
        params.set("subcategory", debouncedFilters.subcategoryId.toString());
        params.delete("category");
      } else if (debouncedFilters.categoryId) {
        // When only category is selected, clear subcategory and set category
        params.set("category", debouncedFilters.categoryId.toString());
        params.delete("subcategory");
      } else {
        // When neither is selected, clear both
        params.delete("category");
        params.delete("subcategory");
      }

      // Reset to first page when filters change
      params.delete("page");

      const newURL = `/products?${params.toString()}`;
      router.push(newURL, { scroll: false });
    }
  }, [debouncedFilters, searchParams, router]);

  // Filter item component
  const FilterItem = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );

  // Loading skeleton
  const SelectSkeleton = () => <Skeleton className="h-10 w-full" />;

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Error state with retry */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 border border-destructive/20 rounded-lg bg-destructive/5"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={retryLoadData}
              disabled={isAnyLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isAnyLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Filter Controls */}
      <div className="space-y-4">
        {/* Brand Filter */}
        <FilterItem label="Brand">
          {loading.brands ? (
            <SelectSkeleton />
          ) : (
            <Select
              value={filters.brandId?.toString() || "all"}
              onValueChange={handleBrandChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FilterItem>

        {/* Category Filter */}
        <FilterItem label="Category">
          {loading.categories ? (
            <SelectSkeleton />
          ) : (
            <Select
              value={filters.categoryId?.toString() || "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FilterItem>

        {/* Subcategory Filter */}
        <FilterItem label="Subcategory">
          {loading.subcategories ? (
            <SelectSkeleton />
          ) : (
            <Select
              value={filters.subcategoryId?.toString() || "all"}
              onValueChange={handleSubcategoryChange}
              disabled={subcategories.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    subcategories.length === 0
                      ? "No subcategories available"
                      : "Select subcategory..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subcategories</SelectItem>
                {subcategories.map((subcategory) => (
                  <SelectItem
                    key={subcategory.id}
                    value={subcategory.id.toString()}
                  >
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FilterItem>
      </div>

      {/* Loading indicator */}
      {isAnyLoading && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
        </div>
      )}
    </motion.div>
  );
}
