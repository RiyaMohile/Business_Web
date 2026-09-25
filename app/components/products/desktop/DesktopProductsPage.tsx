"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Loader2,
  ShoppingCart,
  Heart,
  Grid2X2,
  ShoppingBasket,
  Shirt,
  Smartphone,
  House,
  Sparkles,
  Gamepad2,
  Baby,
  Trophy,
  BookOpen,
  Car,
  Menu,
} from "lucide-react";

import {
  getTrendingProducts,
  searchProducts,
  Product,
} from "../../../services/productApi";


import AddressModal from "../../address/AddressModal";
import DesktopHeader from "../DesktopHeader";
import Navbar from "../../Navbar";
// ======================================================
// CATEGORY TYPE
// ======================================================

const categories = [
  {
    label: "All Products",
    icon: Grid2X2,
  },
  {
    label: "Groceries",
    icon: ShoppingBasket,
  },
  {
    label: "Fashion",
    icon: Shirt,
  },
  {
    label: "Electronics",
    icon: Smartphone,
  },
  {
    label: "Home & Living",
    icon: House,
  },
  {
    label: "Beauty",
    icon: Sparkles,
  },
  {
    label: "Toys",
    icon: Gamepad2,
  },
  {
    label: "Baby & Kids",
    icon: Baby,
  },
  {
    label: "Sports",
    icon: Trophy,
  },
  {
    label: "Books & Stationery",
    icon: BookOpen,
  },
  {
    label: "Automotive",
    icon: Car,
  },
  {
    label: "Health & Wellness",
    icon: Heart,
  },
  {
    label: "More Categories",
    icon: Menu,
  },
];


// ======================================================
// FILTERS
// ======================================================

const filters = [
  "All",
  "Popular",
  "New Arrivals",
  "Offers",
];


// ======================================================
// COMPONENT
// ======================================================

export default function DesktopProductsPage() {
  const router = useRouter();

  // ====================================================
  // PRODUCT STATES
  // ====================================================

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [searchLoading, setSearchLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [showLoginPopup, setShowLoginPopup] =
  useState(false);

const [selectedProductId, setSelectedProductId] =
  useState<string | null>(null);


  // ====================================================
  // ADDRESS STATES
  // ====================================================

  const [addressId, setAddressId] =
    useState<string | null>(null);

  const [showAddressModal, setShowAddressModal] =
    useState(false);

    const [userCity, setUserCity] = useState("");


  // ====================================================
  // ACTIVE FILTER
  // ====================================================

  const [activeFilter, setActiveFilter] =
    useState("All");


  // ====================================================
  // INITIALIZE
  // ====================================================

  useEffect(() => {
    initializeProducts();
  }, []);

const fetchCityFromCoordinates = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    const city =
      data?.city ||
      data?.locality ||
      data?.principalSubdivision ||
      "";

    setUserCity(city);
  } catch (error) {
    console.error(
      "FETCH CITY ERROR:",
      error
    );
  }
};
  // ====================================================
  // INITIALIZE PRODUCTS
  // ====================================================

  const initializeProducts = async () => {
    try {
      setLoading(true);
      setCheckingAuth(true);
      setError("");

      const token =
        localStorage.getItem("token");

      // ----------------------------------------------
      // AUTH CHECK
      // ----------------------------------------------

      if (!token) {
        router.replace("/login");
        return;
      }

      setCheckingAuth(false);


      // ----------------------------------------------
      // FETCH ADDRESSES
      // ----------------------------------------------

      const response = await fetch(
        "https://api.thover.in/v1/api/address/",
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to fetch addresses."
        );
      }

      const data =
        await response.json();

      const addresses =
        data?.data || [];


      // ----------------------------------------------
      // NO ADDRESS
      // ----------------------------------------------

      if (
        !Array.isArray(addresses) ||
        addresses.length === 0
      ) {
        setAddressId(null);
        setShowAddressModal(true);
        return;
      }


      // ----------------------------------------------
      // PRIMARY ADDRESS
      // ----------------------------------------------

      const selectedAddress =
        addresses.find(
          (address: any) =>
            address?.isPrimary === true
        ) || addresses[0];

        if (!selectedAddress?._id) {
  setShowAddressModal(true);
  return;
}

if (
  selectedAddress?.latitude &&
  selectedAddress?.longitude
) {
  await fetchCityFromCoordinates(
    Number(selectedAddress.latitude),
    Number(selectedAddress.longitude)
  );
}


      // ----------------------------------------------
      // SAVE ADDRESS
      // ----------------------------------------------

      setAddressId(
        selectedAddress._id
      );


      // ----------------------------------------------
      // LOAD PRODUCTS
      // ----------------------------------------------

      await loadProducts(
        selectedAddress._id
      );

    } catch (error: any) {
      console.error(
        "INITIALIZE PRODUCTS ERROR:",
        error
      );

      setError(
        error?.message ||
          "Unable to load products."
      );

      setShowAddressModal(true);

    } finally {
      setLoading(false);
      setCheckingAuth(false);
    }
  };


  // ====================================================
  // LOAD TRENDING PRODUCTS
  // ====================================================

  const loadProducts = async (
    customerAddressId: string
  ) => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getTrendingProducts(
          customerAddressId,
          1,
          20
        );


      // ----------------------------------------------
      // TRENDING API RESPONSE
      //
      // {
      //   data: [
      //      {
      //        post: {...}
      //      }
      //   ]
      // }
      // ----------------------------------------------

      const trendingProducts =
        (response?.data || [])
          .map(
            (item: any) =>
              item?.post
          )
          .filter(
            (post: any) =>
              post?._id
          );


      setProducts(
        trendingProducts
      );

    } catch (error: any) {
      console.error(
        "GET PRODUCTS ERROR:",
        error
      );

      setError(
        error?.message ||
          "Unable to load products."
      );

    } finally {
      setLoading(false);
    }
  };


  // ====================================================
  // SEARCH PRODUCTS
  // ====================================================

  const handleSearch = async (
    value: string
  ) => {
    setSearch(value);


    // ----------------------------------------------
    // EMPTY SEARCH
    // ----------------------------------------------

    if (!value.trim()) {
      if (addressId) {
        await loadProducts(
          addressId
        );
      }

      return;
    }


    try {
      setSearchLoading(true);
      setError("");

      const response =
        await searchProducts(
          value.trim(),
          undefined,
          undefined,
          20
        );


      setProducts(
        response?.data?.posts || []
      );

    } catch (error: any) {
      console.error(
        "SEARCH ERROR:",
        error
      );

      setError(
        error?.message ||
          "Search failed."
      );

      setProducts([]);

    } finally {
      setSearchLoading(false);
    }
  };


  // ====================================================
  // ADDRESS CREATED
  // ====================================================

  const handleAddressCreated = async (
    newAddressId: string
  ) => {
    setAddressId(
      newAddressId
    );

    setShowAddressModal(false);

    await loadProducts(
      newAddressId
    );
  };


  // ====================================================
  // PRODUCT CLICK
  // ====================================================

  const handleProductClick = (
  productId?: string
) => {
  if (!productId) return;

  const token = localStorage.getItem("token");

  if (!token) {
    setSelectedProductId(productId);
    setShowLoginPopup(true);
    return;
  }

  router.push(
    `/products/details?postId=${productId}`
  );
};


  // ====================================================
  // LOADING
  // ====================================================

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAFBFF]">
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


  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <main className="min-h-screen bg-[#FAFBFF]">


      {/* =================================================
          HEADER
      ================================================= */}

     <Navbar
  search={search}
  onSearchChange={handleSearch}
  searchLoading={searchLoading}
  onLocationClick={() => {}}
  city={userCity}
