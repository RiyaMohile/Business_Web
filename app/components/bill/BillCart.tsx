"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import type { BillProduct } from "./ProductSearchResult";

export interface CartItem extends BillProduct {
  quantity: number;
  size?: string | null;
}

interface BillCartProps {
  cart: CartItem[];

  onUpdateQuantity: (
    productId: string,
    quantity: number,
    size?: string | null
  ) => void;

  onRemove: (
    productId: string,
    size?: string | null
  ) => void;

  onClear: () => void;
}

export default function BillCart({
  cart,
  onUpdateQuantity,
  onRemove,
  onClear,
}: BillCartProps) {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <div>
          <h2 className="font-semibold text-slate-900">
            Billing Cart
          </h2>

          <p className="text-xs text-slate-500">
            {totalItems} item
            {totalItems !== 1 ? "s" : ""}
          </p>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-red-500 hover:text-red-600"
          >
            Clear All
          </button>
        )}
      </div>

      {/* EMPTY CART */}
      {cart.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm font-medium text-slate-600">
            No products added
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Search a product number to add products
          </p>
        </div>
      ) : (
        /* CART ITEMS */
        <div className="divide-y divide-slate-100">
          {cart.map((item) => {
            const price = item.price?.amount ?? 0;

            // Selected size ka stock
            const selectedInventory = item.inventory?.find(
              (inventoryItem) =>
                inventoryItem.size === item.size
            );

            const stock = item.size
              ? selectedInventory?.stock ?? 0
              : item.totalStock ?? 0;

            return (
              <div
                key={`${item._id}-${item.size ?? "no-size"}`}
                className="flex items-center gap-3 p-4"
              >
                {/* PRODUCT INFO */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-slate-900">
                    {item.topic}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Product No: {item.postId}
                  </p>

                  {/* SIZE */}
                  {item.size && (
                    <p className="mt-1 text-xs font-medium text-slate-600">
                      Size: {item.size}
                    </p>
                  )}

                  <p className="mt-1 text-sm text-slate-700">
                    ₹{price.toFixed(2)}
                  </p>
                </div>

                {/* QUANTITY */}
                <div className="flex items-center rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateQuantity(
                        item._id,
                        item.quantity - 1,
                        item.size
                      )
                    }
                    disabled={item.quantity <= 1}
                    className="p-2 disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="min-w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateQuantity(
                        item._id,
                        item.quantity + 1,
                        item.size
                      )
                    }
                    disabled={
                      stock <= 0 ||
                      item.quantity >= stock
                    }
                    className="p-2 disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* TOTAL + DELETE */}
                <div className="w-20 text-right">
                  <p className="text-sm font-semibold">
                    ₹{(price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      onRemove(item._id, item.size)
                    }
                    className="mt-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}