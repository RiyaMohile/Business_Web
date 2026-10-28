"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  Settings,
  HelpCircle,
  Shield,
  FileText,
  RotateCcw,
  Store as StoreIcon,
  MapPin,
  Clock,
  Phone,
  Mail,
  Tag,
  ReceiptText,
  X,
  BriefcaseBusiness,
  Users,
  User,
  UserPlus,
  Wallet,
  Share2,
  Store,
  CreditCard,
} from "lucide-react";

import AddMemberModals from "../../components/stores/AddMemberModals";4
import api from "../../services/businessApi";
import {
  getAllUsers,
  addStoreMember,removeStoreMember
} from "../../services/businessStoreApi";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";

interface StoreSubscription {
  subscriptionId?:
    | string
    | {
        _id?: string;
        planId?: {
          name?: string;
          price?: number;
          currency?: string;
          durationMonths?: number;
          maxStores?: number | null;
          unlimitedStores?: boolean;
        };
        expireAt?: string;
        status?: string;
      };
  expireAt?: string;
  createdAt?: string;
}

interface Store {
  _id?: string;
  storeId?: string;
  storeName: string;
  category: string;
  subscription?: StoreSubscription;
  gstNumber?: string;

  status?: "public" | "suspended";
  isVerified?: boolean;
  isOnline?: boolean;
  verification?: {
    status?: "PENDING" | "VERIFIED" | "REJECTED";

    legalProof?: {
      proofType?: string;
      legaldocument?: {
        fileName?: string;
        fileUrl?: string;
        filePath?: string;
      };
    };

    addressProof?: {
      proofType?: string;
      addressdocument?: {
        fileName?: string;
        fileUrl?: string;
        filePath?: string;
      };
    };
  };

   users?: {
  userId?:
    | string
    | {
        _id?: string;
        username?: string;
        name?: string;
        email?: string;
        phoneNumber?: string;
      };
  role?: "owner" | "manager" | "employee";
  isOwner?: boolean;
  status?: "active" | "revoked";
}[];

  userId?: {
    _id?: string;
    name?: string;
    username?: string;
    email?: string;
    phoneNumber?: string;
  };

  address?: {
    addressId?: string;
    area?: string;
    city?: string;
  };

  workingDays?: {
    from?: string;
    to?: string;
  };

  openingHours?: {
    from?: string;
    to?: string;
  };

  contacts?: {
  phoneContactId?: {
    _id?: string;
    number?: string;
    countryCode?: string;
  } | null;

  mailContactId?: {
    _id?: string;
    email?: string;
  } | null;
};
}

interface ViewStoreProps {
  store: Store;
  onClose: () => void;
  onManage: () => void;
  onSubmitDocuments: () => void;

  onAddressUpdated: (
    addressId: string
  ) => Promise<void>;
}

