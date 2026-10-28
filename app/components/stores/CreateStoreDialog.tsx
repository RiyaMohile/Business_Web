"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  X,
  Store,
  MapPin,
  Loader2, Plus
} from "lucide-react";
import { getCategories } from "../../services/categoryApi";
import SavedAddressCard from "../store/steps/SavedAddressCard";

import CreateAddressForm, {
  NewAddress,
} from "../store/steps/CreateAddressForm";

interface AddressData {
  _id: string;
  name?: string;
  street?: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
}

interface StoreData {
  _id: string;
  storeId: string;
  storeName: string;
  category?: string;
}

interface CreateStoreDialogProps {
  onCreated: (newStore?: StoreData) => void;
  onClose: () => void;
}

const API_URL = "https://api.thover.in/v2/api";

const ADDRESS_API_URL =
  "https://api.thover.in/v1/api";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function CreateStoreDialog({
  onCreated,
  onClose,
}: CreateStoreDialogProps) {
  const [loading, setLoading] = useState(false);
  const [addressesLoading, setAddressesLoading] =
    useState(false);
    const [categories, setCategories] =
  useState<string[]>([]);

const [loadingCategories, setLoadingCategories] =
  useState(false);

  const [addresses, setAddresses] = useState<
    AddressData[]
  >([]);

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

const [showAddAddress, setShowAddAddress] = useState(false);

const [creatingAddress, setCreatingAddress] = useState(false);

const [newAddress, setNewAddress] =
  useState<NewAddress>(INITIAL_ADDRESS);

  const [form, setForm] = useState({
    storeName: "",
    category: "",
    role: "owner",
    gstNumber: "",

    addressId: "",

    workingDays: {
      from: "",
      to: "",
    },

    openingHours: {
      from: "",
      to: "",
    },
  });

  // ==========================================
  // GET SAVED ADDRESSES
  // ==========================================

  useEffect(() => {
    fetchAddresses();
    fetchCategories();
  }, []);

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const { data } = await axios.get(
        `${ADDRESS_API_URL}/address`,
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
          error.message ||
          error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load addresses."
      );
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleSelectAddress = (address: AddressData) => {
  setForm((prev) => ({
    ...prev,
    addressId: address._id,
  }));
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

  if (!newAddress.latitude || !newAddress.longitude) {
    alert("Please click Use My Current Location first.");
    return;
  }

  try {
    setCreatingAddress(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    const payload = {
      name: newAddress.name.trim(),
      street: newAddress.street.trim(),
      area: newAddress.area.trim(),
      pinCode: newAddress.pinCode.trim(),
      latitude: Number(newAddress.latitude),
      longitude: Number(newAddress.longitude),
      isPrimary: newAddress.isPrimary,
    };

    const { data } = await axios.post(
      `${ADDRESS_API_URL}/address/location`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const createdAddress = data?.data;

    if (!createdAddress?._id) {
      throw new Error("Invalid create address response.");
    }

    // Add newly created address
    setAddresses((previous) => [
      createdAddress,
      ...previous,
    ]);

    // Automatically select new address
    setForm((prev) => ({
      ...prev,
      addressId: createdAddress._id,
    }));

    // Reset form
    setNewAddress(INITIAL_ADDRESS);

    // Close add-address form
    setShowAddAddress(false);

  } catch (error: any) {
    console.error(
      "CREATE ADDRESS ERROR:",
      error.response?.data || error.message
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
// GET CATEGORIES
// ==========================================

const fetchCategories = async () => {
  try {
    setLoadingCategories(true);

    const response = await getCategories();

    console.log(
      "CREATE STORE CATEGORY RESPONSE:",
      response
    );

    setCategories(
      response?.data || []
    );
  } catch (error) {
    console.error(
      "FAILED TO FETCH CATEGORIES:",
      error
    );

    setCategories([]);
  } finally {
    setLoadingCategories(false);
  }
};

  // ==========================================
  // CREATE STORE
  // ==========================================

  const createStore = async () => {
    // ========================================
    // VALIDATION
    // ========================================

    if (!form.storeName.trim()) {
      alert("Store name is required.");
      return;
    }

    if (!form.category.trim()) {
      alert("Category is required.");
      return;
    }

    if (!form.addressId) {
      alert("Please select a business address.");
      return;
    }

    if (
      !form.workingDays.from ||
      !form.workingDays.to
    ) {
      alert("Working days are required.");
      return;
    }

    if (
      !form.openingHours.from ||
      !form.openingHours.to
    ) {
      alert("Opening hours are required.");
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      // ========================================
      // FIND SELECTED ADDRESS
      // ========================================

      const selectedAddress =
        addresses.find(
          (address) =>
            address._id === form.addressId
        );

      if (!selectedAddress) {
        alert("Selected address not found.");
        return;
      }

      // ========================================
      // V2 STORE PAYLOAD
      // ========================================

      const payload = {
  storeName: form.storeName.trim(),
  category: form.category.trim(),
  role: form.role,
  gstNumber: form.gstNumber.trim(),

  address: {
  addressId: selectedAddress._id,
  area: selectedAddress.area || "",
  city: selectedAddress.city || "",
  state: selectedAddress.state || "",
  country: selectedAddress.country || "",
  pinCode: selectedAddress.pinCode || "",
},

  workingDays: {
    from: form.workingDays.from,
    to: form.workingDays.to,
  },

  openingHours: {
    from: form.openingHours.from,
    to: form.openingHours.to,
  },

  isOnline: false,
};

      console.log(
        "CREATE STORE PAYLOAD:",
        payload
      );

      // ========================================
      // CREATE STORE
      // ========================================

      const response = await axios.post(
        `${API_URL}/store/create`,
        payload,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );

      console.log(
        "CREATE STORE RESPONSE:",
        response.data
      );

      const newStore =
        response.data?.store;

      if (!newStore?._id) {
        throw new Error(
          "Store was created but store data was not returned."
        );
      }

      alert(
        "Store created successfully!"
      );

      // ========================================
      // SEND NEW STORE TO NAVBAR
      // ========================================

      onCreated(newStore);
    } catch (error: any) {
      console.error(
        "CREATE STORE ERROR:",
        error.response?.data ||
          error.message ||
          error
      );

      alert(
        error.response?.data?.message ||
          "Unable to create store."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[999999]
        flex
        items-center
        justify-center
        bg-black/50
        px-4
        py-6
        backdrop-blur-[2px]
      "
      onClick={onClose}
    >
      <div
        className="
          relative
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          bg-white
          shadow-2xl
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* ======================================
            HEADER
        ======================================= */}

        <div
          className="
            sticky
            top-0
            z-10
            flex
            items-center
            justify-between
            border-b
            border-slate-100
            bg-white
            px-6
            py-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-violet-50
              "
            >
              <Store
                size={22}
                className="text-violet-600"
              />
            </div>

            <div>
              <h2
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >
                Create Store
              </h2>

              <p
                className="
                  text-xs
                  text-slate-500
                "
              >
                Add a new store to your
                business account
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-slate-500
              transition
              hover:bg-slate-100
              disabled:opacity-50
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* ======================================
            FORM
        ======================================= */}

        <div className="space-y-6 px-6 py-6">

          {/* STORE NAME */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Store Name
              <span className="text-red-500">
                {" "}*
              </span>
            </label>

            <input
              type="text"
              value={form.storeName}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  storeName:
                    e.target.value,
                }))
              }
              placeholder="Enter store name"
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                px-4
                py-3
                text-sm
                outline-none
                transition
                focus:border-violet-400
                focus:ring-2
                focus:ring-violet-100
              "
            />
          </div>

          {/* ROLE */}

{/* ROLE */}

<div>
  <label
    className="
      mb-2
      block
      text-sm
      font-semibold
      text-slate-700
    "
  >
    Role
  </label>

  <div
    className="
      w-full
      rounded-xl
      border
      border-slate-200
      bg-slate-50
      px-4
      py-3
      text-sm
      font-medium
      text-slate-700
    "
  >
    Owner
  </div>
</div>

          {/* CATEGORY */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Category
              <span className="text-red-500">
                {" "}*
              </span>
            </label>

            <select
  value={form.category}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      category: e.target.value,
    }))
  }
  disabled={loadingCategories}
  className="
    w-full
    rounded-xl
    border
    border-slate-200
    bg-white
    px-4
    py-3
    text-sm
    outline-none
    transition
    focus:border-violet-400
    focus:ring-2
    focus:ring-violet-100
    disabled:cursor-not-allowed
    disabled:bg-slate-50
  "
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

          {/* GST */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              GST Number
              <span
                className="
                  ml-1
                  text-xs
                  font-normal
                  text-slate-400
                "
              >
                Optional
              </span>
            </label>

            <input
              type="text"
              value={form.gstNumber}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  gstNumber:
                    e.target.value,
                }))
              }
              placeholder="Enter GST number"
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                px-4
                py-3
                text-sm
                uppercase
                outline-none
                transition
                focus:border-violet-400
                focus:ring-2
                focus:ring-violet-100
              "
            />
          </div>

          {/* ADDRESS */}

          <div>

