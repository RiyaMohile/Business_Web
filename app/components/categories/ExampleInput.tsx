"use client";

import { Trash2 } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export default function ExampleInput({
  value,
  onChange,
  onRemove,
}: Props) {
  return (
    <div className="flex items-center gap-3">

      <input
        type="text"
        value={value}
        placeholder="Enter example"
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
      />

      <button
        type="button"
        onClick={onRemove}
        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition"
      >
        <Trash2 size={18} />
      </button>

    </div>
  );
}