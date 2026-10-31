"use client";

import {
  ArrowLeft,
  ShoppingBag,
  Store as StoreIcon,
  Loader2,
  Copy,
  Check,
  X,
  ChevronRight,
  MapPin,
  Undo2,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getMyOrders,
  cancelOrder,
  getEligibleReturnIds,
  getReturnHistory,
  requestReturn,
  verifyReturnOtp,
  parseOrder,
  type OrderFilter,
  type ParsedOrder,
  type StatusTone,
} from "../services/customerOrderApi";

type Tab = OrderFilter | "Returns";

const FILTERS: Tab[] = [
  "All",
  "Active",
  "Completed",
  "Cancelled",
  "Returns",
];

const rtext = (r: any, keys: string[]): string => {
  for (const k of keys) {
    const v = r?.[k];
    if (
      v !== undefined &&
      v !== null &&
      typeof v !== "object" &&
      String(v).trim()
    ) {
      return String(v).trim();
    }
  }
  return "";
};

const fmtReturnDate = (raw: any) => {
  const d = new Date(raw);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
};

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Delivery is taking too long",
  "Need to change delivery address",
  "Found a better price elsewhere",
  "Other reason",
];

const TONE_CLASS: Record<StatusTone, string> = {
  active: "bg-[#EFF6FF] text-[#3B82F6]",
  pending: "bg-[#FEF3C7] text-[#D97706]",
  done: "bg-[#DCFCE7] text-[#16A34A]",
  cancelled: "bg-[#FEE2E2] text-[#DC2626]",
};

