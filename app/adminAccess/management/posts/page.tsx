
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Download,
  ImagePlus,
  Images,
  Loader2,
  MapPin,
  Search,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface PostMedia {
  _id?: string;
  mediaName: string;
  mediaUrl: string;
  mediaPath?: string;
  isDeleted?: boolean;
}

interface PostItem {
  _id: string;
  postId: string;
  topic: string;
  description?: string;
  category?: string;
  area?: string;
  city?: string;
  address?: string | {
    city?: string;
    cityName?: string;
    area?: string;
    street?: string;
    state?: string;
    country?: string;
    pinCode?: string;
  };
  addressDetails?: {
    name?: string;
    city?: string;
    area?: string;
    street?: string;
    state?: string;
    country?: string;
    pinCode?: string;
  };
  price?: {
    currency?: string;
    amount?: number;
    priceType?: string;
  };
  color?: string;
  idealFor?: string;
  inventory?: Array<{ size: string; stock: number }>;
  totalStock?: number;
  status?: string;
  createdAt?: string;
  media: PostMedia[];
}

export default function PostManagementPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [uploadingPostId, setUploadingPostId] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<
    Record<string, File[]>
  >({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  
const fetchPosts = useCallback(async () => {
  try {
    setLoading(true);
    setError("");
    setSuccess("");

    const url = new URL(
      "http://localhost:5000/v2/api/post/all-posts"
    );

    if (city.trim()) {
      url.searchParams.set("city", city.trim());
    }

    const token = localStorage.getItem("token");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || `Failed to fetch posts: ${response.status}`
      );
    }

    const fetchedPosts: PostItem[] = Array.isArray(data?.posts)
      ? data.posts
      : Array.isArray(data?.data?.posts)
        ? data.data.posts
        : [];

    // Keep only posts having exactly one active image.
    const filteredPosts = fetchedPosts.filter((post) => {
      const activeMedia = Array.isArray(post.media)
        ? post.media.filter(
            (media) =>
              media.isDeleted !== true &&
              typeof media.mediaUrl === "string" &&
              media.mediaUrl.trim() !== ""
          )
        : [];

      // This page is intended to show posts with exactly one active image.
      return activeMedia.length === 1;
    });

    console.log(
  "Posts received:",
  fetchedPosts.map((post) => ({
    postId: post.postId,
    topic: post.topic,
    area: post.area,
    address: post.address,
    addressDetails: post.addressDetails,
    city:
      post.addressDetails?.city ||
      (typeof post.address === "object" ? post.address?.city : undefined),
  }))
);

    setPosts(filteredPosts);
  } catch (err: unknown) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to fetch posts. Please check the API."
    );
  } finally {
    setLoading(false);
  }
}, [city]);


  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleFileChange = (
    postId: string,
    fileList: FileList | null
  ) => {
    if (!fileList) return;

    const files = Array.from(fileList);

    if (files.some((file) => !file.type.startsWith("image/"))) {
      setError("Please select image files only.");
      return;
    }

    setError("");
    setSelectedFiles((previous) => ({
      ...previous,
      [postId]: files,
    }));
  };

  
