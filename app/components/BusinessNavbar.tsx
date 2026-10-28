"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import {
  User,
  Shield,
  Store,
  ChevronDown,
  LogOut,
  UserCircle,
  Menu,
  X,
  Bell,
  Pencil,
  AtSign,
  CreditCard,
} from "lucide-react";
import { logoutUser } from "../services/logout";
import { getMyStores } from "../services/businessStoreApi";
import CreateStoreDialog from "./stores/CreateStoreDialog";

interface UserData {
  _id: string;
  username?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;

  profilePic?: string;
  profilePicture?: string;
  image?: string;

  isAdmin?: boolean;
  isBusiness?: boolean;
}

interface NavbarProps {
  onAccountModalChange?: (open: boolean) => void;
  onStoreClick?: () => void;

  // Desktop online/offline
  isOnline?: boolean;
  onOnlineStatusChange?: (isOnline: boolean) => void;
  updatingStatus?: boolean;
}
interface StoreMember {
  userId: string;
  role?: "owner" | "manager" | "employee";
  isOwner?: boolean;
  status?: "active" | "revoked";
}

interface StoreData {
  _id: string;
  storeId: string;
  storeName: string;
  category?: string;
  userId?: string;
  users?: StoreMember[];
  subscription?: {
    subscriptionId?: string | { _id?: string } | null;
    expireAt?: string | null;
  } | null;
}

