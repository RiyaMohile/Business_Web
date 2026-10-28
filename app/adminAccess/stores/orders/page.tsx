"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  User,
  Calendar,
  IndianRupee,
} from "lucide-react";
import api from "../../../services/businessApi";

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  createdAt: string;

  customerUserId?: {
    _id?: string;
    username?: string;
    name?: string;
  };

  postDetails?: {
    postId?: {
      _id?: string;
      postId?: string;
      topic?: string;
      media?: {
        mediaUrl?: string;
      }[];
    };
    quantity?: number;
    color?: string;
    size?: string;
    currentPricePerQuantity?: number;
  };

  paymentDetails?: {
    grandTotal?: number;
    deliveryCharge?: number;
    paymentStatus?: string;
  };

  deliveryDetail?: {
    riderUserId?: string | null;
    distanceKM?: number;
  };
}

export default function StoreOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [storeId, setStoreId] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] =
  useState("all");

const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

  useEffect(() => {
    const selectedStoreId =
      sessionStorage.getItem("selectedStoreId");

    if (!selectedStoreId) {
      setError("Store ID not found");
      setLoading(false);
      return;
    }

    setStoreId(selectedStoreId);

    fetchOrders(selectedStoreId);
  }, []);

  const fetchOrders = async (
    selectedStoreId: string,
    status: string = "all",
  ) => {
    try {
      setLoading(true);
      setError("");

      /*
       * IMPORTANT:
       *
       * All Orders ke liye status query nahi bhej rahe.
       *
       * Backend:
       * const filter = {
       *   storeId: store._id
       * }
       *
       * Isliye saare orders milenge.
       */

      const params: {
        storeId: string;
        status?: string;
      } = {
        storeId: selectedStoreId,
      };

      if (status !== "all") {
        params.status = status;
      }

      const { data } = await api.get(
        "https://api.thover.in/v2/api/order/store-orders",
        {
          params,
        }
      );

      console.log("STORE ORDERS RESPONSE:", data);

      if (data?.success) {
        setOrders(data.orders || []);
      } else {
        setError(
          data?.message || "Unable to fetch orders"
        );
      }
    } catch (error: any) {
      console.error(
        "FETCH STORE ORDERS ERROR:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Unable to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const status = e.target.value;

    setSelectedStatus(status);

    if (storeId) {
      fetchOrders(storeId, status);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new_order_request":
        return "Pending";

      case "accepted":
        return "Accepted";

      case "looking_for_rider":
        return "Looking for Rider";

      case "packed_up":
        return "Packed";

      case "out_for_delivery":
        return "Out for Delivery";

      case "delivery_completed":
        return "Completed";

      case "completed":
        return "Completed";

      case "cancelled_by_store":
        return "Cancelled by Store";

      case "cancelled_by_customer":
        return "Cancelled by Customer";

      case "cancelled_by_rider":
        return "Cancelled by Rider";

      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "new_order_request":
        return "bg-orange-50 text-orange-600";

      case "accepted":
        return "bg-blue-50 text-blue-600";

      case "looking_for_rider":
        return "bg-purple-50 text-purple-600";

      case "packed_up":
        return "bg-yellow-50 text-yellow-600";

      case "out_for_delivery":
        return "bg-blue-50 text-blue-600";

      case "delivery_completed":
      case "completed":
        return "bg-green-50 text-green-600";

      case "cancelled_by_store":
      case "cancelled_by_customer":
      case "cancelled_by_rider":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getProductImage = (order: Order) => {
    return order.postDetails?.postId?.media?.find(
      (media) => media.mediaUrl
    )?.mediaUrl;
  };

  const filteredOrders = orders.filter((order) => {
  const orderDate = new Date(order.createdAt);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-900">
            Store Orders
          </h1>

          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              Loading orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={() =>
              router.push("/adminAccess/stores/view")
            }
            className="mb-5 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            Back to Store
          </button>

          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      {/* HEADER */}

      <div className="mx-auto max-w-7xl">

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <button
              onClick={() =>
                router.push("/adminAccess/stores/view")
              }
              className="mb-3 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft size={18} />
              Back to Store
            </button>

            <h1 className="text-3xl font-bold text-gray-900">
              Store Orders
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              All orders for this store
            </p>
          </div>

          <div className="flex items-center gap-3">

  {/* FROM DATE */}
  <div>
    <label className="mb-1 block text-xs text-gray-500">
      From Date
    </label>

    <input
      type="date"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
      className="
        rounded-xl
        border border-gray-200
        bg-white
        px-4 py-3
        text-sm
        text-gray-700
        outline-none
        focus:border-purple-500
      "
    />
  </div>

  {/* TO DATE */}
  <div>
    <label className="mb-1 block text-xs text-gray-500">
      To Date
    </label>

    <input
      type="date"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
      className="
        rounded-xl
        border border-gray-200
        bg-white
        px-4 py-3
        text-sm
        text-gray-700
        outline-none
        focus:border-purple-500
      "
    />
  </div>

</div>

          {/* STATUS FILTER */}

          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-3
              text-sm
              font-medium
              text-gray-700
              outline-none
              focus:border-purple-500
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

        {/* SUMMARY */}

        <div className="mb-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {filteredOrders.length}
            </p>
          </div>

        </div>

        {/* ORDERS */}

        {filteredOrders.length === 0 ? (

          <div className="rounded-xl bg-white p-12 text-center shadow-sm">

            <Package
              size={48}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              No Orders Found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              This store does not have any orders.
            </p>

          </div>

        ) : (

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            {/* TABLE HEADER */}

            <div
  className="
    grid
    grid-cols-[1.1fr_1.4fr_1.2fr_1fr_1fr]
    border-b
    border-gray-200
    px-5
    py-4
    text-sm
    font-semibold
    text-gray-600
  "
>
  <div>Order ID</div>
  <div>Customer</div>
  <div>Product</div>
  <div>Amount</div>
  <div>Status</div>
</div>

            {/* ORDERS */}

           {filteredOrders.map((order) => {

              const customerName =
                order.customerUserId?.name ||
                order.customerUserId?.username ||
                "Customer";

              const product =
                order.postDetails?.postId;

              const image =
                getProductImage(order);

              const quantity =
                order.postDetails?.quantity || 1;

              const amount =
                order.paymentDetails?.grandTotal || 0;

              return (
                <div
                  key={order._id}
                  className="
                    grid
                    grid-cols-[1.1fr_1.4fr_1.2fr_1fr_1fr]
                    items-center
                    border-b
                    border-gray-100
                    px-5
                    py-5
                    last:border-b-0
                    hover:bg-gray-50
                  "
                >

                  {/* ORDER ID */}

                  <div>
                    <p className="font-semibold text-gray-900">
                      #{order.orderNumber}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  {/* CUSTOMER */}

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                      <User
                        size={17}
                        className="text-gray-500"
                      />
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">
                        {customerName}
                      </p>

                      <p className="text-xs text-gray-400">
                        {order.customerUserId?.username ||
                          "-"}
                      </p>
                    </div>

                  </div>

                  {/* PRODUCT */}

                  <div className="flex items-center gap-3">

                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">

                      {image ? (
                        <img
                          src={image}
                          alt={
                            product?.topic ||
                            "Product"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package
                            size={20}
                            className="text-gray-400"
                          />
                        </div>
                      )}

                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-medium text-gray-900">
                        {product?.topic ||
                          "Product"}
                      </p>

                      <p className="text-xs text-gray-400">
                        {quantity}{" "}
                        {quantity === 1
                          ? "item"
                          : "items"}
                      </p>

                    </div>

                  </div>

                  {/* AMOUNT */}

                  <div className="flex items-center gap-1">

                    <IndianRupee
                      size={15}
                      className="text-gray-500"
                    />

                    <span className="font-medium text-gray-900">
                      {amount.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  {/* STATUS */}

                  <div>
                    <span
                      className={`
                        inline-flex
                        rounded-lg
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        ${getStatusClass(
                          order.status
                        )}
                      `}
                    >
                      {getStatusLabel(
                        order.status
                      )}
                    </span>
                  </div>

                  

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}