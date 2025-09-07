"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { deleteCategory } from "@/lib/actions/categories";
import { toast } from "sonner";

interface DeleteCategoryProps {
  categoryId: number;
  categoryName: string;
  hasProducts?: number;
  hasSubcategories?: number;
}

const DeleteCategory = ({
  categoryId,
  categoryName,
  hasProducts = 0,
  hasSubcategories = 0,
}: DeleteCategoryProps) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    // Check if category has products or subcategories
    if (hasProducts > 0) {
      toast.error(
        `Cannot delete "${categoryName}" because it has ${hasProducts} product(s) associated with it.`
      );
      return;
    }

    if (hasSubcategories > 0) {
      toast.error(
        `Cannot delete "${categoryName}" because it has ${hasSubcategories} subcategorie(s). Delete subcategories first.`
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteCategory(categoryId);
      toast.success(`Category "${categoryName}" deleted successfully!`);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const canDelete = hasProducts === 0 && hasSubcategories === 0;

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting || !canDelete}
      className={`p-2 rounded transition-colors ${
        canDelete
          ? "text-red-600 hover:text-red-900 hover:bg-red-50"
          : "text-gray-400 cursor-not-allowed"
      }`}
      title={
        !canDelete
          ? hasProducts > 0
            ? `Cannot delete: has ${hasProducts} product(s)`
            : `Cannot delete: has ${hasSubcategories} subcategorie(s)`
          : `Delete ${categoryName}`
      }
    >
      <Trash2 size={16} />
    </button>
  );
};

export default DeleteCategory;
