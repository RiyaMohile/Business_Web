import axios from "axios";

const BASE_URL = "https://api.thover.in/v1/api";

export const updateStore = async (
  storeId: string,
  payload: {
    storeName: string;
    category: string;
    gstNumber: string;

    address: {
      addressId: string;
      area: string;
      city: string;
    };

    workingDays: {
      from: string;
      to: string;
    };

    openingHours: {
      from: string;
      to: string;
    };

    phoneContactId?: string;
    mailContactId?: string;
  }
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const { data } = await axios.put(
      `${BASE_URL}/store/update/${storeId}`,
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
    console.error("UPDATE STORE ERROR");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);

    throw error;
  }
};


// ==========================================
// UPDATE STORE ONLINE STATUS
// ==========================================

export const updateStoreOnlineStatus = async (
  storeId: string,
  isOnline: boolean
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const { data } = await axios.patch(
      `https://api.thover.in/v1/api/store/${storeId}/online-status`,
      {
        isOnline,
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
    console.error("UPDATE STORE ONLINE STATUS ERROR");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);

    throw error;
  }
};


// ==========================================
// UPDATE STORE ADDRESS
// ==========================================

export const updateStoreAddress = async (
  storeId: string,
  addressId: string,
  area: string,
  city: string
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const { data } = await axios.patch(
      `${BASE_URL}/store/${storeId}/address`,
      {
        addressId,
        area,
        city,
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
    console.error(
      "UPDATE STORE ADDRESS ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ==========================================
// GET MY STORE
// ==========================================

export const getMyStore = async () => {
  const token = localStorage.getItem("token");

  const { data } = await axios.get(
    "https://api.thover.in/v1/api/store/my-store",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

// ==========================================
// GET ALL MY STORES - V2
// ==========================================

export const getMyStores = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const { data } = await axios.get(
      "https://api.thover.in/v2/api/store/my-stores",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    console.error("GET ALL STORES ERROR");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);

    throw error;
  }
};

// ==========================================
// GET ALL USERS
// ==========================================

export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const { data } = await axios.get(
      `${BASE_URL}/user/all-users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    console.error("GET ALL USERS ERROR");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);

    throw error;
  }
};

// ==========================================
// ADD MEMBER TO STORE
// ==========================================

export const addStoreMember = async (
  storeId: string,
  userId: string,
  role: "manager"
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const { data } = await axios.post(
      `${BASE_URL}/store/${storeId}/members`,
      {
        userId,
        role,
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
    console.error("ADD STORE MEMBER ERROR");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);

    throw error;
  }
};
export const removeStoreMember = async (
  storeId: string,
  userId: string
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  const { data } = await axios.delete(
    `${BASE_URL}/store/${storeId}/deleteMembers`,
    {
      data: {
        userId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data;
};
