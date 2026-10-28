"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface ProductPost {
  _id: string;
  topic: string;
  description?: string;

  price?: {
    currency?: string;
    amount?: number;
    priceType?: string;
  };

  area?: string;
}

interface EditPostModalProps {
  post: ProductPost;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditPostModal({
  post,
  onClose,
  onSuccess,
}: EditPostModalProps) {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");

  const [currency, setCurrency] = useState("INR");
  const [amount, setAmount] = useState("");
  const [priceType, setPriceType] = useState("fixed");

  const [area, setArea] = useState("");

  const [loading, setLoading] = useState(false);

  // Fill existing post data
  useEffect(() => {
    setTopic(post.topic || "");
    setDescription(post.description || "");

    setCurrency(post.price?.currency || "INR");

    setAmount(
      post.price?.amount !== undefined
        ? String(post.price.amount)
        : "",
    );

    setPriceType(post.price?.priceType || "fixed");

    setArea(post.area || "");
  }, [post]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      // Only fields allowed by backend
      const payload = {
        topic: topic.trim(),

        description: description.trim(),

        price: {
          currency,
          amount: Number(amount),
          priceType,
        },

        area: area.trim(),
      };

      console.log("UPDATE POST PAYLOAD:", payload);

      const { data } = await axios.patch(
        `https://api.thover.in/v1/api/post/update-post/${post._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("UPDATE POST RESPONSE:", data);

      if (data.success) {
        alert("Product updated successfully!");

        onSuccess();
        onClose();
      } else {
        alert(
          data.message ||
            "Failed to update product.",
        );
      }
    } catch (error: any) {
      console.error("UPDATE POST ERROR:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update product.",
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
            <h2 className="text-2xl font-bold">
              Edit Product
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Update your product details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-black text-2xl"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* PRODUCT NAME */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Name
            </label>

            <input
              type="text"
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Product name"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3 min-h-[120px]"
              placeholder="Product description"
              required
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Price
            </label>

            <div className="grid grid-cols-3 gap-3">

              {/* CURRENCY */}
              <select
                value={currency}
                onChange={(e) =>
                  setCurrency(e.target.value)
                }
                className="border rounded-xl px-4 py-3"
              >
                <option value="INR">
                  INR
                </option>
              </select>

              {/* AMOUNT */}
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                className="border rounded-xl px-4 py-3"
                placeholder="Amount"
                required
              />

              {/* PRICE TYPE */}
              <select
                value={priceType}
                onChange={(e) =>
                  setPriceType(e.target.value)
                }
                className="border rounded-xl px-4 py-3"
              >
                <option value="fixed">
                  Fixed
                </option>
              </select>

            </div>
          </div>

          {/* AREA */}
          {/* <div>
            <label className="block text-sm font-medium mb-2">
              Area
            </label>

            <input
              type="text"
              value={area}
              onChange={(e) =>
                setArea(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Area"
            />
          </div> */}

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 border rounded-xl"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Updating..."
                : "Update Product"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}