"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  Upload,
  ShoppingCart,
  RefreshCw,
} from "lucide-react";

const API_URL = "https://api.thover.in/v1/api";

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

export default function BulkUploadReviewPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<any[]>([]);
const [loading, setLoading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
const [imageUrls, setImageUrls] = useState<Record<number, string>>({});
const [uploadedPostCount, setUploadedPostCount] = useState(0);
const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const storedPosts =
      sessionStorage.getItem("bulkPosts");

    if (!storedPosts) {
      router.replace(
        "/business-dashboard/product/bulk-upload"
      );
      return;
    }

    setPosts(JSON.parse(storedPosts));
  }, [router]);

  useEffect(() => {
  if (posts.length === 0) return;
  

  const loadImages = async () => {
    const urls: Record<number, string> = {};

    for (let i = 0; i < posts.length; i++) {
      const image = await getImage(`post_${i}_image`);

      if (image) {
        urls[i] = URL.createObjectURL(image);
      }
    }

    setImageUrls(urls);
  };

  loadImages();

  return () => {
    Object.values(imageUrls).forEach((url) => {
      URL.revokeObjectURL(url);
    });
  };
}, [posts]);

useEffect(() => {
  fetchUploadedPostCount();
}, []);

const handleRefresh = async () => {
  try {
    setIsRefreshing(true);

    await fetchUploadedPostCount();

    // thoda time icon ko visible rakhe
    await new Promise((resolve) => setTimeout(resolve, 500));
  } finally {
    setIsRefreshing(false);
  }
};

