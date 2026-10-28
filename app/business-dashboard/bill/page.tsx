
"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Plus, Search, ReceiptText, RefreshCw } from "lucide-react";

import Navbar from "@/app/components/BusinessNavbar";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import MobileDashboardNav from "@/app/components/dashboard/MobileDashboardNav";
import { getMyStores, updateStoreOnlineStatus } from "@/app/services/businessStoreApi";

interface Bill {
  _id: string;
  billNo?: string;
  billType?: "online" | "offline";
  customerUserId?: {
    name?: string;
    phone?: string;
  } | string | null;
  createdBy?: {
    name?: string;
  } | string | null;
  customerPhone?: string;
  grandTotal?: number;
  totalAmount?: number;
  createdAt?: string;
}

interface Pagination {
  currentPage: number;
  limit: number;
  totalBills: number;
  totalPages: number;
}

export default function BillsPage() {
  const router = useRouter();

  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [storeName, setStoreName] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [billType, setBillType] = useState("");
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    limit: 20,
    totalBills: 0,
    totalPages: 0,
  });

  const fetchBills = useCallback(async () => {
    const storeId = localStorage.getItem("selectedStoreId");
    const token = localStorage.getItem("token");

    if (!storeId) {
      setError("Please select a store first.");
      setBills([]);
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const params: Record<string, string | number> = {
        page: pagination.currentPage,
        limit: pagination.limit,
      };

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (billType) params.billType = billType;

      const response = await axios.get(
        `https://api.thover.in/v1/api/bill/store/${storeId}`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setBills(response.data.data ?? []);
        setPagination((previous) => ({
          ...previous,
          ...(response.data.pagination ?? {}),
        }));
      } else {
        setBills([]);
        setError(response.data?.message || "Unable to fetch bills.");
      }
    } catch (err: any) {
      console.error("FETCH BILLS ERROR:", err.response?.data || err);

      setBills([]);
      setError(
        err.response?.data?.message ||
          "Unable to load bills. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, startDate, endDate, billType]);

  const fetchStoreStatus = useCallback(async () => {
    try {
      const storeId = localStorage.getItem("selectedStoreId");
      if (!storeId) return;

      const response = await getMyStores();

      if (response?.success && Array.isArray(response.stores)) {
        const store = response.stores.find(
          (item: any) => String(item._id) === String(storeId)
        );

        setStoreName(store?.storeName || store?.name || "");
        setIsOnline(store?.isOnline ?? false);
      }
    } catch (err) {
      console.error("FETCH STORE STATUS ERROR:", err);
    }
  }, []);

  const handleOnlineStatusChange = async (nextStatus: boolean) => {
    const storeId = localStorage.getItem("selectedStoreId");

    if (!storeId) {
      alert("Please select a store first.");
      return;
    }

    try {
      setUpdatingStatus(true);
      const response = await updateStoreOnlineStatus(storeId, nextStatus);

      if (response?.success) {
        setIsOnline(nextStatus);
      } else {
        alert(response?.message || "Unable to update store status.");
      }
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Unable to update store status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    fetchStoreStatus();
  }, [fetchStoreStatus]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  useEffect(() => {
    const handleStoreChange = () => {
      setPagination((previous) => ({
        ...previous,
        currentPage: 1,
      }));
      fetchStoreStatus();
    };

    window.addEventListener("selectedStoreChanged", handleStoreChange);

    return () => {
      window.removeEventListener("selectedStoreChanged", handleStoreChange);
    };
  }, [fetchStoreStatus]);

  const visibleBills = bills.filter((bill) => {
    const customer =
      typeof bill.customerUserId === "object" && bill.customerUserId
        ? bill.customerUserId.name || bill.customerUserId.phone || ""
        : "";

    const query = search.trim().toLowerCase();

    return (
      !query ||
      (bill.billNo || "").toLowerCase().includes(query) ||
      customer.toLowerCase().includes(query) ||
      (bill._id || "").toLowerCase().includes(query)
    );
  });

  const formatDate = (date?: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatMoney = (amount?: number) =>
    `₹${Number(amount ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        onAccountModalChange={() => {}}
        isOnline={isOnline}
        onOnlineStatusChange={handleOnlineStatusChange}
        updatingStatus={updatingStatus}
      />

      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      <main className="min-h-screen px-3 pb-24 pt-20 md:ml-[248px] md:w-[calc(100%-248px)] md:px-10 md:pb-10 md:pt-28">
        <div className="md:hidden">
          <MobileDashboardNav />
        </div>

        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-6 mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Bills
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {storeName
                  ? `View and manage bills for ${storeName}.`
                  : "View and manage your store bills."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/business-dashboard/bill/create")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Plus size={18} />
              Create Bill
            </button>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end">
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Search bill
                </label>
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by bill number or customer"
                    className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Bill type
                </label>
                <select
                  value={billType}
                  onChange={(event) => {
                    setBillType(event.target.value);
                    setPagination((previous) => ({
                      ...previous,
                      currentPage: 1,
                    }));
                  }}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm lg:w-40"
                >
                  <option value="">All bills</option>
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  From date
                </label>
                <input
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(event) => {
                    setStartDate(event.target.value);
                    setPagination((previous) => ({
                      ...previous,
                      currentPage: 1,
                    }));
                  }}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  To date
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(event) => {
                    setEndDate(event.target.value);
                    setPagination((previous) => ({
                      ...previous,
                      currentPage: 1,
                    }));
                  }}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
                />
              </div>

              <button
                type="button"
                onClick={() => fetchBills()}
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {pagination.totalBills} bill(s) found
              </p>
              <span className="text-xs text-slate-400">
                Page {pagination.currentPage} of{" "}
                {Math.max(pagination.totalPages, 1)}
              </span>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="py-16 text-center text-sm text-slate-500">
                Loading bills...
              </div>
            ) : visibleBills.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <ReceiptText size={27} />
                </div>
                <h2 className="mt-4 text-base font-semibold text-slate-800">
                  No bills found
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Try changing the filters or create your first bill.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    router.push("/business-dashboard/bill/create")
                  }
                  className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Create Bill
                </button>
              </div>
            ) : (
              <>
                <div className="block">
  <div className="max-h-[500px] overflow-auto rounded-xl border border-slate-200">
    <table className="w-full min-w-[760px] border-collapse text-left">
      <thead className="sticky top-0 z-20 bg-slate-50">
        <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <th className="whitespace-nowrap px-4 py-3 font-semibold">
            Bill No.
          </th>
          <th className="whitespace-nowrap px-4 py-3 font-semibold">
            Customer
          </th>
          <th className="whitespace-nowrap px-4 py-3 font-semibold">
            Type
          </th>
          <th className="whitespace-nowrap px-4 py-3 font-semibold">
            Date
          </th>
          <th className="whitespace-nowrap px-4 py-3 text-right font-semibold">
            Total
          </th>
        </tr>
      </thead>
                    <tbody>
                      {visibleBills.map((bill) => {
                        const customer =
                          typeof bill.customerUserId === "object" &&
                          bill.customerUserId
                            ? bill.customerUserId.name ||
                              bill.customerUserId.phone ||
                              "Customer"
                            : bill.customerPhone || "Walk-in customer";

                        return (
                          <tr
                            key={bill._id}
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                          >
                            <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                              {bill.billNo || bill._id.slice(-8).toUpperCase()}
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-600">
                              {customer}
                            </td>
                            <td className="px-4 py-4">
                              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">
                                {bill.billType || "—"}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-600">
                              {formatDate(bill.createdAt)}
                            </td>
                            <td className="px-4 py-4 text-right text-sm font-bold text-slate-900">
                              {formatMoney(bill.grandTotal ?? bill.totalAmount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                </div>

                {/* <div className="space-y-3 md:hidden">
                  {visibleBills.map((bill) => {
                    const customer =
                      typeof bill.customerUserId === "object" &&
                      bill.customerUserId
                        ? bill.customerUserId.name ||
                          bill.customerUserId.phone ||
                          "Customer"
                        : bill.customerPhone || "Walk-in customer";

                    return (
                      <article
                        key={bill._id}
                        className="rounded-xl border border-slate-100 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {bill.billNo || bill._id.slice(-8).toUpperCase()}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {customer}
                            </p>
                          </div>
                          <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold capitalize text-slate-700">
                            {bill.billType || "—"}
                          </span>
                        </div>
                        <div className="mt-3 flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
                          <p className="text-xs text-slate-500">
                            {formatDate(bill.createdAt)}
                          </p>
                          <p className="text-base font-bold text-slate-900">
                            {formatMoney(bill.grandTotal ?? bill.totalAmount)}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div> */}
              </>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                disabled={loading || pagination.currentPage <= 1}
                onClick={() =>
                  setPagination((previous) => ({
                    ...previous,
                    currentPage: previous.currentPage - 1,
                  }))
                }
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-xs text-slate-500">
                {pagination.totalBills} total
              </span>

              <button
                type="button"
                disabled={
                  loading ||
                  pagination.currentPage >= pagination.totalPages
                }
                onClick={() =>
                  setPagination((previous) => ({
                    ...previous,
                    currentPage: previous.currentPage + 1,
                  }))
                }
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
