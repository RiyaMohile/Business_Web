"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  MapPin,
  UserRound,
} from "lucide-react";

interface DesktopHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchLoading?: boolean;
  onLocationClick: () => void;
  onProfileClick: () => void;
  city?: string;
}

export default function DesktopHeader({
  search,
  onSearchChange,
  searchLoading = false,
  onLocationClick,
  onProfileClick,
  city = "",
}: DesktopHeaderProps) {
  // null = abhi auth check ho raha hai
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    setIsLoggedIn(!!token);
  }, []);

  // Auth check complete hone tak kuch mat dikhao
  if (isLoggedIn === null) {
    return null;
  }

  // Login nahi hai → header nahi dikhega
  if (!isLoggedIn) {
    return null;
  }

  return (
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
          h-[78px]
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-10
        "
      >

        {/* =================================================
            LOGO

            Desktop → Icon + THOVER
            Mobile → Only Icon
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
            width={40}
            height={40}
            priority
            className="
              h-10
              w-10
              rounded-[6px]
              object-contain
            "
          />

          {/* Desktop only */}
          <span
            className="
              hidden
              text-[25px]
              font-bold
              tracking-[-0.03em]
              text-[#101828]
              sm:block
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
            items-center
            justify-center
            px-8
            lg:flex
          "
        >
          <div
            className="
              flex
              h-[47px]
              w-full
              max-w-[600px]
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
              className="shrink-0 text-[#101828]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                onSearchChange(e.target.value)
              }
              placeholder="Search products, stores or categories..."
              className="
                ml-4
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

        {/* =================================================
            RIGHT SIDE
        ================================================== */}

        <div className="flex items-center gap-2 sm:gap-4">

          {/* LOCATION */}

          <button
            type="button"
            onClick={onLocationClick}
            className="
              flex
              items-center
              gap-1.5
              rounded-lg
              px-2
              py-2
              hover:bg-slate-50
              sm:gap-3
              sm:px-3
            "
          >
            <MapPin
              size={22}
              className="shrink-0 text-[#101828]"
            />

            {/* Mobile mein city hide */}
            <span
              className="
                hidden
                text-sm
                font-semibold
                text-[#101828]
                sm:block
              "
            >
              {city}
            </span>
          </button>

          {/* PROFILE */}

          <button
            type="button"
            onClick={onProfileClick}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              bg-white
              text-[#475467]
              transition
              hover:bg-slate-50
              sm:mr-2
              sm:h-12
              sm:w-12
            "
          >
            <UserRound
              size={22}
              strokeWidth={2}
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
          px-4
          pb-4
          lg:hidden
        "
      >
        <div
          className="
            flex
            h-[55px]
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
            className="shrink-0 text-[#7182A6]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
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
  );
}