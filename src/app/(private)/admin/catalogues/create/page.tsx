"use client";

import React, { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createCatalogue, getBrandsForSelect } from "@/lib/actions/catalogues";
import { useForm } from "react-hook-form";
import { CatalogueSchema, CatalogueSchemaType } from "@/lib/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Uploader, { UploaderRef } from "@/components/Uploader";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/actions/uploadpic";

interface Brand {
  id: number;
  name: string;
}

const CreateCataloguePage = () => {
  const router = useRouter();
  const uploaderRef = useRef<UploaderRef>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [brands, setBrands] = React.useState<Brand[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CatalogueSchemaType>({
    resolver: zodResolver(CatalogueSchema),
    defaultValues: {
      title: "",
      fileUrl: "",
      brandId: "",
    },
  });

  React.useEffect(() => {
    const loadBrands = async () => {
      try {
        const fetchedBrands = await getBrandsForSelect();
        setBrands(fetchedBrands);
      } catch {
        toast.error("Failed to load brands");
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  const onSubmit = async (data: CatalogueSchemaType) => {
    try {
      let fileUrl = data.fileUrl || "";

      // Upload the file if one is selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        fileUrl = await uploadFile(formData);
      }

      const finalData = {
        ...data,
        fileUrl,
      };

      // Convert data to FormData format for the existing action
      const formData = new FormData();
      formData.append("title", finalData.title);
      formData.append("brandId", finalData.brandId);
      if (finalData.fileUrl) {
        formData.append("fileUrl", finalData.fileUrl);
      }

      await createCatalogue(formData);
      toast.success("Catalogue created successfully!");
      router.push("/admin/catalogues");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create catalogue";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <Card className="max-w-2xl mx-auto p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/catalogues"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Catalogues
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">
            Create New Catalogue
          </h1>
          <p className="text-gray-600 mt-2">
            Add a new catalogue to your system
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Catalogue Title *</Label>
              <Input
                {...register("title")}
                type="text"
                id="title"
                placeholder="Enter catalogue title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Brand Selection */}
            <div className="space-y-2">
              <Label htmlFor="brandId">Brand *</Label>
              <select
                {...register("brandId")}
                id="brandId"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.brandId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors.brandId && (
                <p className="text-sm text-red-600">{errors.brandId.message}</p>
              )}
            </div>

            {/* File URL */}
            <div className="space-y-2">
              <Label htmlFor="fileUrl">File URL (Optional)</Label>
              <Input
                {...register("fileUrl")}
                type="url"
                id="fileUrl"
                placeholder="https://example.com/catalogue.pdf"
                className={errors.fileUrl ? "border-red-500" : ""}
              />
              {errors.fileUrl && (
                <p className="text-sm text-red-600">{errors.fileUrl.message}</p>
              )}
              <p className="text-sm text-gray-500">
                You can either provide a URL or upload a file below
              </p>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Upload File (Optional)</Label>
              <Uploader
                ref={uploaderRef}
                onFileSelect={setSelectedFile}
                maxSizeMB={10}
              />
              <p className="text-sm text-gray-500">
                Accepted formats: PDF, Word, Excel, PowerPoint (Max 10MB)
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/catalogues")}
              >
                Cancel
              </Button>
              <Button type="submit">Create Catalogue</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateCataloguePage;
