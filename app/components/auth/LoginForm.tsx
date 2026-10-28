"use client";

import { useEffect, useState } from "react";
import {
  LockKeyhole,
  Zap,
  Smartphone,
  Eye,
  EyeOff,
  UserRound,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AlertBox from "../common/AlertBox";
import { useAlert } from "../../hooks/useAlert";
import api from "../../services/api";

import {
  sendLoginOTP,
} from "../../services/authApi";

import {
  registerDevice,
} from "../../services/deviceApi";

export default function LoginForm() {
  const {
    alert,
    showAlert,
    closeAlert,
  } = useAlert();

  const router = useRouter();

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [mobile, setMobile] =
    useState("");

    const [loginMode, setLoginMode] = useState<"otp" | "password">("otp");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] =
    useState(false);

  /* ==========================================
     CHECK EXISTING LOGIN
  ========================================== */

  useEffect(() => {
    const checkExistingLogin = () => {
      try {
        const token =
          localStorage.getItem("token");

        /*
         * Token already exists
         * means user is already logged in.
         */

        if (token) {
          router.replace("/products");
          return;
        }

        setCheckingAuth(false);
      } catch (error) {
        console.error(
          "AUTH CHECK ERROR:",
          error
        );

        setCheckingAuth(false);
      }
    };

    checkExistingLogin();
  }, [router]);


  /* ==========================================
     MOBILE CHANGE
  ========================================== */

  const handleMobileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      e.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setMobile(value);
    }
  };


  /* ==========================================
     SEND LOGIN OTP
  ========================================== */

  const sendOTP = async () => {
    if (mobile.length !== 10) {
      showAlert(
        "Please enter a valid 10 digit mobile number.",
        "warning"
      );

      return;
    }

    try {
      setLoading(true);

      /* ========================================
         DEVICE ID
      ======================================== */

      let deviceId =
        localStorage.getItem("deviceId");

      /* ========================================
         REGISTER DEVICE IF NOT EXISTS
      ======================================== */

      if (!deviceId) {
        try {
          const deviceResponse =
            await registerDevice();

          console.log(
            "DEVICE REGISTRATION RESPONSE:",
            deviceResponse
          );

          if (
            !deviceResponse?.status ||
            !deviceResponse?.device?.deviceId
          ) {
            showAlert(
              "Unable to register device.",
              "error"
            );

            return;
          }

          const newDeviceId =
            deviceResponse.device.deviceId;

          deviceId = newDeviceId;

          localStorage.setItem(
            "deviceId",
            newDeviceId
          );

          console.log(
            "DEVICE ID SAVED:",
            newDeviceId
          );
        } catch (error: any) {
          console.error(
            "DEVICE REGISTRATION ERROR:",
            error?.response?.data ||
              error?.message ||
              error
          );

          showAlert(
            "Unable to register device. Please try again.",
            "error"
          );

          return;
        }
      }

      /* ========================================
         SEND LOGIN OTP
      ======================================== */

      const mobileNumber =
        `91${mobile}`;

      const data =
        await sendLoginOTP(
          mobileNumber
        );

      console.log(
        "LOGIN OTP RESPONSE:",
        data
      );

      /* ========================================
         CHECK RESPONSE
      ======================================== */

      if (!data?.success) {
        showAlert(
          data?.message ||
            "Unable to send OTP.",
          "error"
        );

        return;
      }

      if (!data?.requestId) {
        showAlert(
          "OTP request ID was not received.",
          "error"
        );

        return;
      }

      /* ========================================
         SAVE OTP DATA
      ======================================== */

      sessionStorage.setItem(
        "requestId",
        data.requestId
      );

      sessionStorage.setItem(
        "mobile",
        mobileNumber
      );

      sessionStorage.setItem(
        "otpType",
        "login"
      );

      /* ========================================
         GO TO OTP
      ======================================== */

      router.push("/otp");

    } catch (error: any) {
      console.error(
        "LOGIN ERROR:",
        error?.response?.data ||
          error
      );

      showAlert(
        error?.response?.data?.message ||
          "Unable to continue.",
        "error"
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
      error?.response?.data?.message ||
        "Invalid username or password.",
      "error"
    );
  } finally {
    setLoading(false);
  }
};



  /* ==========================================
     AUTH CHECK SCREEN
  ========================================== */

  if (checkingAuth) {
    return (
      <main className="flex min-h-\[100dvh] items-center justify-center bg-gradient-to-br from-\[#f7f4ff] via-white to-\[#eee8ff]">
        <div className="text-sm font-medium text-\[#6D28D9]">
          Loading...
        </div>
      </main>
    );
  }


  return (
  <main className="min-h-\[100dvh] w-full bg-white">

    <div className="flex min-h-\[100dvh] w-full items-center justify-center">

      <div
        className="
  flex
  min-h-[100dvh]
  w-full
  flex-col
  bg-white
"
      >

        {/* =====================================
            HEADER
        ===================================== */}

        <div
          className="
            relative
            flex
            h-[140px] sm:h-[170px]
            shrink-0
            flex-col
            items-center
            justify-center
            overflow-hidden
            bg-white
          "
        >

          {/* Soft purple glow */}

          <div
            className="
              absolute
              -top-24
              left-1/2
              h-64
              w-64
              -translate-x-1/2
              rounded-full
              bg-[#7C3AED]/5
              blur-3xl
            "
          />

          {/* Small decorative circles */}

 

          {/* =================================
              ICON
          ================================= */}

          <div className="relative z-10 flex items-center justify-center">

            <img
              src="/icon.png"
              alt="Thover"
              className="
                h-[80px]
                w-[80px] rounded-2xl
                object-contain
              "
            />

          </div>


 

        </div>


        {/* =====================================
            LOGIN CONTENT
        ===================================== */}

        <div
          className="
            flex
            flex-1
            flex-col
            px-5
pb-4
sm:px-10
          "
        >

          {/* TITLE */}

          <div className="text-center">

            <h2
              className="
                text-[26px]
                font-bold
                tracking-tight
                text-slate-900
              "
            >
              Welcome Back 👋
            </h2>

            <p className="mt-1 text-sm text-slate-500">
  {loginMode === "otp"
    ? "Login using OTP"
    : "Login using username and password"}
</p>

          </div>


{loginMode === "otp" ? (
  <>
    {/* MOBILE NUMBER */}
    <div className="mt-8">
      <div className="flex h-14 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition focus-within:border-[#6D28D9] focus-within:ring-4 focus-within:ring-[#6D28D9]/10">
        <div className="flex shrink-0 items-center border-r border-slate-200 px-4 text-sm font-semibold text-slate-700">
          +91
        </div>

        <Input
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={mobile}
          onChange={handleMobileChange}
          placeholder="Enter Mobile Number"
          className="h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-base shadow-none outline-none focus-visible:ring-0"
        />
      </div>
    </div>

    {/* SEND OTP */}
    <Button
      onClick={sendOTP}
      disabled={loading || mobile.length !== 10}
      className="mt-5 flex h-auto w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] px-4 py-3 text-base font-semibold text-white shadow-[0_10px_25px_rgba(109,40,217,0.18)] transition hover:from-[#6D28D9] hover:to-[#4C1D95] disabled:opacity-50"
    >
      {loading ? (
        "Sending..."
      ) : (
        <>
          <Smartphone className="mr-2 h-5 w-5" />
          Send OTP
        </>
      )}
    </Button>

    {/* SWITCH TO PASSWORD LOGIN */}
    <button
      type="button"
      onClick={() => setLoginMode("password")}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#B98BFF] bg-white px-4 py-3 font-semibold text-[#6D28D9] transition hover:bg-[#FAF7FF]"
    >
      <LockKeyhole className="h-5 w-5" />
      Login with Username &amp; Password
    </button>
  </>
) : (
  <>
    {/* USERNAME */}
    <div className="mt-8">
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Username
      </label>

      <div className="flex h-14 items-center rounded-2xl border border-slate-200 focus-within:border-[#6D28D9] focus-within:ring-4 focus-within:ring-[#6D28D9]/10">
        <UserRound className="ml-4 h-5 w-5 shrink-0 text-[#6D28D9]" />

        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          autoComplete="username"
          className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
        />
      </div>
    </div>

    {/* PASSWORD */}
    <div className="mt-4">
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Password
      </label>

      <div className="flex h-14 items-center rounded-2xl border border-slate-200 focus-within:border-[#6D28D9] focus-within:ring-4 focus-within:ring-[#6D28D9]/10">
        <LockKeyhole className="ml-4 h-5 w-5 shrink-0 text-[#6D28D9]" />

        <Input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          autoComplete="current-password"
          className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="mr-3 shrink-0 text-[#6D28D9]"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>

    {/* CONFIRM LOGIN */}
    <Button
      onClick={handlePasswordLogin}
      disabled={loading || !username.trim() || !password}
      className="mt-5 flex h-auto w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] px-4 py-3 font-semibold text-white transition hover:from-[#6D28D9] hover:to-[#4C1D95] disabled:opacity-50"
    >
      {loading ? (
        "Signing in..."
      ) : (
        <>
          Confirm Login
          <ArrowRight className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>

    {/* BACK TO OTP */}
    <button
      type="button"
      onClick={() => setLoginMode("otp")}
      className="mt-4 w-full py-2 text-sm font-semibold text-[#6D28D9] hover:text-[#5B21B6]"
    >
      ← Back to OTP Login
    </button>
  </>
)}


          {/* =================================
              REGISTER
          ================================= */}

          <div className="mt-9 text-center">

            <p className="text-sm text-slate-500">
              Don't have an account?
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/register")
              }
              className="
                mt-1
                text-base
                font-semibold
                text-[#6D28D9]
                transition
                hover:text-[#5B21B6]
              "
            >
              Create Account
            </button>

          </div>


 

        </div>

      </div>

    </div>


    {/* =====================================
        ALERT
    ===================================== */}

    <AlertBox
      open={alert.open}
      title={alert.title}
      message={alert.message}
      type={alert.type}
      onClose={closeAlert}
    />

  </main>
);
}