import type { Metadata } from "next";
import HomeResponsive from "./HomeResponsive";

export const metadata: Metadata = {
  title: "Thover",
  description:
    "Thover is a hyperlocal marketplace where you can discover local stores, explore products, and shop from businesses near you.",

  alternates: {
    canonical: "https://thover.in/",
  },

  openGraph: {
    type: "website",
    title: "Thover",
    description:
      "Discover local stores, explore products and shop from nearby businesses with Thover.",
    url: "https://thover.in/",
    siteName: "Thover",
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
  alternateName: ["Thover", "thover.in"],
  url: "https://thover.in/",
};

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Thover",
    url: "https://thover.in/",
    logo: "https://thover.in/logo.png",
    
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <HomeResponsive />
    </>
  );
}