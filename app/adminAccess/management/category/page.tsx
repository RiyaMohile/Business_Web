"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  FolderTree,
  Plus,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Category,
  getAllCategories,
  addCategory,
  deleteCategory,
  updateCategoryMedia,
} from "../../../services/categoryService";

export default function CategoryManagementPage() {
  const router = useRouter();

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [category, setCategory] =
    useState("");

  const [subCategory, setSubCategory] =
    useState("");

  const [examples, setExamples] =
    useState("");

  const [uploadingId, setUploadingId] =
    useState<string | null>(null);


  /* =====================================================
     FETCH CATEGORIES
  ===================================================== */

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAllCategories();

      if (response?.success) {
        setCategories(
          response.data || []
        );
      } else {
        setError(
          response?.message ||
            "Unable to fetch categories"
        );
      }

    } catch (error: any) {
      console.error(
        "GET CATEGORIES ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCategories();
  }, []);


  /* =====================================================
     ADD CATEGORY
  ===================================================== */

  const handleAddCategory = async () => {
    if (!category.trim()) {
      alert("Category is required");
      return;
    }

    if (!subCategory.trim()) {
      alert("SubCategory is required");
      return;
    }

    try {
      setSubmitting(true);

      const exampleArray = examples
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const response =
        await addCategory({
          category: category.trim(),
          subCategory:
            subCategory.trim(),
          examples: exampleArray,
        });

      if (!response?.success) {
        alert(
          response?.message ||
            "Unable to add category"
        );
        return;
      }

      alert("Category added successfully");

      setCategory("");
      setSubCategory("");
      setExamples("");

      setShowAddModal(false);

      await fetchCategories();

    } catch (error: any) {
      console.error(
        "ADD CATEGORY ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Unable to add category"
      );
    } finally {
      setSubmitting(false);
    }
  };


  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (
    item: Category
  ) => {
    const confirmed = window.confirm(
      `Delete "${item.category} / ${item.subCategory}"?`
    );

    if (!confirmed) return;

    try {
      const response =
        await deleteCategory(
          item.category,
          item.subCategory
        );

      if (!response?.success) {
        alert(
          response?.message ||
            "Unable to delete category"
        );
        return;
      }

      await fetchCategories();

    } catch (error: any) {
      console.error(
        "DELETE CATEGORY ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Unable to delete category"
      );
    }
  };


  /* =====================================================
     MEDIA UPLOAD
  ===================================================== */

  const handleMediaUpload = async (
    item: Category,
    file: File
  ) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image");
      return;
    }

    try {
      setUploadingId(item._id);

      const response =
        await updateCategoryMedia(
          item.category,
          item.subCategory,
          file
        );

      if (!response?.success) {
        alert(
          response?.message ||
            "Unable to upload image"
        );
        return;
      }

      await fetchCategories();

    } catch (error: any) {
      console.error(
        "UPLOAD CATEGORY MEDIA ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Unable to upload image"
      );
    } finally {
      setUploadingId(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };


  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
            </button>

            <div>

              <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
                Category Management
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage categories and subcategories
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={() =>
              setShowAddModal(true)
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Category
          </button>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}


        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2">

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-gray-400">
                  Total Categories
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {categories.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FolderTree size={22} />
              </div>

            </div>

          </div>


          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <div>
              <p className="text-xs font-medium text-gray-400">
                With Media
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {
                  categories.filter(
                    (item) =>
                      item.media?.mediaUrl
                  ).length
                }
              </p>
            </div>

          </div>

        </div>


        {/* =================================================
            CATEGORY TABLE
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              Categories
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              {categories.length} records found
            </p>
          </div>


          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <div className="text-center">

                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                <p className="text-sm text-gray-500">
                  Loading categories...
                </p>

              </div>
            </div>
          ) : categories.length === 0 ? (

            <div className="flex min-h-[250px] flex-col items-center justify-center text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <FolderTree
                  size={25}
                  className="text-gray-400"
                />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-gray-800">
                No categories found
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Add your first category.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <div className="min-w-[1000px]">

                {/* HEADER */}

                <div className="grid grid-cols-[1.2fr_1.3fr_2fr_1.2fr_1.5fr] border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">

                  <span>Category</span>
                  <span>SubCategory</span>
                  <span>Examples</span>
                  <span>Media</span>
                  <span>Actions</span>

                </div>


                {/* ROWS */}

                {categories.map((item) => (

                  <div
                    key={item._id}
                    className="grid grid-cols-[1.2fr_1.3fr_2fr_1.2fr_1.5fr] items-center border-b border-gray-100 px-5 py-4 last:border-b-0 hover:bg-gray-50"
                  >

                    {/* CATEGORY */}

                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.category}
                      </p>
                    </div>


                    {/* SUBCATEGORY */}

                    <div>
                      <p className="text-sm text-gray-700">
                        {item.subCategory}
                      </p>
                    </div>


                    {/* EXAMPLES */}

                    <div className="flex flex-wrap gap-1.5">

                      {item.examples?.length ? (
                        item.examples.map(
                          (example, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                            >
                              {example}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-xs text-gray-400">
                          No examples
                        </span>
                      )}

                    </div>


                    {/* MEDIA */}

                    <div>

                      {item.media?.mediaUrl ? (

                        <div className="flex items-center gap-2">

                          <img
                            src={
                              item.media.mediaUrl
                            }
                            alt={
                              item.subCategory
                            }
                            className="h-12 w-12 rounded-lg object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              fileInputRef.current?.click()
                            }
                            className="text-xs font-medium text-blue-600 hover:text-blue-700"
                          >
                            Change
                          </button>

                        </div>

                      ) : (

                        <div className="flex items-center gap-2">

                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                            <ImageIcon
                              size={18}
                              className="text-gray-400"
                            />
                          </div>

                          <span className="text-xs text-gray-400">
                            No image
                          </span>

                        </div>

                      )}

                    </div>


                   {/* MEDIA */}
<div>
  {item.media?.mediaUrl ? (
    <img
      src={item.media.mediaUrl}
      alt={item.subCategory}
      className="h-12 w-12 rounded-lg object-cover"
    />
  ) : (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
      <ImageIcon
        size={18}
        className="text-gray-400"
      />
    </div>
  )}
</div>

{/* ACTIONS */}
<div className="flex items-center gap-2">

  <label
    className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 ${
      uploadingId === item._id
        ? "pointer-events-none opacity-50"
        : ""
    }`}
  >
    <Upload size={14} />

    {uploadingId === item._id
      ? "Uploading..."
      : "Update Media"}

    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file =
          e.target.files?.[0];

        if (file) {
          handleMediaUpload(
            item,
            file
          );
        }

        e.currentTarget.value = "";
      }}
    />
  </label>

  <button
    type="button"
    onClick={() =>
      handleDelete(item)
    }
    className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
  >
    <Trash2 size={14} />
    Delete
  </button>

</div>

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>

      </div>


      {/* =================================================
          ADD CATEGORY MODAL
      ================================================= */}

      {showAddModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add Category
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Create a category and subcategory
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddModal(false)
                }
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>

            </div>


            {/* FORM */}

            <div className="space-y-5 p-6">

              <div>

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <input
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Fashion"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />

              </div>


              <div>

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  SubCategory
                </label>

                <input
                  value={subCategory}
                  onChange={(e) =>
                    setSubCategory(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Men's Clothing"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />

              </div>


              <div>

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Examples
                </label>

                <input
                  value={examples}
                  onChange={(e) =>
                    setExamples(
                      e.target.value
                    )
                  }
                  placeholder="Shirt, T-Shirt, Jeans"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />

                <p className="mt-1.5 text-xs text-gray-400">
                  Separate multiple examples with commas.
                </p>

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={
                    handleAddCategory
                  }
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Adding..."
                    : "Add Category"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}