export default function Navbar({
  onAccountModalChange,
  onStoreClick,
  isOnline = false,
  onOnlineStatusChange,
  updatingStatus = false,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  const [accountLoading, setAccountLoading] = useState(false);

  const [accountUser, setAccountUser] = useState<UserData | null>(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const [editEmail, setEditEmail] = useState("");

  const [logoutLoading, setLogoutLoading] = useState(false);
  const [storeName, setStoreName] = useState("My Store");
  const [storeId, setStoreId] = useState("");

  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);

  const [stores, setStores] = useState<StoreData[]>([]);

  const [storesLoading, setStoresLoading] = useState(false);

  const [selectedStore, setSelectedStore] =
    useState<StoreData | null>(null);

  const [createStoreModalOpen, setCreateStoreModalOpen] = useState(false);
  const [storeOwnerOnlyModalOpen, setStoreOwnerOnlyModalOpen] = useState(false);
  const [storeOwnerConfirmOpen, setStoreOwnerConfirmOpen] = useState(false);

  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);

  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");

  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
const [subscriptionStores, setSubscriptionStores] = useState<StoreData[]>([]);
const [subscriptionLoading, setSubscriptionLoading] = useState(false);
const [activatingStoreId, setActivatingStoreId] = useState("");
const [subscriptionError, setSubscriptionError] = useState("");

  // ==========================================
  // FETCH CURRENT USER
  // ==========================================

  useEffect(() => {
    const initializeNavbar = async () => {
      await fetchCurrentUser();

      const savedStoreId =
        localStorage.getItem("selectedStoreId");

      await fetchAllStores(
        savedStoreId || undefined
      );
    };

    initializeNavbar();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return;
      }

      const { data } = await axios.get(
        "https://api.thover.in/v1/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.success && data?.user) {
        setUser(data.user);

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }
    } catch (error: any) {
      console.error(
        "Failed to fetch current user:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("selectedStoreId");

        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStores = async (
    preferredStoreId?: string
  ) => {
    try {
      setStoresLoading(true);

      const data = await getMyStores();

      if (!data?.success) {
        setStores([]);
        setSelectedStore(null);
        setStoreName("My Store");
        setStoreId("");
        return;
      }

      const storeList: StoreData[] =
        data.stores || [];

      // No stores
      if (storeList.length === 0) {
        setStores([]);
        setSelectedStore(null);
        setStoreName("My Store");
        setStoreId("");

        localStorage.removeItem("selectedStoreId");

        return;
      }

      // Priority:
      // 1. preferredStoreId
      // 2. localStorage selectedStoreId
      // 3. currently selected store
      // 4. first store

      const savedStoreId =
        localStorage.getItem("selectedStoreId");

      const current =
        storeList.find(
          (store) =>
            store._id === preferredStoreId
        ) ||
        storeList.find(
          (store) =>
            store._id === savedStoreId
        ) ||
        storeList.find(
          (store) =>
            store._id === selectedStore?._id
        ) ||
        storeList[0];

      // Selected store first
      const sortedStores = [
        current,
        ...storeList.filter(
          (store) => store._id !== current._id
        ),
      ];

      setStores(sortedStores);

      setSelectedStore(current);
      setStoreName(current.storeName);
      setStoreId(current.storeId);

      // Always persist selected Mongo _id
      localStorage.setItem(
        "selectedStoreId",
        current._id
      );
    } catch (error: any) {
      console.error(
        "FETCH ALL STORES ERROR:",
        error.response?.data ||
        error.message ||
        error
      );
    } finally {
      setStoresLoading(false);
    }
  };

  const selectStore = (store: StoreData) => {
    // React state
    setSelectedStore(store);
    setStoreName(store.storeName);
    setStoreId(store.storeId);
    setStoreDropdownOpen(false);

    // IMPORTANT:
    // MongoDB _id save karna hai
    localStorage.setItem(
      "selectedStoreId",
      store._id
    );

    // Other pages ko notify karo
    window.dispatchEvent(
      new Event("selectedStoreChanged")
    );

    // Selected store ko top par rakho
    setStores((prev) => [
      store,
      ...prev.filter(
        (item) => item._id !== store._id
      ),
    ]);
  };

  const handleViewStore = (store: StoreData) => {
    const loggedInUserId = user?._id;

    if (!loggedInUserId) {
      return;
    }

    // =========================
    // OWNER CHECK
    // =========================

    const ownerId =
      typeof store.userId === "object"
        ? (store.userId as any)?._id
        : store.userId;

    const isOwner =
      ownerId?.toString() === loggedInUserId.toString();

    // =========================
    // STORE MEMBER CHECK
    // =========================

    const member = store.users?.find((item: any) => {
      const memberUserId =
        typeof item.userId === "object"
          ? item.userId?._id
          : item.userId;

      return (
        memberUserId?.toString() === loggedInUserId.toString() &&
        item.status === "active"
      );
    });

    const isManager = member?.role === "manager";

    console.log("VIEW STORE DEBUG:", {
      storeId: store._id,
      storeOwnerId: ownerId,
      loggedInUserId,
      isOwner,
      member,
      isManager,
    });

    // =========================
    // OWNER
    // =========================

    if (isOwner) {
      setStoreDropdownOpen(false);

      router.push(
        `/business-dashboard/store?storeId=${store._id}`
      );

      return;
    }

    // =========================
    // MANAGER
    // =========================

    if (isManager) {
      setStoreDropdownOpen(false);
      setStoreOwnerOnlyModalOpen(true);
      return;
    }

    // =========================
    // OTHER USERS
    // =========================

    setStoreDropdownOpen(false);
    setStoreOwnerOnlyModalOpen(true);
  };

  useEffect(() => {
    const initializeNavbar = async () => {
      await fetchCurrentUser();

      const savedStoreId =
        localStorage.getItem("selectedStoreId");

      await fetchAllStores(
        savedStoreId || undefined
      );
    };

    initializeNavbar();
  }, []);

  const handleEditProfile = async () => {
  setEditError("");

  if (!editName.trim()) {
    setEditError("Please enter your name.");
    return;
  }

  if (!editUsername.trim()) {
    setEditError("Please enter your username.");
    return;
  }

  try {
    setEditLoading(true);

    const response = await axios.put(
      "https://api.thover.in/v1/api/user/complete-profile",
      {
        name: editName.trim(),
        username: editUsername.trim(),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data?.success) {
      setAccountUser(response.data.user);

      setUser(response.data.user);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setEditProfileModalOpen(false);
    }
  } catch (error: any) {
    console.error(
      "EDIT PROFILE ERROR:",
      error.response?.data || error.message
    );

    setEditError(
      error.response?.data?.message ||
        "Unable to update profile."
    );
  } finally {
    setEditLoading(false);
  }
};

  const fetchUserDetails = async () => {
    if (!user?._id) {
      return;
    }

    try {
      setAccountLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const { data } = await axios.get(
        `https://api.thover.in/v1/api/user/details/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "USER DETAILS:",
        data
      );

      if (data?.success && data?.user) {
        setAccountUser(data.user);
      }

    } catch (error: any) {
      console.error(
        "GET USER DETAILS ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
        "Unable to load account details."
      );
    } finally {
      setAccountLoading(false);
    }
  };

  const openAccountModal = () => {
    setProfileOpen(false);
    setAccountModalOpen(true);
    onAccountModalChange?.(true);
    fetchUserDetails();
  };

  const openEditProfileModal = () => {
    setEditUsername(accountUser?.username || "");
    setEditEmail(accountUser?.email || "");

    setAccountModalOpen(false);
    onAccountModalChange?.(false);

    setEditProfileModalOpen(true);
  };


  // ==========================================
  // CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target as Node
        )
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const fetchSubscriptionStores = async () => {
  try {
    setSubscriptionLoading(true);
    setSubscriptionError("");

    const response = await getMyStores();

    if (!response?.success || !Array.isArray(response.stores)) {
      setSubscriptionStores([]);
      setSubscriptionError("Unable to load subscription details.");
      return;
    }

    setSubscriptionStores(response.stores);
  } catch (error) {
    console.error("SUBSCRIPTION STORES ERROR:", error);
    setSubscriptionError("Unable to load subscription details.");
  } finally {
    setSubscriptionLoading(false);
  }
};

const handleActivateSubscription = async (publicStoreId: string) => {
  try {
    setActivatingStoreId(publicStoreId);
    setSubscriptionError("");

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const { data } = await axios.post(
      `https://api.thover.in/v2/api/plans/${encodeURIComponent(
        publicStoreId
      )}/activate-my-store`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data?.success) {
      await fetchSubscriptionStores();
    } else {
      setSubscriptionError(
        data?.message || "Unable to activate the plan."
      );
    }
  } catch (error: any) {
    setSubscriptionError(
      error.response?.data?.message ||
        "Unable to activate the plan."
    );
  } finally {
    setActivatingStoreId("");
  }
};



  // ==========================================
  // NAVIGATION
  // ==========================================

  const goToAdmin = () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    router.push("/admin/dashboard");
  };

  const goToProfile = () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    router.push("/profile");
  };

  const goToDashboard = () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    router.push("/business-dashboard");
  };

  const goToInventory = () => {
    setMobileMenuOpen(false);
    router.push("/inventory");
  };

  const goToOrders = () => {
    setMobileMenuOpen(false);
    router.push("/orders");
  };
  const goToStore = () => {
    setMobileMenuOpen(false);
    setProfileOpen(false);

    router.push("/business-dashboard/store");
  };
  // ==========================================
  // LOGOUT
  // ==========================================
  const openLogoutModal = () => {
    setAccountModalOpen(false);
    setProfileOpen(false);
    setLogoutModalOpen(true);
  };
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      const token = localStorage.getItem("token");

      const userId =
        user?._id ||
        JSON.parse(
          localStorage.getItem("user") || "{}"
        )?._id ||
        localStorage.getItem("userId");

      const deviceId =
        localStorage.getItem("deviceId");

      if (!token) {
        alert("Authentication token not found.");
        return;
      }

      if (!userId) {
        alert("User information not found.");
        return;
      }

      if (!deviceId) {
        alert("Device ID not found.");
        return;
      }

      await logoutUser(
        userId,
        deviceId,
        token
      );

      setLogoutModalOpen(false);
      setProfileOpen(false);
      setAccountModalOpen(false);

      localStorage.removeItem("selectedStoreId");

      router.push("/login");

    } catch (error: any) {
      console.error(
        "LOGOUT ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        error.message ||
        "Unable to logout."
      );
    } finally {
      setLogoutLoading(false);
    }
  };



  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <header className="h-16 border-b bg-white">
        <div className="flex h-full items-center px-4 sm:px-8">
          <div className="text-xl font-bold sm:text-2xl">
            THOVER{" "}
            <span className="font-normal">
              Business
            </span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className="
    fixed
    inset-x-0
    top-0
    z-[100]
    bg-white
    shadow-sm
  "
    >

      {/* =================================================
          TOP NAVBAR
      ================================================= */}

      {/* =================================================
    TOP NAVBAR
================================================= */}

      <div className="flex h-16 items-center px-4 sm:h-20 sm:px-8">


        {/* =================================================
      LOGO
  ================================================= */}
        <button
          type="button"
          onClick={goToDashboard}
          className="flex shrink-0 items-center gap-2"
        >
          <img
            src="/icon.png"
            alt="Thover Business"
            className="h-13 w-13 object-contain rounded-[6px] "
          />

          <div className="hidden sm:block whitespace-nowrap text-left">
            <span className="text-[25px] font-extrabold tracking-tight text-[#111936]">
              THOVER
            </span>{" "}
            <span className="text-[25px] font-extrabold text-green-600">
              BUSINESS
            </span>
          </div>
        </button>


        {/* =================================================
      DESKTOP RIGHT SIDE
  ================================================= */}
        <div className="ml-auto hidden items-center gap-4 lg:flex">

          {/* =================================================
  STORE
================================================= */}
{stores.length > 0 && (
  <div className="relative">

    <button
      type="button"
      onClick={() => {
        setStoreDropdownOpen((prev) => !prev);

        if (!storeDropdownOpen) {
          const savedStoreId =
            localStorage.getItem("selectedStoreId");

          fetchAllStores(savedStoreId || undefined);
        }
      }}
      className="
        flex
        h-12
        min-w-[175px]
        items-center
        justify-between
        gap-3
        rounded-xl
        border
        border-slate-200
        bg-white
        px-4
        text-sm
        font-medium
        text-slate-800
        shadow-sm
        transition
        cursor-pointer
      "
    >
      <div className="flex min-w-0 items-center gap-2">
        <Store
          size={20}
          className="shrink-0 text-violet-600"
        />

        <span className="max-w-[105px] truncate">
          {storeName}
        </span>
      </div>

      <ChevronDown
        size={18}
        className={`shrink-0 transition-transform ${
          storeDropdownOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    {storeDropdownOpen && (
              <div
                className="
            absolute
            right-0
            top-14
            z-[9999]
            w-[310px]
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-3
            shadow-xl
          "
              >

                <div className="px-2 pb-2">
                  <p className="text-sm font-semibold text-slate-900">
                    Select Store
                  </p>

                  <p className="text-xs text-slate-400">
                    Choose the store you want to manage
                  </p>
                </div>


                <div className="max-h-[300px] space-y-1 overflow-y-auto">

                  {storesLoading ? (
                    <div className="px-3 py-8 text-center text-sm text-slate-400">
                      Loading stores...
                    </div>
                  ) : stores.length === 0 ? (
                    <div className="px-3 py-8 text-center text-sm text-slate-400">
                      No stores found
                    </div>
                  ) : (
                    stores.map((store) => {

                      const isSelected =
                        selectedStore?._id === store._id;

                      return (
                        <div
                          key={store._id}
                          className={`
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      transition
                      ${isSelected
                              ? "bg-violet-50 px-2.5 py-3"
                              : "px-2 py-1.5"
                            }
                    `}
                        >

                          {/* CHECK */}
                          <button
                            type="button"
                            onClick={() => selectStore(store)}
                            className="shrink-0"
                          >
                            {isSelected ? (
                              <div className="
                          flex
                          h-6
                          w-6
                          items-center
                          justify-center
                          rounded-full
                          bg-violet-600
                          text-white
                        ">
                                ✓
                              </div>
                            ) : (
                              <div className="
                          h-5
                          w-5
                          rounded-full
                          border-2
                          border-slate-300
                        " />
                            )}
                          </button>


                          {/* STORE INFO */}
                          <button
                            type="button"
                            onClick={() => selectStore(store)}
                            className="min-w-0 flex-1 text-left"
                          >
                            <p
                              className={`
                          truncate
                          font-semibold
                          ${isSelected
                                  ? "text-[14px] text-slate-900"
                                  : "text-[12px] text-slate-700"
                                }
                        `}
                            >
                              {store.storeName}
                            </p>

                            <p className="text-[9px] text-slate-400">
                              ID: {store.storeId}
                            </p>
                          </button>


                          {/* VIEW */}
                          {isSelected && (
                            <button
                              type="button"
                              onClick={() => handleViewStore(store)}
                              className="
                          shrink-0
                          rounded-lg
                          border
                          border-violet-200
                          px-3
                          py-1.5
                          text-[11px]
                          font-medium
                          text-violet-600
                          transition
                          hover:bg-violet-100
                        "
                            >
                              View
                            </button>
                          )}

                        </div>
                      );
                    })
                  )}

                </div>


                {/* ADD STORE */}
                <div className="mt-2 border-t border-slate-100 pt-2">

                  <button
                    type="button"
                    onClick={() => {
                      setStoreDropdownOpen(false);
                      setStoreOwnerConfirmOpen(true);
                    }}
                    className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-violet-200
                bg-violet-50
                py-2
                text-xs
                font-semibold
                text-violet-600
                transition
                hover:bg-violet-100
              "
                  >
                    <span>+</span>
                    Add Store
                  </button>

                </div>

              </div>
            )}

  </div>
)}


          {/* =================================================
  ONLINE / OFFLINE
================================================= */}
{stores.length > 0 && (
  <button
    type="button"
    disabled={updatingStatus}
    onClick={() =>
      onOnlineStatusChange?.(!isOnline)
    }
    className={`
      flex
      h-12
      items-center
      gap-3
      rounded-full
      border
      px-4
      transition
      ${
        isOnline
          ? "border-green-100 bg-green-50 text-green-600"
          : "border-red-100 bg-red-50 text-red-500"
      }
      ${
        updatingStatus
          ? "cursor-not-allowed opacity-60"
          : "hover:shadow-sm"
      }
    `}
  >
    {/* STATUS DOT */}
    <span
      className={`
        h-3
        w-3
        shrink-0
        rounded-full
        ${
          isOnline
            ? "bg-green-500"
            : "bg-red-500"
        }
      `}
    />

    {/* STATUS TEXT */}
    <span className="text-sm font-semibold">
      {isOnline ? "Online" : "Offline"}
    </span>

    {/* SWITCH */}
    <span
      className={`
        relative
        h-7
        w-12
        shrink-0
        rounded-full
        p-1
        transition
        ${
          isOnline
            ? "bg-green-500"
            : "bg-slate-300"
        }
      `}
    >
      <span
        className={`
          block
          h-5
          w-5
          rounded-full
          bg-white
          shadow
          transition-transform
          ${
            isOnline
              ? "translate-x-5"
              : "translate-x-0"
          }
        `}
      />
    </span>
  </button>
)}


          {/* =================================================
        PROFILE
    ================================================= */}
          <div
            ref={profileRef}
            className="relative shrink-0"
          >

            <button
              type="button"
              onClick={openAccountModal}
              className="
          flex
          items-center
          gap-2
          rounded-full
          p-1.5
          transition
          hover:bg-slate-50
        "
            >

              <div
                className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-gradient-to-br
            from-violet-500
            to-purple-700
            text-white
          "
              >
                <User size={23} />
              </div>

            </button>

          </div>

        </div>


        {/* =================================================
      MOBILE RIGHT SIDE
      ONLY STORE + PROFILE
  ================================================= */}
        <div className="ml-auto flex items-center gap-2 lg:hidden">

          {/* MOBILE STORE */}
{stores.length > 0 && (
  <div className="relative">

    <button
      type="button"
      onClick={() => {
        setStoreDropdownOpen((prev) => !prev);

        if (!storeDropdownOpen) {
          const savedStoreId =
            localStorage.getItem("selectedStoreId");

          fetchAllStores(savedStoreId || undefined);
        }
      }}
      className="
        flex
        h-10
        max-w-[150px]
        items-center
        gap-2
        rounded-xl
        border
        border-slate-200
        bg-white
        px-2.5
        shadow-sm
      "
    >
      <Store
        size={18}
        className="shrink-0 text-violet-600"
      />

      <span className="max-w-[75px] truncate text-xs font-semibold text-slate-800">
        {storeName}
      </span>

      <ChevronDown
        size={15}
        className={`shrink-0 text-slate-500 transition-transform ${
          storeDropdownOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    {/* MOBILE STORE DROPDOWN */}
            {storeDropdownOpen && (
              <div
                className="
            absolute
            right-0
            top-12
            z-[9999]
            w-[290px]
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-3
            shadow-xl
          "
              >

                <div className="px-2 pb-2">
                  <p className="text-sm font-semibold text-slate-900">
                    Select Store
                  </p>

                  <p className="text-xs text-slate-400">
                    Choose the store you want to manage
                  </p>
                </div>

                <div className="max-h-[300px] space-y-1 overflow-y-auto">

                  {stores.map((store) => {

                    const isSelected =
                      selectedStore?._id === store._id;

                    return (
                      <div
                        key={store._id}
                        className={`
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    ${isSelected
                            ? "bg-violet-50 px-2.5 py-3"
                            : "px-2 py-1.5"
                          }
                  `}
                      >

                        <button
                          type="button"
                          onClick={() => selectStore(store)}
                          className="shrink-0"
                        >
                          {isSelected ? (
                            <div className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-violet-600
                        text-white
                      ">
                              ✓
                            </div>
                          ) : (
                            <div className="
                        h-5
                        w-5
                        rounded-full
                        border-2
                        border-slate-300
                      " />
                          )}
                        </button>


                        <button
                          type="button"
                          onClick={() => selectStore(store)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {store.storeName}
                          </p>

                          <p className="text-[9px] text-slate-400">
                            ID: {store.storeId}
                          </p>
                        </button>


                        {isSelected && (
                          <button
                            type="button"
                            onClick={() => handleViewStore(store)}
                            className="
                        rounded-lg
                        border
                        border-violet-200
                        px-2.5
                        py-1.5
                        text-[10px]
                        font-medium
                        text-violet-600
                        hover:bg-violet-100
                      "
                          >
                            View
                          </button>
                        )}

                      </div>
                    );
                  })}

                </div>


                <div className="mt-2 border-t border-slate-100 pt-2">

                  <button
                    type="button"
                    onClick={() => {
                      setStoreDropdownOpen(false);
                      setStoreOwnerConfirmOpen(true);
                    }}
                    className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-violet-200
                bg-violet-50
                py-2
                text-xs
                font-semibold
                text-violet-600
              "
                  >
                    +
                    Add Store
                  </button>

                </div>

              </div>
            )}

  </div>
)}


          {/* MOBILE PROFILE */}
          <button
            type="button"
            onClick={openAccountModal}
            className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        bg-gradient-to-br
        from-violet-500
        to-purple-700
        text-white
        shadow-sm
      "
          >
            <User size={21} />
          </button>

        </div>

      </div>

      {/* =================================================
    DESKTOP BUSINESS NAVIGATION
================================================= */}

      {/* {user?.isBusiness && (
        <div
          className="
            hidden
            h-14
            items-center
            gap-3
            bg-gray-800
            px-8
            text-white
            sm:flex
          "
        >
          <button
            onClick={goToDashboard}
            className="
              rounded-lg
              px-5
              py-2
              text-sm
              hover:bg-gray-700
            "
          >
            Dashboard
          </button>

          <button
            onClick={goToInventory}
            className="
              rounded-lg
              px-5
              py-2
              text-sm
              hover:bg-gray-700
            "
          >
            Inventory
          </button>

          <button
            onClick={goToOrders}
            className="
              rounded-lg
              px-5
              py-2
              text-sm
              hover:bg-gray-700
            "
          >
            Orders
          </button>
        </div>
      )} */}

      {/* =================================================
          MOBILE BUSINESS MENU
      ================================================= */}

      {user?.isBusiness &&
        mobileMenuOpen && (
          <div
            className="
              border-t
              border-slate-200
              bg-white
              px-4
              py-3
              shadow-md
              sm:hidden
            "
          >
            <div className="flex flex-col gap-1">

              <button
                onClick={goToDashboard}
                className="
                  rounded-lg
                  px-3
                  py-3
                  text-left
                  text-sm
                  font-medium
                  text-slate-700
                  hover:bg-slate-50
                "
              >
                Dashboard
              </button>

              <button
                onClick={goToInventory}
                className="
                  rounded-lg
                  px-3
                  py-3
                  text-left
                  text-sm
                  font-medium
                  text-slate-700
                  hover:bg-slate-50
                "
              >
                Inventory
              </button>

              <button
                onClick={goToOrders}
                className="
                  rounded-lg
                  px-3
                  py-3
                  text-left
                  text-sm
                  font-medium
                  text-slate-700
                  hover:bg-slate-50
                "
              >
                Orders
              </button>

              {user?.isAdmin && (
                <button
                  onClick={goToAdmin}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    px-3
                    py-3
                    text-left
                    text-sm
                    font-medium
                    text-blue-600
                    hover:bg-blue-50
                  "
                >
                  <Shield size={17} />
                  Admin
                </button>
              )}

            </div>
          </div>
        )}

      {/* =================================================
    ACCOUNT MODAL
================================================= */}

      {accountModalOpen && (
        <div
          className="
    fixed
    inset-0
    z-[999999]
    flex
    items-center
    justify-center
    bg-black/50
    px-3
    py-3
    sm:px-4
    sm:py-6
    backdrop-blur-[2px]
  "
          onClick={() => {
            setAccountModalOpen(false);
            onAccountModalChange?.(false);
          }}
        >
          <div
            className="
    relative
    flex
    w-full
    max-w-md
    flex-col
    overflow-hidden
    rounded-2xl
    bg-white
    shadow-2xl
    max-h-[calc(100dvh-90px)]
    sm:max-h-[90vh]
  "
            onClick={(e) => e.stopPropagation()}
          >

            {/* HEADER */}

            <div
              className="
          flex
    shrink-0
    items-center
    justify-between
    border-b
    border-slate-100
    px-5
    py-4
        "
            >
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  My Account
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Your account information
                </p>
              </div>

              <div className="flex items-center gap-1">

                {/* LOGOUT ICON */}
                <button
                  type="button"
                  onClick={openLogoutModal}
                  disabled={logoutLoading}
                  className="
      flex
      h-8
      w-8
      items-center
      justify-center
      rounded-full
      text-red-500
      transition
      hover:bg-red-50
      disabled:opacity-50
    "
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>

                {/* CLOSE */}
                <button
                  type="button"
                  onClick={() => {
                    setAccountModalOpen(false);
                    onAccountModalChange?.(false);
                  }}
                  className="
      flex
      h-8
      w-8
      items-center
      justify-center
      rounded-full
      text-slate-500
      transition
      hover:bg-slate-100
    "
                  title="Close"
                >
                  <X size={18} />
                </button>

              </div>
            </div>


            {/* CONTENT */}

            {accountLoading ? (
              <div className="px-5 py-12 text-center">
                <p className="text-sm text-slate-500">
                  Loading account...
                </p>
              </div>
            ) : (
              <div
                className="
    min-h-0
    flex-1
    overflow-y-auto
    overscroll-contain
    px-5
    py-5
    pb-6
    scrollbar-thin
  "
              >

                {/* PROFILE */}

                <div className="flex flex-col items-center">

                  <div
                    className="
                flex
                h-20
                w-20
                items-center
                justify-center
                overflow-hidden
                rounded-full
                border
                border-slate-200
                bg-slate-100
              "
                  >
                    {(
                      accountUser?.profilePic ||
                      accountUser?.profilePicture ||
                      accountUser?.image
                    ) ? (
                      <img
                        src={
                          accountUser.profilePic ||
                          accountUser.profilePicture ||
                          accountUser.image
                        }
                        alt="Profile"
                        className="
                    h-full
                    w-full
                    object-cover
                  "
                      />
                    ) : (
                      <span
                        className="
                    text-2xl
                    font-bold
                    uppercase
                    text-slate-600
                  "
                      >
                        {(
                          accountUser?.username ||
                          accountUser?.name ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-slate-900">
                    {accountUser?.name ||
                      "Name not available"}
                  </h3>

                  <p className="mt-0.5 text-sm text-slate-500">
                    {accountUser?.username ||
                      "username"}
                  </p>

                </div>


                {/* USER DETAILS */}

                <div className="mt-6 space-y-3">

                  {/* NAME */}

                  <div
                    className="
                rounded-xl
                border
                border-slate-100
                bg-slate-50
                px-4
                py-3
              "
                  >
                    <p className="text-xs text-slate-400">
                      Name
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {accountUser?.name || "—"}
                    </p>
                  </div>


                  {/* USERNAME */}

                  <div
                    className="
                rounded-xl
                border
                border-slate-100
                bg-slate-50
                px-4
                py-3
              "
                  >
                    <p className="text-xs text-slate-400">
                      Username
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {accountUser?.username
                        ? `${accountUser.username}`
                        : "—"}
                    </p>
                  </div>


                  {/* EMAIL */}

                  {accountUser?.email && (
                    <div
                      className="
                  rounded-xl
                  border
                  border-slate-100
                  bg-slate-50
                  px-4
                  py-3
                "
                    >
                      <p className="text-xs text-slate-400">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-slate-800">
                        {accountUser.email}
                      </p>
                    </div>
                  )}


                  {/* PHONE */}

                  {accountUser?.phoneNumber && (
                    <div
                      className="
                  rounded-xl
                  border
                  border-slate-100
                  bg-slate-50
                  px-4
                  py-3
                "
                    >
                      <p className="text-xs text-slate-400">
                        Phone Number
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {accountUser.phoneNumber}
                      </p>
                    </div>
                  )}

                </div>


                {/* CLOSE */}

                {/* EDIT PROFILE BUTTON */}
                <button
                  type="button"
                  onClick={openEditProfileModal}
                  className="
    mt-6
    flex
    w-full
    items-center
    justify-center
    gap-2
    rounded-xl
    border
    border-blue-200
    bg-blue-50
    px-4
    py-3
    text-sm
    font-semibold
    text-blue-600
    transition
    hover:bg-blue-100
  "
                >
                  <Pencil size={17} />
                  Edit Profile
                </button>

                <button
  type="button"
  onClick={async () => {
    setSubscriptionOpen((prev) => !prev);
    await fetchSubscriptionStores();
  }}
  className="flex w-full items-center justify-center gap-2 mt-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-600 transition hover:bg-blue-100"
>
  <CreditCard size={20} />
  <span>Subscription</span>
</button>

{subscriptionOpen && (
  <div className="mt-2 max-h-80 space-y-3 overflow-y-auto border-t border-slate-100 pt-3">
    <p className="px-2 text-sm font-semibold text-slate-800">
      My Stores
    </p>

    {subscriptionLoading ? (
      <p className="px-2 py-3 text-sm text-slate-500">
        Loading stores...
      </p>
    ) : subscriptionError ? (
      <p className="px-2 py-3 text-sm text-red-600">
        {subscriptionError}
      </p>
    ) : subscriptionStores.length === 0 ? (
      <p className="px-2 py-3 text-sm text-slate-500">
        No stores found.
      </p>
    ) : (
      subscriptionStores.map((item) => {
        const expiry = item.subscription?.expireAt;

        const isActive =
          Boolean(item.subscription?.subscriptionId) &&
          Boolean(expiry) &&
          new Date(expiry!).getTime() >= Date.now();

        return (
          <div
            key={item._id}
            className="rounded-lg border border-slate-200 bg-slate-50 p-3"
          >
            <p className="font-medium text-slate-900">
              {item.storeName}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Store ID: {item.storeId}
            </p>

            
<p
  className={`mt-1 text-sm font-semibold ${
    isActive ? "text-green-600" : "text-amber-600"
  }`}
>
  {isActive ? "Active Plan" : "No Active Plan"}
</p>

{expiry && (
  <p className="mt-1 text-xs text-slate-500">
    Expires on:{" "}
    {new Date(expiry).toLocaleDateString("en-IN")}
  </p>
)}


            {isActive ? (
              <button
                type="button"
                disabled
                className="mt-2 rounded-lg bg-green-100 px-3 py-2 text-xs font-semibold text-green-700"
              >
                Active Plan
              </button>
            ) : (
              <button
                type="button"
                disabled={Boolean(activatingStoreId)}
                onClick={() =>
                  void handleActivateSubscription(item.storeId)
                }
                className="mt-2 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {activatingStoreId === item.storeId
                  ? "Activating..."
                  : "Activate Plan"}
              </button>
            )}
          </div>
        );
      })
    )}
  </div>
)}

              </div>
            )}

          </div>
        </div>
      )}

      {logoutModalOpen && (
        <div
          className="
      fixed
      inset-0
      z-[10000]
      flex
      items-center
      justify-center
      bg-black/50
      px-4
      backdrop-blur-[2px]
    "
          onClick={() => {
            if (!logoutLoading) {
              setLogoutModalOpen(false);
            }
          }}
        >
          <div
            className="
        w-full
        max-w-sm
        rounded-2xl
        bg-white
        p-6
        shadow-2xl
      "
            onClick={(e) => e.stopPropagation()}
          >

            {/* ICON */}

            <div className="flex justify-center">
              <div
                className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-red-50
          "
              >
                <LogOut
                  size={25}
                  className="text-red-500"
                />
              </div>
            </div>

            {/* TITLE */}

            <div className="mt-4 text-center">

              <h2 className="text-lg font-bold text-slate-900">
                Logout?
              </h2>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Are you sure you want to logout
                from this device?
              </p>

            </div>

            {/* BUTTONS */}

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                disabled={logoutLoading}
                onClick={() =>
                  setLogoutModalOpen(false)
                }
                className="
            flex-1
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            text-sm
            font-semibold
            text-slate-700
            hover:bg-slate-50
            disabled:opacity-50
          "
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={logoutLoading}
                onClick={handleLogout}
                className="
            flex-1
            rounded-xl
            bg-red-600
            px-4
            py-3
            text-sm
            font-semibold
            text-white
            hover:bg-red-700
            disabled:opacity-50
          "
              >
                {logoutLoading
                  ? "Logging out..."
                  : "Logout"}
              </button>

            </div>

          </div>
        </div>
      )}

      {editProfileModalOpen && (
  <div
    className="
      fixed inset-0 z-[10000]
      flex items-center justify-center
      bg-black/50 px-4
      backdrop-blur-[2px]
    "
    onClick={() => {
      if (!editLoading) {
        setEditProfileModalOpen(false);
      }
    }}
  >
    <div
      className="
        w-full max-w-md
        rounded-2xl
        bg-white
        p-6
        shadow-2xl
      "
      onClick={(e) => e.stopPropagation()}
    >

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Edit Profile
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Update your name and username
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditProfileModalOpen(false)}
          disabled={editLoading}
          className="
            flex h-8 w-8
            items-center justify-center
            rounded-full
            text-slate-500
            hover:bg-slate-100
          "
        >
          <X size={18} />
        </button>

      </div>

      {/* NAME */}
      <div className="mt-6">

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Name
        </label>

        <div className="relative">

          <User
            size={18}
            className="
              absolute left-3 top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            value={editName}
            onChange={(e) => {
              setEditName(e.target.value);
              setEditError("");
            }}
            placeholder="Enter your name"
            className="
              h-11 w-full
              rounded-xl
              border border-slate-200
              bg-white
              pl-10 pr-4
              text-sm
              text-slate-900
              outline-none
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
            "
          />

        </div>

      </div>

      {/* USERNAME */}
      <div className="mt-5">

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Username
        </label>

        <div className="relative">

          <UserCircle
            size={18}
            className="
              absolute left-3 top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            value={editUsername}
            onChange={(e) => {
              let value = e.target.value;

              if (value && !value.startsWith("")) {
                value = `${value}`;
              }

              setEditUsername(value);
              setEditError("");
            }}
            placeholder="username"
            className="
              h-11 w-full
              rounded-xl
              border border-slate-200
              bg-white
              pl-10 pr-4
              text-sm
              text-slate-900
              outline-none
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
            "
          />

        </div>

      </div>

      {/* ERROR */}
      {editError && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">
            {editError}
          </p>
        </div>
      )}

      {/* BUTTONS */}
      <div className="mt-6 flex gap-3">

        <button
          type="button"
          disabled={editLoading}
          onClick={() => setEditProfileModalOpen(false)}
          className="
            flex-1
            rounded-xl
            border border-slate-200
            bg-white
            px-4 py-3
            text-sm font-semibold
            text-slate-700
            hover:bg-slate-50
            disabled:opacity-50
          "
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={editLoading}
          onClick={handleEditProfile}
          className="
            flex-1
            rounded-xl
            bg-blue-600
            px-4 py-3
            text-sm font-semibold
            text-white
            hover:bg-blue-700
            disabled:opacity-50
          "
        >
          {editLoading ? "Saving..." : "Save Changes"}
        </button>

      </div>

    </div>
  </div>
)}


      {storeOwnerOnlyModalOpen && (
        <div
          className="
      fixed
      inset-0
      z-[9999999]
      flex
      items-center
      justify-center
      bg-black/50
      px-4
      backdrop-blur-[2px]
    "
          onClick={() => setStoreOwnerOnlyModalOpen(false)}
        >
          <div
            className="
        w-full
        max-w-sm
        rounded-2xl
        bg-white
        p-6
        text-center
        shadow-2xl
      "
            onClick={(e) => e.stopPropagation()}
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
          bg-violet-50
        "
            >
              <Store
                size={26}
                className="text-violet-600"
              />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Store Details
            </h2>

            <p className="mt-2 text-sm leading-5 text-slate-500">
              Only the store owner can view store details.
            </p>

            <button
              type="button"
              onClick={() => setStoreOwnerOnlyModalOpen(false)}
              className="
          mt-6
          w-full
          rounded-xl
          bg-violet-600
          px-4
          py-3
          text-sm
          font-semibold
          text-white
          hover:bg-violet-700
        "
            >
              OK
            </button>
          </div>
        </div>
      )}

      {storeOwnerConfirmOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">
              Are you the owner of the store?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Please confirm that you are the owner of the store you want to create.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setStoreOwnerConfirmOpen(false)}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                No
              </button>

              <button
                type="button"
                onClick={() => {
                  setStoreOwnerConfirmOpen(false);
                  setCreateStoreModalOpen(true);
                }}
                className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {createStoreModalOpen && (
        <CreateStoreDialog
          onCreated={(newStore) => {
            setCreateStoreModalOpen(false);

            if (newStore) {
              // New store selected
              setSelectedStore(newStore);
              setStoreName(newStore.storeName);
              setStoreId(newStore.storeId);

              // Save selected store
              localStorage.setItem(
                "selectedStoreId",
                newStore._id
              );

              // Notify all pages
              window.dispatchEvent(
                new Event("selectedStoreChanged")
              );

              // New store first
              setStores((prev) => [
                newStore,
                ...prev.filter(
                  (item) =>
                    item._id !== newStore._id
                ),
              ]);

              // Refresh stores
              fetchAllStores(newStore._id);
            } else {
              const savedStoreId =
                localStorage.getItem(
                  "selectedStoreId"
                );

              fetchAllStores(
                savedStoreId || undefined
              );
            }
          }}
          onClose={() => {
            setCreateStoreModalOpen(false);
          }}
        />
      )}
    </header>
  );
}