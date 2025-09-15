// Types for the Products page and related components
export interface ProductPageSearchParams {
  brand?: string;
  category?: string;
  subcategory?: string;
  search?: string;
  page?: string;
}

export interface ParsedProductFilters {
  brandId?: number;
  categoryId?: number;
  subcategoryId?: number;
  search?: string;
  page: number;
  limit: number;
}

export interface FilterBadge {
  key: string;
  label: string;
  onRemove: () => void;
}

export interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
}

export interface ProductPageState {
  productsData: import("@/lib/actions/products").ProductsResponse;
  loading: boolean;
  error: ErrorState;
  showFilters: boolean;
  currentFilters: ParsedProductFilters;
}

// URL parameter validation utilities
export const validateNumericParam = (param: string | undefined): number | undefined => {
  if (!param) return undefined;
  const parsed = parseInt(param);
  return isNaN(parsed) ? undefined : parsed;
};

export const validatePageParam = (param: string | undefined): number => {
  if (!param) return 1;
  const parsed = parseInt(param);
  return isNaN(parsed) || parsed < 1 ? 1 : parsed;
};

// Error types for better error handling
export class ProductFetchError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "ProductFetchError";
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ValidationError";
  }
}
