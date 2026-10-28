"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Plus, Trash2, ArrowLeft, X } from "lucide-react";
import { getSubcategoryInfo } from "@/app/services/categoryApi";
import { getMyStore } from "@/app/services/businessStoreApi";
import PdfProductImport from "@/app/components/product/PdfProductImport";
import { PdfProduct } from "@/app/components/product/pdfProductParser";

interface InventoryItem {
  size: string;
  stock: number;
}

interface BulkPost {
  topic: string;
  description: string;

  category: string;
  subCategory: string;

  mediaFiles: File[];

  priceAmount: string;
  priceCurrency: string;
  priceType: string;

  color: string;
customColor: string;
idealFor: string;

  inventory: InventoryItem[];

  discountTitle: string;
  discountType: "percentage" | "flat";
  discountValue: string;
  discountExpiry: string;
}

const createEmptyPost = (): BulkPost => ({
  topic: "",
  description: "",

  category: "",
  subCategory: "",

  mediaFiles: [],

  priceAmount: "",
  priceCurrency: "INR",
  priceType: "fixed",

  color: "",
customColor: "",
idealFor: "",

  inventory: [
    {
      size: "",
      stock: 0,
    },
  ],

  discountTitle: "",
  discountType: "percentage",
  discountValue: "",
  discountExpiry: "",
});

const DB_NAME = "thoverBulkUpload";
const STORE_NAME = "images";

const openImageDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

const getImage = (
  key: string
): Promise<File | undefined> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openImageDB();

      const transaction = db.transaction(
        STORE_NAME,
        "readonly"
      );

      const store =
        transaction.objectStore(STORE_NAME);

      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

const saveImage = (
  key: string,
  file: File
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openImageDB();

      const transaction = db.transaction(
        STORE_NAME,
        "readwrite"
      );

      const store =
        transaction.objectStore(STORE_NAME);

      store.put(file, key);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export default function BulkUploadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <BulkUploadContent />
    </Suspense>
  );
}

function BulkUploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ?mode=pdf → "Upload PDF" option; otherwise "Add Multiple" (typing).
  const pdfMode = searchParams.get("mode") === "pdf";
  const [pdfImported, setPdfImported] = useState(false);
  const showForm = !pdfMode || pdfImported;

  const [posts, setPosts] = useState<BulkPost[]>([
    createEmptyPost(),
  ]);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [storeCategory, setStoreCategory] = useState("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] =
    useState(false);

  useEffect(() => {
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    try {
      setLoadingSubcategories(true);

      const storeResponse = await getMyStore();

      const category =
        storeResponse?.store?.category ||
        storeResponse?.data?.store?.category ||
        storeResponse?.data?.category;

      if (!category) {
        return;
      }

      setStoreCategory(category);

      const response =
        await getSubcategoryInfo(category);

      const details = response?.data || [];

      const list = details
        .map((item: any) => item.subCategory)
        .filter(Boolean);

      setSubcategories(list);

      setPosts((prev) =>
        prev.map((post) => ({
          ...post,
          category,
        }))
      );
    } catch (error) {
      console.error("STORE DATA ERROR:", error);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // ==========================================
  // ADD PRODUCT
  // ==========================================

  const addMoreProduct = () => {
    setPosts((prev) => [
      ...prev,
      {
        ...createEmptyPost(),
        category: storeCategory,
      },
    ]);
  };

  // ==========================================
  // IMPORT FROM PDF
  // ==========================================

  const importFromPdf = (products: PdfProduct[]) => {
    const imported = products.map((product) => {
      const empty = createEmptyPost();

      return {
        ...empty,
        ...product,
        category: storeCategory,
        priceType: product.priceType || empty.priceType,
      };
    });

    setPosts((prev) => {
      // Replace the untouched starter card instead of leaving it blank on top.
      const onlyBlankCard =
        prev.length === 1 &&
        !prev[0].topic.trim() &&
        !prev[0].description.trim() &&
        !prev[0].priceAmount &&
        prev[0].mediaFiles.length === 0;

      return onlyBlankCard ? imported : [...prev, ...imported];
    });

    setPdfImported(true);
  };

  const getMissingFields = (post: BulkPost) => {
    const missing: string[] = [];

    if (!post.topic.trim()) missing.push("name");
    if (!post.description.trim()) missing.push("description");
    if (!post.subCategory) missing.push("category");
    if (!post.priceAmount || Number(post.priceAmount) <= 0) missing.push("price");
    if (post.mediaFiles.length !== 1) missing.push("image");

    return missing;
  };

  // ==========================================
  // REMOVE PRODUCT
  // ==========================================

  const removeProduct = (index: number) => {
    if (posts.length === 1) return;

    setPosts((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // UPDATE POST
  // ==========================================

  const updatePost = (
    index: number,
    field: keyof BulkPost,
    value: any
  ) => {
    setPosts((prev) =>
      prev.map((post, i) =>
        i === index
          ? {
              ...post,
              [field]: value,
            }
          : post
      )
    );
  };

  // ==========================================
  // INVENTORY
  // ==========================================

  const addInventory = (postIndex: number) => {
    setPosts((prev) =>
      prev.map((post, i) =>
        i === postIndex
          ? {
              ...post,
              inventory: [
                ...post.inventory,
                {
                  size: "M",
                  stock: 0,
                },
              ],
            }
          : post
      )
    );
  };

  const updateInventory = (
    postIndex: number,
    inventoryIndex: number,
    field: keyof InventoryItem,
    value: string
  ) => {
    setPosts((prev) =>
      prev.map((post, i) => {
        if (i !== postIndex) return post;

        return {
          ...post,
          inventory: post.inventory.map(
            (item, j) =>
              j === inventoryIndex
                ? {
                    ...item,
                    [field]:
                      field === "stock"
                        ? Number(value)
                        : value,
                  }
                : item
          ),
        };
      })
    );
  };

  const removeInventory = (
    postIndex: number,
    inventoryIndex: number
  ) => {
    setPosts((prev) =>
      prev.map((post, i) =>
        i === postIndex
          ? {
              ...post,
              inventory: post.inventory.filter(
                (_, j) => j !== inventoryIndex
              ),
            }
          : post
      )
    );
  };

  // ==========================================
  // IMAGES
  // ==========================================

  const handleImages = (
  postIndex: number,
  files: FileList | null
) => {
  if (!files || files.length === 0) return;

  const file = files[0];

  setPosts((prev) =>
    prev.map((post, i) =>
      i === postIndex
        ? {
            ...post,
            mediaFiles: [file],
          }
        : post
    )
  );
};

  // ==========================================
  // VALIDATE
  // ==========================================
const validatePosts = () => {
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    if (!post.topic.trim()) {
      alert(`Please enter product name for Product ${i + 1}`);
      return false;
    }

    if (!post.description.trim()) {
      alert(`Please enter description for Product ${i + 1}`);
      return false;
    }

    if (!post.subCategory) {
      alert(`Please select category for Product ${i + 1}`);
      return false;
    }

    if (!post.priceAmount || Number(post.priceAmount) <= 0) {
  alert(`Please enter valid price for Product ${i + 1}`);
  return false;
}

if (!post.priceType) {
  alert(`Please select price type for Product ${i + 1}`);
  return false;
}

    // EXACTLY ONE IMAGE REQUIRED
    if (post.mediaFiles.length !== 1) {
      alert(`Please select exactly 1 image for Product ${i + 1}`);
      return false;
    }
  }

  return true;
};

  // ==========================================
  // CONFIRM
  // ==========================================

  const handleConfirm = async () => {
  if (!validatePosts()) return;

  try {
    // Save images in IndexedDB
    for (let i = 0; i < posts.length; i++) {
      const image = posts[i].mediaFiles[0];

      if (image) {
        await saveImage(
          `post_${i}_image`,
          image
        );
      }
    }

    // Save product data in sessionStorage
    const postsForReview = posts.map((post) => ({
      ...post,
      mediaFiles: [
        {
          name: post.mediaFiles[0]?.name || "",
          type: post.mediaFiles[0]?.type || "",
          size: post.mediaFiles[0]?.size || 0,
        },
      ],
    }));

    sessionStorage.setItem(
      "bulkPosts",
      JSON.stringify(postsForReview)
    );

    router.push(
      "/business-dashboard/product/bulk-upload/review"
    );
  } catch (error) {
    console.error(
      "SAVE BULK DATA ERROR:",
      error
    );

    alert(
      "Unable to save product images. Please try again."
    );
  }
};

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">

        {/* HEADER */}

        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
  router.replace(
    "/business-dashboard/product"
  )
}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl border border-slate-200 bg-white
              hover:bg-slate-50
            "
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {pdfMode ? "Upload PDF" : "Add Multiple Products"}
            </h1>

            <p className="text-sm text-slate-500">
              {pdfMode
                ? "Add products in bulk from your product list or catalog."
                : "Add multiple products and upload them together."}
            </p>
          </div>
        </div>

{/* IMPORT FROM PDF */}

{pdfMode && (
  <PdfProductImport
    subcategories={subcategories}
    onImport={importFromPdf}
  />
)}

{showForm && (
<>

{/* POSTS */}

<div className="space-y-6">
  {posts.map((post, index) => (
    <div
      key={index}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      {/* ================= HEADER ================= */}

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold">
            Product {index + 1}
          </h2>

          {/* Only flag cards the user has started (e.g. imported from PDF). */}
          {post.topic.trim() && getMissingFields(post).length > 0 && (
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              Needs {getMissingFields(post).join(", ")}
            </span>
          )}
        </div>

        {posts.length > 1 && (
          <button
            type="button"
            onClick={() => removeProduct(index)}
            className="flex items-center gap-1 text-sm text-red-500"
          >
            <Trash2 size={16} />
            Remove
          </button>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">

        {/* ================= PRODUCT NAME ================= */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Product Name
          </label>

          <input
            value={post.topic}
            onChange={(e) =>
              updatePost(
                index,
                "topic",
                e.target.value
              )
            }
            placeholder="e.g. Cotton T-Shirt"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>


        {/* ================= PRICE ================= */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Price
          </label>

          <div className="grid grid-cols-3 gap-2 md:gap-3">

            {/* CURRENCY */}

            <select
              value={post.priceCurrency}
              onChange={(e) =>
                updatePost(
                  index,
                  "priceCurrency",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="INR">
                INR
              </option>

              <option value="USD">
                USD
              </option>
            </select>


            {/* AMOUNT */}

            <input
              type="number"
              min="0"
              value={post.priceAmount}
              onChange={(e) =>
                updatePost(
                  index,
                  "priceAmount",
                  e.target.value
                )
              }
              placeholder="Amount"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />


            {/* PRICE TYPE */}

            <select
              value={post.priceType}
              onChange={(e) =>
                updatePost(
                  index,
                  "priceType",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="">
                Select Price Type
              </option>

              <option value="per_piece">
                Per Piece
              </option>

              <option value="per_set">
                Per Set
              </option>
            </select>

          </div>
        </div>


        {/* ================= DESCRIPTION ================= */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Description
          </label>

          <input
            type="text"
            value={post.description}
            onChange={(e) =>
              updatePost(
                index,
                "description",
                e.target.value
              )
            }
            placeholder="Describe your product..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>


        {/* ================= CATEGORY + IDEAL FOR ================= */}

        <div className="md:col-span-2">
          <div className="grid grid-cols-2 gap-3 md:gap-5">

            {/* CATEGORY */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Category
              </label>

              <select
                value={post.subCategory}
                onChange={(e) =>
                  updatePost(
                    index,
                    "subCategory",
                    e.target.value
                  )
                }
                disabled={loadingSubcategories}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <option value="">
                  Select Category
                </option>

                {subcategories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}
              </select>
            </div>


            {/* IDEAL FOR */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Ideal For
              </label>

              <select
                value={post.idealFor}
                onChange={(e) =>
                  updatePost(
                    index,
                    "idealFor",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
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

          </div>
        </div>


        {/* ================= COLOR ================= */}

<div className="md:col-span-2">
  <label className="mb-2 block text-sm font-medium">
    Color
  </label>

  <div
    className={
      post.color === "custom"
        ? "grid grid-cols-1 gap-3 md:grid-cols-2"
        : "w-full"
    }
  >
    {/* COLOR DROPDOWN */}

    <select
      value={post.color}
      onChange={(e) => {
        const value = e.target.value;

        updatePost(
          index,
          "color",
          value
        );

        if (value !== "custom") {
          updatePost(
            index,
            "customColor",
            ""
          );
        }
      }}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
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


    {/* CUSTOM COLOR */}

    {post.color === "custom" && (
      <input
        type="text"
        value={post.customColor}
        onChange={(e) =>
          updatePost(
            index,
            "customColor",
            e.target.value
          )
        }
        placeholder="Enter custom color"
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
      />
    )}
  </div>
</div>

{/* ================= INVENTORY ================= */}

<div className="md:col-span-2">

  <div className="mb-3 flex items-center justify-between">
    <label className="text-sm font-medium">
      Inventory
    </label>

    <button
      type="button"
      onClick={() => addInventory(index)}
      className="text-sm font-semibold text-blue-600"
    >
      + Add Size
    </button>
  </div>

  <div className="space-y-3">

    {post.inventory.map((item, inventoryIndex) => {

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
          key={inventoryIndex}
          className="w-full min-w-0"
        >

          {/* ================= CUSTOM / NORMAL ================= */}

          {isCustom ? (

            /* CUSTOM SIZE */
            <div className="grid w-full min-w-0 grid-cols-[70px_minmax(0,1fr)_55px] gap-1.5">

              {/* CUSTOM SELECT */}
              <select
                value="Custom"
                onChange={(e) => {
                  const value = e.target.value;

                  updateInventory(
                    index,
                    inventoryIndex,
                    "size",
                    value === "Custom"
                      ? "Custom"
                      : value
                  );
                }}
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-1 py-3 text-[11px]"
              >
                <option value="Custom">
                  Custom
                </option>

                {standardSizes.map((size) => (
                  <option
                    key={size}
                    value={size}
                  >
                    {size}
                  </option>
                ))}
              </select>

              {/* CUSTOM SIZE INPUT */}
              <input
                type="text"
                value={
                  item.size === "Custom"
                    ? ""
                    : item.size
                }
                onChange={(e) =>
                  updateInventory(
                    index,
                    inventoryIndex,
                    "size",
                    e.target.value
                  )
                }
                placeholder="Custom"
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2 py-3 text-xs outline-none focus:border-blue-500"
              />

              {/* STOCK */}
              <input
                type="number"
                min="0"
                value={item.stock}
                onChange={(e) =>
                  updateInventory(
                    index,
                    inventoryIndex,
                    "stock",
                    e.target.value
                  )
                }
                placeholder="0"
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2 py-3 text-sm outline-none focus:border-blue-500"
              />

            </div>

          ) : (

            /* NORMAL SIZE */
            <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_55px] gap-2">

              {/* SIZE */}
              <select
                value={item.size}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "Custom") {
                    updateInventory(
                      index,
                      inventoryIndex,
                      "size",
                      "Custom"
                    );
                  } else {
                    updateInventory(
                      index,
                      inventoryIndex,
                      "size",
                      value
                    );
                  }
                }}
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2 py-3 text-[14px] outline-none focus:border-blue-500 sm:text-sm"
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

              {/* STOCK */}
              <input
                type="number"
                min="0"
                value={item.stock}
                onChange={(e) =>
                  updateInventory(
                    index,
                    inventoryIndex,
                    "stock",
                    e.target.value
                  )
                }
                placeholder="0"
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2 py-3 text-[14px] outline-none focus:border-blue-500"
              />

            </div>

          )}

          {/* REMOVE */}
          {post.inventory.length > 1 && (
            <button
              type="button"
              onClick={() =>
                removeInventory(
                  index,
                  inventoryIndex
                )
              }
              className="mt-1 text-xs text-red-500"
            >
              Remove
            </button>
          )}

        </div>
      );
    })}

  </div>
</div>


        {/* ================= PRODUCT IMAGE ================= */}

        <div className="md:col-span-2">

          <label className="mb-2 block text-sm font-medium">
            Product Image{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <input
  ref={(el) => {
    fileInputRefs.current[index] = el;
  }}
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    updatePost(
      index,
      "mediaFiles",
      [file]
    );
  }}
  className="w-full rounded-lg border border-gray-300 p-2"
/>


          {/* IMAGE PREVIEW */}

          {post.mediaFiles.length > 0 && (
            <div className="mt-3">

              <p className="mb-2 text-sm font-medium text-gray-700">
                Selected Image
              </p>

              <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-300">
  <img
    src={URL.createObjectURL(post.mediaFiles[0])}
    alt="Selected product"
    className="h-full w-full object-cover"
  />

  <button
  type="button"
  onClick={() => {
    updatePost(index, "mediaFiles", []);

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = "";
    }
  }}
  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
  aria-label="Remove image"
>
  <X size={16} />
</button>
</div>

              <p className="mt-1 max-w-[200px] truncate text-xs text-gray-500">
                {post.mediaFiles[0].name}
              </p>

            </div>
          )}

        </div>

      </div>
    </div>
  ))}
</div>
        {/* ADD MORE */}

        <button
          type="button"
          onClick={addMoreProduct}
          className="
            mt-6
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border-2
            border-dashed
            border-blue-300
            bg-blue-50
            py-4
            text-sm
            font-semibold
            text-blue-600
            hover:bg-blue-100
          "
        >
          <Plus size={18} />
          Add More Product
        </button>

        {/* CONFIRM */}

        <div className="mt-6 flex w-full justify-end">
  <button
    type="button"
    onClick={handleConfirm}
    className="
      w-full rounded-xl
      bg-blue-600
      px-8 py-3
      text-sm font-semibold
      text-white
      shadow-sm
      hover:bg-blue-700
      sm:w-auto
    "
  >
    Confirm
  </button>
</div>

</>
)}

      </main>
    </div>
  );
}