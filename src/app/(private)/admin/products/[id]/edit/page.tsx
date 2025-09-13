"use client";

import React, { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  getProduct,
  updateProductWithSchema,
  getBrandsForDropdown,
  getCategoriesForDropdown,
  getCataloguesForDropdown,
  deleteImageUrl,
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
import { notFound } from "next/navigation";
import { uploadFile } from "@/lib/actions/uploadpic";
import { Brand, Category, Catalogue } from "@/generated/prisma";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditProductPage = ({ params }: EditProductPageProps) => {
  const router = useRouter();
  const uploaderRef = useRef<UploaderRef>(null);
  const [loading, setLoading] = React.useState(true);
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [catalogues, setCatalogues] = React.useState<Catalogue[]>([]);
  const [currentProduct, setCurrentProduct] = React.useState<{
    id: number;
    name: string;
    description?: string | null;
    imageUrls?: { id: number; url: string; productId: number }[];
    brandId: number;
    categoryId?: number | null;
    catalogueId?: number | null;
  } | null>(null);

  // Properly handle the async params
  const [resolvedParams, setResolvedParams] = React.useState<{ id: string } | null>(null);

  React.useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  const id = resolvedParams ? parseInt(resolvedParams.id) : null;

  const {
    register,
    handleSubmit,
    reset,
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
    const fetchData = async () => {
      try {
        if (!id || isNaN(id)) {
          notFound();
          return;
        }

        // Fetch product data and dropdown data in parallel
        const [productData, brandsData, categoriesData, cataloguesData] =
          await Promise.all([
            getProduct(id),
            getBrandsForDropdown(),
            getCategoriesForDropdown(),
            getCataloguesForDropdown(),
          ]);

        if (!productData) {
          notFound();
          return;
        }

        setCurrentProduct(productData);
        setBrands(brandsData);
        setCategories(categoriesData);
        setCatalogues(cataloguesData);

        reset({
          name: productData.name,
          description: productData.description || "",
          brandId: productData.brandId.toString(),
          categoryId: productData.categoryId?.toString() || "",
          catalogueId: productData.catalogueId?.toString() || "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    if (id !== null) {
      fetchData();
    }
  }, [id, reset]);

  const onSubmit = async (data: ProductSchemaType) => {
    try {
      if (!id) {
        toast.error("Invalid product ID");
        return;
      }
      
      // Update product data (images are handled separately)
      await updateProductWithSchema(id, data);
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Failed to update product.");
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      // Automatically upload and add the image
      const formData = new FormData();
      formData.append("file", file);
      const imageUrl = await uploadFile(formData);

      await handleAddImage(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    }
  };

  const handleFilesSelect = async (files: File[]) => {
    try {
      // Upload and add multiple images
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const imageUrl = await uploadFile(formData);
        await handleAddImage(imageUrl);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images.");
    }
  };

  const handleRemoveImage = async (imageId: number) => {
    try {
      await deleteImageUrl(imageId);

      // Update local state
      if (currentProduct) {
        const updatedProduct = {
          ...currentProduct,
          imageUrls:
            currentProduct.imageUrls?.filter((img) => img.id !== imageId) || [],
        };
        setCurrentProduct(updatedProduct);
      }

      toast.success("Image removed successfully!");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image.");
    }
  };

  const handleAddImage = async (imageUrl: string) => {
    try {
      if (currentProduct) {
        const newImage = await addImageUrl(currentProduct.id, imageUrl);

        // Update local state
        const updatedProduct = {
          ...currentProduct,
          imageUrls: [...(currentProduct.imageUrls || []), newImage],
        };
        setCurrentProduct(updatedProduct);

        toast.success("Image added successfully!");
      }
    } catch (error) {
      console.error("Error adding image:", error);
      toast.error("Failed to add image.");
    }
  };

  if (loading || !resolvedParams) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-32 mb-8"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-2">Update product information</p>
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

              {/* Image Management Section */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">
                  Product Images
                </Label>

                {/* Existing Images Display */}
                {currentProduct?.imageUrls &&
                  currentProduct.imageUrls.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-600">
                        Current Images
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {currentProduct.imageUrls.map((imageUrl, index) => (
                          <div key={imageUrl.id} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={imageUrl.url}
                                alt={`Product image ${index + 1}`}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveImage(imageUrl.id)}
                                className="text-xs"
                              >
                                Remove
                              </Button>
                            </div>
                            {index === 0 && (
                              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                Primary
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Add New Image */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Add New Images
                  </h4>
                  <Uploader
                    multiple
                    ref={uploaderRef}
                    onFilesSelect={handleFilesSelect}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Link href="/admin/products">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Update Product
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
