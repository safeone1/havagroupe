import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getBrand, updateBrand } from "@/lib/actions/brands";
import BrandForm from "../../components/BrandForm";
import { notFound } from "next/navigation";

interface EditBrandPageProps {
  params: {
    id: string;
  };
}

const EditBrandPage = async ({ params }: EditBrandPageProps) => {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    notFound();
  }

  const brand = await getBrand(id);

  if (!brand) {
    notFound();
  }

  const updateBrandWithId = updateBrand.bind(null, id);

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/brands"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Brands
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Brand</h1>
          <p className="text-gray-600 mt-2">Update brand information</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <BrandForm
            action={updateBrandWithId}
            initialData={{
              name: brand.name,
              description: brand.description || "",
              logoUrl: brand.logoUrl || "",
            }}
            submitLabel="Update Brand"
          />
        </div>
      </div>
    </div>
  );
};

export default EditBrandPage;
