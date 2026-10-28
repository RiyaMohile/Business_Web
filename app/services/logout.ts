import axios from "axios";

const LOGOUT_URL =
  "https://api.thover.in/v2/api/auth/phone/logout-user";

export const logoutUser = async (
  userId: string,
  deviceId: string,
  token: string
) => {
  try {
    const { data } = await axios.post(
      LOGOUT_URL,
      {
        userId,
        deviceId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!data?.success) {
      throw new Error(
        data?.message || "Unable to logout."
      );
    }

    // Remove only login/session data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Device ID must remain
    // localStorage.removeItem("deviceId"); ❌

    // Temporary OTP data
    sessionStorage.removeItem("requestId");
    sessionStorage.removeItem("mobile");
    sessionStorage.removeItem("otpType");

    return data;
  } catch (error: any) {
    console.error(
      "LOGOUT ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};