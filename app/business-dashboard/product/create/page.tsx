"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { X } from "lucide-react";
import {
  getSubcategoryInfo,
} from "../../../services/categoryApi";
import { getMyStores } from "../../../services/businessStoreApi"

interface InventoryItem {
  size: string;
  stock: number;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");

  const [priceAmount, setPriceAmount] = useState("");
  const [priceCurrency, setPriceCurrency] = useState("INR");
  const [priceType, setPriceType] = useState("");

  const [color, setColor] = useState("");
  const [customColor, setCustomColor] = useState("");

  const [idealFor, setIdealFor] = useState("");
  const [inventory, setInventory] = useState<InventoryItem[]>([
  {
    size: "",
    stock: 0,
  },
]);

  const [discountTitle, setDiscountTitle] = useState("");
  const [discountType, setDiscountType] = useState<
    "percentage" | "flat"
  >("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [discountExpiry, setDiscountExpiry] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [createdPostId, setCreatedPostId] = useState<string | null>(null);



  const [tags, setTags] = useState("");

  useEffect(() => {
  const fetchStoreAndSubcategories = async () => {
    try {
      setLoadingSubcategories(true);

      const selectedStoreId =
        localStorage.getItem("selectedStoreId");

      console.log(
        "CREATE PRODUCT - SELECTED STORE:",
        selectedStoreId
      );

      if (!selectedStoreId) {
        console.error("Selected store not found");
        setSubcategories([]);
        return;
      }

      // ==========================================
      // GET ALL STORES
      // ==========================================

      const response = await getMyStores();

      console.log(
        "MY STORES RESPONSE:",
        response
      );

      const stores =
        response?.stores ||
        response?.data?.stores ||
        [];

      // ==========================================
      // FIND SELECTED STORE
      // ==========================================

      const selectedStore = stores.find(
        (store: any) =>
          String(store._id) ===
          String(selectedStoreId)
      );

      console.log(
        "SELECTED STORE:",
        selectedStore
      );

      if (!selectedStore) {
        console.error(
          "Selected store not found in my stores"
        );

        setStoreCategory("");
        setSubcategories([]);
        return;
      }

      // ==========================================
      // STORE CATEGORY
      // ==========================================

      const category =
        selectedStore.category;

      console.log(
        "STORE CATEGORY:",
        category
      );

      if (!category) {
        console.error(
          "Selected store category not found"
        );

        setStoreCategory("");
        setSubcategories([]);
        return;
      }

      setStoreCategory(category);

      // ==========================================
      // GET CATEGORY/SUBCATEGORY LIST
      // ==========================================

      const subcategoryResponse =
        await getSubcategoryInfo(category);

      console.log(
        "SUBCATEGORY RESPONSE:",
        subcategoryResponse
      );

      const details =
        subcategoryResponse?.data || [];

      const subcategoryList =
        details
          .map(
            (item: any) =>
              item.subCategory
          )
          .filter(Boolean);

      console.log(
        "CATEGORY LIST:",
        subcategoryList
      );

      setSubcategories(
        subcategoryList
      );

    } catch (error: any) {
      console.error(
        "GET STORE CATEGORY ERROR:",
        error.response?.data ||
          error.message ||
          error
      );

      setStoreCategory("");
      setSubcategories([]);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  fetchStoreAndSubcategories();
}, []);

  // ==========================================
  // INVENTORY
  // ==========================================

  const addInventory = () => {
  setInventory((prev) => [
    ...prev,
    {
      size: "",
      stock: 0,
    },
  ]);
};

  const removeInventory = (index: number) => {
    setInventory(
      inventory.filter((_, i) => i !== index)
    );
  };

  const updateInventory = (
  index: number,
  field: keyof InventoryItem,
  value: string
) => {
  if (field === "size") {
    const newSize = value.trim().toLowerCase();

    const duplicate = inventory.some(
      (item, i) =>
        i !== index &&
        item.size.trim().toLowerCase() === newSize &&
        newSize !== ""
    );

    if (duplicate) {
      alert("This inventory size already exists.");
      return;
    }
  }

  setInventory((prev) =>
    prev.map((item, i) =>
      i === index
        ? {
            ...item,
            [field]:
              field === "stock"
                ? Number(value)
                : value,
          }
        : item
    )
  );
};



  const handleStep1Next = () => {
    if (!topic.trim()) {
      alert("Please enter topic");
      return;
    }

    if (!description.trim()) {
      alert("Please enter description");
      return;
    }

    if (!priceAmount || Number(priceAmount) <= 0) {
      alert("Please enter valid price");
      return;
    }

    setCurrentStep(2);
  };
const handleStep2Next = () => {
  // ==============================
  // CATEGORY
  // ==============================

  if (!selectedSubcategory) {
    alert("Please select a category.");
    return;
  }

  // ==============================
  // COLOR
  // ==============================

  if (!color) {
    alert("Please select a color.");
    return;
  }

  if (color === "custom" && !customColor.trim()) {
    alert("Please enter custom color.");
    return;
  }

  // ==============================
  // IDEAL FOR
  // ==============================

  if (!idealFor) {
    alert("Please select who this product is ideal for.");
    return;
  }

  // ==============================
  // INVENTORY VALIDATION
  // ==============================

  const invalidInventory = inventory.some(
    (item) => !item.size.trim()
  );

  if (invalidInventory) {
    alert(
      "Please select or enter a size for all inventory items."
    );
    return;
  }

  // ==============================
  // DUPLICATE INVENTORY CHECK
  // ==============================

  const inventoryNames = inventory.map(
    (item) => item.size.trim().toLowerCase()
  );

  const hasDuplicate =
    new Set(inventoryNames).size !== inventoryNames.length;

  if (hasDuplicate) {
    alert("Duplicate inventory sizes are not allowed.");
    return;
  }

  // ==============================
  // GO TO STEP 3
  // ==============================

  setCurrentStep(3);
};
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedImages([file]);

    const preview = URL.createObjectURL(file);

    setImagePreviews([preview]);
  };

  const createPost = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login again.");
    }

    const selectedStoreId =
  localStorage.getItem("selectedStoreId");

if (!selectedStoreId) {
  throw new Error(
    "Please select a store first."
  );
}

const payload = {
  storeId: selectedStoreId,
  topic: topic.trim(),
  description: description.trim(),

  price: {
    currency: priceCurrency,
    amount: Number(priceAmount),
    priceType,
  },

  category: selectedSubcategory,

  color:
  color === "custom"
    ? customColor.trim()
    : color === "multi"
      ? "Multi Color"
      : color.trim(),

  idealFor: idealFor || undefined,

  inventory: inventory.map((item) => ({
    size: item.size.trim(),
    stock: Number(item.stock),
  })),

  status: "public",

  tags: tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean),
};
    console.log("========== INVENTORY DEBUG ==========");
console.log("INVENTORY:", inventory);
console.log("FIRST SIZE:", inventory?.[0]?.size);
console.log(
  "FIRST SIZE JSON:",
  JSON.stringify(inventory?.[0]?.size)
);
console.log("IDEAL FOR:", idealFor);
console.log("=====================================");

