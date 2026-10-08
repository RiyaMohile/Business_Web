"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Tag,
  ShieldCheck,
  Minus,
  Plus,
  X,
  Loader2,
} from "lucide-react";

import { getStoreDetailsWithProducts } from "../services/storeApi";

interface CheckoutData {
  cartId?: string | null;
  products: CheckoutProduct[];
  address?: Address | null;
  deliveryCharge?: number;
  storeId?: string;
}

interface CheckoutProduct {
  postId: string;
  topic: string;
  image?: string;
  quantity: number;
  size?: string;
  price: number;
  storeId: string;
}

interface Address {
  _id: string;
  name: string;
  street: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  latitude: number;
  longitude: number;
  isPrimary?: boolean;
}

declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();

  const [products, setProducts] = useState<CheckoutProduct[]>([]);
  const [address, setAddress] =
    useState<Address | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
const [addressLoading, setAddressLoading] = useState(false);
const [showAddressList, setShowAddressList] = useState(false);

  const [distanceKm, setDistanceKm] = useState<number | null>(null);
const [deliveryCharge, setDeliveryCharge] = useState(20);

  const [couponDiscount, setCouponDiscount] = useState(0);
const [couponCode, setCouponCode] = useState("");
const [couponCodeId, setCouponCodeId] = useState<string | null>(null);

const [coupons, setCoupons] = useState<any[]>([]);
const [selectedCoupon, setSelectedCoupon] = useState<any | null>(null);
const [couponLoading, setCouponLoading] = useState(false);

    

  const [loading, setLoading] =
    useState(true);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [error, setError] =
    useState("");

    const [cartId, setCartId] = useState<string | null>(null);

  // ==========================================
  // LOAD CASHFREE SDK
  // ==========================================

  useEffect(() => {
    const existingScript =
      document.getElementById(
        "cashfree-sdk"
      );

    if (existingScript) return;

    const script =
      document.createElement("script");

    script.id = "cashfree-sdk";
    script.src =
      "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;

    document.body.appendChild(script);
  }, []);

  // ==========================================
  // LOAD CHECKOUT DATA
  // ==========================================

  useEffect(() => {
  loadCheckout();
  fetchAddresses();
  fetchMyCoupons();
}, []);

