import type { Metadata } from "next";
import ResponsiveProductsPage from "../components/products/ResponsiveProductsPage";

export const metadata: Metadata = {
  title: "Products Near You – Thover Hyperlocal Marketplace",
  description:
    "Discover trending products from local sellers near you on Thover Marketplace. Shop local products and support nearby businesses.",
};

export default function ProductsPageRoute() {
  return <ResponsiveProductsPage />;
}