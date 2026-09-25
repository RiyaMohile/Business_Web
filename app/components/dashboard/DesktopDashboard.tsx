"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import Login from "../auth/desktop/Login";
import Register from "../auth/desktop/Register";
import Otp from "../auth/desktop/Otp";

export default function DesktopDashboard() {
  const pathname = usePathname();

  const isRegisterPage = pathname === "/register";
  const isOtpPage = pathname === "/otp";

  return (
    <main className="min-h-screen overflow-hidden bg-white">

      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#F3EEFF]" />

        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#F3EEFF]" />

        <div className="absolute right-[-70px] top-[130px] h-40 w-40 rounded-full bg-[#F7F3FF]" />

      </div>


      {/* ================= MAIN CONTAINER ================= */}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1350px] flex-col px-7 py-4">


        {/* ================= HEADER ================= */}

        <header className="relative z-20 flex shrink-0 items-center justify-between">

          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <Image
              src="/icon.png"
              alt="Thover"
              width={44}
              height={44}
              priority
              className="h-[44px] w-[44px] rounded-[4px] object-contain"
            />

            <span className="text-[32px] font-bold leading-none tracking-[-0.03em] text-[#101828]">
              THOVER
            </span>
          </Link>


          {/* LINKS */}

          <div className="flex items-center gap-5 text-[15px] font-semibold">

            <Link
              href="/privacy-policy"
              className="text-[#6D28D9] hover:opacity-70"
            >
              Privacy Policy
            </Link>

            <span className="text-slate-300">
              |
            </span>

            <Link
              href="/terms-of-use"
              className="text-[#6D28D9] hover:opacity-70"
            >
              Terms of Use
            </Link>

          </div>

        </header>


        {/* ================= AUTH AREA ================= */}

        <div className="relative flex min-h-0 flex-1 items-center justify-center">

          <div className="grid w-full max-w-[1250px] grid-cols-[1.05fr_0.95fr] items-center gap-6">


            {/* ================= LEFT SIDE ================= */}

            <section className="flex flex-col items-center">

              <Image
                src="/illustration.png"
                alt="Shop local with Thover"
                width={900}
                height={650}
                priority
                className="h-auto w-full max-w-[560px] object-contain"
              />

              <div className="-mt-1 w-full max-w-[560px]">

                <h2 className="text-[22px] font-bold tracking-tight text-[#101828]">

                  Shop{" "}

                  <span className="text-[#6D28D9]">
                    Local
                  </span>

                  <span className="mx-3">
                    •
                  </span>

                  Support{" "}

                  <span className="text-[#6D28D9]">
                    Local
                  </span>

                </h2>

                <p className="mt-1 text-[14px] leading-5 text-[#7182A6]">
                  Get anything you need, Best from local stores
                  <br />
                  - all in one place.
                </p>

              </div>

            </section>


            {/* ================= RIGHT SIDE ================= */}

            <section className="flex justify-center">

              {/* SAME SIZE FOR LOGIN + REGISTER */}

              <div
                className="
                  h-[460px]
                  w-full
                  max-w-[570px]
                  rounded-[20px]
                  border
                  border-[#DDD5F8]
                  bg-white
                  px-8
                  py-7
                  shadow-[0_15px_45px_rgba(91,33,182,0.06)]
                "
              >

                {isOtpPage ? (
  <Otp />
) : isRegisterPage ? (
  <Register />
) : (
  <Login />
)}

              </div>

            </section>

          </div>

        </div>

      </div>

    </main>
  );
}