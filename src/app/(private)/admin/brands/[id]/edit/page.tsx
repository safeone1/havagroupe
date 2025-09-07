"use client";

import React, { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getBrand, updateBrand } from "@/lib/actions/brands";
import { useForm } from "react-hook-form";
import { BrandSchema, BrandSchemaType } from "@/lib/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Uploader, { UploaderRef } from "@/components/Uploader";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { uploadFile } from "@/lib/actions/uploadpic";

interface EditBrandPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditBrandPage = ({ params }: EditBrandPageProps) => {
  const router = useRouter();
  const uploaderRef = useRef<UploaderRef>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [currentBrand, setCurrentBrand] = React.useState<{
    id: number;
    name: string;
    description?: string | null;
    logoUrl?: string | null;
  } | null>(null);
  const resolvedParams = React.use(params);
  const id = parseInt(resolvedParams.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BrandSchemaType>({
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: undefined,
    },
  });

  React.useEffect(() => {
    const fetchBrand = async () => {
      try {
        if (isNaN(id)) {
          notFound();
        }

        const brandData = await getBrand(id);
        if (!brandData) {
          notFound();
        }

        setCurrentBrand(brandData);
        reset({
          name: brandData.name,
          description: brandData.description || "",
          logoUrl: brandData.logoUrl || undefined,
        });
      } catch (error) {
        console.error("Error fetching brand:", error);
        toast.error("Failed to load brand data");
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id, reset]);

  const onSubmit = async (data: BrandSchemaType) => {
    try {
      let logoUrl = data.logoUrl;

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
      await updateBrand(id, finalData);
      toast.success("Brand updated successfully!");
      router.push("/admin/brands");
    } catch (err) {
      console.error("Error updating brand:", err);
      toast.error("Failed to update brand.");
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-32 mb-8"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-6">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-24 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

            <Uploader
              ref={uploaderRef}
              onFileSelect={handleFileSelect}
              initialImageUrl={currentBrand?.logoUrl || undefined}
            />

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <Link href="/admin/brands">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Update Brand
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditBrandPage;
