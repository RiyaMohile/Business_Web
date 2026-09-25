"use client";

import { Suspense } from "react";
import StorePageContent from "./StorePageContent";

export default function StorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-500">
            Loading store...
          </p>
        </div>
      }
    >
      <StorePageContent />
    </Suspense>
  );
}