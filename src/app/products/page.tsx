import React from "react";
import { type Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductPageClient from "@/components/products/ProductPageClient";
import { getFilteredProducts, type ProductFilters } from "@/lib/actions/products";
import { ProductsLoading } from "@/components/products/ProductsLoading";
import { validateSearchParams, type ParsedSearchParams } from "@/lib/utils/search-params-validation";

interface ProductsPageProps {
  searchParams: Promise<{
    brand?: string;
    category?: string;
    subcategory?: string;
    search?: string;
    page?: string;
  }>;
}

/**
 * Generate dynamic metadata for the products page
 * Improves SEO and provides contextual page information
 */
export async function generateMetadata({ 
  searchParams 
}: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const { search, brandName } = validateSearchParams(params);
  
  let title = "Products | Hava Group";
  let description = "Browse our product catalog.";
  
  if (search) {
    title = `"${search}" | Hava Group`;
    description = `Search results for "${search}".`;
  } else if (brandName) {
    title = `${brandName} | Hava Group`;
    description = `${brandName} products.`;
  }
  
  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Hava Group",
    },
  };
}

/**
 * Enhanced error boundary component with better UX
 */
function ProductsError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }; 
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-destructive" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">
            Failed to load products. Please try again.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="text-sm text-left bg-muted p-3 rounded mb-4">
              <summary className="cursor-pointer font-semibold">Technical Details</summary>
              <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
              {error.digest && <p className="mt-1 opacity-70">ID: {error.digest}</p>}
            </details>
          )}
        </div>
        <button
          onClick={reset}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

/**
 * Main products page component with enhanced error handling and performance
 */
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  try {
    // Await search parameters (required in Next.js 15)
    const params = await searchParams;
    
    // Validate and parse search parameters
    const validatedParams = validateSearchParams(params);
    
    // Convert to ProductFilters format
    const filters: ProductFilters = {
      brandId: validatedParams.brandId,
      categoryId: validatedParams.categoryId,
      subcategoryId: validatedParams.subcategoryId,
      search: validatedParams.search,
      page: validatedParams.page,
      limit: 12,
    };

    // Get initial products data with error handling
    const initialData = await getFilteredProducts(filters).catch((error) => {
      console.error("Failed to fetch initial products:", error);
      throw new Error("Failed to load products. Please try again later.");
    });

    // If requesting a page beyond available pages, redirect to 404
    if (initialData.totalPages > 0 && filters.page! > initialData.totalPages) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-background pt-24 lg:pt-28">
        <Suspense fallback={<ProductsLoading />}>
          <ProductPageClient 
            initialData={initialData} 
            initialFilters={filters} 
          />
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error("Error in ProductsPage:", error);
    // Let Next.js error boundary handle this
    throw error instanceof Error 
      ? error 
      : new Error("An unexpected error occurred");
  }
}
