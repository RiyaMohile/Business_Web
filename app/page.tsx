import type { Metadata } from "next";
import ResponsiveHome from "./components/ResponsiveHome";

export const metadata: Metadata = {
  title: "Thover",
  description: "Discover local products, sellers, businesses, and services near you.",
  openGraph: {
    title: "Thover",
    description: "Discover local products and businesses near you.",
    url: "https://thover.in/",
    siteName: "Thover",
    type: "website",
  },
};

export default function Home() {
  return <ResponsiveHome />;
}