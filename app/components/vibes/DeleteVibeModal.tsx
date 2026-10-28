"use client";

interface Vibe {
  _id: string;
  topic: string;
  text: string;
  rating: number;
  likes: any[];
  media: {
    mediaUrl: string;
    mediaName: string;
  }[];
}

interface DeleteVibeModalProps {
  open: boolean;
  vibe: Vibe | null;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteVibeModal({
  open,
  vibe,
  onClose,
  onDelete,
}: DeleteVibeModalProps) {
  if (!open || !vibe) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-[500px] p-8">

        <h2 className="text-2xl font-bold text-red-600">
          Delete Vibe
        </h2>

        <p className="text-gray-500 mt-3">
          Are you sure you want to permanently delete this vibe?
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mt-6">

          <p className="font-semibold">
            {vibe.topic || "No Topic"}
          </p>

          <p className="text-gray-600 mt-2">
            {vibe.text}
          </p>

          <div className="flex items-center gap-5 mt-5 text-sm text-gray-500">

            <span>
              ⭐ Rating : {vibe.rating || 0}
            </span>

            <span>
              ❤️ Likes : {vibe.likes?.length || 0}
            </span>

            <span>
              🖼 Media : {vibe.media?.length || 0}
            </span>

          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}