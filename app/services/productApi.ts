import axios from "axios";

const BASE_URL =
  "https://api.thover.in/v1/api";

// ==========================================
// TYPES
// ==========================================

export interface ProductMedia {
  mediaUrl: string;
}

export interface ProductPrice {
  currency?: string;
  amount?: number;
  priceType?: string;
}

export interface ProductDiscount {
  title?: string;
  type?: string;
  value?: number;
  expiry?: string;
}

export interface Product {
  _id: string;
  topic: string;
  description?: string;

  price?: ProductPrice;

  discount?: ProductDiscount;

  media?: ProductMedia[];

  category?: string;

  idealFor?: string;

  color?: string;

  totalStock?: number;

  tags?: string[];

  createdAt?: string;

  updatedAt?: string;
}

// ==========================================
// TRENDING RESPONSE
// ==========================================

export interface TrendingResponse {
  success: boolean;

  type:
    | "trending"
    | "new_arrival";

  data: Product[];
}

// ==========================================
// SEARCH RESPONSE
// ==========================================

export interface SearchResponse {
  success: boolean;

  message: string;

  data: {
    posts: Product[];

    searchTerm: string;

    filters: {
      category: string | null;
      idealFor: string | null;
    };

    totalResults: number;

    limit: number;

    hasMore: boolean;
  };
}

// ==========================================
// GET TRENDING PRODUCTS
// ==========================================

export const getTrendingProducts = async (
  customerAddressId: string,
  page = 1,
  limit = 20
): Promise<TrendingResponse> => {
  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Authentication token not found."
    );
  }

  const { data } = await axios.get(
    `${BASE_URL}/post/trending`,
    {
      params: {
        customerAddressId,
        page,
        limit,
      },

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  if (!data?.success) {
    throw new Error(
      data?.message ||
        "Unable to load products."
    );
  }

  return data;
};

// ==========================================
// SEARCH PRODUCTS
// ==========================================

export const searchProducts = async (
  search: string,
  category?: string,
  idealFor?: string,
  limit = 20
): Promise<SearchResponse> => {
  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Authentication token not found."
    );
  }

  const { data } = await axios.get(
    `https://api.thover.in/v1/api/post/search-topic`,
    {
      params: {
        search,
        category,
        idealFor,
        limit,
      },

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  if (!data?.success) {
    throw new Error(
      data?.message ||
        "Search failed."
    );
  }

  return data;
};

import api from "./api";

// ==========================================
// TYPES
// ==========================================

export interface ProductMedia {
  mediaUrl: string;
}

export interface ProductPrice {
  currency?: string;
  amount?: number;
  priceType?: string;
}

export interface ProductDiscount {
  title?: string;
  type?: string;
  value?: number;
  expiry?: string;
}

export interface ProductUser {
  _id?: string;
  username?: string;
  name?: string;
  profileImage?: any;
  isVerified?: boolean;
  isSubscribed?: boolean;
  planName?: string;
}

export interface ProductStore {
  _id?: string;
  storeName?: string;
  address?: {
    addressId?: string;
    area?: string;
    city?: string;
  };
  isOnline?: boolean;
  isVerified?: boolean;
}

export interface ProductAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
}

export interface ProductDetail {
  _id: string;

  topic: string;

  description?: string;

  price?: ProductPrice;

  discount?: ProductDiscount;

  media?: ProductMedia[];

  images?: string[];

  imagePath?: string;

  category?: string;

  idealFor?: string;

  color?: string;

  totalStock?: number;

  tags?: string[];

  area?: string;

  status?: string;

  createdAt?: string;

  updatedAt?: string;

  user?: ProductUser;

  store?: ProductStore;

  address?: ProductAddress;

  customerAddressId?: string | null;
}

// ==========================================
// RESPONSE
// ==========================================

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: ProductDetail;
}

// ==========================================
// GET PRODUCT DETAIL
// ==========================================

export const getProductById = async (
  postId: string,
  customerAddressId?: string
): Promise<ProductDetailResponse> => {
  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Authentication token not found."
    );
  }

  const params: Record<string, string> = {};

  if (customerAddressId) {
    params.customerAddressId =
      customerAddressId;
  }

  const { data } = await api.get(
    `/post/post/${postId}`,
    {
      params,

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  if (!data?.success) {
    throw new Error(
      data?.message ||
        "Unable to load product."
    );
  }

  return data;
};