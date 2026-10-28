"use client";

import { useEffect, useState } from "react";
import {  useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
} from "lucide-react";

import {
  addSimilarProducts,
} from "@/app/services/businessProductApi";

const DB_NAME = "thoverSimilarProducts";
const STORE_NAME = "images";

const openImageDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request =
      indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (
        !db.objectStoreNames.contains(
          STORE_NAME
        )
      ) {
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

      const transaction =
        db.transaction(
          STORE_NAME,
          "readonly"
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      const request =
        store.get(key);

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



export default function SimilarProductsReviewPage() {
  const router = useRouter();

  const [postId, setPostId] = useState("");

  const [products, setProducts] =
    useState<any[]>([]);

  const [imageUrls, setImageUrls] =
    useState<Record<number, string>>({});

  const [loading, setLoading] =
    useState(false);

  const [uploadProgress, setUploadProgress] =
    useState(0);

  useEffect(() => {
  const storedPostId =
    sessionStorage.getItem("similarProductsPostId");

  if (!storedPostId) {
    alert("Main product not found.");
    router.replace("/business-dashboard/product");
    return;
  }

  setPostId(storedPostId);

  const storedProducts =
    sessionStorage.getItem("similarProducts");

  if (!storedProducts) {
    router.replace(
      "/business-dashboard/product/similar-products"
    );
    return;
  }

  setProducts(JSON.parse(storedProducts));
}, [router]);

  // ==========================================
  // LOAD IMAGES
  // ==========================================

  useEffect(() => {
    if (products.length === 0) return;

    const loadImages = async () => {
      const urls: Record<
        number,
        string
      > = {};

      for (
        let i = 0;
        i < products.length;
        i++
      ) {
        const image =
          await getImage(
            `similar_post_${i}_image`
          );

        if (image) {
          urls[i] =
            URL.createObjectURL(image);
        }
      }

      setImageUrls(urls);
    };

    loadImages();
  }, [products]);

  // ==========================================
  // UPLOAD
  // ==========================================

  const handleUpload = async () => {
    try {
      setLoading(true);
      setUploadProgress(0);

      const formData =
        new FormData();

      // --------------------------------------
      // PRODUCTS JSON
      // --------------------------------------

      const payload =
        products.map((product) => ({
          topic:
            product.topic.trim(),

          description:
            product.description.trim(),

          price: {
            currency:
              product.priceCurrency ||
              "INR",

            amount:
              Number(
                product.priceAmount
              ),

            priceType:
              product.priceType ||
              "per_piece",
          },

          category:
            product.category || undefined,

          subCategory:
            product.category ||
            undefined,

          color:
            product.color === "custom"
              ? product.customColor
              : product.color,

          idealFor:
            product.idealFor ||
            undefined,

          inventory:
            product.inventory.map(
              (item: any) => ({
                size: item.size,
                stock: Number(
                  item.stock || 0
                ),
              })
            ),

          totalStock:
            product.inventory.reduce(
              (
                total: number,
                item: any
              ) =>
                total +
                Number(
                  item.stock || 0
                ),
              0
            ),

          status: "public",

          discount:
            product.discountValue
              ? {
                  title:
                    product.discountTitle,

                  expiry:
                    product.discountExpiry
                      ? new Date(
                          product.discountExpiry
                        ).toISOString()
                      : undefined,

                  type:
                    product.discountType,

                  value:
                    Number(
                      product.discountValue
                    ),
                }
              : undefined,
        }));

      // ======================================
      // VERY IMPORTANT
      // Backend expects "products"
      // ======================================

      formData.append(
        "products",
        JSON.stringify(payload)
      );

      // ======================================
      // IMAGES
      // ======================================

      for (
        let i = 0;
        i < products.length;
        i++
      ) {
        const image =
          await getImage(
            `similar_post_${i}_image`
          );

        if (!image) {
          throw new Error(
            `Image not found for Similar Product ${
              i + 1
            }`
          );
        }

        formData.append(
          `similar_product_${i}_image`,
          image,
          image.name
        );
      }

      // ======================================
      // API
      // ======================================

      const response = await addSimilarProducts(
  postId,
  formData,
  (percent) => {
    setUploadProgress(percent);
  }
);

      console.log(
        "SIMILAR PRODUCT RESPONSE:",
        response
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to add similar products."
        );
      }

      // ======================================
      // SUCCESS
      // ======================================

      sessionStorage.removeItem(
        "similarProducts"
      );

      sessionStorage.removeItem(
        "similarProductsPostId"
      );

      alert(
        `${response.totalAdded} similar product(s) added successfully.`
      );

      router.push(
        "/business-dashboard/product"
      );
    } catch (error: any) {
      console.error(
        "SIMILAR PRODUCT UPLOAD ERROR:",
        error
      );

      console.error(
        "SERVER:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to add similar products."
      );
    } finally {
      setLoading(false);
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
              router.back()
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border bg-white"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-bold">
              Review Similar Products
            </h1>

            <p className="text-sm text-slate-500">
              Review all similar products before adding them.
            </p>
          </div>

        </div>

        {/* PRODUCTS */}

        <div className="space-y-4">

          {products.map(
            (product, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >

                <div className="flex items-start gap-5">

                  {/* IMAGE */}

                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">

                    {imageUrls[index] ? (
                      <img
                        src={
                          imageUrls[index]
                        }
                        alt={
                          product.topic
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">
                        Loading...
                      </div>
                    )}

                  </div>

                  {/* DETAILS */}

                  <div className="flex-1">

                    <p className="text-xs font-semibold text-blue-600">
                      Similar Product{" "}
                      {index + 1}
                    </p>

                    <h2 className="mt-1 text-lg font-bold">
                      {product.topic}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {product.description}
                    </p>

                  </div>

                  <p className="font-bold">
                    {product.priceCurrency ===
                    "USD"
                      ? "$"
                      : "₹"}
                    {
                      product.priceAmount
                    }
                  </p>

                </div>

                <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">

                  <div>
                    <span className="text-slate-400">
                      Category
                    </span>

                    <p className="font-medium">
                      {
                        product.category
                      }
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400">
                      Color
                    </span>

                    <p className="font-medium">
                      {product.color ===
                      "custom"
                        ? product.customColor
                        : product.color ||
                          "-"}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400">
                      Ideal For
                    </span>

                    <p className="font-medium">
                      {
                        product.idealFor ||
                        "-"
                      }
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400">
                      Image
                    </span>

                    <p className="font-medium">
                      1
                    </p>
                  </div>

                </div>

                {/* INVENTORY */}

                <div className="mt-4">

                  <span className="text-sm text-slate-400">
                    Inventory
                  </span>

                  <div className="mt-2 flex flex-wrap gap-2">

                    {product.inventory?.map(
                      (
                        item: any,
                        i: number
                      ) => (
                        <span
                          key={i}
                          className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs"
                        >
                          {item.size}:{" "}
                          {item.stock}
                        </span>
                      )
                    )}

                  </div>

                </div>

              </div>
            )
          )}

        </div>

        {/* BUTTON */}

        <div className="mt-8 flex justify-end">

          <button
            type="button"
            disabled={loading}
            onClick={handleUpload}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
          >

            <Upload size={18} />

            {loading
              ? `Adding... ${uploadProgress}%`
              : `Add ${products.length} Similar Products`}

          </button>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">

            <div className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-2xl">

              <div className="text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">

                  <Upload
                    size={26}
                    className="animate-pulse text-blue-600"
                  />

                </div>

                <h2 className="text-lg font-bold">
                  Adding Similar Products
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Please wait while products are being added.
                </p>

              </div>

              <div className="mt-6 flex justify-between text-sm">

                <span>
                  Products
                </span>

                <span className="font-semibold">
                  {Math.round(
                    (uploadProgress *
                      products.length) /
                      100
                  )}{" "}
                  / {products.length}
                </span>

              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">

                <div
  className="h-full rounded-full bg-blue-600 transition-all duration-300"
  style={{
    width: `${uploadProgress}%`,
  }}
/>

              </div>

              <p className="mt-3 text-center text-2xl font-bold text-blue-600">
                {uploadProgress}%
              </p>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}