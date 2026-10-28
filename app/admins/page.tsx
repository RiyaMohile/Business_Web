"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import UserTable from "../components/admin/UserTable";
import SearchUser from "../components/admin/SearchUser";
import api from "../services/businessApi";

interface User {
  _id: string;
  name: string;
  username: string;
  phoneNumber?: string;
  isAdmin: boolean;
}

interface Store {
  _id: string;
  storeId: string;
  storeName: string;
  category?: string;
  status?: string;
  isVerified?: boolean;
  isOnline?: boolean;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  const [loading, setLoading] = useState(false);
  const [storesLoading, setStoresLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [isSuperAdmin, setIsSuperAdmin] =
    useState<boolean | null>(null);

  // ==========================================
  // CHECK ADMIN ACCESS
  // ==========================================

  useEffect(() => {
  const checkAccess = async () => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        setIsSuperAdmin(false);
        return;
      }

      const user = JSON.parse(storedUser);

      // User must be admin
      if (user.isAdmin !== true) {
        setIsSuperAdmin(false);
        return;
      }

      // Check ThoverAdmin
      const { data } = await api.get(
        "https://api.thover.in/v1/api/thover-admin/my-access"
      );

      console.log("MY ACCESS:", data);

      const admin = data?.admin;

      if (!admin) {
        setIsSuperAdmin(false);
        return;
      }

      console.log(
        "ThoverAdmin isSuperAdmin:",
        admin.isSuperAdmin
      );

      setIsSuperAdmin(
        admin.isSuperAdmin === true
      );

    } catch (error) {
      console.log(
        "Access check error:",
        error
      );

      setIsSuperAdmin(false);
    }
  };

  checkAccess();
}, []);

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/user/all-users"
      );

      setUsers(data.users || []);
    } catch (err) {
      console.log(err);
      alert("Unable to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SEARCH USERS
  // ==========================================

  const searchUsers = async () => {
    if (!search.trim()) {
      fetchUsers();
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.get(
        `/user/search?username=${encodeURIComponent(
          search
        )}`
      );

      setUsers(data.users || []);
    } catch (err) {
      console.log(err);
      alert("Unable to search users");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH STORES
  // ==========================================

  const fetchStores = async () => {
    try {
      setStoresLoading(true);

      const { data } = await api.get(
        "https://api.thover.in/v1/api/admin-access/all-stores"
      );

      setStores(data.stores || []);
    } catch (err) {
      console.log(err);
      alert("Unable to fetch stores");
    } finally {
      setStoresLoading(false);
    }
  };

  // ==========================================
  // FETCH ADMIN PAGE DATA
  // ONLY SUPER ADMIN
  // ==========================================

  useEffect(() => {
    if (isSuperAdmin !== true) {
      return;
    }

    fetchUsers();
    fetchStores();
  }, [isSuperAdmin]);

  // ==========================================
  // CHECKING ACCESS
  // ==========================================

  if (isSuperAdmin === null) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="ml-0 md:ml-72 flex-1 h-screen" />
      </div>
    );
  }

  // ==========================================
  // NORMAL ADMIN
  // SIDEBAR SHOWS
  // MAIN AREA BLANK
  // ==========================================

  if (!isSuperAdmin) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="ml-0 md:ml-72 flex-1 h-screen" />
      </div>
    );
  }

  // ==========================================
  // SUPER ADMIN
  // FULL ADMIN MANAGEMENT PAGE
  // ==========================================

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-0 md:ml-72 flex-1 h-screen overflow-hidden px-4 pb-6 pt-20 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          Admin Management
        </h1>

        <p className="text-gray-500 mt-2">
          Promote or remove admins.
        </p>

        <SearchUser
          value={search}
          onChange={setSearch}
          onSearch={searchUsers}
        />

        <UserTable
          users={users}
          stores={stores}
          storesLoading={storesLoading}
          loading={loading}
          onRefresh={fetchUsers}
        />
      </main>
    </div>
  );
}