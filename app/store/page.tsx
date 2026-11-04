import type { Metadata } from "next";
import { Suspense } from "react";
import StorePageContent from "./StorePageContent";

export const metadata: Metadata = {
  title: "Explore Local Stores",
  description:
    "Explore local stores on Thover. Discover nearby businesses, products and local shopping options.",

  alternates: {
    canonical: "https://thover.in/store",
  },

  openGraph: {
    title: "Explore Local Stores | Thover",
    description:
      "Discover local stores and products on Thover.",
    url: "https://thover.in/store",
    siteName: "Thover",
    type: "website",
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