export default function ViewStore({
  store,
  onClose,
  onManage,
  onSubmitDocuments,
  onAddressUpdated,
}: ViewStoreProps) {
  const router = useRouter();
  const memberRole =
  store.users?.find(
    (member) =>
      String(
        typeof member.userId === "object"
          ? member.userId?._id
          : member.userId
      ) ===
      String(
        typeof store.userId === "object"
          ? store.userId?._id
          : store.userId
      )
  )?.role;

  const [showMenu, setShowMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
const [copied, setCopied] = useState(false);
const [storeLink, setStoreLink] = useState("");
  const [showHelpSupport, setShowHelpSupport] =
    useState(false);
    const [showAddMemberModal, setShowAddMemberModal] =
  useState(false);

const [showMemberDetailsModal, setShowMemberDetailsModal] =
  useState(false);

const [searchUser, setSearchUser] = useState("");

const [users, setUsers] = useState<any[]>([]);

const [selectedUser, setSelectedUser] =
  useState<any | null>(null);
  const [myStores, setMyStores] = useState<Store[]>([]);
const [activating, setActivating] = useState(false);
const [activatingStoreId, setActivatingStoreId] = useState("");
const [activationError, setActivationError] = useState("");
const [showLimitModal, setShowLimitModal] = useState(false);
const [loadingMyStores, setLoadingMyStores] = useState(false);

const [addingMember, setAddingMember] = useState(false);
const [showDeleteMemberModal, setShowDeleteMemberModal] =
  useState(false);

const [memberToDelete, setMemberToDelete] =
  useState<{
    userId: string;
    username: string;
  } | null>(null);

const [deletingMember, setDeletingMember] =
  useState(false);
const [members, setMembers] = useState<NonNullable<Store["users"]>>(
  store.users || []
);


useEffect(() => {
  if (store.storeId) {
    setStoreLink(
      `https://thover.in/store?storeId=${store.storeId}`
    );
  }
}, [store.storeId]);

const handleCopyStoreLink = async () => {
  if (!storeLink) return;

  try {
    await navigator.clipboard.writeText(storeLink);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  } catch (error) {
    console.error("COPY LINK ERROR:", error);
  }
};
// ==========================================
// GET ALL USERS
// ==========================================

const fetchAllUsers = async () => {
  try {
    const response = await getAllUsers();

    console.log("========== ALL USERS ==========");
    console.log("RESPONSE:", response);
    console.log("USERS:", response?.users);
    console.log("===============================");

    if (response?.success) {
      setUsers(response.users || []);
    } else {
      setUsers([]);
    }
  } catch (error: any) {
    console.error(
      "GET ALL USERS ERROR:",
      error.response?.data || error.message
    );

    setUsers([]);
  }
};


const getCurrentUserId = (): string => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return "";

    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    return String(
      payload._id || payload.id || payload.userId || ""
    );
  } catch {
    return "";
  }
};

const getOwnerId = (item: Store): string => {
  if (typeof item.userId === "object" && item.userId?._id) {
    return String(item.userId._id);
  }

  const owner = item.users?.find(
    (member) => member.role === "owner" || member.isOwner
  );

  if (!owner) return "";

  return String(
    typeof owner.userId === "object"
      ? owner.userId?._id || ""
      : owner.userId || ""
  );
};



