import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Tag,
  Folder,
  ExternalLink,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getProductBySlug, getRelatedProducts } from "@/lib/actions/products";
import ProductAttributes from "@/components/products/ProductAttributes";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import RelatedProductsSection from "@/components/products/RelatedProductsSection";
import CatalogueSection from "@/components/products/CatalogueSection";

interface ProductPageProps {
  params: { slug: string };
}

/**
 * Generate dynamic metadata for the product page
 * Improves SEO and provides contextual page information
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = params;

  try {
    const product = await getProductBySlug(slug);

    if (!product) {
      return {
        title: "Product Not Found | Hava Group",
        description: "The requested product could not be found.",
      };
    }

    const title = `${product.name} | ${product.brand.name} | Hava Group`;
    const description = product.description
      ? `${product.description.substring(0, 160)}...`
      : `Discover ${product.name} by ${product.brand.name} - High quality products from Hava Group.`;

    return {
      title,
      description,
      keywords: [
        product.name,
        product.brand.name,
        product.category?.name,
        "Hava Group",
        "products",
        "catalog",
      ].filter((keyword): keyword is string => Boolean(keyword)),
      openGraph: {
        title,
        description,
        type: "website",
        siteName: "Hava Group",
        images:
          product.imageUrls.length > 0
            ? [
                {
                  url: product.imageUrls[0].url,
                  width: 800,
                  height: 600,
                  alt: product.name,
                },
              ]
            : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: product.imageUrls.length > 0 ? [product.imageUrls[0].url] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product | Hava Group",
      description: "Discover our products at Hava Group.",
    };
  }
}

/**
 * Main product detail page component
 */
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = params;

  try {
    // Fetch product data using server actions
    const product = await getProductBySlug(slug);

    if (!product) {
      notFound();
    }

    // Fetch related products
    const relatedProducts = await getRelatedProducts(
      product.id,
      product.brandId,
      product.categoryId,
      4
    );

    return (
      <div className="min-h-screen bg-background pt-24 lg:pt-28">
        {/* Navigation */}
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour aux produits
          </Link>
        </div>

        {/* Product Details */}
        <div className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Image Gallery */}
            <ProductImageGallery
              product={product}
              className="max-w-md mx-auto lg:mx-0"
            />

            {/* Product Information Column */}
            <div className="flex flex-col space-y-6">
              {/* Product Title and Tags */}
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {product.name}
                </h1>

                <div className="flex flex-wrap gap-2">
                  {product.brand && (
                    <Badge variant="outline" className="gap-1 px-3 py-1">
                      <Tag className="h-3 w-3" />
                      {product.brand.name}
                    </Badge>
                  )}

                  {product.category && (
                    <Badge variant="secondary" className="gap-1 px-3 py-1">
                      <Folder className="h-3 w-3" />
                      {product.category.name}
                    </Badge>
                  )}

                  {product.catalogue && (
                    <Badge variant="default" className="gap-1 px-3 py-1">
                      <ExternalLink className="h-3 w-3" />
                      {product.catalogue.title}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-foreground">
                    Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Product Attributes */}
              {product.attributes && (
                <div className="flex-1 min-h-0">
                  <div className="h-full max-h-[500px] lg:max-h-[600px]">
                    <Card className="h-full flex flex-col">
                      <CardContent className="p-6 flex-1 overflow-hidden flex flex-col">
                        <div className="flex items-center gap-2 text-lg mb-4 flex-shrink-0">
                          <Settings className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-foreground">
                            Caractéristiques techniques
                          </h3>
                        </div>

                        {/* Scrollable content */}
                        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                          <ProductAttributes attributes={product.attributes} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Catalogue Section */}
          {product.catalogue && (
            <CatalogueSection catalogue={product.catalogue} />
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <RelatedProductsSection products={relatedProducts} />
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Alert variant="destructive">
            <Package className="h-4 w-4" />
            <AlertDescription>
              Une erreur est survenue lors du chargement du produit. Veuillez
              réessayer.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }
}

/**
 * Loading skeleton component for the product page
 */
export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Skeleton */}
          <div className="space-y-4 max-w-md mx-auto lg:mx-0">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-36 w-full" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
