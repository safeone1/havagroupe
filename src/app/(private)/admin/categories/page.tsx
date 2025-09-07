import React from "react";
import { Plus, Edit, FolderTree, Folder, FileText } from "lucide-react";
import Link from "next/link";
import {
  getCategoriesTree,
  type CategoryWithRelations,
} from "@/lib/actions/categories";
import DeleteCategory from "./components/DeleteCategory";

// Recursive component to render category tree
const CategoryTreeNode = ({
  category,
  level = 0,
}: {
  category: CategoryWithRelations;
  level?: number;
}) => {
  const isRoot = level === 0;

  // Create proper indentation based on level using standard Tailwind classes
  const getIndentClass = (level: number) => {
    switch (level) {
      case 0:
        return "pl-6";
      case 1:
        return "pl-12";
      case 2:
        return "pl-16";
      case 3:
        return "pl-20";
      case 4:
        return "pl-24";
      case 5:
        return "pl-28";
      default:
        return "pl-32";
    }
  };

  return (
    <div key={category.id}>
      {/* Category Row */}
      <div
        className={`${getIndentClass(level)} pr-6 py-4 ${
          isRoot ? "bg-gray-50" : "bg-white"
        } ${level > 0 ? "border-l-4 border-gray-200" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Indentation visual indicator for nested categories */}
            {level > 0 && (
              <div className="flex items-center">
                <div className="w-4 h-4 border-l-2 border-b-2 border-gray-300"></div>
              </div>
            )}

            {/* Icon based on level */}
            {isRoot ? (
              <Folder className="h-5 w-5 text-blue-600" />
            ) : level === 1 ? (
              <FileText className="h-4 w-4 text-green-600" />
            ) : level === 2 ? (
              <FileText className="h-4 w-4 text-yellow-600" />
            ) : (
              <FileText className="h-4 w-4 text-purple-600" />
            )}

            <div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm ${
                    isRoot ? "font-medium" : "font-normal"
                  } text-gray-900`}
                >
                  {category.name}
                </span>
                <span className="text-xs text-gray-500">
                  (/{category.slug})
                </span>
                {level > 0 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Level {level + 1}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                <span>{category._count?.products || 0} products</span>
                <span>{category._count?.subcategories || 0} subcategories</span>
                <span>
                  Created {new Date(category.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href={`/admin/categories/${category.id}/edit`}
              className="text-indigo-600 flex justify-center items-center hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded transition-colors"
              title={`Edit ${category.name}`}
            >
              <Edit size={16} />
            </Link>
            <DeleteCategory
              categoryId={category.id}
              categoryName={category.name}
              hasProducts={category._count?.products || 0}
              hasSubcategories={category._count?.subcategories || 0}
            />
          </div>
        </div>
      </div>

      {/* Render subcategories recursively */}
      {category.subcategories.length > 0 && (
        <div className={level > 0 ? "border-b border-gray-100" : ""}>
          {category.subcategories.map((subcategory, index) => (
            <div
              key={subcategory.id}
              className={
                index !== category.subcategories.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }
            >
              <CategoryTreeNode category={subcategory} level={level + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CategoriesPage = async () => {
  let categories: CategoryWithRelations[] = [];
  let error: string | null = null;

  try {
    categories = await getCategoriesTree();
  } catch (err) {
    error = err instanceof Error ? err.message : "An error occurred";
  }

  if (error) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-scroll">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Categories Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your product categories with unlimited nesting levels
          </p>
        </div>
        <Link
          href="/admin/categories/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add New Category</span>
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FolderTree className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No categories found
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first category.
          </p>
          <Link
            href="/admin/categories/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
          >
            <Plus size={20} />
            <span>Create Category</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Categories Hierarchy
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Unlimited nesting levels - organize your products with complex
              hierarchies
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <CategoryTreeNode
                key={category.id}
                category={category}
                level={0}
              />
            ))}
          </div>

          {/* Add Category Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <Link
              href="/admin/categories/create"
              className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-2 text-sm"
            >
              <Plus size={16} />
              <span>Add category or subcategory at any level</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
