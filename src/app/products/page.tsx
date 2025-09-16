import React from "react";
import { type Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductPageClient from "@/components/products/ProductPageClient";
import {
  getFilteredProducts,
  type ProductFilters,
} from "@/lib/actions/products";
import { ProductsLoading } from "@/components/products/ProductsLoading";
import { validateSearchParams } from "@/lib/utils/search-params-validation";

// Force dynamic rendering for this page since it uses searchParams
export const dynamic = "force-dynamic";

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
  searchParams,
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
 * Main products page component with enhanced error handling and performance
 */
export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
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