const calculateDeliveryForAddress = async (
  customerAddress: Address
) => {
  try {
    if (
      customerAddress.latitude == null ||
      customerAddress.longitude == null
    ) {
      console.error("Customer location not available");
      return;
    }

    const storeId = products[0]?.storeId;

    if (!storeId) {
      console.error("Store ID not available");
      return;
    }

    const data = await getStoreDetailsWithProducts(storeId);

    console.log("STORE DETAILS:", data);

  } catch (error) {
    console.error("DELIVERY CHARGE ERROR:", error);
  }
};

  const fetchAddresses = async () => {
  try {
    setAddressLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const response = await fetch(
      "https://api.thover.in/v1/api/address",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    console.log("GET ADDRESSES RESPONSE:", data);

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to fetch addresses"
      );
    }

    const userAddresses: Address[] = data.data || [];

    setAddresses(userAddresses);

    // If checkoutData already has address, keep it
    // otherwise select primary/first address
    if (!address && userAddresses.length > 0) {
      const primaryAddress =
        userAddresses.find((item: any) => item.isPrimary) ||
        userAddresses[0];

      setAddress(primaryAddress);
    }
  } catch (error) {
    console.error(
      "GET ADDRESSES ERROR:",
      error
    );
  } finally {
    setAddressLoading(false);
  }
};

  const loadCheckout = () => {
    try {
      const checkoutData =
        localStorage.getItem(
          "checkoutData"
        );

      if (!checkoutData) {
        setError(
          "No checkout items found."
        );
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(checkoutData);

setCartId(parsed.cartId || null);

setProducts(parsed.products || []);

setAddress(parsed.address || null);



console.log(
  "CHECKOUT DATA FROM LOCAL STORAGE:",
  parsed
);

console.log(
  "DELIVERY CHARGE FROM LOCAL STORAGE:",
  parsed.deliveryCharge
);


        

      setProducts(
        parsed.products || []
      );

      setAddress(
        parsed.address || null
      );

      setDeliveryCharge(
        Number(
          parsed.deliveryCharge || 50
        )
      );
    } catch (error) {
      console.error(
        "CHECKOUT LOAD ERROR:",
        error
      );

      setError(
        "Unable to load checkout."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // TOTALS
  // ==========================================

  const subtotal = products.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const total =
    subtotal -
    couponDiscount +
    deliveryCharge;

  // ==========================================
  // QUANTITY
  // ==========================================

  const updateQuantity = (
  postId: string,
  quantity: number
) => {
  if (quantity < 1) return;

  setProducts((prev) => {
    const updatedProducts = prev.map((item) =>
      item.postId === postId
        ? {
            ...item,
            quantity,
          }
        : item
    );

    const checkoutData =
      localStorage.getItem("checkoutData");

    if (checkoutData) {
      try {
        const parsed = JSON.parse(checkoutData);

        localStorage.setItem(
          "checkoutData",
          JSON.stringify({
            ...parsed,
            products: updatedProducts,
          })
        );
      } catch (error) {
        console.error(
          "UPDATE CHECKOUT QUANTITY STORAGE ERROR:",
          error
        );
      }
    }

    return updatedProducts;
  });
};

const fetchMyCoupons = async () => {
  try {
    setCouponLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const response = await fetch(
      "https://api.thover.in/v1/api/coupon/my-coupons?status=active",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    console.log("MY COUPONS:", data);

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to fetch coupons"
      );
    }

    setCoupons(data.coupons || []);
  } catch (error) {
    console.error("GET COUPONS ERROR:", error);
    setCoupons([]);
  } finally {
    setCouponLoading(false);
  }
};

const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in KM

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
  // ==========================================
  // REMOVE
  // ==========================================

 const removeProduct = (postId: string) => {
  setProducts((prev) => {
    const updatedProducts = prev.filter(
      (item) => item.postId !== postId
    );

    const checkoutData =
      localStorage.getItem("checkoutData");

    if (checkoutData) {
      try {
        const parsed = JSON.parse(checkoutData);

        const updatedCheckoutData = {
          ...parsed,
          products: updatedProducts,
        };

        localStorage.setItem(
          "checkoutData",
          JSON.stringify(updatedCheckoutData)
        );

        console.log(
          "UPDATED CHECKOUT DATA AFTER REMOVE:",
          updatedCheckoutData
        );
      } catch (error) {
        console.error(
          "UPDATE CHECKOUT STORAGE ERROR:",
          error
        );
      }
    }

    return updatedProducts;
  });
};
  // ==========================================
  // COUPON
  // ==========================================

 const applyCoupon = () => {
  const enteredCode = couponCode.trim().toUpperCase();

  if (!enteredCode) {
    alert("Please enter coupon code");
    return;
  }

  const coupon = coupons.find(
    (item) =>
      String(item.code || "").toUpperCase() === enteredCode
  );

  if (!coupon) {
    setCouponCodeId(null);
    setCouponDiscount(0);
    setSelectedCoupon(null);

    alert("Invalid coupon");
    return;
  }

  const discountInRupees =
    Number(coupon.coin || 0) / 100;

  const finalDiscount = Math.min(
    discountInRupees,
    subtotal
  );

  setCouponCodeId(
  coupon._id || null
);

  setCouponDiscount(finalDiscount);
  setSelectedCoupon(coupon);
};

const calculateDeliveryCharge = (
  distanceKm: number | null | undefined
): number => {
  if (distanceKm == null || distanceKm <= 0) {
    return 20;
  }

  let charge = 0;

  // First 5 km → ₹20/km
  charge += Math.min(distanceKm, 5) * 20;

  // 5–12 km → ₹15/km
  if (distanceKm > 5) {
    charge += (Math.min(distanceKm, 12) - 5) * 15;
  }

  // Above 12 km → ₹10/km
  if (distanceKm > 12) {
    charge += (distanceKm - 12) * 10;
  }

  return Math.max(20, Math.round(charge));
};



  // ==========================================
  // PROCEED TO CASHFREE
  // ==========================================

  const handlePayment = async () => {
    if (paymentLoading) return;

    if (!products.length) {
      alert("No products found.");
      return;
    }

    if (!address) {
      alert(
        "Please select delivery address."
      );
      return;
    }

    try {
      setPaymentLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      // IMPORTANT:
      // Your backend checks that all products
      // belong to SAME STORE.
      const response =
        await fetch(
          "https://api.thover.in/v2/api/payment/create",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
  cartId: cartId || null,

  products: products.map((item) => ({
    postId: item.postId,
    quantity: item.quantity,
    size: item.size || null,
  })),

  couponCodeId: couponCodeId,
deliveryCharge: deliveryCharge,

  appId:
    process.env.NEXT_PUBLIC_CASHFREE_APP_ID,
}),
          }
        );

      const data =
        await response.json();

      console.log(
        "CREATE PAYMENT RESPONSE:",
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to create payment"
        );
      }

      const paymentSessionId =
        data.cashfree
          ?.paymentSessionId;

      if (!paymentSessionId) {
        throw new Error(
          "Payment session ID not received."
        );
      }

      // ========================================
      // CASHFREE
      // ========================================

      const cashfree =
        window.Cashfree({
          mode: "sandbox",
        });

      await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
      });

    } catch (error: any) {
      console.error(
        "PAYMENT ERROR:",
        error
      );

      alert(
        error?.message ||
          "Unable to start payment."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2
          className="animate-spin text-[#7135E8]"
          size={30}
        />
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-[#FAF9FF] px-4 py-5 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-5">
          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="mb-2 flex items-center gap-2 text-sm font-medium text-[#32106A]"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h1 className="text-[25px] font-bold text-[#32106A] sm:text-[30px]">
            Checkout
          </h1>

          <p className="text-sm text-[#7182A6]">
            Review your items and delivery details
          </p>
        </div>

        {/* MAIN GRID */}

        <div className="grid gap-5 lg:grid-cols-[1.7fr_0.9fr]">

          {/* LEFT */}

          <div className="space-y-4">

            {/* ITEMS */}

            <section className="rounded-xl border border-[#E3DDF3] bg-white p-4 shadow-sm sm:p-5">

              <h2 className="text-[17px] font-bold text-[#32106A]">
                Your Items ({products.length})
              </h2>

              <div className="mt-3 divide-y divide-[#EEEAF7]">

                {products.map((item) => {
                  const itemTotal =
                    Number(item.price) *
                    Number(item.quantity);

                  return (
                    <div
                      key={item.postId}
                      className="flex gap-3 py-3"
                    >

                      {/* IMAGE */}

                      <div className="h-[65px] w-[65px] shrink-0 overflow-hidden rounded-lg bg-[#F3F0F8] sm:h-[78px] sm:w-[78px]">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.topic}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-[#A69ABF]">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* INFO */}

                      <div className="min-w-0 flex-1">

                        <div className="flex justify-between gap-2">

                          <div>
                            <h3 className="truncate text-[14px] font-bold text-[#32106A]">
                              {item.topic}
                            </h3>

                            <p className="mt-0.5 text-[11px] text-[#7182A6]">
                              Size:{" "}
                              {item.size ||
                                "-"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeProduct(
                                item.postId
                              )
                            }
                            className="text-[#8B82A6]"
                          >
                            <X size={17} />
                          </button>

                        </div>

                        <div className="mt-2 flex items-center justify-between">

                          {/* QTY */}

                          <div className="flex items-center rounded-md border border-[#D8D1E8]">

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.postId,
                                  item.quantity -
                                    1
                                )
                              }
                              disabled={
                                item.quantity <=
                                1
                              }
                              className="flex h-7 w-7 items-center justify-center text-[#32106A] disabled:opacity-30"
                            >
                              <Minus size={13} />
                            </button>

                            <span className="flex h-7 min-w-[30px] items-center justify-center border-x border-[#D8D1E8] text-xs font-semibold text-[#32106A]">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.postId,
                                  item.quantity +
                                    1
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center text-[#32106A]"
                            >
                              <Plus size={13} />
                            </button>

                          </div>

                          <p className="text-[14px] font-bold text-[#32106A]">
                            ₹{" "}
                            {itemTotal.toLocaleString(
                              "en-IN"
                            )}
                          </p>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>
            </section>

            {/* ADDRESS */}

            <section className="rounded-xl border border-[#E3DDF3] bg-white p-4 shadow-sm sm:p-5">

              <div className="flex items-start justify-between gap-3">

                <div className="flex gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F2ECFF]">
                    <MapPin
                      size={20}
                      className="text-[#7135E8]"
                    />
                  </div>

                  <div>
                    <h2 className="text-[15px] font-bold text-[#32106A]">
                      Delivery Address
                    </h2>

                    {address ? (
                      <>
                        <p className="mt-1 text-sm font-semibold text-[#32106A]">
                          {address.name}
                        </p>

                        <p className="text-xs text-[#7182A6]">
                          {address.street},{" "}
                          {address.area},{" "}
                          {address.city},{" "}
                          {address.state} -{" "}
                          {address.pinCode}
                        </p>
                      </>
                    ) : (
                      <p className="mt-1 text-xs text-[#7182A6]">
                        No address selected
                      </p>
                    )}
                  </div>

                </div>

                <button
  type="button"
  onClick={() => setShowAddressList(true)}
  className="text-xs font-semibold text-[#7135E8]"
>
  Change
</button>

              </div>

            </section>

            {showAddressList && (
  <div className="rounded-xl border border-[#E3DDF3] bg-white p-4 shadow-sm sm:p-5">
    <div className="flex items-center justify-between">
      <h3 className="text-[15px] font-bold text-[#32106A]">
        Select Delivery Address
      </h3>

      <button
        type="button"
        onClick={() => setShowAddressList(false)}
        className="text-xs font-semibold text-[#7135E8]"
      >
        Close
      </button>
    </div>

    {addressLoading ? (
      <div className="flex items-center justify-center py-6">
        <Loader2
          size={22}
          className="animate-spin text-[#7135E8]"
        />
      </div>
    ) : addresses.length === 0 ? (
      <div className="py-6 text-center">
        <MapPin
          size={30}
          className="mx-auto text-[#A69ABF]"
        />

        <p className="mt-2 text-sm font-medium text-[#32106A]">
          No saved addresses
        </p>

        <p className="mt-1 text-xs text-[#7182A6]">
          Please add an address first.
        </p>
      </div>
    ) : (
      <div className="mt-4 space-y-3">
        {addresses.map((item) => (
          <button
            key={item._id}
            type="button"
            onClick={() => {
  setAddress(item);
  setShowAddressList(false);

  calculateDeliveryForAddress(item);
}}
            className={`w-full rounded-lg border p-3 text-left transition ${
              address?._id === item._id
                ? "border-[#7135E8] bg-[#F7F3FF]"
                : "border-[#E3DDF3] hover:border-[#B9A4E8]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#32106A]">
                  {item.name}
                </p>

                <p className="mt-1 text-xs leading-5 text-[#7182A6]">
                  {item.street}, {item.area},{" "}
                  {item.city}, {item.state} -{" "}
                  {item.pinCode}
                </p>
              </div>

              {item.isPrimary && (
                <span className="shrink-0 rounded-full bg-[#EEE7FF] px-2 py-1 text-[10px] font-semibold text-[#7135E8]">
                  Primary
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    )}
  </div>
)}

            {/* COUPON */}

           {/* COUPON */}
<section className="rounded-xl border border-[#E3DDF3] bg-white p-4 shadow-sm sm:p-5">

  <div className="flex items-start gap-3">

    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F2ECFF]">
      <Tag
        size={19}
        className="text-[#7135E8]"
      />
    </div>

    <div className="min-w-0 flex-1">

      <h2 className="text-[15px] font-bold text-[#32106A]">
        Apply Coupon / Offers
      </h2>

      {/* INPUT */}
      <div className="mt-2 flex gap-2">

        <input
          value={couponCode}
          onChange={(e) =>
            setCouponCode(e.target.value)
          }
          placeholder="Enter coupon code"
          className="
            h-9
            min-w-0
            flex-1
            rounded-lg
            border
            border-[#D8D1E8]
            px-3
            text-xs
            uppercase
            outline-none
            focus:border-[#7135E8]
          "
        />

        <button
          type="button"
          onClick={applyCoupon}
          className="
            rounded-lg
            bg-gradient-to-r
            from-[#7135E8]
            to-[#6D28D9]
            px-4
            text-xs
            font-semibold
            text-white
          "
        >
          Apply
        </button>

      </div>

      {/* COUPONS LIST */}
      <div className="mt-4">

        <p className="mb-2 text-xs font-semibold text-[#7182A6]">
          Available Coupons
        </p>

        {couponLoading ? (
          <div className="flex items-center gap-2 py-3 text-xs text-[#7182A6]">
            <Loader2
              size={15}
              className="animate-spin"
            />
            Loading coupons...
          </div>
        ) : coupons.length === 0 ? (
          <p className="py-2 text-xs text-[#8B82A6]">
            No coupons available.
          </p>
        ) : (
          <div className="space-y-2">

            {coupons.map((coupon) => (

              <div
                key={coupon._id}
                className={`
                  rounded-lg
                  border
                  p-3
                  transition
                  ${
                    selectedCoupon?._id === coupon._id
                      ? "border-[#7135E8] bg-[#F7F3FF]"
                      : "border-[#E3DDF3] bg-white"
                  }
                `}
              >

                <div className="flex items-center justify-between gap-3">

                  <div className="min-w-0">

                    <p className="text-sm font-bold text-[#32106A]">
                      {coupon.couponName}
                    </p>

                    <p className="mt-1 text-xs text-[#7182A6]">
                      Use code{" "}
                      <span className="font-bold text-[#7135E8]">
                        {coupon.code}
                      </span>
                    </p>

                    <p className="mt-1 text-[11px] text-green-600">
  Get ₹{(Number(coupon.coin || 0) / 100).toLocaleString("en-IN")} off
</p>

                  </div>

                  <button
                    type="button"
                    onClick={() => {
  setCouponCode(coupon.code);
  setSelectedCoupon(coupon);

  // 100 coins = ₹1
  const discountInRupees =
    Number(coupon.coin || 0) / 100;

  const discount = Math.min(
    discountInRupees,
    subtotal
  );

  setCouponDiscount(discount);

  setCouponCodeId(
  coupon._id || null
);
}}
                    className="
                      shrink-0
                      rounded-md
                      border
                      border-[#7135E8]
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      text-[#7135E8]
                      hover:bg-[#7135E8]
                      hover:text-white
                    "
                  >
                    {selectedCoupon?._id === coupon._id
                      ? "Applied"
                      : "Apply"}
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* APPLIED */}
      {selectedCoupon && couponDiscount > 0 && (
        <div className="mt-3 rounded-lg bg-green-50 px-3 py-2">

          <p className="text-xs font-semibold text-green-700">
            {selectedCoupon.code} applied
          </p>

          <p className="mt-0.5 text-[11px] text-green-600">
            You saved ₹{couponDiscount}
          </p>

        </div>
      )}

    </div>

  </div>

</section>

          </div>

          {/* RIGHT */}

          <aside className="h-fit rounded-xl border border-[#E3DDF3] bg-white p-5 shadow-sm lg:sticky lg:top-5">

            <h2 className="text-[17px] font-bold text-[#32106A]">
              Price Breakdown
            </h2>

            <div className="mt-5 space-y-4">

              <div className="flex justify-between text-sm">
                <span className="text-[#7182A6]">
                  MRP ({products.length} items)
                </span>

                <span className="font-semibold text-[#32106A]">
                  ₹{" "}
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-[#7182A6]">
                  Delivery Charge
                </span>

                <span className="font-semibold text-[#32106A]">
                  ₹{" "}
                  {deliveryCharge.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-[#7182A6]">
                  Coupon Discount
                </span>

                <span className="font-semibold text-green-600">
                  - ₹{" "}
                  {couponDiscount.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="border-t border-[#EEEAF7] pt-4">

                <div className="flex items-center justify-between">

                  <span className="text-[15px] font-bold text-[#32106A]">
                    Total Payable
                  </span>

                  <span className="text-[23px] font-bold text-[#7135E8]">
                    ₹{" "}
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

              </div>

              <button
                type="button"
                onClick={handlePayment}
                disabled={
                  paymentLoading ||
                  !products.length
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-gradient-to-r
                  from-[#7135E8]
                  to-[#6D28D9]
                  px-5
                  py-3
                  text-[14px]
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:from-[#6428D8]
                  hover:to-[#5B21B6]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {paymentLoading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Pay
                    <span className="text-lg">
                      →
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 rounded-lg bg-[#F8F7FC] p-3">

                <ShieldCheck
                  size={22}
                  className="text-green-500"
                />

                <div>
                  <p className="text-xs font-semibold text-[#32106A]">
                    100% Secure Payment
                  </p>

                  <p className="text-[10px] text-[#7182A6]">
                    Your transaction is safe with us
                  </p>
                </div>

              </div>

            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}