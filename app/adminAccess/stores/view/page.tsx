"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../services/businessApi";

interface Store {
  _id: string;
  storeId: string;
  storeName: string;
  category?: string;
  status?: string;
  isVerified?: boolean;
  isOnline?: boolean;
  userId?: any;
  address?: any;
  contacts?: any;
}

interface Verification {
  [key: string]: any;
}

export default function ViewStorePage() {
  const router = useRouter();

  const [store, setStore] =
    useState<Store | null>(null);

  const [verification, setVerification] =
    useState<Verification | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);

        const storeId =
  sessionStorage.getItem(
    "selectedStoreId"
  );

if (!storeId) {
  setError("Store ID not found");
  return;
}

console.log(
  "Fetching store for storeId:",
  storeId
);

const { data } = await api.get(
  `https://api.thover.in/v1/api/store/my-store`
);

        console.log(
          "Store response:",
          data
        );

        setStore(data.store);
        setVerification(
          data.verification
        );
      } catch (err: any) {
        console.log(
          "Store fetch error:",
          err.response?.data || err
        );

        setError(
          err.response?.data?.message ||
            "Unable to fetch store"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Loading store...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">
            {error}
          </p>

          <button
            onClick={() =>
              router.push(
                "/adminAccess/stores"
              )
            }
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Back to Stores
          </button>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Store not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      {/* HEADER */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {store.storeName}
          </h1>

          <p className="mt-1 text-gray-500">
            Store ID: {store.storeId}
          </p>
        </div>

        <button
          onClick={() =>
            router.push(
              "/adminAccess/stores"
            )
          }
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Back
        </button>
      </div>

      {/* STORE DETAILS */}

      <div className="grid gap-6 md:grid-cols-2">

        {/* BASIC DETAILS */}

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Store Details
          </h2>

          <div className="space-y-3">

            <Detail
              label="Store Name"
              value={store.storeName}
            />

            <Detail
              label="Store ID"
              value={store.storeId}
            />

            <Detail
              label="Category"
              value={
                store.category || "-"
              }
            />

            <Detail
              label="Status"
              value={
                store.status || "-"
              }
            />

            <Detail
              label="Verified"
              value={
                store.isVerified
                  ? "Yes"
                  : "No"
              }
            />

            <Detail
              label="Online"
              value={
                store.isOnline
                  ? "Yes"
                  : "No"
              }
            />


            <div className="mt-6 grid gap-3 border-t pt-4 md:grid-cols-2">

  {/* VIEW ALL POSTS */}
  <button
    type="button"
    onClick={() => {
      const storeId =
        sessionStorage.getItem("selectedStoreId");

      if (!storeId) {
        alert("Store ID not found");
        return;
      }

      router.push("/adminAccess/stores/posts");
    }}
    className="
      w-full
      rounded-xl
      bg-blue-600
      px-4
      py-3
      text-sm
      font-semibold
      text-white
      transition
      hover:bg-blue-700
    "
  >
    View All Posts
  </button>

  {/* VIEW ALL ORDERS */}
  <button
    type="button"
    onClick={() => {
      const storeId =
        sessionStorage.getItem("selectedStoreId");

      if (!storeId) {
        alert("Store ID not found");
        return;
      }

      router.push("/adminAccess/stores/orders");
    }}
    className="
      w-full
      rounded-xl
      bg-purple-600
      px-4
      py-3
      text-sm
      font-semibold
      text-white
      transition
      hover:bg-purple-700
    "
  >
    View All Orders
  </button>

</div>

          </div>
        </div>

        {/* OWNER DETAILS */}

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Owner Details
          </h2>

          <div className="space-y-3">

            <Detail
              label="Name"
              value={
                store.userId?.name ||
                "-"
              }
            />

            <Detail
              label="Username"
              value={
                store.userId?.username ||
                "-"
              }
            />

            <Detail
              label="Email"
              value={
                store.userId?.email ||
                "-"
              }
            />

            <Detail
              label="Phone"
              value={
                store.userId?.phoneNumber ||
                "-"
              }
            />

          </div>
        </div>

        {/* ADDRESS */}

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Address
          </h2>

          <div className="space-y-3">

            <Detail
              label="Area"
              value={
                store.address
                  ?.addressId?.area ||
                store.address?.area ||
                "-"
              }
            />

            <Detail
              label="City"
              value={
                store.address
                  ?.addressId?.city ||
                store.address?.city ||
                "-"
              }
            />

            <Detail
              label="State"
              value={
                store.address
                  ?.addressId?.state ||
                store.address?.state ||
                "-"
              }
            />

            <Detail
  label="Pincode"
  value={
    store.address?.addressId?.pinCode ||
    store.address?.pinCode ||
    "-"
  }
/>

          </div>
        </div>

        {/* VERIFICATION */}

        {/* VERIFICATION */}

<div className="rounded-xl bg-white p-6 shadow-sm">
  <h2 className="mb-4 text-xl font-semibold">
    Business Verification
  </h2>

  {verification ? (
    <div className="space-y-3">

      <Detail
        label="Status"
        value={
          verification.status || "-"
        }
      />

      <Detail
        label="Legal Proof"
        value={
          verification.legalProof?.proofType ||
          "-"
        }
      />

      <Detail
        label="Address Proof"
        value={
          verification.addressProof?.proofType ||
          "-"
        }
      />

      {verification.addressProof?.customType && (
        <Detail
          label="Custom Proof Type"
          value={
            verification.addressProof.customType
          }
        />
      )}

      <Detail
        label="Submitted At"
        value={
          verification.submittedAt
            ? new Date(
                verification.submittedAt
              ).toLocaleDateString()
            : "-"
        }
      />

      {verification.reviewedAt && (
        <Detail
          label="Reviewed At"
          value={
            new Date(
              verification.reviewedAt
            ).toLocaleDateString()
          }
        />
      )}

      {verification.rejectionReason && (
        <Detail
          label="Rejection Reason"
          value={
            verification.rejectionReason
          }
        />
      )}

      {/* Legal Document */}
      {verification.legalProof?.legaldocument
        ?.fileUrl && (
        <div className="border-t pt-4">
          <p className="mb-2 text-sm text-gray-500">
            Legal Document
          </p>

          <a
            href={
              verification.legalProof
                .legaldocument.fileUrl
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View Legal Document
          </a>
        </div>
      )}

      {/* Address Document */}
      {verification.addressProof?.addressdocument
        ?.fileUrl && (
        <div className="border-t pt-4">
          <p className="mb-2 text-sm text-gray-500">
            Address Document
          </p>

          <a
            href={
              verification.addressProof
                .addressdocument.fileUrl
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View Address Document
          </a>
        </div>
      )}

    </div>
  ) : (
    <p className="text-gray-500">
      Verification details not available.
    </p>
  )}
</div>



      </div>

      
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4 border-b pb-2">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-gray-900">
        {value}
      </span>
      
    </div>
  );
}