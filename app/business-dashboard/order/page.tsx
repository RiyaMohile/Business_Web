"use client";

import { useEffect, useState } from "react";
import { getStoreOrders, cancelOrderByStore, notifyNearbyRiders,updateOrderStatus,getCompletedStoreOrders } from "../../services/orderApi";
import { useRouter } from "next/navigation";

import LowStockDetails from "./LowStockDetails";
import axios from "axios";
import MobileDashboardNav from "@/app/components/dashboard/MobileDashboardNav";
import Navbar from "@/app/components/BusinessNavbar";
import DashboardSidebar from "@/app/components/DashboardSidebar";

import {
  updateStoreOnlineStatus,
  getMyStores,
} from "../../services/businessStoreApi";

interface Order {
  _id: string;
  orderNumber: string;
  status: string;

  customerUserId?: {
    _id: string;
    username?: string;
    name?: string;
  };

  postDetails?: {
    postId?: {
      _id: string;
      topic?: string;
      description?: string;
      media?: {
        mediaUrl: string;
      }[];
    };

    color?: string;
    size?: string;
    quantity?: number;
    currentPricePerQuantity?: number;
  };

  paymentDetails?: {
    grandTotal?: number;
    deliveryCharge?: number;
    paymentStatus?: string;
  };

  deliveryDetail?: {
    riderUserId?: string | null;
    otp?: number | null;
    isOtpVerified?: boolean;
    distanceKM?: number;
  };

  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] =useState("all");
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [notifyingOrderId, setNotifyingOrderId] =
  useState<string | null>(null);

    const router = useRouter();

    const [showLowStock, setShowLowStock] = useState(false);
const [lowStockCount, setLowStockCount] = useState(0);
const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
const [isOnline, setIsOnline] = useState(false);
const [updatingStatus, setUpdatingStatus] = useState(false);

