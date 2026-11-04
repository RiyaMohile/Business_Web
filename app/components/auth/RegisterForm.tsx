"use client";

import { useState } from "react";
import {
  LockKeyhole,
  Zap,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { sendRegisterOTP } from "../../services/authApi";
import { registerDevice } from "../../services/deviceApi";

export default function RegisterForm() {
  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

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
     SEND OTP
  ========================================== */

  const sendOTP = async () => {
    if (mobile.length !== 10) {
      alert(
        "Please enter a valid 10 digit mobile number."
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
         REGISTER DEVICE
      ======================================== */

      if (!deviceId) {
        const deviceResponse =
          await registerDevice();

        console.log(
          "DEVICE RESPONSE:",
          deviceResponse
        );

        if (
          !deviceResponse?.status ||
          !deviceResponse?.device?.deviceId
        ) {
          alert(
            deviceResponse?.response ||
              "Unable to register device."
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
      }


      /* ========================================
         MOBILE NUMBER
      ======================================== */

      const mobileNumber = `91${mobile}`;


      /* ========================================
         SEND REGISTER OTP
      ======================================== */

      const data =
        await sendRegisterOTP(
          mobileNumber
        );

      console.log(
        "REGISTER OTP RESPONSE:",
        data
      );


      /* ========================================
         CHECK RESPONSE
      ======================================== */

      if (!data?.success) {
        alert(
          data?.message ||
            "Unable to send OTP."
        );

        return;
      }

      if (!data?.requestId) {
        alert(
          "OTP request ID was not received."
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
        "register"
      );


      /* ========================================
         GO TO OTP
      ======================================== */

      router.push("/otp");

    } catch (error: any) {
      console.error(
        "REGISTER OTP ERROR:",
        error?.response?.data ||
          error
      );

      alert(
        error?.response?.data?.message ||
          "Unable to send OTP."
      );

    } finally {
      setLoading(false);
    }
  };


  /* ==========================================
     UI
  ========================================== */

  return (
    <main className="min-h-[100dvh] w-full bg-white">

      <div className="flex min-h-[100dvh] w-full items-center justify-center">

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

            {/* Purple Glow */}

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


            {/* =================================
                ICON
            ================================= */}

            <div
              className="
                relative
                z-10
                flex
                items-center
                justify-center
              "
            >

              <img
                src="/icon.png"
                alt="Thover"
                className="
                  h-[80px]
                  w-[80px]
                  rounded-2xl
                  object-contain
                "
              />

            </div>

          </div>


          {/* =====================================
              CONTENT
          ===================================== */}

          <div
            className="
              flex
              flex-1
              flex-col
              px-6
              pb-8
              pt-1
              sm:px-10
            "
          >

            {/* =================================
                TITLE
            ================================= */}

            <div className="text-center">

              <h2
                className="
                  text-[26px]
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >
                Create Account 🎉
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Register using your mobile number
              </p>

            </div>


            {/* =================================
                MOBILE NUMBER
            ================================= */}

            <div className="mt-7">

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
                  onChange={
                    handleMobileChange
                  }
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
                  <Smartphone
                    className="
                      mr-2
                      h-5
                      w-5
                    "
                  />

                  Send OTP
                </>
              )}

            </Button>


            {/* =================================
                LOGIN
            ================================= */}

            <div
              className="
                mt-8
                text-center
              "
            >

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                Already have an account?
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/login")
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
                Login
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}