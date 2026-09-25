"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  Smartphone,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

import {
  verifyLoginOTP,
  resendOTPRequest,
} from "../../services/authApi";

export default function OtpForm() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [requestId, setRequestId] = useState("");
  const [mobile, setMobile] = useState("");

  const [mounted, setMounted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [timer, setTimer] =
    useState(60);

  const [deviceId, setDeviceId] =
    useState("");

  const inputRefs = useRef<
    Array<HTMLInputElement | null>
  >([]);


  /* ==========================================
     GET SESSION / DEVICE DATA
  ========================================== */

  useEffect(() => {

    setRequestId(
      sessionStorage.getItem("requestId") || ""
    );

    setMobile(
      sessionStorage.getItem("mobile") || ""
    );

    setDeviceId(
      localStorage.getItem("deviceId") || ""
    );

    setMounted(true);

  }, []);


  /* ==========================================
     TIMER
  ========================================== */

  useEffect(() => {

    if (!mounted) return;

    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () =>
      clearInterval(interval);

  }, [timer, mounted]);


  /* ==========================================
     OTP CHANGE
  ========================================== */

  const handleOtpChange = (
  index: number,
  value: string
) => {
  const digit = value
    .replace(/\D/g, "")
    .slice(-1);

  const otpArray = otp.padEnd(4, "").split("");

  // Digit enter kiya
  if (digit) {
    otpArray[index] = digit;

    const newOtp = otpArray.join("");

    setOtp(newOtp);

    // Next box par focus
    if (
      index < 3 &&
      inputRefs.current[index + 1]
    ) {
      inputRefs.current[index + 1]?.focus();
    }

    return;
  }

  // Digit delete kiya
  otpArray[index] = "";

  setOtp(otpArray.join(""));
};


  /* ==========================================
     BACKSPACE
  ========================================== */

  const handleKeyDown = (
  index: number,
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  if (e.key !== "Backspace") return;

  const otpArray = otp.padEnd(4, "").split("");

  // Current box mein digit hai
  if (otpArray[index]) {
    otpArray[index] = "";

    setOtp(otpArray.join(""));

    return;
  }

  // Current box already empty hai
  if (index > 0) {
    otpArray[index - 1] = "";

    setOtp(otpArray.join(""));

    inputRefs.current[index - 1]?.focus();
  }
};


  /* ==========================================
     PASTE OTP
  ========================================== */

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {

    e.preventDefault();

    const pastedOtp =
      e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 4);

    if (!pastedOtp) return;

    setOtp(pastedOtp);

    const focusIndex = Math.min(
      pastedOtp.length - 1,
      3
    );

    inputRefs.current[focusIndex]?.focus();
  };


  /* ==========================================
     VERIFY OTP
  ========================================== */

  const verifyOTP = async () => {

    if (otp.length !== 4) {
      alert("Enter a valid 4 digit OTP");
      return;
    }

    if (!requestId) {
      alert(
        "OTP session expired. Please request OTP again."
      );

      router.push("/login");
      return;
    }

    if (!deviceId) {
      alert(
        "Device ID not found. Please login again."
      );

      router.push("/login");
      return;
    }

    try {

      setLoading(true);


      /* API SERVICE */

      const response =
        await verifyLoginOTP({
          requestId,
          otp,
          deviceId,
        });


      console.log(
        "LOGIN OTP RESPONSE:",
        response
      );


      /* RESPONSE */

      const {
        token,
        userId,
      } = response;


      if (!token) {
        alert(
          "Login token not received."
        );
        return;
      }

      if (!userId) {
        alert(
          "User ID not received."
        );
        return;
      }


      /* SAVE LOGIN DATA */

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "userId",
        userId
      );

      localStorage.setItem(
        "deviceId",
        deviceId
      );


      /* REMOVE TEMP DATA */

      sessionStorage.removeItem(
        "requestId"
      );

      sessionStorage.removeItem(
        "mobile"
      );

      sessionStorage.removeItem(
        "otpType"
      );


      /* CUSTOMER WEBSITE */

      router.push("/products");

    } catch (err: any) {
  console.error(
    "OTP verification error:",
    err?.response?.data || err
  );

  // Clear wrong OTP
  setOtp("");

  // First OTP box par focus
  setTimeout(() => {
    inputRefs.current[0]?.focus();
  }, 0);

  alert(
    err?.response?.data?.message ||
      "Invalid OTP. Please try again."
  );
} finally {

      setLoading(false);
    }
  };


  /* ==========================================
     RESEND OTP
  ========================================== */

  const handleResendOTP = async () => {
  if (!mobile) {
    alert("Mobile number not found.");
    return;
  }

  if (timer > 0) {
    return;
  }

  try {
    setLoading(true);

    await resendOTPRequest(mobile);

    setTimer(60);
    setOtp("");

    inputRefs.current[0]?.focus();

    alert("OTP sent again.");
  } catch (err: any) {
    console.error("Resend OTP error:", err);

    alert(
      err?.response?.data?.message ||
        "Unable to resend OTP."
    );
  } finally {
    setLoading(false);
  }
};


  const formattedMobile =
    mobile.length > 2
      ? `+${mobile.slice(0, 2)} ${mobile.slice(2)}`
      : mobile;


  if (!mounted) {
    return null;
  }

   // ==========================================
  // UI
  // ==========================================

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
            sm:min-h-0
            sm:max-w-[390px]
            sm:rounded-[28px]
            sm:border
            sm:border-slate-200
            sm:shadow-xl
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

            {/* Back Button */}

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="
                absolute
                left-5
                top-5
                z-20
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[#6D28D9]/5
                text-[#6D28D9]
                transition
                hover:bg-[#6D28D9]/10
              "
              aria-label="Back to login"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>


            {/* =================================
                ICON
            ================================= */}

            <div className="relative z-10 flex items-center justify-center">

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
              OTP CONTENT
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
                Verify Your Number
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                OTP sent to{" "}
                <span className="font-semibold text-slate-700">
                  {formattedMobile}
                </span>
              </p>

            </div>


            {/* OTP INPUTS */}

            <div
              className="
                mt-8
                flex
                w-full
                justify-center
                gap-3
              "
            >

              {[0, 1, 2, 3].map((index) => (

                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] =
                      element;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={
                    index === 0
                      ? "one-time-code"
                      : "off"
                  }
                  maxLength={1}
                  value={otp[index] || ""}
                  onChange={(e) =>
                    handleOtpChange(
                      index,
                      e.target.value
                    )
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(index, e)
                  }
                  onPaste={handlePaste}
                  className="
                    h-14
                    w-14
                    shrink-0
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    text-center
                    text-xl
                    font-semibold
                    text-slate-900
                    shadow-sm
                    outline-none
                    transition
                    focus:border-[#6D28D9]
                    focus:ring-4
                    focus:ring-[#6D28D9]/10
                  "
                  aria-label={`OTP digit ${
                    index + 1
                  }`}
                />

              ))}

            </div>


            {/* VERIFY BUTTON */}

            <Button
              onClick={verifyOTP}
              disabled={
                loading ||
                otp.length !== 4
              }
              className="
                mt-6
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

              {loading
                ? "Verifying..."
                : "Verify OTP"}

            </Button>


            {/* RESEND */}

            <div className="mt-7 text-center">

              {timer > 0 ? (

                <p className="text-sm text-slate-500">

                  Resend OTP{" "}

                  <span
                    className="
                      font-semibold
                      text-[#6D28D9]
                    "
                  >
                    (
                    00:
                    {String(timer).padStart(
                      2,
                      "0"
                    )}
                    )
                  </span>

                </p>

              ) : (

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="
                    text-sm
                    font-semibold
                    text-[#6D28D9]
                    transition
                    hover:text-[#5B21B6]
                    disabled:opacity-50
                  "
                >
                  Resend OTP
                </button>

              )}

            </div>


            {/* SECURITY */}

            <div className="mt-auto pt-8">

              <div className="flex items-center justify-center gap-2">

                <p
                  className="
                    text-center
                    text-[11px]
                    leading-5
                    text-slate-400
                  "
                >
                  Your OTP is secure and only used
                  to verify your mobile number.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}