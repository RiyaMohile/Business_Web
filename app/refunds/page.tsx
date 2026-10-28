
"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/businessApi";
import {
  RotateCcw,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Search,
} from "lucide-react";

type RefundStatus =
  | "pending"
  | "approved"
  | "processing"
  | "completed"
  | "failed"
  | "rejected";

interface Refund {
  _id: string;
  refundAmount: number;
  grandTotal?: number;
  reason?: string;
  status: RefundStatus;
  refundComplete?: boolean;
  refundTransactionId?: string;
  createdAt: string;
  orderId: string | { _id: string };
  customerUserId?: {
    name?: string;
    username?: string;
    email?: string;
  };
}

const statusStyle: Record<RefundStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-blue-50 text-blue-700",
  processing: "bg-violet-50 text-violet-700",
  completed: "bg-emerald-50 text-emerald-700",
  failed: "bg-red-50 text-red-700",
  rejected: "bg-gray-100 text-gray-600",
};

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchRefunds = useCallback(async () => {
    try {
      setLoading(true);

      // Replace this URL with your actual admin GET endpoint.
      const { data } = await api.get("https://api.thover.in/v1/api/refunds/admin");

      setRefunds(data.refunds ?? []);
    } catch (error) {
      console.error("Failed to fetch refunds:", error);
      alert("Unable to fetch refunds. Please check the API endpoint.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  const approveRefund = async (id: string) => {
    if (!window.confirm("Approve this refund request?")) return;

    try {
      setBusyId(id);
      await api.patch(`https://api.thover.in/v1/api/order/refund/${id}/approve`);
      await fetchRefunds();
      alert("Refund approved successfully.");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Unable to approve refund.");
    } finally {
      setBusyId(null);
    }
  };

  const updateStatus = async (
    refund: Refund,
    status: "processing" | "completed" | "failed"
  ) => {
    let refundTransactionId = refund.refundTransactionId || "";

    if (status === "completed") {
      const value = window.prompt("Enter refund transaction ID:");
      if (!value?.trim()) {
        alert("Refund transaction ID is required.");
        return;
      }
      refundTransactionId = value.trim();

      if (
        !window.confirm(
          "Mark this refund completed and credit the customer's wallet?"
        )
      ) return;
    }

    try {
      setBusyId(refund._id);

      await api.patch(`https://api.thover.in/v1/api/order/refund/${refund._id}`, {
        refundStatus: status,
        ...(refundTransactionId
          ? { refundTransactionId }
          : {}),
      });

      await fetchRefunds();
      alert("Refund status updated successfully.");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Unable to update refund status."
      );
    } finally {
      setBusyId(null);
    }
  };

  const filteredRefunds = refunds.filter((refund) => {
    const matchesStatus =
      filter === "all" || refund.status === filter;

    const customer = refund.customerUserId;
    const orderId =
      typeof refund.orderId === "string"
        ? refund.orderId
        : refund.orderId?._id || "";

    const query = search.toLowerCase();

    const matchesSearch =
      refund._id.toLowerCase().includes(query) ||
      orderId.toLowerCase().includes(query) ||
      (customer?.name || "").toLowerCase().includes(query) ||
      (refund.reason || "").toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: refunds.length,
    pending: refunds.filter((r) => r.status === "pending").length,
    approved: refunds.filter((r) => r.status === "approved").length,
    processing: refunds.filter((r) => r.status === "processing").length,
    completed: refunds.filter((r) => r.status === "completed").length,
    failed: refunds.filter((r) => r.status === "failed").length,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-0 min-w-0 flex-1 px-4 pb-8 pt-20 md:ml-72 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-violet-700">
              SUPER ADMIN / FINANCE
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Refund Management
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Review requests and manage refund status.
            </p>
          </div>

          <button
            onClick={fetchRefunds}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Refunds", value: counts.all, icon: RotateCcw, color: "text-violet-600", bg: "bg-violet-50" },
            { label: "Pending", value: counts.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Processing", value: counts.processing, icon: RefreshCw, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Completed", value: counts.completed, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
                  <Icon size={20} />
                </div>
                <p className="mt-4 text-sm text-gray-500">{card.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Refund Requests
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review each request before changing its status.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search refund or order..."
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-violet-400 sm:w-64"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Refund / Order</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Reason</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Requested</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                      Loading refund requests...
                    </td>
                  </tr>
                ) : filteredRefunds.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <XCircle className="mx-auto mb-3 text-gray-300" size={32} />
                      <p className="font-medium text-gray-700">No refunds found</p>
                      <p className="mt-1 text-gray-500">
                        Try changing your search or status filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredRefunds.map((refund) => (
                    <tr key={refund._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          #{refund._id.slice(-8)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Order:{" "}
                          {typeof refund.orderId === "string"
                            ? refund.orderId.slice(-8)
                            : refund.orderId?._id?.slice(-8) || "N/A"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {refund.customerUserId?.name || "Customer"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {refund.customerUserId?.email || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-900">
                        ₹{Number(refund.refundAmount || 0).toLocaleString("en-IN")}
                      </td>

                      <td className="max-w-48 px-5 py-4 text-gray-600">
                        {refund.reason || "Not specified"}
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[refund.status] || "bg-gray-100 text-gray-600"}`}>
                          {refund.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {new Date(refund.createdAt).toLocaleDateString("en-IN")}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          {refund.status === "pending" && (
                            <button
                              disabled={busyId === refund._id}
                              onClick={() => approveRefund(refund._id)}
                              className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                            >
                              {busyId === refund._id ? "Please wait..." : "Approve"}
                            </button>
                          )}

                          {refund.status === "approved" && (
                            <button
                              disabled={busyId === refund._id}
                              onClick={() => updateStatus(refund, "processing")}
                              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                              Start Processing
                            </button>
                          )}

                          {refund.status === "processing" && (
                            <>
                              <button
                                disabled={busyId === refund._id}
                                onClick={() => updateStatus(refund, "completed")}
                                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                              >
                                Complete
                              </button>

                              <button
                                disabled={busyId === refund._id}
                                onClick={() => updateStatus(refund, "failed")}
                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                Mark Failed
                              </button>
                            </>
                          )}

                          {["completed", "failed", "rejected"].includes(refund.status) && (
                            <span className="text-xs text-gray-400">
                              No actions
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
            Showing {filteredRefunds.length} of {refunds.length} refund requests
          </div>
        </section>
      </main>
    </div>
  );
}
