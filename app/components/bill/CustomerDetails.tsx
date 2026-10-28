"use client";

import { Phone, X } from "lucide-react";

interface CustomerDetailsProps {
  phone: string;
  onPhoneChange: (phone: string) => void;
}

export default function CustomerDetails({
  phone,
  onPhoneChange,
}: CustomerDetailsProps) {
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Sirf numbers allow karo
    const value = e.target.value.replace(/\D/g, "");

    // Maximum 15 digits
    if (value.length <= 15) {
      onPhoneChange(value);
    }
  };

  const handleClear = () => {
    onPhoneChange("");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

      {/* ==========================================
          HEADER
      ========================================== */}
      <h2 className="mb-3 text-sm font-bold text-slate-800">
        Customer Details
      </h2>

      {/* ==========================================
          PHONE INPUT
      ========================================== */}
      <div className="relative">

        {/* Phone Icon */}
        <Phone
          size={18}
          strokeWidth={2}
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-slate-500
          "
        />

        <input
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="Customer phone number"
          className="
            h-11
            w-full
            rounded-lg
            border
            border-slate-200
            bg-white
            pl-10
            pr-10
            text-sm
            text-slate-700
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-violet-500
            focus:ring-2
            focus:ring-violet-100
          "
        />

        {/* Clear Button */}
        {phone.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            title="Clear phone number"
            className="
              absolute
              right-2
              top-1/2
              flex
              h-8
              w-8
              -translate-y-1/2
              items-center
              justify-center
              rounded-md
              text-slate-400
              transition
              hover:bg-slate-50
              hover:text-slate-600
            "
          >
            <X size={17} />
          </button>
        )}
      </div>

      {/* ==========================================
          HELPER TEXT
      ========================================== */}
      <p className="mt-2 text-[11px] text-slate-400">
        Enter customer phone number to send the bill
        on WhatsApp.
      </p>
    </div>
  );
}