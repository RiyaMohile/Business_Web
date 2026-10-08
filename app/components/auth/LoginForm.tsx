"use client";

import { useEffect, useState } from "react";
import {
  LockKeyhole,
  Zap,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AlertBox from "../common/AlertBox";
import { useAlert } from "../../hooks/useAlert";

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
          overflow-hidden
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
            h-[245px]
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
              Welcome Back 👋
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Login using OTP
            </p>

          </div>


          {/* =================================
              MOBILE NUMBER
          ================================= */}

          <div className="mt-8">

            <div
              className="
                flex
                h-14
                w-full
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                transition
                focus-within:border-[#6D28D9]
                focus-within:ring-4
                focus-within:ring-[#6D28D9]/10
              "
            >

              {/* COUNTRY CODE */}

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  border-r
                  border-slate-200
                  px-4
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                +91
              </div>


              {/* INPUT */}

              <Input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={mobile}
                onChange={handleMobileChange}
                placeholder="Enter Mobile Number"
                className="
                  h-full
                  min-w-0
                  flex-1
                  border-0
                  bg-transparent
                  px-4
                  text-base
                  shadow-none
                  outline-none
                  focus-visible:ring-0
                "
              />

            </div>

          </div>


          {/* =================================
              SEND OTP
          ================================= */}

          <Button
            onClick={sendOTP}
            disabled={
              loading ||
              mobile.length !== 10
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
              "Sending..."
            ) : (
              <>
                <Smartphone className="mr-2 h-5 w-5" />
                Send OTP
              </>
            )}

          </Button>


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