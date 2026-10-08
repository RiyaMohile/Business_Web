"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Search,
  User,
  X,
  LogOut, MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";

import AddressModal from "../../components/address/AddressModal";
import {
  getNewArrivalProducts,
  searchProducts,
  Product, 
} from "../../services/productApi";
import Image from "next/image";
import Navbar from "../Navbar";

export default function ProductsPage() {
    const router = useRouter();

  const [loading, setLoading] =
    useState(true);
    const [checkingAuth, setCheckingAuth] =
  useState(true);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [showAddressModal, setShowAddressModal] =
    useState(false);

  const [addressId, setAddressId] =
    useState<string | null>(null);

    const [search, setSearch] =
  useState("");

const [searchLoading, setSearchLoading] =
  useState(false);

const [userCity, setUserCity] =
  useState("");

  const [error, setError] =
    useState("");

  // ==========================================
  // INITIAL CHECK
  // ==========================================

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
    console.error("FETCH CITY ERROR:", error);
  }
};

  const initializeProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      // ========================================
      // LOGIN CHECK
      // ========================================

      if (!token) {
  router.replace("/login");
  return;
}
setCheckingAuth(false);

      // ========================================
      // GET CUSTOMER ADDRESSES
      // ========================================

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
        throw new Error(
          "Unable to fetch addresses."
        );
      }

      const data =
        await response.json();

      console.log(
        "CUSTOMER ADDRESS RESPONSE:",
        data
      );

      const addresses =
        data?.data || [];

      // ========================================
      // NO ADDRESS
      // ========================================

      if (addresses.length === 0) {
        setAddressId(null);
        setShowAddressModal(true);
        return;
      }

      // ========================================
      // ADDRESS EXISTS
      // ========================================

      const selectedAddress =
  addresses.find(
    (address: any) =>
      address?.isPrimary === true
  ) ||
  addresses[0];

if (!selectedAddress?._id) {
  setShowAddressModal(true);
  return;
}

// Get city from selected address coordinates
if (
  selectedAddress?.latitude &&
  selectedAddress?.longitude
) {
  await fetchCityFromCoordinates(
    Number(selectedAddress.latitude),
    Number(selectedAddress.longitude)
  );
}

setAddressId(selectedAddress._id);

      // ========================================
      // LOAD PRODUCTS
      // ========================================

      await loadProducts(
        selectedAddress._id
      );
    } catch (error) {
      console.error(
        "INITIALIZE PRODUCTS ERROR:",
        error
      );

      setError(
        "Unable to load products."
      );

      setShowAddressModal(true);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET TRENDING PRODUCTS
  // ==========================================

  const loadProducts = async (
    customerAddressId: string
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await getNewArrivalProducts(
  customerAddressId,
  1,
  50
);

      console.log(
        "PRODUCT RESPONSE:",
        response
      );

      const newArrivalProducts = (response?.data || [])
  .filter((post: any) => post?._id);

setProducts(newArrivalProducts);
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

  const handleSearch = async (
  value: string
) => {
  setSearch(value);

  // Empty search → trending products
  if (!value.trim()) {
    if (addressId) {
      await loadProducts(addressId);
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

    console.log(
      "SEARCH RESPONSE:",
      response
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

  // ==========================================
  // ADDRESS CREATED
  // ==========================================

  const handleAddressCreated = async (
    newAddressId: string
  ) => {
    console.log(
      "NEW ADDRESS ID:",
      newAddressId
    );

    setAddressId(
      newAddressId
    );

    setShowAddressModal(false);

    // Now fetch products using
    // newly created address
    await loadProducts(
      newAddressId
    );
  };

  if (checkingAuth) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9ff]">
      <Loader2
        size={28}
        className="animate-spin text-[#6D28D9]"
      />
    </main>
  );
}
  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading && products.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9ff]">

        <div className="flex flex-col items-center gap-3">

          <Loader2
            size={28}
            className="animate-spin text-[#6D28D9]"
          />

          <p className="text-sm text-slate-500">
            Loading products...
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9ff]">

      <Navbar
  search={search}
  onSearchChange={handleSearch}
  searchLoading={searchLoading}
  city={userCity}
  onLocationClick={() => {
    setShowAddressModal(true);
  }}
/>

      {/* ===================================== */}
      {/* PRODUCT PAGE */}
      {/* ===================================== */}

      <div
  className={`
    pt-[105px] lg:pt-[80px]
    ${
      showAddressModal
        ? "pointer-events-none select-none blur-[3px]"
        : ""
    }
  `}
>
        {/* MAIN */}

        <div className="mx-auto max-w-6xl px-4 py-5">

          {/* TITLE */}

          <div className="mt-6">

            <h1 className="text-2xl font-bold text-slate-900">
              Products
            </h1>

            <p className="mt-1 text-sm text-slate-500">
  New arrivals near you
</p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* PRODUCTS */}

          {products.length > 0 ? (

            <div className="grid grid-cols-2 gap-4">
  {products.map((product) => (
    <div
      key={product._id}
      onClick={() =>
        router.push(
          `/products/details?postId=${product._id}`
        )
      }
      className="
        cursor-pointer
        rounded-2xl
        border
        border-slate-100
        bg-white
        p-3
        shadow-sm
        transition
        hover:-translate-y-1
      "
    >
      {/* IMAGE AREA */}
      <div className="aspect-square w-full">
        {product.media?.[0]?.mediaUrl ? (
          <img
            src={product.media[0].mediaUrl}
            alt={product.topic}
            className="
              h-full
              w-full
              rounded-xl
              object-cover
            "
          />
        ) : (
          /* No image → keep blank space */
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-50">
    <span className="text-sm font-medium text-slate-400">
      No Image
    </span>
  </div>
        )}
      </div>

      <p
        className="
          mt-3
          text-sm
          font-semibold
          text-slate-900
        "
      >
        {product.topic}
      </p>

      <p
        className="
          mt-1
          font-bold
          text-[#6D28D9]
        "
      >
        ₹{product.price?.amount}
      </p>
    </div>
  ))}
</div>

          ) : (

            !loading && (
              <div className="mt-10 rounded-2xl bg-white p-10 text-center">

                <p className="text-sm font-medium text-slate-700">
                  No products available
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Try again later.
                </p>

              </div>
            )

          )}

        </div>

      </div>

      {/* ===================================== */}
      {/* ADDRESS MODAL */}
      {/* ===================================== */}

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