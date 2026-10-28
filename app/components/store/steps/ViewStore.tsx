"use client";

import { useState } from "react";
import {
  X,
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
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import HelpSupport from "../../HelpSupport";

interface Store {
  _id: string;
  storeId: string;
  storeName: string;
  category: string;
  gstNumber?: string;

  status: "public" | "suspended";
  isVerified: boolean;
  isOnline: boolean;

  address?: {
    area?: string;
    city?: string;
    state?: string;
    pinCode?: string;
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

  workingDays?: {
    from: string;
    to: string;
  };

  openingHours?: {
    from: string;
    to: string;
  };
}

interface ViewStoreProps {
  store: Store;
  onClose: () => void;
  onManage: () => void;
  onSubmitDocuments: () => void;
}

export default function ViewStore({
  store,
  onClose,
  onManage,
  onSubmitDocuments,
}: ViewStoreProps) {
  const router = useRouter();

  const [showMenu, setShowMenu] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const maskEmail = (email?: string) => {
  if (!email) return "—";

  const [username, domain] = email.split("@");

  if (!username || !domain) return "—";

  if (username.length === 1) {
    return `${username}***@${domain}`;
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
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto min-h-screen w-full max-w-4xl bg-white">

        {/* ================= HEADER ================= */}

<div className="relative flex shrink-0 items-start justify-between border-b p-4">

  {/* TITLE */}

  <div>
    <h2 className="text-xl font-bold text-slate-900">
      My Store
    </h2>

    <p className="mt-1 text-xs text-slate-500">
      View your store details
    </p>
  </div>


  {/* RIGHT SIDE */}

  <div className="flex items-center gap-1">

    {/* THREE DOT MENU */}

    <button
      type="button"
      onClick={() => setShowMenu((prev) => !prev)}
      className="
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-full
        text-slate-700
        hover:bg-slate-100
      "
    >
      <MoreVertical size={20} />
    </button>

     <button
    type="button"
    onClick={onClose}
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
  >
    <X size={20} />
  </button>


    {/* DROPDOWN MENU */}

    {showMenu && (
      <div
        className="
          absolute
          right-4
          top-14
          z-[200]
          w-52
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-white
          shadow-lg
        "
      >

        {/* HELP & SUPPORT */}

        <button
          type="button"
          onClick={() => {
            setShowMenu(false);
            setShowHelpSupport(true);
          }}
          className="
            flex
            w-full
            items-center
            gap-3
            px-4
            py-3
            text-left
            text-sm
            text-slate-700
            hover:bg-slate-50
          "
        >
          <Headphones
            size={17}
            className="text-slate-500"
          />

          <span>
            Help & Support
          </span>
        </button>


        {/* PRIVACY POLICY */}

        <button
          type="button"
          onClick={() => {
            setShowMenu(false);
            router.push(
              "/business-dashboard/about/business-privacy-policy"
            );
          }}
          className="
            flex
            w-full
            items-center
            gap-3
            px-4
            py-3
            text-left
            text-sm
            text-slate-700
            hover:bg-slate-50
          "
        >
          <ShieldCheck
            size={17}
            className="text-slate-500"
          />

          <span>
            Privacy Policy
          </span>
        </button>


        {/* TERMS OF USE */}

        <button
          type="button"
          onClick={() => {
            setShowMenu(false);
            router.push(
              "/business-dashboard/about/business-terms-of-use"
            );
          }}
          className="
            flex
            w-full
            items-center
            gap-3
            px-4
            py-3
            text-left
            text-sm
            text-slate-700
            hover:bg-slate-50
          "
        >
          <FileText
            size={17}
            className="text-slate-500"
          />

          <span>
            Terms of Use
          </span>
        </button>


        {/* RETURN & REFUND POLICY */}

        <button
          type="button"
          onClick={() => {
            setShowMenu(false);
            router.push(
              "/business-dashboard/about/return-refund-policy"
            );
          }}
          className="
            flex
            w-full
            items-center
            gap-3
            px-4
            py-3
            text-left
            text-sm
            text-slate-700
            hover:bg-slate-50
          "
        >
          <RotateCcw
            size={17}
            className="text-slate-500"
          />

          <span>
            Return & Refund Policy
          </span>
        </button>


        {/* DIVIDER */}

        <div className="border-t border-slate-100" />


        {/* MANAGE STORE */}

        <button
  type="button"
  onClick={() => {
    setShowMenu(false);
    router.push("/business-dashboard/store/manage");
  }}
  className="
    flex
    w-full
    items-center
    gap-3
    px-4
    py-3
    text-left
    text-sm
    font-medium
    text-indigo-600
    hover:bg-indigo-50
  "
>
  <Settings
    size={17}
    className="text-indigo-600"
  />

  <span>
    Manage Store
  </span>
</button>

      </div>
    )}

  </div>

</div>

        {/* ================= CONTENT ================= */}

        <div className="flex-1 space-y-5 overflow-y-auto p-6 pb-8">

          {/* ================= STORE INFORMATION ================= */}

          <div className="rounded-xl border p-5">

            <h3 className="mb-4 text-lg font-semibold">
              Store Information
            </h3>

            <div className="space-y-4">

              <div>
                <p className="text-sm text-gray-500">
                  Store Name
                </p>

                <p className="font-medium text-slate-900">
                  {store.storeName || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Store ID
                </p>

                <p className="font-medium text-slate-900">
                  {store.storeId || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Category
                </p>

                <p className="font-medium text-slate-900">
                  {store.category || "—"}
                </p>
              </div>

              {store.gstNumber && (
                <div>
                  <p className="text-sm text-gray-500">
                    GST Number
                  </p>

                  <p className="font-medium text-slate-900">
                    {store.gstNumber}
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* ================= CONTACT INFORMATION ================= */}

          <div className="rounded-xl border p-5">

            <h3 className="mb-4 text-lg font-semibold">
              Contact Information
            </h3>

            <div className="space-y-4">

              {/* EMAIL */}

              <div>
                <p className="text-sm text-gray-500">
                  Business Email
                </p>

                <p className="font-medium text-slate-900">
  {maskEmail(store.contacts?.mailContactId?.email)}
</p>
              </div>

              {/* PHONE */}

              <div>
                <p className="text-sm text-gray-500">
                  Business Phone
                </p>

                <p className="font-medium text-slate-900">
  {maskPhone(
    store.contacts?.phoneContactId?.number,
    store.contacts?.phoneContactId?.countryCode
  )}
</p>
              </div>

            </div>

          </div>

          {/* ================= STATUS ================= */}

          <div className="rounded-xl border p-5">

            <h3 className="mb-4 text-lg font-semibold">
              Store Status
            </h3>

            <div className="flex flex-wrap gap-3">

              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                Status: {store.status}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  store.isOnline
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {store.isOnline ? "Online" : "Offline"}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  store.isVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {store.isVerified
                  ? "Verified"
                  : "Not Verified"}
              </span>

            </div>

          </div>

          {/* ================= ADDRESS ================= */}

          {store.address && (
            <div className="rounded-xl border p-5">

              <h3 className="mb-4 text-lg font-semibold">
                Address
              </h3>

              <div className="space-y-1">

                <p className="text-gray-700">
                  {store.address.area || "—"}
                </p>

                <p className="text-gray-500">
                  {store.address.city || "—"}
                </p>

                {store.address.state && (
                  <p className="text-gray-500">
                    {store.address.state}
                  </p>
                )}

                {store.address.pinCode && (
                  <p className="text-gray-500">
                    {store.address.pinCode}
                  </p>
                )}

              </div>

            </div>
          )}

          {/* ================= WORKING DAYS ================= */}

          {store.workingDays && (
            <div className="rounded-xl border p-5">

              <h3 className="mb-4 text-lg font-semibold">
                Working Days
              </h3>

              <p>
                {store.workingDays.from} -{" "}
                {store.workingDays.to}
              </p>

            </div>
          )}

          {/* ================= OPENING HOURS ================= */}

          {store.openingHours && (
            <div className="rounded-xl border p-5">

              <h3 className="mb-4 text-lg font-semibold">
                Opening Hours
              </h3>

              <p>
                {store.openingHours.from} -{" "}
                {store.openingHours.to}
              </p>

            </div>
          )}

        </div>

      </div>
      <HelpSupport
        open={showHelpSupport}
        onClose={() => setShowHelpSupport(false)}
      />

    </div>
  );
}