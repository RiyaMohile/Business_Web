"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Package, X } from "lucide-react";

export default function LowStockDetails({ onClose, storeId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        if (!storeId) {
          console.error("Store ID is missing");
          setProducts([]);
          return;
        }

        const token = localStorage.getItem("token");
        console.log("========== LOW STOCK MODAL ==========");
console.log("storeId received:", storeId);
console.log("storeId from localStorage:", localStorage.getItem("selectedStoreId"));
console.log("====================================");

        const response = await axios.get(
          `https://api.thover.in/v2/api/order/low-stock?storeId=${storeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setProducts(response.data.products || []);
        }
      } catch (error) {
        console.error("Low stock API error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, [storeId]);

  return (
    <div
      className="
        fixed inset-0
        z-[70]
        flex items-center justify-center
        bg-black/40
        px-3
      "
      onClick={onClose}
    >
      <div
        className="
          w-full
          max-w-[390px]
          max-h-[88vh]
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          className="
            flex items-start justify-between
            border-b border-slate-100
            px-4 py-3
          "
        >
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Low Stock Products
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Products that need restocking.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex h-6 w-6 items-center justify-center
              rounded-full
              text-slate-500
              hover:bg-slate-100
              hover:text-slate-800
            "
          >
            <X size={15} />
          </button>
        </div>

        {/* CONTENT */}
        <div
          className="
            max-h-[68vh]
            overflow-y-auto
            px-3 py-3
          "
        >
          {/* LOADING */}
          {loading && (
            <div className="py-10 text-center">
              <p className="text-xs text-slate-500">
                Loading low stock products...
              </p>
            </div>
          )}

          {/* NO PRODUCTS */}
          {!loading && products.length === 0 && (
            <div
              className="
                rounded-xl
                border border-slate-200
                bg-slate-50
                px-4 py-8
                text-center
              "
            >
              <div
                className="
                  mx-auto
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  border border-slate-200
                  bg-white
                "
              >
                <Package size={20} className="text-slate-400" />
              </div>

              <p className="mt-3 text-xs font-semibold text-slate-700">
                No low stock products
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                All products have sufficient stock.
              </p>
            </div>
          )}

          {/* PRODUCTS */}
          {!loading && products.length > 0 && (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.postId}
                  className="
                    rounded-xl
                    border border-slate-200
                    bg-white
                    p-3
                  "
                >
                  {/* PRODUCT */}
                  <div className="flex items-center gap-3">
                    {/* PRODUCT ICON */}
                    <div
                      className="
                        flex h-12 w-12 shrink-0
                        items-center justify-center
                        overflow-hidden
                        rounded-lg
                        bg-slate-100
                      "
                    >
                      <Package size={21} className="text-slate-500" />
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-slate-900">
                        {product.topic}
                      </h3>

                      {product.color && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          Color: {product.color}
                        </p>
                      )}

                      <p className="mt-0.5 text-xs text-slate-500">
                        Total Stock:{" "}
                        <span className="font-semibold text-slate-700">
                          {product.totalStock}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* TABLE HEADER */}
                  <div
                    className="
                      mt-3
                      grid grid-cols-3
                      border-b border-slate-100
                      pb-1.5
                    "
                  >
                    <span className="text-xs font-semibold text-slate-600">
                      Size
                    </span>

                    <span className="text-center text-xs font-semibold text-slate-600">
                      Stock quantity
                    </span>

                    <span className="text-right text-xs font-semibold text-slate-600">
                      Status
                    </span>
                  </div>

                  {/* STOCK ROWS */}
                  <div className="divide-y divide-slate-100">
                    {product.lowStockSizes?.map((item, index) => (
                      <div
                        key={index}
                        className="
                          grid grid-cols-3
                          items-center
                          py-2
                        "
                      >
                        <span className="text-sm font-semibold text-slate-800">
                          {item.size}
                        </span>

                        <span className="text-center text-sm font-semibold text-slate-800">
                          {item.stock}
                        </span>

                        <div className="flex justify-end">
                          <span
                            className="
                              rounded-md
                              bg-red-50
                              px-2.5 py-1
                              text-[8px]
                              font-bold
                              text-red-500
                            "
                          >
                            Low Stock
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-100 px-3 py-3">
          <button
            type="button"
            onClick={onClose}
            className="
              w-full
              rounded-lg
              border border-orange-500
              bg-orange-500
              px-4 py-2.5
              text-sm font-semibold
              text-white
              transition
              hover:bg-orange-600
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}