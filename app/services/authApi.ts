import api from "./api";

/* ==========================================
   SEND LOGIN OTP
========================================== */

export const sendLoginOTP = async (
  mobile: string
) => {
  const { data } = await api.post(
    "/auth/phone/send-otp",
    {
      mobile,
      type: "login",
    }
  );

  return data;
};


/* ==========================================
   SEND REGISTER OTP
========================================== */

export const sendRegisterOTP = async (
  mobile: string
) => {
  const { data } = await api.post(
    "/auth/phone/send-otp",
    {
      mobile,
      type: "register",
    }
  );

  return data;
};


/* ==========================================
   VERIFY LOGIN OTP
========================================== */

export const verifyLoginOTP = async ({
  requestId,
  otp,
  deviceId,
}: {
  requestId: string;
  otp: string;
  deviceId: string;
}) => {
  const { data } = await api.post(
    "/auth/phone/login-user-otp",
    {
      requestId,
      otp,
      deviceId,
    }
  );

  return data;
};


/* ==========================================
   RESEND OTP
========================================== */

export const resendOTPRequest = async (
  mobile: string
) => {
  const { data } = await api.get(
    "/auth/phone/resend-otp",
    {
      params: {
        mobile,
      },
    }
  );

  return data;
};

/* ==========================================
   GET USER DETAILS
========================================== */

export const getUserDetails = async (
  userId: string
) => {
  const { data } = await api.get(
    `/user/details/${userId}`
  );

  return data;
};


/* ==========================================
   LOGOUT USER
========================================== */

export const logoutUser = async () => {
  const userId = localStorage.getItem("userId");
  const deviceId = localStorage.getItem("deviceId");

  if (!userId) {
    throw new Error("User ID not found.");
  }

  if (!deviceId) {
    throw new Error("Device ID not found.");
  }

  const { data } = await api.post(
    "https://api.thover.in/v2/api/auth/phone/logout-user",
    {
      userId,
      deviceId,
    }
  );

  if (!data?.success) {
    throw new Error(
      data?.message || "Logout failed."
    );
  }

  // ==========================================
  // CLEAR LOGIN DATA
  // ==========================================

  // Save deviceId before clearing
  const savedDeviceId = localStorage.getItem("deviceId");

  // Remove EVERYTHING from localStorage
  localStorage.clear();

  // Restore ONLY deviceId
  if (savedDeviceId) {
    localStorage.setItem(
      "deviceId",
      savedDeviceId
    );
  }

  // Clear OTP / temporary session data
  sessionStorage.clear();

  return data;
};