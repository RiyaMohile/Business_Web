"use client";

import {
  Archive,
  ArchiveRestore,
  X,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";

interface ProductPost {
  _id: string;
  topic: string;
  isArchived?: boolean;
}

interface Props {
  post: ProductPost;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ArchiveProductModal({
  post,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  // Check current state
  const isArchived = post.isArchived === true;

  const handleToggleArchive = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const { data } = await axios.patch(
        `https://api.thover.in/v1/api/post/toggle-archive/${post._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ARCHIVE RESPONSE:", data);

      if (data.success) {
        alert(
          data.message ||
            (isArchived
              ? "Product unarchived successfully!"
              : "Product archived successfully!")
        );

        onSuccess();
      } else {
        alert(
          data.message ||
            (isArchived
              ? "Failed to unarchive product."
              : "Failed to archive product.")
        );
      }
    } catch (error: any) {
      console.error(
        "ARCHIVE PRODUCT ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          (isArchived
            ? "Failed to unarchive product."
            : "Failed to archive product.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[60]
        flex
        items-center
        justify-center
        bg-black/50
        px-4
        py-6
      "
      onClick={onClose}
    >
      <div
        className="
          relative
          w-full
          max-w-md
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          bg-white
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="
            absolute
            right-5
            top-5
            z-10
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            text-gray-500
            transition
            hover:bg-gray-100
            hover:text-gray-800
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <X size={22} />
        </button>

        {/* CONTENT */}
        <div className="px-7 py-8 sm:px-8">

          {/* ICON */}
          <div
            className={`
              mx-auto
              mb-6
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              ${
                isArchived
                  ? "bg-blue-50"
                  : "bg-orange-100"
              }
            `}
          >
            {isArchived ? (
              <ArchiveRestore
                size={36}
                className="text-blue-600"
              />
            ) : (
              <Archive
                size={36}
                className="text-orange-600"
              />
            )}
          </div>

          {/* TITLE */}
          <h2
            className="
              text-center
              text-2xl
              font-bold
              text-gray-900
            "
          >
            {isArchived
              ? "Unarchive Product?"
              : "Archive Product?"}
          </h2>

          {/* DESCRIPTION */}
          <p
            className="
              mt-3
              text-center
              text-sm
              leading-6
              text-gray-500
            "
          >
            {isArchived
              ? "Are you sure you want to unarchive"
              : "Are you sure you want to archive"}{" "}
            <span className="font-semibold text-gray-800">
              "{post.topic}"
            </span>
            ?
          </p>

          {/* WARNING / INFO BOX */}
          <div
            className={`
              mt-6
              flex
              gap-3
              rounded-xl
              border
              p-4
              ${
                isArchived
                  ? "border-blue-200 bg-blue-50"
                  : "border-orange-200 bg-orange-50"
              }
            `}
          >
            <AlertTriangle
              size={21}
              className={`
                mt-0.5
                shrink-0
                ${
                  isArchived
                    ? "text-blue-600"
                    : "text-orange-500"
                }
              `}
            />

            <p
              className={`
                text-sm
                leading-6
                ${
                  isArchived
                    ? "text-blue-700"
                    : "text-orange-700"
                }
              `}
            >
              {isArchived
                ? "This product will be moved back to your active products and will become available again."
                : "This product will be moved to your archived products. You can unarchive it later."}
            </p>
          </div>

          {/* BUTTONS */}
          <div className="mt-7 flex gap-3">

            {/* CANCEL */}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                flex-1
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                font-semibold
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            {/* ARCHIVE / UNARCHIVE */}
            <button
              type="button"
              onClick={handleToggleArchive}
              disabled={loading}
              className={`
                flex-1
                rounded-xl
                px-4
                py-3
                font-semibold
                text-white
                transition
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${
                  isArchived
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-orange-500 hover:bg-orange-600"
                }
              `}
            >
              {loading
                ? isArchived
                  ? "Unarchiving..."
                  : "Archiving..."
                : isArchived
                ? "Yes, Unarchive"
                : "Yes, Archive"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}