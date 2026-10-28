"use client";

import {
  X,
  Percent,
  Package,
  Circle,
  Archive,
  Trash2,
  Edit,
} from "lucide-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";

interface Product {
  _id: string;
  postId: string;
  topic: string;
  description?: string;

  media?: {
    mediaName: string;
    mediaUrl: string;
    mediaPath: string;
    isDeleted?: boolean;
  }[];

  price?: {
    currency?: string;
    amount?: number;
    priceType?: string;
  };
  discount?: {
  title?: string;
  expiry?: string;
  type?: "percentage" | "flat";
  value?: number;
};

  storeCategory?: string;
  category?: string;

  inventory?: {
    size: string;
    stock: number;
  }[];

  totalStock?: number;
  status?: string;
}

interface ProductActionModalProps {
  product: Product;
  onClose: () => void;
  userRole?: "owner" | "manager" | "employee" | null;
  onEdit?: () => void;
  onAddSimilarProducts?: () => void;
  onUpdateDiscount?: () => void;
  onUpdateInventory?: () => void;
  onManageMedia?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

export default function ProductActionModal({
  product,
  onClose,
   userRole,
   onEdit,
   onAddSimilarProducts,
  onUpdateDiscount,
  onUpdateInventory,
  onManageMedia,
  onArchive,
  onDelete,
}: ProductActionModalProps) {
  const [showBarcode, setShowBarcode] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);
  const barcodeContainerRef = useRef<HTMLDivElement>(null);
  
  const image = product.media?.find(
    (media) => !media.isDeleted && media.mediaUrl
  )?.mediaUrl;

  const handleDownloadQR = () => {
  const svg = qrRef.current;

  if (!svg) return;

  const svgData = new XMLSerializer().serializeToString(svg);

  const svgBlob = new Blob([svgData], {
    type: "image/svg+xml;charset=utf-8",
  });

  const url = URL.createObjectURL(svgBlob);

  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement("canvas");

    const size = 1000;

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      URL.revokeObjectURL(url);
      return;
    }

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // QR ko center + zoom
    const qrSize = 700;

    const x = (size - qrSize) / 2;
    const y = (size - qrSize) / 2;

    ctx.drawImage(
      image,
      x,
      y,
      qrSize,
      qrSize
    );

    URL.revokeObjectURL(url);

    // PNG download
    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");

    link.href = pngUrl;
    link.download = `QR-${product.postId}.png`;

    link.click();
  };

  image.src = url;
};

