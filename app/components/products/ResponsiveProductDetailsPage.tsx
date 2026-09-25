"use client";

import ProductDetailsPage from "./ProductDetailsPage";
import DesktopProductDetailsPage from "./desktop/DesktopProductDetailsPage";

export default function ResponsiveProductDetailsPage() {
  return (
    <>
      {/* ================= MOBILE ================= */}

      <div className="block md:hidden">
        <ProductDetailsPage />
      </div>

      {/* ================= DESKTOP ================= */}

      <div className="hidden md:block">
        <DesktopProductDetailsPage />
      </div>
    </>
  );
}