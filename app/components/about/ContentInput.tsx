"use client";

import { Trash2 } from "lucide-react";

export default function ContentInput() {
  return (
    <div className="flex items-start gap-3">

      <textarea
        rows={2}
        placeholder="Enter content..."
        className="flex-1 border border-gray-300 rounded-xl p-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 resize-none"
      />

      <button
        type="button"
        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition mt-1"
      >
        <Trash2 size={18} />
      </button>

    </div>
  );
}