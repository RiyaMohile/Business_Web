
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Users,
  ShoppingCart,
  ShieldCheck,
  MapPin,
  Sparkles,
  Rocket,
  LogIn,
  MessageCircle,
  Mail,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import thoverIcon from "../../../app/icon.png";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StatItem {
  label: string;
  value?: string;
  icon: LucideIcon;
}

const stats: StatItem[] = [
  { icon: Home, value: "100+", label: "Local Store" },
  { icon: Users, value: "50+", label: "Satisfied User" },
  { icon: ShoppingCart, value: "500+", label: "Product Listed" },
  { icon: ShieldCheck, value: "100%", label: "Safe & Secure" },
];

export default function ThoverHero() {
  const router = useRouter();
  const [contactOpen, setContactOpen] = useState(false);
const [isCheckingAuth, setIsCheckingAuth] = useState(true);

useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    router.replace("/products");
  } else {
    setIsCheckingAuth(false);
  }
}, [router]);

if (isCheckingAuth) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#160943]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-300 border-t-transparent" />
    </div>
  );
}

const handleLoginClick = () => {
  const token = localStorage.getItem("token");

  if (token) {
    router.push("/products");
  } else {
    router.push("/loginform");
  }
};

  return (
    <main className="font-[family-name:var(--font-nunito)] relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#160943] text-white">
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-purple-600/40 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 top-10 h-[450px] w-[450px] rounded-full bg-fuchsia-600/40 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-96 rounded-full bg-violet-600/40 blur-[120px]" />

      {/* NAVBAR */}
      <header className="relative z-30 flex shrink-0 items-center justify-between px-4 py-2 sm:px-8 sm:py-3 lg:px-14 lg:py-4">

  {/* LOGO */}
  <Link href="/" className="flex items-center gap-2 sm:gap-3">
    <div className="relative h-9 w-9 sm:h-12 sm:w-12">
      <Image
        src={thoverIcon}
        alt="Thover Logo"
        fill
        className="rounded-xs object-contain"
        priority
      />
    </div>

    <span className="text-xl font-extrabold tracking-tight sm:text-3xl">
      THOVER
    </span>
  </Link>

  {/* LOGIN + CONTACT */}
  <div className="flex items-center gap-2 sm:gap-3">

    <button
  onClick={() => setContactOpen(true)}
  className="flex items-center gap-1.5 rounded-lg border border-fuchsia-300 bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-fuchsia-600 sm:gap-2 sm:rounded-xl sm:px-5 sm:py-3 sm:text-base"
>
  <MessageCircle size={16} />
  Contact Us
</button>

    <button
      onClick={handleLoginClick}
      className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 px-3 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(192,38,211,0.4)] transition hover:-translate-y-0.5 sm:gap-2 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
    >
      <LogIn size={16} />
      Login
    </button>

  </div>
</header>

      {/* MAIN CONTENT */}
      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1500px] flex-1 flex-col justify-between px-3 pb-2 pt-1 sm:px-8 md:px-12 md:pb-3">

        {/* HERO SECTION */}
        <section className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] items-center gap-1 md:grid-cols-[0.9fr_1.1fr] md:grid-rows-1 md:gap-5">
          {/* LEFT CONTENT */}
          <div className="relative z-20 flex min-h-0 flex-col items-center justify-center text-center md:items-start md:text-left">

            <h1 className="text-[clamp(29px,8vw,42px)] font-extrabold leading-[0.98] tracking-[-1px] md:text-[clamp(35px,5.1vw,76px)] md:leading-[1.02] md:tracking-[-2px]">
              Hyper Local
              <br />
              Market,
              <br />
              <span className="relative inline-block bg-gradient-to-r from-white via-pink-300 to-fuchsia-400 bg-clip-text text-transparent">
                Get Online.
                <span className="absolute -bottom-2 left-[48%] h-1.5 w-[60%] -rotate-3 rounded-full bg-fuchsia-400 shadow-[0_0_12px_#d946ef]" />
              </span>
            </h1>

            {/* DESCRIPTION */}
            <div className="mt-2 flex items-center justify-center gap-2 md:mt-6 md:justify-start lg:mt-8">
              <div className="h-12 w-1.5 shrink-0 rounded-full bg-fuchsia-400 shadow-[0_0_15px_#d946ef] sm:h-16" />

              <p className="text-[11px] leading-snug text-purple-100 sm:text-sm md:text-lg lg:text-xl xl:text-2xl">
  Discover, Compare & Shop
  <br />
  From Your Local Shops On Thover
