"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface InventoryItem {
  size: string;
  stock: number;
}

interface ProductPost {
  _id: string;
  inventory?: InventoryItem[];
}

interface Props {
  post: ProductPost;
  onClose: () => void;
  onSuccess: () => void;
}

const SIZE_OPTIONS = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "Free Size",
  "Custom",
];

export default function UpdateInventoryModal({
  post,
  onClose,
  onSuccess,
}: Props) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [customSizeIndexes, setCustomSizeIndexes] = useState<Set<number>>(
  new Set()
);

  useEffect(() => {
  const existingInventory =
    post.inventory?.map((item) => ({
      size: item.size || "",
      stock: item.stock || 0,
    })) || [];

  setInventory(existingInventory);

  // Jo size standard list mein nahi hai,
  // usko Custom maana jayega.
  const customIndexes = new Set<number>();

  existingInventory.forEach((item, index) => {
    if (
      item.size &&
      !SIZE_OPTIONS.includes(item.size)
    ) {
      customIndexes.add(index);
    }

    // Old data mein agar "Custom" save hai
    // to bhi Custom UI show hoga.
    if (item.size === "Custom") {
      customIndexes.add(index);
    }
  });

  setCustomSizeIndexes(customIndexes);
}, [post]);

  const updateStock = (index: number, stock: number) => {
    setInventory((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, stock } : item
      )
    );
  };

 const updateSize = (index: number, size: string) => {
  setInventory((prev) =>
    prev.map((item, i) =>
      i === index
        ? {
            ...item,
            size,
          }
        : item
    )
  );
};

 const addSize = () => {
  setInventory((prev) => [
    ...prev,
    {
      size: "",
      stock: 0,
    },
  ]);
};

  const removeSize = (index: number) => {
    setInventory((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

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

    // ==============================
// CLEAN INVENTORY
// ==============================

const cleanInventory = inventory.map((item) => ({
  size: item.size.trim(),
  stock: Number(item.stock),
}));

// ==============================
// EMPTY SIZE VALIDATION
// ==============================

const invalidInventory = cleanInventory.some(
  (item) => !item.size
);

if (invalidInventory) {
  alert("Please select or enter a size for all inventory items.");
  return;
}

// ==============================
// DUPLICATE SIZE VALIDATION
// ==============================

const inventoryNames = cleanInventory.map(
  (item) => item.size.toLowerCase()
);

const hasDuplicate =
  new Set(inventoryNames).size !== inventoryNames.length;

if (hasDuplicate) {
  alert("Duplicate inventory sizes are not allowed.");
  return;
}

      const { data } = await axios.patch(
        `https://api.thover.in/v1/api/post/update-inventory/${post._id}`,
        {
          inventory: cleanInventory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "UPDATE INVENTORY RESPONSE:",
        data
      );

      if (data.success) {
        alert("Inventory updated successfully!");
        onSuccess();
      } else {
        alert(
          data.message ||
            "Failed to update inventory."
        );
      }
    } catch (error: any) {
      console.error(
        "UPDATE INVENTORY ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50
        p-3 sm:p-4
      "
      onClick={onClose}
    >
      {/* MODAL */}
      <div
        className="
          flex
          w-full
          max-w-lg
          max-h-[90vh]
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            px-5
            py-4
            sm:px-6
            sm:py-5
          "
        >
          <div>
            <h2 className="text-lg font-bold sm:text-xl">
              Update Inventory
            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Update size-wise stock.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              text-xl
              text-gray-500
              hover:bg-gray-100
              hover:text-gray-800
            "
          >
            ×
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <form
          onSubmit={handleSubmit}
          className="
            flex
            min-h-0
            flex-1
            flex-col
          "
        >
          {/* INVENTORY LIST */}
          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              px-5
              py-5
              sm:px-6
            "
          >
            {inventory.length === 0 ? (
              <div
                className="
                  rounded-xl
                  border
                  border-dashed
                  border-gray-300
                  px-4
                  py-8
                  text-center
                  text-sm
                  text-gray-500
                "
              >
                No inventory added yet.
              </div>
            ) : (
              <div className="space-y-3">
                {inventory.map((item, index) => (
                  <div
                    key={index}
                    
                  >
                    <div
                      className="
                        grid
                        grid-cols-[1fr_1fr_auto]
                        items-end
                        gap-2
                        sm:gap-3
                      "
                    >
                      {/* SIZE */}
                      <div className="min-w-0">
  <label
    className="
      mb-1.5
      block
      text-xs
      font-medium
      text-gray-600
    "
  >
    Size
  </label>

  <select
    value={
      customSizeIndexes.has(index)
        ? "Custom"
        : item.size
    }
    onChange={(e) => {
      const value = e.target.value;

      if (value === "Custom") {
        // Custom select kiya
        setCustomSizeIndexes((prev) => {
          const next = new Set(prev);
          next.add(index);
          return next;
        });

        // Custom size directly item.size mein jayega
        updateSize(index, "");
      } else {
        // Normal size select kiya
        setCustomSizeIndexes((prev) => {
          const next = new Set(prev);
          next.delete(index);
          return next;
        });

        updateSize(index, value);
      }
    }}
    required
    className="
      h-11
      w-full
      min-w-0
      appearance-none
      rounded-xl
      border
      border-gray-300
      bg-white
      px-3
      text-sm
      outline-none
      focus:border-blue-500
      focus:ring-2
      focus:ring-blue-100
    "
  >
    <option value="">Select</option>

    {SIZE_OPTIONS.map((size) => (
      <option key={size} value={size}>
        {size}
      </option>
    ))}
  </select>

  {/* CUSTOM SIZE INPUT */}
  {customSizeIndexes.has(index) && (
    <input
      type="text"
      value={item.size === "Custom" ? "" : item.size}
      onChange={(e) =>
        updateSize(index, e.target.value)
      }
      placeholder="Enter custom size"
      className="
        mt-2
        h-11
        w-full
        rounded-xl
        border
        border-gray-300
        bg-white
        px-3
        text-sm
        outline-none
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-100
      "
    />
  )}
</div>

                      {/* STOCK */}
                      <div className="min-w-0">
                        <label
                          className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-gray-600
                          "
                        >
                          Stock
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={item.stock}
                          onChange={(e) =>
                            updateStock(
                              index,
                              Number(
                                e.target.value
                              )
                            )
                          }
                          required
                          className="
                            h-11
                            w-full
                            min-w-0
                            rounded-xl
                            border
                            border-gray-300
                            bg-white
                            px-3
                            text-sm
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                          "
                        />
                      </div>

                      {/* DELETE */}
                      <button
                        type="button"
                        onClick={() =>
                          removeSize(index)
                        }
                        disabled={loading}
                        className="
                          flex
                          h-11
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-red-200
                          bg-white
                          text-xl font-bold
                          text-red-500
                          hover:bg-red-50
                        "
                        title="Remove size"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ADD SIZE */}
            <button
              type="button"
              onClick={addSize}
              disabled={loading}
              className="
                mt-4
                text-sm
                font-semibold
                text-blue-600
                hover:text-blue-700
              "
            >
              + Add Size
            </button>
          </div>

          {/* FOOTER */}
          <div
            className="
              shrink-0
              border-t
              bg-white
              px-5
              py-4
              sm:px-6
            "
          >
            <div
              className="
                flex
                flex-col-reverse
                gap-2
                sm:flex-row
                sm:justify-end
                sm:gap-3
              "
            >
              {/* CANCEL */}
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="
                  h-11
                  rounded-xl
                  border
                  border-gray-300
                  px-5
                  text-sm
                  font-medium
                  text-gray-700
                  hover:bg-gray-50
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              {/* UPDATE */}
              <button
                type="submit"
                disabled={loading}
                className="
                  h-11
                  rounded-xl
                  bg-orange-500
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-orange-600
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading
                  ? "Updating..."
                  : "Update Inventory"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}