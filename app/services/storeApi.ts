import axios from "axios";

const BASE_URL = "https://api.thover.in/v2/api";

export const getStoreDetailsWithProducts = async (
  storeId: string
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/store/${storeId}/products`
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "GET STORE DETAILS ERROR:",
      error?.response?.data || error
    );

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to fetch store details."
    );
  }
};

export const toggleStoreLike = async (storeId: string) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("LOGIN_REQUIRED");
    }

    const response = await axios.patch(
      `${BASE_URL}/store/${storeId}/toggle-like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "TOGGLE STORE LIKE ERROR:",
      error?.response?.data || error
    );

    throw error;
  }
};


export const getLikedStores = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("LOGIN_REQUIRED");
    }

    const response = await axios.get(
      `${BASE_URL}/store/liked-stores`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "GET LIKED STORES ERROR:",
      error?.response?.data || error
    );

    throw error;
  }
};