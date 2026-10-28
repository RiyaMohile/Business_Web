"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  Store,
  Pencil,
  Save,
  X,
} from "lucide-react";

interface StoreData {
  _id?: string;
  storeId?: string;
  storeName: string;
  category: string;
  gstNumber?: string;

  status?: "public" | "suspended";
  isOnline?: boolean;

  address?: {
    addressId?: string;
    area?: string;
    city?: string;
  };

  workingDays?: {
    from?: string;
    to?: string;
  };

  openingHours?: {
    from?: string;
    to?: string;
  };

  contacts?: {
    phoneContactId?: string | {
      _id?: string;
    } | null;

    mailContactId?: string | {
      _id?: string;
    } | null;
  };
}

const BASE_URL =
  "https://api.thover.in/v1/api";

export default function ManageStorePage() {

  const router = useRouter();

  const [store, setStore] =
    useState<StoreData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [form, setForm] = useState({
  storeName: "",
  category: "",
  gstNumber: "",
  area: "",
  city: "",
  workingFrom: "",
  workingTo: "",
  openingFrom: "",
  openingTo: "",
  phoneContactId: "",
  mailContactId: "",
});

  // ==========================================
  // FETCH STORE
  // ==========================================

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const { data } =
        await axios.get(
          `${BASE_URL}/store/my-store`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      console.log(
        "MY STORE:",
        data
      );

      const myStore =
        data?.store ||
        data?.data;

      if (!myStore) {
        setStore(null);
        return;
      }

      setStore(myStore);

      setForm({
        storeName:
          myStore.storeName || "",

        category:
          myStore.category || "",

        gstNumber:
          myStore.gstNumber || "",

        area:
          myStore.address?.area || "",

        city:
          myStore.address?.city || "",

        workingFrom:
          myStore.workingDays?.from || "",

        workingTo:
          myStore.workingDays?.to || "",

        openingFrom:
          myStore.openingHours?.from || "",

        openingTo:
          myStore.openingHours?.to || "",

          phoneContactId:
  typeof myStore.contacts?.phoneContactId === "object"
    ? myStore.contacts?.phoneContactId?._id || ""
    : myStore.contacts?.phoneContactId || "",

mailContactId:
  typeof myStore.contacts?.mailContactId === "object"
    ? myStore.contacts?.mailContactId?._id || ""
    : myStore.contacts?.mailContactId || "",
      });
      

    } catch (error: any) {

      console.error(
        "FETCH STORE ERROR:",
        error.response?.data ||
          error.message
      );

    } finally {

      setLoading(false);

    }
  };

  // ==========================================
  // INPUT
  // ==========================================

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

  };

  // ==========================================
  // SAVE
  // ==========================================

  const handleSave = async () => {

    if (!store?._id) {
      return;
    }

    try {

      setSaving(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

     const payload = {
  storeName: form.storeName.trim(),

  category: form.category.trim(),

  gstNumber: form.gstNumber.trim(),

  address: {
    addressId: store.address?.addressId,
    area: form.area.trim(),
    city: form.city.trim(),
  },

  workingDays: {
    from: form.workingFrom,
    to: form.workingTo,
  },

  openingHours: {
    from: form.openingFrom,
    to: form.openingTo,
  },

  phoneContactId:
    form.phoneContactId || undefined,

  mailContactId:
    form.mailContactId || undefined,
};

      console.log(
        "UPDATE STORE PAYLOAD:",
        payload
      );

      const { data } =
        await axios.put(
          `${BASE_URL}/store/update/${store._id}`,
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
        "UPDATE STORE RESPONSE:",
        data
      );

      if (data?.success) {

        alert(
          "Store updated successfully."
        );

        setEditing(false);

        await fetchStore();

      } else {

        alert(
          data?.message ||
          "Unable to update store."
        );

      }

    } catch (error: any) {

      console.error(
        "UPDATE STORE ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
        "Unable to update store."
      );

    } finally {

      setSaving(false);

    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">

        <p className="text-sm text-slate-500">
          Loading store...
        </p>

      </main>
    );

  }

  // ==========================================
  // STORE NOT FOUND
  // ==========================================

  if (!store) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <Store
            size={40}
            className="mx-auto text-slate-300"
          />

          <p className="mt-3 text-sm text-slate-500">
            Store not found.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/business-dashboard/store"
              )
            }
            className="
              mt-4
              rounded-xl
              bg-blue-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
            "
          >
            Back to Store
          </button>

        </div>

      </main>
    );

  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-slate-50">

      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/business-dashboard/store"
                )
              }
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-slate-200
                bg-white
                text-slate-600
                hover:bg-slate-50
              "
            >
              <ArrowLeft size={18} />
            </button>

            <div>

              <h1 className="text-xl font-bold text-slate-900">
                Manage Store
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                Update your store information
              </p>

            </div>

          </div>

          {!editing && (
            <button
              type="button"
              onClick={() =>
                setEditing(true)
              }
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                hover:bg-blue-700
              "
            >
              <Pencil size={16} />
              Edit
            </button>
          )}

        </div>

        {/* ======================================
            FORM
        ====================================== */}

        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">

          <div className="space-y-5">

            {/* STORE NAME */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Store Name
              </label>

              <input
                type="text"
                value={form.storeName}
                disabled={!editing}
                onChange={(e) =>
                  updateField(
                    "storeName",
                    e.target.value
                  )
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
                  focus:border-blue-500
                  disabled:bg-slate-50
                  disabled:text-slate-500
                "
              />

            </div>

            {/* CATEGORY */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>

              <input
                type="text"
                value={form.category}
                disabled={!editing}
                onChange={(e) =>
                  updateField(
                    "category",
                    e.target.value
                  )
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
                  focus:border-blue-500
                  disabled:bg-slate-50
                  disabled:text-slate-500
                "
              />

            </div>

            {/* GST */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                GST Number
              </label>

              <input
                type="text"
                value={form.gstNumber}
                disabled={!editing}
                onChange={(e) =>
                  updateField(
                    "gstNumber",
                    e.target.value
                  )
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
                  focus:border-blue-500
                  disabled:bg-slate-50
                  disabled:text-slate-500
                "
              />

            </div>

            {/* ADDRESS */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Area
              </label>

              <input
                type="text"
                value={form.area}
                disabled={!editing}
                onChange={(e) =>
                  updateField(
                    "area",
                    e.target.value
                  )
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
                  focus:border-blue-500
                  disabled:bg-slate-50
                  disabled:text-slate-500
                "
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                City
              </label>

              <input
                type="text"
                value={form.city}
                disabled={!editing}
                onChange={(e) =>
                  updateField(
                    "city",
                    e.target.value
                  )
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
                  focus:border-blue-500
                  disabled:bg-slate-50
                  disabled:text-slate-500
                "
              />

            </div>

            {/* WORKING DAYS */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Working Days
              </label>

              <div className="grid grid-cols-2 gap-3">

                <input
                  type="text"
                  value={form.workingFrom}
                  disabled={!editing}
                  onChange={(e) =>
                    updateField(
                      "workingFrom",
                      e.target.value
                    )
                  }
                  placeholder="From"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    disabled:bg-slate-50
                  "
                />

                <input
                  type="text"
                  value={form.workingTo}
                  disabled={!editing}
                  onChange={(e) =>
                    updateField(
                      "workingTo",
                      e.target.value
                    )
                  }
                  placeholder="To"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    disabled:bg-slate-50
                  "
                />

              </div>

            </div>

            {/* OPENING HOURS */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Opening Hours
              </label>

              <div className="grid grid-cols-2 gap-3">

                <input
                  type="time"
                  value={form.openingFrom}
                  disabled={!editing}
                  onChange={(e) =>
                    updateField(
                      "openingFrom",
                      e.target.value
                    )
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
                    disabled:bg-slate-50
                  "
                />

                <input
                  type="time"
                  value={form.openingTo}
                  disabled={!editing}
                  onChange={(e) =>
                    updateField(
                      "openingTo",
                      e.target.value
                    )
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
                    disabled:bg-slate-50
                  "
                />

              </div>

            </div>

          </div>

          {/* ====================================
              SAVE / CANCEL
          ==================================== */}

          {editing && (
            <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">

              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setEditing(false);

                  if (store) {
  setForm({
    storeName: store.storeName || "",

    category: store.category || "",

    gstNumber: store.gstNumber || "",

    area: store.address?.area || "",

    city: store.address?.city || "",

    workingFrom: store.workingDays?.from || "",

    workingTo: store.workingDays?.to || "",

    openingFrom: store.openingHours?.from || "",

    openingTo: store.openingHours?.to || "",

    phoneContactId:
      typeof store.contacts?.phoneContactId === "object"
        ? store.contacts.phoneContactId?._id || ""
        : store.contacts?.phoneContactId || "",

    mailContactId:
      typeof store.contacts?.mailContactId === "object"
        ? store.contacts.mailContactId?._id || ""
        : store.contacts?.mailContactId || "",
  });
}
                }}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  hover:bg-slate-50
                "
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-blue-700
                  disabled:opacity-50
                "
              >
                <Save size={16} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>
          )}

        </div>

      </div>

    </main>
  );
}