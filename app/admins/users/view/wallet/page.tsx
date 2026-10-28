"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../../../../components/Sidebar";
import api from "../../../../services/businessApi";

import {
  Wallet,
  Coins,
  User,
  Mail,
  BadgeCheck,
  Hash,
} from "lucide-react";

interface WalletType {
  _id: string;
  walletId: string;
  walletName: string;
  totalCoin: number;
  professionalWallet: boolean;

  userId: {
    _id: string;
    name: string;
    username: string;
    // email: string;
  };
}

function WalletContent() {
  const searchParams = useSearchParams();
const id = searchParams.get("id");

  const [wallet, setWallet] =
    useState<WalletType | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchWallet = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/wallet/user/${id}`
      );

      setWallet(data.wallet);

    } catch (err) {
      console.log(err);
      alert("Unable to fetch wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchWallet();
    }
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <main className="ml-0 md:ml-72 flex-1 h-screen overflow-y-auto px-4 pb-8 pt-20 md:p-8">

        <h1 className="text-3xl font-bold md:text-4xl">
          Wallet Details
        </h1>

        <p className="mt-2 text-gray-500">
          Wallet information for the selected user.
        </p>

        {loading ? (

          <div className="mt-10">
            Loading...
          </div>

        ) : !wallet ? (

          <div className="bg-white rounded-2xl shadow mt-8 p-10 text-center">

            Wallet not found.

          </div>

        ) : (

          <div className="mt-8 rounded-2xl bg-white p-4 shadow md:p-8">

           <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">

              {/* Wallet */}

              <div>

                <h2 className="mb-6 text-xl font-semibold md:text-2xl">

                  Wallet Information

                </h2>

                <div className="space-y-5">

                  <div className="flex items-center gap-3">

                    <Wallet
                      className="text-blue-600"
                      size={20}
                    />

                    <span>

                      {wallet.walletName}

                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <Hash size={20} />

                    <span>

                      {wallet.walletId}

                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <Coins
                      className="text-yellow-500"
                      size={20}
                    />

                    <span>

                      {wallet.totalCoin} Coins

                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <BadgeCheck
                      className={
                        wallet.professionalWallet
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                      size={20}
                    />

                    <span>

                      {wallet.professionalWallet
                        ? "Professional Wallet"
                        : "Normal Wallet"}

                    </span>

                  </div>

                </div>

              </div>

              {/* User */}

              <div>

                <h2 className="mb-6 text-xl font-semibold md:text-2xl">

                  User Information

                </h2>

                <div className="space-y-5">

                  <div className="flex items-center gap-3">

                    <User size={20} />

                    <span>

                      {wallet.userId.name}

                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <User size={20} />

                    <span>

                      @{wallet.userId.username}

                    </span>

                  </div>

                  {/* <div className="flex items-center gap-3">

                    <Mail size={20} />

                    <span>

                      {wallet.userId.email}

                    </span>

                  </div> */}

                </div>

              </div>

            </div>

        {/* Summary Cards */}

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">

             <div className="rounded-xl bg-blue-50 p-5 md:p-6">

                <p className="text-gray-500">

                  Wallet Balance

                </p>

                <h2 className="text-3xl font-bold mt-2">

                  {wallet.totalCoin}

                </h2>

              </div>

              <div className="rounded-xl bg-green-50 p-5 md:p-6">

                <p className="text-gray-500">

                  Wallet Type

                </p>

                <h2 className="mt-2 text-2xl font-bold md:text-3xl">

                  {wallet.professionalWallet
                    ? "Professional"
                    : "Standard"}

                </h2>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WalletContent />
    </Suspense>
  );
}