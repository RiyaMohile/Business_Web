"use client";

import { Trash2, Eye } from "lucide-react";

interface Category {
  _id: string;
  category: string;
  subCategory: string;
  examples: string[];
}

interface Props {
  category: Category;
  onDelete: (category: Category) => void;
  onViewExamples: (category: Category) => void;
}

export default function CategoryRow({
  category,
  onDelete,
  onViewExamples,
}: Props) {
  return (
    <tr className="hover:bg-gray-50">

      {/* Category */}

      <td className="p-4">

        <div className="font-semibold text-gray-800">
          {category.category}
        </div>

      </td>

      {/* Sub Category */}

      <td>

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
          {category.subCategory}
        </span>

      </td>

      {/* Examples */}

      <td className="text-center">

        <button
  onClick={() => onViewExamples(category)}
  className="inline-flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition"
>
  <Eye size={16} />
  {category.examples.length} Examples
</button>

      </td>

      {/* Actions */}

      <td>

        <div className="flex justify-center">

          <button
            onClick={() => onDelete(category)}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-2 transition"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </td>

    </tr>
  );
}