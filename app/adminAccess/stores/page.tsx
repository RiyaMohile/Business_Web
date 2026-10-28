"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Store as StoreIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import api from "../../services/businessApi";

interface Store {
  _id: string;
  storeId: string;
  storeName: string;
  userId: string;
  category?: string;
  status?: string;
  isVerified?: boolean;
  isOnline?: boolean;
}

interface AdminInfo {
  isSuperAdmin: boolean;
  permissions: {
    store: boolean;
    wallet: boolean;
    verification: boolean;
    report: boolean;
    management: boolean;
  };
  managedStoreIds: string[];
  status: string;
}

export default function StoreManagementPage() {
  const router = useRouter();

  const [stores, setStores] = useState<Store[]>([]);
  const [admin, setAdmin] = useState<AdminInfo | null>(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStoreIds, setSelectedStoreIds] =
  useState<string[]>([]);

const [savingStores, setSavingStores] = useState(false);
const [showStoreDashboard, setShowStoreDashboard] = useState(false);

  // =====================================================
  // FETCH ADMIN + STORES
  // =====================================================

  useEffect(() => {
    const fetchStoreManagement = async () => {
      try {
        setLoading(true);

        // -----------------------------------------------
        // 1. Check logged-in User
        // -----------------------------------------------

        const storedUser =
          localStorage.getItem("user");

        if (!storedUser) {
          router.replace("/login");
          return;
        }

        const user = JSON.parse(storedUser);

        console.log(
          "Logged-in User:",
          user
        );

        console.log(
          "User.isAdmin:",
          user.isAdmin
        );

        // -----------------------------------------------
        // 2. User must be admin
        // -----------------------------------------------

        if (!user.isAdmin) {
          router.replace("/dashboard");
          return;
        }

        // -----------------------------------------------
        // 3. Get ThoverAdmin access
        // -----------------------------------------------

        const adminResponse = await api.get(
          "https://api.thover.in/v1/api/thover-admin/my-access"
        );

        console.log(
          "Admin Access:",
          adminResponse.data
        );

        const adminData = adminResponse.data?.admin;

setAdmin(adminData);

const savedIds = (adminData?.managedStoreIds || []).map(
  (item: string | { _id: string }) =>
    typeof item === "string" ? item : item._id
);

setSelectedStoreIds(savedIds);
setShowStoreDashboard(savedIds.length > 0);

        

        // -----------------------------------------------
        // 4. Check Store permission
        // -----------------------------------------------

        if (
          !adminData?.isSuperAdmin &&
          !adminData?.permissions?.store
        ) {
          alert(
            "You don't have store management permission."
          );

          router.replace("/dashboard");
          return;
        }

        // -----------------------------------------------
        // 5. Get accessible stores
        // -----------------------------------------------

        const storesResponse = await api.get(
  "https://api.thover.in/v2/api/store/stores-by-city"
);

        console.log(
          "Stores Response:",
          storesResponse.data
        );

        console.log(
          "Accessible Stores:",
          storesResponse.data?.stores
        );

        setStores(
          storesResponse.data?.stores || []
        );
      } catch (error: any) {
        console.log(
          "Store Management Error:",
          error
        );

        console.log(
          "Error Response:",
          error.response?.data
        );

        if (error.response?.status === 401) {
          router.replace("/login");
          return;
        }

        if (error.response?.status === 403) {
          router.replace("/dashboard");
          return;
        }

        alert(
          error.response?.data?.message ||
            "Unable to fetch stores"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStoreManagement();
  }, [router]);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredStores = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) {
      return stores;
    }

    return stores.filter((store) => {
      return (
        store.storeName
          ?.toLowerCase()
          .includes(value) ||
        store.storeId
          ?.toLowerCase()
          .includes(value) ||
        store.category
          ?.toLowerCase()
          .includes(value)
      );
    });
  }, [stores, search]);


  const selectedStores = useMemo(() => {
  return stores.filter((store) =>
    selectedStoreIds.includes(store._id)
  );
}, [stores, selectedStoreIds]);

const dashboardStores = useMemo(() => {
  const value = search.trim().toLowerCase();

  return selectedStores.filter((store) => {
    return (
      store.storeName?.toLowerCase().includes(value) ||
      store.storeId?.toLowerCase().includes(value) ||
      store.category?.toLowerCase().includes(value)
    );
  });
}, [selectedStores, search]);

  

  const handleViewStore = (store: Store) => {
  console.log("🔥 VIEW STORE FUNCTION CALLED");
  console.log("🔥 Selected Store ID:", store._id);

  sessionStorage.setItem(
    "selectedStoreId",
    store._id
  );

  router.push("/adminAccess/stores/view");
};


const saveSelectedStores = async () => {
  try {
    setSavingStores(true);

    await api.patch("https://api.thover.in/v1/api/admin-access/select-stores", {
      managedStoreIds: selectedStoreIds,
    });

    setShowStoreDashboard(true);
  } catch (error: any) {
    console.error(error.response?.data || error);
    alert(
      error.response?.data?.message ||
      "Unable to save selected stores"
    );
  } finally {
    setSavingStores(false);
  }
};
  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-gray-500">
            Loading stores...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
{!showStoreDashboard ? (
  <div className="rounded-xl border border-gray-200 bg-white p-6">
    <h1 className="text-2xl font-bold text-gray-900">
      Select Stores
    </h1>

    <p className="mt-1 text-sm text-gray-500">
      Select the stores this admin will manage.
    </p>

    <div className="relative my-5">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by store name or store ID..."
        className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
      />
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3">
              <input
                type="checkbox"
                checked={
                  filteredStores.length > 0 &&
                  filteredStores.every((store) =>
                    selectedStoreIds.includes(store._id)
                  )
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedStoreIds((prev) => [
                      ...new Set([
                        ...prev,
                        ...filteredStores.map((store) => store._id),
                      ]),
                    ]);
                  } else {
                    const visibleIds = new Set(
                      filteredStores.map((store) => store._id)
                    );

                    setSelectedStoreIds((prev) =>
                      prev.filter((id) => !visibleIds.has(id))
                    );
                  }
                }}
              />
            </th>
            <th className="p-3">Store Name</th>
            <th className="p-3">Store ID</th>
            <th className="p-3">Category</th>
          </tr>
        </thead>

        <tbody>
          {filteredStores.map((store) => (
            <tr key={store._id} className="border-t">
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedStoreIds.includes(store._id)}
                  onChange={(e) => {
                    setSelectedStoreIds((prev) =>
                      e.target.checked
                        ? [...new Set([...prev, store._id])]
                        : prev.filter((id) => id !== store._id)
                    );
                  }}
                />
              </td>

              <td className="p-3 font-medium">
                {store.storeName}
              </td>

              <td className="p-3 text-gray-600">
                {store.storeId}
              </td>

              <td className="p-3 text-gray-600">
                {store.category || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="mt-6 flex justify-end">
      <button
        type="button"
        onClick={saveSelectedStores}
        disabled={savingStores || selectedStoreIds.length === 0}
        className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {savingStores ? "Saving..." : "Save Selected Stores"}
      </button>
    </div>
  </div>
) : (
  <>
    {/* YAHAN TUMHARA EXISTING STORE MANAGEMENT DASHBOARD JSX AAYEGA */}

        {/* ============================================= */}
        {/* HEADER */}
        {/* ============================================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Store Management
          </h1>

          <p className="mt-1 text-gray-500">
            Manage stores available to your account.
          </p>
        </div>

        {/* ============================================= */}
        {/* ADMIN INFO */}
        {/* ============================================= */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>
              <p className="text-sm text-gray-500">
                Access Type
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {admin?.isSuperAdmin
                  ? "Super Admin"
                  : "Admin"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Accessible Stores
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {selectedStores.length}
              </p>
            </div>

          </div>
        </div>

        {/* ============================================= */}
        {/* SEARCH */}
        {/* ============================================= */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search store by name, ID or category..."
              className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />

          </div>
        </div>

        {/* ============================================= */}
        {/* STORE COUNT */}
        {/* ============================================= */}

        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {dashboardStores.length}
            </span>{" "}
            store
            {filteredStores.length !== 1
              ? "s"
              : ""}
          </p>
        </div>

        {/* ============================================= */}
        {/* STORES */}
        {/* ============================================= */}

        {dashboardStores.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">

            <StoreIcon
              size={42}
              className="mx-auto text-gray-400"
            />

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No stores found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              No stores are available for your account.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {dashboardStores.map((store) => (
                <div
                  key={store._id}
                  
                  className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
                >

                  {/* Store Header */}

                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                        <StoreIcon
                          size={22}
                          className="text-blue-600"
                        />
                      </div>

                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {store.storeName}
                        </h2>

                        <p className="text-sm text-gray-500">
                          {store.storeId}
                        </p>
                      </div>

                    </div>

                    {/* Online */}

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        store.isOnline
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {store.isOnline
                        ? "Online"
                        : "Offline"}
                    </span>

                  </div>

                  {/* Details */}

                  <div className="mt-5 space-y-3">

                    {store.category && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Category
                        </span>

                        <span className="font-medium text-gray-900">
                          {store.category}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Status
                      </span>

                      <span className="font-medium capitalize text-gray-900">
                        {store.status || "Active"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Verification
                      </span>

                      <span
                        className={`font-medium ${
                          store.isVerified
                            ? "text-green-600"
                            : "text-orange-500"
                        }`}
                      >
                        {store.isVerified
                          ? "Verified"
                          : "Not Verified"}
                      </span>
                    </div>

                  </div>

                  {/* Footer */}

                  <div className="mt-5 border-t border-gray-100 pt-4">

                    <button
  onClick={() => handleViewStore(store)}
  className="rounded-lg bg-blue-600 px-4 py-2 text-white"
>
  View Store
</button>

                  </div>

                </div>
              )
            )}

          </div>
        )}

        <div className="mt-6 flex justify-end">
  <button
    type="button"
    onClick={saveSelectedStores}
    disabled={savingStores}
    className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {savingStores ? "Saving..." : "Save Selected Stores"}
  </button>
</div>
       </>
      )}

    </div>
  </div>
);
}