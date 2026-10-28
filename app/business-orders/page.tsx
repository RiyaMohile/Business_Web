"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Eye,
  ChevronDown,
  Package,
} from "lucide-react";

import Navbar from "../components/BusinessNavbar";

interface Order {
  id: string;
  customer: string;
  date: string;
  items: number;
  amount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
}

const orders: Order[] = [
  {
    id: "#ORD-1001",
    customer: "Rahul Sharma",
    date: "12 Aug 2026",
    items: 2,
    amount: 2499,
    status: "Pending",
  },
  {
    id: "#ORD-1002",
    customer: "Priya Singh",
    date: "11 Aug 2026",
    items: 3,
    amount: 4599,
    status: "Processing",
  },
  {
    id: "#ORD-1003",
    customer: "Aman Verma",
    date: "10 Aug 2026",
    items: 1,
    amount: 1299,
    status: "Shipped",
  },
  {
    id: "#ORD-1004",
    customer: "Neha Gupta",
    date: "09 Aug 2026",
    items: 4,
    amount: 6299,
    status: "Delivered",
  },
];

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      order.customer
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}

      <Navbar />

      <main className="p-8">

        <div className="max-w-7xl mx-auto">

          {/* Header */}

          <div className="flex justify-between items-center">

            <div>

              <h1 className="text-4xl font-bold text-gray-900">
                Orders
              </h1>

              <p className="text-gray-500 mt-2">
                Manage and track your store orders.
              </p>

            </div>

            <Link
              href="/business-dashboard"
              className="border border-gray-300 bg-white px-5 py-3 rounded-xl hover:bg-gray-50"
            >
              Back to Dashboard
            </Link>

          </div>

          {/* Stats */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">

            {/* Total Orders */}

            <div className="bg-white rounded-2xl shadow-sm p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500">
                    Total Orders
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    128
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

                  <ShoppingBag
                    size={24}
                    className="text-blue-600"
                  />

                </div>

              </div>

            </div>

            {/* Pending */}

            <div className="bg-white rounded-2xl shadow-sm p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500">
                    Pending
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    12
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">

                  <Package
                    size={24}
                    className="text-yellow-600"
                  />

                </div>

              </div>

            </div>

            {/* Processing */}

            <div className="bg-white rounded-2xl shadow-sm p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500">
                    Processing
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    18
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">

                  <Package
                    size={24}
                    className="text-purple-600"
                  />

                </div>

              </div>

            </div>

            {/* Delivered */}

            <div className="bg-white rounded-2xl shadow-sm p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500">
                    Delivered
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    98
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">

                  <ShoppingBag
                    size={24}
                    className="text-green-600"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* Filters */}

          <div className="bg-white rounded-2xl shadow-sm p-5 mt-10">

            <div className="flex flex-col md:flex-row gap-4 justify-between">

              {/* Search */}

              <div className="relative flex-1">

                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search order ID or customer..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                />

              </div>

              {/* Status Filter */}

              <div className="relative">

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="appearance-none border border-gray-300 rounded-xl px-5 py-3 pr-10 outline-none bg-white"
                >

                  <option value="All">
                    All Orders
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Processing">
                    Processing
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                />

              </div>

            </div>

          </div>

          {/* Orders Table */}

          <div className="bg-white rounded-2xl shadow-sm mt-6 overflow-hidden">

            <div className="px-6 py-5 border-b">

              <h2 className="text-xl font-semibold">
                Recent Orders
              </h2>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Order ID
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Customer
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Date
                    </th>

                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                      Items
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Amount
                    </th>

                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredOrders.length === 0 ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="text-center py-12 text-gray-500"
                      >
                        No orders found.
                      </td>

                    </tr>

                  ) : (

                    filteredOrders.map((order) => (

                      <tr
                        key={order.id}
                        className="border-t hover:bg-gray-50"
                      >

                        <td className="px-6 py-5 font-semibold text-gray-900">
                          {order.id}
                        </td>

                        <td className="px-6 py-5 text-gray-700">
                          {order.customer}
                        </td>

                        <td className="px-6 py-5 text-gray-600">
                          {order.date}
                        </td>

                        <td className="px-6 py-5 text-center text-gray-700">
                          {order.items}
                        </td>

                        <td className="px-6 py-5 font-semibold">
                          ₹{order.amount.toLocaleString("en-IN")}
                        </td>

                        <td className="px-6 py-5 text-center">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusStyles[order.status]}`}
                          >
                            {order.status}
                          </span>

                        </td>

                        <td className="px-6 py-5 text-center">

                          <button
                            type="button"
                            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700"
                          >
                            <Eye size={17} />

                            View
                          </button>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}