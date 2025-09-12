import React from "react";
import { Plus, Edit, FolderTree, Folder, FileText } from "lucide-react";
import Link from "next/link";
import {
  getCategoriesTree,
  type CategoryWithRelations,
} from "@/lib/actions/categories";
import DeleteCategory from "./components/DeleteCategory";
import AdminPageLayout from "../components/AdminPageLayout";

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

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      case 1:
        return "bg-gradient-to-r from-green-500 to-green-600";
      case 2:
        return "bg-gradient-to-r from-yellow-500 to-yellow-600";
      default:
        return "bg-gradient-to-r from-purple-500 to-purple-600";
    }
  };

  return (
    <div key={category.id}>
      {/* Category Row */}
      <div
        className={`${getIndentClass(level)} pr-6 py-4 ${
          isRoot ? "bg-gradient-to-r from-gray-50 to-gray-100" : "bg-white"
        } ${
          level > 0 ? "border-l-4 border-[#911828]/20" : ""
        } hover:bg-gray-50 transition-colors duration-150`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Indentation visual indicator for nested categories */}
            {level > 0 && (
              <div className="flex items-center">
                <div className="w-4 h-4 border-l-2 border-b-2 border-[#911828]/30 rounded-bl"></div>
              </div>
            )}

            {/* Icon based on level */}
            <div className={`p-2 rounded-xl ${getLevelColor(level)}`}>
              {isRoot ? (
                <Folder className="h-5 w-5 text-white" />
              ) : (
                <FileText className="h-4 w-4 text-white" />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-3">
                <span
                  className={`text-sm ${
                    isRoot
                      ? "font-semibold text-gray-900"
                      : "font-medium text-gray-800"
                  }`}
                >
                  {category.name}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md font-mono">
                  /{category.slug}
                </span>
                {level > 0 && (
                  <span className="text-xs bg-[#911828]/10 text-[#911828] px-2 py-1 rounded-full font-medium">
                    Level {level + 1}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                <span className="inline-flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
                  {category._count?.products || 0} products
                </span>
                <span className="inline-flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  {category._count?.subcategories || 0} subcategories
                </span>
                <span className="text-gray-400">
                  {new Date(category.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href={`/admin/categories/${category.id}/edit`}
              className="p-2 text-[#911828] hover:bg-[#911828]/10 rounded-lg transition-all duration-200 group"
              title={`Edit ${category.name}`}
            >
              <Edit
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
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

  const totalCategories = categories.reduce((count, cat) => {
    const countSubcategories = (category: CategoryWithRelations): number => {
      return (
        1 +
        category.subcategories.reduce(
          (acc, sub) => acc + countSubcategories(sub),
          0
        )
      );
    };
    return count + countSubcategories(cat);
  }, 0);

  const totalProducts = categories.reduce((count, cat) => {
    const countProducts = (category: CategoryWithRelations): number => {
      return (
        (category._count?.products || 0) +
        category.subcategories.reduce((acc, sub) => acc + countProducts(sub), 0)
      );
    };
    return count + countProducts(cat);
  }, 0);

  return (
    <AdminPageLayout
      title="Categories Management"
      description="Manage your product categories with unlimited nesting levels"
      icon={FolderTree}
      actions={
        <div className="bg-gradient-to-r from-[#911828] to-[#6b1220] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
          <Link
            href="/admin/categories/create"
            className="flex items-center space-x-2"
          >
            <Plus size={20} />
            <span className="font-medium">Add New Category</span>
          </Link>
        </div>
      }
    >
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading categories
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Categories
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalCategories}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3">
                  <FolderTree className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Root Categories
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {categories.length}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3">
                  <Folder className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Products
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalProducts}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-[#911828]/10 to-[#6b1220]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderTree className="w-12 h-12 text-[#911828]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No categories found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Categories help organize your products in a hierarchical
                structure. Create your first category to get started.
              </p>
              <Link
                href="/admin/categories/create"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#911828] to-[#6b1220] text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Plus size={20} />
                <span>Create Your First Category</span>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FolderTree className="w-5 h-5 mr-2 text-[#911828]" />
                  Categories Hierarchy
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Unlimited nesting levels - organize your products with complex
                  hierarchies
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <CategoryTreeNode
                    key={category.id}
                    category={category}
                    level={0}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </AdminPageLayout>
  );
};

export default CategoriesPage;