const fetchUploadedPostCount = async () => {
  try {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    const response = await axios.get(
      `${API_URL}/post/user/${userId}/posts?page=1&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const totalCount =
      response.data?.data?.pagination?.totalCount || 0;

    setUploadedPostCount(totalCount);
  } catch (error) {
    console.error("Failed to fetch uploaded post count:", error);
  }
};


  const handleUpload = async () => {
  try {
    setLoading(true);
    setUploadProgress(0);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const selectedStoreId =
        localStorage.getItem("selectedStoreId");

      if (!selectedStoreId) {
        alert("Store not found.");
        return;
      }

      // ==========================================
      // CREATE POSTS
      // ==========================================

      const payload = posts.map((post) => ({
        topic: post.topic.trim(),

        description:
          post.description.trim(),

        price: {
          currency:
            post.priceCurrency || "INR",

          amount:
            Number(post.priceAmount),

          priceType:
            post.priceType || "fixed",
        },

        category:
          post.category,

        subCategory:
          post.subCategory,

        color:
  post.color === "custom"
    ? post.customColor
    : post.color,

        idealFor:
          post.idealFor || undefined,

        inventory:
          post.inventory.map(
            (item: any) => ({
              size: item.size,
              stock: Number(item.stock),
            })
          ),

        totalStock:
          post.inventory.reduce(
            (
              total: number,
              item: any
            ) =>
              total +
              Number(item.stock || 0),
            0
          ),

        status: "public",

        discount:
          post.discountValue
            ? {
                title:
                  post.discountTitle,

                expiry:
                  post.discountExpiry
                    ? new Date(
                        post.discountExpiry
                      ).toISOString()
                    : undefined,

                type:
                  post.discountType,

                value:
                  Number(
                    post.discountValue
                  ),
              }
            : undefined,

        store:
          selectedStoreId,

        area:
          post.area || undefined,

        tags:
          post.tags
            ? post.tags
                .split(",")
                .map(
                  (tag: string) =>
                    tag.trim()
                )
                .filter(Boolean)
            : [],
      }));

      console.log(
        "BULK CREATE PAYLOAD:",
        payload
      );

      const formData = new FormData();

formData.append(
  "posts",
  JSON.stringify(payload)
);

for (let i = 0; i < posts.length; i++) {
  const image = await getImage(`post_${i}_image`);

  if (!image) {
    throw new Error(
      `Image not found for Product ${i + 1}`
    );
  }

  formData.append(
    `post_${i}_image`,
    image,
    image.name
  );
}

const response = await axios.post(
  "https://api.thover.in/v2/api/post/bulk-create",
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    timeout: 10 * 60 * 1000, // 10 minutes

    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) /
            progressEvent.total
        );

        setUploadProgress(percent);
      }
    },
  }
);

      console.log(
        "BULK CREATE RESPONSE:",
        response.data
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Bulk upload failed."
        );
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      sessionStorage.removeItem(
        "bulkPosts"
      );

      alert(
        `${response.data.count} posts uploaded successfully.`
      );

      router.push(
        "/business-dashboard/product"
      );

    } catch (error: any) {
      console.error(
        "BULK UPLOAD ERROR:",
        error
      );

      console.error(
        "SERVER:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to upload posts."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">

        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              router.replace(
                "/business-dashboard/product/bulk-upload"
              )
            }
            className="
              flex h-10 w-10 items-center
              justify-center rounded-xl
              border bg-white
            "
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-bold">
              Review 
            </h1>

            <p className="text-sm text-slate-500">
              Review all products before uploading.
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
  <div className="flex items-center justify-between gap-4">

    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <ShoppingCart size={22} />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">
          Products Added
        </p>

        <p className="text-xs text-slate-500">
          {uploadedPostCount}{" "}
          {uploadedPostCount === 1 ? "product" : "products"} already uploaded
        </p>
      </div>
    </div>

   <button
  type="button"
  onClick={handleRefresh}
  disabled={isRefreshing}
  className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
>
  <RefreshCw
    size={17}
    className={isRefreshing ? "animate-spin" : ""}
  />

  {isRefreshing ? "Refreshing..." : "Refresh"}
</button>

  </div>
</div>

        <div className="space-y-4">

          {posts.map((post, index) => (
            <div
              key={index}
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
              "
            >
              <div className="flex items-start justify-between gap-5">

  {/* Product Image */}
  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
    {imageUrls[index] ? (
      <img
        src={imageUrls[index]}
        alt={post.topic}
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
        Loading...
      </div>
    )}
  </div>

  {/* Product Details */}
  <div className="flex-1">
    <p className="text-xs font-semibold text-blue-600">
      Product {index + 1}
    </p>

    <h2 className="mt-1 text-lg font-bold">
      {post.topic}
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      {post.description}
    </p>
  </div>

  <p className="font-bold">
    ₹{post.priceAmount}
  </p>

</div>

              <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">

                <div>
                  <span className="text-slate-400">
                    Category
                  </span>

                  <p className="font-medium">
                    {post.subCategory}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400">
                    Color
                  </span>

                  <p className="font-medium">
  {post.color === "custom"
    ? post.customColor || "-"
    : post.color || "-"}
</p>
                </div>

                <div>
                  <span className="text-slate-400">
                    Images
                  </span>

                  <p className="font-medium">
                    {post.mediaFiles?.length || 0}
                  </p>
                </div>

              </div>

              <div className="mt-4">
                <span className="text-sm text-slate-400">
                  Inventory
                </span>

                <div className="mt-2 flex flex-wrap gap-2">
                  {post.inventory?.map(
                    (
                      item: any,
                      i: number
                    ) => (
                      <span
                        key={i}
                        className="
                          rounded-lg
                          bg-slate-100
                          px-3 py-1.5
                          text-xs
                        "
                      >
                        {item.size}:{" "}
                        {item.stock}
                      </span>
                    )
                  )}
                </div>
              </div>

            </div>
          ))}

                </div>

        <div className="mt-8 flex justify-end">
  <button
    type="button"
    disabled={loading}
    onClick={handleUpload}
    className="
      flex items-center gap-2 rounded-xl
      bg-blue-600 px-8 py-3
      text-sm font-semibold text-white
      hover:bg-blue-700
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
  >
    <Upload size={18} />

    {loading
      ? `Uploading... ${uploadProgress}%`
      : `Upload ${posts.length} Posts`}
  </button>
</div>

{loading && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
          <Upload
            size={26}
            className="animate-pulse text-blue-600"
          />
        </div>

        <h2 className="text-lg font-bold text-slate-900">
          Uploading Products
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Please wait while your products are being uploaded.
        </p>
      </div>

      {/* Product Count */}
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">
          Products
        </span>

        <span className="font-semibold text-slate-900">
          {Math.round(
            (uploadProgress * posts.length) / 100
          )}{" "}
          / {posts.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${uploadProgress}%`,
            background:
              "linear-gradient(90deg,#2563EB,#7C3AED)",
          }}
        />
      </div>

      {/* Percentage */}
      <p className="mt-3 text-center text-2xl font-bold text-blue-600">
        {uploadProgress}%
      </p>

      <p className="mt-1 text-center text-xs text-slate-400">
        Do not close this page while uploading.
      </p>
    </div>
  </div>
)}

      </main>
    </div>
  );
}