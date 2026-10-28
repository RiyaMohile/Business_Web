"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Loader2,
  MapPin,
  Plus,
} from "lucide-react";

import { Address, StoreForm } from "../types";

import SavedAddressCard from "./SavedAddressCard";
import CreateAddressForm, {
  NewAddress,
} from "./CreateAddressForm";
import EditAddressForm from "./EditAddressForm";

interface Props {
  form: StoreForm;
  updateForm: (data: Partial<StoreForm>) => void;
  onNext: () => void;
  onBack: () => void;
}

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

export default function AddressStep({
  form,
  updateForm,
  onNext,
  onBack,
}: Props) {
  const [addresses, setAddresses] =
    useState<Address[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [creatingAddress, setCreatingAddress] =
    useState(false);

  const [updatingAddress, setUpdatingAddress] =
    useState(false);

  const [showAddAddress, setShowAddAddress] =
    useState(false);

  const [newAddress, setNewAddress] =
    useState<NewAddress>(INITIAL_ADDRESS);

  const [editingAddress, setEditingAddress] =
    useState<Address | null>(null);
  const editFormRef =
  useRef<HTMLDivElement | null>(null);

const createFormRef =
  useRef<HTMLDivElement | null>(null);

  // ==========================================
  // GET ALL ADDRESSES
  // ==========================================
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);

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
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load addresses."
      );
    } finally {
      setLoading(false);
    }
  };
const handleAddressSelect = (address: Address) => {
  updateForm({
    address: {
      addressId: address._id,
      area: address.area || "",
      city: address.city || "",
    },
  });
};
  // ==========================================
  // SELECT ADDRESS
  // ==========================================
  const selectAddress = (address: Address) => {
  // If user clicks the already selected address,
  // unselect it.
  if (form.address?.addressId === address._id) {
    updateForm({
      address: {
        addressId: "",
        area: "",
        city: "",
      },
    });

    return;
  }

  // Otherwise select the address
  updateForm({
    address: {
      addressId: address._id,
      area: address.area || "",
      city: address.city || "",
    },
  });
};

  // ==========================================
  // CREATE ADDRESS
  // ==========================================
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

  city: newAddress.city.trim(),
  state: newAddress.state.trim(),
  country: newAddress.country.trim(),
  pinCode: newAddress.pinCode.trim(),

  latitude: Number(newAddress.latitude),
  longitude: Number(newAddress.longitude),

  isPrimary: newAddress.isPrimary,
};

    console.log("CREATE ADDRESS PAYLOAD:", payload);

    const { data } = await axios.post(
      `${API_URL}/address/location`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("CREATE ADDRESS RESPONSE:", data);

    const createdAddress = data?.data;

    if (!createdAddress?._id) {
      throw new Error("Invalid create address response.");
    }

    // Add the newly created address to the list
    setAddresses((previous) => [
      createdAddress,
      ...previous,
    ]);

    // Automatically select newly created address
    updateForm({
      address: {
        addressId: createdAddress._id,
        area: createdAddress.area || "",
        city: createdAddress.city || "",
      },
    });

    // Reset form
    setNewAddress(INITIAL_ADDRESS);

    // Close add-address modal
    setShowAddAddress(false);

    alert("Address created successfully.");

  } catch (error: any) {
    console.error(
      "CREATE ADDRESS ERROR:",
      error
    );

    console.error(
      "SERVER RESPONSE:",
      error.response?.data
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
  // OPEN EDIT
  // ==========================================
  const handleEditAddress = (
  address: Address
) => {
  setEditingAddress(address);

  // Wait until EditAddressForm is rendered
  setTimeout(() => {
    editFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
};

// ==========================================
// UPDATE ADDRESS
// ==========================================
const handleUpdateAddress = async () => {
  if (!editingAddress?._id) {
    return;
  }

  // Frontend validation
  if (!editingAddress.street?.trim()) {
    alert("Please enter street.");
    return;
  }

  if (!editingAddress.area?.trim()) {
    alert("Please enter area / locality.");
    return;
  }

  try {
    setUpdatingAddress(true);

    const token = localStorage.getItem("token");

    const payload = {
      name: editingAddress.name?.trim() || "",
      street: editingAddress.street.trim(),
      area: editingAddress.area.trim(),
      city: editingAddress.city?.trim() || "",
      state: editingAddress.state?.trim() || "",
      country: editingAddress.country?.trim() || "",
      pinCode: editingAddress.pinCode?.trim() || "",
      isPrimary: editingAddress.isPrimary ?? false,
    };

    console.log("UPDATE ADDRESS PAYLOAD:", payload);

    const { data } = await axios.put(
      `${API_URL}/address/${editingAddress._id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("UPDATE ADDRESS RESPONSE:", data);

    const updatedAddress = data?.data;

    if (!updatedAddress?._id) {
      throw new Error("Invalid update response.");
    }

    await fetchAddresses();

    if (form.address?.addressId === updatedAddress._id) {
      selectAddress(updatedAddress);
    }

    setEditingAddress(null);

    alert("Address updated successfully.");

  } catch (error: any) {
    console.error("UPDATE ADDRESS ERROR:", error);

    console.error(
      "SERVER RESPONSE:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
      "Unable to update address."
    );

  } finally {
    setUpdatingAddress(false);
  }
};


  // ==========================================
  // CONTINUE
  // ==========================================
  const handleContinue = () => {
    if (!form.address?.addressId) {
      alert(
        "Please select or add an address."
      );
      return;
    }

    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900">
          Store Address
        </h3>

        <p className="text-gray-500 mt-2">
          Select a saved address or add a
          new address.
        </p>
      </div>

      {/* ===================================== */}
      {/* SAVED ADDRESSES */}
      {/* ===================================== */}

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2
              size={30}
              className="animate-spin text-blue-600"
            />
          </div>
        ) : addresses.length === 0 ? (
          <div className="border border-gray-200 rounded-2xl p-8 text-center">
            <MapPin
              size={40}
              className="mx-auto text-gray-400 mb-3"
            />

            <p className="text-gray-600">
              No saved addresses found.
            </p>
          </div>
        ) : (
          addresses
  .filter((address) => address.area?.trim())
  .map((address) => (
    <SavedAddressCard
      key={address._id}
      address={address}
      selected={
        form.address?.addressId === address._id
      }
      onSelect={handleAddressSelect}
      onEdit={handleEditAddress}
    />
  ))
        )}
      </div>

      {/* ===================================== */}
      {/* EDIT ADDRESS */}
      {/* ===================================== */}

      {editingAddress && (
  <div ref={editFormRef}>
    <EditAddressForm
      address={editingAddress}
      onChange={setEditingAddress}
      onUpdate={handleUpdateAddress}
      onCancel={() =>
        setEditingAddress(null)
      }
      loading={updatingAddress}
    />
  </div>
)}

      {/* ===================================== */}
      {/* ADD NEW ADDRESS */}
      {/* ===================================== */}

      <div className="mt-6">
        <button
          type="button"
          onClick={() =>
            setShowAddAddress(
              !showAddAddress
            )
          }
          className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-gray-50 rounded-2xl p-5 transition-all"
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

      {showAddAddress && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

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

      

      {/* INFO */}
      <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex gap-3">
          <MapPin
            size={20}
            className="text-gray-500 mt-0.5"
          />

          <div>
            <p className="text-sm font-medium text-gray-700">
              Location access
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Your browser will ask for
              permission to access your current
              location.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================== */}
      {/* FOOTER */}
      {/* ===================================== */}

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={
            !form.address?.addressId
          }
          className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}