/>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="min-h-screen pt-[78px]">


        <div className="px-8 py-6">


          {/* =============================================
              HERO
          ============================================= */}

          <section className="relative h-[145px] overflow-hidden rounded-2xl bg-gradient-to-r from-[#FCFAFF] via-[#FAF7FF] to-[#F8F3FF] px-1 py-1">


            {/* TEXT */}

            <div className="relative z-10 pt-2">

              <p className="text-[13px] font-semibold tracking-wide text-[#9254FF]">
                EXPLORE OUR COLLECTION
              </p>

              <h1 className="mt-1 text-[40px] font-bold leading-[1.1] tracking-[-0.04em] text-[#101828]">
                Products
              </h1>

              <p className="mt-1 text-[19px] text-[#5F7197]">
                Trending products near you
              </p>

            </div>


            {/* ==========================================
                RIGHT HERO DESIGN
            ========================================== */}

            <div className="absolute right-6 top-0 flex h-full items-center">
  <Image
    src="/product.png"
    alt="Shop local illustration"
    width={420}
    height={180}
    className="h-[180px] w-[420px] object-contain object-right"
    priority
  />
</div>

          </section>


          {/* =============================================
              FILTERS
          ============================================= */}

          <div className="mt-5 flex items-center gap-2">

            {filters.map(
              (filter) => {
                const active =
                  activeFilter ===
                  filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() =>
                      setActiveFilter(
                        filter
                      )
                    }
                    className={`
                      rounded-full
                      px-5
                      py-2.5
                      text-sm
                      font-medium
                      transition
                      ${
                        active
                          ? "bg-gradient-to-r from-[#7135E8] to-[#6D28D9] text-white shadow-[0_5px_15px_rgba(109,40,217,0.18)]"
                          : "border border-slate-200 bg-white text-[#101828] hover:border-[#C4A7F7] hover:bg-[#FAF7FF]"
                      }
                    `}
                  >
                    {filter}
                  </button>
                );
              }
            )}

          </div>


          {/* =============================================
              ERROR
          ============================================= */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}


          {/* =============================================
              PRODUCTS GRID
          ============================================= */}

          {loading && products.length === 0 ? (

            <div className="flex min-h-[350px] items-center justify-center">

              <div className="flex flex-col items-center gap-3">

                <Loader2
                  size={30}
                  className="animate-spin text-[#6D28D9]"
                />

                <p className="text-sm text-slate-500">
                  Loading products...
                </p>

              </div>

            </div>

          ) : products.length === 0 ? (

            <div className="mt-8 flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-100 bg-white">

              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F4ECFF]">

                  <ShoppingCart
                    size={28}
                    className="text-[#6D28D9]"
                  />

                </div>

                <h3 className="mt-4 text-lg font-semibold text-[#101828]">
                  No products found
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Try searching for another product.
                </p>

              </div>

            </div>

          ) : (

            <div className="mt-6 grid grid-cols-4 gap-5">

              {products.map(
                (
                  product,
                  index
                ) => (

                  <div
                    key={
                      product._id ||
                      `product-${index}`
                    }
                    onClick={() =>
                      handleProductClick(
                        product._id
                      )
                    }
                    className="
                      group
                      cursor-pointer
                      rounded-2xl
                      border
                      border-slate-100
                      bg-white
                      p-4
                      shadow-[0_4px_18px_rgba(16,24,40,0.04)]
                      transition
                      duration-200
                      hover:-translate-y-1
                      hover:shadow-[0_12px_28px_rgba(16,24,40,0.09)]
                    "
                  >


                    {/* =================================
                        PRODUCT IMAGE
                    ================================= */}

                    <div className="relative aspect-square overflow-hidden rounded-xl bg-[#F5F6F8]">

                      {product.media?.[0]?.mediaUrl ? (

                        <img
                          src={
                            product.media[0]
                              .mediaUrl
                          }
                          alt={
                            product.topic ||
                            "Product"
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-300
                            group-hover:scale-[1.03]
                          "
                        />

                      ) : (

                        <div className="flex h-full w-full items-center justify-center">

                          <div className="flex flex-col items-center">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">

                              <div className="h-7 w-8 rounded-md border-2 border-slate-300" />

                            </div>

                            <span className="mt-2 text-sm font-medium text-slate-400">
                              No Image
                            </span>

                          </div>

                        </div>

                      )}


                      {/* HEART */}

                      <button
                        type="button"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                        className="
                          absolute
                          right-3
                          top-3
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-white/95
                          shadow-sm
                          transition
                          hover:scale-105
                        "
                      >

                        <Heart
                          size={19}
                          strokeWidth={1.8}
                          className="text-[#64748B]"
                        />

                      </button>

                    </div>


                    {/* =================================
                        PRODUCT INFO
                    ================================= */}

                    <h3 className="mt-4 truncate text-[15px] font-bold text-[#101828]">
                      {product.topic ||
                        "Untitled Product"}
                    </h3>


                    {/* PRICE */}

                    <p className="mt-1 text-[18px] font-bold text-[#6D28D9]">

                      ₹
                      {product.price?.amount ??
                        0}

                    </p>


                    {/* CATEGORY */}

                    {/* <div className="mt-2 flex items-center justify-between gap-3"> */}

                      {/* <p className="truncate text-[13px] text-[#7182A6]">
                        {product.category
                          ?.name ||
                          "General"}
                      </p> */}


                      {/* CART BUTTON */}

                      {/* <button
                        type="button"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#F2EAFF]
                          text-[#6D28D9]
                          transition
                          hover:bg-[#E7D9FF]
                        "
                      >

                        <ShoppingCart
                          size={19}
                        />

                      </button> */}

                    {/* </div> */}

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

{showLoginPopup && (
  <div
    className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 px-4"
    onClick={() => setShowLoginPopup(false)}
  >
    <div
      className="w-full max-w-[380px] rounded-2xl bg-white p-6 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-bold text-[#101828]">
        Login Required
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Please login to view product details.
      </p>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => setShowLoginPopup(false)}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Close
        </button>

        <button
          type="button"
          onClick={() => {
            if (!selectedProductId) return;

            const redirectUrl =
              `/products/details?postId=${selectedProductId}`;

            router.push(
              `/login?redirect=${encodeURIComponent(
                redirectUrl
              )}`
            );
          }}
          className="flex-1 rounded-xl bg-[#6D28D9] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5B21B6]"
        >
          Login
        </button>
      </div>
    </div>
  </div>
)}

      {/* =================================================
          ADDRESS MODAL
      ================================================= */}

      {showAddressModal && (
        <AddressModal
          onSuccess={
            handleAddressCreated
          }
        />
      )}

    </main>
  );
}