"use client";

import React, { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createBrand } from "@/lib/actions/brands";
import { useForm } from "react-hook-form";
import { BrandSchema, BrandSchemaType } from "@/lib/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Uploader, { UploaderRef } from "@/components/admin/Uploader";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/actions/uploadpic";
// import BrandForm from "../components/BrandForm";

const CreateBrandPage = () => {
  const router = useRouter();
  const uploaderRef = useRef<UploaderRef>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandSchemaType>({
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: BrandSchemaType) => {
    try {
      let logoUrl = "";

      // Upload the file if one is selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        logoUrl = await uploadFile(formData);
      }

      const finalData = {
        ...data,
        logoUrl,
      };

      await createBrand(finalData);
      toast.success("Brand created successfully!");
      router.push("/admin/brands");
    } catch (err) {
      console.error("Error creating brand:", err);
      toast.error("Failed to create brand.");
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

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

        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Brand Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Brand Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter brand name"
                {...register("name")}
                className={`w-full ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description
              </Label>
              <textarea
                id="description"
                rows={4}
                placeholder="Enter brand description (optional)"
                {...register("description")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <Uploader ref={uploaderRef} onFileSelect={handleFileSelect} />

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <Link href="/admin/brands">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Create Brand
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateBrandPage;
