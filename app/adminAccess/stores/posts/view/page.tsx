"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Tag,
  User,
  Store as StoreIcon,
  MapPin,
  ShoppingBag,
  Palette,
  Users,
  Layers,
  Calendar,
  Archive,
} from "lucide-react";
import api from "../../../../services/businessApi";

interface Media {
  mediaUrl?: string;
  mediaName?: string;
  mediaPath?: string;
  isDeleted?: boolean;
}

interface Post {
  _id: string;
  postId?: string;

  topic?: string;
  description?: string;
  category?: string;
  color?: string;
  idealFor?: string;
  area?: string;

  status?: string;
  isArchived?: boolean;
  reason?: string;

  media?: Media[];

  price?: {
    currency?: string;
    amount?: number;
    priceType?: string;
  };

  discount?: {
    title?: string;
    expiry?: string;
    type?: "percentage" | "flat";
    value?: number;
  };

  inventory?: {
    size: string;
    stock: number;
  }[];

  totalStock?: number;

  createdAt?: string;
  updatedAt?: string;

  tags?: string[];

  user?: {
    _id?: string;
    name?: string;
    username?: string;
    profileImage?: string;
    isVerified?: boolean;
  };

  store?: {
    _id?: string;
    storeId?: string;
    storeName?: string;
    isOnline?: boolean;
    isVerified?: boolean;
  };

  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pinCode?: string;
  };

  similarProducts?: {
    productId?: {
      _id?: string;
      postId?: string;
      topic?: string;
      media?: Media[];

      price?: {
        currency?: string;
        amount?: number;
        priceType?: string;
      };

      category?: string;
      color?: string;
      idealFor?: string;
      status?: string;
      isArchived?: boolean;
    };
  }[];
}

export default function AdminPostDetailsPage() {
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const selectedPostId =
      sessionStorage.getItem("selectedPostId");

    console.log(
      "Selected Post ID:",
      selectedPostId
    );

    if (!selectedPostId) {
      setError("Post ID not found");
      setLoading(false);
      return;
    }

    fetchPostDetails(selectedPostId);
  }, []);

  const fetchPostDetails = async (postId: string) => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching post:", postId);

      const { data } = await api.get(
        `https://api.thover.in/v1/api/admin-access/posts/${postId}`
      );

      console.log(
        "POST DETAIL RESPONSE:",
        data
      );

      if (data?.success) {
        setPost(data.data);
      } else {
        setError(
          data?.message ||
            "Unable to fetch post"
        );
      }
    } catch (error: any) {
      console.error(
        "FETCH POST DETAILS ERROR:",
        error.response?.data ||
          error.message ||
          error
      );

      setError(
        error.response?.data?.message ||
          "Unable to fetch post details"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-sm text-gray-500">
            Loading post details...
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <Package
              size={22}
              className="text-red-500"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Unable to load post
          </h2>

          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/adminAccess/stores/posts"
              )
            }
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <p className="text-sm text-gray-500">
          Post not found
        </p>
      </div>
    );
  }

  /* ---------------- DATA ---------------- */

  const activeMedia =
    post.media?.filter(
      (media) =>
        !media.isDeleted &&
        media.mediaUrl
    ) || [];

  const mainImage =
    activeMedia[0]?.mediaUrl;

  const getStatusStyles = () => {
    if (
      post.isArchived ||
      post.status === "archived"
    ) {
      return {
        wrapper:
          "bg-gray-100 text-gray-600",
        dot: "bg-gray-400",
        text: "Archived",
      };
    }

    if (post.status === "suspended") {
      return {
        wrapper:
          "bg-red-50 text-red-600",
        dot: "bg-red-500",
        text: "Suspended",
      };
    }

    return {
      wrapper:
        "bg-emerald-50 text-emerald-600",
      dot: "bg-emerald-500",
      text: "Public",
    };
  };

  const statusStyle =
    getStatusStyles();

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/adminAccess/stores/posts"
                )
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
                Post Details
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                Complete information about this post
              </p>
            </div>
          </div>

          <span
            className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle.wrapper}`}
          >
            <span
              className={`mr-2 h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
            />

            {statusStyle.text}
          </span>

          <button
  type="button"
  onClick={() => {
    sessionStorage.setItem(
      "selectedPostId",
      post._id
    );

    sessionStorage.setItem(
      "selectedStoreId",
      post.store?._id || ""
    );

    router.push("/adminAccess/stores/posts/orders");
  }}
  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
