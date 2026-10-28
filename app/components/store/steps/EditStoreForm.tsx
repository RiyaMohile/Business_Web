"use client";

import { useEffect, useState } from "react";
import { getCategories } from "../../../services/categoryApi";
import { updateStore,updateStoreAddress } from "../../../services/businessStoreApi";
import axios from "axios";

import {
  Loader2,
  MapPin,
  Plus,
} from "lucide-react";

import SavedAddressCard from "./SavedAddressCard";

import CreateAddressForm, {
  NewAddress,
} from "./CreateAddressForm";

import EditAddressForm from "./EditAddressForm";

import { Address } from "../types";

interface EditStoreFormProps {
  store: any;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditStoreForm({
  store,
  onClose,
  onUpdated,
}: EditStoreFormProps) {
  const [loadingCategories, setLoadingCategories] =
    useState(false);

  const [categories, setCategories] = useState<string[]>([]);

  const [storeName, setStoreName] = useState(
    store?.storeName || ""
  );

  const [category, setCategory] = useState(
    store?.category || ""
  );

  const [gstNumber, setGstNumber] = useState(
    store?.gstNumber || ""
  );

 

  const [workingFrom, setWorkingFrom] =
    useState(
      store?.workingDays?.from || ""
    );

  const [workingTo, setWorkingTo] =
    useState(
      store?.workingDays?.to || ""
    );

  const [openingFrom, setOpeningFrom] =
    useState(
      store?.openingHours?.from || ""
    );

  const [openingTo, setOpeningTo] =
    useState(
      store?.openingHours?.to || ""
    );

  const [phoneContactId, setPhoneContactId] =
    useState(
      store?.phoneContactId || ""
    );

  const [mailContactId, setMailContactId] =
    useState(
      store?.mailContactId ||
        store?.emailId ||
        ""
    );

    const [addressId, setAddressId] = useState(
  store.address?.addressId || ""
);

const [area, setArea] = useState(
  store.address?.area || ""
);

const [city, setCity] = useState(
  store.address?.city || ""
);

const [loading, setLoading] = useState(false);

const API_URL =
  "https://api.thover.in/v1/api";

const INITIAL_ADDRESS: NewAddress = {
  name: "",
  street: "",
  area: "",
  city: "",
  state: "",
  country: "",
  pinCode: "",
  latitude: "",
  longitude: "",
  isPrimary: false,
};

const [addresses, setAddresses] =
  useState<Address[]>([]);

const [loadingAddresses, setLoadingAddresses] =
  useState(false);

const [creatingAddress, setCreatingAddress] =
  useState(false);

const [showAddAddress, setShowAddAddress] =
  useState(false);

const [newAddress, setNewAddress] =
  useState<NewAddress>(INITIAL_ADDRESS);

const [selectedAddressId, setSelectedAddressId] =
  useState(
    store?.address?.addressId?._id ||
    store?.address?.addressId ||
    ""
  );

  useEffect(() => {
  fetchAddresses();
}, []);

const fetchAddresses = async () => {
  try {
    setLoadingAddresses(true);

    const token =
      localStorage.getItem("token");

    const { data } = await axios.get(
      `${API_URL}/address/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAddresses(data?.data || []);
  } catch (error: any) {
    console.error(
      "GET ADDRESSES ERROR:",
      error.response?.data ||
        error.message
    );
  } finally {
    setLoadingAddresses(false);
  }
};



  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const response = await getCategories();

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
  // UPDATE STORE
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!store?._id) {
      alert("Store ID is missing.");
      return;
    }

    if (!storeName.trim()) {
      alert("Store name is required.");
      return;
    }

    if (!category) {
      alert("Category is required.");
      return;
    }

    if (!workingFrom || !workingTo) {
      alert("Working days are required.");
      return;
    }

    if (!openingFrom || !openingTo) {
      alert("Opening hours are required.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        storeName: storeName.trim(),

        category,

        gstNumber: gstNumber.trim(),

        address: {
          addressId,
          area: area.trim(),
          city: city.trim(),
        },

        workingDays: {
          from: workingFrom,
          to: workingTo,
        },

        openingHours: {
          from: openingFrom,
          to: openingTo,
        },

        phoneContactId:
          phoneContactId || undefined,

        mailContactId:
          mailContactId || undefined,
      };

      console.log(
        "UPDATE STORE PAYLOAD:",
        payload
      );

      const response = await updateStore(
        store._id,
        payload
      );

      console.log(
        "UPDATE STORE RESPONSE:",
        response
      );

      if (response?.success) {
        alert("Store updated successfully.");

        onUpdated();
        onClose();
      } else {
        alert(
          response?.message ||
            "Unable to update store."
        );
      }
    } catch (error: any) {
      console.error(
        "UPDATE STORE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update store."
      );
    } finally {
      setLoading(false);
    }
  };

// const handleAddressUpdate = async () => {
//   if (!store?._id) {
//     alert("Store not found");
//     return;
//   }

//   if (!addressId) {
//     alert("Address ID is required");
//     return;
//   }

//   if (!area.trim()) {
//     alert("Area is required");
//     return;
//   }

//   if (!city.trim()) {
//     alert("City is required");
//     return;
//   }

//   try {
//     setLoading(true);

//     const response = await updateStoreAddress(
//       store._id,
//       addressId,
//       area.trim(),
//       city.trim()
//     );

//     console.log(
//       "UPDATE ADDRESS RESPONSE:",
//       response
//     );

//     if (response?.success) {
//       alert("Store address updated successfully");

//       onUpdated();
//     } else {
//       alert(
//         response?.message ||
//           "Unable to update store address"
//       );
//     }
//   } catch (error: any) {
//     console.error(
//       "UPDATE ADDRESS ERROR:",
//       error.response?.data || error.message
//     );

//     alert(
//       error.response?.data?.message ||
//         "Unable to update store address"
//     );
//   } finally {
//     setLoading(false);
//   }
// };

const handleSelectAddress = async (
  address: Address
) => {
  if (!store?._id) return;

  try {
    setLoading(true);

    const response = await updateStoreAddress(
  store._id,
  address._id,
  address.area || "",
  address.city || ""
);

    if (response?.success) {
      setSelectedAddressId(address._id);

      alert(
        "Store address updated successfully."
      );

      // Parent store data refresh
      onUpdated();
    }
  } catch (error: any) {
    console.error(
      "UPDATE STORE ADDRESS ERROR:",
      error.response?.data ||
        error.message
    );

    alert(
      error.response?.data?.message ||
        "Unable to update store address."
    );
  } finally {
    setLoading(false);
  }
};

const handleCreateAddress = async () => {
  if (!newAddress.name.trim()) {
    alert("Please enter address name.");
    return;
  }

  if (!newAddress.street.trim()) {
    alert("Please enter street.");
    return;
  }

  if (!newAddress.area.trim()) {
    alert("Please enter area / locality.");
    return;
  }

  if (
    !newAddress.latitude ||
    !newAddress.longitude
  ) {
    alert(
      "Please click Use My Current Location first."
    );
    return;
  }

  try {
    setCreatingAddress(true);

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    const payload = {
  name: newAddress.name.trim(),
  street: newAddress.street.trim(),
  area: newAddress.area.trim(),

  city: newAddress.city.trim(),
  state: newAddress.state.trim(),
  country: newAddress.country.trim(),
  pinCode: newAddress.pinCode.trim(),

  latitude: Number(newAddress.latitude),
  longitude: Number(newAddress.longitude),

  isPrimary: newAddress.isPrimary,
};

    const { data } = await axios.post(
      `${API_URL}/address/location`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":
            "application/json",
        },
      }
    );

    const createdAddress =
      data?.data;

    if (!createdAddress?._id) {
      throw new Error(
        "Invalid create address response."
      );
    }

    // Add to address list
    setAddresses((previous) => [
      createdAddress,
      ...previous,
    ]);

    // ==============================
    // SELECT NEW ADDRESS FOR STORE
    // ==============================

    await handleSelectAddress(
      createdAddress
    );

    setNewAddress(INITIAL_ADDRESS);

    setShowAddAddress(false);

  } catch (error: any) {
    console.error(
      "CREATE ADDRESS ERROR:",
      error.response?.data ||
        error.message
    );

    alert(
      error.response?.data?.message ||
        "Unable to create address."
    );
  } finally {
    setCreatingAddress(false);
  }
};

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-start justify-center p-4 pt-6 md:items-center">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl h-[85vh] flex flex-col overflow-hidden mb-24 md:mb-0">

        {/* HEADER */}

        <div className="p-6 border-b flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-2xl font-bold">
              Edit Store
            </h2>

            <p className="text-gray-500 mt-1">
              Update your store details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-900 text-3xl"
          >
            ×
          </button>
        </div>

        {/* FORM */}

        <form
  onSubmit={handleSubmit}
  className="flex-1 overflow-y-auto p-8 space-y-6"
>

          {/* STORE NAME */}

          <div>
            <label className="block font-medium mb-2">
              Store Name
            </label>

            <input
              type="text"
              value={storeName}
              onChange={(e) =>
                setStoreName(e.target.value)
              }
              placeholder="Enter store name"
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:border-blue-500"
            />
          </div>

          {/* CATEGORY */}

          <div>
            <label className="block font-medium mb-2">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              disabled={loadingCategories}
              className="w-full border border-gray-300 rounded-xl p-4 bg-white outline-none focus:border-blue-500"
            >
              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : "Select Category"}
              </option>

              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </div>

          {/* GST */}

          <div>
            <label className="block font-medium mb-2">
              GST Number
            </label>

            <input
              type="text"
              value={gstNumber}
              onChange={(e) =>
                setGstNumber(e.target.value)
              }
              placeholder="GST Number"
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:border-blue-500"
            />
          </div>

          {/* ADDRESS */}

{/* ==========================================
    STORE ADDRESS
========================================== */}

<div className="space-y-4">

  <div>
    <h3 className="text-lg font-semibold text-gray-900">
      Store Address
    </h3>

    <p className="mt-1 text-sm text-gray-500">
      Select an existing address or add a new one.
    </p>
  </div>

  {/* ==============================
      SAVED ADDRESSES
  ============================== */}

  {loadingAddresses ? (
    <div className="flex justify-center py-8">
      <Loader2
        size={28}
        className="animate-spin text-blue-600"
      />
    </div>
  ) : addresses.length === 0 ? (
    <div className="rounded-2xl border border-gray-200 p-6 text-center">
      <MapPin
        size={36}
        className="mx-auto mb-3 text-gray-400"
      />

      <p className="text-sm text-gray-500">
        No saved addresses found.
      </p>
    </div>
  ) : (
    <div className="space-y-3">

      {addresses
        .filter(
          (address) =>
            address.area?.trim()
        )
        .map((address) => (
          <SavedAddressCard
            key={address._id}
            address={address}
            selected={
              selectedAddressId ===
              address._id
            }
            onSelect={
              handleSelectAddress
            }
            onEdit={() => {}}
          />
        ))}

    </div>
  )}

  {/* ==============================
      ADD NEW ADDRESS
  ============================== */}

  <button
    type="button"
    onClick={() =>
      setShowAddAddress(true)
    }
    className="
      w-full
      rounded-2xl
      border-2
      border-dashed
      border-gray-300
      p-5
      transition
      hover:border-blue-400
      hover:bg-gray-50
    "
  >
    <div className="flex items-center justify-center gap-2">

      <Plus
        size={22}
        className="text-blue-600"
      />

      <span className="font-semibold text-gray-700">
        Add New Address
      </span>

    </div>
  </button>

</div>

          {/* WORKING DAYS */}

          <div>
            <label className="block font-medium mb-2">
              Working Days
            </label>

            <div className="grid grid-cols-2 gap-4">

              <select
                value={workingFrom}
                onChange={(e) =>
                  setWorkingFrom(
                    e.target.value
                  )
                }
                className="border border-gray-300 rounded-xl p-4 bg-white"
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
                value={workingTo}
                onChange={(e) =>
                  setWorkingTo(
                    e.target.value
                  )
                }
                className="border border-gray-300 rounded-xl p-4 bg-white"
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

          {/* OPENING HOURS */}

          <div>
            <label className="block font-medium mb-2">
              Opening Hours
            </label>

            <div className="grid grid-cols-2 gap-4">

              <input
                type="time"
                value={openingFrom}
                onChange={(e) =>
                  setOpeningFrom(
                    e.target.value
                  )
                }
                className="border border-gray-300 rounded-xl p-4"
              />

              <input
                type="time"
                value={openingTo}
                onChange={(e) =>
                  setOpeningTo(
                    e.target.value
                  )
                }
                className="border border-gray-300 rounded-xl p-4"
              />

            </div>
          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 pt-4 border-t">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300"
            >
              {loading
                ? "Updating..."
                : "Update Store"}
            </button>

          </div>

        </form>
      </div>
      {showAddAddress && (
  <div
    className="
      fixed
      inset-0
      z-[999]
      flex
      items-center
      justify-center
      bg-black/50
      p-4
    "
  >

    <div
      className="
        w-full
        max-w-2xl
        max-h-[90vh]
        overflow-y-auto
        rounded-2xl
        bg-white
        shadow-2xl
      "
    >

      <CreateAddressForm
        address={newAddress}
        setAddress={setNewAddress}
        onSave={handleCreateAddress}
        onCancel={() => {
          setShowAddAddress(false);
          setNewAddress(
            INITIAL_ADDRESS
          );
        }}
        loading={creatingAddress}
      />

    </div>

  </div>
)}
    </div>
  );
}