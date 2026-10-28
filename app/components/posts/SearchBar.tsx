"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onReports: () => void;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onReports,
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
      placeholder="Search posts..."
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSearch();
        }
      }}
      className="w-full bg-white border border-gray-300 rounded-xl pl-12 pr-4 py-3 outline-none"
    />

  </div>

  <button
    onClick={onSearch}
    className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl"
  >
    Search
  </button>

  <button
    onClick={onReports}
    className="bg-red-600 hover:bg-red-700 text-white px-8 rounded-xl whitespace-nowrap"
  >
    Post Reports
  </button>

</div>
  );
}