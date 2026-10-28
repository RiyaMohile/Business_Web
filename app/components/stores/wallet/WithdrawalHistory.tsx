"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileClock,
  Filter,
  X,
  XCircle,
} from "lucide-react";
import { getMyWithdrawals } from "../../../services/withdrawalApi";

interface WithdrawalHistoryProps {
  onClose: () => void;
}

interface Withdrawal {
  _id: string;
  transactionId?: string;

  totalCoins: number;
  amount: number;

  status:
    | "pending"
    | "approved"
    | "processing"
    | "completed"
    | "rejected"
    | "failed";

  remark?: string;

  createdAt: string;
  completedAt?: string | null;

  walletId?: {
    _id: string;
    walletId?: string;
    walletName?: string;
  };

  bankAccountId?: {
    _id: string;
    bankName?: string;
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
  };
}

type FilterType = "all" | "pending" | "completed" | "failed";

export default function WithdrawalHistory({
  onClose,
}: WithdrawalHistoryProps) {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("all");

  const [showFilter, setShowFilter] = useState(false);

  // ==========================================
  // FETCH WITHDRAWALS
  // ==========================================

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyWithdrawals();

        console.log(
          "MY WITHDRAWALS RESPONSE:",
          response
        );

        setWithdrawals(
          Array.isArray(response?.withdrawals)
            ? response.withdrawals
            : []
        );
      } catch (error: any) {
        console.error(
          "GET WITHDRAWALS ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to fetch withdrawal history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredWithdrawals = useMemo(() => {
    if (activeFilter === "all") {
      return withdrawals;
    }

    return withdrawals.filter((withdrawal) => {
      const status =
        withdrawal.status?.toLowerCase();

      if (activeFilter === "pending") {
        return (
          status === "pending" ||
          status === "approved" ||
          status === "processing"
        );
      }

      if (activeFilter === "completed") {
        return status === "completed";
      }

      if (activeFilter === "failed") {
        return (
          status === "failed" ||
          status === "rejected"
        );
      }

      return true;
    });
  }, [withdrawals, activeFilter]);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date: string) => {
    const value = new Date(date);

    return value.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    const value = new Date(date);

    return value.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ==========================================
  // STATUS UI
  // ==========================================

  const getStatusData = (
    status: Withdrawal["status"]
  ) => {
    const currentStatus =
      status?.toLowerCase();

    if (currentStatus === "completed") {
      return {
        label: "Completed",
        icon: CheckCircle2,
        container:
          "bg-emerald-50 text-emerald-600",
        iconBg:
          "bg-emerald-100 text-emerald-600",
      };
    }

    if (
      currentStatus === "failed" ||
      currentStatus === "rejected"
    ) {
      return {
        label: "Failed",
        icon: XCircle,
        container:
          "bg-red-50 text-red-500",
        iconBg:
          "bg-red-100 text-red-500",
      };
    }

    return {
      label: "Pending",
      icon: Clock3,
      container:
        "bg-orange-50 text-orange-500",
      iconBg:
        "bg-orange-100 text-orange-500",
    };
  };

  // ==========================================
  // MASK ACCOUNT
  // ==========================================

  const maskAccount = (
    accountNumber?: string
  ) => {
    if (!accountNumber) {
      return "XXXX";
    }

    if (accountNumber.length <= 4) {
      return `XXXX ${accountNumber}`;
    }

    return `XXXX ${accountNumber.slice(-4)}`;
  };

  // ==========================================
  // FILTER LABEL
  // ==========================================

  const getFilterLabel = () => {
    if (activeFilter === "pending") {
      return "Pending";
    }

    if (activeFilter === "completed") {
      return "Completed";
    }

    if (activeFilter === "failed") {
      return "Failed";
    }

    return "All";
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 p-4">
      <div className="mx-auto flex h-full w-full max-w-md items-center justify-center">

        {/* ================= MODAL ================= */}

        <div className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-slate-50 shadow-2xl">

          {/* ================= HEADER ================= */}

          <div className="flex shrink-0 items-center justify-between bg-white px-4 py-4">

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={onClose}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  text-slate-700
                  hover:bg-slate-100
                "
              >
                <ArrowLeft size={19} />
              </button>

              <h2 className="text-base font-bold text-slate-900">
                Withdrawal History
              </h2>

            </div>

            {/* FILTER */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setShowFilter((prev) => !prev)
                }
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-xl
                  border
                  border-indigo-100
                  bg-white
                  px-3
                  py-2
                  text-[11px]
                  font-semibold
                  text-slate-700
                  shadow-sm
                "
              >
                <Filter
                  size={14}
                  className="text-indigo-600"
                />

                {getFilterLabel()}
              </button>

              {/* FILTER DROPDOWN */}

              {showFilter && (
                <div
                  className="
                    absolute
                    right-0
                    top-11
                    z-50
                    w-32
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-100
                    bg-white
                    p-1
                    shadow-xl
                  "
                >

                  {[
                    {
                      value: "all",
                      label: "All",
                    },
                    {
                      value: "pending",
                      label: "Pending",
                    },
                    {
                      value: "completed",
                      label: "Completed",
                    },
                    {
                      value: "failed",
                      label: "Failed",
                    },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setActiveFilter(
                          item.value as FilterType
                        );
                        setShowFilter(false);
                      }}
                      className={`
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded-lg
                        px-3
                        py-2
                        text-left
                        text-[11px]
                        font-medium
                        ${
                          activeFilter === item.value
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-600 hover:bg-slate-50"
                        }
                      `}
                    >
                      {item.label}

                      {activeFilter ===
                        item.value && (
                        <CheckCircle2 size={13} />
                      )}
                    </button>
                  ))}

                </div>
              )}

            </div>

          </div>

          {/* ================= CONTENT ================= */}

          <div className="overflow-y-auto px-3 pb-5 pt-2">

            {/* ================= LOADING ================= */}

            {loading && (
              <div className="flex flex-col items-center justify-center py-16">

                <div
                  className="
                    h-7
                    w-7
                    animate-spin
                    rounded-full
                    border-2
                    border-indigo-600
                    border-t-transparent
                  "
                />

                <p className="mt-3 text-xs text-slate-400">
                  Loading withdrawals...
                </p>

              </div>
            )}

            {/* ================= ERROR ================= */}

            {!loading && error && (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">

                <XCircle
                  size={42}
                  className="mx-auto text-red-400"
                />

                <p className="mt-3 text-sm font-semibold text-red-500">
                  {error}
                </p>

              </div>
            )}

            {/* ================= EMPTY ================= */}

            {!loading &&
              !error &&
              filteredWithdrawals.length === 0 && (
                <div
                  className="
                    flex
                    min-h-[430px]
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white
                    px-8
                    text-center
                  "
                >

                  {/* EMPTY ICON */}

                  <div
                    className="
                      flex
                      h-20
                      w-20
                      items-center
                      justify-center
                      rounded-2xl
                      bg-indigo-50
                    "
                  >
                    <FileClock
                      size={45}
                      strokeWidth={1.5}
                      className="text-indigo-500"
                    />
                  </div>

                  <h3 className="mt-5 text-sm font-bold text-slate-900">
                    No withdrawal yet
                  </h3>

                  <p className="mt-2 max-w-[230px] text-[11px] leading-5 text-slate-400">
                    Your withdrawal history will appear here
                  </p>

                </div>
              )}

            {/* ================= WITHDRAWAL LIST ================= */}

            {!loading &&
              !error &&
              filteredWithdrawals.length > 0 && (
                <div className="space-y-3">

                  {filteredWithdrawals.map(
                    (withdrawal) => {

                      const bank =
                        withdrawal.bankAccountId;

                      const statusData =
                        getStatusData(
                          withdrawal.status
                        );

                      const StatusIcon =
                        statusData.icon;

                      return (
                        <div
                          key={withdrawal._id}
                          className="
                            rounded-2xl
                            bg-white
                            px-3
                            py-3
                            shadow-sm
                          "
                        >

                          {/* TOP ROW */}

                          <div className="flex items-start justify-between">

                            <div className="flex items-start gap-3">

                              {/* ICON */}

                              <div
                                className={`
                                  flex
                                  h-10
                                  w-10
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-xl
                                  ${statusData.iconBg}
                                `}
                              >
                                <StatusIcon
                                  size={19}
                                  strokeWidth={2}
                                />
                              </div>

                              {/* AMOUNT */}

                              <div>

                                <p className="text-base font-bold text-slate-900">
                                  ₹
                                  {withdrawal.amount}
                                </p>

                                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                                  {
                                    withdrawal.totalCoins
                                  }{" "}
                                  Coins
                                </p>

                              </div>

                            </div>

                            {/* STATUS */}

                            <span
                              className={`
                                rounded-lg
                                px-2
                                py-1
                                text-[9px]
                                font-semibold
                                ${statusData.container}
                              `}
                            >
                              {statusData.label}
                            </span>

                          </div>

                          {/* DETAILS */}

                          <div className="ml-[52px] mt-2">

                            {/* TO */}

                            <p className="text-[10px] text-slate-500">
                              <span className="font-medium text-slate-400">
                                To:
                              </span>{" "}
                              {bank?.bankName ||
                                "Bank Account"}{" "}
                              ({maskAccount(
                                bank?.accountNumber
                              )})
                            </p>

                            {/* DATE */}

                            <p className="mt-1 text-[10px] text-slate-400">
                              {formatDate(
                                withdrawal.createdAt
                              )}
                              ,{" "}
                              {formatTime(
                                withdrawal.createdAt
                              )}
                            </p>

                            {/* TRANSACTION ID */}

                            <p className="mt-1 text-[10px] text-slate-400">
                              {withdrawal.transactionId ||
                                withdrawal._id}
                            </p>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

          </div>

        </div>
      </div>
    </div>
  );
}