"use client";

import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

import ViewStore from "./ViewStore";
import EditStoreForm from "@/app/components/store/steps/EditStoreForm";
import SubmitVerificationModal from "@/app/components/store/steps/SubmitVerificationModal";
import {
  getMyStore,
  updateStoreAddress,
} from "@/app/services/businessStoreApi";

export default function StorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-sm text-slate-500">
            Loading store...
          </p>
        </div>
      }
    >
      <StorePageContent />
    </Suspense>
  );
}


function StorePageContent() {
    const searchParams = useSearchParams();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ==============================
  // UI STATES
  // ==============================

  const [showViewStore, setShowViewStore] = useState(true);

  const [showManageStore, setShowManageStore] =
    useState(false);

  const [showVerification, setShowVerification] =
    useState(false);

  // ==============================
  // FETCH STORE
  // ==============================

  const fetchStore = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setStore(null);
      return;
    }

    const selectedStoreId =
      searchParams.get("storeId") ||
      localStorage.getItem("selectedStoreId");

    console.log(
      "STORE PAGE - SELECTED STORE ID:",
      selectedStoreId
    );

    if (!selectedStoreId) {
      setStore(null);
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

    console.log(
      "STORE PAGE - ALL STORES:",
      data
    );

    if (!data?.success || !Array.isArray(data.stores)) {
      setStore(null);
      return;
    }

    // Find EXACT selected store
    const selectedStore = data.stores.find(
      (item: any) =>
        item._id === selectedStoreId
    );

    if (!selectedStore) {
      console.error(
        "SELECTED STORE NOT FOUND:",
        selectedStoreId
      );

      setStore(null);
      return;
    }

    console.log(
      "STORE PAGE - SELECTED STORE:",
      selectedStore
    );

    setStore(selectedStore);
  } catch (error: any) {
    console.error(
      "FETCH STORE ERROR:",
      error.response?.data ||
        error.message
    );

    setStore(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  fetchStore();
}, [searchParams]);


  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading store...
        </p>
      </div>
    );
  }

  // ==============================
  // NO STORE
  // ==============================

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Store not found.
        </p>
      </div>
    );
  }

  // ==============================
  // PAGE
  // ==============================

  return (
    <>
      {/* =================================
          VIEW STORE
      ================================= */}

      {showViewStore && (
        <ViewStore
  store={store}
  onClose={() => {
    setShowViewStore(false);
  }}
  onManage={() => {
    setShowViewStore(false);
    setShowManageStore(true);
  }}
  onSubmitDocuments={() => {
    setShowVerification(true);
  }}
  onAddressUpdated={fetchStore}
/>
      )}

      {/* =================================
          MANAGE STORE
      ================================= */}

      {showManageStore && (
        <EditStoreForm
          store={store}

          onClose={() => {
            setShowManageStore(false);
            setShowViewStore(true);
          }}

          onUpdated={async () => {
            await fetchStore();

            setShowManageStore(false);
            setShowViewStore(true);
          }}
        />
      )}

      {/* =================================
          SUBMIT DOCUMENTS
      ================================= */}

      {showVerification && (
        <SubmitVerificationModal
          storeId={store._id}

          onClose={() => {
            setShowVerification(false);
          }}

          onSubmitted={async () => {
  setShowVerification(false);

  // Fresh store + verification data fetch karo
  await fetchStore();

  // ViewStore already open rahega
}}
        />
      )}
    </>
  );
}