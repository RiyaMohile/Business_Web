"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";

interface ProductPost {
  _id: string;
  topic: string;
}

interface Props {
  post: ProductPost;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteProductModal({
  post,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const { data } = await axios.delete(
        `https://api.thover.in/v1/api/post/delete_post/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("DELETE PRODUCT RESPONSE:", data);

      if (data.success) {
        alert(data.message || "Product deleted successfully!");

        onSuccess();
      } else {
        alert(
          data.message || "Failed to delete product."
        );
      }
    } catch (error: any) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[70]
        flex items-center justify-center
        bg-black/50 px-4
      "
      onClick={onClose}
    >
      <div
        className="
          relative
          w-full max-w-md
          rounded-3xl
          bg-white
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="
            absolute right-5 top-5
            flex h-9 w-9
            items-center justify-center
            rounded-full
            text-gray-500
            hover:bg-gray-100
            hover:text-gray-800
            disabled:opacity-50
          "
        >
          <X size={20} />
        </button>

        {/* CONTENT */}
        <div className="px-6 py-7 sm:px-8 sm:py-8">

          {/* ICON */}
          <div
            className="
              mx-auto mb-5
              flex h-16 w-16
              items-center justify-center
              rounded-full
              bg-red-100
            "
          >
            <Trash2
              size={30}
              className="text-red-600"
            />
          </div>

          {/* TITLE */}
          <h2
            className="
              text-center
              text-xl
              font-bold
              text-gray-900
            "
          >
            Delete Product?
          </h2>

          {/* DESCRIPTION */}
          <p
            className="
              mt-2
              text-center
              text-sm
              leading-6
              text-gray-500
            "
          >
            Are you sure you want to permanently
            delete{" "}
            <span className="font-semibold text-gray-800">
              "{post.topic}"
            </span>
            ?
          </p>

          {/* WARNING */}
          <div
            className="
              mt-5
              flex gap-3
              rounded-2xl
              border border-red-200
              bg-red-50
              p-4
            "
          >
            <AlertTriangle
              size={21}
              className="
                mt-0.5
                shrink-0
                text-red-500
              "
            />

            <p
              className="
                text-sm
                leading-5
                text-red-700
              "
            >
              This action cannot be undone. The
              product and its information will be
              permanently deleted.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="mt-6 flex gap-3">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                flex-1
                rounded-xl
                border border-gray-200
                bg-white
                px-4 py-3
                font-semibold
                text-gray-700
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="
                flex-1
                rounded-xl
                bg-red-600
                px-4 py-3
                font-semibold
                text-white
                hover:bg-red-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Deleting..."
                : "Yes, Delete"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}