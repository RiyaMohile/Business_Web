
import type { Metadata } from "next";
import { Suspense } from "react";
import ResponsiveProductDetailsPage from "../../components/products/ResponsiveProductDetailsPage";

export const metadata: Metadata = {
  title: "Product Details | Thover",
  description:
    "Explore product details, pricing, availability, and shopping options from local sellers on Thover. Discover products and support nearby businesses.",

  alternates: {
    canonical: "https://thover.in/products/details",
  },

  openGraph: {
    type: "website",
    url: "https://thover.in/products/details",
    siteName: "Thover",
    title: "Product Details | Thover",
    description:
      "Explore product details, prices, and availability from local sellers on Thover.",
    images: [
      {
        url: "https://thover.in/icon.png",
        alt: "Thover ",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading product details...</div>}>
      <ResponsiveProductDetailsPage />
    </Suspense>
  );
}
