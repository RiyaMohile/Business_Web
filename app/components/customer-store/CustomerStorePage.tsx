"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Store as StoreIcon,
  Heart,
  Share2,
  ChevronDown,
  Loader2,
  X,
  UserRound,
} from "lucide-react";

import { getStoreDetailsWithProducts, toggleStoreLike, getLikedStores } from "../../services/storeApi";
import AddressModal from "../address/AddressModal";
import Navbar from "../Navbar";

interface Store {
  storeId: string;
  storeName: string;
  category: string;
  address?: {
    addressId?: string;
    area?: string;
    city?: string;
  };
}

interface Product {
  _id: string;
  postId: string;
  topic: string;
  description: string;
  media: {
    mediaName: string;
    mediaUrl: string;
    mediaPath: string;
    isDeleted: boolean;
  }[];
  price?: {
    currency?: string;
    amount?: number;
    priceType?: string;
  };
  category?: string;
  color?: string;
  idealFor?: string;
  inventory?: {
    size: string;
    stock: number;
    lastUpdated: string;
  }[];
  totalStock: number;
  status: "public" | "suspended";
  isArchived: boolean;
  reason?: string;
  user: string;
  store: string;
  discount?: {
    title?: string;
    expiry?: string;
    type?: "percentage" | "flat";
    value?: number;
  };
  area?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void;
}) {
  const name = product.topic || "Product";

  const image = product.media?.find(
    (media) => !media.isDeleted
  )?.mediaUrl;

  const price = product.price?.amount;
  const isInStock = product.totalStock > 0;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer overflow-hidden rounded-xl border border-[#E3E7EF] bg-white transition hover:shadow-md"
    >
      <div className="flex aspect-square items-center justify-center bg-white p-3">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#F8F9FC] text-[11px] text-[#8B99B8]">
            No Image
          </div>
        )}
      </div>

      <div className="px-3 pb-3">
        <h3 className="line-clamp-2 min-h-[30px] text-[11px] font-semibold leading-tight text-[#172554] sm:text-xs">
          {name}
        </h3>

        {price !== undefined && (
          <p className="mt-1 text-[13px] font-bold text-[#172554]">
            {product.price?.currency === "INR" ? "₹" : ""}
            {price}
          </p>
        )}

        <p
          className={`mt-0.5 text-[9px] font-medium ${
            isInStock ? "text-[#16A34A]" : "text-red-500"
          }`}
        >
          {isInStock ? "In Stock" : "Out of Stock"}
        </p>
      </div>
    </div>
  );
}

interface CustomerStorePageProps {
  storeId: string;
}

interface LikedStore {
  _id: string;
  storeId: string;
  storeName: string;
  category: string;
  status?: "public" | "suspended";
  isOnline?: boolean;
  isVerified?: boolean;
  address?: {
    addressId?: string;
    area?: string;
    city?: string;
  };
}

export default function CustomerStorePage({
  storeId,
}: CustomerStorePageProps) {
  const router = useRouter();

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  const [userCity, setUserCity] = useState("");
  const [addressId, setAddressId] = useState<string | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
const [likedStores, setLikedStores] = useState<LikedStore[]>([]);
const [likedStoresLoading, setLikedStoresLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
  const token = localStorage.getItem("token");
  setIsLoggedIn(!!token);
}, []);

const [isLiked, setIsLiked] = useState(false);
const [likeLoading, setLikeLoading] = useState(false);
const [likeCount, setLikeCount] = useState(0);

const handleLikeStore = async () => {
  // User logged in nahi hai
  if (!isLoggedIn) {
    sessionStorage.setItem("pendingStoreId", storeId);

    router.push(`/login?storeId=${storeId}`);

    return;
  }

  try {
    setLikeLoading(true);

    const response = await toggleStoreLike(storeId);

    if (!response?.success) {
      throw new Error(
        response?.message || "Unable to update store like"
      );
    }

    setIsLiked(response.data?.liked ?? false);
    setLikeCount(response.data?.likeCount ?? 0);
  } catch (error: any) {
    console.error("LIKE STORE ERROR:", error);

    if (
      error?.response?.status === 401 ||
      error?.response?.status === 403
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");

      sessionStorage.setItem("pendingStoreId", storeId);

      router.push(`/login?storeId=${storeId}`);

      return;
    }

    console.error(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to like store"
    );
  } finally {
    setLikeLoading(false);
  }
};



