"use client";

interface Props {
  open: boolean;
  category: string;
  subCategory: string;
  examples: string[];
  onClose: () => void;
}

export default function ViewExamplesModal({
  open,
  category,
  subCategory,
  examples,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-[500px] p-8">

        <h2 className="text-2xl font-bold">
          Examples
        </h2>

        <p className="text-gray-500 mt-2">
          {category} / {subCategory}
        </p>

        <div className="mt-6 max-h-72 overflow-y-auto">

          {examples.length === 0 ? (

            <p className="text-gray-500">
              No examples available.
            </p>

          ) : (

            <div className="grid grid-cols-2 gap-3">

              {examples.map((item, index) => (

                <div
                  key={index}
                  className="bg-blue-50 text-blue-700 rounded-lg px-4 py-3"
                >
                  {item}
                </div>

              ))}

            </div>

          )}

        </div>

        <div className="flex justify-end mt-8">

          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}