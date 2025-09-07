"use server";

import { prisma } from "@/lib/prismacl";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Catalogue, Brand } from "@/generated/prisma";

// Type for catalogue with relations
export type CatalogueWithRelations = Catalogue & {
  brand: Brand;
  _count?: {
    products: number;
  };
};

// Get all catalogues
export async function getCatalogues(): Promise<CatalogueWithRelations[]> {
  try {
    const catalogues = await prisma.catalogue.findMany({
      include: {
        brand: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return catalogues;
  } catch (error) {
    console.error("Failed to fetch catalogues:", error);
    throw new Error("Failed to fetch catalogues");
  }
}

// Get a single catalogue by ID
export async function getCatalogue(
  id: number
): Promise<CatalogueWithRelations | null> {
  try {
    const catalogue = await prisma.catalogue.findUnique({
      where: { id },
      include: {
        brand: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return catalogue;
  } catch (error) {
    console.error("Failed to fetch catalogue:", error);
    throw new Error("Failed to fetch catalogue");
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

// Create a new catalogue
export async function createCatalogue(formData: FormData) {
  const title = formData.get("title") as string;
  const fileUrl = formData.get("fileUrl") as string;
  const brandId = formData.get("brandId") as string;

  // Validation
  if (!title || title.trim().length === 0) {
    throw new Error("Catalogue title is required");
  }

  if (!brandId) {
    throw new Error("Brand is required");
  }

  try {
    await prisma.catalogue.create({
      data: {
        title: title.trim(),
        fileUrl: fileUrl?.trim() || null,
        brandId: parseInt(brandId),
      },
    });

    revalidatePath("/admin/catalogues");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to create catalogue:", error);
    throw new Error("Failed to create catalogue");
  }

  redirect("/admin/catalogues");
}

// Update a catalogue
export async function updateCatalogue(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const fileUrl = formData.get("fileUrl") as string;
  const brandId = formData.get("brandId") as string;

  // Validation
  if (!title || title.trim().length === 0) {
    throw new Error("Catalogue title is required");
  }

  if (!brandId) {
    throw new Error("Brand is required");
  }

  try {
    // Check if catalogue exists
    const existingCatalogue = await prisma.catalogue.findUnique({
      where: { id },
    });

    if (!existingCatalogue) {
      throw new Error("Catalogue not found");
    }

    await prisma.catalogue.update({
      where: { id },
      data: {
        title: title.trim(),
        fileUrl: fileUrl?.trim() || null,
        brandId: parseInt(brandId),
      },
    });

    revalidatePath("/admin/catalogues");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to update catalogue:", error);
    throw new Error("Failed to update catalogue");
  }

  redirect("/admin/catalogues");
}

// Delete a catalogue
export async function deleteCatalogue(id: number) {
  try {
    // Check if catalogue exists
    const existingCatalogue = await prisma.catalogue.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!existingCatalogue) {
      throw new Error("Catalogue not found");
    }

    // Check if catalogue has associated products
    if (existingCatalogue._count.products > 0) {
      throw new Error(
        "Cannot delete catalogue with associated products. Please remove them first."
      );
    }

    await prisma.catalogue.delete({
      where: { id },
    });

    revalidatePath("/admin/catalogues");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to delete catalogue:", error);
    throw new Error("Failed to delete catalogue");
  }
}
