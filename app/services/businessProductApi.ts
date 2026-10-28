import axios from "axios";

const BASE_URL = "https://api.thover.in/v1/api";

export const getUserProducts = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    const { data } = await axios.get(
      `${BASE_URL}/post/user/${userId}/posts`,
      {
        params: {
          page,
          limit,
          status: "public",
          sortBy: "createdAt",
          sortOrder: "desc",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("GET USER PRODUCTS:", data);

    return data;
  } catch (error: any) {
    console.error(
      "GET USER PRODUCTS ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getStoreProducts = async (
  storeId: string,
  page: number = 1,
  limit: number = 10
) => {
  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Authentication token not found"
    );
  }

  if (!storeId) {
    throw new Error(
      "Store ID is required"
    );
  }

  const { data } = await axios.get(
    `https://api.thover.in/v2/api/post/store/${storeId}`,
    {
      params: {
        page,
        limit,
        status: "public",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const addSimilarProducts = async (
  postId: string,
  formData: FormData,
  onUploadProgress?: (percent: number) => void
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login again.");
  }

  const response = await axios.post(
    `https://api.thover.in/v2/api/post/${postId}/similar-products`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },

      timeout: 10 * 60 * 1000,

      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) /
              progressEvent.total
          );

          onUploadProgress?.(percent);
        }
      },
    }
  );

  return response.data;
};