</p>
            </div>

            {/* DESKTOP STATISTICS */}
            <div className="mt-6 hidden grid-cols-4 rounded-2xl border border-white/60 bg-gradient-to-r from-white to-purple-200 p-3 text-center text-[#26105d] shadow-[0_0_25px_rgba(216,180,254,0.6)] sm:grid lg:mt-9 lg:p-4">

              {stats.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className={`flex flex-col items-center justify-center px-1 ${
                      index !== 3 ? "border-r border-purple-400" : ""
                    }`}
                  >
                    <Icon size={30} className="mb-1 text-purple-800 lg:h-9 lg:w-9" />

                    <span className="min-h-6 text-sm font-extrabold lg:text-base">
                      {item.value || "\u00A0"}
                    </span>

                    <span className="text-[10px] font-bold leading-tight lg:text-xs">
                      {item.label}
                    </span>
                  </div>
                );
              })}

            </div>
          </div>

          
{/* RIGHT IMAGE COLLAGE */}
<div className="relative mx-auto h-full min-h-0 w-full max-w-[620px] overflow-visible md:max-w-[700px]">

  {/* SHOE STORE - SLIGHT LEFT TILT */}
 {/* SHOE STORE - STRAIGHT */}
<div className="absolute left-[4%] top-[2%] z-[2] h-[64%] w-[56%] overflow-hidden rounded-[24px] border-[3px] border-white bg-white shadow-[0_0_25px_#c084fc] sm:rounded-[30px] sm:border-4">
    <Image
      src="/images/shoe-store.jpg"
      alt="Thover shoe showroom"
      fill
      priority
      sizes="(max-width: 768px) 55vw, 35vw"
      className="object-cover"
    />
  </div>

  {/* CLOTHING STORE - SLIGHT RIGHT TILT */}
  <div className="absolute left-[49%] top-[1%] z-[2] h-[97%] w-[50%] overflow-hidden rounded-[25px] border-[3px] border-white bg-white shadow-[0_0_30px_#d946ef] transition-transform duration-500 sm:rounded-[35px] sm:border-4">
  <Image
    src="/images/clothing-store.jpg"
    alt="Thover clothing showroom"
    fill
    priority
    sizes="(max-width: 768px) 55vw, 35vw"
    className="object-cover"
  />
</div>

  {/* SHOP INTERIOR - BOTTOM OVERLAPPING CARD */}
  <div className="absolute bottom-[1%] left-[36%] z-[5] h-[34%] w-[34%] rotate-0 overflow-hidden rounded-[20px] border-[3px] border-white bg-white shadow-[0_0_20px_#c084fc] sm:rounded-[28px] sm:border-4">
    <Image
      src="/images/shop-interior.jpg"
      alt="Local shop interior"
      fill
      sizes="(max-width: 768px) 35vw, 20vw"
      className="object-cover"
    />
  </div>

  {/* PURPLE CIRCLE BACKGROUND */}
  <div className="absolute bottom-[0%] left-[0%] z-[10] h-[49%] w-[48%] overflow-visible">
    <div className="absolute bottom-0 left-0 h-[88%] w-[88%] rounded-full border-[4px] border-white bg-gradient-to-br from-purple-300 to-violet-500 shadow-[0_0_30px_#c084fc]" />
  </div>

  {/* SHOP OWNER - PNG OUTSIDE THE CIRCLE */}
  <div className="absolute bottom-0 left-[-2%] z-[15] h-[53%] w-[49%] overflow-visible">
    <Image
      src="/images/shop-owner.png"
      alt="Thover shop owner holding mobile"
      fill
      priority
      sizes="(max-width: 768px) 50vw, 25vw"
      className="object-contain object-bottom drop-shadow-[0_5px_12px_rgba(0,0,0,0.2)]"
    />
  </div>

  {/* FLOATING THOVER LOGO */}
  {/* <div className="absolute left-[48%] top-[43%] z-[25] flex h-14 w-14 items-center justify-center rounded-xl border-2 border-fuchsia-300 bg-gradient-to-br from-purple-500 to-indigo-950 p-2 shadow-[0_0_30px_#e879f9] sm:h-20 sm:w-20 sm:rounded-2xl lg:h-24 lg:w-24">
    <Image
      src={thoverIcon}
      alt="Thover Logo"
      width={65}
      height={65}
      className="h-full w-full object-contain"
    />
  </div> */}

