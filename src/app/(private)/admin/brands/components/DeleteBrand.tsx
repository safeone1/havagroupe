"use client";
import { Button } from "@/components/ui/button";
import { deleteBrand } from "@/lib/actions/brands";
import { Trash } from "lucide-react";
import React from "react";
interface DeleteBrandProps {
  brandId: number;
}

const DeleteBrand = ({ brandId }: DeleteBrandProps) => {
  return (
    <Button
      variant="destructive"
      size={"icon"}
      onClick={() => deleteBrand(brandId)}
    >
      <Trash size={16} />
    </Button>
  );
};

export default DeleteBrand;
