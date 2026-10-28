
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.thover.in";

const subscriptionApi = axios.create({
  baseURL: `${API_BASE_URL}/v2/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Authenticated subscription APIs ke liye token
subscriptionApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export interface SubscriptionPlan {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  durationMonths: number;
  maxStores?: number | null;
  unlimitedStores?: boolean;
  maxPosts?: number | null;
  features?: string[];
  isActive?: boolean;
}

export interface CreateSubscriptionOrderResponse {
  success: boolean;
  message?: string;
  purchaseId: string;
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  store?: {
    storeId: string;
    storeName?: string;
  };
  plan?: {
    planId: string;
    name: string;
    price: number;
    durationMonths: number;
  };
}

export interface VerifySubscriptionPaymentPayload {
  purchaseId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// GET all available subscription plans
export const getAvailableSubscriptionPlans = async () => {
  const response = await subscriptionApi.get("/plans/available");
  return response.data;
};

// POST create Razorpay subscription order
export const createSubscriptionOrder = async (
  storeId: string,
  planId: string
): Promise<CreateSubscriptionOrderResponse> => {
  const response = await subscriptionApi.post(
    "/subscriptions/create-order",
    {
      storeId,
      planId,
    }
  );

  return response.data;
};

// POST verify Razorpay subscription payment
export const verifySubscriptionPayment = async (
  payload: VerifySubscriptionPaymentPayload
) => {
  const response = await subscriptionApi.post(
    "/subscriptions/verify-payment",
    payload
  );

  return response.data;
};
