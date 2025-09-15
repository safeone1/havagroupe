"use server";

import { prisma } from "@/lib/prismacl";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  Product,
  Brand,
  Category,
  Catalogue,
  ImageUrl,
  Prisma,
} from "@/generated/prisma";
import { ProductSchemaType } from "@/lib/Schema";
import { generateSlug } from "@/lib/utils/slug-utils";

// Type for product with relations
export type ProductWithRelations = Product & {
  brand: Brand;
  category: Category | null;
  catalogue: Catalogue | null;
  imageUrls: ImageUrl[];
};

// Get all brands (for dropdowns)
export async function getBrandsForDropdown(): Promise<Brand[]> {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return brands;
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    throw new Error("Failed to fetch brands");
  }
}

// Get all categories (for dropdowns)
export async function getCategoriesForDropdown(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

// Get all catalogues (for dropdowns)
export async function getCataloguesForDropdown(): Promise<Catalogue[]> {
  try {
    const catalogues = await prisma.catalogue.findMany({
      include: {
        brand: true,
      },
      orderBy: {
        title: "asc",
      },
    });
    return catalogues;
  } catch (error) {
    console.error("Failed to fetch catalogues:", error);
    throw new Error("Failed to fetch catalogues");
  }
}

// Get all products
export async function getProducts(): Promise<ProductWithRelations[]> {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        category: true,
        catalogue: true,
        imageUrls: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw new Error("Failed to fetch products");
  }
}

// Get a single product by ID
export async function getProduct(
  id: number
): Promise<ProductWithRelations | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        catalogue: true,
        imageUrls: true,
      },
    });

    return product;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    throw new Error("Failed to fetch product");
  }
}

// Get all brands for form select
export async function getBrandsForSelect() {
  try {
    return await prisma.brand.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    throw new Error("Failed to fetch brands");
  }
}

// Get all categories for form select
export async function getCategoriesForSelect() {
  try {
    return await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

// Get all catalogues for form select
export async function getCataloguesForSelect() {
  try {
    return await prisma.catalogue.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: "asc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch catalogues:", error);
    throw new Error("Failed to fetch catalogues");
  }
}

// Create a new product
export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const brandId = formData.get("brandId") as string;
  const categoryId = formData.get("categoryId") as string;
  const catalogueId = formData.get("catalogueId") as string;

  // Validation
  if (!name || name.trim().length === 0) {
    throw new Error("Product name is required");
  }

  if (!brandId) {
    throw new Error("Brand is required");
  }

  try {
    // Generate slug from name
    const slug = generateSlug(name);

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        brandId: parseInt(brandId),
        categoryId: categoryId ? parseInt(categoryId) : null,
        catalogueId: catalogueId ? parseInt(catalogueId) : null,
        attributes: {},
      },
    });

    // Create image URL if provided
    if (imageUrl && imageUrl.trim()) {
      await prisma.imageUrl.create({
        data: {
          url: imageUrl.trim(),
          productId: product.id,
        },
      });
    }

    revalidatePath("/admin/products");
    redirect("/admin/products");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to create product:", error);
    throw new Error("Failed to create product");
  }
}

// Helper function to parse and validate JSON attributes
function parseAttributes(attributesString: string | undefined): Prisma.JsonValue {
  if (!attributesString || attributesString.trim() === '') {
    return {};
  }
  
  try {
    const parsed = JSON.parse(attributesString);
    // Ensure it's an object and not an array or primitive
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed;
    }
    return {};
  } catch {
    console.warn('Invalid JSON attributes:', attributesString);
    return {};
  }
}

// Create a product with schema validation
export async function createProductWithSchema(data: ProductSchemaType) {
  try {
    // Generate slug from name
    const slug = generateSlug(data.name);

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      throw new Error("A product with this name already exists");
    }

    // Parse attributes JSON
    const attributes = parseAttributes(data.attributes);

    const product = await prisma.product.create({
      data: {
        name: data.name.trim(),
        slug,
        description: data.description?.trim() || null,
        brandId: parseInt(data.brandId),
        categoryId: data.categoryId ? parseInt(data.categoryId) : null,
        catalogueId: data.catalogueId ? parseInt(data.catalogueId) : null,
        attributes: attributes || undefined,
      },
    });

    revalidatePath("/admin/products");
    return product; // Return the product so caller can get the ID
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to create product:", error);
    throw new Error("Failed to create product");
  }
}

