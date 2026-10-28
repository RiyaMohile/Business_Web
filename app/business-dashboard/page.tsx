"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Store,
  ShoppingBag,
  Plus,
  ChevronRight,
  CalendarDays,
  Clock3,
  PackageCheck,
  UserRound,
  Menu,
  Bell,
  User,
  Home,
  Wallet,
  ChevronDown,
  Package,
} from "lucide-react";

import Navbar from "../components/BusinessNavbar";
import CreateStoreWizard from "../components/store/CreateStoreWizard";
// import CreatePostModal from "../components/stores/post/CreatePostModal";
import EditPostModal from "../components/stores/post/EditPostModal";
import UpdateDiscountModal from "../components/stores/post/UpdateDiscountModal";
import UpdateInventoryModal from "../components/stores/post/UpdateInventoryModal";
import ManageMediaModal from "../components/stores/post/ManageMediaModal";
import EditStoreForm from "../components/store/steps/EditStoreForm";
import { updateStoreOnlineStatus,getMyStore,getMyStores, } from "../services/businessStoreApi";
import WalletTransactions from "../components/stores/wallet/WalletTransactions";
import CreateBankAccount from "../components/stores/wallet/bank/CreateBankAccount";
import ViewStore from "../components/store/steps/ViewStore";
import StoreCreationSuccess from "../components/store/StoreCreationSuccess";
import MobileDashboardNav from "../components/dashboard/MobileDashboardNav";
import CreateWallet from "../components/stores/wallet/CreateWallet";
import { getStoreOrders,updateOrderStatus, notifyNearbyRiders, } from "../services/orderApi";
import DashboardSidebar from "../components/DashboardSidebar";
import StoreSubscriptionCard from "../components/dashboard/StoreSubscriptionCard";

const BASE_URL2 = "https://api.thover.in/v1/api";

interface User {
  _id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  isAdmin?: boolean;
  isBusiness?: boolean;
}

interface BusinessStore {
  _id: string;
  storeId: string;
  storeName: string;
  category: string;
  status: "public" | "suspended";
  isVerified: boolean;
  isOnline: boolean;
}
interface ProductPost {
  _id: string;
  topic: string;
  description?: string;

  media?: {
    _id?: string;
    mediaName?: string;
    mediaUrl?: string;
    mediaPath?: string;
    isDeleted?: boolean;
  }[];

  price?: {
    currency: string;
    amount: number;
    priceType: string;
  };

  category?: string;
subCategory?: string;
  color?: string;
  idealFor?: string;
  area?: string;

  inventory?: {
    size: string;
    stock: number;
  }[];

  status: "public" | "private" | "draft" | "suspended";

  discount?: {
    title?: string;
    expiry?: string;
    type?: "percentage" | "flat";
    value?: number;
  };

  tags?: string[];

  createdAt?: string;
  updatedAt?: string;
}
interface OrderDashboardData {
  today: {
    orders: number;
    amount: number;
  };

  week: {
    orders: number;
    amount: number;
  };

  month: {
    orders: number;
    amount: number;
  };

  totalCompletedOrders: number;
}
interface Store {
  _id: string;
  storeName: string;
  category: string;
  gstNumber?: string;

  address?: {
    addressId: string;
    area: string;
    city: string;
  };

  workingDays?: {
    from: string;
    to: string;
  };

  openingHours?: {
    from: string;
    to: string;
  };

  phoneContactId?: string;
  mailContactId?: string;
}

export default function BusinessDashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  const [store, setStore] = useState<BusinessStore | null>(null);

  const [loadingUser, setLoadingUser] = useState(true);
  const [checkingStore, setCheckingStore] = useState(true);

  const [showCreateStore, setShowCreateStore] = useState(false);

  // const [showCreatePost, setShowCreatePost] =
  // useState(false);
  const [showSuccess, setShowSuccess] =
  useState(false);
  const [posts, setPosts] = useState<ProductPost[]>([]);
const [loadingPosts, setLoadingPosts] = useState(false);
const [loadingStore, setLoadingStore] = useState(false);
const [editingPost, setEditingPost] = useState<ProductPost | null>(null);
const [showEditStore, setShowEditStore] = useState(false);
const [discountPost, setDiscountPost] =
  useState<ProductPost | null>(null);

