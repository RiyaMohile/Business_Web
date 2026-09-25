import type { Metadata } from "next";
import { Suspense } from "react";
import ResponsiveProductDetailsPage from "../../components/products/ResponsiveProductDetailsPage";

export const metadata: Metadata = {
  title: "Product Details – Thover Marketplace",
  description:
    "Explore product details, pricing, availability, and local shopping options on Thover Marketplace, your hyperlocal marketplace.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading product details...</div>}>
      <ResponsiveProductDetailsPage />
    </Suspense>
  );
}