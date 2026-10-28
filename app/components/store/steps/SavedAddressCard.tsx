"use client";

import { Check, MapPin, Pencil } from "lucide-react";
import { Address } from "../types";

interface SavedAddressCardProps {
  address: Address;
  selected: boolean;
  onSelect: (address: Address) => void;
  onEdit: (address: Address) => void;
}

export default function SavedAddressCard({
  address,
  selected,
  onSelect,
  onEdit,
}: SavedAddressCardProps) {
  return (
    <div
      className={`border rounded-2xl p-5 transition-all ${
        selected
          ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
          : "border-gray-200 bg-white hover:border-blue-300"
      }`}
    >
      <div className="flex items-start gap-4">

        {/* SELECT */}
        <button
          type="button"
          onClick={() => onSelect(address)}
          className="flex-1 text-left"
        >
          <div className="flex items-start gap-4">

            {/* RADIO */}
            <div
              className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                selected
                  ? "border-blue-600 bg-blue-600"
                  : "border-gray-300"
              }`}
            >
              {selected && (
                <Check
                  size={13}
                  className="text-white"
                />
              )}
            </div>

            {/* DETAILS */}
            <div className="flex-1">

              {/* NAME + PRIMARY */}
              <div className="flex items-center gap-2 flex-wrap">
                <MapPin
                  size={18}
                  className="text-blue-600"
                />

                <p className="font-semibold text-gray-900">
                  {address.name || "Saved Address"}
                </p>

                {address.isPrimary && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    Primary
                  </span>
                )}
              </div>

              {/* STREET */}
              {address.street && (
                <p className="text-gray-600 mt-2">
                  {address.street}
                </p>
              )}

              {/* AREA / LOCALITY */}
              {address.area && (
                <p className="text-gray-600">
                  {address.area}
                </p>
              )}

              {/* CITY + STATE */}
              <p className="text-gray-600">
                {address.city}
                {address.city && address.state ? ", " : ""}
                {address.state}
              </p>

              {/* COUNTRY + PIN CODE */}
              <p className="text-gray-600">
                {address.country}
                {address.country && address.pinCode ? " - " : ""}
                {address.pinCode}
              </p>

            </div>
          </div>
        </button>

        {/* EDIT */}
        <button
          type="button"
          onClick={() => onEdit(address)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <Pencil size={15} />
          Edit
        </button>
      </div>

      {/* SELECTED */}
      {selected && (
        <div className="mt-3 ml-9 text-xs font-medium text-blue-600">
          Selected
        </div>
      )}
    </div>
  );
}