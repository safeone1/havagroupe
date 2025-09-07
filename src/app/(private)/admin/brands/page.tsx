import React from "react";
import { Plus, Edit, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getBrands, type BrandWithCounts } from "@/lib/actions/brands";
import DeleteBrand from "./components/DeleteBrand";

const BrandsPage = async () => {
  let brands: BrandWithCounts[] = [];
  let error: string | null = null;

  try {
    brands = await getBrands();
  } catch (err) {
    error = err instanceof Error ? err.message : "An error occurred";
  }

  if (error) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-scroll">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Brands Management
          </h1>
          <p className="text-gray-600 mt-2">Manage your product brands</p>
        </div>
        <Link
          href="/admin/brands/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add New Brand</span>
        </Link>
      </div>

      {brands.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No brands found
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first brand.
          </p>
          <Link
            href="/admin/brands/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
          >
            <Plus size={20} />
            <span>Create Brand</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catalogues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {brand.logoUrl ? (
                        <Image
                          className="h-10 w-10 rounded-lg object-cover mr-4"
                          src={brand.logoUrl || "/placeholder.png"}
                          alt={brand.name}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                          <Building2 className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {brand.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {brand.description || "No description"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {brand._count?.products || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {brand._count?.catalogues || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(brand.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/brands/${brand.id}/edit`}
                        className="text-indigo-600 flex justify-center items-center hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded transition-colors"
                      >
                        <Edit size={16} />
                      </Link>

                      <DeleteBrand brandId={brand.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BrandsPage;