const handleDownloadBarcode = () => {
  const svg = barcodeContainerRef.current?.querySelector("svg");

  if (!svg) {
    console.error("Barcode SVG not found");
    return;
  }

  const svgData = new XMLSerializer().serializeToString(svg);

  const svgBlob = new Blob([svgData], {
    type: "image/svg+xml;charset=utf-8",
  });

  const url = URL.createObjectURL(svgBlob);

  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement("canvas");

    canvas.width = 1200;
    canvas.height = 500;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      URL.revokeObjectURL(url);
      return;
    }

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Barcode size
    const barcodeWidth = 1000;
    const barcodeHeight = 250;

    // Center barcode
    const x = (canvas.width - barcodeWidth) / 2;
    const y = (canvas.height - barcodeHeight) / 2;

    ctx.drawImage(
      image,
      x,
      y,
      barcodeWidth,
      barcodeHeight
    );

    URL.revokeObjectURL(url);

    // Convert canvas to PNG
    const pngUrl = canvas.toDataURL("image/png");

    // Download PNG
    const link = document.createElement("a");

    link.href = pngUrl;
    link.download = `Barcode-${product.postId}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  image.onerror = () => {
    URL.revokeObjectURL(url);
    console.error("Failed to create barcode image");
  };

  image.src = url;
};

  return (
    <div
  className="
    fixed inset-0 z-50 md:top-20
    flex items-center justify-center
    bg-black/40
    px-4
    py-4
    sm:py-6
  "
  onClick={onClose}
>
      <div
  className="
    relative
    w-full
    max-w-md
    md:max-h-[calc(100dvh-8rem)]
    overflow-y-auto
    rounded-2xl
    bg-white
    p-5
    shadow-xl
    overscroll-contain
    sm:max-h-[calc(100dvh-3rem)]
  "
  onClick={(e) => e.stopPropagation()}
>
        {/* CLOSE */}
        <button
          type="button"
          onClick={onClose}
          className="
            absolute right-4 top-4
            text-gray-700 hover:text-black
          "
        >
          <X size={20} />
        </button>

        {/* PRODUCT HEADER */}
        <div className="flex items-center gap-4 pr-6">

          {/* IMAGE */}
          {image ? (
            <img
              src={image}
              alt={product.topic}
              className="
                h-20 w-20
                rounded-full
                object-cover
              "
            />
          ) : (
            <div
              className="
                flex h-20 w-20
                items-center justify-center
                rounded-full bg-slate-100
              "
            >
              <Package
                size={30}
                className="text-slate-400"
              />
            </div>
          )}

          {/* PRODUCT INFO */}
          <div className="min-w-0">

            <h2 className="truncate text-lg font-bold">
              {product.topic}
            </h2>

            <p className="text-lg font-bold">
  <span>{product.price?.currency || "INR"}</span>
  <span className="ml-1.5">
    {product.price?.amount ?? 0}
  </span>
</p>

            <p className="text-sm text-gray-500">

  {product.category || "Subcategory"}
</p>

{product.discount?.value &&
  product.discount.value > 0 && (
    <div className="mt-3 flex items-center rounded-xl border border-green-200 bg-green-50 px-3 py-2">

      {/* CHECK ICON */}
      <div className="flex h-4 w-4 shrink-0 mb-4 items-center justify-center rounded-full bg-green-600">
        <span className="text-[10px] font-bold text-white">
          ✓
        </span>
      </div>

      {/* DISCOUNT INFO */}
      <div className="ml-1 min-w-0 flex-1">
        <p className="text-xs font-semibold text-green-600">
          Discount applied
        </p>

        <p className="text-sm font-bold text-green-600">
          {product.discount.type === "percentage"
            ? `${product.discount.value}%`
            : `₹${product.discount.value}`}
        </p>
      </div>

      {/* TITLE */}
      {product.discount.title && (
        <div className="ml-2 border-l border-dashed border-green-200 pl-2">
          <p className="max-w-[80px] truncate text-[10px] text-gray-500">
            {product.discount.title}
          </p>
        </div>
      )}

    </div>
  )}

          </div>
        </div>
        {product.inventory && product.inventory.length > 0 && (
  <div className="mt-3 pt-3 border-t border-gray-100">

    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-gray-500 font-medium">
        Stock:{" "}
        {product.inventory.reduce(
          (total, item) => total + Number(item.stock || 0),
          0
        )}
      </span>
    </div>

    <div className="flex flex-wrap gap-2">
      {product.inventory.map((item) => (
        <div
          key={item.size}
          className="flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5"
        >
          <span className="text-xs font-bold text-gray-700">
            {item.size}
          </span>

          <span className="text-gray-300">•</span>

          <span
            className={`text-xs font-semibold ${
              Number(item.stock) === 0
                ? "text-red-500"
                : Number(item.stock) <= 5
                ? "text-orange-500"
                : "text-green-600"
            }`}
          >
            {item.stock}
          </span>
        </div>
      ))}
    </div>

  </div>
)}

        {/* ACTIONS */}
        <div className="mt-5 space-y-2.5 pb-1">
            {/* EDIT PRODUCT */}
<button
  type="button"
  onClick={onEdit}
  className="
    flex w-full items-center gap-4
    rounded-xl border border-slate-200
    bg-white px-4 py-3 text-left
    font-semibold text-blue-600
    hover:bg-slate-50
  "
>
  <Edit size={20} />
  <span>Edit Product</span>
</button>
{/* ADD SIMILAR PRODUCTS */}

<button
  type="button"
  onClick={() => {
  onAddSimilarProducts?.();
}}
  className="
    flex w-full items-center gap-4
    rounded-xl border border-slate-200
    bg-white px-4 py-3 text-left
    font-semibold text-purple-600
    hover:bg-slate-50
  "
>
  <Package size={20} />
  <span>Add Similar Products</span>
</button>

          {/* UPDATE DISCOUNT */}
          <button
            type="button"
            onClick={onUpdateDiscount}
            className="
              flex w-full items-center gap-4
              rounded-xl border border-slate-200
              bg-white px-4 py-3 text-left
              font-semibold text-blue-600
              hover:bg-slate-50
            "
          >
            <Percent size={20} />
            <span>Update Discount</span>
          </button>

          {/* UPDATE INVENTORY */}
          <button
            type="button"
            onClick={onUpdateInventory}
            className="
              flex w-full items-center gap-4
              rounded-xl border border-slate-200
              bg-white px-4 py-3 text-left
              font-semibold text-blue-600
              hover:bg-slate-50
            "
          >
            <Package size={20} />
            <span>Update Inventory</span>
          </button>

          {/* MANAGE MEDIA */}
          <button
            type="button"
            onClick={onManageMedia}
            className="
              flex w-full items-center gap-4
              rounded-xl border border-slate-200
              bg-white px-4 py-3 text-left
              font-semibold text-emerald-600
              hover:bg-slate-50
            "
          >
            <Circle size={20} />
            <span>Manage Media</span>
          </button>

          {/* ARCHIVE */}
          <button
            type="button"
            onClick={onArchive}
            className="
              flex w-full items-center gap-4
              rounded-xl border border-slate-200
              bg-white px-4 py-3 text-left
              font-semibold text-orange-500
              hover:bg-slate-50
            "
          >
            <Archive size={20} />
            <span>Archive Product</span>
          </button>

          {/* DELETE */}
          {userRole === "owner" && (
  <button
    type="button"
    onClick={onDelete}
    className="
      flex w-full items-center gap-4
      rounded-xl border border-slate-200
      bg-white px-4 py-3 text-left
      font-semibold text-red-600
      hover:bg-red-50
    "
  >
    <Trash2 size={20} />
    <span>Delete Product</span>
  </button>
)}

{/* BARCODE + QR */}
<div className="grid grid-cols-2 gap-3">
  {/* BARCODE */}
  <button
    type="button"
    onClick={() => setShowBarcode(true)}
    className="
      flex items-center justify-center gap-2
      rounded-xl
      border border-purple-200
      bg-purple-50
      px-4 py-3
      text-sm font-semibold text-purple-600
      hover:bg-purple-100
    "
  >
    <span className="text-xl">▥</span>
    <span>Barcode</span>
  </button>

  {/* QR */}
  <button
    type="button"
    onClick={() => setShowQR(true)}
    className="
      flex items-center justify-center gap-2
      rounded-xl
      border border-green-200
      bg-green-50
      px-4 py-3
      text-sm font-semibold text-green-600
      hover:bg-green-100
    "
  >
    <span className="text-xl">▦</span>
    <span>QR Code</span>
  </button>
</div>

        </div>
      </div>

      {showBarcode && (
        
  <div
    className="
      fixed inset-0 z-[60]
      flex items-center justify-center
      bg-black/50
      px-4
    "
    onClick={() => setShowBarcode(false)}
  >
    <div
      className="
        w-full max-w-sm
        rounded-2xl
        bg-white
        p-6
        shadow-2xl
      "
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">
          Product Barcode
        </h3>

        <button
          type="button"
          onClick={() => setShowBarcode(false)}
          className="text-slate-500 hover:text-black"
        >
          <X size={20} />
        </button>
      </div>

      <p className="mt-2 text-sm text-slate-500">
        {product.topic}
      </p>

      <div
      ref={barcodeContainerRef} 
      className="barcode-print-area mt-6 flex justify-center overflow-hidden">
        <Barcode
          value={product.postId}
          format="CODE128"
          width={2}
          height={80}
          displayValue={true}
        />
      </div>

      <p className="mt-3 text-center text-sm font-semibold text-slate-700">
        Product ID: {product.postId}
      </p>

<button
  type="button"
  onClick={handleDownloadBarcode}
  className="
    mt-5
    w-full
    rounded-xl
    bg-blue-600
    px-4
    py-3
    text-sm
    font-semibold
    text-white
    hover:bg-blue-700
  "
>
  Download Barcode
</button>
      <button
        type="button"
        onClick={() => setShowBarcode(false)}
        className="
          mt-5
          w-full
          rounded-xl
          bg-blue-600
          px-4
          py-3
          text-sm
          font-semibold
          text-white
          hover:bg-blue-700
        "
      >
        Close
      </button>
    </div>
  </div>
)}

{showQR &&
  createPortal(
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/50
        px-4 py-6
      "
      onClick={() => setShowQR(false)}
    >
      <div
        className="
          w-full max-w-sm
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          bg-white
          p-6
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Product QR Code
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Scan to view this product
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowQR(false)}
            className="
              rounded-lg
              px-2 py-1
              text-slate-500
              hover:bg-slate-100
              hover:text-slate-900
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* QR */}
        <div className="qr-print-area mt-6 flex justify-center">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <QRCodeSVG
            ref={qrRef}
              value={`https://thover.in/products/details?postId=${product._id}`}
              size={220}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        {/* PRINT */}
        <button
  type="button"
  onClick={handleDownloadQR}
  className="
    mt-5
    w-full
    rounded-xl
    bg-blue-600
    px-4 py-3
    text-sm font-semibold
    text-white
    hover:bg-blue-700
  "
>
  Download QR
</button>

        {/* CLOSE */}
        <button
          type="button"
          onClick={() => setShowQR(false)}
          className="
            mt-3
            w-full
            rounded-xl
            border border-slate-200
            bg-white
            px-4 py-3
            text-sm font-semibold
            text-slate-700
            hover:bg-slate-50
          "
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  )}
    </div>
  );
}