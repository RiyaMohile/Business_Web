"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface ProductPost {
  _id: string;
  topic: string;

  discount?: {
    title?: string;
    expiry?: string | Date;
    type?: "percentage" | "flat";
    value?: number;
  };
}

interface Props {
  post: ProductPost;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateDiscountModal({
  post,
  onClose,
  onSuccess,
}: Props) {
  const [title, setTitle] = useState("");
  const [expiry, setExpiry] = useState("");
  const [type, setType] = useState<"percentage" | "flat">(
    "percentage"
  );
  const [value, setValue] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================================
  // FILL EXISTING DISCOUNT DATA
  // ==========================================

  useEffect(() => {
    console.log("UPDATE DISCOUNT POST:", post);
    console.log("EXISTING DISCOUNT:", post?.discount);

    if (!post?.discount) {
      setTitle("");
      setExpiry("");
      setType("percentage");
      setValue("");
      return;
    }

    // Title
    setTitle(post.discount.title ?? "");

    // Type
    setType(
      post.discount.type === "flat"
        ? "flat"
        : "percentage"
    );

    // Value
    setValue(
      post.discount.value !== undefined &&
        post.discount.value !== null
        ? String(post.discount.value)
        : ""
    );

    // Expiry
    if (post.discount.expiry) {
      const date = new Date(post.discount.expiry);

      if (!isNaN(date.getTime())) {
        // <input type="date"> needs YYYY-MM-DD
        const formattedDate =
          date.toISOString().split("T")[0];

        setExpiry(formattedDate);
      } else {
        setExpiry("");
      }
    } else {
      setExpiry("");
    }
  }, [post]);

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      if (!title.trim()) {
        alert("Please enter discount title.");
        return;
      }

      if (!expiry) {
        alert("Please select expiry date.");
        return;
      }

      if (!value || Number(value) <= 0) {
        alert("Please enter a valid discount value.");
        return;
      }

      const payload = {
        title: title.trim(),
        expiry: new Date(
          `${expiry}T23:59:59.000Z`
        ).toISOString(),
        type,
        value: Number(value),
      };

      console.log(
        "UPDATE DISCOUNT PAYLOAD:",
        payload
      );

      const { data } = await axios.patch(
        `https://api.thover.in/v1/api/post/update-discount/${post._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "UPDATE DISCOUNT RESPONSE:",
        data
      );

      if (data.success) {
        alert("Discount updated successfully!");

        onSuccess();
      } else {
        alert(
          data.message ||
            "Failed to update discount."
        );
      }
    } catch (error: any) {
      console.error(
        "UPDATE DISCOUNT ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update discount."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[60]
        bg-black/50
        flex items-center justify-center
        p-4
      "
    >
      <div
        className="
          bg-white
          w-full
          max-w-lg
          rounded-2xl
          shadow-xl
          overflow-hidden
        "
      >
        {/* HEADER */}

        <div className="flex justify-between items-start px-6 py-5 border-b">
          <div>
            <h2 className="text-xl font-bold">
              Update Discount
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Update discount details for this product.
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

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >
          {/* TITLE */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Discount Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="20% Off"
              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-purple-500
              "
              required
            />
          </div>

          {/* EXPIRY */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Expiry
            </label>

            <input
              type="date"
              value={expiry}
              onChange={(e) =>
                setExpiry(e.target.value)
              }
              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-purple-500
              "
              required
            />
          </div>

          {/* TYPE */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Discount Type
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as
                    | "percentage"
                    | "flat"
                )
              }
              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-purple-500
              "
            >
              <option value="percentage">
                Percentage
              </option>

              <option value="flat">
                Flat
              </option>
            </select>
          </div>

          {/* VALUE */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Discount Value
            </label>

            <input
              type="number"
              value={value}
              onChange={(e) =>
                setValue(e.target.value)
              }
              placeholder="20"
              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-purple-500
              "
              required
            />
          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                px-5
                py-2.5
                border
                rounded-xl
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                px-5
                py-2.5
                bg-purple-600
                text-white
                rounded-xl
              "
            >
              {loading
                ? "Updating..."
                : "Update Discount"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}