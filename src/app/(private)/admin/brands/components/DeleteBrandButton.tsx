"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteBrand } from "@/lib/actions/brands";

interface DeleteBrandButtonProps {
  brandId: number;
}

const DeleteBrandButton = ({ brandId }: DeleteBrandButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this brand?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteBrand(brandId);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete brand");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
      title="Delete brand"
      aria-label="Delete brand"
    >
      <Trash2 size={16} />
    </button>
  );
};

export default DeleteBrandButton;
