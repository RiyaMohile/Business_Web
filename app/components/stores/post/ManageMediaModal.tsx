"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Media {
  _id?: string;
  mediaName?: string;
  mediaUrl?: string;
  mediaPath?: string;
  isDeleted?: boolean;
}

interface ProductPost {
  _id: string;
  topic: string;
  media?: Media[];
}

interface Props {
  post: ProductPost;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ManageMediaModal({
  post,
  onClose,
  onSuccess,
}: Props) {
  const [mediaName, setMediaName] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaPath, setMediaPath] = useState("");

  const [media, setMedia] = useState<Media[]>([]);

  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    setMedia(
      post.media?.filter(
        (item) => !item.isDeleted
      ) || []
    );
  }, [post]);

  // =========================
  // ADD MEDIA
  // =========================

const handleAddMedia = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  if (selectedFiles.length === 0) {
    alert("Please select at least one image.");
    return;
  }

  // Existing + new images maximum 5
  if (media.length + selectedFiles.length > 5) {
    alert(
      `You can add maximum 5 images. Currently ${media.length} image(s) already exist.`
    );
    return;
  }

  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    // Upload each image
    for (const file of selectedFiles) {
      const formData = new FormData();

      formData.append("media", file);

      const { data } = await axios.post(
        `https://api.thover.in/v1/api/post/add-media/${post._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ADD MEDIA RESPONSE:", data);

      if (!data.success) {
        throw new Error(
          data.message || "Failed to upload image."
        );
      }
    }

    alert("Media added successfully!");

    setSelectedFiles([]);

    onSuccess();

  } catch (error: any) {
    console.error(
      "ADD MEDIA ERROR:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
      error.message ||
      "Failed to add media."
    );

  } finally {
    setLoading(false);
  }
};

  // =========================
  // DELETE MEDIA
  // =========================

  const handleDeleteMedia = async (mediaId: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this media?"
  );

  if (!confirmed) return;

  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    const { data } = await axios.delete(
      `https://api.thover.in/v1/api/post/delete-media/${post._id}/${mediaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("DELETE MEDIA RESPONSE:", data);

    if (data.success) {
      // IMPORTANT:
      // Remove deleted media immediately from UI
      setMedia((prevMedia) =>
        prevMedia.filter((item) => item._id !== mediaId)
      );

      alert("Media deleted successfully!");

      // Refresh parent data
      onSuccess();
    } else {
      alert(data.message || "Failed to delete media.");
    }
  } catch (error: any) {
    console.error(
      "DELETE MEDIA ERROR:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
        "Failed to delete media."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-xl font-bold">
              Manage Media
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {post.topic}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>

        {/* EXISTING MEDIA */}

        <div className="p-6">

          <h3 className="font-semibold mb-4">
            Existing Media
          </h3>

          {media.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No media found.
            </p>
          ) : (
            <div className="space-y-3">
              {media.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex items-center gap-4 border rounded-xl p-3"
                >

                  {item.mediaUrl && (
                    <img
                      src={item.mediaUrl}
                      alt={item.mediaName || "Product"}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {item.mediaName}
                    </p>

                    {/* <p className="text-xs text-gray-500 truncate">
                      {item.mediaUrl}
                    </p> */}
                  </div>

                  {item._id && (
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteMedia(
                          item._id!
                        )
                      }
                      className="text-red-600 text-sm font-medium"
                    >
                      Delete
                    </button>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

        {/* ADD MEDIA */}

        {/* ADD MEDIA */}

<form
  onSubmit={handleAddMedia}
  className="px-6 pb-6"
>
  <h3 className="font-semibold text-lg mb-4">
    Add New Media
  </h3>

  {/* IMAGE PICKER */}
  {/* IMAGE PICKER */}

<div>
  <label className="block text-sm font-medium mb-2">
    Select Images
  </label>

  <label
    htmlFor="media-upload"
    className="
      flex
      min-h-[180px]
      w-full
      cursor-pointer
      flex-col
      items-center
      justify-center
      rounded-xl
      border-2
      border-dashed
      border-gray-300
      bg-gray-50
      px-4
      py-6
      text-center
      hover:border-blue-400
      hover:bg-blue-50
    "
  >
    {selectedFiles.length > 0 ? (
      <>
        {/* PREVIEW IMAGES */}

        <div className="grid grid-cols-3 gap-3 mb-4">
          {selectedFiles.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt={`Selected ${index + 1}`}
              className="
                h-20
                w-20
                rounded-xl
                object-cover
              "
            />
          ))}
        </div>

        <p className="text-sm font-medium text-gray-700">
          {selectedFiles.length} image
          {selectedFiles.length > 1 ? "s" : ""} selected
        </p>

        <p className="mt-1 text-xs text-gray-500">
          Click to change images
        </p>
      </>
    ) : (
      <>
        <div className="mb-3 text-4xl">
          📷
        </div>

        <p className="text-sm font-medium text-gray-700">
          Choose images
        </p>

        <p className="mt-1 text-xs text-gray-500">
          JPG, JPEG, PNG or WEBP — Maximum 5 images
        </p>
      </>
    )}
  </label>

  <input
    id="media-upload"
    type="file"
    accept="image/jpeg,image/jpg,image/png,image/webp"
    multiple
    className="hidden"
    onChange={(e) => {
      const files = Array.from(
        e.target.files || []
      );

      const totalAllowed =
        5 - media.length;

      if (files.length > totalAllowed) {
        alert(
          `You can select only ${totalAllowed} more image${
            totalAllowed !== 1 ? "s" : ""
          }.`
        );

        e.target.value = "";
        return;
      }

      setSelectedFiles(files);
    }}
  />
</div>

  {/* BUTTONS */}
  <div className="mt-5 flex justify-end gap-3 border-t pt-4">

    <button
      type="button"
      onClick={onClose}
      className="
        rounded-xl
        border
        px-5
        py-2.5
        text-gray-700
        hover:bg-gray-50
      "
    >
      Close
    </button>

    <button
      type="submit"
      disabled={
  loading ||
  selectedFiles.length === 0 ||
  media.length >= 5
}
      className="
        rounded-xl
        bg-green-600
        px-5
        py-2.5
        font-medium
        text-white
        hover:bg-green-700
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {loading ? "Uploading..." : "Add Media"}
    </button>

  </div>
</form>
      </div>
    </div>
  );
}