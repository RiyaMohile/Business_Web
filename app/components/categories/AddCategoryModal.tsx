"use client";

import { useState } from "react";
import api from "../../services/businessApi";
import ExampleInput from "./ExampleInput";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCategoryModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [examples, setExamples] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const updateExample = (
    index: number,
    value: string
  ) => {
    const arr = [...examples];
    arr[index] = value;
    setExamples(arr);
  };

  const addExample = () => {
    setExamples([...examples, ""]);
  };

  const removeExample = (index: number) => {
    const arr = [...examples];
    arr.splice(index, 1);

    if (arr.length === 0) {
      arr.push("");
    }

    setExamples(arr);
  };

  const saveCategory = async () => {
    if (!category.trim()) {
      alert("Enter category.");
      return;
    }

    if (!subCategory.trim()) {
      alert("Enter sub category.");
      return;
    }

    const finalExamples = examples.filter(
      (item) => item.trim() !== ""
    );

    if (finalExamples.length === 0) {
      alert("Add at least one example.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/category/add", {
        category,
        subCategory,
        examples: finalExamples,
      });

      alert("Category added successfully.");

      setCategory("");
      setSubCategory("");
      setExamples([""]);

      onSuccess();

    } catch (err: any) {
      console.log(err);

      alert(
        err?.response?.data?.message ||
          "Unable to add category."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-[700px] max-h-[90vh] overflow-y-auto p-8">

        <h2 className="text-3xl font-bold">
          Add Category
        </h2>

        {/* Category */}

        <div className="mt-8">

          <label className="font-medium">
            Category
          </label>

          <input
            type="text"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            placeholder="Fashion"
            className="w-full border rounded-xl p-3 mt-2"
          />

        </div>

        {/* Sub Category */}

        <div className="mt-6">

          <label className="font-medium">
            Sub Category
          </label>

          <input
            type="text"
            value={subCategory}
            onChange={(e) =>
              setSubCategory(e.target.value)
            }
            placeholder="Western Wear"
            className="w-full border rounded-xl p-3 mt-2"
          />

        </div>

        {/* Examples */}

        <div className="mt-8">

          <div className="flex justify-between items-center">

            <label className="font-medium text-lg">
              Examples
            </label>

            <button
              onClick={addExample}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              + Add Example
            </button>

          </div>

          <div className="mt-5 space-y-3">

            {examples.map((example, index) => (

              <ExampleInput
                key={index}
                value={example}
                onChange={(value) =>
                  updateExample(index, value)
                }
                onRemove={() =>
                  removeExample(index)
                }
              />

            ))}

          </div>

        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-4 mt-10">

          <button
            onClick={onClose}
            disabled={loading}
            className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={saveCategory}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
          >
            {loading
              ? "Saving..."
              : "Save Category"}
          </button>

        </div>

      </div>

    </div>
  );
}