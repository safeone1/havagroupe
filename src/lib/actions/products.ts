"use server";

import { prisma } from "@/lib/prismacl";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Product, Brand, Category, Catalogue } from "@/generated/prisma";
import { ProductSchemaType } from "@/lib/Schema";

// Type for product with relations
export type ProductWithRelations = Product & {
  brand: Brand;
  category: Category | null;
  catalogue: Catalogue | null;
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
    await prisma.product.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        brandId: parseInt(brandId),
        categoryId: categoryId ? parseInt(categoryId) : null,
        catalogueId: catalogueId ? parseInt(catalogueId) : null,
        data: {},
      },
    });

    revalidatePath("/admin/products");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to create product:", error);
    throw new Error("Failed to create product");
  }

  redirect("/admin/products");
}

// Create a product with schema validation
export async function createProductWithSchema(data: ProductSchemaType) {
  try {
    await prisma.product.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        imageUrl: data.imageUrl?.trim() || null,
        brandId: parseInt(data.brandId),
        categoryId: data.categoryId ? parseInt(data.categoryId) : null,
        catalogueId: data.catalogueId ? parseInt(data.catalogueId) : null,
        data: {},
      },
    });

    revalidatePath("/admin/products");
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

    await prisma.product.update({
      where: { id },
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        imageUrl: data.imageUrl?.trim() || null,
        brandId: parseInt(data.brandId),
        categoryId: data.categoryId ? parseInt(data.categoryId) : null,
        catalogueId: data.catalogueId ? parseInt(data.catalogueId) : null,
        data: {},
      },
    });

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

    await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        brandId: parseInt(brandId),
        categoryId: categoryId ? parseInt(categoryId) : null,
        catalogueId: catalogueId ? parseInt(catalogueId) : null,
        data: {},
      },
    });

    revalidatePath("/admin/products");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to update product:", error);
    throw new Error("Failed to update product");
  }

  redirect("/admin/products");
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
