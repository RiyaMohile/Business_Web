"use client";

import { useState } from "react";

import {
  MessageCircle,
  Printer,
  ReceiptText,
} from "lucide-react";

interface BillSummaryProps {
  totalItems: number;
  subtotal: number;
  discount?: number;

  onGenerateBill?: () => Promise<boolean>;
  onPrintBill?: () => void;
  onSendWhatsApp?: () => void;

  isGenerating?: boolean;
  disabled?: boolean;
}

export default function BillSummary({
  totalItems,
  subtotal,
  discount = 0,
  onGenerateBill,
  onPrintBill,
  onSendWhatsApp,
  isGenerating = false,
  disabled = false,
}: BillSummaryProps) {
 const total = Math.max(
  subtotal - discount,
  0
);

const [showBillActions, setShowBillActions] = useState(false);

const isDisabled =
  disabled || totalItems === 0;

    

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3.5">
        <ReceiptText
          size={18}
          className="text-violet-600"
        />

        <h2 className="text-sm font-bold text-slate-800">
          Bill Summary
        </h2>
      </div>

      {/* ==========================================
          SUMMARY
      ========================================== */}
      <div className="px-4 py-4">

        {/* Total Items */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Items
          </span>

          <span className="text-sm font-semibold text-slate-700">
            {totalItems}
          </span>
        </div>

        {/* Subtotal */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Subtotal
          </span>

          <span className="text-sm font-semibold text-slate-700">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        {/* Discount */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Discount
          </span>

          <span
            className={
              discount > 0
                ? "text-sm font-semibold text-emerald-600"
                : "text-sm font-semibold text-slate-700"
            }
          >
            {discount > 0 ? "-" : ""}₹
            {discount.toFixed(2)}
          </span>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-dashed border-slate-200" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-slate-800">
            Total
          </span>

          <span className="text-xl font-bold text-violet-600">
            ₹{total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* ==========================================
          ACTION BUTTONS
      ========================================== */}
      <div className="border-t border-slate-100 px-4 py-4">

        {/* Generate Bill */}
        <button
          type="button"
          disabled={isDisabled || isGenerating}
          onClick={async () => {
  const success = await onGenerateBill?.();

  if (success) {
    setShowBillActions(true);
  }
}}
          className="
            flex
            h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-violet-600
            px-4
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-violet-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <ReceiptText
            size={17}
            strokeWidth={2}
          />

          {isGenerating
            ? "Generating Bill..."
            : "Generate Bill"}
        </button>

      </div>

      {showBillActions && (
  <div
    className="
      fixed inset-0 z-[9999]
      flex items-center justify-center
      bg-black/50
      px-4
    "
    onClick={() => setShowBillActions(false)}
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
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-900">
          Bill Generated
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          What would you like to do with the bill?
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">

        {/* PRINT BILL */}
        <button
          type="button"
          onClick={() => {
            setShowBillActions(false);
            onPrintBill?.();
          }}
          className="
            flex h-12
            items-center justify-center
            gap-2
            rounded-xl
            border border-slate-200
            bg-white
            text-sm font-semibold
            text-slate-700
            hover:bg-slate-50
          "
        >
          <Printer size={18} />
          Print Bill
        </button>

        {/* WHATSAPP */}
        <button
          type="button"
          onClick={() => {
            setShowBillActions(false);
            onSendWhatsApp?.();
          }}
          className="
            flex h-12
            items-center justify-center
            gap-2
            rounded-xl
            bg-emerald-500
            text-sm font-semibold
            text-white
            hover:bg-emerald-600
          "
        >
          <MessageCircle size={18} />
          WhatsApp
        </button>

      </div>

      <button
        type="button"
        onClick={() => setShowBillActions(false)}
        className="
          mt-3
          w-full
          rounded-xl
          border border-slate-200
          px-4 py-2.5
          text-sm font-semibold
          text-slate-500
          hover:bg-slate-50
        "
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}