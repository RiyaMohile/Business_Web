"use client";

import { Loader2 } from "lucide-react";
import { Address } from "../types";

interface EditAddressFormProps {
  address: Address;
  onChange: (address: Address) => void;
  onUpdate: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function EditAddressForm({
  address,
  onChange,
  onUpdate,
  onCancel,
  loading,
}: EditAddressFormProps) {
  const updateField = (
    field: keyof Address,
    value: string | boolean
  ) => {
    onChange({
      ...address,
      [field]: value,
    });
  };

  return (
    <div className="mt-5 border border-blue-200 rounded-2xl p-6 bg-blue-50">
      <div className="flex justify-between items-center mb-5">
        <h4 className="text-lg font-semibold text-gray-900">
          Edit Address
        </h4>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* NAME */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Name
          </label>

          <input
            type="text"
            value={address.name ?? ""}
            onChange={(e) =>
              updateField("name", e.target.value)
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-500"
          />
        </div>

        {/* STREET */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={address.street ?? ""}
            onChange={(e) =>
              updateField("street", e.target.value)
            }
            placeholder="e.g. City Center Road"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-500"
          />
        </div>

        {/* AREA */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area / Locality <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={address.area ?? ""}
            onChange={(e) =>
              updateField("area", e.target.value)
            }
            placeholder="e.g. Thatipur"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-500"
          />
        </div>

        {/* CITY */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>

          <input
            type="text"
            value={address.city ?? ""}
            onChange={(e) =>
              updateField("city", e.target.value)
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-500"
          />
        </div>

        {/* STATE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>

          <input
            type="text"
            value={address.state ?? ""}
            onChange={(e) =>
              updateField("state", e.target.value)
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-500"
          />
        </div>

        {/* COUNTRY */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>

          <input
            type="text"
            value={address.country ?? ""}
            onChange={(e) =>
              updateField("country", e.target.value)
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-500"
          />
        </div>

        {/* PIN CODE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pin Code
          </label>

          <input
            type="text"
            value={address.pinCode ?? ""}
            onChange={(e) =>
              updateField("pinCode", e.target.value)
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-6">

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-5 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onUpdate}
          disabled={
            loading ||
            !address.street?.trim() ||
            !address.area?.trim()
          }
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2
                size={18}
                className="animate-spin"
              />
              Updating...
            </span>
          ) : (
            "Update Address"
          )}
        </button>

      </div>
    </div>
  );
}