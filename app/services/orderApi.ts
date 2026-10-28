import axios from "axios";

const BASE_URL = "https://api.thover.in/v1/api";

// ==========================================
// GET STORE ORDERS
// ==========================================

export const getStoreOrders = async (
  status?: string,
  storeId?: string
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    if (!storeId) {
      throw new Error("Store ID is required");
    }

    const { data } = await axios.get(
      `https://api.thover.in/v2/api/order/store-orders`,
      {
        params: {
          storeId,
          ...(status ? { status } : {}),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    console.error("GET STORE ORDERS ERROR");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);

    throw error;
  }
};


// ==========================================
// GET COMPLETED STORE ORDERS
// ==========================================

export const getCompletedStoreOrders = async (
  storeId?: string
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    if (!storeId) {
      throw new Error("Store ID is required");
    }

    const { data } = await axios.get(
      `https://api.thover.in/v2/api/order/store-orders/completed`,
      {
        params: {
          storeId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    console.error("GET COMPLETED STORE ORDERS ERROR");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);

    throw error;
  }
};

export const searchRiders = async (
  city?: string,
  area?: string
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const { data } = await axios.get(
      `https://api.thover.in/v1/api/order/search-riders`,
      {
        params: {
          ...(city ? { city } : {}),
          ...(area ? { area } : {}),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    console.error("SEARCH RIDERS ERROR");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);

    throw error;
  }
};

export const notifyNearbyRiders = async (
  orderId: string
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const { data } = await axios.post(
      `https://api.thover.in/v1/api/order/orders/${orderId}/notify-nearby-riders`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    console.error("NOTIFY NEARBY RIDERS ERROR");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);

    throw error;
  }
};

export const getLowStockProducts = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${BASE_URL}/post/low-stock`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateOrderStatus = async (
  orderId: string,
  status: string
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  const { data } = await axios.patch(
    `${BASE_URL}/order/status/${orderId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const cancelOrderByStore = async (
  orderId: string,
  reason: string
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const { data } = await axios.patch(
      `${BASE_URL}/order/cancel-by-store/${orderId}`,
      {
        reason,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("CANCEL ORDER RESPONSE:", data);

    return data;
  } catch (error: any) {
    console.error("CANCEL ORDER ERROR");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);

    throw error;
  }
};