<div>
  <label
    className="
      mb-3
      flex
      items-center
      gap-1.5
      text-sm
      font-semibold
      text-slate-700
    "
  >
    <MapPin size={16} />
    Business Address
    <span className="text-red-500">*</span>
  </label>

  {/* LOADING */}
  {addressesLoading ? (
    <div
      className="
        flex
        items-center
        justify-center
        rounded-xl
        border
        border-slate-200
        px-4
        py-6
        text-sm
        text-slate-500
      "
    >
      <Loader2
        size={18}
        className="mr-2 animate-spin"
      />
      Loading addresses...
    </div>
  ) : (
    <>
      {/* SAVED ADDRESSES */}
      {addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((address) => (
            <SavedAddressCard
              key={address._id}
              address={address as any}
              selected={
                form.addressId === address._id
              }
              onSelect={handleSelectAddress}
              onEdit={() => {}}
            />
          ))}
        </div>
      )}

      {/* NO ADDRESS MESSAGE */}
      {addresses.length === 0 && (
        <div
          className="
            mb-3
            rounded-xl
            border
            border-amber-200
            bg-amber-50
            px-4
            py-4
            text-sm
            text-amber-700
          "
        >
          No saved address found.
          Please add an address first.
        </div>
      )}

      {/* ADD NEW ADDRESS */}
      <button
        type="button"
        onClick={() => {
          setNewAddress(INITIAL_ADDRESS);
          setShowAddAddress(true);
        }}
        className="
          mt-3
          w-full
          rounded-xl
          border-2
          border-dashed
          border-slate-300
          bg-white
          px-4
          py-4
          transition
          hover:border-violet-400
          hover:bg-violet-50/40
        "
      >
        <div className="flex items-center justify-center gap-2">
          <Plus
            size={20}
            className="text-violet-600"
          />

          <span className="text-sm font-semibold text-slate-700">
            Add New Address
          </span>
        </div>
      </button>
    </>
  )}
