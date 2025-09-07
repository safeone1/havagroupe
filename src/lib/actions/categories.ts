"use server";

import { prisma } from "@/lib/prismacl";
import { revalidatePath } from "next/cache";
import { Category } from "@/generated/prisma";
import { CategorySchemaType } from "@/lib/Schema";

// Type for category with relations (deep nesting)
export type CategoryWithRelations = Category & {
  parent: Category | null;
  subcategories: CategoryWithRelations[];
  _count?: {
    products: number;
    subcategories: number;
  };
};

// Helper function to recursively build category tree from flat list
function buildCategoryTree(
  categories: (Category & {
    parent: Category | null;
    _count?: { products: number; subcategories: number };
  })[],
  parentId: number | null = null
): CategoryWithRelations[] {
  return categories
    .filter((cat) => cat.parentId === parentId)
    .map((cat) => ({
      ...cat,
      subcategories: buildCategoryTree(categories, cat.id),
    }));
}

// Get all categories with hierarchy (flat list with relations)
export async function getCategories(): Promise<CategoryWithRelations[]> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        _count: {
          select: {
            products: true,
            subcategories: true,
          },
        },
      },
      orderBy: [
        { parentId: "asc" }, // Parent categories first
        { name: "asc" },
      ],
    });

    // Build the tree structure
    const tree = buildCategoryTree(
      categories.map((cat) => ({
        ...cat,
        subcategories: [],
      }))
    );

    return tree;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

// Get categories tree structure (only root categories with deep nesting)
export async function getCategoriesTree(): Promise<CategoryWithRelations[]> {
  try {
    // Fetch all categories first
    const allCategories = await prisma.category.findMany({
      include: {
        parent: true,
        _count: {
          select: {
            products: true,
            subcategories: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Build the tree structure recursively
    const tree = buildCategoryTree(
      allCategories.map((cat) => ({
        ...cat,
        subcategories: [],
      }))
    );

    return tree;
  } catch (error) {
    console.error("Failed to fetch categories tree:", error);
    throw new Error("Failed to fetch categories tree");
  }
}

// Get all categories that can be parents (excluding the category itself and its descendants)
export async function getAvailableParentCategories(
  excludeCategoryId?: number
): Promise<Category[]> {
  try {
    let categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // If we're editing a category, exclude it and its descendants
    if (excludeCategoryId) {
      const descendants = await getCategoryDescendants(excludeCategoryId);
      const excludeIds = [excludeCategoryId, ...descendants.map((d) => d.id)];
      categories = categories.filter((cat) => !excludeIds.includes(cat.id));
    }

    return categories;
  } catch (error) {
    console.error("Failed to fetch available parent categories:", error);
    throw new Error("Failed to fetch available parent categories");
  }
}

// Get all parent categories (for dropdown in subcategory creation)
export async function getParentCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch parent categories:", error);
    throw new Error("Failed to fetch parent categories");
  }
}

// Get all descendants of a category (for preventing circular references)
async function getCategoryDescendants(categoryId: number): Promise<Category[]> {
  try {
    const descendants: Category[] = [];

    const directChildren = await prisma.category.findMany({
      where: { parentId: categoryId },
    });

    for (const child of directChildren) {
      descendants.push(child);
      const childDescendants = await getCategoryDescendants(child.id);
      descendants.push(...childDescendants);
    }

    return descendants;
  } catch (error) {
    console.error("Failed to fetch category descendants:", error);
    return [];
  }
}

// Get a single category by ID
export async function getCategory(
  id: number
): Promise<CategoryWithRelations | null> {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        _count: {
          select: {
            products: true,
            subcategories: true,
          },
        },
      },
    });

    if (!category) return null;

    // Convert to CategoryWithRelations format
    return {
      ...category,
      subcategories: [], // Will be populated if needed
    };
  } catch (error) {
    console.error("Failed to fetch category:", error);
    throw new Error("Failed to fetch category");
  }
}

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Create a category with schema validation
export async function createCategoryWithSchema(data: CategorySchemaType) {
  try {
    const slug = generateSlug(data.name);

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new Error("A category with this name already exists");
    }

    await prisma.category.create({
      data: {
        name: data.name.trim(),
        slug,
        parentId: data.parentId ? parseInt(data.parentId) : null,
      },
    });

    revalidatePath("/admin/categories");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to create category:", error);
    throw new Error("Failed to create category");
  }
}

// Update a category with schema validation
export async function updateCategoryWithSchema(
  id: number,
  data: CategorySchemaType
) {
  try {
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new Error("Category not found");
    }

    const slug = generateSlug(data.name);

    // Check if slug already exists (excluding current category)
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (duplicateCategory) {
      throw new Error("A category with this name already exists");
    }

    // Prevent category from being its own parent or creating circular references
    if (data.parentId) {
      const parentId = parseInt(data.parentId);
      if (parentId === id) {
        throw new Error("A category cannot be its own parent");
      }

      // Check for circular reference
      const wouldCreateCircle = await checkCircularReference(id, parentId);
      if (wouldCreateCircle) {
        throw new Error(
          "This would create a circular reference in the category hierarchy"
        );
      }
    }

    await prisma.category.update({
      where: { id },
      data: {
        name: data.name.trim(),
        slug,
        parentId: data.parentId ? parseInt(data.parentId) : null,
      },
    });

    revalidatePath("/admin/categories");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to update category:", error);
    throw new Error("Failed to update category");
  }
}

// Check for circular references in category hierarchy
async function checkCircularReference(
  categoryId: number,
  proposedParentId: number
): Promise<boolean> {
  let currentParentId: number | null = proposedParentId;

  while (currentParentId) {
    if (currentParentId === categoryId) {
      return true; // Circular reference found
    }

    const parent: { parentId: number | null } | null =
      await prisma.category.findUnique({
        where: { id: currentParentId },
        select: { parentId: true },
      });

    currentParentId = parent?.parentId || null;
  }

  return false;
}

// Delete a category
export async function deleteCategory(id: number) {
  try {
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!existingCategory) {
      throw new Error("Category not found");
    }

    // Check if category has products
    if (existingCategory._count.products > 0) {
      throw new Error(
        "Cannot delete category that has products associated with it"
      );
    }

    // Check if category has subcategories
    if (existingCategory.subcategories.length > 0) {
      throw new Error(
        "Cannot delete category that has subcategories. Delete subcategories first."
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to delete category:", error);
    throw new Error("Failed to delete category");
  }
}

// Get category count
export const getCategoryCount = async (): Promise<number> => {
  try {
    const count = await prisma.category.count();
    return count;
  } catch (error) {
    console.error("Failed to fetch category count:", error);
    return 0;
  }
};