const fetchMyStores = async () => {
  try {
    setLoadingMyStores(true);

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const { data } = await axios.get(
      "https://api.thover.in/v2/api/store/my-stores",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMyStores(data?.stores || []);
  } catch (error: any) {
    console.error(
      "FETCH MY STORES ERROR:",
      error.response?.data || error.message
    );
  } finally {
    setLoadingMyStores(false);
  }
};

useEffect(() => {
  fetchMyStores();
}, []);


const currentUserId = getCurrentUserId();
const currentOwnerId = getOwnerId(store);




const currentStoreFromList = myStores.find(
  (item) => item.storeId === store.storeId
);

const currentSubscription =
  currentStoreFromList?.subscription ?? store.subscription;

const ownExpireAt = currentSubscription?.expireAt;

const hasOwnActivePlan =
  Boolean(currentSubscription?.subscriptionId) &&
  Boolean(ownExpireAt) &&
  new Date(ownExpireAt!).getTime() >= Date.now();

// Owner ke kisi bhi store par active subscription hai ya nahi
const hasOwnerActivePlan = myStores.some((item) => {
  const expiry = item.subscription?.expireAt;

  return (
    Boolean(item.subscription?.subscriptionId) &&
    Boolean(expiry) &&
    new Date(expiry!).getTime() >= Date.now()
  );
});

const hasActivePlan = hasOwnActivePlan;



const isOwner = Boolean(
  currentUserId &&
  currentOwnerId &&
  currentUserId === currentOwnerId
);

const visibleStores = myStores.filter((item) => {
  // Owner ko apne saare stores dikhne chahiye.
  if (isOwner) return true;

  // Non-owner ko apna store aur owner ka main store hi dikhe.
  const isCurrentStore =
    item.storeId === store.storeId;

  const isOwnerStore =
    Boolean(currentOwnerId) &&
    getOwnerId(item) === currentOwnerId;

  


  return isCurrentStore || isOwnerStore;
});



const handleActivateMyStore = async (storeId: string) => {
  try {
    setActivating(true);
    setActivatingStoreId(storeId);
    setActivationError("");
    setShowLimitModal(false);

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const { data } = await axios.post(
      `https://api.thover.in/v2/api/plans/${storeId}/activate-my-store`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data?.success) {
      await fetchMyStores();
      alert(data.message || "Store activated successfully.");
    } else {
      setActivationError(
        data?.message || "Unable to activate store."
      );
    }
  } catch (error: any) {
    const response = error.response?.data;

    if (response?.code === "STORE_LIMIT_REACHED") {
      setShowLimitModal(true);
    } else {
      setActivationError(
        response?.message || "Unable to activate store."
      );
    }
  } finally {
    setActivating(false);
    setActivatingStoreId("");
  }
};


const searchUsers = async (search: string) => {
  if (!search.trim()) {
    await fetchAllUsers();
    return;
  }

  try {
    const response = await api.get(
      `/user/search?username=${encodeURIComponent(search)}`
    );

    if (response?.data?.success) {
      setUsers(response.data.users || []);
    } else {
      setUsers([]);
    }
  } catch (error: any) {
    console.error(
      "SEARCH USERS ERROR:",
      error.response?.data || error.message
    );

    setUsers([]);
  }
};

// ==========================================
// ADD MEMBER TO STORE
// ==========================================

const handleAddMember = async () => {
  if (!selectedUser?._id) {
    alert("Please select a user");
    return;
  }

  if (!store._id) {
    alert("Store ID is missing");
    return;
  }

  try {
    setAddingMember(true);

    console.log("========== ADD MEMBER ==========");
    console.log("STORE ID:", store._id);
    console.log("USER ID:", selectedUser._id);
    console.log("================================");

    const response = await addStoreMember(
      store._id,
      selectedUser._id,
      "manager"
    );

    console.log("ADD MEMBER RESPONSE:", response);

    if (response?.success) {
  const newMember = response.member;

  setMembers((prev) => [
    ...prev,
    {
      userId: {
        _id: newMember.userId,
        username: newMember.username,
        name: newMember.name,
      },
      role: newMember.role,
      isOwner: false,
      status: "active",
    },
  ]);

  alert("Member added successfully");

  setShowMemberDetailsModal(false);
  setSelectedUser(null);
  setSearchUser("");
}
  } catch (error: any) {
    console.error(
      "ADD MEMBER ERROR:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
        "Failed to add member"
    );
  } finally {
    setAddingMember(false);
  }
};

const handleRemoveMember = (
  userId: string,
  username: string
) => {
  setMemberToDelete({
    userId,
    username,
  });

  setShowDeleteMemberModal(true);
};
const confirmDeleteMember = async () => {
  if (!memberToDelete?.userId) {
    return;
  }

  if (!store?._id) {
    alert("Store ID is missing");
    return;
  }

  try {
    setDeletingMember(true);

    console.log("========== REMOVE MEMBER ==========");
    console.log("STORE ID:", store._id);
    console.log("USER ID:", memberToDelete.userId);
    console.log("===================================");

    const response = await removeStoreMember(
      store._id,
      memberToDelete.userId
    );

    console.log("REMOVE MEMBER RESPONSE:", response);

    if (response?.success) {
      setMembers((prev) =>
        prev.filter((member) => {
          const id =
            typeof member.userId === "object"
              ? member.userId?._id
              : member.userId;

          return id !== memberToDelete.userId;
        })
      );

      setShowDeleteMemberModal(false);
      setMemberToDelete(null);

      alert("Member removed successfully");
    }
  } catch (error: any) {
    console.error(
      "REMOVE MEMBER ERROR:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
        "Failed to remove member"
    );
  } finally {
    setDeletingMember(false);
  }
};
  // ==========================================
  // MENU ACTIONS
  // ==========================================

  const handleManageStore = () => {
  setShowMenu(false);
  onManage();
};

  const handlePrivacyPolicy = () => {
    setShowMenu(false);

    router.push("about/business-privacy-policy/");
  };

  const handleTerms = () => {
    setShowMenu(false);

    router.push("about/business-terms-of-use/");
  };

  const handleReturnRefund = () => {
    setShowMenu(false);

    router.push("about/return-refund-policy/");
  };

  const handleHelpSupport = () => {
    setShowMenu(false);
    setShowHelpSupport(true);
  };
  const maskEmail = (email?: string) => {
  if (!email) return "—";

  const [username, domain] = email.split("@");

  if (!username || !domain) return "—";

  if (username.length <= 2) {
    return `${username.charAt(0)}***@${domain}`;
  }

  return `${username.charAt(0)}***${username.charAt(
    username.length - 1
  )}@${domain}`;
};

const maskPhone = (
  number?: string,
  countryCode?: string
) => {
  if (!number) return "—";

  const lastFour = number.slice(-4);

  return `+${countryCode || "91"} ******${lastFour}`;
};

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ==========================================
          PAGE CONTAINER
      ========================================== */}

      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="relative rounded-2xl bg-white shadow-sm">

          <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">

            <div className="flex min-w-0 items-center gap-4">

              {/* STORE ICON */}

              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-violet-50
                "
              >
                <StoreIcon
                  size={28}
                  className="text-violet-600"
                />
              </div>

              {/* STORE INFO */}

              <div className="min-w-0">

                <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
                  {store.storeName}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  {store.category || "Category"}
                </p>

                {store.storeId && (
                  <p className="mt-1 text-xs text-slate-400">
                    Store ID: {store.storeId}
                  </p>
                )}

              </div>

            </div>

  {/* ====================================
    RIGHT ACTIONS
==================================== */}