    const response = await axios.post(
      "https://api.thover.in/v2/api/post/addPost",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  };

  const uploadPostMedia = async (
    postId: string
  ) => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      throw new Error(
        "Please login again."
      );
    }

    const formData = new FormData();

    selectedImages.forEach((file) => {
      formData.append("media", file);
    });

    const response = await axios.post(
      `https://api.thover.in/v1/api/post/add-media/${postId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
      "MEDIA UPLOAD RESPONSE:",
      response.data
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
        "Unable to upload images."
      );
    }

    return response.data;
  };


const handleStep3Next = () => {
  if (selectedImages.length === 0) {
    alert("Please select at least one image.");
    return;
  }

  setCurrentStep(4);
};

const handleDone = async () => {
   if (loading) return;
  try {
    setLoading(true);

    const postResponse = await createPost();

    const postId = postResponse.post._id;

    await uploadPostMedia(postId);

    router.push("/business-dashboard/product");
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto w-full max-w-3xl">

        {/* HEADER */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create Product
              </h1>

              <p className="mt-1 text-gray-500">
                Create a new product for your store.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-full p-2 hover:bg-gray-200"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mb-6 flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className="flex flex-1 items-center"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full font-semibold ${currentStep >= step
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                  }`}
              >
                {step}
              </div>

              {step < 4 && (
                <div
                  className={`mx-2 h-1 flex-1 ${currentStep > step
                      ? "bg-blue-600"
                      : "bg-gray-200"
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          {/* ================= STEP 1 ================= */}
          {currentStep === 1 && (
            <div className="space-y-6">

              <div>
                <p className="text-sm text-blue-600">
                  Step 1 of 4
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Basic Information
                </h2>
              </div>

              {/* TOPIC */}
              <div>
                <label className="mb-2 block font-medium">
                  Product Name
                </label>

                <input
                  type="text"
                  value={topic}
                  onChange={(e) =>
                    setTopic(e.target.value)
                  }
                  placeholder="e.g. Premium Cotton T-Shirt"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block font-medium">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Describe your product..."
                  rows={5}
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* PRICE */}
              <div>
                <label className="mb-2 block font-medium">
                  Price
                </label>

                <div className="grid grid-cols-3 gap-3">

                  <select
                    value={priceCurrency}
                    onChange={(e) =>
                      setPriceCurrency(e.target.value)
                    }
                    className="rounded-xl border px-4 py-3"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                  </select>

                  <input
                    type="number"
                    value={priceAmount}
                    onChange={(e) =>
                      setPriceAmount(e.target.value)
                    }
                    placeholder="Amount"
                    className="rounded-xl border px-4 py-3"
                  />

                  <select
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value)}
                    className="rounded-xl border px-4 py-3 bg-white"
                  >
                    <option value="">Select Price Type</option>
                    <option value="per_piece">Per Piece</option>
                    <option value="per_set">Per Set</option>
                  </select>

                </div>
              </div>

              <div className="flex justify-end border-t pt-5">
                <button
                  type="button"
                  onClick={handleStep1Next}
                  className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Next
                </button>
              </div>

            </div>
          )}

          {/* ================= STEP 2 ================= */}
          {currentStep === 2 && (
            <div className="space-y-6">

              <div>
                <p className="text-sm text-blue-600">
                  Step 2 of 4
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Product Details
                </h2>
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-2 block font-medium">
                  Category
                </label>

                <select
                  value={selectedSubcategory}
                  onChange={(e) =>
                    setSelectedSubcategory(e.target.value)
                  }
                  disabled={
                    loadingSubcategories ||
                    !storeCategory
                  }
                  className="w-full rounded-xl border px-4 py-3 bg-white"
                >
                  <option value="">
                    {loadingSubcategories
                      ? "Loading categories..."
                      : "Select Category"}
                  </option>

                  {subcategories.map(
                    (subcategory) => (
                      <option
                        key={subcategory}
                        value={subcategory}
                      >
                        {subcategory}
                      </option>
                    )
                  )}
                </select>

                {storeCategory && (
                  <p className="mt-2 text-xs text-gray-500">
                    Store Category: {storeCategory}
                  </p>
                )}
              </div>

              {/* COLOR */}
{/* COLOR */}
<div>
  <label className="mb-2 block font-medium">
    Color
  </label>

  <select
    value={color}
    onChange={(e) => {
      const value = e.target.value;

      setColor(value);

      // Custom se kisi aur option par jaane par
      // custom color clear kar do
      if (value !== "custom") {
        setCustomColor("");
      }
    }}
    className="w-full rounded-xl border px-4 py-3 bg-white"
  >
    <option value="">
      Select Color
    </option>

    <option value="Black">
      Black
    </option>

    <option value="White">
      White
    </option>

    <option value="Red">
      Red
    </option>

    <option value="Blue">
      Blue
    </option>

    <option value="Green">
      Green
    </option>

    <option value="Yellow">
      Yellow
    </option>

    <option value="Pink">
      Pink
    </option>

    <option value="Purple">
      Purple
    </option>

    <option value="Orange">
      Orange
    </option>

    <option value="multi">
      Multi Color
    </option>

    <option value="custom">
      Custom
    </option>
  </select>

  {/* ONLY CUSTOM GETS INPUT */}
  {color === "custom" && (
    <input
      type="text"
      value={customColor}
      onChange={(e) =>
        setCustomColor(e.target.value)
      }
      placeholder="Enter custom color"
      className="mt-3 w-full rounded-xl border px-4 py-3"
    />
  )}
</div>

              {/* IDEAL FOR */}
              {/* IDEAL FOR */}
              <div>
                <label className="mb-2 block font-medium">
                  Ideal For
                </label>

                <select
  value={idealFor}
  onChange={(e) =>
    setIdealFor(e.target.value)
  }
  className="w-full rounded-xl border px-4 py-3 bg-white"
>
  <option value="">
    Select
  </option>

  <option value="Everyone">
    Everyone
  </option>

  <option value="Newborn">
    Newborn
  </option>

  <option value="Boy">
    Boy
  </option>

  <option value="Girl">
    Girl
  </option>

  <option value="Unisex">
    Unisex
  </option>

  <option value="Women">
    Women
  </option>

  <option value="Men">
    Men
  </option>
</select>
              </div>

              {/* INVENTORY */}
              {/* INVENTORY */}
<div>
  <div className="mb-3 flex items-center justify-between">
    <label className="font-medium">
      Inventory
    </label>

    <button
      type="button"
      onClick={addInventory}
      className="text-sm font-semibold text-blue-600"
    >
      + Add Size
    </button>
  </div>

  <div className="space-y-3">
  {inventory.map((item, index) => {
    const standardSizes = [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL",
      "Free Size",
    ];

    const isCustom =
      item.size !== "" &&
      !standardSizes.includes(item.size);

    return (
      <div
        key={index}
        className="flex w-full min-w-0 gap-2"
      >
        {/* SIZE DROPDOWN */}
        <select
          value={
            isCustom
              ? "Custom"
              : item.size
          }
          onChange={(e) => {
            const value = e.target.value;

            if (value === "Custom") {
              // Empty size so custom input can be entered
              updateInventory(
                index,
                "size",
                ""
              );
            } else {
              updateInventory(
                index,
                "size",
                value
              );
            }
          }}
          className="w-32 shrink-0 rounded-xl border px-3 py-3 bg-white"
        >
          <option value="">
            Select Size
          </option>

          {standardSizes.map((size) => (
            <option
              key={size}
              value={size}
            >
              {size}
            </option>
          ))}

          <option value="Custom">
            Custom
          </option>
        </select>

        {/* CUSTOM SIZE INPUT */}
        {isCustom || item.size === "" ? (
          <input
            type="text"
            value={
              isCustom
                ? item.size
                : ""
            }
            onChange={(e) =>
              updateInventory(
                index,
                "size",
                e.target.value
              )
            }
            placeholder="Enter custom size"
            className="min-w-0 flex-1 rounded-xl border px-3 py-3"
          />
        ) : null}

        {/* STOCK */}
        <input
          type="number"
          min="0"
          value={item.stock}
          onChange={(e) =>
            updateInventory(
              index,
              "stock",
              e.target.value
            )
          }
          placeholder="Stock"
          className="min-w-0 flex-1 rounded-xl border px-3 py-3"
        />

        {/* REMOVE */}
        {inventory.length > 1 && (
          <button
            type="button"
            onClick={() =>
              removeInventory(index)
            }
            className="text-red-500"
          >
            Remove
          </button>
        )}
      </div>
    );
  })}
</div>
</div>

              <div className="flex justify-between border-t pt-5">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="rounded-xl border px-6 py-3"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleStep2Next}
                  className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white"
                >
                  Next
                </button>
              </div>

            </div>
          )}

          {/* ================= STEP 3 ================= */}
          {currentStep === 3 && (
            <div className="space-y-6">

              <div>
                <p className="text-sm text-blue-600">
                  Step 3 of 4
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Add Product Images
                </h2>
              </div>

              <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 p-10 text-center hover:bg-blue-100">

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />

                <p className="font-semibold text-blue-700">
                  Click to upload images
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Select one image
                </p>

              </label>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {imagePreviews.map(
                    (image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-full rounded-xl object-cover"
                      />
                    )
                  )}
                </div>
              )}

              <div className="flex justify-between border-t pt-5">

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={loading}
                  className="rounded-xl border px-6 py-3"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleStep3Next}
                  disabled={
                    loading ||
                    selectedImages.length === 0
                  }
                  className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white disabled:bg-gray-300"
                >
                  {loading
                    ? "Creating..."
                    : "Continue"}
                </button>

              </div>

            </div>
          )}

          {/* ================= STEP 4 ================= */}
          {currentStep === 4 && (
            <div className="space-y-6">

              <div>
                <p className="text-sm text-green-600">
                  Step 4 of 4
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Review Product
                </h2>
              </div>

              {/* IMAGES */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {imagePreviews.map(
                  (image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt=""
                      className="h-32 w-full rounded-xl object-cover"
                    />
                  )
                )}
              </div>

              {/* DETAILS */}
              <div className="space-y-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Topic
                  </p>
                  <p className="font-semibold">
                    {topic}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Description
                  </p>
                  <p>
                    {description}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Price
                  </p>
                  <p className="font-semibold">
                    {priceCurrency} {priceAmount}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <p className="text-sm text-gray-500">
                      Category
                    </p>
                    <p className="font-medium">
                      {selectedSubcategory}
                    </p>
                  </div>

                  {/* COLOR */}
<div>
  <p className="text-sm text-gray-500">
    Color
  </p>

  <p className="font-medium">
  {color === "custom"
    ? customColor
    : color === "multi"
      ? "Multi Color"
      : color || "—"}
</p>
</div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Ideal For
                    </p>
                    <p className="font-medium">
                      {idealFor || "—"}
                    </p>
                  </div>

                </div>

                {/* INVENTORY */}
                <div>
                  <p className="mb-2 text-sm text-gray-500">
                    Inventory
                  </p>

                  <div className="space-y-2">
                    {inventory.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex justify-between rounded-xl border p-3"
                        >
                          <span>
                            Size {item.size}
                          </span>

                          <span className="font-semibold">
                            {item.stock} units
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

              </div>

              <div className="flex justify-between border-t pt-5">

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="rounded-xl border px-6 py-3"
                >
                  Back
                </button>

                <button
  type="button"
  onClick={handleDone}
  disabled={loading}
  className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white"
>
  {loading ? "Creating..." : "Done"}
</button>

              </div>

            </div>
          )}

        </div>
      </div>
    </main>
  );
}