// Update a product with schema validation
export async function updateProductWithSchema(
  id: number,
  data: ProductSchemaType
) {
  try {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }
    
    // Generate slug from name
    const slug = generateSlug(data.name);

    // Check if another product with the same slug exists (excluding current product)
    const duplicateProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (duplicateProduct && duplicateProduct.id !== id) {
      throw new Error("A product with this name already exists");
    }

    // Parse attributes JSON
    const attributes = parseAttributes(data.attributes);

    await prisma.product.update({
      where: { id },
      data: {
        name: data.name.trim(),
        slug,
        description: data.description?.trim() || null,
        brandId: parseInt(data.brandId),
        categoryId: data.categoryId ? parseInt(data.categoryId) : null,
        catalogueId: data.catalogueId ? parseInt(data.catalogueId) : null,
        attributes: attributes || undefined,
      },
    });

    // Note: Images are now handled separately through the addImageUrl and deleteImageUrl functions
    // This allows for better individual image management

    revalidatePath("/admin/products");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to update product:", error);
    throw new Error("Failed to update product");
  }
}

// Update a product
export async function updateProduct(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const brandId = formData.get("brandId") as string;
  const categoryId = formData.get("categoryId") as string;
  const catalogueId = formData.get("catalogueId") as string;

  // Validation
  if (!name || name.trim().length === 0) {
    throw new Error("Product name is required");
  }

  if (!brandId) {
    throw new Error("Brand is required");
  }

  try {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Generate slug from name
    const slug = generateSlug(name);

    await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        brandId: parseInt(brandId),
        categoryId: categoryId ? parseInt(categoryId) : null,
        catalogueId: catalogueId ? parseInt(catalogueId) : null,
        attributes: {},
      },
    });

    // Handle image URL update
    if (imageUrl && imageUrl.trim()) {
      // Delete existing image URLs
      await prisma.imageUrl.deleteMany({
        where: { productId: id },
      });

      // Create new image URL
      await prisma.imageUrl.create({
        data: {
          url: imageUrl.trim(),
          productId: id,
        },
      });
    } else {
      // If no image URL provided, delete existing ones
      await prisma.imageUrl.deleteMany({
        where: { productId: id },
      });
    }

    revalidatePath("/admin/products");
    redirect("/admin/products");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to update product:", error);
    throw new Error("Failed to update product");
  }
}

// Delete a product
export async function deleteProduct(id: number) {
  try {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to delete product:", error);
    throw new Error("Failed to delete product");
  }
}

export const getProductCount = async (): Promise<number> => {
  try {
    const count = await prisma.product.count();
    return count;
  } catch (error) {
    console.error("Failed to fetch product count:", error);
    return 0;
  }
};

// Delete a single image URL
export async function deleteImageUrl(imageId: number) {
  try {
    await prisma.imageUrl.delete({
      where: { id: imageId },
    });

    revalidatePath("/admin/products");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to delete image:", error);
    throw new Error("Failed to delete image");
  }
}

// Add a new image URL to a product
export async function addImageUrl(productId: number, imageUrl: string) {
  try {
    const newImage = await prisma.imageUrl.create({
      data: {
        url: imageUrl,
        productId: productId,
      },
    });

    revalidatePath("/admin/products");
    return newImage;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to add image:", error);
    throw new Error("Failed to add image");
  }
}

// ===============================
// CLIENT-SIDE PRODUCT PAGE ACTIONS
// ===============================

// Filter parameters interface
export interface ProductFilters {
  brandId?: number;
  categoryId?: number;
  subcategoryId?: number;
  search?: string;
  page?: number;
  limit?: number;
}

// Response type for paginated products
export interface ProductsResponse {
  products: ProductWithRelations[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Get products with dynamic filtering and pagination
export async function getFilteredProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  try {
    const {
      brandId,
      categoryId,
      subcategoryId,
      search,
      page = 1,
      limit = 12
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause dynamically
    const where: Prisma.ProductWhereInput = {};

    if (brandId) {
      where.brandId = brandId;
    }

    if (subcategoryId) {
      // If subcategory is selected, use it (it implies the category)
      where.categoryId = subcategoryId;
    } else if (categoryId) {
      // If only category is selected, check if it's a parent category
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        include: { subcategories: true }
      });
      
      if (category && category.subcategories && category.subcategories.length > 0) {
        // If it has subcategories, include both parent and children
        where.categoryId = {
          in: [categoryId, ...category.subcategories.map(sub => sub.id)]
        };
      } else {
        // If no subcategories, just filter by this category
        where.categoryId = categoryId;
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { brand: { name: { contains: search } } },
        { category: { name: { contains: search } } }
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where });

    // Fetch products with relations
    const products = await prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
        catalogue: true,
        imageUrls: true,
      },
      orderBy: [
        { createdAt: "desc" },
        { name: "asc" }
      ],
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      products,
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  } catch (error) {
    console.error("Failed to fetch filtered products:", error);
    throw new Error("Failed to fetch filtered products");
  }
}

// Get categories that have products for a specific brand
export async function getCategoriesByBrand(brandId: number): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        products: {
          some: {
            brandId: brandId
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    });

    return categories;
  } catch (error) {
    console.error("Failed to fetch categories by brand:", error);
    throw new Error("Failed to fetch categories by brand");
  }
}