</div>
          </div>

          {/* WORKING DAYS */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Working Days
              <span className="text-red-500">
                {" "}*
              </span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <select
                value={
                  form.workingDays.from
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    workingDays: {
                      ...prev.workingDays,
                      from:
                        e.target.value,
                    },
                  }))
                }
                className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  outline-none
                  focus:border-violet-400
                "
              >
                <option value="">
                  From
                </option>

                {days.map((day) => (
                  <option
                    key={day}
                    value={day}
                  >
                    {day}
                  </option>
                ))}
              </select>

              <select
                value={
                  form.workingDays.to
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    workingDays: {
                      ...prev.workingDays,
                      to:
                        e.target.value,
                    },
                  }))
                }
                className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  outline-none
                  focus:border-violet-400
                "
              >
                <option value="">
                  To
                </option>

                {days.map((day) => (
                  <option
                    key={day}
                    value={day}
                  >
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* OPENING HOURS */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Opening Hours
              <span className="text-red-500">
                {" "}*
              </span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1 text-xs text-slate-400">
                  Opening
                </p>

                <input
                  type="time"
                  value={
                    form.openingHours
                      .from
                  }
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      openingHours: {
                        ...prev.openingHours,
                        from:
                          e.target.value,
                      },
                    }))
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-violet-400
                  "
                />
              </div>

              <div>
                <p className="mb-1 text-xs text-slate-400">
                  Closing
                </p>

                <input
                  type="time"
                  value={
                    form.openingHours
                      .to
                  }
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      openingHours: {
                        ...prev.openingHours,
                        to:
                          e.target.value,
                      },
                    }))
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-violet-400
                  "
                />
              </div>
            </div>
          </div>

          {/* BUTTONS */}

          <div
            className="
              flex
              gap-3
              border-t
              border-slate-100
              pt-5
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                flex-1
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-sm
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-50
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={createStore}
              disabled={
                loading ||
                addressesLoading ||
                loadingCategories
              }
              className="
                flex-1
                rounded-xl
                bg-violet-600
                px-4
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-violet-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <span
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Creating Store...
                </span>
              ) : (
                "Create Store"
              )}
            </button>
          </div>
        </div>
      </div>

      {showAddAddress && (
  <div
    className="
      fixed
      inset-0
      z-[1000000]
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
      onClick={(e) => e.stopPropagation()}
    >
      <CreateAddressForm
        address={newAddress}
        setAddress={setNewAddress}
        onSave={handleCreateAddress}
        onCancel={() => {
          setShowAddAddress(false);
          setNewAddress(INITIAL_ADDRESS);
        }}
        loading={creatingAddress}
      />
    </div>
  </div>
)}
    </div>
  );
}