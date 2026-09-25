"use client";

import ProductsPage from "./ProductsPage";
import DesktopProductsPage from "./desktop/DesktopProductsPage";

export default function ResponsiveProductsPage() {
  return (
    <>
      {/* ================= MOBILE ================= */}

      <div className="block md:hidden">
        <ProductsPage />
      </div>

      {/* ================= DESKTOP ================= */}

      <div className="hidden md:block">
        <DesktopProductsPage />
      </div>
    </>
  );
}