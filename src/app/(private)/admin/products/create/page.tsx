"use client";

import React, { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  createProductWithSchema,
  getBrandsForDropdown,
  getCategoriesForDropdown,
  getCataloguesForDropdown,
  addImageUrl,
} from "@/lib/actions/products";
import { useForm } from "react-hook-form";
import { ProductSchema, ProductSchemaType } from "@/lib/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Uploader, { UploaderRef } from "@/components/admin/Uploader";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/actions/uploadpic";
import { Brand, Category, Catalogue } from "@/generated/prisma";

const CreateProductPage = () => {
  const router = useRouter();
  const uploaderRef = useRef<UploaderRef>(null);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]); // Changed to array
  const [loading, setLoading] = React.useState(true);
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [catalogues, setCatalogues] = React.useState<Catalogue[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductSchemaType>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      description: "",
      brandId: "",
      categoryId: "",
      catalogueId: "",
    },
  });

  React.useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [brandsData, categoriesData, cataloguesData] = await Promise.all([
          getBrandsForDropdown(),
          getCategoriesForDropdown(),
          getCataloguesForDropdown(),
        ]);

        setBrands(brandsData);
        setCategories(categoriesData);
        setCatalogues(cataloguesData);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to load form data");
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const onSubmit = async (data: ProductSchemaType) => {
    try {
      // Create the product first
      const product = await createProductWithSchema(data);

      // Upload and associate any selected files with the new product
      if (selectedFiles && selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          try {
            const formData = new FormData();
            formData.append("file", file);
            const imageUrl = await uploadFile(formData);
            await addImageUrl(product.id, imageUrl);
          } catch (error) {
            console.error("Failed to upload image:", error);
            // Continue with other images even if one fails
          }
        }
      }

      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error("Failed to create product.");
    }
  };

  const handleFilesSelect = (files: File[]) => {
    setSelectedFiles(files);
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/admin/products"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Products
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Product
            </h1>
            <p className="text-gray-600 mt-2">
              Add a new product to your catalog
            </p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Product Name Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Product Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter product name"
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
                  placeholder="Enter product description (optional)"
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

              {/* Relationships */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Brand Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="brandId"
                    className="text-sm font-medium text-gray-700"
                  >
                    Brand *
                  </Label>
                  <select
                    id="brandId"
                    {...register("brandId")}
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
                    <p className="text-sm text-red-600">
                      {errors.brandId.message}
                    </p>
                  )}
                </div>

                {/* Category Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="categoryId"
                    className="text-sm font-medium text-gray-700"
                  >
                    Category
                  </Label>
                  <select
                    id="categoryId"
                    {...register("categoryId")}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.categoryId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-sm text-red-600">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                {/* Catalogue Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="catalogueId"
                    className="text-sm font-medium text-gray-700"
                  >
                    Catalogue
                  </Label>
                  <select
                    id="catalogueId"
                    {...register("catalogueId")}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.catalogueId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a catalogue</option>
                    {catalogues.map((catalogue) => (
                      <option
                        key={catalogue.id}
                        value={catalogue.id.toString()}
                      >
                        {catalogue.title}
                      </option>
                    ))}
                  </select>
                  {errors.catalogueId && (
                    <p className="text-sm text-red-600">
                      {errors.catalogueId.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <Uploader
                multiple
                ref={uploaderRef}
                onFilesSelect={handleFilesSelect}
              />

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Link href="/admin/products">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Create Product
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
