import axios from "axios";

const BASE_URL = "https://api.thover.in/v1/api";

export const createWithdrawal = async ({
  amount,
  totalCoins,
}: {
  amount: number;
  totalCoins: number;
}) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const { data } = await axios.post(
      `${BASE_URL}/withdrawal/create`,
      {
  amount,
  totalCoins,
},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error: any) {
    console.error("CREATE WITHDRAWAL ERROR");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);

    throw error;
  }
};

// ==========================================
// GET MY WITHDRAWALS
// ==========================================

export const getMyWithdrawals = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const { data } = await axios.get(
      `${BASE_URL}/withdrawal/my-withdrawals`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    console.error("GET MY WITHDRAWALS ERROR");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);

    throw error;
  }
};