const [inventoryPost, setInventoryPost] =
  useState<ProductPost | null>(null);
  const [mediaPost, setMediaPost] =
  useState<ProductPost | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showCreateWallet, setShowCreateWallet] =
  useState(false);
  const [showTransactions, setShowTransactions] =
  useState(false);
  const [showBankAccount, setShowBankAccount] =
  useState(false);
  const [showStore, setShowStore] = useState(false);
  const [orderDashboard, setOrderDashboard] =
  useState<OrderDashboardData | null>(null);

const [loadingOrderDashboard, setLoadingOrderDashboard] =
  useState(false);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
const [loadingPendingOrders, setLoadingPendingOrders] = useState(false);
const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
const [profileModalOpen, setProfileModalOpen] = useState(false);

const [showManageStore, setShowManageStore] =
  useState(false);

const [showVerification, setShowVerification] =
  useState(false);
  const router = useRouter();



  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
  const currentUser = await fetchCurrentUser();

  if (currentUser?._id) {
    await fetchUserPosts(currentUser._id);
  }

  await checkStore();
};

const fetchOrderDashboard = async () => {
  try {
    setLoadingOrderDashboard(true);
    

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found");
      return;
    }

    const response = await axios.get(
      `${BASE_URL2}/order/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
      "ORDER DASHBOARD RESPONSE:",
      response.data
    );
    if (response.data?.success) {
  console.log("========== ORDER DASHBOARD ==========");
  console.log("Full response:", response.data);
  console.log("Dashboard data:", response.data.data);

  console.log("Today orders:", response.data.data?.today?.orders);
  console.log("Today amount:", response.data.data?.today?.amount);

  console.log("Week orders:", response.data.data?.week?.orders);
  console.log("Week amount:", response.data.data?.week?.amount);

  console.log("Month orders:", response.data.data?.month?.orders);
  console.log("Month amount:", response.data.data?.month?.amount);

  console.log(
    "Total completed:",
    response.data.data?.totalCompletedOrders
  );

  console.log("====================================");

  setOrderDashboard(response.data.data);
}

    if (response.data?.success) {
      setOrderDashboard(response.data.data);
    } else {
      setOrderDashboard(null);
    }
  } catch (error: any) {
    console.error(
      "ORDER DASHBOARD ERROR:",
      error.response?.data || error.message
    );

    setOrderDashboard(null);
  } finally {
    setLoadingOrderDashboard(false);
  }
};

useEffect(() => {
  if (!store) return;

  fetchOrderDashboard();
  fetchPendingOrders();

  const handleStoreChange = () => {
    console.log(
      "STORE CHANGED → REFRESH DASHBOARD ORDERS"
    );

    fetchPendingOrders();
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
}, [store]);

const fetchPendingOrders = async () => {
  try {
    setLoadingPendingOrders(true);

    const selectedStoreId =
      localStorage.getItem("selectedStoreId");

    console.log(
      "DASHBOARD - SELECTED STORE ID:",
      selectedStoreId
    );

    if (!selectedStoreId) {
      setPendingOrders([]);
      return;
    }

    const response = await getStoreOrders(
      "pending",
      selectedStoreId
    );

    console.log(
      "========== PENDING ORDERS =========="
    );
    console.log("Pending orders response:", response);

    if (response?.success) {
      const orders =
        response.orders ||
        response.data?.orders ||
        response.data ||
        [];

      setPendingOrders(
        Array.isArray(orders)
          ? orders.filter(
              (order) =>
                order.status === "new_order_request"
            )
          : []
      );
    } else {
      setPendingOrders([]);
    }

    console.log(
      "===================================="
    );
  } catch (error: any) {
    console.error(
      "FETCH PENDING ORDERS ERROR:",
      error.response?.data || error.message
    );

    setPendingOrders([]);
  } finally {
    setLoadingPendingOrders(false);
  }
};
const handleAcceptOrder = async (orderId: string) => {
  try {
    setUpdatingOrderId(orderId);

    const response = await updateOrderStatus(
      orderId,
      "looking_for_rider"
    );

    console.log("ACCEPT ORDER RESPONSE:", response);

    if (response?.success) {
      // Order is no longer pending.
      // Remove it from Pending Orders.
      setPendingOrders((prev) =>
        prev.filter((order) => order._id !== orderId)
      );
    } else {
      alert(
        response?.message ||
          "Unable to accept order."
      );
    }
  } catch (error: any) {
    console.error(
      "ACCEPT ORDER ERROR:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
        "Unable to accept order."
    );
  } finally {
    setUpdatingOrderId(null);
  }
};
const handleNotifyRiders = async (orderId: string) => {
  try {
    setUpdatingOrderId(orderId);

    const response = await notifyNearbyRiders(orderId);

    console.log(
      "NOTIFY RIDERS RESPONSE:",
      response
    );

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
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
        "Unable to notify riders."
    );
  } finally {
    setUpdatingOrderId(null);
  }
};
  // ==========================================
  // GET CURRENT USER
  // ==========================================

  const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    const { data } = await axios.get(
      "https://api.thover.in/v1/api/auth/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUser(data.user);

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    return data.user;
  } catch (error: any) {
    console.error(
      "Failed to fetch user:",
      error.response?.data || error.message
    );

    return null;
  } finally {
    setLoadingUser(false);
  }
};

  // ==========================================
  // CHECK STORE
  // ==========================================

  const checkStore = async () => {
  try {
    setCheckingStore(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setStore(null);
      return;
    }

    // Owner + active manager/employee ke stores
    const response = await getMyStores();

    console.log("MY STORES:", response);

    if (!response?.success) {
      setStore(null);
      return;
    }

    const stores =
      response.stores ||
      response.data?.stores ||
      response.data ||
      [];

    if (!Array.isArray(stores) || stores.length === 0) {
      setStore(null);
      localStorage.removeItem("selectedStoreId");
      return;
    }

    // Navbar se jo store selected hai
    const selectedStoreId =
      localStorage.getItem("selectedStoreId");

    // Selected store mile to wahi use karo,
    // warna first available store
    const selectedStore =
      stores.find(
        (item: BusinessStore) =>
          item._id === selectedStoreId
      ) || stores[0];

    console.log(
      "SELECTED DASHBOARD STORE:",
      selectedStore
    );

    setStore(selectedStore);

    // MongoDB _id ko selected store ke roop mein save rakho
    localStorage.setItem(
      "selectedStoreId",
      selectedStore._id
    );
  } catch (error: any) {
    console.error(
      "STORE CHECK ERROR:",
      error.response?.data ||
        error.message ||
        error
    );

    setStore(null);
  } finally {
    setCheckingStore(false);
  }
};

  const fetchUserPosts = async (userId: string) => {
  try {
    setLoadingPosts(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setPosts([]);
      return;
    }

    const { data } = await axios.get(
      `https://api.thover.in/v1/api/post/user/${userId}/posts`,
      {
        params: {
          page: 1,
          limit: 10,
          status: "public",
          sortBy: "createdAt",
          sortOrder: "desc",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("USER POSTS:", data);

    if (data.success) {
      // Depending on your backend response
      if (Array.isArray(data.posts)) {
        setPosts(data.posts);
      } else if (Array.isArray(data.data)) {
        setPosts(data.data);
      } else if (Array.isArray(data.data?.posts)) {
        setPosts(data.data.posts);
      } else {
        setPosts([]);
      }
    } else {
      setPosts([]);
    }
  } catch (error: any) {
    console.error(
      "FETCH POSTS ERROR:",
      error.response?.data || error.message
    );

    setPosts([]);
  } finally {
    setLoadingPosts(false);
  }
};
const toggleArchive = async (postId: string) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    const { data } = await axios.patch(
      `https://api.thover.in/v1/api/post/toggle-archive/${postId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("TOGGLE ARCHIVE:", data);

    if (data.success) {
      alert(
        data.message || "Post archive status updated."
      );

      if (user?._id) {
        await fetchUserPosts(user._id);
      }
    } else {
      alert(
        data.message ||
          "Failed to change archive status."
      );
    }
  } catch (error: any) {
    console.error(
      "TOGGLE ARCHIVE ERROR:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
        "Failed to change archive status."
    );
  }
};
// const fetchStore = async () => {
//   try {
//     setLoadingStore(true);

//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.error("Token not found");
//       return;
//     }

//     const response = await axios.get(
//       "https://api.thover.in/v1/api/store/my-store",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     console.log("MY STORE RESPONSE:", response.data);

//     if (response.data?.success) {
//       setStore(response.data.store);
//     } else {
//       setStore(null);
//     }
//   } catch (error: any) {
//     console.error(
//       "GET STORE ERROR:",
//       error.response?.data || error.message
//     );

//     setStore(null);
//   } finally {
//     setLoadingStore(false);
//   }
// };

const handleViewStore = async () => {
  try {
    setLoadingStore(true);

    const response = await getMyStore();

    console.log("MY STORE RESPONSE:", response);

    if (response?.success) {
      const myStore =
        response.store ||
        response.data?.store ||
        response.data ||
        null;

      if (myStore) {
        setStore(myStore);
        setShowStore(true);
      } else {
        alert("Store not found.");
      }
    } else {
      alert(
        response?.message ||
        "Store not found."
      );
    }
  } catch (error: any) {
    console.error(
      "GET MY STORE ERROR:",
      error.response?.data ||
      error.message
    );

    alert(
      error.response?.data?.message ||
      "Unable to fetch store."
    );
  } finally {
    setLoadingStore(false);
  }
};

  // ==========================================
  // LOADING
  // ==========================================

  if (loadingUser || checkingStore) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
  onAccountModalChange={setProfileModalOpen}
   onStoreClick={handleViewStore}
/>

        <main className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="text-gray-500 mt-4">
              Loading your business...
            </p>
          </div>
        </main>
      </div>
    );
  }

  const handleOnlineStatusChange = async (
  isOnline: boolean
) => {
  if (!store?._id) {
    alert("Store not found");
    return;
  }

  try {
    setUpdatingStatus(true);

    const response = await updateStoreOnlineStatus(
      store._id,
      isOnline
    );

    console.log("ONLINE STATUS RESPONSE:", response);

    if (response?.success) {
      // frontend ke store state ko immediately update karo
      setStore((prev: any) =>
        prev
          ? {
              ...prev,
              isOnline,
            }
          : prev
      );
    } else {
      alert(
        response?.message ||
          "Unable to update store status"
      );
    }
  } catch (error: any) {
    alert(
      error.response?.data?.message ||
        "Unable to update store status"
    );
  } finally {
    setUpdatingStatus(false);
  }
};

const getTimeAgo = (date?: string) => {
  if (!date) return "";

  const diff = Date.now() - new Date(date).getTime();

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} mins ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} days ago`;
};
  return (
    <div className="relative min-h-[100dvh] bg-slate-50 pb-[80px]">

      {/* =========================
          MOBILE HEADER
      ========================== */}

<Navbar
  onAccountModalChange={setProfileModalOpen}
  onStoreClick={handleViewStore}
  isOnline={store?.isOnline ?? false}
  onOnlineStatusChange={handleOnlineStatusChange}
  updatingStatus={updatingStatus}
/>
     

      {/* =========================
          MOBILE NAVIGATION
      ========================== */}

    <div className="md:hidden">
  {store && !profileModalOpen && !showCreateStore &&(
    <MobileDashboardNav />
  )}
</div>

<div className="hidden md:block">
  <DashboardSidebar />
</div>

  {/* ================================= */}
  {/* MAIN CONTENT */}
  {/* ================================= */}
  {showSuccess ? (
  <StoreCreationSuccess
    onDashboard={() => {
      setShowSuccess(false);
      checkStore();
    }}
  />
) : (

  <main
  className="
    w-full
    px-4
    pt-24
    pb-24

    md:ml-[248px]
    md:w-[calc(100%-248px)]
    md:px-10
    md:pt-28
    md:pb-10
  "
>

    {/* ================================= */}
    {/* NO STORE */}
    {/* ================================= */}

    {!store && (
      <section
        className="
          flex
          min-h-[calc(100dvh-72px)]
          w-full
          items-center
          justify-center

          bg-white

          px-6
          py-10

          sm:bg-slate-50
          sm:px-8
          sm:py-12
        "
      >

        <div
          className="
            flex
            w-full
            max-w-[390px]
            flex-col
            items-center
            text-center

            sm:max-w-xl
            sm:rounded-3xl
            sm:bg-white
            sm:px-10
            sm:py-12
            sm:shadow-md
          "
        >

          {/* =================================
              STORE ICON
          ================================= */}

          <div
            className="
              flex
              h-28
              w-28
              items-center
              justify-center
              rounded-full
              bg-blue-50
            "
          >
            <Store
              size={58}
              strokeWidth={1.7}
              className="text-blue-600"
            />
          </div>

          {/* =================================
              HEADING
          ================================= */}

          <h1
            className="
              mt-8
              text-xl
              font-bold
              leading-7
              text-slate-900

              sm:text-2xl
            "
          >
            You don't have any store yet!
          </h1>

          {/* =================================
              DESCRIPTION
          ================================= */}

          <p
            className="
              mt-3
              max-w-[285px]
              text-sm
              leading-6
              text-slate-500
            "
          >
            Create your store and start
            <br />
            selling to your customers.
          </p>

          {/* =================================
              CREATE STORE BUTTON
          ================================= */}

          <button
            type="button"
            onClick={() =>
              setShowCreateStore(true)
            }
            className="
              mt-12
              flex
              h-12
              w-full
              max-w-[310px]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              text-sm
              font-semibold
              text-white
              transition

              hover:bg-blue-700
              active:scale-[0.98]
            "
          >
            <Plus
              size={19}
              strokeWidth={2.5}
            />

            Create Store
          </button>

        </div>

      </section>
    )}

          {/* ================================= */}
          {/* STORE EXISTS */}
          {/* ================================= */}

         {store && (
  <>
    {/* ================================
        DASHBOARD HEADER
    ================================= */}

    <div className="flex items-start justify-between">
  <div>
    <h1 className="text-[22px] font-bold text-slate-900 md:text-[32px]">
      Dashboard
    </h1>

    <p className="mt-1 hidden text-sm text-slate-500 md:block">
      Welcome back! Here's what's happening with your store.
    </p>
  {/* MOBILE SUBSCRIPTION STATUS */}
<StoreSubscriptionCard />
  </div>

  <p className="hidden text-sm font-medium text-slate-500 md:block">
    {new Date().toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}
  </p>
</div>


    


    {/* ================================
        STORE ONLINE STATUS
    ================================= */}

    <div
      className="
        mt-2
        flex
        items-center
        justify-between
        rounded-xl
        border
        border-slate-200
        bg-white
        px-3
        py-2 md:hidden
      "
    >

      <div>

        <p className="text-[16px] text-slate-400">
          Store availability
        </p>

        <p
          className={`
            mt-0.5
            text-[13px]
            font-semibold
            ${
              store.isOnline
                ? "text-green-600"
                : "text-red-500"
            }
          `}
        >
          {store.isOnline
            ? "Online"
            : "Offline"}
        </p>

      </div>


      <button
        type="button"
        disabled={updatingStatus}
        onClick={() =>
          handleOnlineStatusChange(
            !store.isOnline
          )
        }
        className={`
          relative
          h-5
          w-9
          rounded-full
          transition
          ${
            store.isOnline
              ? "bg-green-500"
              : "bg-slate-300"
          }
          ${
            updatingStatus
              ? "cursor-not-allowed opacity-50"
              : ""
          }
        `}
      >

        <span
          className={`
            absolute
            top-0.5
            h-4
            w-4
            rounded-full
            bg-white
            shadow
            transition
            ${
              store.isOnline
                ? "left-4.5"
                : "left-0.5"
            }
          `}
        />

      </button>

    </div>


    {/* ================================
        OVERVIEW
    ================================= */}

    <div className="mt-5 flex items-center justify-between">

      <h2 className="text-[20px] font-bold text-slate-700">
        Overview
      </h2>
    </div>


    {/* ================================
        STATS
    ================================= */}

    <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">

  <StatCard
    title="Today"
    value={String(
      orderDashboard?.today?.orders ?? 0
    )}
    label="Orders"
    amount={`₹ ${(
      orderDashboard?.today?.amount ?? 0
    ).toLocaleString("en-IN")}`}
    icon={<CalendarDays size={20} />}
    iconBg="bg-blue-50"
    iconColor="text-blue-500"
    arrowBg="bg-blue-50"
    arrowColor="text-blue-500"
  />

  <StatCard
    title="This Week"
    value={String(
      orderDashboard?.week?.orders ?? 0
    )}
    label="Orders"
    amount={`₹ ${(
      orderDashboard?.week?.amount ?? 0
    ).toLocaleString("en-IN")}`}
    icon={<ShoppingBag size={20} />}
    iconBg="bg-green-50"
    iconColor="text-green-500"
    arrowBg="bg-green-50"
    arrowColor="text-green-500"
  />

  <StatCard
    title="This Month"
    value={String(
      orderDashboard?.month?.orders ?? 0
    )}
    label="Orders"
    amount={`₹ ${(
      orderDashboard?.month?.amount ?? 0
    ).toLocaleString("en-IN")}`}
    icon={<CalendarDays size={20} />}
    iconBg="bg-violet-50"
    iconColor="text-violet-500"
    arrowBg="bg-violet-50"
    arrowColor="text-violet-500"
  />

  <StatCard
    title="Total Completed"
    value={String(
      orderDashboard?.totalCompletedOrders ?? 0
    )}
    label="Orders"
    amount=""
    icon={<PackageCheck size={20} />}
    iconBg="bg-orange-50"
    iconColor="text-orange-500"
    arrowBg="bg-orange-50"
    arrowColor="text-orange-500"
  />

</div>


    {/* ================================
        PENDING ORDERS
    ================================= */}

    <div className="mt-5">

      <div className="flex items-center justify-between">

        <h2 className="text-[20px] font-bold text-slate-700 md:text-[26px] md:text-slate-900">
  Pending Orders
</h2>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/business-dashboard/order"
            )
          }
          className="
            text-[13px]
            font-semibold
            text-violet-600 md:text-[16px]
          "
        >
          View All
        </button>

      </div>


      {/* ORDER LIST */}

     {/* ORDER LIST */}

<div
  className="
    mt-2
    overflow-hidden
    rounded-xl
    border
    border-slate-200
    bg-white
  "
>
  {/* =========================
      MOBILE ORDER CARDS
  ========================== */}

  <div className="md:hidden">
    {loadingPendingOrders ? (
      <div className="p-4 text-center text-[13px] text-slate-400">
        Loading pending orders...
      </div>
    ) : pendingOrders.length === 0 ? (
      <div className="p-4 text-center text-[13px] text-slate-400">
        No pending orders
      </div>
    ) : (
      pendingOrders.slice(0, 3).map((order) => (
        <OrderCard
          key={order._id}
          orderId={`#${order.orderNumber || order._id}`}
          items={`${order.postDetails?.quantity || 1} ${
            order.postDetails?.quantity === 1
              ? "Item"
              : "Items"
          }`}
          customer={
            order.customerUserId?.name ||
            order.customerUserId?.username ||
            "Customer"
          }
          time={getTimeAgo(order.createdAt)}
          amount={`₹ ${(
            order.paymentDetails?.grandTotal || 0
          ).toLocaleString("en-IN")}`}
          status={order.status}
          updating={updatingOrderId === order._id}
          onAccept={() => handleAcceptOrder(order._id)}
          onNotifyRiders={() => handleNotifyRiders(order._id)}
        />
      ))
    )}
  </div>

  {/* =========================
      DESKTOP TABLE
  ========================== */}

  <div className="hidden md:block">
    {loadingPendingOrders ? (
      <div className="p-10 text-center text-sm text-slate-400">
        Loading pending orders...
      </div>
    ) : pendingOrders.length === 0 ? (
      <>
        <div className="m-4 grid grid-cols-8 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
          <span>#</span>
          <span>Order ID</span>
          <span>Customer</span>
          <span>Items</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Date</span>
          <span>Action</span>
        </div>

        <div className="flex min-h-[210px] flex-col items-center justify-center">
          <Package
            size={52}
            strokeWidth={1.4}
            className="text-slate-300"
          />

          <p className="mt-4 text-base font-semibold text-slate-800">
            No pending orders
          </p>

          <p className="mt-1 text-sm text-slate-500">
            You're all caught up! New orders will appear here.
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="m-4 grid grid-cols-8 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
          <span>#</span>
          <span>Order ID</span>
          <span>Customer</span>
          <span>Items</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Date</span>
          <span>Action</span>
        </div>

        {pendingOrders.slice(0, 3).map((order, index) => (
          <div
            key={order._id}
            className="
              grid
              grid-cols-8
              items-center
              border-t
              border-slate-100
              px-8
              py-4
              text-sm
            "
          >
            <span className="text-slate-500">
              {index + 1}
            </span>

            <span className="font-semibold text-slate-800">
              #{order.orderNumber || order._id}
            </span>

            <span className="text-slate-600">
              {order.customerUserId?.name ||
                order.customerUserId?.username ||
                "Customer"}
            </span>

            <span className="text-slate-600">
              {order.postDetails?.quantity || 1}{" "}
              {order.postDetails?.quantity === 1
                ? "Item"
                : "Items"}
            </span>

            <span className="font-semibold text-slate-800">
              ₹{" "}
              {(
                order.paymentDetails?.grandTotal || 0
              ).toLocaleString("en-IN")}
            </span>

            <span>
              <span className="inline-flex rounded-md bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                Pending
              </span>
            </span>

            <span className="text-slate-500">
              {getTimeAgo(order.createdAt)}
            </span>

            <button
              type="button"
              onClick={() => handleAcceptOrder(order._id)}
              disabled={updatingOrderId === order._id}
              className="
                w-fit
                rounded-lg
                bg-green-600
                px-4
                py-2
                text-xs
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
          </div>
        ))}
      </>
    )}
  </div>
</div>


      {/* VIEW ALL */}

      <button
        type="button"
        onClick={() =>
          router.push(
            "/business-dashboard/order"
          )
        }
        className="
          mt-2
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-lg
          border
          border-violet-100
          bg-violet-50
          py-2
          text-[15px]
          font-semibold
          text-violet-600 md:hidden
        "
      >
        View All Pending Orders

        <ChevronRight size={11} />

      </button>

    </div>

  </>
)}
      </main>
      )}

      {/* ================================= */}
      {/* CREATE STORE WIZARD */}
      {/* ================================= */}

      {showCreateStore && (
  <CreateStoreWizard
    onClose={() => {
      setShowCreateStore(false);
    }}
    onCreated={() => {
      console.log("STORE CREATION COMPLETE");

      // Close wizard
      setShowCreateStore(false);

      // Show success screen
      setShowSuccess(true);
      window.location.reload();
    }}
  />
)}

      {/* {showCreatePost && (
  <CreatePostModal
    onClose={() => setShowCreatePost(false)}
    onSuccess={() => {
      console.log("Post created successfully");

      setShowCreatePost(false);

      if (user?._id) {
        fetchUserPosts(user._id);
      }
    }}
  />
)} */}
{editingPost && (
  <EditPostModal
    post={editingPost}
    onClose={() => setEditingPost(null)}
    onSuccess={() => {
      if (user?._id) {
        fetchUserPosts(user._id);
      }
    }}
  />
)}

{discountPost && (
  <UpdateDiscountModal
    post={discountPost}
    onClose={() => setDiscountPost(null)}
    onSuccess={() => {
      setDiscountPost(null);

      if (user?._id) {
        fetchUserPosts(user._id);
      }
    }}
  />
)}
{inventoryPost && (
  <UpdateInventoryModal
    post={inventoryPost}
    onClose={() => setInventoryPost(null)}
    onSuccess={() => {
      setInventoryPost(null);

      if (user?._id) {
        fetchUserPosts(user._id);
      }
    }}
  />
)}

{mediaPost && (
  <ManageMediaModal
    post={mediaPost}
    onClose={() => setMediaPost(null)}
    onSuccess={() => {
      if (user?._id) {
        fetchUserPosts(user._id);
      }
    }}
  />
)}
{showEditStore && store && (
  <EditStoreForm
    store={store}
    onClose={() => setShowEditStore(false)}
    onUpdated={() => {
      setShowEditStore(false);
      checkStore();
    }}
  />
)}

{showTransactions && (
  <WalletTransactions
    onClose={() =>
      setShowTransactions(false)
    }
  />
)}

{showBankAccount && (
  <CreateBankAccount
    onClose={() =>
      setShowBankAccount(false)
    }
    onSuccess={() => {
      console.log(
        "Bank account created"
      );

      // yahan bank account dobara fetch
      // kar sakte ho agar GET API hai
    }}
  />
)}

{showStore && store && (
  <ViewStore
    store={store}
    onClose={() => {
      setShowStore(false);
    }}
    onManage={() => {
      setShowStore(false);
      setShowManageStore(true);
    }}
    onSubmitDocuments={() => {
      setShowVerification(true);
    }}
  />
)}

{showCreateWallet && (
  <CreateWallet
    onClose={() => setShowCreateWallet(false)}
    onContinue={() => {
      setShowCreateWallet(false);
      setShowBankAccount(true);
    }}
  />
)}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  label: string;
  amount: string;

  icon: React.ReactNode;

  iconBg: string;
  iconColor: string;

  arrowBg: string;
  arrowColor: string;
}

