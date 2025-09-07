"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";
import Link from "next/link";
import { useFormState } from "react-dom";

interface BrandFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: {
    name: string;
    description: string;
    logoUrl: string;
  };
  submitLabel?: string;
}

interface FormState {
  error: string | null;
}

const BrandForm = ({
  action,
  initialData,
  submitLabel = "Create Brand",
}: BrandFormProps) => {
  const [state, formAction] = useFormState(
    async (prevState: FormState, formData: FormData) => {
      try {
        await action(formData);
        return { error: null };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : "An error occurred",
        };
      }
    },
    { error: null }
  );

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    logoUrl: initialData?.logoUrl || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {state.error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Brand Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter brand name"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter brand description (optional)"
          />
        </div>

        <div>
          <label
            htmlFor="logoUrl"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Logo URL
          </label>
          <div className="flex space-x-3">
            <input
              type="url"
              id="logoUrl"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/logo.png"
            />
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Upload logo"
            >
              <Upload size={16} />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Optional: Provide a URL to the brand logo image
          </p>
        </div>

        {formData.logoUrl && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo Preview
            </label>
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.logoUrl}
                alt="Logo preview"
                className="h-20 w-20 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6">
          <Link
            href="/admin/brands"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!formData.name.trim()}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </>
  );
};

export default BrandForm;
