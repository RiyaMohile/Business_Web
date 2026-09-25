"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Search,
  Loader2,
  MapPin,
  UserRound,
  X,
  Camera,
  Phone,
  Heart,
  Store as StoreIcon,
  ChevronDown,
  LogOut,
  ShoppingCart,
} from "lucide-react";

// ======================================================
// API IMPORTS
// Change these paths according to your project structure
// ======================================================

import { getUserDetails, logoutUser } from "../services/authApi";
import { getLikedStores } from "../services/storeApi";
import { getMyCart } from "../services/cartApi";

// ======================================================
// TYPES
// ======================================================

interface UserData {
  _id: string;
  username?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  profilePic?: string;
  profilePicture?: string;
  image?: string;
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

interface NavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchLoading?: boolean;

  city?: string;

  onLocationClick?: () => void;
}

export default function Navbar({
  search,
  onSearchChange,
  searchLoading = false,
  city = "",
  onLocationClick,
}: NavbarProps) {
  const router = useRouter();

  // ======================================================
  // ACCOUNT STATES
  // ======================================================

  const [profileOpen, setProfileOpen] = useState(false);

  const [accountUser, setAccountUser] =
    useState<UserData | null>(null);

  const [accountLoading, setAccountLoading] =
    useState(false);

  const [likedStores, setLikedStores] =
    useState<LikedStore[]>([]);

  const [likedStoresLoading, setLikedStoresLoading] =
    useState(false);

  const [likedStoresOpen, setLikedStoresOpen] =
    useState(false);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const [logoutLoading, setLogoutLoading] =
    useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
  fetchCartCount();
}, []);

  // ======================================================
  // FETCH USER
  // ======================================================

  const fetchCurrentUser = async () => {
    try {
      setAccountLoading(true);

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        router.push("/login");
        return;
      }

      const response = await getUserDetails(userId);

      if (!response?.success || !response?.user) {
        throw new Error(
          response?.message ||
            "Unable to fetch user details."
        );
      }

      const user = response.user;

      setAccountUser({
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePic: user.profilePic,
        profilePicture: user.profilePicture,
        image: user.image,
      });

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
    } catch (error: any) {
      console.error(
        "FETCH USER ERROR:",
        error
      );

      if (
        error?.response?.status === 401 ||
        error?.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");

        router.push("/login");
      }
    } finally {
      setAccountLoading(false);
    }
  };

  // ======================================================
  // FETCH LIKED STORES
  // ======================================================

  const fetchLikedStores = async () => {
    try {
      setLikedStoresLoading(true);

      const response = await getLikedStores();

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to fetch liked stores."
        );
      }

      setLikedStores(
        response.data || []
      );
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
      }
    } finally {
      setLikedStoresLoading(false);
    }
  };

  // ======================================================
  // PROFILE CLICK
  // ======================================================

  const handleProfileClick = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setProfileOpen(true);
    setLikedStoresOpen(false);

    await Promise.all([
      fetchCurrentUser(),
      fetchLikedStores(),
    ]);
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      await logoutUser();

      setProfileOpen(false);
      setShowLogoutModal(false);

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");

      router.replace("/login");
    } catch (error) {
      console.error(
        "LOGOUT ERROR:",
        error
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  const fetchCartCount = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setCartCount(0);
      return;
    }

    const response = await getMyCart();

    const cart = response?.cart;

    if (!cart?.posts) {
      setCartCount(0);
      return;
    }

    const count = cart.posts.reduce(
      (total: number, item: any) =>
        total + Number(item.quantity || 0),
      0
    );

    setCartCount(count);
  } catch (error) {
    console.error(
      "FETCH CART ERROR:",
      error
    );

    setCartCount(0);
  }
};

  return (
    <>
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          border-b
          border-slate-100
          bg-white
        "
      >
        {/* =====================================================
            TOP ROW
        ====================================================== */}

        <div
          className="
            flex
            h-[88px]
            items-center
            justify-between
            px-5
            sm:px-6
            lg:h-[98px]
            lg:px-10
          "
        >
          {/* =================================================
              LOGO
          ================================================== */}

          <Link
            href="/products"
            className="
              flex
              shrink-0
              items-center
              gap-3
            "
          >
            <Image
              src="/icon.png"
              alt="Thover"
              width={50}
              height={50}
              priority
              className="
                h-[50px]
                w-[50px]
                rounded-[8px]
                object-contain
                sm:h-[52px]
                sm:w-[52px]
              "
            />

            {/* Desktop only */}
            <span
              className="
                hidden
                text-[30px]
                font-bold
                tracking-[-0.04em]
                text-[#101828]
                lg:block
              "
            >
              THOVER
            </span>
          </Link>

          {/* =================================================
              DESKTOP SEARCH
          ================================================== */}

          <div
            className="
              hidden
              flex-1
              justify-center
              px-8
              lg:flex 
            "
          >
            <div
              className="
                flex
                h-[60px]
                w-full
                max-w-[750px]
                items-center
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-5
              "
            >
              <Search
                size={26}
                strokeWidth={2}
                className="shrink-0 text-[#101828]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  onSearchChange(
                    e.target.value
                  )
                }
                placeholder="Search products, stores or categories..."
                className="
                  ml-5
                  w-full
                  bg-transparent
                  text-[16px]
                  text-[#101828]
                  outline-none
                  placeholder:text-[#7182A6]
                "
              />

              {searchLoading && (
                <Loader2
                  size={20}
                  className="
                    shrink-0
                    animate-spin
                    text-[#6D28D9]
                  "
                />
              )}
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-2
              sm:gap-4
            "
          >
            {/* LOCATION */}

            <button
              type="button"
              onClick={onLocationClick}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                px-2
                py-2
                transition
                hover:bg-slate-50
                sm:gap-3
                sm:px-3
              "
            >
              <MapPin
                size={25}
                strokeWidth={2}
                className="shrink-0 text-[#101828]"
              />

              <span
                className="
                  max-w-[110px]
                  truncate
                  text-sm
                  font-bold
                  text-[#101828]
                  sm:max-w-[140px]
                "
              >
                {city}
              </span>
            </button>

            {/* CART */}

<button
  type="button"
  onClick={() => router.push("/cart")}
  className="
    relative
    flex
    h-[48px]
    w-[48px]
    shrink-0
    items-center
    justify-center
    rounded-full
    border
    border-slate-200
    bg-white
    text-[#101828]
    transition
    hover:bg-slate-50
  "
  aria-label="Cart"
>
  <ShoppingCart
    size={25}
    strokeWidth={1.8}
  />

  {cartCount > 0 && (
    <span
      className="
        absolute
        -right-1
        -top-1
        flex
        h-5
        min-w-5
        items-center
        justify-center
        rounded-full
        bg-[#6D28D9]
        px-1
        text-[10px]
        font-bold
        text-white
      "
    >
      {cartCount > 99 ? "99+" : cartCount}
    </span>
  )}
</button>

            {/* PROFILE */}

            <button
              type="button"
              onClick={handleProfileClick}
              className="
                flex
                h-[48px]
                w-[48px]
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-slate-200
                bg-white
                text-[#475467]
                transition
                hover:bg-slate-50
              "
            >
              <UserRound
                size={25}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>

        {/* =====================================================
            MOBILE SEARCH
        ====================================================== */}

        <div
          className="
            block
            border-t
            border-slate-100
            bg-[#faf9ff]
            px-5
            pb-2
            pt-3
            lg:hidden
          "
        >
          <div
            className="
              flex
              h-[40px]
              w-full
              items-center
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
            "
          >
            <Search
              size={21}
              strokeWidth={2}
              className="
                shrink-0
                text-[#7182A6]
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                onSearchChange(
                  e.target.value
                )
              }
              placeholder="Search products..."
              className="
                ml-3
                w-full
                bg-transparent
                text-sm
                text-[#101828]
                outline-none
                placeholder:text-[#7182A6]
              "
            />

            {searchLoading && (
              <Loader2
                size={18}
                className="
                  shrink-0
                  animate-spin
                  text-[#6D28D9]
                "
              />
            )}
          </div>
        </div>
      </header>

      {/* =====================================================
          ACCOUNT PANEL
      ====================================================== */}

      {profileOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/10
          "
          onClick={() =>
            setProfileOpen(false)
          }
        >
          <div
            className="
              absolute
              right-4
              top-[85px]
              flex
              w-[350px]
              max-w-[calc(100vw-24px)]
              max-h-[calc(100dvh-100px)]
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-slate-100
              bg-white
              shadow-[0_15px_45px_rgba(16,24,40,0.16)]
              sm:right-6
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* ==========================================
                ACCOUNT HEADER
            ========================================== */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-slate-100
                px-5
                py-4
              "
            >
              <div>
                <h2
                  className="
                    text-xl
                    font-bold
                    text-[#101828]
                  "
                >
                  My Account
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-[#7182A6]
                  "
                >
                  Your account information
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setProfileOpen(false)
                }
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  text-slate-500
                  hover:bg-slate-50
                "
              >
                <X size={20} />
              </button>
            </div>

            {/* ==========================================
                SCROLLABLE CONTENT
            ========================================== */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                px-5
                py-5
              "
            >
              {accountLoading ? (
                <div
                  className="
                    flex
                    min-h-[300px]
                    items-center
                    justify-center
                  "
                >
                  <Loader2
                    size={28}
                    className="
                      animate-spin
                      text-[#6D28D9]
                    "
                  />
                </div>
              ) : (
                <>
                  {/* ====================================
                      PROFILE
                  ==================================== */}

                  <div
                    className="
                      flex
                      flex-col
                      items-center
                    "
                  >
                    <div className="relative">
                      <div
                        className="
                          flex
                          h-24
                          w-24
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-full
                          bg-[#F4ECFF]
                          text-3xl
                          font-bold
                          text-[#6D28D9]
                        "
                      >
                        {accountUser?.profilePic ||
                        accountUser?.profilePicture ||
                        accountUser?.image ? (
                          <img
                            src={
                              accountUser.profilePic ||
                              accountUser.profilePicture ||
                              accountUser.image
                            }
                            alt="Profile"
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                          />
                        ) : (
                          accountUser?.name
                            ?.trim()
                            ?.charAt(0)
                            ?.toUpperCase() ||
                          accountUser?.username
                            ?.trim()
                            ?.charAt(0)
                            ?.toUpperCase() ||
                          "U"
                        )}
                      </div>

                      <div
                        className="
                          absolute
                          bottom-0
                          right-[-3px]
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          shadow-sm
                        "
                      >
                        <Camera
                          size={16}
                          className="text-[#101828]"
                        />
                      </div>
                    </div>

                    <h3
                      className="
                        mt-3
                        text-xl
                        font-bold
                        text-[#101828]
                      "
                    >
                      {accountUser?.name ||
                        "Thover User"}
                    </h3>

                    <p
                      className="
                        text-sm
                        text-[#7182A6]
                      "
                    >
                      @
                      {accountUser?.username ||
                        "username"}
                    </p>
                  </div>

                  {/* ====================================
                      ACCOUNT DETAILS
                  ==================================== */}

                  <div
                    className="
                      mt-6
                      space-y-3
                    "
                  >
                    {/* NAME */}

                    <div
                      className="
                        flex
                        items-center
                        gap-4
                        rounded-xl
                        bg-[#F8F9FC]
                        px-4
                        py-3.5
                      "
                    >
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                        "
                      >
                        <UserRound
                          size={19}
                          className="text-[#6D28D9]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            text-xs
                            text-[#7182A6]
                          "
                        >
                          Name
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            font-medium
                            text-[#101828]
                          "
                        >
                          {accountUser?.name ||
                            "—"}
                        </p>
                      </div>
                    </div>

                    {/* USERNAME */}

                    <div
                      className="
                        flex
                        items-center
                        gap-4
                        rounded-xl
                        bg-[#F8F9FC]
                        px-4
                        py-3.5
                      "
                    >
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                        "
                      >
                        <UserRound
                          size={19}
                          className="text-[#6D28D9]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            text-xs
                            text-[#7182A6]
                          "
                        >
                          Username
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            font-medium
                            text-[#101828]
                          "
                        >
                          {accountUser?.username ||
                            "—"}
                        </p>
                      </div>
                    </div>

                    {/* PHONE */}

                    {accountUser?.phoneNumber && (
                      <div
                        className="
                          flex
                          items-center
                          gap-4
                          rounded-xl
                          bg-[#F8F9FC]
                          px-4
                          py-3.5
                        "
                      >
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                          "
                        >
                          <Phone
                            size={19}
                            className="text-[#6D28D9]"
                          />
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                              text-xs
                              text-[#7182A6]
                            "
                          >
                            Phone Number
                          </p>

                          <p
                            className="
                              mt-0.5
                              truncate
                              font-medium
                              text-[#101828]
                            "
                          >
                            {
                              accountUser.phoneNumber
                            }
                          </p>
                        </div>
                      </div>
                    )}

                    {/* EMAIL */}

                    {accountUser?.email && (
                      <div
                        className="
                          flex
                          items-center
                          gap-4
                          rounded-xl
                          bg-[#F8F9FC]
                          px-4
                          py-3.5
                        "
                      >
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                          "
                        >
                          <span
                            className="
                              text-sm
                              font-bold
                              text-[#6D28D9]
                            "
                          >
                            @
                          </span>
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                              text-xs
                              text-[#7182A6]
                            "
                          >
                            Email
                          </p>

                          <p
                            className="
                              mt-0.5
                              truncate
                              font-medium
                              text-[#101828]
                            "
                          >
                            {accountUser.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ====================================
                      LIKED STORES
                  ==================================== */}

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() =>
                        setLikedStoresOpen(
                          (prev) => !prev
                        )
                      }
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >
                        <Heart
                          size={18}
                          className="text-[#E91E63]"
                          fill="#E91E63"
                        />

                        <h3
                          className="
                            text-base
                            font-bold
                            text-[#101828]
                          "
                        >
                          Liked Stores
                        </h3>

                        <span
                          className="
                            text-xs
                            text-[#7182A6]
                          "
                        >
                          {likedStores.length}
                        </span>
                      </div>

                      <ChevronDown
                        size={18}
                        className={`
                          text-[#7182A6]
                          transition-transform
                          ${
                            likedStoresOpen
                              ? "rotate-180"
                              : ""
                          }
                        `}
                      />
                    </button>

                    {likedStoresOpen && (
                      <div className="mt-3 space-y-2">
                        {likedStoresLoading ? (
                          <div
                            className="
                              flex
                              items-center
                              justify-center
                              py-6
                            "
                          >
                            <Loader2
                              size={24}
                              className="
                                animate-spin
                                text-[#6D28D9]
                              "
                            />
                          </div>
                        ) : likedStores.length ===
                          0 ? (
                          <div
                            className="
                              rounded-xl
                              bg-[#F8F9FC]
                              px-4
                              py-6
                              text-center
                            "
                          >
                            <p
                              className="
                                text-sm
                                font-medium
                                text-[#101828]
                              "
                            >
                              No liked stores
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-[#7182A6]
                              "
                            >
                              Stores you like will
                              appear here.
                            </p>
                          </div>
                        ) : (
                          likedStores.map(
                            (likedStore) => (
                              <button
                                key={
                                  likedStore._id
                                }
                                type="button"
                                onClick={() => {
                                  setProfileOpen(
                                    false
                                  );

                                  router.push(
                                    `/store?storeId=${likedStore.storeId}`
                                  );
                                }}
                                className="
                                  flex
                                  w-full
                                  items-center
                                  gap-3
                                  rounded-xl
                                  border
                                  border-slate-100
                                  bg-white
                                  p-3
                                  text-left
                                  transition
                                  hover:bg-[#F8F9FC]
                                "
                              >
                                <div
                                  className="
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#F0EBFF]
                                  "
                                >
                                  <StoreIcon
                                    size={20}
                                    className="text-[#6D28D9]"
                                  />
                                </div>

                                <div
                                  className="
                                    min-w-0
                                    flex-1
                                  "
                                >
                                  <p
                                    className="
                                      truncate
                                      text-sm
                                      font-semibold
                                      text-[#101828]
                                    "
                                  >
                                    {
                                      likedStore.storeName
                                    }
                                  </p>

                                  <p
                                    className="
                                      mt-0.5
                                      truncate
                                      text-xs
                                      text-[#7182A6]
                                    "
                                  >
                                    {
                                      likedStore.category
                                    }

                                    {likedStore
                                      .address?.city
                                      ? ` • ${likedStore.address.city}`
                                      : ""}
                                  </p>
                                </div>

                                <span
                                  className="
                                    text-lg
                                    text-[#98A2B3]
                                  "
                                >
                                  ›
                                </span>
                              </button>
                            )
                          )
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* ==========================================
                LOGOUT
            ========================================== */}

            <div
              className="
                shrink-0
                border-t
                border-slate-100
                bg-white
                px-5
                py-4
              "
            >
              <button
                type="button"
                onClick={() =>
                  setShowLogoutModal(true)
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-[#7C3AED]
                  to-[#5B21B6]
                  px-4
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_7px_18px_rgba(109,40,217,0.2)]
                  transition
                  hover:-translate-y-0.5
                "
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          LOGOUT CONFIRMATION
      ====================================================== */}

      {showLogoutModal && (
        <div
          className="
            fixed
            inset-0
            z-[1100]
            flex
            items-center
            justify-center
            bg-black/40
            px-4
          "
          onClick={() =>
            setShowLogoutModal(false)
          }
        >
          <div
            className="
              w-full
              max-w-[380px]
              rounded-2xl
              bg-white
              p-6
              shadow-2xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h2
              className="
                text-xl
                font-bold
                text-[#101828]
              "
            >
              Logout
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-slate-500
              "
            >
              Are you sure you want to logout
              from your account?
            </p>

            <div
              className="
                mt-6
                flex
                gap-3
              "
            >
              <button
                type="button"
                onClick={() =>
                  setShowLogoutModal(false)
                }
                disabled={logoutLoading}
                className="
                  flex-1
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-slate-700
                  hover:bg-slate-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="
                  flex-1
                  rounded-xl
                  bg-[#6D28D9]
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-[#5B21B6]
                "
              >
                {logoutLoading ? (
                  <Loader2
                    size={18}
                    className="
                      mx-auto
                      animate-spin
                    "
                  />
                ) : (
                  "Yes, Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}