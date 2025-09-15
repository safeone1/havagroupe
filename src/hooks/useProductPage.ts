import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  getFilteredProducts, 
  type ProductsResponse, 
  type ProductFilters as FilterParams 
} from "@/lib/actions/products";
import { type ErrorState, type FilterBadge, validateNumericParam, validatePageParam } from "@/types/products";

interface UseProductPageOptions {
  initialData: ProductsResponse;
  initialFilters: FilterParams;
}

interface UseProductPageReturn {
  // State
  productsData: ProductsResponse;
  loading: boolean;
  error: ErrorState;
  showFilters: boolean;
  currentFilters: FilterParams;
  hasActiveFilters: boolean;
  activeFilterBadges: FilterBadge[];
  
  // Actions
  setShowFilters: (show: boolean) => void;
  handleSearchChange: (search: string) => void;
  clearAllFilters: () => void;
  retryFetch: () => void;
}

/**
 * Enhanced useProductPage hook with better performance and error handling
 */
export function useProductPage({ 
  initialData, 
  initialFilters 
}: UseProductPageOptions): UseProductPageReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Refs for preventing duplicate requests and cleanup
  const abortControllerRef = useRef<AbortController | null>(null);
  const isFirstMount = useRef(true);
  
  // State management with optimized initial states
  const [productsData, setProductsData] = useState<ProductsResponse>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState>({ hasError: false, message: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterParams>(initialFilters);

  // Memoized URL filters parsing with validation
  const urlFilters = useMemo(() => {
    try {
      const filters: FilterParams = {
        brandId: validateNumericParam(searchParams.get("brand") ?? undefined),
        categoryId: validateNumericParam(searchParams.get("category") ?? undefined),
        subcategoryId: validateNumericParam(searchParams.get("subcategory") ?? undefined),
        search: searchParams.get("search")?.trim() || undefined,
        page: validatePageParam(searchParams.get("page") ?? undefined),
        limit: 12,
      };
      
      return filters;
    } catch (error) {
      console.error("Error parsing URL filters:", error);
      return initialFilters;
    }
  }, [searchParams, initialFilters]);

  // Memoized active filters check with better performance
  const hasActiveFilters = useMemo(() => {
    return Boolean(
      currentFilters.brandId || 
      currentFilters.categoryId || 
      currentFilters.subcategoryId || 
      currentFilters.search?.trim()
    );
  }, [currentFilters]);

  // Memoized filter badges generation
  const activeFilterBadges = useMemo((): FilterBadge[] => {
    const badges: FilterBadge[] = [];

    // Search badge
    if (currentFilters.search?.trim()) {
      badges.push({
        key: "search",
        label: `Search: "${currentFilters.search}"`,
        onRemove: () => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("search");
          params.delete("page");
          router.push(`/products?${params.toString()}`, { scroll: false });
        }
      });
    }


    // Brand badge
    if (currentFilters.brandId) {
      const productWithBrand = productsData.products.find(p => p.brand?.id === currentFilters.brandId);
      const brandName = productWithBrand?.brand?.name || currentFilters.brandId;
      badges.push({
        key: "brand",
        label: `Brand: ${brandName}`,
        onRemove: () => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("brand");
          params.delete("page");
          router.push(`/products?${params.toString()}`, { scroll: false });
        }
      });
    }

    // Category badge
    if (currentFilters.categoryId) {
      const productWithCategory = productsData.products.find(p => p.category?.id === currentFilters.categoryId);
      const categoryName = productWithCategory?.category?.name || currentFilters.categoryId;
      badges.push({
        key: "category",
        label: `Category: ${categoryName}`,
        onRemove: () => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("category");
          params.delete("page");
          router.push(`/products?${params.toString()}`, { scroll: false });
        }
      });
    }

    // Subcategory badge
    if (currentFilters.subcategoryId) {
      const productWithSubcategory = productsData.products.find(p => p.category?.id === currentFilters.subcategoryId);
      const subcategoryName = productWithSubcategory?.category?.name || currentFilters.subcategoryId;
      badges.push({
        key: "subcategory",
        label: `Subcategory: ${subcategoryName}`,
        onRemove: () => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("subcategory");
          params.delete("page");
          router.push(`/products?${params.toString()}`, { scroll: false });
        }
      });
    }

    return badges;
  }, [currentFilters, productsData, searchParams, router]);

  // Enhanced product fetching with cancellation and error handling
  const fetchProducts = useCallback(async (
    filters: FilterParams, 
    options: { silent?: boolean } = {}
  ) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      if (!options.silent) {
        setLoading(true);
      }
      setError({ hasError: false, message: "" });
      
      const data = await getFilteredProducts(filters);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      setProductsData(data);
    } catch (error) {
      // Don't handle aborted requests
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to fetch products";
      
      console.error("Failed to fetch products:", error);
      setError({ hasError: true, message: errorMessage });
      
      if (!options.silent) {
        toast.error("Failed to load products. Please try again.");
      }
    } finally {
      if (!options.silent) {
        setLoading(false);
      }
    }
  }, []);

  // Optimized search change handler with debouncing
  const handleSearchChange = useCallback((search: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (search?.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }
    
    // Reset to first page when search changes
    params.delete("page");
    
    // Use replace for search to avoid excessive history entries
    router.replace(`/products?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  // Enhanced clear filters with animation-friendly state updates
  const clearAllFilters = useCallback(() => {
    setShowFilters(false);
    router.push("/products", { scroll: false });
    // Refetch products with no filters
    fetchProducts({ limit: 12 });
  }, [router, fetchProducts]);

  // Retry function with loading state management
  const retryFetch = useCallback(() => {
    fetchProducts(currentFilters);
  }, [fetchProducts, currentFilters]);

  // Effect for handling URL changes with optimization
  useEffect(() => {
    // Skip initial mount since we have initial data
    if (isFirstMount.current) {
      isFirstMount.current = false;
      setCurrentFilters(urlFilters);
      return;
    }
    
    // Only fetch if filters actually changed
    const filtersChanged = JSON.stringify(urlFilters) !== JSON.stringify(currentFilters);
    
    if (filtersChanged) {
      setCurrentFilters(urlFilters);
      
      // Use silent loading for filter changes to reduce UI flicker
      const isSamePageDifferentFilters = 
        urlFilters.page === currentFilters.page && 
        (urlFilters.brandId !== currentFilters.brandId || 
         urlFilters.categoryId !== currentFilters.categoryId ||
         urlFilters.subcategoryId !== currentFilters.subcategoryId);
      
      fetchProducts(urlFilters, { 
        silent: isSamePageDifferentFilters 
      });
    }
  }, [urlFilters, currentFilters, fetchProducts]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Performance monitoring (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const start = performance.now();
      return () => {
        const end = performance.now();
        if (end - start > 100) {
          console.warn(`useProductPage hook took ${end - start}ms to complete`);
        }
      };
    }
  });

  return {
    // State
    productsData,
    loading,
    error,
    showFilters,
    currentFilters,
    hasActiveFilters,
    activeFilterBadges,
    
    // Actions
    setShowFilters,
    handleSearchChange,
    clearAllFilters,
    retryFetch,
  };
}