const handleProductClick = (productId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    setSelectedProductId(productId);
    setShowLoginPopup(true);
    return;
  }

  router.push(`/products/details?postId=${productId}`);
};



const fetchLikedStores = async () => {
  try {
    setLikedStoresLoading(true);

    const response = await getLikedStores();

    if (!response?.success) {
      throw new Error(
        response?.message || "Unable to fetch liked stores"
      );
    }

    const stores = response.data || [];

    setLikedStores(stores);

    // Check whether current store is liked
    const currentStore = stores.find(
      (likedStore: LikedStore) =>
        likedStore.storeId === storeId
    );

    setIsLiked(!!currentStore);
  } catch (error: any) {
    console.error(
      "FETCH LIKED STORES ERROR:",
      error
    );

    if (
      error?.response?.status === 401 ||
      error?.response?.status === 403
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");

      setIsLiked(false);
      setIsLoggedIn(false);
    }
  } finally {
    setLikedStoresLoading(false);
  }
};

const handleShareStore = async () => {
  const storeLink = `https://thover.in/store?storeId=${storeId}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: store?.storeName || "Thover Store",
        text: `Check out this store on Thover`,
        url: storeLink,
      });
    } catch (error) {
      console.log("Share cancelled");
    }
  } else {
    await navigator.clipboard.writeText(storeLink);
    alert("Store link copied!");
  }
};

  // ======================================================
  // CITY FROM ADDRESS COORDINATES
  // ======================================================

  const fetchCityFromCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );

      if (!response.ok) return;

      const data = await response.json();

      const city =
        data?.city ||
        data?.locality ||
        data?.principalSubdivision ||
        "";

      setUserCity(city);
    } catch (error) {
      console.error("FETCH CITY ERROR:", error);
    }
  };

  // ======================================================
  // FETCH CUSTOMER ADDRESS
  // ======================================================

  const fetchCustomerAddress = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        sessionStorage.setItem("pendingStoreId", storeId);
        router.replace(`/login?storeId=${storeId}`);
        return false;
      }

      const response = await fetch(
        "https://api.thover.in/v1/api/address/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to fetch addresses.");
      }

      const data = await response.json();
      const addresses = data?.data || [];

      if (!Array.isArray(addresses) || addresses.length === 0) {
        setAddressId(null);
        setShowAddressModal(true);
        return false;
      }

      const selectedAddress =
        addresses.find(
          (address: any) => address?.isPrimary === true
        ) || addresses[0];

      if (!selectedAddress?._id) {
        setAddressId(null);
        setShowAddressModal(true);
        return false;
      }

      setAddressId(selectedAddress._id);

      if (
        selectedAddress?.latitude !== undefined &&
        selectedAddress?.longitude !== undefined
      ) {
        await fetchCityFromCoordinates(
          Number(selectedAddress.latitude),
          Number(selectedAddress.longitude)
        );
      } else if (selectedAddress?.city) {
        setUserCity(selectedAddress.city);
      }

      return true;
    } catch (error) {
      console.error("FETCH CUSTOMER ADDRESS ERROR:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Unable to fetch address."
      );
      setShowAddressModal(true);
      return false;
    }
  };

  // ======================================================
  // FETCH STORE
  // ======================================================

  const fetchStore = async () => {
  try {
    setLoading(true);
    setCheckingAuth(true);
    setError("");

    const response =
      await getStoreDetailsWithProducts(storeId);

    if (!response?.success) {
      throw new Error(
        response?.message || "Store not found"
      );
    }

    const storeData = response.data?.store || null;
    const productData = response.data?.products || [];

    setStore(storeData);
    setProducts(productData);

    // Store ka city directly use karo
    if (storeData?.address?.city) {
      setUserCity(storeData.address.city);
    }
  } catch (error: any) {
    console.error("STORE FETCH ERROR:", error);

    setError(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to load store"
    );
  } finally {
    setLoading(false);
    setCheckingAuth(false);
  }
};

  useEffect(() => {
  if (!storeId) {
    setLoading(false);
    setCheckingAuth(false);
    return;
  }

  const token = localStorage.getItem("token");

  setIsLoggedIn(!!token);

  fetchStore();

  if (token) {
    fetchLikedStores();
  }
}, [storeId]);

  // ======================================================
  // ADDRESS CREATED
  // ======================================================

  const handleAddressCreated = async (newAddressId: string) => {
    setAddressId(newAddressId);
    setShowAddressModal(false);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (
        token &&
        newAddressId
      ) {
        const response = await fetch(
          "https://api.thover.in/v1/api/address/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const addresses = data?.data || [];

          const selectedAddress =
            addresses.find(
              (address: any) =>
                address?._id === newAddressId
            ) ||
            addresses.find(
              (address: any) =>
                address?.isPrimary === true
            ) ||
            addresses[0];

          if (
            selectedAddress?.latitude !== undefined &&
            selectedAddress?.longitude !== undefined
          ) {
            await fetchCityFromCoordinates(
              Number(selectedAddress.latitude),
              Number(selectedAddress.longitude)
            );
          } else if (selectedAddress?.city) {
            setUserCity(selectedAddress.city);
          }
        }
      }

      const response =
        await getStoreDetailsWithProducts(storeId);

      if (!response?.success) {
        throw new Error(
          response?.message || "Store not found"
        );
      }

      setStore(response.data?.store || null);
      setProducts(response.data?.products || []);
    } catch (error: any) {
      console.error(
        "LOAD STORE AFTER ADDRESS ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load store"
      );
    }
  };

  // ======================================================
  // SEARCH
  // ======================================================

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  // ======================================================
  // CATEGORIES
  // ======================================================

  const categories = useMemo(() => {
    const categorySet = new Set<string>();

    products.forEach((product) => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });

    return ["All", ...Array.from(categorySet)];
  }, [products]);

  // ======================================================
  // FILTER PRODUCTS
  // ======================================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const name = product.topic || "";

      const matchesSearch = name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  // ======================================================
  // STORE ID MISSING
  // ======================================================

  if (!storeId) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-[#F8FAFD]">
        <p className="text-sm text-slate-500">
          Store ID is missing.
        </p>
      </main>
    );
  }

  // ======================================================
  // AUTH CHECK / INITIAL LOADING
  // ======================================================

  if (checkingAuth) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-[#F8FAFD]">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={32}
            className="animate-spin text-[#6D28D9]"
          />

          <p className="text-sm text-slate-500">
            Checking account...
          </p>
        </div>
      </main>
    );
  }

  // ======================================================
  // ADDRESS MODAL ONLY
  // ======================================================

  if (showAddressModal && !store) {
    return (
      <main className="min-h-[100dvh] bg-[#F8FAFD]">
        <AddressModal
          onSuccess={handleAddressCreated}
        />
      </main>
    );
  }

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <main className="min-h-[100dvh] bg-[#F8FAFD]">
        <div className="mx-auto max-w-[620px] px-3 py-3">
          <div className="animate-pulse rounded-xl bg-white p-4">
            <div className="flex gap-4">
              <div className="h-14 w-14 rounded-full bg-slate-200" />

              <div className="flex-1">
                <div className="h-5 w-48 rounded bg-slate-200" />
                <div className="mt-2 h-3 w-32 rounded bg-slate-200" />
                <div className="mt-2 h-3 w-56 rounded bg-slate-200" />
              </div>
            </div>
          </div>

          <div className="mt-3 h-10 animate-pulse rounded-xl bg-white" />

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-48 animate-pulse rounded-xl bg-white"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error || !store) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-[#F8FAFD] px-5">
        <div className="text-center">
          <StoreIcon className="mx-auto h-12 w-12 text-[#6D28D9]" />

          <h1 className="mt-4 text-xl font-bold text-[#111827]">
            Store Not Found
          </h1>

          <p className="mt-2 text-sm text-[#7182A6]">
            {error || "This store does not exist."}
          </p>
        </div>
      </main>
    );
  }

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <main className="min-h-[100dvh] bg-[#F8FAFD]">
      {/* =================================================
          DESKTOP HEADER
      ================================================= */}

    {isLoggedIn && (
  <Navbar
    search={search}
    onSearchChange={handleSearch}
    searchLoading={false}
    city={userCity}
    onLocationClick={() => {
      setShowAddressModal(true);
    }}
  />
)}

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div
  className={
    isLoggedIn
      ? "pt-[160px] lg:pt-[110px]"
      : "pt-3"
  }
>
        <div className="mx-auto w-full max-w-[620px] px-2 py-2 sm:max-w-[1100px] sm:px-4">

          {/* ========================================
              STORE HEADER
          ======================================== */}

          <section className="rounded-xl border border-[#E7EAF1] bg-white px-3 py-3 shadow-sm sm:px-5 sm:py-4">
            <div className="flex items-center justify-between gap-3">

              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F0EBFF]">
                  <StoreIcon className="h-7 w-7 text-[#1E2365]" />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-[17px] font-bold text-[#172554] sm:text-[20px]">
                    {store.storeName}
                  </h1>

                  <p className="text-[11px] text-[#7182A6] sm:text-xs">
                    {store.category}
                  </p>

                  {(store.address?.area ||
                    store.address?.city) && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-[#7182A6] sm:text-xs">
                      <MapPin className="h-3 w-3 shrink-0" />

                      <span className="truncate">
                        {store.address?.area}
                        {store.address?.area &&
                        store.address?.city
                          ? ", "
                          : ""}
                        {store.address?.city}
                      </span>
                    </div>
                  )}
                </div>
              </div>

             <div className="flex shrink-0 items-center gap-4">
  {/* Like */}
  <button
    type="button"
    onClick={handleLikeStore}
    disabled={likeLoading}
    className="flex items-center justify-center text-[#98A2B3] transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
    title={isLiked ? "Unlike Store" : "Like Store"}
  >
    {likeLoading ? (
      <Loader2 className="h-5 w-5 animate-spin" />
    ) : (
      <Heart
        className={`h-6 w-6 transition ${
          isLiked
            ? "fill-[#E91E63] text-[#E91E63]"
            : "text-[#98A2B3]"
        }`}
      />
    )}
  </button>

  {/* Share */}
  <button
    type="button"
    onClick={handleShareStore}
    className="flex items-center justify-center text-[#101828] transition hover:scale-110"
    title="Share Store"
  >
    <Share2 className="h-5 w-5" />
  </button>
</div>
            </div>
          </section>

          {/* ========================================
              STORE SEARCH
          ======================================== */}

          {/* <div className="mt-3">
            <div className="flex h-10 items-center rounded-xl border border-[#E1E5EF] bg-white px-3">
              <Search className="h-4 w-4 text-[#7182A6]" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products in this store..."
                className="ml-2 min-w-0 flex-1 bg-transparent text-[11px] text-[#172554] outline-none placeholder:text-[#8B99B8]"
              />
            </div>
          </div> */}

          {/* ========================================
              CATEGORY FILTER
          ======================================== */}

          <div className="scrollbar-hide mt-6 flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => {
              const active =
                selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`
                    flex h-8 shrink-0 items-center
                    rounded-full px-4
                    text-[12px] font-medium
                    transition
                    ${
                      active
                        ? "bg-[#6D28D9] text-white"
                        : "border border-[#E2E6EF] bg-white text-[#172554]"
                    }
                  `}
                >
                  {category}

                  {category === "More" && (
                    <ChevronDown className="ml-1 h-3 w-3" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ========================================
              PRODUCTS
          ======================================== */}

          <section className="mt-2">
            {filteredProducts.length === 0 ? (
              <div className="rounded-xl border border-[#E5E8F0] bg-white py-14 text-center">
                <Search className="mx-auto h-8 w-8 text-[#B8C0D4]" />

                <h2 className="mt-3 text-base font-bold text-[#172554]">
                  No products found
                </h2>

                <p className="mt-1 text-xs text-[#7182A6]">
                  Try another search or category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
  key={product._id}
  product={product}
  onClick={() => handleProductClick(product._id)}
/>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* =================================================
          ADDRESS MODAL
      ================================================= */}

      {showAddressModal && (
        <AddressModal
          onSuccess={handleAddressCreated}
        />
      )}


      {showLoginPopup && (
  <div
    className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 px-4"
    onClick={() => setShowLoginPopup(false)}
  >
    <div
      className="relative w-full max-w-[380px] rounded-2xl bg-white p-6 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close */}
      <button
        type="button"
        onClick={() => setShowLoginPopup(false)}
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
      >
        <X size={20} />
      </button>

      {/* Content */}
      <div className="pt-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1EAFE]">
          <UserRound
            size={28}
            className="text-[#6D28D9]"
          />
        </div>

        <h2 className="mt-4 text-xl font-bold text-[#101828]">
          Login Required
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#7182A6]">
          Please login to view product details.
        </p>

        <button
  type="button"
  onClick={() => {
    if (!selectedProductId) return;

    const redirectUrl =
      `/products/details?postId=${selectedProductId}`;

    router.push(
      `/login?redirect=${encodeURIComponent(redirectUrl)}`
    );
  }}
  className="mt-6 w-full rounded-xl bg-[#6D28D9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5B21B6]"
>
  Login
</button>

        <button
          type="button"
          onClick={() => setShowLoginPopup(false)}
          className="mt-3 w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}