function StatusBadge({ order }: { order: ParsedOrder }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${TONE_CLASS[order.tone]}`}
    >
      {order.status}
    </span>
  );
}

function OrderImage({
  src,
  size,
}: {
  src: string;
  size: number;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[#F8FAFC] p-1"
      style={{ width: size, height: size }}
    >
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <ShoppingBag size={size / 2.5} className="text-slate-400" />
      )}
    </div>
  );
}

function OtpBox({ order }: { order: ParsedOrder }) {
  const [copied, setCopied] = useState(false);

  if (order.otp) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3">
        <div>
          <p className="text-[10px] font-extrabold tracking-wider text-[#166534]">
            DELIVERY OTP
          </p>
          <p className="text-lg font-black tracking-[0.3em] text-[#0F172A]">
            {order.otp}
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard?.writeText(order.otp);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="flex items-center gap-1 rounded-lg border border-[#BBF7D0] bg-white px-3 py-1.5 text-xs font-bold text-[#15803D]"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    );
  }

  if (order.isCancelled || order.isCompleted) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#64748B]">
      Delivery OTP: Will be shared upon rider assignment
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();

  const [filter, setFilter] = useState<Tab>("All");
  const [orders, setOrders] = useState<ParsedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSnapshot, setSelected] = useState<ParsedOrder | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [reason, setReason] = useState(CANCEL_REASONS[0]);
  const [toast, setToast] = useState("");

  const [eligible, setEligible] = useState<string[]>([]);
  const [returns, setReturns] = useState<any[]>([]);
  const [confirmReturn, setConfirmReturn] = useState(false);
  const [returning, setReturning] = useState(false);
  const [otpTarget, setOtpTarget] = useState<{
    returnId: string;
    orderId: string;
    justRequested: boolean;
  } | null>(null);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const isReturnsTab = filter === "Returns";

  const fetchOrders = useCallback(
    async (silent = false) => {
      if (!localStorage.getItem("token")) {
        router.push("/login");
        return;
      }

      try {
        if (!silent) setLoading(true);
        setError("");

        getEligibleReturnIds()
          .then(setEligible)
          .catch(() => {});

        if (filter === "Returns") {
          setReturns(await getReturnHistory());
          return;
        }

        const raw = await getMyOrders(filter as OrderFilter);

        setOrders(
          raw
            .map(parseOrder)
            .filter((o): o is ParsedOrder => o !== null)
        );
      } catch (err: any) {
        if (err?.response?.status === 401) {
          router.push("/login");
          return;
        }

        if (!silent) {
          setError("Failed to load your orders. Please try again.");
        }
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [filter, router]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Keep active orders fresh (status changes / OTP assignment)
  useEffect(() => {
    const t = setInterval(() => fetchOrders(true), 15000);
    return () => clearInterval(t);
  }, [fetchOrders]);

  // keep the open detail view in sync with refreshed data
  const selected = selectedSnapshot
    ? orders.find((o) => o.rawId === selectedSnapshot.rawId) ??
      selectedSnapshot
    : null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleRequestReturn = async () => {
    if (!selected) return;

    try {
      setReturning(true);

      const returnId = await requestReturn(selected.rawId);

      setConfirmReturn(false);
      setOtp("");
      setOtpError("");
      setOtpTarget({
        returnId,
        orderId: selected.rawId,
        justRequested: true,
      });
      fetchOrders(true);
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to request return"
      );
    } finally {
      setReturning(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpTarget) return;

    if (otp.trim().length !== 6) {
      setOtpError("Enter the 6-digit OTP");
      return;
    }

    try {
      setVerifying(true);
      setOtpError("");

      await verifyReturnOtp(otpTarget.returnId, otp.trim());

      setEligible((e) => e.filter((id) => id !== otpTarget.orderId));
      setOtpTarget(null);
      setSelected(null);
      showToast("Return completed successfully");
      await fetchOrders(true);
    } catch (err: any) {
      setOtpError(
        err?.response?.data?.message || err?.message || "Invalid OTP"
      );
    } finally {
      setVerifying(false);
    }
  };

  const closeOtp = () => {
    if (verifying) return;
    if (otpTarget?.justRequested) {
      showToast(
        "Return requested. Visit the store, then enter its OTP from the Returns tab."
      );
    }
    setOtpTarget(null);
  };

  const handleCancel = async () => {
    if (!selected) return;

    try {
      setCancelling(true);

      await cancelOrder(selected.rawId, reason);

      setShowCancel(false);
      showToast("Order cancelled successfully");
      await fetchOrders(true);
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6">
      <div className="mx-auto w-full max-w-3xl">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white"
          >
            <ArrowLeft size={18} className="text-[#0F172A]" />
          </button>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
            My Orders
          </h1>
        </div>

        {/* FILTERS */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                filter === f
                  ? "border-[#0F172A] bg-[#0F172A] font-bold text-white"
                  : "border-slate-200 bg-white font-medium text-[#64748B]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="mt-4 space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl bg-slate-200"
              />
            ))
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => fetchOrders()}
                className="mt-3 rounded-lg bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white"
              >
                Retry
              </button>
            </div>
          ) : isReturnsTab ? (
            returns.length === 0 ? (
              <div className="flex flex-col items-center py-20">
                <div className="rounded-full bg-[#F1F5F9] p-5">
                  <Undo2 size={44} className="text-[#94A3B8]" />
                </div>
                <p className="mt-3 text-base font-bold text-[#0F172A]">
                  No Returns Yet
                </p>
                <p className="mt-1 text-xs text-[#64748B]">
                  Items you return will appear here.
                </p>
              </div>
            ) : (
              returns.map((r, i) => {
                const order =
                  r?.orderId && typeof r.orderId === "object"
                    ? r.orderId
                    : r?.order && typeof r.order === "object"
                    ? r.order
                    : {};
                const orderNo =
                  rtext(order, ["orderNumber", "_id"]) ||
                  rtext(r, ["orderNumber", "orderId"]);
                const rawStatus =
                  rtext(r, ["status", "returnStatus"]) || "Requested";
                const status = rawStatus
                  .replace(/[_-]/g, " ")
                  .replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
                const amount =
                  rtext(r, ["refundAmount", "amount"]) ||
                  rtext(order, ["totalAmount", "grandTotal", "total"]);
                const returnId = rtext(r, ["_id", "returnId", "id"]);
                const awaitingOtp =
                  !!returnId &&
                  !/complete|returned|refund|reject|cancel|verified|success|done/.test(
                    status.toLowerCase()
                  );
                const products =
                  order.products ?? order.items ?? r.products ?? r.items;
                const titles: string[] = Array.isArray(products)
                  ? products
                      .map((p: any) =>
                        rtext(
                          p?.postId && typeof p.postId === "object"
                            ? p.postId
                            : p,
                          ["title", "name"]
                        )
                      )
                      .filter(Boolean)
                  : [];

                return (
                  <div
                    key={returnId || i}
                    className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#0F172A]">
                        {orderNo ? `#${orderNo}` : "Return"}
                      </span>
                      <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#3B82F6]">
                        {status}
                      </span>
                    </div>

                    {titles.length > 0 && (
                      <p className="mt-2 line-clamp-2 text-sm text-[#0F172A]">
                        {titles.join(", ")}
                      </p>
                    )}

                    <div className="mt-2 flex items-center justify-between text-xs text-[#64748B]">
                      <span>
                        {fmtReturnDate(
                          r.createdAt ?? r.requestedAt ?? r.updatedAt
                        )}
                      </span>
                      {amount && (
                        <span className="text-sm font-bold text-[#0F172A]">
                          ₹{amount}
                        </span>
                      )}
                    </div>

                    {awaitingOtp && (
                      <button
                        type="button"
                        onClick={() => {
                          setOtp("");
                          setOtpError("");
                          setOtpTarget({
                            returnId,
                            orderId:
                              rtext(order, ["_id"]) ||
                              rtext(r, ["orderId"]),
                            justRequested: false,
                          });
                        }}
                        className="mt-3 w-full rounded-lg bg-[#0F172A] px-4 py-2 text-sm font-bold text-white"
                      >
                        Enter store OTP
                      </button>
                    )}
                  </div>
                );
              })
            )
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center py-20">
              <div className="rounded-full bg-[#F1F5F9] p-5">
                <ShoppingBag size={44} className="text-[#94A3B8]" />
              </div>
              <p className="mt-3 text-base font-bold text-[#0F172A]">
                No Orders Found
              </p>
              <p className="mt-1 text-xs text-[#64748B]">
                Your orders will appear here once placed.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.rawId}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(order)}
                onKeyDown={(e) =>
                  e.key === "Enter" && setSelected(order)
                }
                className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#0F172A]">
                    {order.id}
                  </span>
                  <StatusBadge order={order} />
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <OrderImage src={order.image} size={56} />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#0F172A]">
                      {order.title}
                    </p>

                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs font-medium text-[#475569]">
                      <StoreIcon size={13} />
                      {order.storeName}
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-[#64748B]">
                      {order.itemCount} • {order.date} •{" "}
                      <span className="font-semibold">
                        {order.orderType}
                      </span>
                    </p>
                  </div>

                  <span className="text-base font-extrabold text-[#0F172A]">
                    {order.price}
                  </span>
                </div>

                <div className="mt-3">
                  <OtpBox order={order} />
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-medium text-[#64748B]">
                  Tap to view order details
                  <ChevronRight size={16} className="text-[#94A3B8]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* DETAILS */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0F172A]">
                Order {selected.id}
              </h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-50"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <StatusBadge order={selected} />
              <span className="text-xs text-[#64748B]">
                {selected.date}
              </span>
            </div>

            {selected.isCancelled && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
                <p className="text-sm font-bold text-[#DC2626]">
                  Order Cancelled
                </p>
                <p className="text-xs text-[#991B1B]">
                  This order was cancelled by {selected.cancelledBy}.
                  {selected.cancelReason
                    ? ` Reason: ${selected.cancelReason}`
                    : ""}
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              <OrderImage src={selected.image} size={72} />
              <div className="min-w-0">
                <p className="font-bold text-[#0F172A]">
                  {selected.title}
                </p>
                <p className="flex items-center gap-1 text-xs text-[#475569]">
                  <StoreIcon size={13} />
                  {selected.storeName}
                </p>
                <p className="text-xs text-[#64748B]">
                  {selected.itemCount}
                  {selected.size ? ` • Size ${selected.size}` : ""}
                  {selected.color ? ` • ${selected.color}` : ""}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <OtpBox order={selected} />
            </div>

            {selected.address && (
              <div className="mt-4 flex gap-2 rounded-xl bg-[#F8FAFC] p-3 text-xs text-[#475569]">
                <MapPin size={16} className="shrink-0 text-[#6D28D9]" />
                <span>{selected.address}</span>
              </div>
            )}

            <dl className="mt-4 space-y-2 rounded-xl border border-slate-100 p-3 text-sm">
              {[
                ["Order type", selected.orderType],
                ["Unit price", selected.unitPrice],
                ["Delivery charge", selected.deliveryCharge],
                ["Payment method", selected.paymentMethod],
                ["Payment status", selected.paymentStatus],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-[#64748B]">{k}</dt>
                  <dd className="font-medium capitalize text-[#0F172A]">
                    {v}
                  </dd>
                </div>
              ))}
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <dt className="font-bold text-[#0F172A]">Total</dt>
                <dd className="font-extrabold text-[#0F172A]">
                  {selected.price}
                </dd>
              </div>
            </dl>

            {eligible.includes(selected.rawId) && (
              <button
                type="button"
                onClick={() => setConfirmReturn(true)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-[#0F172A] transition hover:bg-slate-50"
              >
                <Undo2 size={18} />
                Return (within 24 hours)
              </button>
            )}

            {selected.cancellable && (
              <button
                type="button"
                onClick={() => {
                  setReason(CANCEL_REASONS[0]);
                  setShowCancel(true);
                }}
                className="mt-5 w-full rounded-xl border border-red-300 px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      )}

      {/* CANCEL REASON */}
      {showCancel && selected && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center"
          onClick={() => !cancelling && setShowCancel(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-white p-5 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[#0F172A]">
              Cancel Order
            </h3>
            <p className="mt-1 text-sm text-[#64748B]">
              Please select a reason for cancelling order {selected.id}:
            </p>

            <div className="mt-3">
              {CANCEL_REASONS.map((r) => (
                <label
                  key={r}
                  className="flex cursor-pointer items-center gap-2 py-2 text-sm"
                >
                  <input
                    type="radio"
                    name="cancel-reason"
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-red-500"
                  />
                  <span
                    className={
                      reason === r
                        ? "font-bold text-[#0F172A]"
                        : "text-[#475569]"
                    }
                  >
                    {r}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                disabled={cancelling}
                onClick={() => setShowCancel(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-[#64748B]"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancel}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {cancelling && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RETURN CONFIRM */}
      {confirmReturn && selected && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center"
          onClick={() => !returning && setConfirmReturn(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-white p-5 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[#0F172A]">
              Return this order?
            </h3>
            <p className="mt-1 text-sm text-[#64748B]">
              Orders can be returned within 24 hours of purchase. The store
              will receive an OTP. Take the product to the store, and enter
              the OTP the store gives you to complete the return.
            </p>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                disabled={returning}
                onClick={() => setConfirmReturn(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-[#64748B]"
              >
                Not now
              </button>
              <button
                type="button"
                disabled={returning}
                onClick={handleRequestReturn}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {returning && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RETURN OTP */}
      {otpTarget && (
        <div
          className="fixed inset-0 z-[65] flex items-end justify-center bg-black/50 sm:items-center"
          onClick={closeOtp}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-white p-5 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[#0F172A]">
              {otpTarget.justRequested
                ? "Return requested"
                : "Verify return OTP"}
            </h3>
            <p className="mt-1 text-sm text-[#64748B]">
              {otpTarget.justRequested
                ? "Take the product to the store. Once the store gives you the 6-digit OTP, enter it here. You can also do this later from the Returns tab."
                : "Enter the 6-digit OTP given by the store to complete your return."}
            </p>

            <input
              autoFocus
              inputMode="numeric"
              maxLength={6}
              value={otp}
              placeholder="------"
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
              className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-lg font-bold tracking-[0.5em] outline-none focus:border-[#0F172A]"
            />
            {otpError && (
              <p className="mt-1 text-xs text-red-600">{otpError}</p>
            )}

            <button
              type="button"
              disabled={verifying}
              onClick={handleVerifyOtp}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {verifying && <Loader2 size={16} className="animate-spin" />}
              Verify & Return
            </button>

            {otpTarget.justRequested && (
              <button
                type="button"
                disabled={verifying}
                onClick={closeOtp}
                className="mt-2 w-full rounded-xl px-4 py-2 text-sm font-semibold text-[#64748B]"
              >
                I&apos;ll do it at the store
              </button>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-xl bg-[#0F172A] px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
