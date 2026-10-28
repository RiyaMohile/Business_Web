"use client";

import { useState } from "react";
import axios from "axios";

interface CreateStoreDialogProps {
  onCreated: () => void;
}

export default function CreateStoreDialog({
  onCreated,
}: CreateStoreDialogProps) {

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    address: "",

    storeName: "",
    category: "",
    gstNumber: "",

    workingDays: {
      from: "",
      to: "",
    },

    openingHours: {
      from: "",
      to: "",
    },
  });

  // =========================
  // Step 1
  // =========================

  const handleNext = () => {

    if (!form.email.trim()) {
      alert("Email address is required");
      return;
    }

    if (!form.address.trim()) {
      alert("Address is required");
      return;
    }

    // Don't call API here
    setStep(2);
  };


  // =========================
  // Step 2
  // =========================

  const createStore = async () => {

    if (!form.storeName.trim()) {
      alert("Store name is required");
      return;
    }

    if (!form.category.trim()) {
      alert("Category is required");
      return;
    }

    if (!form.workingDays.from || !form.workingDays.to) {
      alert("Working days are required");
      return;
    }

    if (!form.openingHours.from || !form.openingHours.to) {
      alert("Opening hours are required");
      return;
    }

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://api.thover.in/v1/api/store/create",
        {
          email: form.email,
          address: form.address,

          storeName: form.storeName,
          category: form.category,
          gstNumber: form.gstNumber,

          workingDays: {
            from: form.workingDays.from,
            to: form.workingDays.to,
          },

          openingHours: {
            from: form.openingHours.from,
            to: form.openingHours.to,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("STORE CREATED:", response.data);

      alert("Store created successfully!");

      onCreated();

    } catch (error: any) {

      console.log(
        "CREATE STORE ERROR:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        "Unable to create store"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">

      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl">

        {/* ================= HEADER ================= */}

        <div className="px-8 pt-8">

          <h2 className="text-3xl font-bold text-gray-900">
            Create Your Store
          </h2>

          <p className="text-gray-500 mt-2">
            {step === 1
              ? "First, provide your contact and business address."
              : "Now provide your store details."
            }
          </p>

          {/* Step Indicator */}

          <div className="flex items-center gap-3 mt-6">

            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${
                step === 1
                  ? "bg-blue-600 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              1
            </div>

            <div className="flex-1 h-1 bg-gray-200">
              <div
                className={`h-full ${
                  step === 2
                    ? "bg-blue-600 w-full"
                    : "bg-gray-200 w-0"
                }`}
              />
            </div>

            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${
                step === 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </div>

          </div>

        </div>


        {/* ================= STEP 1 ================= */}

        {step === 1 && (

          <div className="p-8">

            {/* Email */}

            <div>

              <label className="block font-medium mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder="Enter email address"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* Address */}

            <div className="mt-6">

              <label className="block font-medium mb-2">
                Business Address <span className="text-red-500">*</span>
              </label>

              <textarea
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: e.target.value,
                  })
                }
                placeholder="Enter complete business address"
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />

            </div>


            {/* Next */}

            <button
              type="button"
              onClick={handleNext}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold"
            >
              Continue
            </button>

          </div>

        )}


        {/* ================= STEP 2 ================= */}

        {step === 2 && (

          <div className="p-8">

            {/* Store Name */}

            <div>

              <label className="block font-medium mb-2">
                Store Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={form.storeName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    storeName: e.target.value,
                  })
                }
                placeholder="Enter store name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* Category */}

            <div className="mt-5">

              <label className="block font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
                placeholder="e.g. Clothing, Electronics, Grocery"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* GST */}

            <div className="mt-5">

              <label className="block font-medium mb-2">
                GST Number
              </label>

              <input
                type="text"
                value={form.gstNumber}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gstNumber: e.target.value,
                  })
                }
                placeholder="Enter GST number (optional)"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* Working Days */}

            <div className="mt-5">

              <label className="block font-medium mb-2">
                Working Days <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-2 gap-4">

                <select
                  value={form.workingDays.from}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      workingDays: {
                        ...form.workingDays,
                        from: e.target.value,
                      },
                    })
                  }
                  className="border border-gray-300 rounded-xl px-4 py-3"
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


                <select
                  value={form.workingDays.to}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      workingDays: {
                        ...form.workingDays,
                        to: e.target.value,
                      },
                    })
                  }
                  className="border border-gray-300 rounded-xl px-4 py-3"
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


            {/* Opening Hours */}

            <div className="mt-5">

              <label className="block font-medium mb-2">
                Opening Hours <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="time"
                  value={form.openingHours.from}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      openingHours: {
                        ...form.openingHours,
                        from: e.target.value,
                      },
                    })
                  }
                  className="border border-gray-300 rounded-xl px-4 py-3"
                />

                <input
                  type="time"
                  value={form.openingHours.to}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      openingHours: {
                        ...form.openingHours,
                        to: e.target.value,
                      },
                    })
                  }
                  className="border border-gray-300 rounded-xl px-4 py-3"
                />

              </div>

            </div>


            {/* Buttons */}

            <div className="flex gap-4 mt-8">

              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold"
              >
                Back
              </button>

              <button
                type="button"
                onClick={createStore}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold"
              >
                {loading
                  ? "Creating Store..."
                  : "Create Store"
                }
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}