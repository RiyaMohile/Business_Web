"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <div className="relative w-full">

      <Search
        size={20}
        className="absolute left-4 top-4 text-gray-400"
      />

      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full border border-gray-300 bg-white rounded-xl pl-12 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

    </div>
  );
}