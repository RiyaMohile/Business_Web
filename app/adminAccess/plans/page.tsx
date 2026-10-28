"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  RefreshCw,
  CreditCard,
  Store,
  CalendarDays,
  CheckCircle2,
  X,
} from "lucide-react";
import api from "../../services/businessApi";

interface Plan {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;

  durationMonths: number;

  maxStores?: number | null;
  unlimitedStores: boolean;

  maxPosts?: number;
  features?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreatePlanForm {
  name: string;
  description: string;
  price: string;
  currency: string;

  durationMonths: string;

  maxStores: string;
  unlimitedStores: boolean;
}

const initialForm: CreatePlanForm = {
  name: "",
  description: "",
  price: "",
  currency: "INR",

  durationMonths: "1",

  maxStores: "2",
  unlimitedStores: false,
};

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

    const [stores, setStores] = useState<any[]>([]);
const [storesLoading, setStoresLoading] = useState(false);

const [selectedStoreId, setSelectedStoreId] = useState("");
const [selectedPlanId, setSelectedPlanId] = useState("");

const [activating, setActivating] = useState(false);
const [activationSuccess, setActivationSuccess] = useState("");
const [activationError, setActivationError] = useState("");

  const [form, setForm] =
    useState<CreatePlanForm>(initialForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // GET ACTIVE PLANS
  // ==========================================

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "https://api.thover.in/v2/api/plans/active"
      );

