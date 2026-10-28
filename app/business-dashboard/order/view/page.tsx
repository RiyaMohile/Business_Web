"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  searchRiders,
  notifyNearbyRiders,
} from "../../../services/orderApi";

import {
  ArrowLeft,
  Copy,
  CheckCircle2,
  Bell,
  Package,
  Users,
  RefreshCw,
  MapPin,
  Phone,
  UserRound,
  Clipboard,
} from "lucide-react";

interface Rider {
  _id: string;

  name?: string;
  username?: string;
  phoneNumber?: string;

  userId?: {
    _id: string;
    name?: string;
    username?: string;
    phoneNumber?: string;
  };

  address?: {
    _id: string;
    name?: string;
    street?: string;
    area?: string;
    city?: string;
    state?: string;
    country?: string;
    pinCode?: string;
    latitude?: number;
    longitude?: number;
  } | null;
}

function FindRidersContent() {
  const searchParams = useSearchParams();
const router = useRouter();

const orderId = searchParams.get("id");
const orderNumber = searchParams.get("orderNumber");

  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifying, setNotifying] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [copied, setCopied] = useState(false);

  // ==========================================
  // FIND ONLINE RIDERS
  // ==========================================

  const fetchRiders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await searchRiders();

      console.log("SEARCH RIDERS RESPONSE:", response);

      setRiders(response?.riders || []);
    } catch (error: any) {
      console.error("SEARCH RIDERS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to find nearby riders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchRiders();
    }
  }, [orderId]);

  // ==========================================
  // NOTIFY RIDERS
  // ==========================================

  const handleNotifyRiders = async () => {
    try {
      if (!orderId) {
    setError("Order ID is missing.");
    return;
  }
      setNotifying(true);
      setError("");
      setMessage("");

      const response = await notifyNearbyRiders(orderId);

      console.log(
        "NOTIFY RIDERS RESPONSE:",
        response
      );

      setMessage(
        response?.message ||
          "Nearby riders have been notified."
      );
    } catch (error: any) {
      console.error(
        "NOTIFY NEARBY RIDERS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to notify riders."
      );
    } finally {
      setNotifying(false);
    }
  };

  // ==========================================
  // COPY ORDER ID
  // ==========================================

  const handleCopyOrderId = async () => {
  try {
    if (!orderNumber) {
      setError("Order number is missing.");
      return;
    }

    await navigator.clipboard.writeText(orderNumber);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  } catch (error) {
    console.error("COPY ERROR:", error);
  }
};

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f8fc] px-4 py-5">

        <div className="mx-auto w-full max-w-[480px]">

          {/* HEADER */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/business-dashboard/order"
                )
              }
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
                text-slate-700
                shadow-sm
                border
                border-slate-100
              "
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Find Riders
              </h1>

              <p className="text-[11px] text-slate-500">
                Find online riders for this order.
              </p>
            </div>

          </div>

          <div
            className="
              mt-5
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-5
              py-12
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-blue-50
              "
            >
              <RefreshCw
                size={22}
                className="animate-spin text-blue-600"
              />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              Finding riders...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Searching for available riders
            </p>
          </div>

        </div>
      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-[#f8f8fc] px-3 py-4 sm:px-5 sm:py-6">

      <div className="mx-auto w-full max-w-[480px]">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/business-dashboard/order"
              )
            }
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white
              text-slate-700
              shadow-sm
              border
              border-slate-100
              transition
              hover:bg-slate-50
            "
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0">

            <h1 className="text-lg font-bold text-slate-900">
              Find Riders
            </h1>

            <p className="text-[11px] text-slate-500">
              Find online riders for this order.
            </p>

          </div>

        </div>

        {/* =================================================
            ORDER ID
        ================================================= */}

        <div
          className="
            mt-4
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            shadow-sm
          "
        >

          <div className="flex items-center justify-between gap-3">

            <div className="min-w-0">

              <p className="text-[10px] font-medium text-slate-400">
                Order ID
              </p>

              <p className="mt-0.5 truncate text-sm font-bold text-slate-800">
                 #{orderNumber || "-"}
              </p>

            </div>

            <button
              type="button"
              onClick={handleCopyOrderId}
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-slate-50
                text-slate-500
                transition
                hover:bg-blue-50
                hover:text-blue-600
              "
            >
              {copied ? (
                <CheckCircle2
                  size={16}
                  className="text-green-500"
                />
              ) : (
                <Copy size={16} />
              )}
            </button>

          </div>

        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (
          <div
            className="
              mt-3
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-green-200
              bg-green-50
              px-3
              py-2.5
            "
          >

            <CheckCircle2
              size={16}
              className="shrink-0 text-green-600"
            />

            <p className="text-[11px] font-medium text-green-700">
              {message}
            </p>

          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="
              mt-3
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-3
              py-2.5
            "
          >
            <p className="text-[11px] font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mt-4 grid grid-cols-3 gap-2">

          {/* ONLINE RIDERS */}

          <div
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              p-3
              shadow-sm
            "
          >

            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-blue-50
              "
            >
              <Users
                size={16}
                className="text-blue-600"
              />
            </div>

            <p className="mt-2 text-[10px] text-slate-400">
              Online Riders
            </p>

            <p className="mt-0.5 text-xl font-bold text-blue-600">
              {riders.length}
            </p>

            <p className="text-[9px] text-slate-400">
              Riders available
            </p>

          </div>

          {/* ORDER */}

          <div
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              p-3
              shadow-sm
            "
          >

            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-purple-50
              "
            >
              <Package
                size={16}
                className="text-purple-500"
              />
            </div>

            <p className="mt-2 text-[10px] text-slate-400">
              Order
            </p>

            <p className="mt-0.5 truncate text-sm font-bold text-slate-800">
                 #{orderNumber || "-"}
            </p>

            <p className="text-[9px] text-slate-400">
              Current Order
            </p>

          </div>

          {/* NOTIFY */}

          <button
            type="button"
            onClick={handleNotifyRiders}
            disabled={notifying}
            className="
              rounded-xl
              border
              border-blue-500
              bg-blue-600
              p-3
              text-left
              shadow-sm
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >

            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-white/20
              "
            >
              <Bell
                size={16}
                className="text-white"
              />
            </div>

            <p className="mt-2 text-[10px] font-medium text-white">
              {notifying
                ? "Notifying..."
                : "Notify Nearby"}
            </p>

            <p className="text-[10px] font-medium text-white">
              Riders
            </p>

          </button>

        </div>

        {/* =================================================
            AVAILABLE RIDERS HEADER
        ================================================= */}

        <div className="mt-5">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-sm font-bold text-slate-900">
                Available Riders
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Riders currently online
              </p>

            </div>

            <button
              type="button"
              onClick={fetchRiders}
              disabled={loading}
              className="
                flex
                items-center
                gap-1.5
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                py-1.5
                text-[10px]
                font-medium
                text-slate-600
                shadow-sm
                hover:bg-slate-50
              "
            >
              <RefreshCw
                size={12}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

          </div>

        </div>

        {/* =================================================
            RIDERS LIST
        ================================================= */}

        <div className="mt-3 space-y-2">

          {riders.length === 0 ? (

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-5
                py-10
                text-center
                shadow-sm
              "
            >

              <div
                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-100
                "
              >
                <Users
                  size={24}
                  className="text-slate-400"
                />
              </div>

              <h3 className="mt-3 text-sm font-semibold text-slate-700">
                No online riders found
              </h3>

              <p className="mt-1 text-[11px] text-slate-400">
                There are currently no riders available.
              </p>

              <button
                type="button"
                onClick={fetchRiders}
                className="
                  mt-4
                  rounded-lg
                  bg-blue-600
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-white
                  hover:bg-blue-700
                "
              >
                Search Again
              </button>

            </div>

          ) : (

            riders.map((rider) => {

              const riderName =
                rider.userId?.name ||
                rider.name ||
                rider.userId?.username ||
                rider.username ||
                "Rider";

              const phone =
                rider.userId?.phoneNumber ||
                rider.phoneNumber ||
                "-";

              const city = rider.address?.city || "";
const area = rider.address?.area || "";

              return (
                <div
                  key={rider._id}
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-3
                    shadow-sm
                    transition
                    hover:border-blue-200
                  "
                >

                  <div className="flex items-center gap-3">

                    {/* AVATAR */}

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-full
                        bg-blue-50
                      "
                    >
                      <UserRound
                        size={22}
                        className="text-blue-600"
                      />
                    </div>

                    {/* RIDER DETAILS */}

                    <div className="min-w-0 flex-1">

                      <h3 className="truncate text-sm font-bold text-slate-800">
                        {riderName}
                      </h3>

                      <div className="mt-1 flex items-center gap-1">

                        <Phone
                          size={10}
                          className="shrink-0 text-slate-400"
                        />

                        <p className="truncate text-[10px] text-slate-500">
                          {phone}
                        </p>

                      </div>

                      <div className="mt-0.5 flex items-center gap-1">

                        <MapPin
                          size={10}
                          className="shrink-0 text-slate-400"
                        />

                        <p className="truncate text-[10px] text-slate-400">
                          {area && city
                            ? `${area}, ${city}`
                            : area || city || "Location unavailable"}
                        </p>

                      </div>

                    </div>

                    {/* ONLINE */}

                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        gap-1
                        rounded-md
                        bg-green-50
                        px-2
                        py-1
                      "
                    >

                      <span
                        className="
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-green-500
                        "
                      />

                      <span className="text-[9px] font-semibold text-green-600">
                        Online
                      </span>

                    </div>

                  </div>

                </div>
              );
            })

          )}

        </div>

      </div>

    </main>
  );
}

export default function FindRidersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FindRidersContent />
    </Suspense>
  );
}