function StatCard({
  title,
  value,
  label,
  amount,
  icon,
  iconBg,
  iconColor,
  arrowBg,
  arrowColor,
}: StatCardProps) {
  return (
    <div
  className="
    relative
    overflow-hidden
    rounded-xl
    border
    border-slate-200
    bg-white
    p-2.5

    md:min-h-[175px]
    md:p-5
  "
>

      {/* Icon */}
      <div
  className={`
    flex
    h-7
    w-7
    items-center
    justify-center
    rounded-lg
    ${iconBg}
    ${iconColor}

    md:h-14
    md:w-14
    md:rounded-full
  `}
>
        {icon}
      </div>

      {/* Arrow */}
      {/* <div
        className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full ${arrowBg} ${arrowColor}`}
      >
        <ArrowUpRight size={10} />
      </div> */}

      {/* Title */}
<p className="mt-2 text-[14px] text-slate-500 md:mt-4 md:text-[16px]">        {title}
      </p>

      {/* Value */}
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className="text-[14px] font-bold text-slate-900 md:text-[20px]">
          {value}
        </span>

        <span className="text-[14px] text-slate-500">
          {label}
        </span>
      </div>

      {/* Amount */}
      {amount && (
        <>
          <p className="mt-1 text-[14px] text-slate-400 md:mt-4 md:text-[15px]">
            Amount
          </p>

          <p className="text-[14px] font-bold text-slate-800 md:text-[18px]">
            {amount}
          </p>
        </>
      )}

    </div>
  );
}

