"use server";

import { prisma } from "@/lib/prismacl";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Brand } from "@/generated/prisma";

// Type for brand with counts
export type BrandWithCounts = Brand & {
  _count?: {
    products: number;
    catalogues: number;
  };
};

// Get all brands
export async function getBrands(): Promise<BrandWithCounts[]> {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: {
            products: true,
            catalogues: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return brands;
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    throw new Error("Failed to fetch brands");
  }
}

// Get a single brand by ID
export async function getBrand(id: number): Promise<BrandWithCounts | null> {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            catalogues: true,
          },
        },
      },
    });

    return brand;
  } catch (error) {
    console.error("Failed to fetch brand:", error);
    throw new Error("Failed to fetch brand");
  }
}

// Create a new brand
export async function createBrand(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const logoUrl = formData.get("logoUrl") as string;

  // Validation
  if (!name || name.trim().length === 0) {
    throw new Error("Brand name is required");
  }

  try {
    // Check if brand name already exists
    const existingBrand = await prisma.brand.findFirst({
      where: {
        name: name.trim(),
      },
    });

    if (existingBrand) {
      throw new Error("A brand with this name already exists");
    }

    await prisma.brand.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        logoUrl: logoUrl?.trim() || null,
      },
    });

    revalidatePath("/admin/brands");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to create brand:", error);
    throw new Error("Failed to create brand");
  }

  redirect("/admin/brands");
}

// Update a brand
export async function updateBrand(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const logoUrl = formData.get("logoUrl") as string;

  // Validation
  if (!name || name.trim().length === 0) {
    throw new Error("Brand name is required");
  }

  try {
    // Check if brand exists
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      throw new Error("Brand not found");
    }

    // Check if another brand with the same name exists (excluding current brand)
    const duplicateBrand = await prisma.brand.findFirst({
      where: {
        name: name.trim(),
        id: {
          not: id,
        },
      },
    });

    if (duplicateBrand) {
      throw new Error("A brand with this name already exists");
    }

    await prisma.brand.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        logoUrl: logoUrl?.trim() || null,
      },
    });

    revalidatePath("/admin/brands");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to update brand:", error);
    throw new Error("Failed to update brand");
  }

  redirect("/admin/brands");
}

// Delete a brand
export async function deleteBrand(id: number) {
  try {
    // Check if brand exists
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            catalogues: true,
          },
        },
      },
    });

    if (!existingBrand) {
      throw new Error("Brand not found");
    }

    // Check if brand has associated products or catalogues
    if (
      existingBrand._count.products > 0 ||
      existingBrand._count.catalogues > 0
    ) {
      throw new Error(
        "Cannot delete brand with associated products or catalogues. Please remove them first."
      );
    }

    await prisma.brand.delete({
      where: { id },
    });

    revalidatePath("/admin/brands");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to delete brand:", error);
    throw new Error("Failed to delete brand");
  }
}

export const getBrandCount = async (): Promise<number> => {
  try {
    const count = await prisma.brand.count();
    return count;
  } catch (error) {
    console.error("Failed to fetch brand count:", error);
    return 0;
  }
};
