"use client";

import { useSearchParams } from "next/navigation";
import CustomerStorePage from "../components/customer-store/CustomerStorePage";

export default function StorePageContent() {
  const searchParams = useSearchParams();

  const storeId = searchParams.get("storeId");

  // ==========================================
  // STORE ID MISSING
  // ==========================================

  if (!storeId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Store ID is missing.
        </p>
      </div>
    );
  }

  // ==========================================
  // SHOW STORE DIRECTLY
  // ==========================================

  return <CustomerStorePage storeId={storeId} />;
}