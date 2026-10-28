import axios from "axios";

const BASE_URL = "https://api.thover.in/v1/api";

export interface CreateBankAccountPayload {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

export const createBankAccount = async (
  payload: CreateBankAccountPayload
) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.post(
      `${BASE_URL}/bank-account/create`,
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
      "CREATE BANK ACCOUNT ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};


export const updateBankAccount = async (
  id: string,
  payload: {
    bankName: string;
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
    isPrimary: boolean;
  }
) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.put(
      `${BASE_URL}/bank-account/update/${id}`,
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
      "UPDATE BANK ACCOUNT ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getMyBankAccount = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const { data } = await axios.get(
      `${BASE_URL}/bank-account/my-account`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return {
        success: false,
        bankAccount: null,
        message: "Bank account not found",
      };
    }

    console.error(
      "GET BANK ACCOUNT ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};