interface OrderCardProps {
  orderId: string;
  items: string;
  customer: string;
  time: string;
  amount: string;
  status: string;
  onAccept?: () => void;
  onNotifyRiders?: () => void;
  updating?: boolean;
}

function OrderCard({
  orderId,
  items,
  customer,
  time,
  amount,
  status,
  onAccept,
  onNotifyRiders,
  updating,
}: OrderCardProps) {
  return (
    <div className="border-b border-slate-100 px-3 py-3 last:border-b-0">

      {/* TOP */}
      <div className="flex items-center justify-between">

        <span className="text-[9px] font-bold text-slate-800">
          {orderId}
        </span>

        <span className="text-[9px] font-bold text-slate-800">
          {amount}
        </span>

      </div>

      {/* DETAILS */}
      <div className="mt-1 flex items-center gap-2">

        <span className="text-[8px] text-slate-500">
          {items}
        </span>

        <span className="text-slate-300">
          •
        </span>

        <span className="flex items-center gap-1 text-[8px] text-slate-500">
          <UserRound size={9} />
          {customer}
        </span>

        <span className="text-slate-300">
          •
        </span>

        <span className="flex items-center gap-1 text-[8px] text-slate-400">
          <Clock3 size={9} />
          {time}
        </span>

      </div>

      {/* STATUS + ACTION */}
      <div className="mt-2 flex items-center justify-between">

        {/* STATUS */}

        <span
          className={`rounded-md px-2 py-1 text-[7px] font-semibold ${
            status === "new_order_request"
              ? "bg-orange-50 text-orange-600"
              : "bg-purple-50 text-purple-600"
          }`}
        >
          {status === "new_order_request"
            ? "Pending"
            : "Looking for Rider"}
        </span>


        {/* ACCEPT */}

        {status === "new_order_request" && (
          <button
            type="button"
            onClick={onAccept}
            disabled={updating}
            className="
              rounded-md
              bg-green-600
              px-3
              py-1.5
              text-[8px]
              font-semibold
              text-white
              hover:bg-green-700
              disabled:opacity-50
            "
          >
            {updating
              ? "Accepting..."
              : "Accept Order"}
          </button>
        )}


        {/* NOTIFY RIDERS */}

        {/* {status === "looking_for_rider" && (
          <button
            type="button"
            onClick={onNotifyRiders}
            disabled={updating}
            className="
              rounded-md
              bg-purple-600
              px-3
              py-1.5
              text-[8px]
              font-semibold
              text-white
              hover:bg-purple-700
              disabled:opacity-50
            "
          >
            {updating
              ? "Notifying..."
              : "Notify Riders"}
          </button>
        )} */}

      </div>

    </div>
  );
}