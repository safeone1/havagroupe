"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteCatalogue } from "@/lib/actions/catalogues";
import { toast } from "sonner";

interface DeleteCatalogueProps {
  catalogueId: number;
  catalogueTitle: string;
  hasProducts: number;
}

export default function DeleteCatalogue({
  catalogueId,
  catalogueTitle,
  hasProducts,
}: DeleteCatalogueProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (hasProducts > 0) {
      toast.error(
        `Cannot delete catalogue "${catalogueTitle}" because it has ${hasProducts} product(s) associated with it.`
      );
      return;
    }

    setIsDeleting(true);

    try {
      await deleteCatalogue(catalogueId);
      toast.success(`Catalogue "${catalogueTitle}" deleted successfully`);
      setShowConfirm(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete catalogue";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Delete Catalogue
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the catalogue{" "}
            <strong>&quot;{catalogueTitle}&quot;</strong>? This action cannot be
            undone.
          </p>

          {hasProducts > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-red-800 text-sm">
                ⚠️ This catalogue has {hasProducts} product(s) associated with
                it. You must remove or reassign these products before deleting
                the catalogue.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting || hasProducts > 0}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
      title={`Delete ${catalogueTitle}`}
    >
      <Trash2 size={16} />
    </button>
  );
}
