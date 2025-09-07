import React from "react";
import {
  getCatalogues,
  type CatalogueWithRelations,
} from "@/lib/actions/catalogues";
import Link from "next/link";
import { Edit, Plus, FileText, ExternalLink } from "lucide-react";
import DeleteCatalogue from "./components/DeleteCatalogue";

export default async function CataloguesPage() {
  let catalogues: CatalogueWithRelations[] = [];
  let error: string | null = null;

  try {
    catalogues = await getCatalogues();
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
            Catalogues Management
          </h1>
          <p className="text-gray-600 mt-2">Manage your product catalogues</p>
        </div>
        <Link
          href="/admin/catalogues/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add New Catalogue</span>
        </Link>
      </div>

      {catalogues.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No catalogues found
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first catalogue.
          </p>
          <Link
            href="/admin/catalogues/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
          >
            <Plus size={16} />
            <span>Create Catalogue</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Catalogues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalogues.map((catalogue) => (
              <div
                key={catalogue.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {catalogue.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ID: {catalogue.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/catalogues/${catalogue.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded transition-colors"
                        title={`Edit ${catalogue.title}`}
                      >
                        <Edit size={16} />
                      </Link>
                      <DeleteCatalogue
                        catalogueId={catalogue.id}
                        catalogueTitle={catalogue.title}
                        hasProducts={catalogue._count?.products || 0}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Brand */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Brand:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {catalogue.brand.name}
                      </span>
                    </div>

                    {/* Products Count */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Products:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {catalogue._count?.products || 0}
                      </span>
                    </div>

                    {/* File */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">File:</span>
                      {catalogue.fileUrl ? (
                        <a
                          href={catalogue.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 text-sm"
                        >
                          <ExternalLink size={12} />
                          <span>View</span>
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">No file</span>
                      )}
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(catalogue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {catalogues.length}
                </div>
                <div className="text-sm text-blue-600">Total Catalogues</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {catalogues.reduce(
                    (acc, cat) => acc + (cat._count?.products || 0),
                    0
                  )}
                </div>
                <div className="text-sm text-green-600">Total Products</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {catalogues.filter((cat) => cat.fileUrl).length}
                </div>
                <div className="text-sm text-purple-600">With Files</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
