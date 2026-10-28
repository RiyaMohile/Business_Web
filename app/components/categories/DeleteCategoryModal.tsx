"use client";

interface Props {
  open: boolean;
  categoryName: string;
  subCategoryName: string;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteCategoryModal({
  open,
  categoryName,
  subCategoryName,
  onClose,
  onDelete,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-[500px] p-8">

        <h2 className="text-2xl font-bold text-red-600">
          Delete Category
        </h2>

        <p className="text-gray-500 mt-3">
          Are you sure you want to delete this category?
        </p>

        <div className="bg-gray-50 border rounded-xl p-5 mt-6">

          <div className="mb-4">

            <p className="text-sm text-gray-500">
              Category
            </p>

            <p className="text-lg font-semibold">
              {categoryName}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Sub Category
            </p>

            <p className="text-lg font-semibold">
              {subCategoryName}
            </p>

          </div>

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}