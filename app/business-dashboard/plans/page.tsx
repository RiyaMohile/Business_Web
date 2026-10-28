
"use client";

import Script from "next/script";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createSubscriptionOrder,
  getAvailableSubscriptionPlans,
  verifySubscriptionPayment,
  type SubscriptionPlan,
} from "../../services/subscriptionService";

// Razorpay's checkout script adds this global; typed locally so it does not
// clash with the customer checkout page's own global declaration.
const getRazorpay = () =>
  (window as unknown as { Razorpay?: new (
    options: Record<string, unknown>
  ) => {
    open: () => void;
    on: (
      event: string,
      callback: (response: {
        error?: { description?: string; reason?: string };
      }) => void
    ) => void;
  } }).Razorpay;

function PlansContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const storeId = searchParams.get("storeId") || "";

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingPlanId, setBuyingPlanId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showComingSoon, setShowComingSoon] = useState(false);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAvailableSubscriptionPlans();

      // API response { plans: [...] } ya direct array ho sakta hai.
      const planList = Array.isArray(response)
        ? response
        : response?.plans ?? response?.data?.plans ?? response?.data ?? [];

      if (!Array.isArray(planList)) {
        throw new Error("Invalid plans response from server.");
      }

      setPlans(planList);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Plans load nahi ho paaye.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPlans();
  }, [fetchPlans]);

  const handleBuyPlan = async (plan: SubscriptionPlan) => {
    if (!storeId) {
  setError(
    "Store ID is missing. Please choose a plan from your store page."
  );
  return;
}

if (!getRazorpay()) {
  setError(
    "Payment checkout failed to load. Please refresh the page and try again."
  );
  return;
}

    try {
      setError("");
      setMessage("");
      setBuyingPlanId(plan._id);

      // Step 1: Backend se Razorpay order create karo.
      const order = await createSubscriptionOrder(storeId, plan._id);

      if (
        !order?.success ||
        !order.purchaseId ||
        !order.orderId ||
        !order.keyId
      ) {
        throw new Error(
          order?.message || "Payment order create nahi ho paya."
        );
      }

      // Step 2: Razorpay checkout open karo.
      const razorpay = new (getRazorpay()!)({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Thover",
        description: `${plan.name} Subscription`,
        order_id: order.orderId,

        handler: async (paymentResponse: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            setMessage("Payment received. Verification ho rahi hai...");

            // Step 3: Payment ko backend se verify karwao.
            const verification = await verifySubscriptionPayment({
              purchaseId: order.purchaseId,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (!verification?.success) {
              throw new Error(
                verification?.message ||
                  "Payment verification confirm nahi hui."
              );
            }

            setMessage("Subscription successfully activate ho gayi!");

            // Dashboard par wapas jao; wahan store status refresh hoga.
            router.push("/business-dashboard");
            router.refresh();
          } catch (err: unknown) {
            setMessage("");

            setError(
              err instanceof Error
                ? `${err.message} Agar amount deduct hua hai, payment status check karein.`
                : "Payment verification confirm nahi hui. Agar amount deduct hua hai, status check karein."
            );
          } finally {
            setBuyingPlanId(null);
          }
        },
      });

      razorpay.on("payment.failed", (response) => {
        setError(
          response.error?.description ||
            "Payment complete nahi hui. Aap dobara try kar sakte hain."
        );
        setBuyingPlanId(null);
      });

      razorpay.open();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Checkout start nahi ho paya."
      );
      setBuyingPlanId(null);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 text-sm font-medium text-purple-700 hover:text-purple-900"
          >
            ← Back
          </button>

          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">
              Thover Subscription
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Choose Your Plan
            </h1>

           <p className="mt-3 text-slate-600">
  Select a suitable subscription plan for your store.
</p>

            {storeId ? (
              <p className="mt-2 text-sm text-slate-500">
                Store ID: {storeId}
              </p>
            ) : (
              <p className="mt-3 text-sm text-red-600">
                Store ID missing hai. Store details page se aayein.
              </p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {message && (
            <div
              role="status"
              className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
            >
              {message}
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-slate-600">
              Loading subscription plans...
            </div>
          ) : plans.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <h2 className="text-lg font-semibold text-slate-800">
                No plans available
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Abhi koi active subscription plan available nahi hai.
              </p>
              <button
                type="button"
                onClick={() => void fetchPlans()}
                className="mt-5 rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white hover:bg-purple-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <h2 className="text-xl font-bold text-slate-900">
                    {plan.name}
                  </h2>

                  <p className="mt-2 min-h-10 text-sm text-slate-500">
                    {plan.description || "Subscription plan for your store."}
                  </p>

                  <div className="mt-5">
                    <span className="text-3xl font-bold text-slate-900">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: plan.currency || "INR",
                        maximumFractionDigits: 2,
                      }).format(plan.price)}
                    </span>

                    <span className="ml-2 text-sm text-slate-500">
                      / {plan.durationMonths} month
                      {plan.durationMonths === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="my-5 h-px bg-slate-100" />

                  <ul className="flex-1 space-y-3 text-sm text-slate-700">
                    <li>
                      <span className="font-medium">Stores:</span>{" "}
                      {plan.unlimitedStores
                        ? "Unlimited"
                        : plan.maxStores ?? "Not specified"}
                    </li>

                    {/* {plan.maxPosts != null && (
                      <li>
                        <span className="font-medium">Posts:</span>{" "}
                        {plan.maxPosts}
                      </li>
                    )} */}

                    {(plan.features ?? []).map((feature, index) => (
                      <li key={`${plan._id}-feature-${index}`}>
                        <span className="mr-2 text-purple-600">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    disabled={
                      !storeId ||
                      buyingPlanId !== null ||
                      plan.isActive === false
                    }
                    //plan active
                    onClick={() => void handleBuyPlan(plan)}
                    // onClick={() => setShowComingSoon(true)}
                    className="mt-7 w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {buyingPlanId === plan._id
                      ? "Processing..."
                      : "Select Plan & Pay"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>


        
{showComingSoon && (
  <div
    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
    onClick={() => setShowComingSoon(false)}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
      className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-2xl">
        🚀
      </div>

      <h2
        id="coming-soon-title"
        className="mt-4 text-xl font-bold text-slate-900"
      >
        Coming Soon!
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Subscription payments will be available soon.
        Thank you for your patience!
      </p>

      <button
        type="button"
        onClick={() => setShowComingSoon(false)}
        className="mt-5 w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700"
      >
        Okay, Got It
      </button>
    </div>
  </div>
)}

      </main>
    </>
  );
}

export default function PlansPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-slate-600">
          Loading plans page...
        </div>
      }
    >
      <PlansContent />
    </Suspense>
  );
}