<div className="flex shrink-0 items-center gap-2">

  {/* THREE DOT */}
  <div className="relative">

    <button
      type="button"
      onClick={() =>
        setShowMenu((prev) => !prev)
      }
      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        text-slate-600
        hover:bg-slate-100
      "
      aria-label="Store menu"
    >
      <MoreVertical size={20} />
    </button>

    {/* DROPDOWN MENU */}
    {showMenu && (
      <div
        className="
          absolute
          right-0
          top-11
          z-50
          w-52
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-white
          p-1
          shadow-xl
        "
      >

        {/* MANAGE STORE */}
        <button
          type="button"
          onClick={handleManageStore}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-lg
            px-3
            py-2.5
            text-left
            text-sm
            font-medium
            text-indigo-600
            hover:bg-indigo-50
          "
        >
          <Settings size={17} />
          <span>Manage Store</span>
        </button>

        {/* HELP */}
        <button
          type="button"
          onClick={handleHelpSupport}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-lg
            px-3
            py-2.5
            text-left
            text-sm
            text-slate-700
            hover:bg-slate-50
          "
        >
          <HelpCircle size={17} />
          <span>Help & Support</span>
        </button>

        {/* PRIVACY */}
        <button
          type="button"
          onClick={handlePrivacyPolicy}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-lg
            px-3
            py-2.5
            text-left
            text-sm
            text-slate-700
            hover:bg-slate-50
          "
        >
          <Shield size={17} />
          <span>Privacy Policy</span>
        </button>

        {/* TERMS */}
        <button
          type="button"
          onClick={handleTerms}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-lg
            px-3
            py-2.5
            text-left
            text-sm
            text-slate-700
            hover:bg-slate-50
          "
        >
          <FileText size={17} />
          <span>Terms of Use</span>
        </button>

        {/* RETURN REFUND */}
        <button
          type="button"
          onClick={handleReturnRefund}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-lg
            px-3
            py-2.5
            text-left
            text-sm
            text-slate-700
            hover:bg-slate-50
          "
        >
          <RotateCcw size={17} />
          <span>Return & Refund</span>
        </button>

      </div>
    )}

  </div>

  {/* SHARE BUTTON */}
<button
  type="button"
  onClick={() => {
    setShowMenu(false);
    setShowShareModal(true);
  }}
  className="
    flex
    h-9
    w-9
    items-center
    justify-center
    rounded-lg
    text-slate-600
    hover:bg-slate-100
  "
  aria-label="Share Store"
>
  <Share2 size={20} />
</button>

  {/* CLOSE BUTTON */}
  <button
    type="button"
    onClick={() => {
      setShowMenu(false);
      router.push("/business-dashboard");
    }}
    className="
      flex
      h-9
      w-9
      items-center
      justify-center
      rounded-lg
      text-slate-500
      hover:bg-slate-100
      hover:text-slate-900
    "
    aria-label="Close"
  >
    <X size={20} />
  </button>

</div>

          </div>

          {/* ========================================
              STORE DETAILS
          ======================================== */}

          <div className="p-5 sm:p-6">

            {/* STATUS */}

