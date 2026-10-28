"use client";

import { useEffect, useState } from "react";
import {
  Landmark,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

import CreateWallet from "@/app/components/stores/wallet/CreateWallet";
import CreateBankAccount from "@/app/components/stores/wallet/bank/CreateBankAccount";
import WalletCreated from "@/app/components/stores/wallet/WalletCreated";
import WalletDashboard from "@/app/components/stores/wallet/WalletDashboard";
import Navbar from "@/app/components/BusinessNavbar";
import DashboardSidebar from "@/app/components/DashboardSidebar";

import { getWallet } from "../../services/walletApi";
import {
  getMyStores,
  updateStoreOnlineStatus,
} from "../../services/businessStoreApi";
import WalletDashboardDesktop from "@/app/components/stores/wallet/WalletDashboardDesktop";

export default function WalletPage() {
  const [showCreateWallet, setShowCreateWallet] = useState(false);
  const [showWalletDashboard, setShowWalletDashboard] = useState(false);
  const [walletStep, setWalletStep] = useState(1);
  const [checkingWallet, setCheckingWallet] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const checkWallet = async () => {
      try {
        const response = await getWallet();

        console.log("MY WALLET:", response);

        if (response?.success && response?.wallet) {
          setShowWalletDashboard(true);
        }
      } catch (error: any) {
        console.log(
          "No wallet found:",
          error.response?.data || error.message
        );

        setShowWalletDashboard(false);
      } finally {
        setCheckingWallet(false);
      }
    };

    checkWallet();
  }, []);

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
      "FETCH STORE STATUS ERROR:",
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

    const response = await updateStoreOnlineStatus(
      selectedStoreId,
      nextStatus
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
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
        "Unable to update store status"
    );
  } finally {
    setUpdatingStatus(false);
  }
};

  if (checkingWallet) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-slate-500">
          Loading wallet...
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-50">

      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <Navbar
  onAccountModalChange={() => {}}
  isOnline={isOnline}
  onOnlineStatusChange={handleOnlineStatusChange}
  updatingStatus={updatingStatus}
/>

      {/* =====================================================
          MAIN
          ===================================================== */}

      <main
  className="
    min-h-[100dvh]
    bg-slate-50

    px-3
    pb-24
    pt-20

    md:min-h-[calc(100dvh-80px)]
    md:w-full
    md:px-8
    md:pb-10
    md:pt-24
  "
>

        {/* =====================================================
            EXISTING WALLET DASHBOARD
            ===================================================== */}

        {showWalletDashboard ? (
  <>
    <div className="md:hidden">
      <WalletDashboard
        onClose={() => {
          setShowWalletDashboard(false);
        }}
      />
    </div>

    <div className="hidden md:block">
      <WalletDashboardDesktop />
    </div>
  </>
        ) : (

          /* =====================================================
             MOBILE CREATE WALLET DESIGN
             DON'T CHANGE THIS
             ===================================================== */

          <div className="mx-auto flex min-h-[calc(100vh-32px)] w-full max-w-md flex-col">

            {/* HEADER */}

            <div className="flex items-center justify-center py-3">
              <h1 className="text-lg font-semibold text-slate-900">
                Wallet
              </h1>
            </div>

            {/* IMAGE */}

            <div className="mt-7 flex justify-center">
              <img
                src="/images/wallet.png"
                alt="Wallet"
                className="h-44 w-44 object-contain"
              />
            </div>

            {/* TITLE */}

            <div className="text-center">

              <h2 className="text-2xl font-bold text-slate-900">
                Activate Your Wallet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Create your wallet to receive
                <br />
                payments and manage your earnings.
              </p>

            </div>

            {/* FEATURES */}

            <div className="mt-7 rounded-2xl bg-indigo-50/80 p-4">

              <div className="flex items-center gap-4 py-2">
                <div className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-full bg-white shadow-sm
                ">
                  <ShieldCheck
                    size={21}
                    className="text-indigo-600"
                  />
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  Get secure wallet for coins
                </p>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-full bg-white shadow-sm
                ">
                  <Landmark
                    size={21}
                    className="text-indigo-600"
                  />
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  Withdraw coins to your bank
                </p>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-full bg-white shadow-sm
                ">
                  <ReceiptText
                    size={21}
                    className="text-indigo-600"
                  />
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  Track every transaction
                </p>
              </div>

            </div>

            {/* CREATE BUTTON */}

            <div className="mt-auto pt-8">

              <button
                type="button"
                onClick={() => {
                  setWalletStep(1);
                  setShowCreateWallet(true);
                }}
                className="
                  w-full
                  rounded-xl
                  bg-indigo-600
                  px-5
                  py-3.5
                  text-base
                  font-medium
                  text-white
                "
              >
                Create Wallet
              </button>

            </div>

          </div>
        )}

        {/* =====================================================
            WALLET MODALS
            ===================================================== */}

        {showCreateWallet && (
          <>

            {walletStep === 1 && (
              <CreateWallet
                onClose={() => {
                  setShowCreateWallet(false);
                  setWalletStep(1);
                }}
                onContinue={() => {
                  setWalletStep(2);
                }}
              />
            )}

            {walletStep === 2 && (
              <CreateBankAccount
                onClose={() => {
                  setShowCreateWallet(false);
                  setWalletStep(1);
                }}
                onSuccess={() => {
                  setWalletStep(3);
                }}
              />
            )}

            {walletStep === 3 && (
              <WalletCreated
                onClose={() => {
                  setShowCreateWallet(false);
                  setWalletStep(1);
                }}
                onViewWallet={() => {
                  setShowCreateWallet(false);
                  setShowWalletDashboard(true);
                  setWalletStep(1);
                }}
              />
            )}

          </>
        )}

      </main>
    </div>
  );
}