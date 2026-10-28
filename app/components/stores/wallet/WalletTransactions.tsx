"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  SlidersHorizontal,
  ShoppingBag,
  WalletCards,
  RotateCcw,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { getWalletTransactions } from "../../../services/walletApi";

interface WalletTransactionsProps {
  onClose: () => void;
}

interface WalletTransaction {
  _id: string;
  type?: string;
  amountPaid?: number;
  totalCoins?: number;
  status?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ================= HELPERS ================= */

const getTransactionTitle = (
  transaction: WalletTransaction
) => {
  const type = transaction.type?.toLowerCase() || "";

  if (type.includes("buycoin")) {
    return "Coins Purchased";
  }

  if (type.includes("sellcoin")) {
    return "Coins Sold";
  }

  if (
    type.includes("withdraw") ||
    type.includes("debit")
  ) {
    return "Withdrawal";
  }

  if (
    type.includes("refund") ||
    type.includes("return")
  ) {
    return "Refund";
  }

  if (
    type.includes("order") ||
    type.includes("purchase")
  ) {
    return transaction.description || "Order";
  }

  return (
    transaction.description ||
    transaction.type ||
    "Transaction"
  );
};

const isCreditTransaction = (transaction: WalletTransaction) => {
  const type = transaction.type?.toLowerCase() || "";

  return (
  type.includes("credit") ||
  type.includes("credited") ||
  type.includes("buycoin") ||
  type.includes("order") ||
  type.includes("refund") ||
  type.includes("earning")
);
};

const getTransactionIcon = (transaction: WalletTransaction) => {
  const title = getTransactionTitle(transaction).toLowerCase();

  if (title.includes("withdraw")) {
    return {
      icon: ArrowUpRight,
      bg: "bg-red-50",
      iconColor: "text-red-500",
    };
  }

  if (title.includes("refund")) {
    return {
      icon: RotateCcw,
      bg: "bg-green-50",
      iconColor: "text-green-500",
    };
  }

  if (title.includes("order")) {
    return {
      icon: ShoppingBag,
      bg: "bg-indigo-50",
      iconColor: "text-indigo-500",
    };
  }

  return {
    icon: WalletCards,
    bg: "bg-indigo-50",
    iconColor: "text-indigo-500",
  };
};

const formatTime = (date?: string) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const isToday = (date?: string) => {
  if (!date) return false;

  const transactionDate = new Date(date);
  const today = new Date();

  return (
    transactionDate.getDate() === today.getDate() &&
    transactionDate.getMonth() === today.getMonth() &&
    transactionDate.getFullYear() === today.getFullYear()
  );
};

const isYesterday = (date?: string) => {
  if (!date) return false;

  const transactionDate = new Date(date);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    transactionDate.getDate() === yesterday.getDate() &&
    transactionDate.getMonth() === yesterday.getMonth() &&
    transactionDate.getFullYear() === yesterday.getFullYear()
  );
};

const formatYesterdayDate = (date?: string) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
};

/* ================= COMPONENT ================= */

