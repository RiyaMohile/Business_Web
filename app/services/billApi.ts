import axios from "axios";

const BASE_URL = "https://api.thover.in/v1/api";

export interface BillProduct {
  _id: string;
  postId: string;
  topic: string;
  description?: string;

  price?: {
    currency?: string;
    amount?: number;
    priceType?: string;
  };

  inventory?: {
    size: string;
    stock: number;
    lastUpdated?: string;
  }[];

  totalStock?: number;

  discount?: {
    title?: string;
    expiry?: string;
    type?: "percentage" | "flat";
    value?: number;
  };

  media?: {
    mediaName?: string;
    mediaUrl?: string;
    mediaPath?: string;
    isDeleted?: boolean;
  }[];

  store?: string;
}

export const searchProductByNumber = async (
  productNumber: string,
  storeId: string
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.get(
      `https://api.thover.in/v2/api/post/search-product-by-number`,
      {
        params: {
          productNumber: productNumber.trim().toUpperCase(),
          storeId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "SEARCH PRODUCT BY NUMBER ERROR:",
      error?.response?.data || error?.message
    );

    throw new Error(
      error?.response?.data?.message ||
        "Unable to search product"
    );
  }
};

// ==========================================
// CREATE OFFLINE BILL
// ==========================================

export interface CreateOfflineBillProduct {
  postId: string;
  quantity: number;
  size?: string | null;
}

export interface CreateOfflineBillPayload {
  storeId: string;
  customerPhone?: string | null;
  customerUserId?: string | null;
  products: CreateOfflineBillProduct[];
}

export interface CreateOfflineBillProduct {
  postId: string;
  quantity: number;
  size?: string | null;
}

export interface CreateOfflineBillPayload {
  storeId: string;
  customerPhone?: string | null;
  customerUserId?: string | null;
  products: CreateOfflineBillProduct[];
  discount?: number;
}

export const createOfflineBill = async (
  payload: CreateOfflineBillPayload
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.post(
      `https://api.thover.in/v1/api/bill/offline`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "CREATE OFFLINE BILL ERROR:",
      error?.response?.data || error
    );

    throw new Error(
      error?.response?.data?.message ||
        "Unable to create bill"
    );
  }
};