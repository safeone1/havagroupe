import React from "react";
import {
  Plus,
  Edit,
  Building2,
  Search,
  Filter,
  MoreVertical,
  Eye,
  TrendingUp,
} from "lucide-react";
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
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading brands
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#911828] to-[#6b1220] bg-clip-text text-transparent">
              Brands Management
            </h1>
            <p className="text-gray-600 mt-2 flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              Manage your product brands and their information
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-[#911828] to-[#6b1220] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
              <Link
                href="/admin/brands/create"
                className="flex items-center space-x-2"
              >
                <Plus size={20} />
                <span className="font-medium">Add New Brand</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Brands
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {brands.length}
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Brands
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {brands.length}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {brands.reduce(
                    (sum, brand) => sum + (brand._count?.products || 0),
                    0
                  )}
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search brands..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#911828]/20 focus:border-[#911828] transition-all duration-200"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Filter</span>
            </button>
          </div>
        </div>

        {brands.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-[#911828]/10 to-[#6b1220]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-12 h-12 text-[#911828]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No brands found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by creating your first brand. Brands help organize
              your products and make them easier to manage.
            </p>
            <Link
              href="/admin/brands/create"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#911828] to-[#6b1220] text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              <span>Create Your First Brand</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Catalogues
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {brands.map((brand) => (
                    <tr
                      key={brand.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {brand.logoUrl ? (
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden mr-4 shadow-sm">
                              <Image
                                src={brand.logoUrl || "/placeholder.png"}
                                alt={brand.name}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#911828]/10 to-[#6b1220]/10 flex items-center justify-center mr-4">
                              <Building2 className="h-6 w-6 text-[#911828]" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {brand.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {brand.description || (
                            <span className="italic text-gray-400">
                              No description
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {brand._count?.products || 0} products
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {brand._count?.catalogues || 0} catalogues
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(brand.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <Link
                            href={`/admin/brands/${brand.id}/edit`}
                            className="p-2 text-[#911828] hover:bg-[#911828]/10 rounded-lg transition-all duration-200 group"
                          >
                            <Edit
                              size={16}
                              className="group-hover:scale-110 transition-transform"
                            />
                          </Link>
                          <DeleteBrand brandId={brand.id} />
                          <button
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                            title="More options"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandsPage;