export default function WalletTransactions({
  onClose,
}: WalletTransactionsProps) {
  const [transactions, setTransactions] = useState<
    WalletTransaction[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [showFilter, setShowFilter] = useState(false);

  const [filter, setFilter] = useState<
    "all" | "credit" | "debit"
  >("all");

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        const response = await getWalletTransactions();

        console.log(
          "WALLET TRANSACTIONS RESPONSE:",
          response
        );

        if (response?.success) {
          const transactionData =
            response.data ||
            response.transactions ||
            [];

          setTransactions(
            Array.isArray(transactionData)
              ? transactionData
              : []
          );
        } else {
          setTransactions([]);
        }
      } catch (error: any) {
        console.error(
          "GET WALLET TRANSACTIONS ERROR:",
          error.response?.data || error
        );

        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  /* ================= FILTER ================= */

  const filteredTransactions = useMemo(() => {
    if (filter === "all") {
      return transactions;
    }

    return transactions.filter((transaction) => {
      const credit = isCreditTransaction(transaction);

      if (filter === "credit") {
        return credit;
      }

      return !credit;
    });
  }, [transactions, filter]);

  /* ================= GROUP ================= */

  const todayTransactions = filteredTransactions.filter(
    (transaction) => isToday(transaction.createdAt)
  );

  const yesterdayTransactions = filteredTransactions.filter(
    (transaction) => isYesterday(transaction.createdAt)
  );

  const olderTransactions = filteredTransactions.filter(
    (transaction) =>
      !isToday(transaction.createdAt) &&
      !isYesterday(transaction.createdAt)
  );

  /* ================= TRANSACTION ITEM ================= */

  const TransactionItem = ({
    transaction,
  }: {
    transaction: WalletTransaction;
  }) => {
    const amount = transaction.totalCoins ?? 0;

    const credit = isCreditTransaction(transaction);

    const title = getTransactionTitle(transaction);

    const { icon: Icon, bg, iconColor } =
      getTransactionIcon(transaction);

    return (
      <div className="flex items-center px-2 py-4">
        {/* ICON */}

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bg}`}
        >
          <Icon
            size={20}
            strokeWidth={2.2}
            className={iconColor}
          />
        </div>

        {/* DETAILS */}

        <div className="ml-3 min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {formatTime(transaction.createdAt)}

            {transaction.createdAt &&
              !isToday(transaction.createdAt) && (
                <>
                  {" • "}
                  {formatYesterdayDate(
                    transaction.createdAt
                  )}
                </>
              )}
          </p>
        </div>

        {/* AMOUNT */}

        <div className="ml-3 shrink-0">
          <p
            className={`text-sm font-semibold ${
              credit
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {credit ? "+" : "-"}
            {amount} Coins
          </p>
        </div>
      </div>
    );
  };

  /* ================= RENDER ================= */

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="mx-auto flex h-full w-full max-w-md flex-col bg-white">
        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between px-5 pb-2 pt-5">
          <h2 className="text-lg font-bold text-slate-900">
            Transactions
          </h2>

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowFilter((prev) => !prev)
              }
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                py-2
                text-xs
                font-semibold
                text-slate-700
                shadow-sm
              "
            >
              <SlidersHorizontal size={15} />
              Filter
            </button>

            {/* FILTER DROPDOWN */}

            {showFilter && (
              <div
                className="
                  absolute
                  right-0
                  top-11
                  z-20
                  w-32
                  rounded-xl
                  border
                  border-slate-100
                  bg-white
                  p-1
                  shadow-lg
                "
              >
                <button
                  type="button"
                  onClick={() => {
                    setFilter("all");
                    setShowFilter(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-xs ${
                    filter === "all"
                      ? "bg-indigo-50 font-semibold text-indigo-600"
                      : "text-slate-600"
                  }`}
                >
                  All
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFilter("credit");
                    setShowFilter(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-xs ${
                    filter === "credit"
                      ? "bg-indigo-50 font-semibold text-indigo-600"
                      : "text-slate-600"
                  }`}
                >
                  Credits
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFilter("debit");
                    setShowFilter(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-xs ${
                    filter === "debit"
                      ? "bg-indigo-50 font-semibold text-indigo-600"
                      : "text-slate-600"
                  }`}
                >
                  Debits
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= CONTENT ================= */}

        <div className="flex-1 overflow-y-auto px-5 pb-8">
          {/* LOADING */}

          {loading && (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-slate-400">
                Loading transactions...
              </p>
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            filteredTransactions.length === 0 && (
              <div className="mt-8 rounded-2xl bg-slate-50 px-5 py-12 text-center">
                <WalletCards
                  size={38}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  No transactions found
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Your wallet transactions will
                  appear here.
                </p>
              </div>
            )}

          {/* ================= TODAY ================= */}

          {!loading &&
            todayTransactions.length > 0 && (
              <section className="mt-5">
                <h3 className="mb-1 text-sm font-medium text-slate-500">
                  Today
                </h3>

                <div className="overflow-hidden rounded-2xl bg-white shadow-[0_3px_15px_rgba(0,0,0,0.05)]">
                  {todayTransactions.map(
                    (transaction, index) => (
                      <div
                        key={
                          transaction._id ||
                          `today-${index}`
                        }
                        className={
                          index !==
                          todayTransactions.length - 1
                            ? "border-b border-slate-100"
                            : ""
                        }
                      >
                        <TransactionItem
                          transaction={transaction}
                        />
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

          {/* ================= YESTERDAY ================= */}

          {!loading &&
            yesterdayTransactions.length > 0 && (
              <section className="mt-6">
                <h3 className="mb-1 text-sm font-medium text-slate-500">
                  Yesterday
                </h3>

                <div className="overflow-hidden rounded-2xl bg-white shadow-[0_3px_15px_rgba(0,0,0,0.05)]">
                  {yesterdayTransactions.map(
                    (transaction, index) => (
                      <div
                        key={
                          transaction._id ||
                          `yesterday-${index}`
                        }
                        className={
                          index !==
                          yesterdayTransactions.length - 1
                            ? "border-b border-slate-100"
                            : ""
                        }
                      >
                        <TransactionItem
                          transaction={transaction}
                        />
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

          {/* ================= OLDER ================= */}

          {!loading &&
            olderTransactions.length > 0 && (
              <section className="mt-6">
                <h3 className="mb-1 text-sm font-medium text-slate-500">
                  Older
                </h3>

                <div className="overflow-hidden rounded-2xl bg-white shadow-[0_3px_15px_rgba(0,0,0,0.05)]">
                  {olderTransactions.map(
                    (transaction, index) => (
                      <div
                        key={
                          transaction._id ||
                          `older-${index}`
                        }
                        className={
                          index !==
                          olderTransactions.length - 1
                            ? "border-b border-slate-100"
                            : ""
                        }
                      >
                        <TransactionItem
                          transaction={transaction}
                        />
                      </div>
                    )
                  )}
                </div>
              </section>
            )}
        </div>
      </div>
    </div>
  );
}