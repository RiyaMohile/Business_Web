"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Package,
  Plus,
  Eye,
  Pencil,
  AlertTriangle,
  XCircle,
  ChevronDown,
} from "lucide-react";

import Navbar from "../components/BusinessNavbar";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const products: Product[] = [
  {
    id: "PRD-001",
    name: "Classic T-Shirt",
    category: "Western Wear",
    price: 799,
    stock: 45,
    status: "In Stock",
  },
  {
    id: "PRD-002",
    name: "Slim Fit Jeans",
    category: "Western Wear",
    price: 1499,
    stock: 8,
    status: "Low Stock",
  },
  {
    id: "PRD-003",
    name: "Cotton Hoodie",
    category: "Western Wear",
    price: 1299,
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "PRD-004",
    name: "Formal Shirt",
    category: "Formal Wear",
    price: 999,
    stock: 25,
    status: "In Stock",
  },
];

const stockStyles = {
  "In Stock": "bg-green-100 text-green-700",
  "Low Stock": "bg-yellow-100 text-yellow-700",
  "Out of Stock": "bg-red-100 text-red-700",
};

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = [
    "All",
    ...Array.from(
      new Set(products.map((product) => product.category))
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.id
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStock =
      stockFilter === "All" ||
      product.status === stockFilter;

    const matchesCategory =
      categoryFilter === "All" ||
      product.category === categoryFilter;

    return (
      matchesSearch &&
      matchesStock &&
      matchesCategory
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}

      <Navbar/>

      <main className="p-8">

        <div className="max-w-7xl mx-auto">

          {/* Header */}

          <div className="flex justify-between items-center">

            <div>

              <h1 className="text-4xl font-bold text-gray-900">
                Inventory
              </h1>

              <p className="text-gray-500 mt-2">
                Manage your products and stock.
              </p>

            </div>

            <div className="flex gap-3">

              <Link
                href="/business-dashboard"
                className="bg-white border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-xl"
              >
                Back to Dashboard
              </Link>

              <Link
                href="/inventory/add"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
              >
                <Plus size={20} />

                Add Product
              </Link>

            </div>

          </div>

          {/* Stats */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

            {/* Total Products */}

            <div className="bg-white rounded-2xl shadow-sm p-6">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Total Products
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {products.length}
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">

                  <Package
                    size={28}
                    className="text-blue-600"
                  />

                </div>

              </div>

            </div>

            {/* In Stock */}

            <div className="bg-white rounded-2xl shadow-sm p-6">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    In Stock
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {
                      products.filter(
                        (product) =>
                          product.status === "In Stock"
                      ).length
                    }
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">

                  <Package
                    size={28}
                    className="text-green-600"
                  />

                </div>

              </div>

            </div>

            {/* Low Stock */}

            <div className="bg-white rounded-2xl shadow-sm p-6">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Low Stock
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {
                      products.filter(
                        (product) =>
                          product.status === "Low Stock"
                      ).length
                    }
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-xl bg-yellow-100 flex items-center justify-center">

                  <AlertTriangle
                    size={28}
                    className="text-yellow-600"
                  />

                </div>

              </div>

            </div>

            {/* Out of Stock */}

            <div className="bg-white rounded-2xl shadow-sm p-6">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Out of Stock
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {
                      products.filter(
                        (product) =>
                          product.status ===
                          "Out of Stock"
                      ).length
                    }
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">

                  <XCircle
                    size={28}
                    className="text-red-600"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* Filters */}

          <div className="bg-white rounded-2xl shadow-sm p-5 mt-10">

            <div className="flex flex-col lg:flex-row gap-4">

              {/* Search */}

              <div className="relative flex-1">

                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search product or product ID..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                />

              </div>

              {/* Category */}

              <div className="relative">

                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value)
                  }
                  className="appearance-none border border-gray-300 bg-white rounded-xl px-5 py-3 pr-10 outline-none min-w-[180px]"
                >

                  {categories.map((category) => (

                    <option
                      key={category}
                      value={category}
                    >
                      {category === "All"
                        ? "All Categories"
                        : category}
                    </option>

                  ))}

                </select>

                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                />

              </div>

              {/* Stock */}

              <div className="relative">

                <select
                  value={stockFilter}
                  onChange={(e) =>
                    setStockFilter(e.target.value)
                  }
                  className="appearance-none border border-gray-300 bg-white rounded-xl px-5 py-3 pr-10 outline-none min-w-[170px]"
                >

                  <option value="All">
                    All Stock
                  </option>

                  <option value="In Stock">
                    In Stock
                  </option>

                  <option value="Low Stock">
                    Low Stock
                  </option>

                  <option value="Out of Stock">
                    Out of Stock
                  </option>

                </select>

                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                />

              </div>

            </div>

          </div>

          {/* Product Table */}

          <div className="bg-white rounded-2xl shadow-sm mt-6 overflow-hidden">

            <div className="px-6 py-5 border-b">

              <h2 className="text-xl font-semibold">
                Products
              </h2>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Product ID
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Product
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Category
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Price
                    </th>

                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                      Stock
                    </th>

                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredProducts.length === 0 ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="text-center py-12"
                      >

                        <Package
                          size={40}
                          className="mx-auto text-gray-300"
                        />

                        <p className="text-gray-500 mt-3">
                          No products found.
                        </p>

                      </td>

                    </tr>

                  ) : (

                    filteredProducts.map((product) => (

                      <tr
                        key={product.id}
                        className="border-t hover:bg-gray-50"
                      >

                        {/* ID */}

                        <td className="px-6 py-5 font-semibold text-gray-900">
                          {product.id}
                        </td>

                        {/* Product */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">

                              <Package
                                size={21}
                                className="text-gray-500"
                              />

                            </div>

                            <span className="font-medium">
                              {product.name}
                            </span>

                          </div>

                        </td>

                        {/* Category */}

                        <td className="px-6 py-5 text-gray-600">
                          {product.category}
                        </td>

                        {/* Price */}

                        <td className="px-6 py-5 font-semibold">
                          ₹
                          {product.price.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        {/* Stock */}

                        <td className="px-6 py-5 text-center">
                          {product.stock}
                        </td>

                        {/* Status */}

                        <td className="px-6 py-5 text-center">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                              stockStyles[
                                product.status
                              ]
                            }`}
                          >
                            {product.status}
                          </span>

                        </td>

                        {/* Actions */}

                        <td className="px-6 py-5">

                          <div className="flex justify-center gap-2">

                            <button
                              type="button"
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>

                            <button
                              type="button"
                              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700"
                              title="Edit"
                            >
                              <Pencil size={18} />
                            </button>

                          </div>

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