"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import UserTable from "../../components/admin/UserTable";
import SearchUser from "../../components/admin/SearchUser";
import api from "../../services/businessApi";

interface User {
  _id: string;
  name: string;
  username: string;
  phoneNumber?: string;
  email?: string;
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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  const [loading, setLoading] = useState(false);
  const [storesLoading, setStoresLoading] = useState(false);

  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/user/all-users");

      setUsers(data.users || []);
    } catch (error) {
      console.log(error);
      alert("Unable to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      setStoresLoading(true);

      const { data } = await api.get(
        "/admin-access/all-stores"
      );

      setStores(data.stores || []);
    } catch (error) {
      console.log(error);
      alert("Unable to fetch stores");
    } finally {
      setStoresLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!search.trim()) {
      fetchUsers();
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.get(
        `/user/search?username=${encodeURIComponent(search)}`
      );

      setUsers(data.users || []);
    } catch (error) {
      console.log(error);
      alert("Unable to search users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStores();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <main className="ml-72 flex-1 h-screen overflow-y-auto p-8">

        <h1 className="text-4xl font-bold">
          Users
        </h1>

        <p className="text-gray-500 mt-2">
          Search, manage and view users.
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