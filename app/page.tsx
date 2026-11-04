import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Thover – Hyperlocal Marketplace for Local Shopping",
  description:
    "Thover is a hyperlocal marketplace where you can discover local stores, explore products, and shop from businesses near you.",

  alternates: {
    canonical: "https://thover.in/",
  },

  openGraph: {
    type: "website",
    title: "Thover – Hyperlocal Marketplace",
    description:
      "Discover local stores, explore products and shop from nearby businesses with Thover.",
    url: "https://thover.in/",
    siteName: "Thover",
  },

  twitter: {
    card: "summary",
    title: "Thover – Hyperlocal Marketplace",
    description:
      "Discover local stores and shop products near you with Thover.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Thover",
    alternateName: "Thover Marketplace",
    url: "https://thover.in/",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <HomeClient />
    </>
  );
}