"use client";

import ContentInput from "./ContentInput";

export default function SectionCard() {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 mt-6 bg-gray-50">

      <div className="flex justify-between items-center">

        <h3 className="text-xl font-semibold">
          Section 1
        </h3>

        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
          Remove Section
        </button>

      </div>

      {/* Point */}

      <div className="mt-6">

        <label className="block font-medium mb-2">
          Point Number
        </label>

        <input
          type="number"
          placeholder="1"
          className="w-full border rounded-xl p-3"
        />

      </div>

      {/* Title */}

      <div className="mt-6">

        <label className="block font-medium mb-2">
          Section Title
        </label>

        <input
          type="text"
          placeholder="Introduction"
          className="w-full border rounded-xl p-3"
        />

      </div>

      {/* Description */}

      <div className="mt-6">

        <label className="block font-medium mb-2">
          Description
        </label>

        <textarea
          rows={4}
          placeholder="Write section description..."
          className="w-full border rounded-xl p-3"
        />

      </div>

      {/* Content */}

      <div className="mt-8">

        <div className="flex justify-between items-center">

          <h4 className="text-lg font-semibold">
            Content
          </h4>

          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            + Add Content
          </button>

        </div>

        <div className="space-y-4 mt-5">

          <ContentInput />

          <ContentInput />

        </div>

      </div>

    </div>
  );
}