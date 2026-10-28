"use client";

interface PostType {
  _id: string;
  topic: string;
}

interface Props {
  open: boolean;
  post: PostType | null;

  action: "addTag" | "updateTag" | null;

  tag: string;
  setTag: (value: string) => void;

  tags: string;
  setTags: (value: string) => void;

  onClose: () => void;

  onAddTag: () => void;
  onUpdateTags: () => void;
}

export default function TagModal({
  open,
  post,
  action,
  tag,
  setTag,
  tags,
  setTags,
  onClose,
  onAddTag,
  onUpdateTags,
}: Props) {
  if (!open || !post) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-[520px] p-8">

        <h2 className="text-2xl font-bold">

          {action === "addTag"
            ? "Add Tag"
            : "Update Tags"}

        </h2>

        <p className="text-gray-500 mt-2">

          {post.topic}

        </p>

        {action === "addTag" ? (

          <>

            <label className="block mt-6 font-medium">
              New Tag
            </label>

            <input
              type="text"
              placeholder="Example : Electronics"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full border rounded-xl mt-2 p-3 outline-none"
            />

          </>

        ) : (

          <>

            <label className="block mt-6 font-medium">
              Tags
            </label>

            <textarea
              placeholder="Food, Restaurant, Cafe"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full border rounded-xl mt-2 p-4 h-36 resize-none outline-none"
            />

            <p className="text-sm text-gray-400 mt-2">
              Separate multiple tags using commas.
            </p>

          </>

        )}

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="bg-gray-200 px-6 py-2 rounded-xl cursor-pointer"
          >
            Cancel
          </button>

          {action === "addTag" ? (

            <button
              onClick={onAddTag}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl cursor-pointer"
            >
              Add Tag
            </button>

          ) : (

            <button
              onClick={onUpdateTags}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl cursor-pointer"
            >
              Update Tags
            </button>

          )}

        </div>

      </div>

    </div>
  );
}