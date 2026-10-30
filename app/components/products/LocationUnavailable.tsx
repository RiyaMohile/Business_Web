"use client";

import { MapPinOff } from "lucide-react";

interface LocationUnavailableProps {
  onChangeAddress?: () => void;
}

export default function LocationUnavailable({
  onChangeAddress,
}: LocationUnavailableProps) {
  return (
    <div className="mx-auto mt-10 flex max-w-md flex-col items-center rounded-2xl border border-[#EDE9FE] bg-white p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F4ECFF]">
        <MapPinOff size={36} className="text-[#6D28D9]" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#101828]">
        Not Available at Your Location
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        We&apos;re working hard to reach your location. We are not available
        here yet, but we&apos;ll be there soon.
      </p>

      {onChangeAddress && (
        <button
          type="button"
          onClick={onChangeAddress}
          className="mt-5 rounded-xl border border-[#6D28D9] px-5 py-2 text-sm font-semibold text-[#6D28D9] transition hover:bg-[#F4ECFF]"
        >
          Change Address
        </button>
      )}
    </div>
  );
}
