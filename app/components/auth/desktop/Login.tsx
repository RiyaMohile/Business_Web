"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Smartphone,
  UserPlus,
  ChevronDown,
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../services/api";

import { sendLoginOTP } from "../../../services/authApi";
import { registerDevice } from "../../../services/deviceApi";
import AlertBox from "../../common/AlertBox";

export default function Login() {
  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [comingSoonModal, setComingSoonModal] = useState(false);
  const [loginMode, setLoginMode] = useState<"otp" | "password">("otp");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    title: "",
    message: "",
    type: "info" as
      | "success"
      | "error"
      | "warning"
      | "info",
  });

  const showAlert = (
    message: string,
    type:
      | "success"
      | "error"
      | "warning"
      | "info" = "info",
    title = ""
  ) => {
    setAlert({
      open: true,
      title,
      message,
      type,
    });
  };

  const handleComingSoon = () => {
  setComingSoonModal(true);
};
  /* ==========================================
     MOBILE CHANGE
  ========================================== */

  const handleMobileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setMobile(value);
    }
  };

  /* ==========================================
     LOGIN
  ========================================== */

  const handleLogin = async () => {
    // ========================================
    // VALIDATION
    // ========================================

    if (!mobile.trim()) {
      showAlert(
        "Please enter your phone number.",
        "warning",
        "Phone Number Required"
      );
      return;
    }

    if (mobile.length !== 10) {
      showAlert(
        "Please enter a valid 10 digit phone number.",
        "warning",
        "Invalid Phone Number"
      );
      return;
    }

    try {
      setLoading(true);

      // ========================================
      // DEVICE ID
      // ========================================

     let deviceId = localStorage.getItem("deviceId");

if (!deviceId) {
  const deviceResponse = await registerDevice();

  console.log(
    "DEVICE REGISTRATION RESPONSE:",
    deviceResponse
  );

  if (
    !deviceResponse?.status ||
    !deviceResponse?.device?.deviceId
  ) {
    throw new Error("Unable to register device.");
  }

  // New device ID is definitely a string here
  const newDeviceId = deviceResponse.device.deviceId;

  // Update variable for further use
  deviceId = newDeviceId;

  // Save string in localStorage
  localStorage.setItem(
    "deviceId",
    newDeviceId
  );

  console.log(
    "DEVICE ID SAVED:",
    newDeviceId
  );
}

      // ========================================
      // PHONE NUMBER
      // ========================================

      const mobileNumber =
        `91${mobile}`;

      // ========================================
      // SEND LOGIN OTP
      // ========================================

      const response =
        await sendLoginOTP(
          mobileNumber
        );

      console.log(
        "LOGIN OTP RESPONSE:",
        response
      );

      // ========================================
      // CHECK RESPONSE
      // ========================================

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to send OTP."
        );
      }

      if (!response?.requestId) {
        throw new Error(
          "OTP request ID was not received."
        );
      }

      // ========================================
      // SAVE OTP DATA
      // ========================================

      sessionStorage.setItem(
        "requestId",
        response.requestId
      );

      sessionStorage.setItem(
        "mobile",
        mobileNumber
      );

      sessionStorage.setItem(
        "otpType",
        "login"
      );

      // ========================================
      // SUCCESS
      // ========================================

      showAlert(
        "OTP has been sent to your phone.",
        "success",
        "OTP Sent"
      );

      // ========================================
      // GO TO OTP PAGE
      // ========================================

      router.push("/otp");

    } catch (error: any) {
      console.error(
        "LOGIN ERROR:",
        error?.response?.data ||
          error
      );

      showAlert(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.",
        "error",
        "Login Failed"
      );

    } finally {
      setLoading(false);
    }
  };


  const handlePasswordLogin = async () => {
  if (!username.trim() || !password) {
    showAlert("Please enter username and password.", "warning");
    return;
  }

  try {
    setLoading(true);

    let deviceId = localStorage.getItem("deviceId");

    if (!deviceId) {
      const deviceResponse = await registerDevice();
      const newDeviceId = deviceResponse?.device?.deviceId;

      if (!deviceResponse?.status || !newDeviceId) {
        showAlert("Unable to register device.", "error");
        return;
      }

      deviceId = newDeviceId;
      localStorage.setItem("deviceId", newDeviceId);
    }

    const { data } = await api.post("/auth/login", {
      username: username.trim(),
      password,
      deviceId,
      platform: "business",
      deviceType: "web",
    });

    if (!data?.success || !data?.token) {
      showAlert(data?.message || "Login failed.", "error");
      return;
    }

    localStorage.setItem("token", data.token);

    if (data.userId) {
      localStorage.setItem("userId", data.userId);
    }

    router.replace("/products");
  } catch (error: any) {
    showAlert(
      error?.response?.data?.message || "Invalid username or password.",
      "error"
    );
  } finally {
    setLoading(false);
  }
};

  return (
  <>
    <div className="h-full w-full">

      {/* ================= LOGIN CONTENT ================= */}

<div >
  <div className="w-full max-w-[480px] rounded-[24px] border border-[#E5D9FF] bg-white px-5 py-5 shadow-[0_12px_40px_rgba(109,40,217,0.08)] sm:px-8 sm:py-6">
    <div className="flex flex-col">

        <div className="text-center">
  <h1 className="text-[38px] font-bold leading-tight tracking-[-0.03em] text-[#101828]">
    Welcome{" "}
    <span className="text-[#6D28D9]">
      Back
    </span>
  </h1>

  <p className="mt-2 text-[17px] text-[#98A2B3]">
  {loginMode === "otp"
    ? "Login with your phone number to continue"
    : "Login with your username and password"}
</p>
</div>

        
        {/* ================= LOGIN FORM ================= */}

        {loginMode === "otp" ? (
          <>
            {/* PHONE NUMBER */}
            <div className="mt-7">
              <label className="mb-2 block text-sm font-semibold text-[#344054]">
                Phone Number
              </label>

              <div className="flex h-[54px] overflow-hidden rounded-[13px] border border-[#E5E0F5] bg-white transition focus-within:border-[#7135E8] focus-within:ring-4 focus-within:ring-purple-100">
                <div className="flex w-[48px] shrink-0 items-center justify-center">
                  <Smartphone className="h-5 w-5 text-[#6D28D9]" />
                </div>

                <div className="flex shrink-0 items-center border-r border-[#E5E0F5] px-3 text-sm font-semibold text-[#101828]">
                  +91
                </div>

                <input
                  type="tel"
                  inputMode="numeric"
                  value={mobile}
                  onChange={handleMobileChange}
                  maxLength={10}
                  placeholder="Enter your phone number"
                  className="min-w-0 flex-1 bg-transparent px-3 text-[15px] text-slate-900 outline-none placeholder:text-[#A3AECA]"
                />
              </div>
            </div>

            {/* OTP LOGIN BUTTON */}
          
<button
  type="button"
  onClick={handleLogin}
  disabled={loading}
  className="mt-5 flex w-full items-center justify-center gap-3 rounded-[15px] bg-gradient-to-r from-[#7135E8] to-[#6931D8] px-4 py-3 text-[16px] font-bold text-white shadow-[0_8px_20px_rgba(109,40,217,0.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Sending OTP..." : "Login"}
  {!loading && <ArrowRight className="h-5 w-5" />}
</button>


            {/* SWITCH TO PASSWORD LOGIN */}
            <button
              type="button"
              onClick={() => setLoginMode("password")}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] border border-[#B98BFF] bg-white px-4 py-3 text-sm font-semibold text-[#6D28D9] transition hover:bg-[#FAF7FF]"
            >
              <LockKeyhole className="h-4 w-4" />
              Login with Username &amp; Password
            </button>
          </>
        ) : (
          <>
            {/* USERNAME */}
            <div className="mt-7">
              <label className="mb-2 block text-sm font-semibold text-[#344054]">
                Username
              </label>

              <div className="flex h-[54px] items-center rounded-[13px] border border-[#E5E0F5] bg-white transition focus-within:border-[#7135E8] focus-within:ring-4 focus-within:ring-purple-100">
                <div className="flex w-[48px] shrink-0 items-center justify-center">
                  <UserRound className="h-5 w-5 text-[#6D28D9]" />
                </div>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  className="h-full min-w-0 flex-1 rounded-[13px] bg-transparent pr-3 text-[15px] text-slate-900 outline-none placeholder:text-[#A3AECA]"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-[#344054]">
                Password
              </label>

              <div className="flex h-[54px] items-center rounded-[13px] border border-[#E5E0F5] bg-white transition focus-within:border-[#7135E8] focus-within:ring-4 focus-within:ring-purple-100">
                <div className="flex w-[48px] shrink-0 items-center justify-center">
                  <LockKeyhole className="h-5 w-5 text-[#6D28D9]" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-[#A3AECA]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="flex h-full items-center px-4 text-[#6D28D9]"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* PASSWORD LOGIN BUTTON */}
            
<button
  type="button"
  onClick={handlePasswordLogin}
  disabled={loading || !username.trim() || !password}
  className="mt-5 flex w-full items-center justify-center gap-3 rounded-[15px] bg-gradient-to-r from-[#7135E8] to-[#6931D8] px-4 py-3 text-[16px] font-bold text-white shadow-[0_8px_20px_rgba(109,40,217,0.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Signing in..." : "Confirm Login"}
  {!loading && <ArrowRight className="h-5 w-5" />}
</button>


            {/* BACK TO OTP */}
            <button
              type="button"
              onClick={() => setLoginMode("otp")}
              className="mt-4 w-full text-sm font-semibold text-[#6D28D9] hover:text-[#5520B5]"
            >
              ← Back to OTP Login
            </button>
          </>
        )}



        {/* ================= DIVIDER ================= */}

        <div className="my-6 flex items-center gap-4">

          <div className="h-px flex-1 bg-\[#DDD5F8]" />

          <span className="whitespace-nowrap text-\[14px] text-\[#7182A6]">
            Don't have an account?
          </span>

          <div className="h-px flex-1 bg-\[#DDD5F8]" />

        </div>


        {/* ================= SIGN UP ================= */}

        <button
  type="button"
  onClick={() => router.push("/register")}
  className="
    mx-auto
    flex
    h-[40px]
    w-[220px]
    items-center
    justify-center
    gap-4
    rounded-[14px]
    border-2
    border-[#B98BFF]
    bg-white
    text-[14px]
    font-bold
    text-[#6D28D9]
    transition
    hover:bg-[#FAF7FF]
  "
>
  <UserPlus className="h-4 w-4" />

  Sign Up

  <ArrowRight className="h-4 w-4" />
</button>


        {/* ================= TERMS ================= */}

        <p className="mt-6 text-center text-\[10px] text-\[#8B99B8]">

          By continuing, you agree to our{" "}

          <Link
            href="/privacy-policy"
            className="font-semibold text-[#6D28D9]"
          >
            Privacy Policy
          </Link>

          {" "}and{" "}

          <Link
            href="/terms-of-use"
            className="font-semibold text-[#6D28D9]"
          >
            Terms of Use
          </Link>

          .

        </p>

      </div>
      </div>
      </div>


      {/* ================= ALERT ================= */}

      <AlertBox
        open={alert.open}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={() =>
          setAlert((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />


{comingSoonModal && (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
    onClick={() => setComingSoonModal(false)}
  >
    <div
      className="w-full max-w-[380px] rounded-[24px] bg-white p-7 text-center shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-\[#F3E8FF]">
        <span className="text-3xl">🚀</span>
      </div>

      <h2 className="text-\[24px] font-bold text-\[#101828]">
        Thover Coming Soon
      </h2>

      <p className="mt-2 text-\[14px] leading-6 text-\[#7182A6]">
        We are working hard to bring this feature to you.
        Stay tuned!
      </p>

      <button
        type="button"
        onClick={() => setComingSoonModal(false)}
        className="mt-6 h-[46px] w-full rounded-[13px] bg-gradient-to-r from-[#7135E8] to-[#6931D8] text-[15px] font-bold text-white"
      >
        Okay
      </button>
    </div>
  </div>
)}
    </div>
  </>
);
}