</div>


        </section>

        {/* MOBILE STATISTICS */}
       <div className="grid shrink-0 grid-cols-4 rounded-xl border border-white/60 bg-gradient-to-r from-white to-purple-200 p-2 text-center text-[#26105d] shadow-[0_0_20px_#c084fc] md:hidden">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center border-r border-purple-300 px-0.5 last:border-0"
              >
                <Icon size={21} className="text-purple-800" />

<span className="mt-0.5 text-[10px] font-extrabold">
  {item.value || "\u00A0"}
</span>

<span className="text-[8px] font-bold leading-tight">
  {item.label}
</span>
              </div>
            );
          })}

        </div>

        {/* BOTTOM ANNOUNCEMENT */}
       <section className="mt-2 flex shrink-0 flex-col items-center gap-2 md:mt-4 md:flex-row md:gap-5">

          {/* LOCATION */}
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/70 bg-white px-5 py-2 text-xs font-extrabold text-purple-950 shadow-[0_0_20px_#c084fc] sm:px-7 sm:py-3 sm:text-base lg:text-lg">
            <MapPin size={25} className="text-purple-700" />
            Ranchi – Available
          </div>

          {/* DIVIDER */}
          <div className="hidden h-14 w-px bg-purple-300 lg:block" />

          {/* COMING SOON */}
         
{/* COMING SOON - COMPACT CARD */}
<div className="flex w-full min-w-0 items-center gap-2 rounded-xl border border-fuchsia-400/80 bg-gradient-to-r from-purple-950 to-indigo-950 px-3 py-2 shadow-[0_0_18px_#c026d3] md:w-auto md:max-w-[560px] md:flex-none md:gap-3 md:rounded-2xl md:px-4 md:py-2.5">

  <Rocket
    size={34}
    className="shrink-0 text-fuchsia-300 sm:h-10 sm:w-10"
  />

  <div className="min-w-0">
    <h2 className="text-[11px] font-extrabold sm:text-sm md:text-base lg:text-lg">
  Coming Soon to Delhi & More Cities!
</h2>
    <p className="mt-0.5 text-[9px] leading-tight text-purple-200 sm:text-xs lg:text-sm">
  Expanding Your Local Shopping Experience Across India.
</p>
  </div>

</div>


        </section>

      </div>

      {/* BOTTOM GLOW */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-purple-600/50 to-transparent" />


{/* CONTACT US DIALOG */}
{contactOpen && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
    onClick={() => setContactOpen(false)}
  >
    <div
      className="relative w-full max-w-md overflow-hidden rounded-3xl border border-purple-400/40 bg-gradient-to-br from-[#24105e] via-[#190943] to-[#10052f] p-6 text-white shadow-[0_0_50px_rgba(168,85,247,0.35)] sm:p-8"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={() => setContactOpen(false)}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-purple-200 transition hover:bg-white/20 hover:text-white"
        aria-label="Close dialog"
      >
        <X size={20} />
      </button>

      {/* Mail Icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-fuchsia-300/40 bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-[0_0_25px_rgba(217,70,239,0.4)]">
        <Mail size={30} className="text-white" />
      </div>

      {/* Heading */}
      <div className="mt-5 text-center">
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          Contact Us
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-purple-200">
          Have questions or need assistance?
          <br />
          We'd love to hear from you!
        </p>
      </div>

      {/* Email Address */}
      <div className="mt-6 rounded-2xl border border-purple-400/40 bg-white/5 p-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-purple-300">
          Email Us At
        </p>

        <p className="mt-2 break-all text-lg font-bold text-white sm:text-xl">
          team@thover.in
        </p>
      </div>

      {/* Send Mail Button */}
      <a
        href="mailto:team@thover.in?subject=Inquiry%20Regarding%20Thover"
        onClick={() => setContactOpen(false)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3.5 font-bold text-white shadow-[0_0_20px_rgba(192,38,211,0.3)] transition hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(192,38,211,0.5)]"
      >
        <Mail size={19} />
        Send Mail
      </a>

      <p className="mt-4 text-center text-xs text-purple-300">
        We look forward to connecting with you!
      </p>

    </div>
  </div>
)}
    </main>
  );
}
