import type { Metadata } from "next";
import ResponsiveHome from "./components/ResponsiveHome";

export const metadata: Metadata = {
  title: "Thover Marketplace – Hyperlocal Marketplace for Local Shopping",

  description:
    "Discover local products, sellers, businesses, and services near you with Thover, your hyperlocal marketplace for local shopping.",
};

export default function Home() {
  return <ResponsiveHome />;
}