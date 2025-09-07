"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions/products";

interface DeleteProductButtonProps {
  productId: number;
}

const DeleteProductButton = ({ productId }: DeleteProductButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProduct(productId);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete product"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
      title="Delete product"
      aria-label="Delete product"
    >
      <Trash2 size={16} />
    </button>
  );
};

export default DeleteProductButton;
