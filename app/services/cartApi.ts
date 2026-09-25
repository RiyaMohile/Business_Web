import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.thover.in/v1/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ==========================================
// CREATE CART
// ==========================================

export const createCart = async (storeId: string) => {
  const response = await axios.post(
    `${API_URL}/cart/create`,
    {
      storeId,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// ==========================================
// ADD PRODUCT
// ==========================================

export const addPostToCart = async ({
  cartId,
  postId,
  size,
  quantity,
}: {
  cartId: string;
  postId: string;
  size: string;
  quantity: number;
}) => {
  const response = await axios.post(
    `${API_URL}/cart/add-post`,
    {
      cartId,
      postId,
      size,
      quantity,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// ==========================================
// GET MY CART
// ==========================================

export const getMyCart = async () => {
  const response = await axios.get(
    `${API_URL}/cart/my-cart`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// ==========================================
// UPDATE CART ITEM
// ==========================================

export const updateCartPost = async ({
  cartId,
  postId,
  quantity,
  size,
}: {
  cartId: string;
  postId: string;
  quantity: number;
  size?: string;
}) => {
  const response = await axios.put(
    `${API_URL}/cart/update-post`,
    {
      cartId,
      postId,
      quantity,
      size,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// ==========================================
// REMOVE PRODUCT
// ==========================================

export const removePostFromCart = async ({
  cartId,
  postId,
}: {
  cartId: string;
  postId: string;
}) => {
  const response = await axios.delete(
    `${API_URL}/cart/remove-post/${postId}`,
    {
      headers: getAuthHeaders(),
      data: {
        cartId,
      },
    }
  );

  return response.data;
};

// ==========================================
// DELETE CART
// ==========================================

export const deleteCart = async (
  cartId: string
) => {
  const response = await axios.delete(
    `${API_URL}/cart/delete`,
    {
      headers: getAuthHeaders(),
      data: {
        cartId,
      },
    }
  );

  return response.data;
};