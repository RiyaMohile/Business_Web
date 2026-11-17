
import type { Metadata } from "next";
import { Suspense } from "react";
import StorePageContent from "./StorePageContent";

export const metadata: Metadata = {
  title: "Explore Local Stores",
  description:
    "Explore local stores on Thover. Discover nearby businesses, products, and local shopping options. Shop local and support local businesses.",

  alternates: {
    canonical: "https://thover.in/store",
  },

  openGraph: {
    type: "website",
    url: "https://thover.in/store",
    siteName: "Thover",
    title: "Explore Local Stores | Thover",
    description:
      "Discover local stores, explore products, and shop from nearby businesses with Thover.",
    images: [
      {
        url: "https://thover.in/icon.png",
        alt: "Thover",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "Explore Local Stores | Thover",
    description:
      "Discover local stores and products on Thover.",
    images: ["https://thover.in/icon.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function StorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading store...
        </div>
      }
    >
      <StorePageContent />
    </Suspense>
  );
}
