import { z } from "zod";

// Schema for validating search parameters
const searchParamsSchema = z.object({
  brand: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  category: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  subcategory: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  search: z.string().optional().transform(val => val?.trim() || undefined),
  page: z.string().optional().transform(val => val ? Math.max(1, parseInt(val)) : 1),
});

export interface ParsedSearchParams {
  brandId?: number;
  categoryId?: number;
  subcategoryId?: number;
  search?: string;
  page: number;
  brandName?: string; // For metadata generation
}

/**
 * Validates and transforms search parameters
 * @param params Raw search parameters from URL
 * @returns Validated and transformed parameters
 * @throws Error if validation fails
 */
export function validateSearchParams(params: Record<string, string | undefined>): ParsedSearchParams {
  try {
    const result = searchParamsSchema.safeParse(params);
    
    if (!result.success) {
      throw new Error("Invalid search parameters");
    }
    
    const { brand, category, subcategory, search, page } = result.data;
    
    // Validate numeric parameters are not NaN
    if (params.brand && isNaN(Number(params.brand))) {
      throw new Error("Invalid brand parameter");
    }
    if (params.category && isNaN(Number(params.category))) {
      throw new Error("Invalid category parameter");
    }
    if (params.subcategory && isNaN(Number(params.subcategory))) {
      throw new Error("Invalid subcategory parameter");
    }
    if (params.page && (isNaN(Number(params.page)) || Number(params.page) < 1)) {
      throw new Error("Invalid page parameter");
    }
    
    return {
      brandId: brand,
      categoryId: category,
      subcategoryId: subcategory,
      search,
      page: page || 1,
    };
  } catch (error) {
    console.error("Search params validation error:", error);
    throw error;
  }
}

/**
 * Builds URL search parameters string from filters
 */
export function buildSearchParams(filters: ParsedSearchParams): string {
  const params = new URLSearchParams();
  
  if (filters.brandId) params.set("brand", filters.brandId.toString());
  if (filters.categoryId) params.set("category", filters.categoryId.toString());
  if (filters.subcategoryId) params.set("subcategory", filters.subcategoryId.toString());
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.page > 1) params.set("page", filters.page.toString());
  
  return params.toString();
}