<div className="flex items-center justify-between">
  
  {/* LEFT - PUBLIC / SUSPENDED */}
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      store.status === "public"
        ? "bg-green-50 text-green-600"
        : "bg-red-50 text-red-600"
    }`}
  >
    {store.status === "public" ? "Public" : "Suspended"}
  </span>


  {/* RIGHT - ONLINE / OFFLINE */}
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      store.isOnline
        ? "bg-green-50 text-green-600"
        : "bg-red-50 text-red-500"
    }`}
  >
    {store.isOnline ? "Online" : "Offline"}
  </span>

</div>

            {/* DETAILS GRID */}
<div className="mt-6 space-y-4">

{/* MEMBER */}

<div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
<div className="flex items-center justify-between mb-3">
  <h3 className="text-sm font-semibold text-gray-900">
    Member
  </h3>

  <button
    type="button"
    onClick={async () => {
      setSearchUser("");
      setSelectedUser(null);

      await fetchAllUsers();
      setShowAddMemberModal(true);
    }}
    className="flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
  >
    <UserPlus size={15} />
    Add Member
  </button>
</div>


<div className="space-y-2">
  {members
    .filter((member) => member.status === "active")
    .map((member, index) => {
      const user =
        typeof member.userId === "object"
          ? member.userId
          : null;

      return (
  <div
  
key={
  user?._id ||
  (typeof member.userId === "string" ? member.userId : undefined) ||
  `member-${index}`
}

    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 bg-white"
  >
    <div className="flex items-center gap-3 ">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100">
        <User size={18} className="text-violet-600" />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-900">
          {user?.username || "Username"}
        </p>

        <p className="text-xs text-gray-500 capitalize">
          {member.role}
        </p>
      </div>
    </div>

    {member.role !== "owner" && (
      <button
        type="button"
        onClick={() => {
  const userId =
    typeof member.userId === "object"
      ? member.userId?._id
      : member.userId;

  const username =
    typeof member.userId === "object"
      ? member.userId?.username || "this member"
      : "this member";

  if (userId) {
    handleRemoveMember(userId, username);
  }
}}
        className="ml-auto rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
      >
        Remove
      </button>
    )}
  </div>
);
    })}
</div>
</div>

{/* Existing member */}
{/* <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
  <div className="flex items-center gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100">
      <User size={18} className="text-violet-600" />
    </div>

    <div>
      <p className="text-sm font-medium text-gray-900">
        {typeof store.userId === "object"
          ? store.userId.username
          : store.userId}
      </p>

      <p className="text-xs text-gray-500">
        {memberRole}
      </p>
    </div>
  </div>
</div> */}
            {/* CATEGORY */}
<div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
  <div className="flex items-center gap-2">
    <Tag
      size={16}
      className="text-violet-600"
    />

    <p className="text-xs text-slate-400">
      Category
    </p>
  </div>

  <p className="mt-2 text-sm font-semibold text-slate-800">
    {store.category || "—"}
  </p>
</div>



{/* SUBSCRIPTION PLAN */}
{/* <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
  <div className="flex items-center gap-2">
    <CreditCard size={18} className="text-purple-600" />
    <p className="text-sm text-slate-500">
      Subscription Plan
    </p>
  </div>
  

  
<p className="mt-2 font-semibold text-slate-900">
  {hasActivePlan ? "Active Plan" : "No Active Plan"}
</p>

{!hasActivePlan && (
  <div className="mt-3">
    <p className="text-sm text-amber-700">
      You haven't purchased a subscription plan yet.
      Please subscribe to activate your store.
    </p>

    <button
      type="button"
      onClick={() =>
  router.push(
    `/business-dashboard/plans?storeId=${encodeURIComponent(
      store.storeId || ""
    )}`
  )
}
      className="mt-3 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
    >
      Choose Subscription Plan
    </button>
  </div>
)}


  {store.subscription?.expireAt && (
    <p className="mt-1 text-sm text-slate-500">
      Expires on:{" "}
      {new Date(
        store.subscription.expireAt
      ).toLocaleDateString("en-IN")}
    </p>
  )}
  
</div> */}