const handleUpload = async (postId: string) => {
  if (!postId || postId === "undefined") {
    setError("Post custom ID is missing from the API response.");
    return;
  }

  const files = selectedFiles[postId] || [];

  if (files.length === 0) {
    setError("Please select at least one image.");
    return;
  }

  try {
    setError("");
    setSuccess("");
    setUploadingPostId(postId);

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("media", file);
    });

    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://api.thover.in/v1/api/admin-access/posts/${encodeURIComponent(postId)}/media`,
      {
        method: "POST",
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Image upload failed.");
    }

    setSuccess(result.message || "Images uploaded successfully.");

    setSelectedFiles((previous) => ({
      ...previous,
      [postId]: [],
    }));

    await fetchPosts();
  } catch (err: unknown) {
    setError(
      err instanceof Error ? err.message : "Image upload failed."
    );
  } finally {
    setUploadingPostId("");
  }
};


  const downloadImage = async (
  media: PostMedia,
  postId: string
) => {
  try {
    setError("");

    if (!media._id) {
      throw new Error("Image ID is missing.");
    }

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please log in as an admin.");
    }

    const response = await fetch(
      `http://localhost:5000/v2/api/post/posts/${encodeURIComponent(postId)}/media/${encodeURIComponent(media._id)}/download`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(
        data?.message || "Image download failed."
      );
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = media.mediaName || `${postId}-image`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch (error) {
    console.error("Image download error:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Image download failed."
    );
  }
};

  const visiblePosts = posts.filter((post) => {
  const query = search.trim().toLowerCase();

  if (!query) return true;

  return (
    post.postId?.toLowerCase().includes(query) ||
    post.topic?.toLowerCase().includes(query) ||
    post.category?.toLowerCase().includes(query)
  );
});

  // Pagination is applied after search filtering.
  const totalPages = Math.max(1, Math.ceil(visiblePosts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedPosts = visiblePosts.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, city, pageSize]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => router.push("/adminAccess/management")}
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-700"
            >
              <ArrowLeft size={17} />
              Back to Management
            </button>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Post Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View posts, filter by city, download images and upload multiple images.
            </p>
          </div>

          <div className="flex h-12 items-center gap-2 rounded-xl border border-purple-100 bg-white px-4 shadow-sm">
            <Images className="text-purple-600" size={20} />
            <span className="text-sm font-semibold text-slate-700">
              {visiblePosts.length} Posts
            </span>
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1.5fr_auto] md:items-end">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Filter by city
            </label>

            <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-purple-500">
              <MapPin size={18} className="shrink-0 text-slate-400" />

              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") fetchPosts();
                }}
                placeholder="Enter city, e.g. Indore"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search posts
            </label>

            <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-purple-500">
              <Search size={18} className="shrink-0 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search post ID, topic or category"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={fetchPosts}
            disabled={loading}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Search size={17} />
            )}
            Apply Filter
          </button>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <span>{success}</span>
            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss success"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading && posts.length === 0 && (
          <div className="flex min-h-52 items-center justify-center gap-3 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={22} />
            Loading posts...
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && visiblePosts.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <Images className="mx-auto mb-4 text-slate-400" size={40} />
            <h2 className="font-semibold text-slate-800">
              No posts found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Try another city or search term. Posts without active images are not shown.
            </p>
          </div>
        )}

        {/* POST LIST */}
        <div className="space-y-6">
          {paginatedPosts.map((post) => {
            const activeMedia = (post.media || []).filter(
              (media) =>
                media.isDeleted !== true &&
                Boolean(media.mediaUrl)
            );

            const files = selectedFiles[post.postId] || [];
            const isUploading = uploadingPostId === post.postId;

            return (
              <section
                key={post._id || post.postId}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {/* POST DETAILS */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        {post.topic || "Untitled Post"}
                      </h2>

                      <span className="rounded-md bg-purple-50 px-2 py-1 text-xs font-semibold text-purple-700">
                        {post.postId}
                      </span>
                    </div>

                    {post.description && (
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        {post.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                      {post.category && (
                        <span>Category: {post.category}</span>
                      )}

                      {typeof post.price?.amount === "number" && (
                        <span>
                          Price: {post.price.currency || "₹"}{post.price.amount}
                          {post.price.priceType ? ` (${post.price.priceType})` : ""}
                        </span>
                      )}

                      {post.color && <span>Color: {post.color}</span>}
                      {post.idealFor && <span>Ideal for: {post.idealFor}</span>}
                      {typeof post.totalStock === "number" && (
                        <span>Total stock: {post.totalStock}</span>
                      )}
                      {post.status && <span>Status: {post.status}</span>}

                      <span className="inline-flex items-center gap-1">
                        <MapPin size={14} />
                        {post.addressDetails?.city ||
                          (typeof post.address === "object" ? post.address?.city : undefined) ||
                          post.city ||
                          post.area ||
                          post.addressDetails?.area ||
                          (typeof post.address === "object" ? post.address?.area : undefined) ||
                          "City not provided by API"}
                      </span>
                      {(post.addressDetails?.area || post.addressDetails?.street ||
                        (typeof post.address === "object" && (post.address?.area || post.address?.street))) && (
                        <span>
                          Address: {[post.addressDetails?.street || (typeof post.address === "object" ? post.address?.street : ""), post.addressDetails?.area || (typeof post.address === "object" ? post.address?.area : ""), post.addressDetails?.state || (typeof post.address === "object" ? post.address?.state : "")].filter(Boolean).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
                    {activeMedia.length} Active Images
                  </span>
                </div>

                {/* IMAGE GRID */}
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {activeMedia.map((media, index) => (
                      <div
                        key={media._id || `${post.postId}-${index}`}
                        className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                      >
                        <a
                          href={media.mediaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block aspect-square overflow-hidden bg-slate-100"
                        >
                          <img
                            src={media.mediaUrl}
                            alt={media.mediaName || post.topic}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </a>

                        <div className="p-2">
                          <p
                            className="truncate text-xs font-medium text-slate-700"
                            title={media.mediaName}
                          >
                            {media.mediaName || `Image ${index + 1}`}
                          </p>

                          <button
                            type="button"
                            onClick={() => downloadImage(media, post.postId)}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-semibold text-slate-600 hover:border-purple-200 hover:text-purple-700"
                          >
                            <Download size={14} />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* MULTIPLE IMAGE UPLOAD */}
                  <div className="mt-6 rounded-xl border border-dashed border-purple-200 bg-purple-50/50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <ImagePlus size={18} className="text-purple-600" />
                          Add Images to This Post
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Select multiple images. Maximum 10 per upload.
                        </p>
                      </div>

                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-purple-200 bg-white px-4 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-50">
                        <Upload size={16} />
                        Choose Images

                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(event) => {
                            const chosen = event.target.files;

                            if (chosen && chosen.length > 10) {
                              setError("Select a maximum of 10 images per upload.");
                              event.target.value = "";
                              return;
                            }

                            handleFileChange(post.postId, chosen);
                            event.target.value = "";
                          }}
                        />
                      </label>
                    </div>

                    {files.length > 0 && (
  <div className="mt-4 rounded-xl border border-purple-100 bg-white p-3">
    <div className="mb-3 flex items-center justify-between">
      <p className="text-sm font-semibold text-slate-800">
        Selected Images ({files.length})
      </p>

      <button
        type="button"
        onClick={() =>
          setSelectedFiles((previous) => ({
            ...previous,
            [post.postId]: [],
          }))
        }
        className="text-xs font-medium text-red-600 hover:text-red-700"
      >
        Remove all
      </button>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {files.map((file, index) => (
        <div
          key={`${file.name}-${file.lastModified}-${index}`}
          className="overflow-hidden rounded-lg border border-slate-200"
        >
          <div className="aspect-square bg-slate-100">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex items-center justify-between gap-2 p-2">
            <p
              className="truncate text-xs text-slate-600"
              title={file.name}
            >
              {file.name}
            </p>

            <button
              type="button"
              aria-label={`Remove ${file.name}`}
              onClick={() =>
                setSelectedFiles((previous) => ({
                  ...previous,
                  [post.postId]: (previous[post.postId] || []).filter(
                    (_, fileIndex) => fileIndex !== index
                  ),
                }))
              }
              className="shrink-0 text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-4 flex justify-end">
      <button
        type="button"
        onClick={() => handleUpload(post.postId)}
        disabled={isUploading}
        className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
      >
        {isUploading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Upload size={16} />
        )}
        {isUploading ? "Uploading..." : "Upload Images"}
      </button>
    </div>
  </div>
)}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* PAGINATION */}
        {visiblePosts.length > 0 && (
          <div className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span>
                Showing {(safeCurrentPage - 1) * pageSize + 1}–
                {Math.min(safeCurrentPage * pageSize, visiblePosts.length)} of {visiblePosts.length} posts
              </span>
              <label className="flex items-center gap-2">
                <span>Per page</span>
                <select
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 outline-none focus:border-purple-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </label>
            </div>

            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="min-w-20 text-center text-sm text-slate-600">
                Page {safeCurrentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={safeCurrentPage >= totalPages}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
