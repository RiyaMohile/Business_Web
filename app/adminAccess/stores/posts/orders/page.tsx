"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  Package,
  User,
  Calendar,
  IndianRupee,
} from "lucide-react";
import api from "../../../../services/businessApi";

interface Order {
  _id: string;

  orderNumber?: string;

  status?: string;

  createdAt: string;

  customerUserId?: {
    _id?: string;
    name?: string;
    username?: string;
    phoneNumber?: string;
  };

  postDetails?: {
    postId?: {
      _id?: string;
      postId?: string;
      topic?: string;

      media?: {
        mediaUrl?: string;
      }[];

      price?: {
        amount?: number;
        currency?: string;
      };
    };

    size?: string;
    quantity?: number;
    currentPricePerQuantity?: number;
  };

  paymentDetails?: {
    grandTotal?: number;
    deliveryCharge?: number;
    paymentStatus?: string;
    timestamp?: string;
  };

  storeId?: {
    _id?: string;
    storeName?: string;
    storeId?: string;
  };
}

export default function AdminPostOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPostId, setSelectedPostId] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState("");

  const [postName, setPostName] = useState("");
  const [postCustomId, setPostCustomId] = useState("");
  const [storeName, setStoreName] = useState("");

  const [selectedStatus, setSelectedStatus] =
    useState("all");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const postId =
      sessionStorage.getItem("selectedPostId");

    const storeId =
      sessionStorage.getItem("selectedStoreId");

    if (!postId || !storeId) {
      setError("Post or Store ID not found");
      setLoading(false);
      return;
    }

    setSelectedPostId(postId);
    setSelectedStoreId(storeId);

    fetchOrders(storeId, postId);
  }, []);

  const fetchOrders = async (
    storeId: string,
    postId: string
  ) => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(
        `https://api.thover.in/v1/api/admin-access/stores/${storeId}/orders`,
        {
          params: {
            postId,
          },
        }
      );

      if (data?.success) {
        const fetchedOrders =
          data.orders || [];

        setOrders(fetchedOrders);

        /*
         * Get post/store information
         * from populated order response
         */
        const firstOrder =
          fetchedOrders[0];

        const post =
          firstOrder?.postDetails?.postId;

        const store =
          firstOrder?.storeId;

        setPostName(post?.topic || "");
        setPostCustomId(
          post?.postId || ""
        );

        setStoreName(
          store?.storeName || ""
        );
      } else {
        setError(
          data?.message ||
            "Unable to fetch orders"
        );
      }
    } catch (error: any) {
      console.error(
        "FETCH POST ORDERS ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      /*
       * STATUS FILTER
       */
      if (selectedStatus !== "all") {
        if (
          selectedStatus === "pending" &&
          order.status !== "new_order_request"
        ) {
          return false;
        }

        if (
          selectedStatus === "active" &&
          ![
            "looking_for_rider",
            "packed_up",
            "out_for_delivery",
          ].includes(order.status || "")
        ) {
          return false;
        }

        if (
          selectedStatus === "completed" &&
          order.status !== "delivery_completed"
        ) {
          return false;
        }

        if (
          selectedStatus === "cancelled" &&
          ![
            "cancelled_by_store",
            "cancelled_by_customer",
            "cancelled_by_rider",
          ].includes(order.status || "")
        ) {
          return false;
        }
      }

      /*
       * DATE FILTER
       */
      const orderDate =
        new Date(order.createdAt);

      if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);

        if (orderDate < from) {
          return false;
        }
      }

      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);

        if (orderDate > to) {
          return false;
        }
      }

      return true;
    });
  }, [
    orders,
    selectedStatus,
    fromDate,
    toDate,
  ]);

  /*
   * SUMMARY
   */
  const totalOrders =
    filteredOrders.length;

  const pendingOrders =
    filteredOrders.filter(
      (order) =>
        order.status ===
        "new_order_request"
    ).length;

  const activeOrders =
    filteredOrders.filter((order) =>
      [
        "looking_for_rider",
        "packed_up",
        "out_for_delivery",
      ].includes(order.status || "")
    ).length;

  const completedOrders =
    filteredOrders.filter(
      (order) =>
        order.status ===
        "delivery_completed"
    ).length;

  const getStatusLabel = (
    status?: string
  ) => {
    switch (status) {
      case "new_order_request":
        return "Pending";

      case "looking_for_rider":
        return "Looking for Rider";

      case "packed_up":
        return "Packed";

      case "out_for_delivery":
        return "Out for Delivery";

      case "delivery_completed":
        return "Completed";

      case "cancelled_by_store":
        return "Cancelled";

      case "cancelled_by_customer":
        return "Cancelled";

      case "cancelled_by_rider":
        return "Cancelled";

      default:
        return status || "Unknown";
    }
  };

  const getStatusClass = (
    status?: string
  ) => {
    if (
      status === "delivery_completed"
    ) {
      return "bg-emerald-50 text-emerald-600";
    }

    if (
      [
        "looking_for_rider",
        "packed_up",
        "out_for_delivery",
      ].includes(status || "")
    ) {
      return "bg-blue-50 text-blue-600";
    }

    if (
      status ===
      "new_order_request"
    ) {
      return "bg-amber-50 text-amber-600";
    }

    if (
      [
        "cancelled_by_store",
        "cancelled_by_customer",
        "cancelled_by_rider",
      ].includes(status || "")
    ) {
      return "bg-red-50 text-red-600";
    }

    return "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-sm text-gray-500">
            Loading post orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Package
            size={42}
            className="mx-auto text-red-400"
          />

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Unable to load orders
          </h2>

          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
                Post Orders
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                Orders placed for this post
              </p>
            </div>

          </div>

        </div>

        {/* POST INFO */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ShoppingBag size={22} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Product
                </p>

                <h2 className="mt-1 text-lg font-semibold text-gray-900">
                  {postName ||
                    "Selected Post"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Post ID:{" "}
                  {postCustomId ||
                    selectedPostId}
                </p>
              </div>

            </div>

            <div className="rounded-xl bg-gray-50 px-5 py-3">
              <p className="text-xs text-gray-400">
                Store
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-800">
                {storeName ||
                  "Store"}
              </p>
            </div>

          </div>

        </div>

        {/* SUMMARY */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <SummaryCard
            title="Total Orders"
            value={totalOrders}
            icon={<ShoppingBag size={19} />}
          />

          <SummaryCard
            title="Pending"
            value={pendingOrders}
            icon={<Calendar size={19} />}
          />

          <SummaryCard
            title="Active"
            value={activeOrders}
            icon={<Package size={19} />}
          />

          <SummaryCard
            title="Completed"
            value={completedOrders}
            icon={<Package size={19} />}
          />

        </div>

        {/* FILTERS */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center gap-2">
            <Calendar
              size={18}
              className="text-gray-500"
            />

            <h2 className="text-sm font-semibold text-gray-800">
              Filters
            </h2>
          </div>

          {/* STATUS */}
          <div className="flex flex-wrap gap-2">
            {[
              ["all", "All Orders"],
              ["pending", "Pending"],
              ["active", "Active"],
              ["completed", "Completed"],
              ["cancelled", "Cancelled"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setSelectedStatus(value)
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  selectedStatus === value
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* DATE */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                From Date
              </label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) =>
                  setFromDate(e.target.value)
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                To Date
              </label>

              <input
                type="date"
                value={toDate}
                onChange={(e) =>
                  setToDate(e.target.value)
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

          </div>

        </div>

        {/* ORDERS */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Orders
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                {filteredOrders.length} orders found
              </p>
            </div>

          </div>

          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <ShoppingBag
                  size={24}
                  className="text-gray-400"
                />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-gray-800">
                No orders found
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                There are no orders for this post with the selected filters.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <div className="min-w-[1300px]">

                {/* TABLE HEADER */}
               <div className="grid grid-cols-10 border-b border-gray-100 bg-gray-50 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">

  <span>Order Number</span>

  <span>Customer</span>

  <span>Product</span>

  <span>Size</span>

  <span>Quantity</span>

  <span>Price</span>

  <span>Delivery</span>

  <span>Grand Total</span>

  <span>Status</span>

  <span>Date</span>

</div>

                {/* TABLE ROWS */}
{filteredOrders.map((order) => {
  const product =
    order.postDetails?.postId;

  const customer =
    order.customerUserId;

  const size =
    order.postDetails?.size || "-";

  const quantity =
    order.postDetails?.quantity ?? 0;

  const price =
    order.postDetails
      ?.currentPricePerQuantity ?? 0;

  const deliveryCharge =
    order.paymentDetails
      ?.deliveryCharge ?? 0;

  const grandTotal =
    order.paymentDetails
      ?.grandTotal ?? 0;

  return (
    <div
      key={order._id}
      className="grid grid-cols-10 items-center border-b border-gray-100 px-5 py-4 text-sm last:border-b-0 hover:bg-gray-50"
    >

      {/* ORDER NUMBER */}
      <div className="min-w-0 pr-3">
        <p className="break-all font-semibold text-gray-800">
          {order.orderNumber || "-"}
        </p>
      </div>


      {/* CUSTOMER */}
      <div className="flex min-w-0 items-center gap-2 pr-3">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <User size={15} />
        </div>

        <div className="min-w-0">
          <p className="truncate font-medium text-gray-800">
            {customer?.name ||
              customer?.username ||
              "Customer"}
          </p>

          {customer?.phoneNumber && (
            <p className="truncate text-xs text-gray-400">
              {customer.phoneNumber}
            </p>
          )}
        </div>

      </div>


      {/* PRODUCT */}
      <div className="min-w-0 pr-3">

        <p className="truncate font-medium text-gray-800">
          {product?.topic ||
            postName ||
            "Product"}
        </p>

        <p className="mt-1 truncate text-xs text-gray-400">
          {product?.postId ||
            selectedPostId}
        </p>

      </div>


      {/* SIZE */}
      <div>
        <span className="font-medium text-gray-700">
          {size}
        </span>
      </div>


      {/* QUANTITY */}
      <div>
        <span className="font-semibold text-gray-800">
          {quantity}
        </span>
      </div>


      {/* PRICE */}
      <div>
        <p className="font-semibold text-gray-800">
          ₹{price}
        </p>

        <p className="mt-1 text-[11px] text-gray-400">
          per item
        </p>
      </div>


      {/* DELIVERY CHARGE */}
      <div>
        <p className="font-medium text-gray-700">
          ₹{deliveryCharge}
        </p>
      </div>


      {/* GRAND TOTAL */}
      <div>
        <p className="font-bold text-gray-900">
          ₹{grandTotal}
        </p>
      </div>


      {/* STATUS */}
      <div>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
            order.status
          )}`}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>


      {/* DATE */}
      <div>
        <p className="text-sm text-gray-700">
          {new Date(
            order.createdAt
          ).toLocaleDateString()}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {new Date(
            order.createdAt
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

    </div>
  );
})}

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}


/* ================================================= */
/* SUMMARY CARD */
/* ================================================= */

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-medium text-gray-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

      </div>

    </div>
  );
}