useEffect(() => {
  const fetchLowStockCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const storeId = localStorage.getItem("selectedStoreId");

      console.log("========== LOW STOCK DEBUG ==========");
      console.log("LOW STOCK STORE ID:", storeId);
      console.log("=====================================");

      if (!storeId) {
        setLowStockCount(0);
        return;
      }

      const response = await axios.get(
        `https://api.thover.in/v2/api/order/low-stock?storeId=${storeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("LOW STOCK RESPONSE:", response.data);

      if (response.data.success) {
        setLowStockCount(response.data.total || 0);
      }
    } catch (error: any) {
      console.error(
        "LOW STOCK ERROR:",
        error.response?.data || error
      );

      setLowStockCount(0);
    }
  };

  fetchLowStockCount();

  const handleStoreChange = () => {
    console.log("STORE CHANGED → REFETCH LOW STOCK");
    fetchLowStockCount();
  };

  window.addEventListener(
    "selectedStoreChanged",
    handleStoreChange
  );

  return () => {
    window.removeEventListener(
      "selectedStoreChanged",
      handleStoreChange
    );
  };
}, []);

  // ==========================================
  // FETCH ORDERS
  // ==========================================

useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // ==============================
      // GET SELECTED STORE
      // ==============================

      const storeId = localStorage.getItem("selectedStoreId");
        setSelectedStoreId(storeId);

      console.log(
        "ORDERS - SELECTED STORE ID:",
        selectedStoreId
      );

      if (!storeId) {
        setOrders([]);
        setError("Please select a store first.");
        return;
      }

console.log("========== ORDER DEBUG ==========");
console.log("selectedStoreId:", selectedStoreId);
console.log("selectedStatus:", selectedStatus);
console.log("================================");

      let response;

      // ==============================
      // FETCH ORDERS
      // ==============================

      if (selectedStatus === "completed") {
        response = await getCompletedStoreOrders(
          storeId
        );
      } else if (selectedStatus === "all") {
        response = await getStoreOrders(
          undefined,
          storeId
        );
      } else {
        response = await getStoreOrders(
          selectedStatus,
          storeId
        );
      }

      console.log(
        "ORDERS RESPONSE:",
        response
      );

      setOrders(response?.orders || []);

    } catch (error: any) {
      console.error(
        "GET ORDERS ERROR:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Unable to fetch orders."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();

  

  // ==============================
  // STORE SWITCH LISTENER
  // ==============================

  const handleStoreChange = () => {
    console.log(
      "STORE CHANGED → REFETCH ORDERS"
    );

    fetchOrders();
  };

  window.addEventListener(
    "selectedStoreChanged",
    handleStoreChange
  );

  return () => {
    window.removeEventListener(
      "selectedStoreChanged",
      handleStoreChange
    );
  };
}, [selectedStatus]);

useEffect(() => {
  fetchSelectedStoreStatus();
}, []);

useEffect(() => {
  const handleStoreChange = () => {
    fetchSelectedStoreStatus();
  };

  window.addEventListener(
    "selectedStoreChanged",
    handleStoreChange
  );

  return () => {
    window.removeEventListener(
      "selectedStoreChanged",
      handleStoreChange
    );
  };
}, []);

const handleAcceptOrder = async (orderId: string) => {
  try {
    setUpdatingOrderId(orderId);

    const response = await updateOrderStatus(
      orderId,
      "looking_for_rider"
    );

    if (response?.success) {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: "looking_for_rider",
              }
            : order
        )
      );
    } else {
      alert(
        response?.message ||
          "Unable to accept order."
      );
    }
  } catch (error: any) {
    console.error("ACCEPT ORDER ERROR:", error);

    alert(
      error.response?.data?.message ||
        "Unable to accept order."
    );
  } finally {
    setUpdatingOrderId(null);
  }
};

const handleNotifyRiders = async (
  orderId: string
) => {
  try {
    setUpdatingOrderId(orderId);

    const response =
      await notifyNearbyRiders(orderId);

    if (response?.success) {
      alert(
        response.message ||
          "Nearby riders notified successfully."
      );
    } else {
      alert(
        response?.message ||
          "Unable to notify riders."
      );
    }
  } catch (error: any) {
    console.error(
      "NOTIFY RIDERS ERROR:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Unable to notify riders."
    );
  } finally {
    setUpdatingOrderId(null);
  }
};
const handleCancelOrder = async (orderId: string) => {
  const reason = window.prompt(
    "Please enter the reason for cancelling this order:"
  );

  if (!reason?.trim()) {
    return;
  }

  try {
    setUpdatingOrderId(orderId);

    const response = await cancelOrderByStore(
      orderId,
      reason.trim()
    );

    if (response?.success) {
      alert(
        response.message ||
          "Order cancelled successfully."
      );

      // Order ko frontend list se update/remove karo
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: "cancelled_by_store",
              }
            : order
        )
      );
    } else {
      alert(
        response?.message ||
          "Unable to cancel order."
      );
    }
  } catch (error: any) {
    console.error(
      "CANCEL ORDER ERROR:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Unable to cancel order."
    );
  } finally {
    setUpdatingOrderId(null);
  }
};

const fetchSelectedStoreStatus = async () => {
  try {
    const selectedStoreId =
      localStorage.getItem("selectedStoreId");

    if (!selectedStoreId) {
      setIsOnline(false);
      return;
    }

    const response = await getMyStores();

    if (
      !response?.success ||
      !Array.isArray(response?.stores)
    ) {
      setIsOnline(false);
      return;
    }

    const selectedStore = response.stores.find(
      (store: any) =>
        String(store._id) === String(selectedStoreId)
    );

    setIsOnline(selectedStore?.isOnline ?? false);

  } catch (error: any) {
    console.error(
      "FETCH STORE ONLINE STATUS ERROR:",
      error.response?.data || error.message
    );

    setIsOnline(false);
  }
};

const handleOnlineStatusChange = async (
  nextStatus: boolean
) => {
  const selectedStoreId =
    localStorage.getItem("selectedStoreId");

  if (!selectedStoreId) {
    alert("Store not found");
    return;
  }

  try {
    setUpdatingStatus(true);

    const response =
      await updateStoreOnlineStatus(
        selectedStoreId,
        nextStatus
      );

    console.log(
      "ONLINE STATUS RESPONSE:",
      response
    );

    if (response?.success) {
      setIsOnline(nextStatus);
    } else {
      alert(
        response?.message ||
          "Unable to update store status"
      );
    }

  } catch (error: any) {
    console.error(
      "UPDATE ONLINE STATUS ERROR:",
      error.response?.data ||
        error.message
    );

    alert(
      error.response?.data?.message ||
        "Unable to update store status"
    );

  } finally {
    setUpdatingStatus(false);
  }
};

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">
            Orders
          </h1>

          <div className="mt-8 bg-white rounded-2xl p-8 text-center">
            Loading orders...
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-3xl font-bold">
            Orders
          </h1>

          <div className="mt-8 bg-white rounded-2xl p-8 text-center text-red-500">
            {error}
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
  <div
  className="
    min-h-screen
    bg-[#f8f8fc]
    px-3
    pb-24
    pt-20
    sm:px-5

    md:ml-[248px]
    md:w-[calc(100%-248px)]
    md:px-7
    md:pb-10
    md:pt-28
  "
>
  <Navbar
  onAccountModalChange={() => {}}
  isOnline={isOnline}
  onOnlineStatusChange={handleOnlineStatusChange}
  updatingStatus={updatingStatus}
/>
    <div className="hidden md:block">
  <DashboardSidebar />
</div>
    <div className="md:hidden">
  <MobileDashboardNav />
</div>
    <div className="mx-auto w-full max-w-md md:hidden">

      {/* =================================================
          HEADER
      ================================================= */}
      <div className="px-1">
        <h1 className="text-[20px] font-bold text-slate-900">
  Orders
</h1>

<p className="mt-1 text-[12px] text-slate-500">
  Manage and track your store orders
</p>
      </div>

      {/* =================================================
          LOW STOCK ALERT
      ================================================= */}
      <button
        type="button"
        onClick={() => setShowLowStock(true)}
        className="
          mt-4
          flex
          w-full
          items-center
          gap-3
          rounded-xl
          border
          border-orange-200
          bg-orange-50
          px-3
          py-2.5
          text-left
          transition
          hover:bg-orange-100
        "
      >
        {/* ICON */}
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-sm
          "
        >
          <span className="text-lg">
            📦
          </span>
        </div>

        {/* TEXT */}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold text-orange-600">
            Low Stock Alert
          </p>

          <p className="mt-0.5 truncate text-[8px] text-slate-500">
            {lowStockCount} items running low on stock
          </p>
        </div>

        {/* VIEW DETAILS */}
        <div className="flex items-center gap-1">
          <span
            className="
              rounded-md
              border
              border-orange-200
              bg-white
              px-2
              py-1
              text-[8px]
              font-medium
              text-orange-600
            "
          >
            View Details
          </span>

          <span className="text-sm text-orange-500">
            ›
          </span>
        </div>
      </button>
      {/* =================================================
    ORDER FILTER DROPDOWN
================================================= */}
<div className="mt-3 flex items-center justify-between px-1">

  {/* TOTAL ORDERS */}
  <div className="flex items-center gap-2">

    <span className="text-[12px] text-slate-500">
  Total Orders
</span>

<span className="text-[12px] font-bold text-[#6956d8]">
  {orders.length}
</span>
  </div>

  {/* FILTER DROPDOWN */}
  <select
  value={selectedStatus}
  onChange={(e) => setSelectedStatus(e.target.value)}
  className="
    rounded-xl
    border
    border-slate-200
    bg-white
    px-3
    py-2.5
    text-[12px]
    font-medium
    text-slate-600
    outline-none
    focus:border-[#6956d8]
    focus:ring-1
    focus:ring-[#6956d8]
  "
>
    <option value="all">
  All Orders
</option>

<option value="pending">
  Pending
</option>

<option value="active">
  Active
</option>

<option value="completed">
  Completed
</option>

<option value="cancelled">
  Cancelled
</option>
  </select>

</div>

      {/* =================================================
          LOADING
      ================================================= */}
      {loading ? (
        <div
          className="
            mt-3
            rounded-xl
            border
            border-slate-100
            bg-white
            px-5
            py-12
            text-center
            shadow-sm
          "
        >
          <p className="text-sm text-slate-500">
            Loading orders...
          </p>
        </div>
      ) : error ? (
        /* =================================================
            ERROR
        ================================================= */
        <div
          className="
            mt-3
            rounded-xl
            border
            border-red-100
            bg-white
            px-5
            py-10
            text-center
            shadow-sm
          "
        >
          <p className="text-sm text-red-500">
            {error}
          </p>
        </div>
      ) : orders.length === 0 ? (
        /* =================================================
            EMPTY
        ================================================= */
        <div
          className="
            mt-3
            rounded-xl
            border
            border-slate-100
            bg-white
            px-5
            py-12
            text-center
            shadow-sm
          "
        >
          <div className="text-4xl">
            📦
          </div>

          <h2 className="mt-3 text-sm font-bold text-slate-800">
            No orders yet
          </h2>

          <p className="mt-1 text-[10px] text-slate-400">
            Your store orders will appear here.
          </p>
        </div>
      ) : (
        /* =================================================
            ORDERS
        ================================================= */
        <div className="mt-3 space-y-2.5">

          {orders.map((order) => {

            const customerName =
              order.customerUserId?.name ||
              order.customerUserId?.username ||
              "Customer";

            const post =
              order.postDetails?.postId;

            const productImage =
              post?.media?.find(
                (media) => media.mediaUrl
              )?.mediaUrl;

            const quantity =
              order.postDetails?.quantity || 1;

            const grandTotal =
              order.paymentDetails?.grandTotal || 0;

            const deliveryCharge =
              order.paymentDetails?.deliveryCharge || 0;

            /* STATUS */
            const getStatusStyle = () => {
              switch (order.status) {

                case "new_order_request":
                  return {
                    label: "Pending",
                    className:
                      "bg-orange-50 text-orange-600",
                  };

                case "accepted":
                  return {
                    label: "Accepted",
                    className:
                      "bg-blue-50 text-blue-600",
                  };

                case "looking_for_rider":
                  return {
                    label: "Looking for Rider",
                    className:
                      "bg-purple-50 text-purple-600",
                  };

                case "packed_up":
                  return {
                    label: "Packed",
                    className:
                      "bg-yellow-50 text-yellow-600",
                  };

                case "out_for_delivery":
                  return {
                    label: "Out for Delivery",
                    className:
                      "bg-blue-50 text-blue-600",
                  };

                case "delivery_completed":
                case "completed":
                  return {
                    label: "Completed",
                    className:
                      "bg-green-50 text-green-600",
                  };

                case "cancelled":
case "cancelled_by_store":
case "cancelled_by_customer":
case "cancelled_by_rider":
  return {
    label: "Cancelled",
    className:
      "bg-red-50 text-red-600",
  };

                default:
                  return {
                    label: order.status,
                    className:
                      "bg-slate-50 text-slate-600",
                  };
              }
            };

            const statusStyle =
              getStatusStyle();

            return (
              <div
  key={order._id}
  className="
    rounded-xl
    border
    border-slate-100
    bg-white
    p-3
    shadow-sm
    transition
    hover:shadow-md
  "
>

                {/* =================================================
                    TOP ORDER SECTION
                ================================================= */}
                <div className="flex gap-2.5">

                  {/* IMAGE */}
                  <div
                    className="
                      h-[64px]
                      w-[64px]
                      shrink-0
                      overflow-hidden
                      rounded-lg
                      bg-slate-100
                    "
                  >
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={
                          post?.topic ||
                          "Product"
                        }
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-full
                          w-full
                          items-center
                          justify-center
                          text-xl
                        "
                      >
                        📦
                      </div>
                    )}
                  </div>

                  {/* MIDDLE */}
                  <div className="min-w-0 flex-1">

                    {/* ORDER NUMBER */}
                    <div className="flex items-start justify-between gap-1">

                      <p className="truncate text-[12px] font-bold text-slate-800">
                        #{order.orderNumber}
                      </p>

                      {/* STATUS */}
                      <span
                        className={`
                          shrink-0
                          rounded-md
                          px-2.5
                          py-1
                          text-[10px]
                          font-semibold
                          ${statusStyle.className}
                        `}
                      >
                        {statusStyle.label}
                      </span>

                    </div>

                    {/* DATE */}
                    <p className="mt-1 text-[10px] text-slate-400">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}{" "}
                      {new Date(
                        order.createdAt
                      ).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>

                    {/* CUSTOMER */}
                    <div className="mt-1 flex items-center gap-1">

                      <span className="text-[10px] text-slate-400">
                        ♙
                      </span>

                      <p className="truncate text-[10px] text-slate-500">
                        {customerName}
                      </p>

                    </div>

                  </div>

                  {/* PRICE */}
                  <div className="shrink-0 text-right">

                    <p className="text-[14px] font-bold text-slate-900">
                      ₹{grandTotal.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p className="mt-0.5 text-[9px] text-slate-400">
                      + ₹{deliveryCharge} delivery
                    </p>

                  </div>

                </div>

                {/* =================================================
                    BOTTOM
                ================================================= */}
                <div
                  className="
                    mt-2.5
                    flex
                    items-center
                    justify-between
                    border-t
                    border-slate-100
                    pt-2
                  "
                >

                  <p className="text-[10px] text-slate-400">
                    {quantity}{" "}
                    {quantity === 1
                      ? "Item"
                      : "Items"}
                  </p>

                  {/* ACTION */}
                  {/* ACTION */}
<div className="flex items-center gap-2">

  {/* ACCEPT ORDER */}
  {order.status === "new_order_request" && (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        handleAcceptOrder(order._id);
      }}
      disabled={updatingOrderId === order._id}
      className="
        rounded-md
        bg-green-600
        px-3
        py-1.5
        text-[10px]
        font-semibold
        text-white
        hover:bg-green-700
        disabled:opacity-50
      "
    >
      {updatingOrderId === order._id
        ? "Accepting..."
        : "Accept Order"}
    </button>
  )}

  {/* NOTIFY RIDERS */}
  {order.status === "looking_for_rider" && (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        handleNotifyRiders(order._id);
      }}
      disabled={updatingOrderId === order._id}
      className="
        rounded-md
        bg-purple-600
        px-3
        py-1.5
        text-[10px]
        font-semibold
        text-white
        hover:bg-purple-700
        disabled:opacity-50
      "
    >
      {updatingOrderId === order._id
        ? "Notifying..."
        : "📢 Notify Riders"}
    </button>
  )}

  {/* CANCEL ORDER */}
  {[
    "new_order_request",
    "looking_for_rider",
    "packed_up",
  ].includes(order.status) && (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        handleCancelOrder(order._id);
      }}
      disabled={updatingOrderId === order._id}
      className="
        rounded-md
        border
        border-red-200
        bg-white
        px-3
        py-1.5
        text-[10px]
        font-semibold
        text-red-600
        hover:bg-red-50
        disabled:opacity-50
      "
    >
      {updatingOrderId === order._id
        ? "Cancelling..."
        : "Cancel"}
  </button>
  )}

  {/* VIEW DETAILS */}
  <button
    type="button"
    onClick={() =>
      router.push(
  `/business-dashboard/order/view?id=${order._id}&orderNumber=${encodeURIComponent(
    order.orderNumber
  )}`
)
    }
    className="
      rounded-md
      border
      border-purple-200
      bg-white
      px-3
      py-1.5
      text-[10px]
      font-semibold
      text-purple-600
      hover:bg-purple-50
    "
  >
    View Details ›
  </button>

</div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>

    {/* =================================================
    DESKTOP ORDERS UI
================================================= */}

<div className="hidden md:block">

  <div className="flex items-start justify-between">
  <div>
    <h1 className="text-4xl font-bold text-slate-900">
      Orders
    </h1>

    <p className="mt-1 text-lg text-slate-500">
      Manage and track your store orders.
    </p>
  </div>

  <select
    value={selectedStatus}
    onChange={(e) => setSelectedStatus(e.target.value)}
    className="
      h-14
      w-56
      rounded-xl
      border
      border-slate-200
      bg-white
      px-4
      text-base
      font-medium
      text-slate-700
      outline-none
      focus:border-blue-500
    "
  >
    <option value="all">All Orders</option>
    <option value="pending">Pending</option>
    <option value="active">Active</option>
    <option value="completed">Completed</option>
    <option value="cancelled">Cancelled</option>
  </select>
</div>
{/* ================= LOW STOCK ALERT ================= */}

<button
  type="button"
  onClick={() => setShowLowStock(true)}
  className="
    mt-6
    flex
    w-full
    items-center
    gap-4
    rounded-2xl
    border
    border-orange-200
    bg-orange-50
    px-5
    py-4
    text-left
    transition
    hover:bg-orange-100
  "
>
  {/* ICON */}
  <div
    className="
      flex
      h-11
      w-11
      shrink-0
      items-center
      justify-center
      rounded-full
      bg-white
      shadow-sm
    "
  >
    <span className="text-xl">
      📦
    </span>
  </div>

  {/* TEXT */}
  <div className="min-w-0 flex-1">
    <p className="text-sm font-bold text-orange-600">
      Low Stock Alert
    </p>

    <p className="mt-1 text-sm text-slate-500">
      {lowStockCount} items running low on stock
    </p>
  </div>

  {/* VIEW DETAILS */}
  <div className="flex items-center gap-2">
    <span
      className="
        rounded-lg
        border
        border-orange-200
        bg-white
        px-4
        py-2
        text-sm
        font-medium
        text-orange-600
      "
    >
      View Details
    </span>

    <span className="text-lg text-orange-500">
      ›
    </span>
  </div>
</button>

  {/* ================= ORDERS TABLE ================= */}

  <div className="
    mt-7
    overflow-hidden
    rounded-2xl
    border
    border-slate-200
    bg-white
  ">

    {/* ================= TABLE HEADER ================= */}

    <div className="
      grid
      grid-cols-[1.1fr_1.5fr_0.8fr_1fr_1.2fr_1fr_120px]
      items-center
      border-b
      border-slate-200
      px-5
      py-5
      text-sm
      font-semibold
      text-slate-600
    ">

      <div>
        Order ID
      </div>

      <div>
        Customer
      </div>

      <div>
        Items
      </div>

      <div>
        Amount
      </div>

      <div>
        Order Status
      </div>

      <div>
        Date
      </div>

      <div>
  View Details
</div>

    </div>

    {/* ================= ORDERS ================= */}

    {orders.length === 0 ? (

      <div className="
        px-5
        py-16
        text-center
      ">
        <div className="text-4xl">
          📦
        </div>

        <h2 className="mt-3 text-lg font-bold text-slate-800">
          No orders yet
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Your store orders will appear here.
        </p>
      </div>

    ) : (

      orders.map((order) => {

        const customerName =
          order.customerUserId?.name ||
          order.customerUserId?.username ||
          "Customer";

        const quantity =
          order.postDetails?.quantity || 1;

        const grandTotal =
          order.paymentDetails?.grandTotal || 0;

        {/* ================= STATUS ================= */}

        let statusLabel = order.status;
        let statusClass =
          "bg-slate-50 text-slate-600";

        switch (order.status) {

          case "new_order_request":
            statusLabel = "Pending";
            statusClass =
              "bg-orange-50 text-orange-600";
            break;

          case "accepted":
            statusLabel = "Accepted";
            statusClass =
              "bg-blue-50 text-blue-600";
            break;

          case "looking_for_rider":
            statusLabel = "Looking for Rider";
            statusClass =
              "bg-purple-50 text-purple-600";
            break;

          case "packed_up":
            statusLabel = "Packed";
            statusClass =
              "bg-yellow-50 text-yellow-600";
            break;

          case "out_for_delivery":
            statusLabel = "Out for Delivery";
            statusClass =
              "bg-blue-50 text-blue-600";
            break;

          case "delivery_completed":
          case "completed":
            statusLabel = "Delivered";
            statusClass =
              "bg-green-50 text-green-600";
            break;

          case "cancelled":
          case "cancelled_by_store":
          case "cancelled_by_customer":
          case "cancelled_by_rider":
            statusLabel = "Cancelled";
            statusClass =
              "bg-red-50 text-red-600";
            break;

        }

        return (

          <div
            key={order._id}
            className="
              grid
              grid-cols-[1.1fr_1.5fr_0.8fr_1fr_1.2fr_1fr_120px]
              items-center
              border-b
              border-slate-200
              px-5
              py-6
              last:border-b-0
            "
          >

            {/* ================= ORDER ID ================= */}

            <div>
              <p className="font-semibold text-slate-900">
                #{order.orderNumber}
              </p>
            </div>

            {/* ================= CUSTOMER ================= */}

            <div>
              <p className="font-medium text-slate-900">
                {customerName}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {order.customerUserId?.username || ""}
              </p>
            </div>

            {/* ================= ITEMS ================= */}

            <div>
              <p className="text-sm text-slate-700">
                {quantity}{" "}
                {quantity === 1 ? "item" : "items"}
              </p>
            </div>

            {/* ================= AMOUNT ================= */}

            <div>
              <p className="font-medium text-slate-900">
                INR{" "}
                {grandTotal.toLocaleString("en-IN")}
              </p>
            </div>

            {/* ================= ORDER STATUS ================= */}

            {/* ================= ORDER STATUS ================= */}

<div>
  <div className="flex flex-col items-start gap-2">

    {/* STATUS */}
    <span
      className={`
        inline-flex
        rounded-xl
        px-4
        py-2
        text-sm
        font-semibold
        ${statusClass}
      `}
    >
      {statusLabel}
    </span>

    {/* ACCEPT ORDER */}
    {order.status === "new_order_request" && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleAcceptOrder(order._id);
        }}
        disabled={updatingOrderId === order._id}
        className="
          rounded-lg
          bg-green-600
          px-4
          py-2
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-green-700
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {updatingOrderId === order._id
          ? "Accepting..."
          : "Accept Order"}
      </button>
    )}

  </div>
</div>

            {/* ================= DATE ================= */}

            <div>

              <p className="text-sm font-medium text-slate-800">
                {new Date(
                  order.createdAt
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {new Date(
                  order.createdAt
                ).toLocaleTimeString(
                  "en-IN",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </p>

            </div>

            {/* ================= ACTION ================= */}

            <div>

              <button
  type="button"
  onClick={() =>
    router.push(
      `/business-dashboard/order/view?id=${order._id}&orderNumber=${encodeURIComponent(
        order.orderNumber
      )}`
    )
  }
  className="
    rounded-xl
    border
    border-blue-200
    bg-white
    px-4
    py-2.5
    text-sm
    font-semibold
    text-blue-600
    hover:bg-blue-50
  "
>
  View Details
</button>

            </div>

          </div>

        );

      })

    )}

    {/* ================= TABLE FOOTER ================= */}

    <div className="
      flex
      items-center
      justify-between
      border-t
      border-slate-200
      px-5
      py-5
    ">

      <p className="text-sm text-slate-500">
        Showing 1 to {orders.length} of {orders.length} orders
      </p>

      <div className="flex items-center gap-2">

        <button
          type="button"
          disabled
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            text-xl
            text-slate-400
          "
        >
          ‹
        </button>

        <button
          type="button"
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-blue-600
            text-white
          "
        >
          1
        </button>

        <button
          type="button"
          disabled
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            text-xl
            text-slate-400
          "
        >
          ›
        </button>

      </div>

    </div>

  </div>

</div>



    {/* =================================================
        LOW STOCK MODAL
    ================================================= */}
    {showLowStock && (
      <LowStockDetails
  onClose={() => setShowLowStock(false)}
  storeId={selectedStoreId}
/>
    )}
  </div>
);
}