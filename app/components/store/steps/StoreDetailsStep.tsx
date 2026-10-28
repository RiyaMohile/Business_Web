"use client";

import { useEffect, useState } from "react";
import { StoreForm } from "../types";
import { getCategories } from "../../../services/categoryApi";

interface Props {
  form: StoreForm;
  updateForm: (data: Partial<StoreForm>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StoreDetailsStep({
  form,
  updateForm,
  onNext,
  onBack,
}: Props) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] =
    useState(false);

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const response = await getCategories();

      console.log("CATEGORY RESPONSE:", response);

      setCategories(response.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch categories:",
        error
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  fetchCategories();
}, []);

  // ==========================================
  // CONTINUE
  // ==========================================

  const continueNext = () => {
    if (!form.storeName.trim()) {
      alert("Store name is required");
      return;
    }

    if (!form.category) {
      alert("Category is required");
      return;
    }

    if (
      !form.workingDays.from ||
      !form.workingDays.to
    ) {
      alert("Working days are required");
      return;
    }

    if (
      !form.openingHours.from ||
      !form.openingHours.to
    ) {
      alert("Opening hours are required");
      return;
    }

    onNext();
  };

  return (
    <div>
      {/* ==========================================
          HEADING
      ========================================== */}

      <h3 className="text-2xl font-bold">
        Store Details
      </h3>

      <p className="text-gray-500 mt-2">
        Enter your business information.
      </p>

      <div className="mt-8 space-y-5">

        {/* ========================================
            STORE NAME
        ======================================== */}

        <div>
          <label className="block font-medium mb-2">
            Store Name
          </label>

          <input
            type="text"
            placeholder="Enter store name"
            value={form.storeName}
            onChange={(e) =>
              updateForm({
                storeName: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:border-blue-500"
          />
        </div>

        {/* ========================================
            CATEGORY
        ======================================== */}

        <div>
          <label className="block font-medium mb-2">
            Category
          </label>

          <select
            value={form.category}
            onChange={(e) =>
              updateForm({
                category: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-xl p-4 bg-white outline-none focus:border-blue-500"
          >
            <option value="">
              {loadingCategories
                ? "Loading categories..."
                : "Select Category"}
            </option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* ========================================
            GST NUMBER
        ======================================== */}

        <div>
          <label className="block font-medium mb-2">
            GST Number
          </label>

          <input
            type="text"
            placeholder="GST Number"
            value={form.gstNumber}
            onChange={(e) =>
              updateForm({
                gstNumber: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:border-blue-500"
          />
        </div>

        {/* ========================================
            WORKING DAYS
        ======================================== */}

        <div>
          <label className="block font-medium mb-2">
            Working Days
          </label>

          <div className="grid grid-cols-2 gap-4">

            {/* FROM */}

            <select
              value={form.workingDays.from}
              onChange={(e) =>
                updateForm({
                  workingDays: {
                    ...form.workingDays,
                    from: e.target.value,
                  },
                })
              }
              className="border border-gray-300 rounded-xl p-4 outline-none focus:border-blue-500 bg-white"
            >
              <option value="">
                From
              </option>

              <option value="Monday">
                Monday
              </option>

              <option value="Tuesday">
                Tuesday
              </option>

              <option value="Wednesday">
                Wednesday
              </option>

              <option value="Thursday">
                Thursday
              </option>

              <option value="Friday">
                Friday
              </option>

              <option value="Saturday">
                Saturday
              </option>

              <option value="Sunday">
                Sunday
              </option>
            </select>

            {/* TO */}

            <select
              value={form.workingDays.to}
              onChange={(e) =>
                updateForm({
                  workingDays: {
                    ...form.workingDays,
                    to: e.target.value,
                  },
                })
              }
              className="border border-gray-300 rounded-xl p-4 outline-none focus:border-blue-500 bg-white"
            >
              <option value="">
                To
              </option>

              <option value="Monday">
                Monday
              </option>

              <option value="Tuesday">
                Tuesday
              </option>

              <option value="Wednesday">
                Wednesday
              </option>

              <option value="Thursday">
                Thursday
              </option>

              <option value="Friday">
                Friday
              </option>

              <option value="Saturday">
                Saturday
              </option>

              <option value="Sunday">
                Sunday
              </option>
            </select>

          </div>
        </div>

        {/* ========================================
            OPENING HOURS
        ======================================== */}

        <div>
          <label className="block font-medium mb-2">
            Opening Hours
          </label>

          <div className="grid grid-cols-2 gap-4">

            {/* OPENING TIME */}

            <input
              type="time"
              value={form.openingHours.from}
              onChange={(e) =>
                updateForm({
                  openingHours: {
                    ...form.openingHours,
                    from: e.target.value,
                  },
                })
              }
              className="border border-gray-300 rounded-xl p-4 outline-none focus:border-blue-500"
            />

            {/* CLOSING TIME */}

            <input
              type="time"
              value={form.openingHours.to}
              onChange={(e) =>
                updateForm({
                  openingHours: {
                    ...form.openingHours,
                    to: e.target.value,
                  },
                })
              }
              className="border border-gray-300 rounded-xl p-4 outline-none focus:border-blue-500"
            />

          </div>
        </div>

      </div>

      {/* ==========================================
          BUTTONS
      ========================================== */}

      <div className="flex justify-between mt-8">

        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={continueNext}
          disabled={loadingCategories}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300"
        >
          Continue
        </button>

      </div>

    </div>
  );
}