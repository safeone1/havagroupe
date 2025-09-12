"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  getCategory,
  updateCategoryWithSchema,
  getAvailableParentCategories,
} from "@/lib/actions/categories";
import { useForm } from "react-hook-form";
import { CategorySchema, CategorySchemaType } from "@/lib/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Category } from "@/generated/prisma";

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditCategoryPage = ({ params }: EditCategoryPageProps) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [parentCategories, setParentCategories] = React.useState<Category[]>(
    []
  );
  const [currentCategory, setCurrentCategory] = React.useState<{
    id: number;
    name: string;
    slug: string;
    parentId?: number | null;
    hasSubcategories?: boolean;
  } | null>(null);
  const resolvedParams = React.use(params);
  const id = parseInt(resolvedParams.id);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CategorySchemaType>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      parentId: "",
    },
  });

  const parentId = watch("parentId");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (isNaN(id)) {
          notFound();
        }

        // Fetch category data and parent categories in parallel
        const [categoryData, parentCategoriesData] = await Promise.all([
          getCategory(id),
          getAvailableParentCategories(id),
        ]);

        if (!categoryData) {
          notFound();
        }

        setCurrentCategory({
          ...categoryData,
          hasSubcategories: (categoryData._count?.subcategories || 0) > 0,
        });

        // All available parents are already filtered by getAvailableParentCategories
        setParentCategories(parentCategoriesData);

        reset({
          name: categoryData.name,
          parentId: categoryData.parentId?.toString() || "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load category data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: CategorySchemaType) => {
    try {
      await updateCategoryWithSchema(id, data);
      toast.success("Category updated successfully!");
      router.push("/admin/categories");
    } catch (err) {
      console.error("Error updating category:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to update category."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-32 mb-8"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-6">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link
              href="/admin/categories"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Categories
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
            <p className="text-gray-600 mt-2">Update category information</p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Category Name Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Category Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter category name"
                  {...register("name")}
                  className={`w-full ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Current slug: /{currentCategory?.slug}
                </p>
              </div>

              {/* Parent Category Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="parentId"
                  className="text-sm font-medium text-gray-700"
                >
                  Parent Category (Optional)
                </Label>
                <select
                  id="parentId"
                  {...register("parentId")}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.parentId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">None (Make this a main category)</option>
                  {parentCategories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.parentId && (
                  <p className="text-sm text-red-600">
                    {errors.parentId.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {parentId
                    ? "This will move the category under the selected parent"
                    : "Category will be a main category"}
                </p>
              </div>

              {/* Warning for categories with subcategories */}
              {currentCategory?.hasSubcategories && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">
                    ⚠️ Category has subcategories
                  </h4>
                  <p className="text-sm text-yellow-700">
                    This category has subcategories. Be careful when changing
                    the parent category as it will affect the entire hierarchy
                    structure.
                  </p>
                </div>
              )}

              {/* Current Status */}
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Current Status
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • <strong>Name:</strong> {currentCategory?.name}
                  </li>
                  <li>
                    • <strong>Slug:</strong> /{currentCategory?.slug}
                  </li>
                  <li>
                    • <strong>Type:</strong>{" "}
                    {currentCategory?.parentId
                      ? "Subcategory"
                      : "Main Category"}
                  </li>
                  {currentCategory?.hasSubcategories && (
                    <li>
                      • <strong>Has subcategories:</strong> Yes
                    </li>
                  )}
                </ul>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Link href="/admin/categories">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Update Category
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryPage;
