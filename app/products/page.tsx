
import type { Metadata } from "next";
import ResponsiveProductsPage from "../components/products/ResponsiveProductsPage";

export const metadata: Metadata = {
  title: "Products Near You",
  description:
    "Discover products from local sellers near you on Thover. Explore trending products, compare options, and support nearby businesses.",

  alternates: {
    canonical: "https://thover.in/products",
  },

  openGraph: {
    type: "website",
    url: "https://thover.in/products",
    siteName: "Thover",
    title: "Products Near You | Thover",
    description:
      "Discover products from local sellers near you. Explore products and support nearby businesses.",
    images: [
      {
        url: "https://thover.in/icon.png",
        alt: "Thover",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ProductsPageRoute() {
  return <ResponsiveProductsPage />;
}
