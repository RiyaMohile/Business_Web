"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/BusinessNavbar";
import CreateStoreDialog from "../components/CreateStoreDialog";

export default function DashboardPage() {
  const [showCreateStore, setShowCreateStore] = useState(false);
  const [checkingStore, setCheckingStore] = useState(true);

  useEffect(() => {
    checkStore();
  }, []);

  const checkStore = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setCheckingStore(false);
        return;
      }

      const response = await axios.get(
        "https://api.thover.in/v1/api/store/my-store",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("MY STORE:", response.data);

      // Store exists
      setShowCreateStore(false);
    } catch (error: any) {
      console.log(
        "STORE CHECK:",
        error.response?.status,
        error.response?.data
      );

      // If backend says store doesn't exist
      if (error.response?.status === 404) {
        setShowCreateStore(true);
      }
    } finally {
      setCheckingStore(false);
    }
  };

  if (checkingStore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="p-10">
        <h1 className="text-4xl font-bold">
          Welcome to Thover Business
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your business from here.
        </p>
      </main>

      {showCreateStore && (
        <CreateStoreDialog
          onCreated={() => {
            setShowCreateStore(false);
            checkStore();
          }}
        />
      )}
    </div>
  );
}