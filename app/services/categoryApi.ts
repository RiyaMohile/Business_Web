import axios from "axios";

const BASE_URL = "https://api.thover.in/v1/api";

export const getCategories = async () => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.get(
      `${BASE_URL}/category/categories`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    console.error(
      "GET CATEGORIES ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getSubcategoryInfo = async (
  category: string
) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.get(
      `${BASE_URL}/category/details/${encodeURIComponent(category)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    console.error(
      "GET SUBCATEGORY ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};