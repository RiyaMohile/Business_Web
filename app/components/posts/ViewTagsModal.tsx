"use client";

interface Props {
  open: boolean;
  tags: string[];
  onClose: () => void;
}

export default function ViewTagsModal({
  open,
  tags,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-[500px] p-8">

        <div className="flex justify-between items-center">

          <h2 className="text-2xl font-bold">
            All Tags
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black cursor-pointer"
          >
            ×
          </button>

        </div>

        <div className="flex flex-wrap gap-3 mt-6 max-h-[350px] overflow-y-auto">

          {tags.length === 0 ? (

            <p className="text-gray-500">
              No Tags Available
            </p>

          ) : (

            tags.map((tag, index) => (

              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-sm"
              >
                #{tag}
              </span>

            ))

          )}

        </div>

        <div className="flex justify-end mt-8">

          <button
            onClick={onClose}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-xl cursor-pointer"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}