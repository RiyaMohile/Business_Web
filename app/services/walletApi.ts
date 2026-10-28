import axios from "axios";

const BASE_URL = "https://api.thover.in/v1/api";

export const createWallet = async (walletName?: string) => {
  try {
    const token = localStorage.getItem("token");

    const payload: {
      walletName?: string;
    } = {};

    if (walletName?.trim()) {
      payload.walletName = walletName.trim();
    }

    const { data } = await axios.post(
      `${BASE_URL}/wallet/create-wallet`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error: any) {
    console.error(
      "CREATE WALLET ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};
export const getWalletTransactions = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const { data } = await axios.get(
      `${BASE_URL}/wallet/wallet-transactions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    console.error(
      "GET WALLET TRANSACTIONS ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};
export const getWallet = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const { data } = await axios.get(
      `${BASE_URL}/wallet/fetch-wallet`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("GET WALLET RESPONSE:", data);

    return data;

  } catch (error: any) {

    // Wallet not created yet
    if (error.response?.status === 404) {
      return {
        success: false,
        wallet: null,
        message: "Wallet not found",
      };
    }

    console.error(
      "GET WALLET ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};