>
  <ShoppingBag size={17} />
  View All Orders
</button>
        </div>

        {/* ================================================= */}
        {/* MAIN POST */}
        {/* ================================================= */}

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">

          {/* ---------------- MEDIA ---------------- */}

          <div>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={
                    post.topic ||
                    "Post image"
                  }
                  className="h-[420px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[420px] items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Package
                      size={44}
                      className="mx-auto text-gray-400"
                    />

                    <p className="mt-3 text-sm text-gray-500">
                      No image available
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* THUMBNAILS */}

            {activeMedia.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {activeMedia.map(
                  (media, index) => (
                    <div
                      key={index}
                      className="h-20 overflow-hidden rounded-lg border border-gray-200 bg-white"
                    >
                      <img
                        src={media.mediaUrl}
                        alt={`Media ${
                          index + 1
                        }`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* ---------------- POST INFORMATION ---------------- */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* TITLE */}

            <div className="border-b border-gray-100 p-6">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                Post
              </p>

              <h2 className="text-2xl font-bold text-gray-900">
                {post.topic ||
                  "Untitled Post"}
              </h2>

              <p className="mt-1 break-all text-xs text-gray-400">
                ID:{" "}
                {post.postId ||
                  post._id}
              </p>
            </div>

            {/* DESCRIPTION */}

            <div className="border-b border-gray-100 p-6">
              <p className="mb-2 text-sm font-semibold text-gray-800">
                Description
              </p>

              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                {post.description ||
                  "No description available."}
              </p>
            </div>

            {/* BASIC INFORMATION */}

            <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2 lg:grid-cols-3">

              <InfoItem
                label="Category"
                value={
                  post.category || "-"
                }
              />

              <InfoItem
                label="Color"
                value={
                  post.color || "-"
                }
              />

              <InfoItem
                label="Ideal For"
                value={
                  post.idealFor || "-"
                }
              />

              {/* <InfoItem
                label="Area"
                value={
                  post.area || "-"
                }
              /> */}

              <InfoItem
                label="Status"
                value={
                  post.status ||
                  "public"
                }
              />

              <InfoItem
                label="Created At"
                value={
                  post.createdAt
                    ? new Date(
                        post.createdAt
                      ).toLocaleString()
                    : "-"
                }
              />

              <InfoItem
                label="Updated At"
                value={
                  post.updatedAt
                    ? new Date(
                        post.updatedAt
                      ).toLocaleString()
                    : "-"
                }
              />
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* PRICE + DISCOUNT */}
        {/* ================================================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* PRICE */}

          <SectionCard
            title="Pricing"
            icon={
              <ShoppingBag
                size={18}
              />
            }
          >
            <div className="grid grid-cols-2 gap-6">
              <InfoItem
                label="Price"
                value={`${
                  post.price
                    ?.currency ||
                  "₹"
                }${
                  post.price
                    ?.amount ?? 0
                }`}
                highlight
              />

              <InfoItem
                label="Price Type"
                value={
                  post.price
                    ?.priceType ||
                  "-"
                }
              />
            </div>
          </SectionCard>

          {/* DISCOUNT */}

          {post.discount && (
            <SectionCard
              title="Discount"
              icon={
                <Tag size={18} />
              }
            >
              <div className="grid grid-cols-2 gap-6">
                <InfoItem
                  label="Title"
                  value={
                    post.discount
                      .title || "-"
                  }
                />

                <InfoItem
                  label="Type"
                  value={
                    post.discount
                      .type || "-"
                  }
                />

                <InfoItem
                  label="Value"
                  value={
                    post.discount
                      .value !==
                    undefined
                      ? String(
                          post.discount
                            .value
                        )
                      : "-"
                  }
                />

                <InfoItem
                  label="Expiry"
                  value={
                    post.discount
                      .expiry
                      ? new Date(
                          post.discount
                            .expiry
                        ).toLocaleDateString()
                      : "-"
                  }
                />
              </div>
            </SectionCard>
          )}
        </div>

        {/* ================================================= */}
        {/* INVENTORY */}
        {/* ================================================= */}

        <div className="mt-6">
          <SectionCard
            title="Inventory"
            icon={
              <Layers size={18} />
            }
          >
            <div className="mb-5 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-sm text-gray-500">
                Total Stock
              </span>

              <span className="text-lg font-bold text-gray-900">
                {post.totalStock ??
                  0}
              </span>
            </div>

            {post.inventory &&
            post.inventory.length >
              0 ? (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="grid grid-cols-2 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <span>Size</span>
                  <span>Stock</span>
                </div>

                {post.inventory.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 border-t border-gray-100 px-4 py-3 text-sm"
                    >
                      <span className="text-gray-700">
                        {item.size}
                      </span>

                      <span className="font-semibold text-gray-900">
                        {item.stock}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No inventory details
                available.
              </p>
            )}
          </SectionCard>
        </div>

        {/* ================================================= */}
        {/* TAGS */}
        {/* ================================================= */}

        {post.tags &&
          post.tags.length > 0 && (
            <div className="mt-6">
              <SectionCard
                title="Tags"
                icon={
                  <Tag size={18} />
                }
              >
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(
                    (tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600"
                      >
                        #{tag}
                      </span>
                    )
                  )}
                </div>
              </SectionCard>
            </div>
          )}

        {/* ================================================= */}
        {/* USER + STORE */}
        {/* ================================================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* USER */}

          <SectionCard
            title="Posted By"
            icon={
              <User size={18} />
            }
          >
            <div className="flex items-center gap-4">
              {post.user
                ?.profileImage ? (
                <img
                  src={
                    post.user
                      .profileImage
                  }
                  alt={
                    post.user.name ||
                    "User"
                  }
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-100"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-600">
                  {(
                    post.user?.name ||
                    post.user
                      ?.username ||
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div>
                <p className="font-semibold text-gray-900">
                  {post.user?.name ||
                    "-"}
                </p>

                <p className="text-sm text-gray-500">
                  {post.user
                    ?.username ||
                    "-"}
                </p>

                {post.user
                  ?.isVerified && (
                  <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                    Verified User
                  </span>
                )}
              </div>
            </div>
          </SectionCard>

          {/* STORE */}

          <SectionCard
            title="Store"
            icon={
              <StoreIcon
                size={18}
              />
            }
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <InfoItem
                label="Store Name"
                value={
                  post.store
                    ?.storeName ||
                  "-"
                }
              />

              <InfoItem
                label="Store ID"
                value={
                  post.store
                    ?.storeId || "-"
                }
              />

              <InfoItem
                label="Verified"
                value={
                  post.store
                    ?.isVerified
                    ? "Yes"
                    : "No"
                }
              />

              <InfoItem
                label="Online"
                value={
                  post.store
                    ?.isOnline
                    ? "Yes"
                    : "No"
                }
              />
            </div>
          </SectionCard>
        </div>

        {/* ================================================= */}
        {/* ADDRESS */}
        {/* ================================================= */}

        {post.address && (
          <div className="mt-6">
            <SectionCard
              title="Address"
              icon={
                <MapPin size={18} />
              }
            >
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                <InfoItem
                  label="Street"
                  value={
                    post.address
                      .street || "-"
                  }
                />

                <InfoItem
                  label="City"
                  value={
                    post.address
                      .city || "-"
                  }
                />

                <InfoItem
                  label="State"
                  value={
                    post.address
                      .state || "-"
                  }
                />

                <InfoItem
                  label="Country"
                  value={
                    post.address
                      .country || "-"
                  }
                />

                <InfoItem
                  label="Pincode"
                  value={
                    post.address
                      .pinCode || "-"
                  }
                />
              </div>
            </SectionCard>
          </div>
        )}

        {/* ================================================= */}
        {/* ARCHIVED / REASON */}
        {/* ================================================= */}

        {(post.isArchived ||
          post.reason) && (
          <div className="mt-6">
            <SectionCard
              title="Post Status"
              icon={
                <Archive
                  size={18}
                />
              }
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <InfoItem
                  label="Archived"
                  value={
                    post.isArchived
                      ? "Yes"
                      : "No"
                  }
                />

                <InfoItem
                  label="Reason"
                  value={
                    post.reason || "-"
                  }
                />
              </div>
            </SectionCard>
          </div>
        )}

        {/* ================================================= */}
        {/* SIMILAR PRODUCTS */}
        {/* ================================================= */}

        {post.similarProducts &&
          post.similarProducts.length >
            0 && (
            <div className="mt-6">
              <SectionCard
                title="Similar Products"
                icon={
                  <Package
                    size={18}
                  />
                }
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {post.similarProducts.map(
                    (item, index) => {
                      const product =
                        item.productId;

                      if (!product) {
                        return null;
                      }

                      const productImage =
                        product.media?.find(
                          (media) =>
                            !media.isDeleted &&
                            media.mediaUrl
                        )?.mediaUrl;

                      return (
                        <div
                          key={
                            product._id ||
                            index
                          }
                          className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-300 hover:shadow-sm"
                        >
                          {/* IMAGE */}

                          <div className="h-40 bg-gray-100">
                            {productImage ? (
                              <img
                                src={
                                  productImage
                                }
                                alt={
                                  product.topic ||
                                  "Similar product"
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Package
                                  size={
                                    32
                                  }
                                  className="text-gray-400"
                                />
                              </div>
                            )}
                          </div>

                          {/* PRODUCT INFO */}

                          <div className="p-4">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                                {product.topic ||
                                  "Untitled Product"}
                              </h3>

                              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                                {product.status ||
                                  "public"}
                              </span>
                            </div>

                            <p className="mt-2 break-all text-xs text-gray-400">
                              ID:{" "}
                              {product.postId ||
                                product._id ||
                                "-"}
                            </p>

                            <div className="mt-3 flex items-center justify-between">
                              <span className="font-semibold text-gray-900">
                                {product
                                  .price
                                  ?.currency ||
                                  "₹"}
                                {product
                                  .price
                                  ?.amount ??
                                  0}
                              </span>

                              <span className="text-xs text-gray-500">
                                {product
                                  .category ||
                                  "-"}
                              </span>
                            </div>

                            {(product.color ||
                              product.idealFor) && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {product.color && (
                                  <span className="rounded-md bg-gray-100 px-2 py-1 text-[11px] text-gray-600">
                                    {product.color}
                                  </span>
                                )}

                                {product.idealFor && (
                                  <span className="rounded-md bg-gray-100 px-2 py-1 text-[11px] text-gray-600">
                                    {product.idealFor}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </SectionCard>
            </div>
          )}
      </div>
    </div>
  );
}

/* ================================================= */
/* SECTION CARD */
/* ================================================= */

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            {icon}
          </div>
        )}

        <h2 className="text-base font-semibold text-gray-900">
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}

/* ================================================= */
/* INFO ITEM */
/* ================================================= */

function InfoItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p
        className={`break-words ${
          highlight
            ? "text-xl font-bold text-blue-600"
            : "text-sm font-medium text-gray-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}