// Get subcategories that have products for a specific category (and optionally brand)
export async function getSubcategoriesByCategory(categoryId: number, brandId?: number): Promise<Category[]> {
  try {
    const where: Prisma.CategoryWhereInput = {
      parentId: categoryId,
      products: {
        some: brandId ? { brandId } : {}
      }
    };

    const subcategories = await prisma.category.findMany({
      where,
      orderBy: {
        name: "asc"
      }
    });

    return subcategories;
  } catch (error) {
    console.error("Failed to fetch subcategories by category:", error);
    throw new Error("Failed to fetch subcategories by category");
  }
}

// Get brands that have products in a specific category
export async function getBrandsByCategory(categoryId: number): Promise<Brand[]> {
  try {
    const brands = await prisma.brand.findMany({
      where: {
        products: {
          some: {
            OR: [
              { categoryId: categoryId },
              { category: { parentId: categoryId } } // Include subcategories
            ]
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    });

    return brands;
  } catch (error) {
    console.error("Failed to fetch brands by category:", error);
    throw new Error("Failed to fetch brands by category");
  }
}

// Get all brands that have products (for initial load)
export async function getBrandsWithProducts(): Promise<Brand[]> {
  try {
    const brands = await prisma.brand.findMany({
      where: {
        products: {
          some: {}
        }
      },
      orderBy: {
        name: "asc"
      }
    });

    return brands;
  } catch (error) {
    console.error("Failed to fetch brands with products:", error);
    throw new Error("Failed to fetch brands with products");
  }
}

// Get all root categories that have products (for initial load)
export async function getRootCategoriesWithProducts(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parentId: null, // Only root categories
        OR: [
          { products: { some: {} } }, // Categories with direct products
          { subcategories: { some: { products: { some: {} } } } } // Categories with products in subcategories
        ]
      },
      orderBy: {
        name: "asc"
      }
    });

    return categories;
  } catch (error) {
    console.error("Failed to fetch root categories with products:", error);
    throw new Error("Failed to fetch root categories with products");
  }
}

// Get product by slug with all relations for product detail page
export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        catalogue: true,
        imageUrls: true,
      },
    });

    return product;
  } catch (error) {
    console.error("Failed to fetch product by slug:", error);
    throw new Error("Failed to fetch product");
  }
}

// Get related products based on brand and category
export async function getRelatedProducts(
  productId: number,
  brandId: number,
  categoryId?: number | null,
  limit: number = 4
): Promise<ProductWithRelations[]> {
  try {
    const where: Prisma.ProductWhereInput = {
      id: { not: productId }, // Exclude current product
      OR: [
        { brandId }, // Same brand
        ...(categoryId ? [{ categoryId }] : []), // Same category if available
      ],
    };

    const relatedProducts = await prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
        catalogue: true,
        imageUrls: true,
      },
      orderBy: [
        { brandId: "asc" }, // Prioritize same brand
        { createdAt: "desc" },
      ],
      take: limit,
    });

    return relatedProducts;
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    throw new Error("Failed to fetch related products");
  }
}

// ===============================
// SEARCH FUNCTIONALITY
// ===============================

// Search results interface
export interface SearchResults {
  products: Array<{
    id: number;
    name: string;
    slug: string;
    brand?: { name: string };
    category?: { name: string };
  }>;
  brands: Array<{
    id: number;
    name: string;
    slug: string;
    _count?: { products: number };
  }>;
  categories: Array<{
    id: number;
    name: string;
    parent?: { name: string };
    _count?: { products: number };
  }>;
}

// Search all entities (products, brands, categories)
export async function searchAll(query: string, limit: number = 5): Promise<SearchResults> {
  try {
    const searchTerm = query.trim();
    
    if (!searchTerm) {
      return { products: [], brands: [], categories: [] };
    }

    // Search products
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm } },
          { description: { contains: searchTerm } },
        ],
      },
      include: {
        brand: true,
        category: true,
      },
      take: limit,
      orderBy: { name: 'asc' },
    });

    // Search brands
    const brands = await prisma.brand.findMany({
      where: {
        name: { contains: searchTerm },
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
      take: limit,
      orderBy: { name: 'asc' },
    });

    // Search categories
    const categories = await prisma.category.findMany({
      where: {
        name: { contains: searchTerm },
      },
      include: {
        parent: true,
        _count: {
          select: { products: true },
        },
      },
      take: limit,
      orderBy: { name: 'asc' },
    });

    return {
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        brand: p.brand ? { name: p.brand.name } : undefined,
        category: p.category ? { name: p.category.name } : undefined,
      })),
      brands: brands.map(b => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        _count: b._count,
      })),
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        parent: c.parent ? { name: c.parent.name } : undefined,
        _count: c._count,
      })),
    };
  } catch (error) {
    console.error("Failed to search:", error);
    throw new Error("Failed to search");
  }
}
