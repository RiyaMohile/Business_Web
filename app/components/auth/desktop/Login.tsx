"use client";

import { useEffect, useState } from "react";
import {
  LockKeyhole,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import AlertBox from "../../common/AlertBox";
import { useAlert } from "../../../hooks/useAlert";

import {
  registerDevice,
} from "../../../services/deviceApi";

export default function LoginForm() {
  const {
    alert,
    showAlert,
    closeAlert,
  } = useAlert();

  const router = useRouter();

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

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
     USERNAME CHANGE
  ========================================== */

  const handleUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUsername(e.target.value);
  };

  /* ==========================================
     PASSWORD CHANGE
  ========================================== */

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(e.target.value);
  };

  /* ==========================================
     LOGIN
  ========================================== */

  const handleLogin = async () => {
    if (!username.trim()) {
      showAlert(
        "Please enter your username.",
        "warning"
      );
      return;
    }

    if (!password) {
      showAlert(
        "Please enter your password.",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      /* ========================================
         GET DEVICE ID
      ======================================== */

      let deviceId =
        localStorage.getItem("deviceId");

      /* ========================================
         REGISTER DEVICE IF NOT EXISTS
      ======================================== */

      if (!deviceId) {
  const deviceResponse =
    await registerDevice();

  const newDeviceId =
    deviceResponse?.device?.deviceId;

  if (
    !deviceResponse?.status ||
    !newDeviceId
  ) {
    showAlert(
      "Unable to register device.",
      "error"
    );
    return;
  }

  deviceId = newDeviceId;

  localStorage.setItem(
    "deviceId",
    newDeviceId
  );

  console.log(
    "DEVICE ID SAVED:",
    newDeviceId
  );
}

      /* ========================================
         LOGIN API
      ======================================== */

      const response = await axios.post(
        "https://api.thover.in/v1/api/auth/login",
        {
          username: username.trim(),
          password,

          // Current device ID
          deviceId,

          // Application platform
          platform: "customer",

          // Actual device type
          deviceType: "web",

          deviceName:
            typeof navigator !== "undefined"
              ? navigator.userAgent
              : "Web Browser",

          appVersion:
            process.env.NEXT_PUBLIC_APP_VERSION ||
            "1.0.0",
        }
      );

      console.log(
        "LOGIN RESPONSE:",
        response.data
      );

      /* ========================================
         CHECK LOGIN RESPONSE
      ======================================== */

      if (!response.data?.success) {
        showAlert(
          response.data?.message ||
            "Login failed.",
          "error"
        );

        return;
      }

      /* ========================================
         GET TOKEN
      ======================================== */

      const token =
        response.data?.token;

      const userId =
        response.data?.userId;

      if (!token) {
        showAlert(
          "Login token was not received.",
          "error"
        );

        return;
      }

      /* ========================================
         SAVE TOKEN
      ======================================== */

      localStorage.setItem(
        "token",
        token
      );

      /* ========================================
         SAVE USER ID
      ======================================== */

      if (userId) {
        localStorage.setItem(
          "userId",
          userId
        );
      }

      /* ========================================
         SAVE USER DATA IF RETURNED
      ======================================== */

      if (response.data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );
      }

      /* ========================================
         SUCCESS
      ======================================== */

      showAlert(
        "Login successful.",
        "success"
      );

      /* ========================================
         REDIRECT
      ======================================== */

      router.replace("/products");

    } catch (error: any) {
      console.error(
        "LOGIN ERROR:",
        error?.response?.data ||
          error?.message ||
          error
      );

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
      <main className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-[#f7f4ff] via-white to-[#eee8ff]">
        <div className="text-sm font-medium text-[#6D28D9]">
          Loading...
        </div>
      </main>
    );
  }

  /* ==========================================
     LOGIN UI
  ========================================== */

  return (
    <main className="min-h-[100dvh] w-full ">

      <div className="flex min-h-[100dvh] w-full items-center justify-center">

        <div
          className="
            flex
            min-h-[100dvh]
            w-full
            flex-col
            overflow-hidden
            
          "
        >

          {/* =====================================
              HEADER
          ===================================== */}

          <div
            className="
              relative
              flex
              shrink-0
              flex-col
              items-center
              justify-center
              overflow-hidden
              mt-10
            "
          >

    

          </div>


          {/* =====================================
              LOGIN CONTENT
          ===================================== */}

          <div
            className="
              flex
              flex-1
              flex-col
              px-6
              pb-8
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
                Welcome 
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Login with your username and password
              </p>

            </div>


            {/* =================================
                USERNAME
            ================================= */}

            <div className="mt-8">

              <Input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter Username"
                autoComplete="username"
                disabled={loading}
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-base
                  shadow-none
                  outline-none
                  focus-visible:border-[#6D28D9]
                  focus-visible:ring-4
                  focus-visible:ring-[#6D28D9]/10
                "
              />

            </div>


            {/* =================================
                PASSWORD
            ================================= */}

            <div className="mt-4">

              <Input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter Password"
                autoComplete="current-password"
                disabled={loading}
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-base
                  shadow-none
                  outline-none
                  focus-visible:border-[#6D28D9]
                  focus-visible:ring-4
                  focus-visible:ring-[#6D28D9]/10
                "
              />

            </div>


            {/* =================================
                LOGIN BUTTON
            ================================= */}

            <Button
              onClick={handleLogin}
              disabled={
                loading ||
                !username.trim() ||
                !password
              }
              className="
                mt-5
                h-14
                w-full
                rounded-xl
                bg-gradient-to-r
                from-[#7C3AED]
                to-[#5B21B6]
                text-base
                font-semibold
                text-white
                shadow-[0_10px_25px_rgba(109,40,217,0.18)]
                transition
                hover:from-[#6D28D9]
                hover:to-[#4C1D95]
                disabled:opacity-50
              "
            >

              {loading ? (
                "Logging in..."
              ) : (
                <>
                  <LockKeyhole className="mr-2 h-5 w-5" />
                  Login
                </>
              )}

            </Button>


            {/* =================================
                REGISTER
            ================================= */}

            {/* <div className="mt-9 text-center">

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

            </div> */}

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