{/* MY STORES */}
{/* <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
  <div className="flex items-center gap-2">
    <Store size={18} className="text-purple-600" />
    <p className="text-sm text-slate-500">My Stores</p>
  </div>

  {loadingMyStores ? (
    <p className="mt-2 text-sm text-slate-500">
      Loading stores...
    </p>
  ) : (
    <div className="mt-3 space-y-3">
      {visibleStores
        .filter((item) => item.storeId !== store.storeId)
        .map((item) => {
          const expireAt = item.subscription?.expireAt;

          const isActive =
            Boolean(item.subscription?.subscriptionId) &&
            Boolean(expireAt) &&
            new Date(expireAt!).getTime() >= Date.now();

          return (
            <div
              key={item._id || item.storeId}
              className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {item.storeName}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Store ID: {item.storeId}
                </p>

                <p
                  className={`mt-1 text-sm font-medium ${
                    isActive
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  {isActive ? "Active" : "Not Active"}
                </p>
              </div>

              

{isActive ? (
  <button
    type="button"
    disabled
    className="cursor-default rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-700"
  >
    Active Plan
  </button>
) : (
  <button
    type="button"
    onClick={() =>
      item.storeId && handleActivateMyStore(item.storeId)
    }
    disabled={activating}
    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {activatingStoreId === item.storeId
      ? "Activating..."
      : "Activate Plan"}
  </button>
)}


            </div>
          );
        })}

      {visibleStores.filter(
  (item) => item.storeId !== store.storeId
).length === 0 && (
  <p className="text-sm text-slate-500">
    No other stores found.
  </p>
)}
    </div>
  )}

  {activationError && (
    <p className="mt-3 text-sm text-red-600">
      {activationError}
    </p>
  )}

  
{showLimitModal && (
  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
    <p className="font-semibold text-amber-800">
      Store limit reached
    </p>

    <p className="mt-1 text-sm text-amber-700">
      Your current plan allows only 2 stores. To activate
      another store, please manage or upgrade your plan.
    </p>

    <button
      type="button"
      onClick={() => router.push("/business-dashboard/plans")}
      className="mt-3 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
    >
      Manage Plan
    </button>
  </div>
)}

</div> */}


{/* WALLET */}
<div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Wallet
        size={16}
        className="text-violet-600"
      />

      <p className="text-xs text-slate-400">
        Wallet
      </p>
    </div>

    <button
      type="button"
      onClick={() => router.push("/business-dashboard/wallet")}
      className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
    >
      View Wallet
    </button>
  </div>

  <p className="mt-2 text-sm font-semibold text-slate-800">
    Manage your wallet and earnings
  </p>
</div>

{/* ================= DOCUMENT VERIFICATION ================= */}

