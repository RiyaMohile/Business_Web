"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, Search } from "lucide-react";
import { getStoreProducts } from "../../../services/businessProductApi";

interface Post {
  _id: string;
  postId?: string;

  topic?: string;
  description?: string;
  category?: string;

  status?: string;
  isArchived?: boolean;

  media?: {
    mediaUrl?: string;
    mediaName?: string;
    mediaPath?: string;
    isDeleted?: boolean;
  }[];

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
}

interface Store {
  _id: string;
  storeId: string;
  storeName: string;
}

export default function StorePostsPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [store, setStore] = useState<Store | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const postsPerPage = 10;

  useEffect(() => {
    fetchStorePosts();
  }, []);

  const fetchStorePosts = async () => {
    try {
      setLoading(true);
      setError("");

      const storeId =
        sessionStorage.getItem(
          "selectedStoreId"
        );

      if (!storeId) {
        setError("Store ID not found");
        return;
      }

      console.log(
        "Fetching posts for store:",
        storeId
      );

      const data = await getStoreProducts(
        storeId,
        1,
        100
      );

      console.log(
        "STORE POSTS RESPONSE:",
        data
      );

      if (
        data?.success &&
        Array.isArray(data?.data?.posts)
      ) {
        setPosts(data.data.posts);
      } else if (
        data?.success &&
        Array.isArray(data?.posts)
      ) {
        setPosts(data.posts);
      } else {
        setPosts([]);
      }

      /*
       * Store information may be available
       * depending on API response.
       */
      if (data?.data?.store) {
        setStore(data.data.store);
      } else if (data?.store) {
        setStore(data.store);
      }
    } catch (error: any) {
      console.error(
        "FETCH STORE POSTS ERROR:",
        error.response?.data ||
          error.message ||
          error
      );

      setError(
        error.response?.data?.message ||
          "Unable to fetch store posts"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * SEARCH
   */

  const filteredPosts = posts.filter(
    (post) => {
      const searchText =
        search.toLowerCase().trim();

      if (!searchText) {
        return true;
      }

      return (
        post.topic
          ?.toLowerCase()
          .includes(searchText) ||
        post.category
          ?.toLowerCase()
          .includes(searchText) ||
        post.description
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

  /*
   * PAGINATION
   */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredPosts.length /
        postsPerPage
    )
  );

  const paginatedPosts =
    filteredPosts.slice(
      (currentPage - 1) *
        postsPerPage,
      currentPage *
        postsPerPage
    );

  /*
   * LOADING
   */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-sm text-gray-500">
            Loading store posts...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ERROR
   */

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-red-500">
            {error}
          </p>

          <button
            onClick={() =>
              router.push(
                "/adminAccess/stores/view"
              )
            }
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-start gap-3">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/adminAccess/stores/view"
              )
            }
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Store Posts
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {store?.storeName ||
                "Selected Store"}
            </p>

            {store?.storeId && (
              <p className="mt-0.5 text-xs text-gray-400">
                Store ID: {store.storeId}
              </p>
            )}
          </div>

        </div>

        <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
          <p className="text-xs text-gray-500">
            Total Posts
          </p>

          <p className="text-xl font-bold text-gray-900">
            {filteredPosts.length}
          </p>
        </div>

      </div>

      {/* SEARCH */}

      <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search posts by name, category or description..."
            className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

      </div>

      {/* NO POSTS */}

      {filteredPosts.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <Package
              size={26}
              className="text-gray-400"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No Posts Found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            This store does not have any
            matching posts.
          </p>

        </div>
      ) : (

        /* POSTS */

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          {/* DESKTOP HEADER */}

          <div className="hidden grid-cols-[2fr_1fr_120px_100px_80px] gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 text-sm font-semibold text-gray-600 md:grid">

            <span>Post</span>
            <span>Category</span>
            <span>Price</span>
            <span>Status</span>
            <span>Stock</span>

          </div>

          {/* POSTS */}

          {paginatedPosts.map(
            (post, index) => {

              const image =
                post.media?.find(
                  (media) =>
                    !media.isDeleted &&
                    media.mediaUrl
                )?.mediaUrl;

              return (
                <div
  key={post._id}
  onClick={() => {
    sessionStorage.setItem("selectedPostId", post._id);
    router.push("/adminAccess/stores/posts/view");
  }}
  className="cursor-pointer border-b border-gray-100 px-4 py-4 transition hover:bg-gray-50 last:border-b-0 md:grid md:grid-cols-[2fr_1fr_120px_100px_80px] md:items-center md:gap-4 md:px-5"
>

                  {/* POST */}

                  <div className="flex min-w-0 items-center gap-4">

                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                      {image ? (
                        <img
                          src={image}
                          alt={
                            post.topic ||
                            "Post"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package
                            size={25}
                            className="text-gray-400"
                          />
                        </div>
                      )}

                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate text-sm font-semibold text-gray-900 md:text-base">
                        {post.topic ||
                          "Untitled Post"}
                      </h3>

                      {post.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-gray-500 md:text-sm">
                          {post.description}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-gray-400">
                        Post ID:{" "}
                        {post.postId ||
                          post._id}
                      </p>

                    </div>

                  </div>

                  {/* CATEGORY */}

                  <div className="mt-3 md:mt-0">

                    <p className="text-xs text-gray-400 md:hidden">
                      Category
                    </p>

                    <p className="text-sm text-gray-600">
                      {post.category ||
                        "Other"}
                    </p>

                  </div>

                  {/* PRICE */}

                  <div className="mt-3 md:mt-0">

                    <p className="text-xs text-gray-400 md:hidden">
                      Price
                    </p>

                    <p className="text-sm font-semibold text-gray-900">
                      {post.price
                        ?.currency ||
                        "₹"}
                      {post.price
                        ?.amount ??
                        0}
                    </p>

                  </div>

                  {/* STATUS */}

                  <div className="mt-3 md:mt-0">

                    <p className="text-xs text-gray-400 md:hidden">
                      Status
                    </p>

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        post.isArchived ||
                        post.status ===
                          "archived"
                          ? "bg-gray-100 text-gray-500"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {post.isArchived ||
                      post.status ===
                        "archived"
                        ? "Archived"
                        : "Public"}
                    </span>

                  </div>

                  {/* STOCK */}

                  <div className="mt-3 md:mt-0">

                    <p className="text-xs text-gray-400 md:hidden">
                      Stock
                    </p>

                    <p className="text-sm font-semibold text-gray-700">
                      {post.totalStock ??
                        0}
                    </p>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

      {/* PAGINATION */}

      {filteredPosts.length > postsPerPage && (
        <div className="mt-5 flex items-center justify-between rounded-xl bg-white px-5 py-4 shadow-sm">

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {(currentPage - 1) *
                postsPerPage +
                1}
            </span>{" "}
            -{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(
                currentPage *
                  postsPerPage,
                filteredPosts.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {filteredPosts.length}
            </span>
          </p>

          <div className="flex items-center gap-2">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1
                    )
                )
              }
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-2 text-sm text-gray-600">
              {currentPage} /{" "}
              {totalPages}
            </span>

            <button
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                )
              }
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>
      )}

    </div>
  );
}