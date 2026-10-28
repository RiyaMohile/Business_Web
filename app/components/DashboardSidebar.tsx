
"use client";

import {
  Home,
  Package,
  ShoppingBag,
  ReceiptText,
  CreditCard,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMyStores } from "@/app/services/businessStoreApi";

interface StoreSubscription {
  subscriptionId?: string | { _id?: string } | null;
  expireAt?: string | Date | null;
}

interface Store {
  _id: string;
  storeId?: string;
  users?: {
    userId: string | { _id?: string };
    status: string;
    role: string;
  }[];
  subscription?: StoreSubscription | null;
}

export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isManager, setIsManager] = useState(false);
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [selectedPublicStoreId, setSelectedPublicStoreId] =
  useState("");

  useEffect(() => {
    const checkStoreAndRole = async () => {
      try {
        const selectedStoreId =
          localStorage.getItem("selectedStoreId");

        const userData = localStorage.getItem("user");

        if (!userData) {
          setHasStore(false);
          setIsManager(false);
          setHasActivePlan(false);
          return;
        }

        const user = JSON.parse(userData);
        const response = await getMyStores();

        if (
          !response?.success ||
          !Array.isArray(response?.stores)
        ) {
          setHasStore(false);
          setIsManager(false);
          setHasActivePlan(false);
          return;
        }

        const stores: Store[] = response.stores;

        if (stores.length === 0) {
          setHasStore(false);
          setIsManager(false);
          setHasActivePlan(false);
          return;
        }

        setHasStore(true);

        if (!selectedStoreId) {
          setIsManager(false);
          setHasActivePlan(false);
          return;
        }

        const selectedStore = stores.find(
  (store) =>
    store._id?.toString() === selectedStoreId.toString() ||
    store.storeId?.toString() === selectedStoreId.toString()
);

if (!selectedStore) {
  setIsManager(false);
  setHasActivePlan(false);
  setSelectedPublicStoreId("");
  return;
}

// Public/business Store ID — MongoDB _id nahi
setSelectedPublicStoreId(selectedStore.storeId || "");

        // Check manager role
        const member = selectedStore.users?.find((item) => {
          const memberUserId =
            typeof item.userId === "object"
              ? item.userId?._id
              : item.userId;

          return (
            memberUserId?.toString() === user?._id?.toString() &&
            item.status === "active"
          );
        });

        setIsManager(member?.role === "manager");

        // Check subscription for selected store
        const subscription = selectedStore.subscription;
        const subscriptionId =
          typeof subscription?.subscriptionId === "object"
            ? subscription.subscriptionId?._id
            : subscription?.subscriptionId;

        const expireAt = subscription?.expireAt
          ? new Date(subscription.expireAt).getTime()
          : 0;

        const active =
          Boolean(subscriptionId) &&
          Boolean(expireAt) &&
          !Number.isNaN(expireAt) &&
          expireAt >= Date.now();

        setHasActivePlan(active);
      } catch (error) {
        console.error("SIDEBAR CHECK ERROR:", error);
        setHasStore(false);
        setIsManager(false);
        setHasActivePlan(false);
      }
    };

    checkStoreAndRole();

    const handleStoreChanged = () => {
      checkStoreAndRole();
    };

    window.addEventListener("selectedStoreChanged", handleStoreChanged);

    return () => {
      window.removeEventListener(
        "selectedStoreChanged",
        handleStoreChanged
      );
    };
  }, []);

  const items = [
    {
      label: "Dashboard",
      icon: Home,
      path: "/business-dashboard",
    },
    {
      label: "Products",
      icon: Package,
      path: "/business-dashboard/product",
    },
    {
      label: "Orders",
      icon: ShoppingBag,
      path: "/business-dashboard/order",
    },
    {
      label: "Bill",
      icon: ReceiptText,
      path: "/business-dashboard/bill",
    },
    {
      label: "Subscription Plan",
      icon: CreditCard,
      path: "/business-dashboard/plans",
    },
  ];

  if (hasStore !== true) {
    return null;
  }

  const selectedStoreId =
    typeof window !== "undefined"
      ? localStorage.getItem("selectedStoreId")
      : null;

  const handleNavigation = (path: string) => {
  if (path === "/business-dashboard/plans") {
    if (!selectedPublicStoreId) {
      console.error("Public Store ID is missing");
      return;
    }

    router.push(
      `${path}?storeId=${encodeURIComponent(
        selectedPublicStoreId
      )}`
    );

    return;
  }

  if (
    !hasActivePlan &&
    [
      "/business-dashboard/product",
      "/business-dashboard/order",
      "/business-dashboard/bill",
    ].includes(path)
  ) {
    if (!selectedPublicStoreId) {
      console.error("Public Store ID is missing");
      return;
    }

    router.push(
      `/business-dashboard/plans?storeId=${encodeURIComponent(
        selectedPublicStoreId
      )}`
    );

    return;
  }

  router.push(path);
};

  return (
    <aside
      className="
        fixed left-0 top-20 z-40 hidden
        h-[calc(100dvh-80px)] w-[248px]
        border-r border-slate-200 bg-white md:block
      "
    >
      <div className="flex h-full flex-col px-5 py-6">
        <div
          className={`mb-5 rounded-xl border p-4 ${
            hasActivePlan
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <p className="text-xs font-medium text-slate-500">
            Store Subscription
          </p>

          <p
            className={`mt-1 text-sm font-bold ${
              hasActivePlan
                ? "text-emerald-700"
                : "text-amber-700"
            }`}
          >
            {hasActivePlan ? "Active Plan" : "No Active Plan"}
          </p>

          {!hasActivePlan && (
            <button
              type="button"
              onClick={() => handleNavigation("/business-dashboard/plans")}
              className="mt-3 w-full rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Choose Subscription Plan
            </button>
          )}
        </div>

        <nav className="flex flex-col gap-2">
          {items.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.path ||
              (item.path !== "/business-dashboard" &&
                pathname.startsWith(`${item.path}/`));

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavigation(item.path)}
                className={`
                  flex w-full items-center gap-4 rounded-xl
                  px-4 py-3.5 text-left transition-all
                  ${
                    isActive
                      ? "bg-violet-50 text-violet-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }
                `}
              >
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={
                    isActive ? "text-violet-600" : "text-slate-600"
                  }
                />

                <span className="text-sm font-semibold">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
