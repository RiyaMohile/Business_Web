"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Shield,
  Wallet,
  Store,
  Bike,
  FileText,
} from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import api from "../../../services/businessApi";

interface UserType {
  _id: string;
  userId: string;
  name: string;
  username: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  isAdmin: boolean;
  isVerified: boolean;
  referralCode?: string;
  createdAt: string;
}

function UserDetailsContent() {
  const searchParams = useSearchParams();
const router = useRouter();

const id = searchParams.get("id");

  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const [walletExists, setWalletExists] = useState(false);
  const [storeExists, setStoreExists] = useState(false);
  const [riderExists, setRiderExists] = useState(false);
  const [postCount, setPostCount] = useState(0);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/user/details/${id}`
      );

      setUser(data.user);
      setWalletExists(data.walletExists);
      setStoreExists(data.storeExists);
      setRiderExists(data.riderExists);
      setPostCount(data.postCount);

    } catch (err) {
      console.log(err);
      alert("Unable to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="ml-0 flex flex-1 items-center justify-center px-4 pt-16 md:ml-72 md:px-0 md:pt-0">
          Loading...
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="flex-1 flex justify-center items-center">
          User not found.
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <main className="ml-0 md:ml-72 flex-1 h-screen overflow-y-auto px-4 pb-8 pt-20 md:p-8">

        <h1 className="text-3xl font-bold md:text-4xl">
          User Details
        </h1>

        <p className="text-gray-500 mt-2">
          Complete information about the selected user.
        </p>

        {/* Profile */}

        <div className="mt-8 rounded-2xl bg-white p-4 shadow md:p-8">

          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left md:gap-6">

           <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 md:h-24 md:w-24">

              <User
                size={36}
  className="text-blue-600 md:size-[42px]"
              />

            </div>

            <div>

              <h2 className="text-2xl font-semibold md:text-3xl">
                {user.name}
              </h2>

              <p className="text-gray-500">
                @{user.username}
              </p>

            </div>

          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">

            <div className="flex items-center gap-3">
              <Mail size={18} />
              {user.email || "-"}
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18} />
              {user.phoneNumber || "-"}
            </div>

            <div className="flex items-center gap-3">
              <Shield size={18} />
              {user.isAdmin ? "Admin" : "User"}
            </div>

            <div>
              <span className="font-medium">
                Verified :
              </span>{" "}
              {user.isVerified ? "Yes" : "No"}
            </div>

            <div>
              <span className="font-medium">
                Referral :
              </span>{" "}
              {user.referralCode || "-"}
            </div>

            <div>
              <span className="font-medium">
                Joined :
              </span>{" "}
              {new Date(
                user.createdAt
              ).toLocaleDateString()}
            </div>

          </div>

        </div>

        {/* Cards */}

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">

          <button
            onClick={() =>
              router.push(`/admins/users/view/wallet?id=${id}`)
            }
            className="rounded-2xl bg-white p-5 shadow transition hover:shadow-lg md:p-6"
          >
            <Wallet className="text-blue-600 mb-4" />

            <h3 className="font-semibold">
              Wallet
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              {walletExists
                ? "Available"
                : "Not Available"}
            </p>

          </button>

          <button
            onClick={() =>
             router.push(`/admins/users/view/store?id=${id}`)
            }
            className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
          >
            <Store className="text-green-600 mb-4" />

            <h3 className="font-semibold">
              Store
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              {storeExists
                ? "Available"
                : "Not Available"}
            </p>

          </button>

          <button
            onClick={() =>
              router.push(`/admins/users/view/rider?id=${id}`)
            }
            className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
          >
            <Bike className="text-orange-600 mb-4" />

            <h3 className="font-semibold">
              Rider
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              {riderExists
                ? "Available"
                : "Not Available"}
            </p>

          </button>

          <button
            onClick={() =>
             router.push(`/admins/users/view/rider?id=${id}`)
            }
            className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
          >
            <FileText className="text-purple-600 mb-4" />

            <h3 className="font-semibold">
              Posts
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              {postCount} Posts
            </p>

          </button>

        </div>

      </main>

    </div>
  );
}

export default function UserDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserDetailsContent />
    </Suspense>
  );
}