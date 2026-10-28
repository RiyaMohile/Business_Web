"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Plus,
  Trash2,
  ArrowLeft,
  X,
} from "lucide-react";
import { getSubcategoryInfo } from "../../../services/categoryApi";
import { getMyStores } from "../../../services/businessStoreApi";

const DB_NAME = "thoverSimilarProducts";
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

      const store = transaction.objectStore(STORE_NAME);

      const request = store.put(file, key);

      request.onsuccess = () => resolve();

      request.onerror = () => reject(request.error);
    } catch (error) {
      reject(error);
    }
  });
};

interface InventoryItem {
  size: string;
  stock: number;
}

interface SimilarProduct {
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

const createEmptyProduct = (): SimilarProduct => ({
  topic: "",
  description: "",

  category: "",
  subCategory: "",

  mediaFiles: [],

  priceAmount: "",
  priceCurrency: "INR",
  priceType: "per_piece",

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

export default function SimilarProductsPage() {
  const router = useRouter();

  const [postId, setPostId] = useState("");
  const [loadingMainProduct, setLoadingMainProduct] = useState(true);

  const [storeCategory, setStoreCategory] = useState("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  const [products, setProducts] = useState<SimilarProduct[]>([
    createEmptyProduct(),
  ]);

  // ==========================================
  // LOAD STORE CATEGORY / SUBCATEGORIES
  // ==========================================

  useEffect(() => {
    const fetchStoreAndSubcategories = async () => {
      try {
        setLoadingSubcategories(true);

        const selectedStoreId =
          localStorage.getItem("selectedStoreId");

        if (!selectedStoreId) {
          setStoreCategory("");
          setSubcategories([]);
          return;
        }

        const response = await getMyStores();

        const stores =
          response?.stores ||
          response?.data?.stores ||
          [];

        const selectedStore = stores.find(
          (store: any) =>
            String(store._id) === String(selectedStoreId)
        );

        if (!selectedStore) {
          setStoreCategory("");
          setSubcategories([]);
          return;
        }

        const category = selectedStore.category;

        if (!category) {
          setStoreCategory("");
          setSubcategories([]);
          return;
        }

        setStoreCategory(category);

        const subcategoryResponse =
          await getSubcategoryInfo(category);

        const details =
          subcategoryResponse?.data || [];

        const subcategoryList = details
          .map((item: any) => item.subCategory)
          .filter(Boolean);

        setSubcategories(subcategoryList);
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
  // LOAD MAIN PRODUCT
  // ==========================================

  useEffect(() => {
    const loadMainProduct = async () => {
      try {
        const storedMainProductId =
  sessionStorage.getItem("similarProductsMainId");

if (!storedMainProductId) {
  alert("Main product not found.");
  router.replace("/business-dashboard/product");
  return;
}

        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login again.");
          router.replace("/business-dashboard/product");
          return;
        }

        const response = await axios.get(
  `https://api.thover.in/v1/api/post/post/${storedMainProductId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        const mainProduct =
  response.data?.data ||
  response.data?.post ||
  response.data;

if (!mainProduct) {
  throw new Error("Main product details not found.");
}

if (!mainProduct.postId) {
  throw new Error("Main product postId not found.");
}

setPostId(mainProduct.postId);

        /*
          We copy the fields that should be the same as the
          main product.

          Color, inventory and image are intentionally kept empty
          because these must be entered separately for each
          similar product.
        */
        const prefilledProduct: SimilarProduct = {
          ...createEmptyProduct(),

          topic: mainProduct.topic || "",
          description: mainProduct.description || "",

          category: mainProduct.category || "",
          subCategory:
            mainProduct.subCategory ||
            mainProduct.category ||
            "",

          priceAmount:
            mainProduct.price?.amount != null
              ? String(mainProduct.price.amount)
              : "",
          priceCurrency:
            mainProduct.price?.currency || "INR",

          priceType:
            String(mainProduct.price?.priceType || "")
              .toLowerCase()
              .includes("set")
              ? "per_set"
              : "per_piece",

          idealFor: mainProduct.idealFor || "",

          discountTitle:
            mainProduct.discount?.title || "",
          discountType:
            mainProduct.discount?.type === "flat"
              ? "flat"
              : "percentage",
          discountValue:
            mainProduct.discount?.value != null
              ? String(mainProduct.discount.value)
              : "",
          discountExpiry:
            mainProduct.discount?.expiry
              ? new Date(
                  mainProduct.discount.expiry
                ).toISOString().slice(0, 16)
              : "",

          // Intentionally empty:
          color: "",
          customColor: "",
          inventory: [],
          mediaFiles: [],
        };

        setProducts([prefilledProduct]);
      } catch (error: any) {
        console.error(
          "LOAD MAIN PRODUCT ERROR:",
          error
        );
        console.error(
          "SERVER:",
          error.response?.data
        );

        alert(
          error.response?.data?.message ||
            error.message ||
            "Unable to load main product details."
        );

        router.replace("/business-dashboard/product");
      } finally {
        setLoadingMainProduct(false);
      }
    };

    loadMainProduct();
  }, [router]);

  const fileInputRefs = useRef<
    (HTMLInputElement | null)[]
  >([]);

  // ==========================================
  // ADD PRODUCT
  // ==========================================

  const addMoreProduct = () => {
    setProducts((prev) => [
      ...prev,
      createEmptyProduct(),
    ]);
  };
  const handleAddMore = () => {
  setProducts((prev) => [
    ...prev,
    {
      ...prev[0], // main product ki details copy
      mediaFiles: [],
      color: "",
      customColor: "",
      inventory: [],
    },
  ]);
};

  // ==========================================
  // REMOVE PRODUCT
  // ==========================================

  const removeProduct = (index: number) => {
    if (products.length === 1) return;

    setProducts((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // UPDATE PRODUCT
  // ==========================================

  const updateProduct = (
    index: number,
    field: keyof SimilarProduct,
    value: any
  ) => {
    setProducts((prev) =>
      prev.map((product, i) =>
        i === index
          ? {
              ...product,
              [field]: value,
            }
          : product
      )
    );
  };

  // ==========================================
  // INVENTORY
  // ==========================================

  const addInventory = (productIndex: number) => {
    setProducts((prev) =>
      prev.map((product, i) =>
        i === productIndex
          ? {
              ...product,
              inventory: [
                ...product.inventory,
                {
                  size: "M",
                  stock: 0,
                },
              ],
            }
          : product
      )
    );
  };

  const updateInventory = (
  productIndex: number,
  inventoryIndex: number,
  field: keyof InventoryItem,
  value: string
) => {
  if (field === "size") {
    const newSize = value.trim().toLowerCase();

    const currentProduct = products[productIndex];

    const duplicate = currentProduct.inventory.some(
      (item, i) =>
        i !== inventoryIndex &&
        item.size.trim().toLowerCase() === newSize &&
        newSize !== ""
    );

    if (duplicate) {
      alert("This inventory size already exists.");
      return;
    }
  }

  setProducts((prev) =>
    prev.map((product, i) => {
      if (i !== productIndex) return product;

      return {
        ...product,
        inventory: product.inventory.map((item, j) =>
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
    productIndex: number,
    inventoryIndex: number
  ) => {
    setProducts((prev) =>
      prev.map((product, i) =>
        i === productIndex
          ? {
              ...product,
              inventory: product.inventory.filter(
                (_, j) => j !== inventoryIndex
              ),
            }
          : product
      )
    );
  };

  // ==========================================
  // IMAGE
  // ==========================================

  const handleImage = async (
  productIndex: number,
  files: FileList | null
) => {
  if (!files || files.length === 0) return;

  const file = files[0];

  await saveImage(
    `similar_post_${productIndex}_image`,
    file
  );

  updateProduct(
    productIndex,
    "mediaFiles",
    [file]
  );
};

  // ==========================================
  // VALIDATE
  // ==========================================

  const validateProducts = () => {
    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      if (!product.topic.trim()) {
        alert(
          `Please enter product name for Similar Product ${
            i + 1
          }`
        );
        return false;
      }

      if (!product.description.trim()) {
        alert(
          `Please enter description for Similar Product ${
            i + 1
          }`
        );
        return false;
      }

      if (!product.priceAmount) {
        alert(
          `Please enter price for Similar Product ${
            i + 1
          }`
        );
        return false;
      }

      if (!product.color) {
        alert(
          `Please select color for Similar Product ${
            i + 1
          }`
        );
        return false;
      }

      if (
        product.color === "custom" &&
        !product.customColor.trim()
      ) {
        alert(
          `Please enter custom color for Similar Product ${
            i + 1
          }`
        );
        return false;
      }

      if (
        !product.inventory ||
        product.inventory.length === 0
      ) {
        alert(
          `Please add inventory for Similar Product ${
            i + 1
          }`
        );
        return false;
      }

      if (product.mediaFiles.length !== 1) {
        alert(
          `Please select exactly 1 image for Similar Product ${
            i + 1
          }`
        );
        return false;
      }
    }

    return true;
  };

  // ==========================================
  // REVIEW
  // ==========================================

  const handleReview = () => {
    if (!validateProducts()) return;

    sessionStorage.setItem(
      "similarProducts",
      JSON.stringify(
        products.map((product) => ({
          ...product,
          mediaFiles: [
            {
              name:
                product.mediaFiles[0]?.name || "",
              type:
                product.mediaFiles[0]?.type || "",
              size:
                product.mediaFiles[0]?.size || 0,
            },
          ],
        }))
      )
    );

    const currentPostId = postId;

if (!currentPostId) {
  alert("Main product postId not found.");
  return;
}

sessionStorage.setItem(
  "similarProductsPostId",
  currentPostId
);

    // Images can't be stored in sessionStorage.
    // We'll use IndexedDB in the review page.

    router.push(
      "/business-dashboard/product/similar-products/review"
    );
  };

  return (
  <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
    <main className="mx-auto w-full max-w-5xl min-w-0 overflow-x-hidden px-3 py-6 sm:px-4 sm:py-8 md:px-8">

      {/* HEADER */}
      <div className="mb-6 flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
            Add Similar Products
          </h1>

          <p className="text-sm text-slate-500">
            Add products similar to this product.
          </p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="w-full min-w-0 space-y-6">
        {products.map((product, index) => (
          <div
            key={index}
            className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          >

            {/* HEADER */}
            <div className="mb-5 flex min-w-0 items-center justify-between gap-3">
              <h2 className="min-w-0 truncate text-lg font-bold">
                Similar Product {index + 1}
              </h2>

              {products.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="flex shrink-0 items-center gap-1 text-sm text-red-500"
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">
                    Remove
                  </span>
                </button>
              )}
            </div>

            <div className="grid w-full min-w-0 gap-5 md:grid-cols-2">

              {/* PRODUCT NAME */}
              <div className="min-w-0 md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Product Name
                </label>

                <input
                  value={product.topic}
                  onChange={(e) =>
                    updateProduct(
                      index,
                      "topic",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Blue Cotton Shirt"
                  className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* PRICE */}
              <div className="min-w-0 md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Price
                </label>

                <div className="grid w-full min-w-0 grid-cols-[58px_minmax(0,1fr)_82px] gap-1.5 overflow-hidden">

                  {/* CURRENCY */}
                  <select
                    value={product.priceCurrency}
                    onChange={(e) =>
                      updateProduct(
                        index,
                        "priceCurrency",
                        e.target.value
                      )
                    }
                    className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-white px-1 py-3 text-xs sm:px-2 sm:text-sm"
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
                    value={product.priceAmount}
                    onChange={(e) =>
                      updateProduct(
                        index,
                        "priceAmount",
                        e.target.value
                      )
                    }
                    placeholder="Amount"
                    className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 px-2 py-3 text-sm"
                  />

                  {/* PRICE TYPE */}
                  <select
                    value={product.priceType}
                    onChange={(e) =>
                      updateProduct(
                        index,
                        "priceType",
                        e.target.value
                      )
                    }
                    className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-white px-1 py-3 text-[10px] sm:px-2 sm:text-sm"
                  >
                    <option value="per_piece">
                      Per Piece
                    </option>

                    <option value="per_set">
                      Per Set
                    </option>
                  </select>

                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="min-w-0 md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <input
                  value={product.description}
                  onChange={(e) =>
                    updateProduct(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Describe your product..."
                  className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 px-4 py-3"
                />
              </div>

              {/* CATEGORY + IDEAL FOR */}
              <div className="min-w-0 md:col-span-2">
                <div className="grid w-full min-w-0 grid-cols-2 gap-2 md:gap-5">

                  {/* CATEGORY */}
                  <div className="min-w-0">
                    <label className="mb-2 block text-sm font-medium">
                      Category
                    </label>

                    <select
                      value={product.category}
                      onChange={(e) =>
                        updateProduct(
                          index,
                          "category",
                          e.target.value
                        )
                      }
                      disabled={
                        loadingSubcategories ||
                        !storeCategory
                      }
                      className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-white px-2 py-3 text-xs sm:px-3 sm:text-sm"
                    >
                      <option value="">
                        {loadingSubcategories
                          ? "Loading..."
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
                  </div>

                  {/* IDEAL FOR */}
                  <div className="min-w-0">
                    <label className="mb-2 block text-sm font-medium">
                      Ideal For
                    </label>

                    <select
                      value={product.idealFor}
                      onChange={(e) =>
                        updateProduct(
                          index,
                          "idealFor",
                          e.target.value
                        )
                      }
                      className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-white px-2 py-3 text-xs sm:px-3 sm:text-sm"
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

              {/* COLOR */}
              <div className="min-w-0 md:col-span-2">

                <label className="mb-2 block text-sm font-medium">
                  Color
                </label>

                <div
                  className={
                    product.color === "custom"
                      ? "grid min-w-0 gap-2 md:grid-cols-2"
                      : "w-full min-w-0"
                  }
                >

                  <select
                    value={product.color}
                    onChange={(e) => {
                      const value = e.target.value;

                      updateProduct(
                        index,
                        "color",
                        value
                      );

                      if (value !== "custom") {
                        updateProduct(
                          index,
                          "customColor",
                          ""
                        );
                      }
                    }}
                    className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-white px-3 py-3"
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

                  {product.color === "custom" && (
                    <input
                      value={product.customColor}
                      onChange={(e) =>
                        updateProduct(
                          index,
                          "customColor",
                          e.target.value
                        )
                      }
                      placeholder="Enter custom color"
                      className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  )}

                </div>
              </div>

              {/* INVENTORY */}
              <div className="min-w-0 md:col-span-2">

                <div className="mb-3 flex items-center justify-between gap-2">
                  <label className="text-sm font-medium">
                    Inventory
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      addInventory(index)
                    }
                    className="shrink-0 text-sm font-semibold text-blue-600"
                  >
                    + Add Size
                  </button>
                </div>

                <div className="w-full min-w-0 space-y-3">
                  {product.inventory.map(
                    (item, inventoryIndex) => {

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
                        !standardSizes.includes(
                          item.size
                        );

                      return (
                        <div
                          key={inventoryIndex}
                          className="w-full min-w-0"
                        >

                          {/* NORMAL SIZE */}
                          {!isCustom && (
                            <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_55px] gap-2">

                              {/* SIZE */}
                              <select
                                value={item.size}
                                onChange={(e) => {
  const value = e.target.value;

  updateInventory(
    index,
    inventoryIndex,
    "size",
    value === "Custom" ? "Custom" : value
  );
}}
                                className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-white px-2 py-3 text-xs sm:text-sm"
                              >
                                <option value="">
                                  Select Size
                                </option>

                                {standardSizes.map(
                                  (size) => (
                                    <option
                                      key={size}
                                      value={size}
                                    >
                                      {size}
                                    </option>
                                  )
                                )}

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
                                className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 px-2 py-3 text-sm"
                              />

                            </div>
                          )}

                          {/* CUSTOM SIZE */}
                          {isCustom && (
                            <div className="grid w-full min-w-0 grid-cols-[70px_minmax(0,1fr)_55px] gap-1.5">

                              {/* CUSTOM SELECT */}
                              <select
  value="Custom"
  onChange={(e) => {
    const value = e.target.value;

    if (value === "Custom") {
      updateInventory(
        index,
        inventoryIndex,
        "size",
        ""
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
  className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-white px-1 py-3 text-[11px]"
>
  <option value="Custom">Custom</option>

  {standardSizes.map((size) => (
    <option key={size} value={size}>
      {size}
    </option>
  ))}
</select>

                              {/* CUSTOM SIZE INPUT */}
                              <input
  type="text"
  value={item.size === "Custom" ? "" : item.size}
  onChange={(e) =>
    updateInventory(
      index,
      inventoryIndex,
      "size",
      e.target.value
    )
  }
  placeholder="Custom"
  className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 px-2 py-3 text-xs outline-none focus:border-blue-500"
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
                                className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 px-2 py-3 text-sm"
                              />

                            </div>
                          )}

                          {/* REMOVE */}
                          {product.inventory.length >
                            1 && (
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
                    }
                  )}
                </div>
              </div>

              {/* IMAGE */}
              <div className="min-w-0 md:col-span-2">

                <label className="mb-2 block text-sm font-medium">
                  Product Image *
                </label>

                <input
                  ref={(el) => {
                    fileInputRefs.current[index] =
                      el;
                  }}
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImage(
                      index,
                      e.target.files
                    )
                  }
                  className="w-full min-w-0 max-w-full rounded-lg border border-gray-300 p-2 text-sm"
                />

                {product.mediaFiles.length > 0 && (
                  <div className="mt-3">

                    <div className="relative h-32 w-32 overflow-hidden rounded-lg border">

                      <img
                        src={URL.createObjectURL(
                          product.mediaFiles[0]
                        )}
                        alt="Product"
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          updateProduct(
                            index,
                            "mediaFiles",
                            []
                          );

                          if (
                            fileInputRefs.current[
                              index
                            ]
                          ) {
                            fileInputRefs.current[
                              index
                            ]!.value = "";
                          }
                        }}
                        className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white"
                      >
                        <X size={16} />
                      </button>

                    </div>

                    <p className="mt-1 max-w-full truncate text-xs text-gray-500">
                      {
                        product.mediaFiles[0]
                          .name
                      }
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
        onClick={handleAddMore}
        disabled={loadingMainProduct}
        className="mt-6 flex w-full min-w-0 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 py-4 text-sm font-semibold text-blue-600 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={18} />
        Add More Similar Product
      </button>

      {/* REVIEW */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleReview}
          disabled={loadingMainProduct}
          className="w-full rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {loadingMainProduct
            ? "Loading Product..."
            : "Review Similar Products"}
        </button>
      </div>

    </main>
  </div>
);
}