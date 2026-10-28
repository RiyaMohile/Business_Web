"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export default function WalletSearch({
  value,
  onChange,
  onSearch,
}: Props) {
  return (
    <div className="mt-8 flex gap-4">

      <div className="relative flex-1">

        <Search
          size={20}
          className="absolute left-4 top-4 text-gray-400"
        />

        <input
          placeholder="Search Wallet Name..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-xl pl-12 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      <button
        onClick={onSearch}
        className="bg-blue-700 hover:bg-blue-800 text-white px-8 rounded-xl transition"
      >
        Search
      </button>

    </div>
  );
}