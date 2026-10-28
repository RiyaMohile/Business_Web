"use client";

interface PostType {
  _id: string;
  topic: string;
  description: string;
}

interface Props {
  open: boolean;
  action: "suspend" | "delete" | null;
  post: PostType | null;

  reason: string;
  setReason: (value: string) => void;

  onClose: () => void;

  onSuspend: () => void;
  onDelete: () => void;
}
type ModalAction = "suspend" | "delete";
interface Props {
  open: boolean;
  action: ModalAction | null;
  post: PostType | null;

  reason: string;
  setReason: (value: string) => void;

  onClose: () => void;

  onSuspend: () => void;
  onDelete: () => void;
}


export default function SuspendDeleteModal({
  open,
  action,
  post,
  reason,
  setReason,
  onClose,
  onSuspend,
  onDelete,
}: Props) {
  if (!open || !post) return null;



  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-[500px] p-8">

        {action === "suspend" ? (
          <>
            <h2 className="text-2xl font-bold">
              Suspend Post
            </h2>

            <p className="text-gray-500 mt-2">
              Topic :
              <span className="font-medium ml-2">
                {post.topic}
              </span>
            </p>

            <textarea
              placeholder="Reason for suspension..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-xl mt-6 p-4 h-32 resize-none outline-none"
            />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-red-600">
              Delete Post
            </h2>

            <p className="text-gray-500 mt-5">
              Are you sure you want to permanently delete this post?
            </p>

            <div className="bg-red-50 rounded-xl p-4 mt-5">

              <p className="font-semibold">
                {post.topic}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {post.description}
              </p>

            </div>
          </>
        )}

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-xl"
          >
            Cancel
          </button>

          {action === "suspend" ? (
            <button
              onClick={onSuspend}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-xl"
            >
              Suspend
            </button>
          ) : (
            <button
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl"
            >
              Delete
            </button>
          )}

        </div>

      </div>

    </div>
  );
}