<div className="rounded-xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">

  {/* HEADER */}
  <div className="flex items-center justify-between gap-3">

    <div className="flex items-center gap-2">
      <FileText
        size={17}
        className="text-violet-600"
      />

      <p className="text-sm font-semibold text-slate-800">
        Document Verification
      </p>
    </div>

    {/* VERIFICATION STATUS */}
    {store.verification?.status === "VERIFIED" && (
      <span
        className="
          rounded-full
          bg-green-50
          px-3
          py-1
          text-xs
          font-semibold
          text-green-600
        "
      >
        Verified
      </span>
    )}

    {store.verification?.status === "PENDING" && (
      <span
        className="
          rounded-full
          bg-yellow-50
          px-3
          py-1
          text-xs
          font-semibold
          text-yellow-600
        "
      >
        Pending
      </span>
    )}

    {store.verification?.status === "REJECTED" && (
      <span
        className="
          rounded-full
          bg-red-50
          px-3
          py-1
          text-xs
          font-semibold
          text-red-600
        "
      >
        Rejected
      </span>
    )}
  </div>


  {/* ================= NO DOCUMENT ================= */}

  {!store.verification && (
    <div className="mt-4 flex items-center justify-between gap-4">

      <div>
        <p className="text-sm font-medium text-slate-700">
          No documents submitted
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Submit your business documents for verification.
        </p>
      </div>

      <button
        type="button"
        onClick={onSubmitDocuments}
        className="
          shrink-0
          rounded-lg
          bg-blue-600
          px-4
          py-2
          text-sm
          font-semibold
          text-white
          hover:bg-blue-700
        "
      >
        Submit
      </button>

    </div>
  )}


  {/* ================= DOCUMENTS EXIST ================= */}

  {store.verification && (
    <div className="mt-4">

      {/* DOCUMENT LIST */}

      <div className="space-y-2">

        {/* GST */}
        {store.verification.legalProof?.legaldocument?.fileName && (
  <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
    <div className="flex min-w-0 items-center gap-2">
      <FileText
        size={16}
        className="shrink-0 text-slate-500"
      />

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-700">
          {store.verification.legalProof.proofType === "GST"
            ? "GST"
            : "Shop Establishment Certificate"}
        </p>

        <p className="truncate text-[11px] text-slate-400">
          {store.verification.legalProof.legaldocument.fileName}
        </p>
      </div>
    </div>
  </div>
)}


        {/* ELECTRICITY */}
        {store.verification.addressProof?.addressdocument?.fileName && (
  <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
    <div className="flex min-w-0 items-center gap-2">
      <FileText
        size={16}
        className="shrink-0 text-slate-500"
      />

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-700">
          {store.verification.addressProof.proofType === "ELECTRICITY"
            ? "Electricity Bill"
            : "Phone Bill"}
        </p>

        <p className="truncate text-[11px] text-slate-400">
          {store.verification.addressProof.addressdocument.fileName}
        </p>
      </div>
    </div>
  </div>
)}

      </div>


      {/* ================= REJECTED ================= */}

      {store.verification.status === "REJECTED" && (
        <button
          type="button"
          onClick={onSubmitDocuments}
          className="
            mt-3
            w-full
            rounded-lg
            bg-blue-600
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            hover:bg-blue-700
          "
        >
          Resubmit Documents
        </button>
      )}

    </div>
  )}

</div>

              {/* GST */}

              {/* GST NUMBER */}
<div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
  <div className="flex items-center gap-2">
    <ReceiptText
      size={16}
      className="text-violet-600"
    />

    <p className="text-xs text-slate-400">
      GST Number
    </p>
  </div>

  <p className="mt-2 text-sm font-semibold text-slate-800">
    {store.gstNumber || "—"}
  </p>
