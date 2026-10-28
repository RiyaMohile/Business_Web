"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export default function SearchCategory({
  value,
  onChange,
  onSearch,
}: Props) {
  return (
    <div className="mt-8 flex gap-4">

      <div className="relative flex-1">

        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={value}
          placeholder="Search Category or Sub Category..."
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          className="w-full bg-white border border-gray-300 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
        />

      </div>

      <button
        onClick={onSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl transition"
      >
        Search
      </button>

    </div>
  );
}