"use client";

import { useEffect, useState } from "react";
import { Package, Plus } from "lucide-react";

export interface BillProduct {
  _id: string;
  postId: string;
  topic: string;

  description?: string;

  price?: {
    currency?: string;
    amount?: number;
    priceType?: string;
  };

  inventory?: {
    size: string;
    stock: number;
    lastUpdated?: string;
  }[];

  totalStock?: number;

  discount?: {
    title?: string;
    expiry?: string;
    type?: "percentage" | "flat";
    value?: number;
  };

  media?: {
    mediaName?: string;
    mediaUrl?: string;
    mediaPath?: string;
    isDeleted?: boolean;
  }[];
}

interface ProductSearchResultProps {
  product: BillProduct;
  onAddToCart: (
    product: BillProduct,
    selectedSize: string
  ) => void;
}

export default function ProductSearchResult({
  product,
  onAddToCart,
}: ProductSearchResultProps) {
  const price = product.price?.amount ?? 0;

  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    if (product.inventory?.length === 1) {
      setSelectedSize(product.inventory[0].size);
    } else {
      setSelectedSize("");
    }
  }, [product]);

  const image =
    product.media?.find(
      (item) => !item.isDeleted && item.mediaUrl
    )?.mediaUrl;

  const stock = product.totalStock ?? 0;

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
          {image ? (
            <img
              src={image}
              alt={product.topic}
              className="h-full w-full object-cover"
            />
          ) : (
            <Package
              size={24}
              className="text-slate-400"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-slate-900">
            {product.topic}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Product No:{" "}
            <span className="font-medium text-slate-700">
              {product.postId}
            </span>
          </p>

          {product.inventory && product.inventory.length > 1 && (
  <div className="mt-3">
    <p className="mb-2 text-xs font-medium text-slate-600">
      Select Size
    </p>

    <div className="flex flex-wrap gap-2">
      {product.inventory.map((item) => (
        <button
          key={item.size}
          type="button"
          disabled={item.stock <= 0}
          onClick={() => setSelectedSize(item.size)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
            selectedSize === item.size
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-300 bg-white text-slate-700"
          } ${
            item.stock <= 0
              ? "cursor-not-allowed opacity-40"
              : "hover:border-slate-900"
          }`}
        >
          {item.size}
        </button>
      ))}
    </div>
  </div>
)}
        </div>

        <button
          type="button"
          disabled={
  stock <= 0 ||
  (product.inventory &&
    product.inventory.length > 1 &&
    !selectedSize)
}
          onClick={() => onAddToCart(product, selectedSize)}
          className="
            flex shrink-0 items-center gap-2
            rounded-xl bg-slate-900
            px-4 py-2.5
            text-sm font-medium text-white
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          <Plus size={17} />
          Add
        </button>
      </div>
    </div>
  );
}