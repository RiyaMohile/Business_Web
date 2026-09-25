import api from "./api";

export const registerDevice = async () => {
  try {
    const response = await api.post(
      "/user/device-detail",
      {
        deviceType: "web",
        deviceName: navigator.userAgent,
        appVersion: "1.0.0",
      }
    );

    console.log("DEVICE DETAIL RESPONSE:", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "DEVICE DETAIL ERROR:",
      error.response?.data || error
    );

    throw error;
  }
};