"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order_id");

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setChecking(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    try {
      const checkoutData = localStorage.getItem("checkoutData");

      if (!checkoutData) {
        window.location.href = "/cart";
        return;
      }

      const parsedCheckoutData = JSON.parse(checkoutData);

      const source = parsedCheckoutData?.source;

      // ==========================================
      // BUY NOW
      // ==========================================
      if (source === "buyNow") {
        const postId =
          parsedCheckoutData?.products?.[0]?.postId;

        if (!postId) {
          console.error("Post ID not found in checkoutData");
          window.location.href = "/cart";
          return;
        }

        const isMobile = window.matchMedia(
          "(max-width: 767px)"
        ).matches;

        if (isMobile) {
          window.location.href =
            `/products/details?postId=${postId}`;
        } else {
          window.location.href =
            `/products/desktop/details?postId=${postId}`;
        }

        return;
      }

      // ==========================================
      // CART PAYMENT
      // ==========================================
      if (source === "cart") {
        window.location.href = "/cart";
        return;
      }

      // ==========================================
      // DEFAULT
      // ==========================================
      window.location.href = "/cart";

    } catch (error) {
      console.error(
        "Payment success redirect error:",
        error
      );

      window.location.href = "/cart";
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2
            size={35}
            className="mx-auto animate-spin text-[#7135E8]"
          />

          <p className="mt-3 text-sm text-[#7182A6]">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9FF] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#E3DDF3] bg-white p-8 text-center shadow-sm">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle
            size={38}
            className="text-green-500"
          />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-[#32106A]">
          Payment Successful
        </h1>

        <p className="mt-2 text-sm text-[#7182A6]">
          Your payment has been received successfully.
        </p>

        {orderId && (
          <p className="mt-4 break-all text-xs text-[#8B82A6]">
            Order ID: {orderId}
          </p>
        )}

        <button
          type="button"
          onClick={handleContinue}
          className="
            mt-6
            w-full
            rounded-lg
            bg-gradient-to-r
            from-[#7135E8]
            to-[#6D28D9]
            px-5
            py-3
            text-sm
            font-bold
            text-white
          "
        >
          Continue
        </button>

      </div>
    </main>
  );
}