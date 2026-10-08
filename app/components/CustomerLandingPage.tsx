"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerLandingPage() {
  const router = useRouter();
  const [comingSoonModal, setComingSoonModal] = useState(false);

  const handleComingSoon = () => {
    setComingSoonModal(true);
  };

  return (
    <main className="min-h-[100dvh] bg-white">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[500px] flex-col px-6 py-8 sm:px-8">

        {/* ================= LOGO ================= */}
        <div className="flex shrink-0 items-center justify-center gap-3">
          <Image
            src="/icon.png"
            alt="Thover"
            width={36}
            height={36}
            priority
            className="h-9 w-9 rounded-lg object-contain"
          />

          <h1 className="text-[30px] font-bold leading-none tracking-tight text-[#111827]">
            THOVER
          </h1>
        </div>

        {/* ================= HERO CONTENT ================= */}
        <section className="flex flex-1 flex-col items-center text-center">

          {/* Main Heading */}
          <h2 className="mt-8 text-[29px] font-bold leading-tight tracking-[-0.02em] text-[#111827] sm:text-[32px]">
            <span className="bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#5B21B6] bg-clip-text text-transparent">
              Hyperlocal
            </span>{" "}
            Marketplace
          </h2>

          {/* Subtitle */}
          <div className="mt-2 flex flex-col items-center">
            <p className="text-[20px] font-medium leading-tight text-[#475569]">
              Best from local stores
            </p>

            <p className="mt-1 text-[20px] font-medium leading-tight text-[#475569]">
              Just a tap away
            </p>
          </div>

          {/* ================= ILLUSTRATION ================= */}
          <div className="mt-5 flex w-full flex-1 items-center justify-center">
            <Image
              src="/illustration.png"
              alt="Hyperlocal marketplace"
              width={1536}
              height={1024}
              priority
              className="h-auto w-full max-w-[410px] object-contain"
            />
          </div>

          {/* ================= GET STARTED ================= */}
          <div className="mt-3 w-full shrink-0">
            <button
  type="button"
  onClick={handleComingSoon}
              className="
                flex
                h-[56px]
                w-full
                items-center
                justify-center
                rounded-[18px]
                bg-gradient-to-r
                from-[#7C3AED]
                to-[#5B21B6]
                text-[21px]
                font-bold
                text-white
                shadow-[0_8px_20px_rgba(109,40,217,0.25)]
                transition
                duration-200
                hover:-translate-y-0.5
                hover:shadow-[0_10px_25px_rgba(109,40,217,0.30)]
                active:translate-y-0
              "
            >
              Get Started
            </button>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="flex shrink-0 items-center justify-center gap-20 pb-1 pt-6">
          <button
            type="button"
            onClick={handleComingSoon}
            className="text-[14px] font-semibold text-[#8B2CF5] hover:underline"
          >
            Privacy Policy
          </button>

          <button
            type="button"
            onClick={handleComingSoon}
            className="text-[14px] font-semibold text-[#8B2CF5] hover:underline"
          >
            Terms of Use
          </button>
        </footer>
      </div>

      {/* ================= COMING SOON MODAL ================= */}
      {comingSoonModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
          onClick={() => setComingSoonModal(false)}
        >
          <div
            className="w-full max-w-[380px] rounded-[24px] bg-white p-7 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E8FF]">
              <span className="text-3xl">🚀</span>
            </div>

            {/* Title */}
            <h2 className="text-[24px] font-bold text-[#101828]">
              Thover Coming Soon
            </h2>

            {/* Message */}
            <p className="mt-2 text-[14px] leading-6 text-[#7182A6]">
              We are working hard to bring Thover to you.
              Stay tuned!
            </p>

            {/* Close */}
            <button
              type="button"
              onClick={() => setComingSoonModal(false)}
              className="
                mt-6
                h-[46px]
                w-full
                rounded-[13px]
                bg-gradient-to-r
                from-[#7135E8]
                to-[#6931D8]
                text-[15px]
                font-bold
                text-white
              "
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </main>
  );
}