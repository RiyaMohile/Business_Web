"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/businessApi";

import SearchCategory from "../components/categories/SearchCategory";
import CategoryTable from "../components/categories/CategoryTable";
import AddCategoryModal from "../components/categories/AddCategoryModal";
import DeleteCategoryModal from "../components/categories/DeleteCategoryModal";
import ViewExamplesModal from "../components/categories/ViewExamplesModal";

interface Category {
  _id: string;
  category: string;
  subCategory: string;
  examples: string[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [showExamplesModal, setShowExamplesModal] =useState(false);

const [selectedCategory, setSelectedCategory] =useState<Category | null>(null);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/category/all");

      setCategories(data.data);
      setFilteredCategories(data.data);

    } catch (err) {
      console.log(err);
      alert("Unable to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const keyword = search.toLowerCase();

    setFilteredCategories(
      categories.filter(
        (item) =>
          item.category
            ?.toLowerCase()
            .includes(keyword) ||
          item.subCategory
            ?.toLowerCase()
            .includes(keyword)
      )
    );
  };

  const deleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await api.delete("/category/delete", {
        data: {
          category: selectedCategory.category,
          subCategory:
            selectedCategory.subCategory,
        },
      });

      alert("Category deleted successfully.");

      setShowDeleteModal(false);
      setSelectedCategory(null);

      fetchCategories();

    } catch (err) {
      console.log(err);
      alert("Unable to delete category.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <main className="ml-0 md:ml-72 flex-1 h-screen overflow-hidden px-4 pb-6 pt-20 md:p-8">

        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">

          <div>

            <h1 className="text-3xl font-bold md:text-4xl">
  Categories
</h1>

            <p className="mt-2 text-gray-500">
  Manage Categories & Sub Categories
</p>

          </div>

          <button
            onClick={() =>
              setShowAddModal(true)
            }
            className="w-full rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 md:w-auto"
          >
            + Add Category
          </button>

        </div>

        <SearchCategory
          value={search}
          onChange={setSearch}
          onSearch={handleSearch}
        />

        <CategoryTable
  categories={filteredCategories}
  loading={loading}
  onDelete={(category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  }}
  onViewExamples={(category) => {
    setSelectedCategory(category);
    setShowExamplesModal(true);
  }}
/>

        <AddCategoryModal
          open={showAddModal}
          onClose={() =>
            setShowAddModal(false)
          }
          onSuccess={() => {
            setShowAddModal(false);
            fetchCategories();
          }}
        />

        <DeleteCategoryModal
          open={showDeleteModal}
          categoryName={
            selectedCategory?.category || ""
          }
          subCategoryName={
            selectedCategory?.subCategory || ""
          }
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedCategory(null);
          }}
          onDelete={deleteCategory}
        />

        <ViewExamplesModal
  open={showExamplesModal}
  category={selectedCategory?.category || ""}
  subCategory={selectedCategory?.subCategory || ""}
  examples={selectedCategory?.examples || []}
  onClose={() => setShowExamplesModal(false)}
/>

      </main>

    </div>
  );
}