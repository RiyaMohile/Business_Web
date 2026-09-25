"use client";

import {
  Loader2,
  MapPin,
  Navigation,
  X,
} from "lucide-react";

import { useState } from "react";

interface AddressModalProps {
  onSuccess: (addressId: string) => void;
}

interface AddressForm {
  name: string;
  street: string;
  area: string;
  latitude: string;
  longitude: string;
  isPrimary: boolean;
}

const API_URL =
  "https://api.thover.in/v1/api";

const INITIAL_ADDRESS: AddressForm = {
  name: "",
  street: "",
  area: "",
  latitude: "",
  longitude: "",
  isPrimary: true,
};

export default function AddressModal({
  onSuccess,
}: AddressModalProps) {
  const [address, setAddress] =
    useState<AddressForm>(
      INITIAL_ADDRESS
    );

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [detectedLocation, setDetectedLocation] =
    useState("");

  const updateField = (
    field: keyof AddressForm,
    value: string | boolean
  ) => {
    setAddress((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ==========================================
  // CURRENT LOCATION
  // ==========================================

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

        try {
          // ==========================================
          // REVERSE GEOCODING
          // ==========================================

          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          const data =
            await response.json();

          // ==========================================
          // PINCODE
          // ==========================================

          const pinResponse =
            await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
            );

          const pinData =
            await pinResponse.json();

          const pinCode =
            pinData?.address?.postcode || "";

          const city =
            data?.city ||
            data?.locality ||
            "";

          const state =
            data?.principalSubdivision ||
            "";

          const country =
            data?.countryName ||
            "";

          const locationParts = [
            city,
            state,
            country,
            pinCode,
          ].filter(Boolean);

          setDetectedLocation(
            locationParts.join(", ")
          );

          setAddress((previous) => ({
            ...previous,

            latitude: String(latitude),
            longitude: String(longitude),

            area:
              previous.area ||
              data?.locality ||
              city,
          }));

          alert(
            "Location detected successfully."
          );
        } catch (error) {
          console.error(
            "LOCATION ERROR:",
            error
          );

          setAddress((previous) => ({
            ...previous,
            latitude: String(latitude),
            longitude: String(longitude),
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
          "GEOLOCATION ERROR:",
          error
        );

        setLocationLoading(false);

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

  // ==========================================
  // SAVE ADDRESS
  // ==========================================

  const handleSave = async () => {
    if (!address.name.trim()) {
      alert("Please enter address name.");
      return;
    }

    if (!address.street.trim()) {
      alert("Please enter street.");
      return;
    }

    if (!address.area.trim()) {
      alert("Please enter area / locality.");
      return;
    }

    if (
      !address.latitude ||
      !address.longitude
    ) {
      alert(
        "Please use your current location first."
      );
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const payload = {
        name: address.name.trim(),
        street: address.street.trim(),
        area: address.area.trim(),

        latitude: Number(
          address.latitude
        ),

        longitude: Number(
          address.longitude
        ),

        isPrimary:
          address.isPrimary,
      };

      console.log(
        "CREATE ADDRESS PAYLOAD:",
        payload
      );

      const response = await fetch(
        `${API_URL}/address/location`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data =
        await response.json();

      console.log(
        "CREATE ADDRESS RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to create address."
        );
      }

      if (!data?.data?._id) {
  throw new Error(
    "Invalid address response."
  );
}

const newAddressId = data.data._id;

alert(
  "Address saved successfully."
);

// Send newly created address ID
// to ProductsPage
onSuccess(newAddressId);
    } catch (error: any) {
      console.error(
        "SAVE ADDRESS ERROR:",
        error
      );

      alert(
        error?.message ||
          "Unable to save address."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

      <div className="w-full max-w-[430px] overflow-hidden rounded-[28px] bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Add your location
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Add your address to see products
              available near you.
            </p>
          </div>

          {/* Intentionally no close button.
              Address is required. */}

        </div>

        {/* CONTENT */}

        <div className="max-h-[75vh] overflow-y-auto p-5">

          {/* LOCATION BUTTON */}

          <button
            type="button"
            onClick={
              getCurrentLocation
            }
            disabled={
              locationLoading ||
              saving
            }
            className="
              w-full
              rounded-2xl
              border-2
              border-dashed
              border-[#C4B5FD]
              bg-[#F5F3FF]
              p-5
              text-[#6D28D9]
              transition
              hover:bg-[#EDE9FE]
              disabled:opacity-60
            "
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
              <span className="flex flex-col items-center gap-2">

                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6D28D9] text-white">

                  <Navigation
                    size={20}
                  />

                </span>

                <span className="text-sm font-semibold">
                  Use My Current Location
                </span>

                <span className="text-xs text-slate-500">
                  We'll use your location to
                  show nearby stores
                </span>

              </span>
            )}

          </button>

          {/* DETECTED LOCATION */}

          {detectedLocation && (
            <div className="mt-4 flex gap-3 rounded-xl bg-green-50 p-3">

              <MapPin
                size={18}
                className="mt-0.5 shrink-0 text-green-600"
              />

              <div>

                <p className="text-xs font-semibold text-green-700">
                  Location detected
                </p>

                <p className="mt-1 text-xs leading-5 text-green-700">
                  {detectedLocation}
                </p>

              </div>

            </div>
          )}

          {/* FORM */}

          <div className="mt-5 space-y-4">

            {/* ADDRESS NAME */}

            <div>

              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Address Name
              </label>

              <input
                type="text"
                value={address.name}
                onChange={(e) =>
                  updateField(
                    "name",
                    e.target.value
                  )
                }
                placeholder="Home"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  text-sm
                  outline-none
                  focus:border-[#6D28D9]
                  focus:ring-4
                  focus:ring-purple-100
                "
              />

            </div>

            {/* STREET */}

            <div>

              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Street
              </label>

              <input
                type="text"
                value={address.street}
                onChange={(e) =>
                  updateField(
                    "street",
                    e.target.value
                  )
                }
                placeholder="e.g. City Center Road"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  text-sm
                  outline-none
                  focus:border-[#6D28D9]
                  focus:ring-4
                  focus:ring-purple-100
                "
              />

            </div>

            {/* AREA */}

            <div>

              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Area / Locality
              </label>

              <input
                type="text"
                value={address.area}
                onChange={(e) =>
                  updateField(
                    "area",
                    e.target.value
                  )
                }
                placeholder="e.g. Thatipur"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  text-sm
                  outline-none
                  focus:border-[#6D28D9]
                  focus:ring-4
                  focus:ring-purple-100
                "
              />

            </div>

          </div>

          {/* INFO */}

          <div className="mt-5 rounded-xl bg-slate-50 p-3">

            <p className="text-xs leading-5 text-slate-500">
              📍 Your location helps us show
              products and stores available
              near you.
            </p>

          </div>

          {/* SAVE */}

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              locationLoading ||
              !address.name.trim() ||
              !address.street.trim() ||
              !address.area.trim() ||
              !address.latitude ||
              !address.longitude
            }
            className="
              mt-5
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-[#7C3AED]
              to-[#5B21B6]
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-purple-200
              transition
              hover:-translate-y-0.5
              disabled:cursor-not-allowed
              disabled:bg-slate-300
              disabled:bg-none
              disabled:shadow-none
            "
          >

            {saving ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Saving Address...
              </>
            ) : (
              "Save & Continue"
            )}

          </button>

        </div>

      </div>

    </div>
  );
}