      if (response.data?.success) {
        setPlans(response.data.data || []);
      } else {
        setPlans([]);
      }
    } catch (error: any) {
      console.error(
        "GET PLANS ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to fetch plans."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL FETCH
  // ==========================================

  useEffect(() => {
  fetchPlans();
  fetchStores();
}, []);

  const fetchStores = async () => {
  try {
    setStoresLoading(true);
    setActivationError("");

    const response = await api.get(
      "https://api.thover.in/v1/api/admin-access/all-stores"
    );

    if (response.data?.success) {
      setStores(
        response.data?.stores || []
      );
    } else {
      setStores([]);
    }
  } catch (error: any) {
    console.error(
      "GET STORES ERROR:",
      error
    );

    setActivationError(
      error?.response?.data?.message ||
        "Failed to fetch stores."
    );
  } finally {
    setStoresLoading(false);
  }
};


const handleActivatePlan = async () => {
  setActivationError("");
  setActivationSuccess("");

  if (!selectedStoreId) {
    setActivationError("Please select a store.");
    return;
  }

  if (!selectedPlanId) {
    setActivationError("Please select a plan.");
    return;
  }

  try {
    setActivating(true);

    const response = await api.post(
      `https://api.thover.in/v2/api/plans/${selectedStoreId}/activate`,
      {
        planId: selectedPlanId,
      }
    );

    if (response.data?.success) {
      setActivationSuccess(
        "Plan activated for store successfully."
      );

      setSelectedStoreId("");
      setSelectedPlanId("");

      await fetchStores();
    }
  } catch (error: any) {
    console.error(
      "ACTIVATE PLAN ERROR:",
      error?.response?.data || error
    );

    setActivationError(
      error?.response?.data?.message ||
        "Failed to activate plan."
    );
  } finally {
    setActivating(false);
  }
};

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE PLAN
  // ==========================================

  const handleCreatePlan = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Plan name is required.");
      return;
    }

    if (!form.price) {
      setError("Price is required.");
      return;
    }

    if (Number(form.price) < 0) {
      setError(
        "Price cannot be negative."
      );
      return;
    }

   if (
  !form.unlimitedStores &&
  (
    !form.maxStores ||
    Number(form.maxStores) < 1
  )
) {
  setError(
    "Maximum stores must be at least 1."
  );
  return;
}

if (
  Number(form.durationMonths) < 1 ||
  Number(form.durationMonths) > 12
) {
  setError(
    "Duration must be between 1 and 12 months."
  );
  return;
}

    try {
      setCreating(true);

      const response = await api.post(
  "https://api.thover.in/v2/api/plans/",
  {
    name: form.name.trim(),

    description:
      form.description.trim(),

    price:
      Number(form.price),

    currency:
      form.currency.trim().toUpperCase(),

    durationMonths:
      Number(form.durationMonths),

    maxStores:
      form.unlimitedStores
        ? null
        : Number(form.maxStores),

    unlimitedStores:
      form.unlimitedStores,
  }
);

      if (response.data?.success) {
        setSuccess(
          "Plan created successfully."
        );

        setForm(initialForm);

        setShowCreateModal(false);

        await fetchPlans();
      }
    } catch (error: any) {
      console.error(
        "CREATE PLAN ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to create plan."
      );
    } finally {
      setCreating(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (
    date: string
  ) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6 lg:p-8">

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <CreditCard size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Plans & Subscriptions
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage subscription plans for stores
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={fetchPlans}
            disabled={loading}
            className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={() => {
              setError("");
              setSuccess("");
              setShowCreateModal(true);
            }}
            className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />

            Create Plan
          </button>

        </div>
      </div>

      {/* ===================================== */}
      {/* SUCCESS */}
      {/* ===================================== */}

      {success && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 size={18} />

          {success}
        </div>
      )}

      {/* ===================================== */}
      {/* ERROR */}
      {/* ===================================== */}

      {error && !showCreateModal && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ===================================== */}
      {/* SUMMARY */}
      {/* ===================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active Plans
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {plans.length}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CreditCard size={21} />
            </div>
          </div>
        </div>

      </div>

      {/* ===================================== */}
{/* ACTIVATE PLAN FOR STORE */}
{/* ===================================== */}

<div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

  <div className="mb-5">
    <h2 className="text-lg font-bold text-gray-900">
      Activate Plan for Store
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Select a store and assign a subscription plan.
    </p>
  </div>

  {/* SUCCESS */}
  {activationSuccess && (
    <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      {activationSuccess}
    </div>
  )}

  {/* ERROR */}
  {activationError && (
    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      {activationError}
    </div>
  )}

  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

    {/* STORE */}
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        Select Store
      </label>

      <select
        value={selectedStoreId}
        onChange={(e) => {
          setSelectedStoreId(e.target.value);
          setActivationError("");
          setActivationSuccess("");
        }}
        disabled={storesLoading}
        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
      >
        <option value="">
          {storesLoading
            ? "Loading stores..."
            : "Select Store"}
        </option>

        {stores.map((store) => (
          <option
            key={store._id}
            value={store.storeId}
          >
            {store.storeName} - {store.storeId}
          </option>
        ))}
      </select>
    </div>

    {/* PLAN */}
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        Select Plan
      </label>

      <select
        value={selectedPlanId}
        onChange={(e) => {
          setSelectedPlanId(e.target.value);
          setActivationError("");
          setActivationSuccess("");
        }}
        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">
          Select Plan
        </option>

        {plans.map((plan) => (
          <option
            key={plan._id}
            value={plan._id}
          >
            {plan.name} - {plan.currency === "INR" ? "₹" : plan.currency}
            {plan.price} / {plan.durationMonths}{" "}
            {plan.durationMonths === 1
              ? "month"
              : "months"}
          </option>
        ))}
      </select>
    </div>

  </div>

  {/* ACTIVATE BUTTON */}
  <div className="mt-5 flex justify-end">
    <button
      type="button"
      onClick={handleActivatePlan}
      disabled={
        activating ||
        !selectedStoreId ||
        !selectedPlanId
      }
      className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {activating
        ? "Activating..."
        : "Activate Plan"}
    </button>
  </div>

</div>

      {/* ===================================== */}
      {/* PLANS */}
      {/* ===================================== */}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl border border-gray-200 bg-white"
              />
            )
          )}

        </div>
      ) : plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <CreditCard size={25} />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No active plans
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create your first subscription plan.
          </p>

          <button
            type="button"
            onClick={() =>
              setShowCreateModal(true)
            }
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Create Plan
          </button>

        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          {plans.map((plan) => (
            <div
              key={plan._id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >

              {/* CARD HEADER */}

              <div className="border-b border-gray-100 p-5">

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {plan.name}
                    </h2>

                    {plan.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {plan.description}
                      </p>
                    )}
                  </div>

                  <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Active
                  </span>

                </div>

                {/* PRICE */}

                <div className="mt-5 flex items-end gap-1">

                  <span className="text-3xl font-bold text-gray-900">
                    {plan.currency === "INR"
                      ? "₹"
                      : plan.currency}

                    {plan.price}
                  </span>

                  <span className="pb-1 text-sm text-gray-500">
  / {plan.durationMonths}{" "}
  {plan.durationMonths === 1
    ? "month"
    : "months"}
</span>

                </div>

              </div>

              {/* CARD BODY */}

              <div className="space-y-4 p-5">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Store
                      size={17}
                      className="text-blue-600"
                    />

                    Maximum Stores
                  </div>

                  <span className="font-semibold text-gray-900">
  {plan.unlimitedStores
    ? "Unlimited"
    : plan.maxStores}
</span>

                </div>

                {/* {plan.maxPosts !== undefined && (
                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CreditCard
                        size={17}
                        className="text-blue-600"
                      />

                      Maximum Posts
                    </div>

                    <span className="font-semibold text-gray-900">
                      {plan.maxPosts === 0
                        ? "Unlimited"
                        : plan.maxPosts}
                    </span>

                  </div>
                )} */}

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays
                      size={17}
                      className="text-blue-600"
                    />

                    Created
                  </div>

                  <span className="text-sm font-medium text-gray-700">
                    {formatDate(
                      plan.createdAt
                    )}
                  </span>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* ===================================== */}
      {/* CREATE PLAN MODAL */}
      {/* ===================================== */}

      {showCreateModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6"
          onClick={() =>
            setShowCreateModal(false)
          }
        >

          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Create Plan
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a new subscription plan
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCreateModal(false)
                }
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleCreatePlan}
              className="space-y-5 p-6"
            >

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* PLAN NAME */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Plan Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Premium Plan"
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Best plan for growing businesses"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* PRICE + CURRENCY */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="999"
                    min="0"
                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Currency
                  </label>

                  <input
                    type="text"
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    placeholder="INR"
                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

              </div>

              {/* DURATION + MAX STORES */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  

                  <div>
  <label className="mb-1.5 block text-sm font-medium text-gray-700">
    Duration
  </label>

  <select
    name="durationMonths"
    value={form.durationMonths}
    onChange={handleChange}
    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  >
    {Array.from({ length: 12 }, (_, index) => {
      const months = index + 1;

      return (
        <option
          key={months}
          value={months}
        >
          {months}{" "}
          {months === 1
            ? "Month"
            : "Months"}
        </option>
      );
    })}
  </select>
</div>
                </div>

                <div>
  <label className="mb-1.5 block text-sm font-medium text-gray-700">
    Maximum Stores
  </label>

  <input
    type="number"
    name="maxStores"
    value={form.maxStores}
    onChange={handleChange}
    min="1"
    placeholder="2"
    disabled={form.unlimitedStores}
    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-400"
  />

  <label className="mt-3 flex items-center gap-2 text-sm text-gray-600">
    <input
      type="checkbox"
      checked={form.unlimitedStores}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          unlimitedStores:
            e.target.checked,

          maxStores:
            e.target.checked
              ? ""
              : prev.maxStores || "2",
        }))
      }
      className="h-4 w-4"
    />

    Unlimited Stores
  </label>
</div>

              </div>

              {/* ACTIONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setShowCreateModal(false)
                  }
                  className="h-11 rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating
                    ? "Creating..."
                    : "Create Plan"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}