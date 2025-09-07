import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createBrand } from "@/lib/actions/brands";
// import BrandForm from "../components/BrandForm";

const CreateBrandPage = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Create New Brand</h1>
          <p className="text-gray-600 mt-2">Add a new brand to your catalog</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {/* <BrandForm action={createBrand} /> */}
        </div>
      </div>
    </div>
  );
};

export default CreateBrandPage;