</div>

              {/* ADDRESS */}

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                <div className="flex items-center gap-2">

                  <MapPin
                    size={16}
                    className="text-violet-600"
                  />

                  <p className="text-xs text-slate-400">
                    Address
                  </p>

                </div>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {store.address?.area || "—"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {store.address?.city || "—"}
                </p>

              </div>

              {/* WORKING DAYS */}

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                <div className="flex items-center gap-2">

                  <Clock
                    size={16}
                    className="text-violet-600"
                  />

                  <p className="text-xs text-slate-400">
                    Working Days
                  </p>

                </div>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {store.workingDays?.from || "—"}
                  {" - "}
                  {store.workingDays?.to || "—"}
                </p>

              </div>

              {/* OPENING HOURS */}

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                <div className="flex items-center gap-2">

                  <Clock
                    size={16}
                    className="text-violet-600"
                  />

                  <p className="text-xs text-slate-400">
                    Opening Hours
                  </p>

                </div>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {store.openingHours?.from || "—"}
                  {" - "}
                  {store.openingHours?.to || "—"}
                </p>

              </div>

              {/* CONTACT INFORMATION */}

{/* CONTACT INFORMATION */}

<div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

  <div className="flex items-center gap-2">
    <Mail
      size={16}
      className="text-violet-600"
    />

    <p className="text-xs text-slate-400">
      Business Email
    </p>
  </div>

  <p className="mt-2 text-sm font-semibold text-slate-800">
  {maskEmail(
    store.contacts?.mailContactId?.email ||
    store.userId?.email
  )}
</p>

</div>

<div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

  <div className="flex items-center gap-2">
    <Phone
      size={16}
      className="text-violet-600"
    />

    <p className="text-xs text-slate-400">
      Business Phone
    </p>
  </div>

  <p className="mt-2 text-sm font-semibold text-slate-800">
    {maskPhone(
      store.contacts?.phoneContactId?.number,
      store.contacts?.phoneContactId?.countryCode
    )}
  </p>

</div>

            </div>

          </div>

        </div>

      </div>

      {showShareModal && (
  <div
    className="
      fixed
      inset-0
      z-[1000]
      flex
      items-center
      justify-center
      bg-black/40
      p-4
    "
    onClick={() => setShowShareModal(false)}
  >
    <div
      className="
        w-full
        max-w-md
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
            Share Store
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Scan the QR code or copy the link
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowShareModal(false)}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            text-slate-500
            hover:bg-slate-100
          "
        >
          <X size={20} />
        </button>
      </div>

      {/* QR CODE */}
      <div className="mt-6 flex justify-center">
        {storeLink && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <QRCodeSVG
              value={storeLink}
              size={220}
              level="H"
              includeMargin
            />
          </div>
        )}
      </div>

      {/* STORE NAME */}
      <p className="mt-4 text-center text-sm font-semibold text-slate-900">
        {store.storeName}
      </p>

      {/* LINK */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="break-all text-xs leading-5 text-slate-600">
          {storeLink}
        </p>
      </div>

      {/* COPY BUTTON */}
      <button
        type="button"
        onClick={handleCopyStoreLink}
        className="
          mt-4
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-violet-600
          px-4
          py-3
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-violet-700
        "
      >
        <Share2 size={17} />

        {copied ? "Link Copied!" : "Copy Link"}
      </button>

    </div>
  </div>
)}

      {/* ==========================================
          HELP & SUPPORT
      ========================================== */}

      {showHelpSupport && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            bg-black/40
            p-4
          "
          onClick={() =>
            setShowHelpSupport(false)
          }
        >

          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              bg-white
              p-6
              shadow-xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <HelpCircle
                  size={22}
                  className="text-blue-600"
                />
              </div>

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Help & Support
                </h2>

                <p className="text-xs text-slate-500">
                  Need help with your store?
                </p>

              </div>

            </div>

            <div className="mt-5 space-y-3">

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">

                <Mail
                  size={18}
                  className="text-slate-500"
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Email Support
                  </p>

                  <p className="text-sm font-medium text-slate-800">
                    support@thover.in
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">

                <Phone
                  size={18}
                  className="text-slate-500"
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Phone Support
                  </p>

                  <p className="text-sm font-medium text-slate-800">
                    Contact support
                  </p>
                </div>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                setShowHelpSupport(false)
              }
              className="
                mt-5
                w-full
                rounded-xl
                bg-slate-900
                px-4
                py-3
                text-sm
                font-semibold
                text-white
                hover:bg-slate-800
              "
            >
              Close
            </button>

          </div>

        </div>
      )}

      {showDeleteMemberModal && (
  <div
    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4"
    onClick={() => {
      if (!deletingMember) {
        setShowDeleteMemberModal(false);
        setMemberToDelete(null);
      }
    }}
  >
    <div
      className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* ICON */}
      <div className="flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <X size={24} className="text-red-600" />
        </div>
      </div>

      {/* TITLE */}
      <h2 className="mt-4 text-center text-lg font-bold text-slate-900">
        Remove Member?
      </h2>

      {/* MESSAGE */}
      <p className="mt-2 text-center text-sm text-slate-500">
        Are you sure you want to remove{" "}
        <span className="font-semibold text-slate-700">
          {memberToDelete?.username}
        </span>{" "}
        from this store?
      </p>

      {/* BUTTONS */}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          disabled={deletingMember}
          onClick={() => {
            setShowDeleteMemberModal(false);
            setMemberToDelete(null);
          }}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={deletingMember}
          onClick={confirmDeleteMember}
          className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deletingMember ? "Removing..." : "Remove"}
        </button>
      </div>
    </div>
  </div>
)}

<AddMemberModals
  showAddMemberModal={showAddMemberModal}
  setShowAddMemberModal={setShowAddMemberModal}
  users={users}
  searchUser={searchUser}
  setSearchUser={setSearchUser}
  selectedUser={selectedUser}
  setSelectedUser={setSelectedUser}
  showMemberDetailsModal={showMemberDetailsModal}
  setShowMemberDetailsModal={setShowMemberDetailsModal}
  onAddMember={handleAddMember}
  addingMember={addingMember}
    onSearchUsers={searchUsers}
/>


    </main>
  );
}