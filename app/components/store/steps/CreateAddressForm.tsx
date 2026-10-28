"use client";

import { Loader2, MapPin } from "lucide-react";
import type {
  Dispatch,
  SetStateAction,
} from "react";
import { useState } from "react";

export interface NewAddress {
  name: string;
  street: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  latitude: string;
  longitude: string;
  isPrimary: boolean;
}

interface CreateAddressFormProps {
  address: NewAddress;
  setAddress: Dispatch<
    SetStateAction<NewAddress>
  >;
  onSave: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function CreateAddressForm({
  address,
  setAddress,
  onSave,
  onCancel,
  loading,
}: CreateAddressFormProps) {
  const [locationLoading, setLocationLoading] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState("");
  const [locationError, setLocationError] =
  useState("");

  const updateField = (
    field: keyof NewAddress,
    value: string | boolean
  ) => {
    setAddress((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert(
      "Geolocation is not supported by your browser."
    );
    return;
  }

  setLocationLoading(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude =
        position.coords.latitude;

      const longitude =
        position.coords.longitude;

      console.log(
        "========== LOCATION DETECTED =========="
      );

      console.log("LATITUDE:", latitude);
      console.log("LONGITUDE:", longitude);

      try {
        // ==========================================
        // FETCH CITY, STATE, COUNTRY
        // ==========================================

        console.log(
          "Fetching city, state, country..."
        );

        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );

        console.log(
          "REVERSE GEOCODING STATUS:",
          response.status
        );

        const data = await response.json();

        console.log(
          "CITY:",
          data.city
        );

        console.log(
          "STATE:",
          data.principalSubdivision
        );

        console.log(
          "COUNTRY:",
          data.countryName
        );

        // ==========================================
        // FETCH PINCODE
        // ==========================================

        console.log(
          "Fetching pincode from Nominatim..."
        );

        const pinResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
        );

        console.log(
          "NOMINATIM STATUS:",
          pinResponse.status
        );

        const pinData =
          await pinResponse.json();

        const pinCode =
          pinData?.address?.postcode || "";

        console.log(
          "PINCODE:",
          pinCode
        );

        // ==========================================
        // CREATE SMALL LOCATION LINE
        // ==========================================

        const locationParts = [
          data.city,
          data.principalSubdivision,
          data.countryName,
          pinCode,
        ].filter(Boolean);

        setDetectedLocation(
  locationParts.join(", ")
);

setLocationError("");

setAddress((previous) => ({
  ...previous,
  latitude: String(latitude),
  longitude: String(longitude),

  city: data.city || "",
  state: data.principalSubdivision || "",
  country: data.countryName || "",
  pinCode: pinCode || "",
}));

        console.log(
          "DETECTED LOCATION:",
          locationParts.join(", ")
        );

        console.log(
          "===================================="
        );

        alert(
          "Location detected successfully."
        );
      } catch (error) {
        console.error(
          "REVERSE GEOCODING ERROR:",
          error
        );

        setDetectedLocation("");

setLocationError("");

setAddress((previous) => ({
  ...previous,
  city: "",
  state: "",
  country: "",
  pinCode: "",
}));

alert(
  "Location detected, but address details could not be fetched."
);
      } finally {
        setLocationLoading(false);
      }
    },

    (error) => {
      console.error(
        "========== LOCATION ERROR =========="
      );

      console.error(
        "ERROR CODE:",
        error.code
      );

      console.error(
        "ERROR MESSAGE:",
        error.message
      );

      setLocationLoading(false);
      setAddress((previous) => ({
    ...previous,
    latitude: "",
    longitude: "",
  }));

  setLocationError(
    "Can't get location at this place."
  );

      if (error.code === 1) {
        alert(
          "Location permission denied. Please allow location access."
        );
      } else {
        alert(
          "Unable to get your current location."
        );
      }
    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};
  return (
    <div className="p-6">

      <h4 className="text-lg font-semibold text-gray-900 mb-5">
        Add New Address
      </h4>

      {/* CURRENT LOCATION */}

      <button
        type="button"
        onClick={getCurrentLocation}
        disabled={
          locationLoading || loading
        }
        className="w-full mb-6 border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl p-5 transition-all disabled:opacity-60"
      >
        {locationLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2
              size={20}
              className="animate-spin"
            />

            Detecting location...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <MapPin size={20} />

            Use My Current Location
          </span>
        )}
      </button>

{detectedLocation && (
  <p className="mb-5 px-1 text-xs text-slate-500">
    📍 {detectedLocation}
  </p>
)}
{locationError && (
  <p className="mb-5 px-1 text-sm font-medium text-red-600">
    {locationError}
  </p>
)}

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* NAME */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Name
          </label>

          <input
            type="text"
            placeholder="Home"
            value={address.name}
            onChange={(e) =>
              updateField(
                "name",
                e.target.value
              )
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>
        {/* STREET */}

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Street
  </label>

  <input
    type="text"
    placeholder="e.g. City Center Road"
    value={address.street}
    onChange={(e) =>
      updateField("street", e.target.value)
    }
    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
  />
</div>

{/* AREA / LOCALITY */}

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Area / Locality
  </label>

  <input
    type="text"
    placeholder="e.g. Thatipur"
    value={address.area}
    onChange={(e) =>
      updateField("area", e.target.value)
    }
    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
  />
</div>

{/* CITY */}

<div>
  <label className="mb-1 block text-sm font-medium text-gray-700">
    City
  </label>

  <input
    type="text"
    placeholder="e.g. Gwalior"
    value={address.city}
    onChange={(e) =>
      updateField("city", e.target.value)
    }
    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
  />
</div>

{/* STATE */}

<div>
  <label className="mb-1 block text-sm font-medium text-gray-700">
    State
  </label>

  <input
    type="text"
    placeholder="e.g. Madhya Pradesh"
    value={address.state}
    onChange={(e) =>
      updateField("state", e.target.value)
    }
    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
  />
</div>

{/* COUNTRY */}

<div>
  <label className="mb-1 block text-sm font-medium text-gray-700">
    Country
  </label>

  <input
    type="text"
    placeholder="e.g. India"
    value={address.country}
    onChange={(e) =>
      updateField("country", e.target.value)
    }
    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
  />
</div>

{/* PIN CODE */}

<div>
  <label className="mb-1 block text-sm font-medium text-gray-700">
    Pincode
  </label>

  <input
    type="text"
    placeholder="e.g. 474001"
    value={address.pinCode}
    onChange={(e) =>
      updateField("pinCode", e.target.value)
    }
    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
  />
</div>

        
      </div>

      {/* PRIMARY */}

      <div className="flex items-center gap-2 mt-5">

        <input
          id="isPrimary"
          type="checkbox"
          checked={address.isPrimary}
          onChange={(e) =>
            updateField(
              "isPrimary",
              e.target.checked
            )
          }
          className="w-4 h-4"
        />

        <label
          htmlFor="isPrimary"
          className="text-sm text-gray-700"
        >
          Set as primary address
        </label>

      </div>

      {/* ACTIONS */}

      <div className="flex justify-end gap-3 mt-6">

        <button
          type="button"
          onClick={onCancel}
          disabled={
            loading || locationLoading
          }
          className="px-5 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
  type="button"
  onClick={onSave}
  disabled={
    loading ||
    locationLoading ||
    !address.name.trim() ||
    !address.latitude ||
    !address.longitude
  }
  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300"
>
  {loading ? (
    <span className="flex items-center gap-2">
      <Loader2
        size={18}
        className="animate-spin"
      />

      Creating...
    </span>
  ) : (
    "Save Address"
  )}
</button>

      </div>
    </div>
  );
}