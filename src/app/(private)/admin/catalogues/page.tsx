import React from "react";
import {
  getCatalogues,
  type CatalogueWithRelations,
} from "@/lib/actions/catalogues";
import Link from "next/link";
import {
  Edit,
  Plus,
  FileText,
  ExternalLink,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Building2,
} from "lucide-react";
import DeleteCatalogue from "./components/DeleteCatalogue";
import AdminPageLayout from "../components/AdminPageLayout";

export default async function CataloguesPage() {
  let catalogues: CatalogueWithRelations[] = [];
  let error: string | null = null;

  try {
    catalogues = await getCatalogues();
  } catch (err) {
    error = err instanceof Error ? err.message : "An error occurred";
  }

  return (
    <AdminPageLayout
      title="Catalogues Management"
      description="Manage your product catalogues and documentation"
      icon={FileText}
      actions={
        <div className="bg-gradient-to-r from-[#911828] to-[#6b1220] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
          <Link
            href="/admin/catalogues/create"
            className="flex items-center space-x-2"
          >
            <Plus size={20} />
            <span className="font-medium">Add New Catalogue</span>
          </Link>
        </div>
      }
    >
      {error ? (
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
                Error loading catalogues
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Catalogues
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {catalogues.length}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    With Brands
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {catalogues.filter((c) => c.brand).length}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3">
                  <Building2 className="h-6 w-6 text-white" />
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
                    {catalogues.reduce(
                      (sum, cat) => sum + (cat._count?.products || 0),
                      0
                    )}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3">
                  <ExternalLink className="h-6 w-6 text-white" />
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
                  placeholder="Search catalogues..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#911828]/20 focus:border-[#911828] transition-all duration-200"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Filter</span>
              </button>
            </div>
          </div>

          {catalogues.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-[#911828]/10 to-[#6b1220]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-[#911828]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No catalogues found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Catalogues help organize and present your products in a
                structured format. Create your first catalogue to get started.
              </p>
              <Link
                href="/admin/catalogues/create"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#911828] to-[#6b1220] text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Plus size={20} />
                <span>Create Your First Catalogue</span>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {catalogues.map((catalogue) => (
                  <div
                    key={catalogue.id}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#911828]/10 to-[#6b1220]/10 rounded-xl flex items-center justify-center mr-3">
                          <FileText className="h-6 w-6 text-[#911828]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {catalogue.title}
                          </h3>
                          <p className="text-xs text-gray-500 font-mono">
                            ID: {catalogue.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/catalogues/${catalogue.id}/edit`}
                          className="p-2 text-[#911828] hover:bg-[#911828]/10 rounded-lg transition-all duration-200 group"
                          title={`Edit ${catalogue.title}`}
                        >
                          <Edit
                            size={16}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </Link>
                        <DeleteCatalogue
                          catalogueId={catalogue.id}
                          catalogueTitle={catalogue.title}
                          hasProducts={catalogue._count?.products || 0}
                        />
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                          title="More options"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Brand */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Brand:</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {catalogue.brand.name}
                        </span>
                      </div>

                      {/* Products Count */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Products:</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {catalogue._count?.products || 0} items
                        </span>
                      </div>

                      {/* Created Date */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Created:</span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(catalogue.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Download Link */}
                      {catalogue.downloadUrl && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <a
                            href={catalogue.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-[#911828] hover:text-[#6b1220] text-sm font-medium transition-colors"
                          >
                            <ExternalLink size={14} />
                            <span>Download Catalogue</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </AdminPageLayout>
  );
}
