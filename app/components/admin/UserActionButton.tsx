"use client";

import { useState } from "react";
import {
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import api from "../../services/businessApi";

interface Store {
  _id: string;
  storeId: string;
  storeName: string;
  category?: string;
  status?: string;
  isVerified?: boolean;
  isOnline?: boolean;
}

interface Props {
  id: string;
  isAdmin: boolean;
  stores: Store[];
  storesLoading: boolean;
  onRefresh: () => void;
}

export default function UserActionButton({
  id,
  isAdmin,
  stores,
  storesLoading,
  onRefresh,
}: Props) {
  const [showModal, setShowModal] = useState(false);

  const [storePermission, setStorePermission] =
    useState(false);

  const [walletPermission, setWalletPermission] =
    useState(false);

  const [verificationPermission, setVerificationPermission] =
    useState(false);

  const [reportPermission, setReportPermission] =
    useState(false);

  const [selectedStoreIds, setSelectedStoreIds] =
    useState<string[]>([]);

  const [creating, setCreating] = useState(false);
  const [managementPermission, setManagementPermission] =
  useState(false);

  // =========================
  // CREATE ADMIN
  // =========================

  const createAdmin = async () => {
  try {
    setCreating(true);

    await api.post(
      "https://api.thover.in/v1/api/thover-admin/create",
      {
        userId: id,
        permissions: {
          store: storePermission,
          wallet: walletPermission,
          verification: verificationPermission,
          report: reportPermission,
          management: managementPermission,
        },
        managedStoreIds: [],
      }
    );

    alert("Admin created successfully");
    setShowModal(false);

    setStorePermission(false);
    setWalletPermission(false);
    setVerificationPermission(false);
    setReportPermission(false);
    setManagementPermission(false);

    onRefresh();
  } catch (err: any) {
    alert(
      err.response?.data?.message ||
        "Unable to create admin"
    );
  } finally {
    setCreating(false);
  }
};

  // =========================
  // REMOVE ADMIN
  // =========================

  const removeAdmin = async () => {
  try {
    await api.delete(
      "https://api.thover.in/v1/api/thover-admin/delete",
      {
        data: {
          userId: id,
        },
      }
    );

    alert("Admin removed successfully");

    onRefresh();
  } catch (err: any) {
    alert(
      err.response?.data?.message ||
        "Something went wrong"
    );
  }
};

  // =========================
  // IF ALREADY ADMIN
  // =========================

  if (isAdmin) {
    return (
      <button
        onClick={removeAdmin}
        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        <UserMinus size={16} />
        Remove Admin
      </button>
    );
  }

  // =========================
  // MAKE ADMIN
  // =========================

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        <UserPlus size={16} />
        Make Admin
      </button>

      {/* ========================= */}
      {/* CREATE ADMIN MODAL */}
      {/* ========================= */}

      {showModal && (
        <div
  className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
  onClick={() => setShowModal(false)}
>
         <div
  className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
  onClick={(e) => e.stopPropagation()}
>
            {/* Header */}

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Create Thover Admin
                </h2>

                <p className="mt-1 text-sm text-gray-500">
  Select permissions for this admin.
  The admin will select stores from their Store Management page.
</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* ========================= */}
            {/* STORE MANAGEMENT */}
            {/* ========================= */}

            <div className="space-y-4">

              <label className="flex cursor-pointer items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium text-gray-900">
                    Store Management
                  </p>

                  <p className="text-sm text-gray-500">
                    Allow this admin to manage stores.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={storePermission}
                  onChange={(e) => {
                    const checked =
                      e.target.checked;

                    setStorePermission(checked);

                    if (!checked) {
                      setSelectedStoreIds([]);
                    }
                  }}
                  className="h-5 w-5"
                />
              </label>

              


{/* ========================= */}
{/* MANAGEMENT */}
{/* ========================= */}

<label className="flex cursor-pointer items-center justify-between rounded-lg border p-4">
  <div>
    <p className="font-medium text-gray-900">
      Management
    </p>

    <p className="text-sm text-gray-500">
      Allow this admin to manage categories, About and Privacy Terms.
    </p>
  </div>

  <input
    type="checkbox"
    checked={managementPermission}
    onChange={(e) =>
      setManagementPermission(e.target.checked)
    }
    className="h-5 w-5"
  />
</label>
              {/* ========================= */}
              {/* OTHER PERMISSIONS */}
              {/* ========================= */}

              <label className="flex cursor-pointer items-center justify-between rounded-lg border p-4">
                <span className="font-medium">
                  Wallet Management
                </span>

                <input
                  type="checkbox"
                  checked={walletPermission}
                  onChange={(e) =>
                    setWalletPermission(
                      e.target.checked
                    )
                  }
                  className="h-5 w-5"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-lg border p-4">
                <span className="font-medium">
                  Verification Management
                </span>

                <input
                  type="checkbox"
                  checked={verificationPermission}
                  onChange={(e) =>
                    setVerificationPermission(
                      e.target.checked
                    )
                  }
                  className="h-5 w-5"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-lg border p-4">
                <span className="font-medium">
                  Report Management
                </span>

                <input
                  type="checkbox"
                  checked={reportPermission}
                  onChange={(e) =>
                    setReportPermission(
                      e.target.checked
                    )
                  }
                  className="h-5 w-5"
                />
              </label>
            </div>

            {/* ========================= */}
            {/* ACTION BUTTONS */}
            {/* ========================= */}

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={createAdmin}
                disabled={creating}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating
                  ? "Creating..."
                  : "Create Admin"}
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}