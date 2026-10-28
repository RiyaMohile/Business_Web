
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import { getMyStores } from "@/app/services/businessStoreApi";

interface StoreSubscription {
  subscriptionId?: string | { _id?: string } | null;
  expireAt?: string | null;
}

interface StoreData {
  _id?: string;
  storeId?: string;
  subscription?: StoreSubscription | null;
}

export default function StoreSubscriptionCard() {
  const router = useRouter();

  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedStoreId, setSelectedStoreId] = useState("");

  const checkSubscription = useCallback(async () => {
    try {
      setLoading(true);

      const storeId = localStorage.getItem("selectedStoreId") || "";
      setSelectedStoreId(storeId);

      if (!storeId) {
        setHasActivePlan(false);
        return;
      }

      const response = await getMyStores();

      const stores: StoreData[] = Array.isArray(response?.stores)
        ? response.stores
        : [];

      const selectedStore = stores.find(
        (item) =>
          item._id === storeId || item.storeId === storeId
      );

      const subscription = selectedStore?.subscription;

      const subscriptionId =
        typeof subscription?.subscriptionId === "object"
          ? subscription.subscriptionId?._id
          : subscription?.subscriptionId;

      const expiryTime = subscription?.expireAt
        ? new Date(subscription.expireAt).getTime()
        : NaN;

      const active =
        Boolean(subscriptionId) &&
        Number.isFinite(expiryTime) &&
        expiryTime >= Date.now();

      setHasActivePlan(active);
    } catch (error) {
      console.error("SUBSCRIPTION CHECK ERROR:", error);
      setHasActivePlan(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSubscription();

    window.addEventListener(
      "selectedStoreChanged",
      checkSubscription
    );

    return () => {
      window.removeEventListener(
        "selectedStoreChanged",
        checkSubscription
      );
    };
  }, [checkSubscription]);

  const openPlans = () => {
    router.push(
      `/business-dashboard/plans?storeId=${encodeURIComponent(
        selectedStoreId
      )}`
    );
  };

  
return (
  <div
    className="
      mt-2
      flex
      w-full
      items-center
      justify-between
      rounded-xl
      border
      border-slate-200
      bg-white
      px-6
      py-2
      shadow-sm
      md:hidden
    "
  >
    {/* LEFT SIDE: Subscription Details */}
    <div className="flex  min-w-0 items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
        <CreditCard size={20} />
      </div>

      <div className="min-w-0">
        <p className="text-[16px] text-slate-400">
          Store Subscription
        </p>

        {loading ? (
          <p className="mt-0.5 text-[13px] text-slate-400">
            Checking plan...
          </p>
        ) : (
          <div className="mt-0.5 flex items-center gap-1.5">
            {hasActivePlan ? (
              <CheckCircle2
                size={15}
                className="shrink-0 text-emerald-600"
              />
            ) : (
              <AlertCircle
                size={15}
                className="shrink-0 text-amber-600"
              />
            )}

            <span
              className={`text-[13px] font-semibold ${
                hasActivePlan
                  ? "text-emerald-700"
                  : "text-amber-700"
              }`}
            >
              {hasActivePlan
                ? "Active Plan"
                : "No Active Plan"}
            </span>
          </div>
        )}
      </div>
    </div>

    {/* RIGHT SIDE: Subscription Button */}
    <button
      type="button"
      onClick={openPlans}
      disabled={loading || !selectedStoreId}
      className="
        ml-3
        shrink-0
        rounded-lg
        bg-violet-600
        px-3
        py-2
        text-xs
        font-semibold
        text-white
        transition
        hover:bg-violet-700
        disabled:opacity-50
      "
    >
      Subscription Plan
    </button>
  </div>
);

}
