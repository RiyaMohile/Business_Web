"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { Button } from "../../ui/button";

import {
  verifyLoginOTP,
  resendOTPRequest,
} from "../../../services/authApi";

export default function Otp() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [requestId, setRequestId] = useState("");
  const [mobile, setMobile] = useState("");

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [deviceId, setDeviceId] = useState("");

  const inputRefs = useRef<
    Array<HTMLInputElement | null>
  >([]);


  // ==========================================
  // GET SESSION / DEVICE DATA
  // ==========================================

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


  // ==========================================
  // TIMER
  // ==========================================

  useEffect(() => {
    if (!mounted) return;

    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, mounted]);


  // ==========================================
  // OTP CHANGE
  // ==========================================

  const handleOtpChange = (
  index: number,
  value: string
) => {
  const digit = value.replace(/\D/g, "").slice(-1);

  const otpArray = otp.padEnd(4, "").split("");

  // Digit enter kiya
  if (digit) {
    otpArray[index] = digit;

    const newOtp = otpArray.join("");
    setOtp(newOtp);

    // Next input par focus
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


  // ==========================================
  // BACKSPACE
  // ==========================================

  const handleKeyDown = (
  index: number,
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  if (e.key !== "Backspace") return;

  const otpArray = otp.padEnd(4, "").split("");

  // Current input mein digit hai
  if (otpArray[index]) {
    otpArray[index] = "";

    setOtp(otpArray.join(""));

    return;
  }

  // Current input already empty hai
  if (index > 0) {
    otpArray[index - 1] = "";

    setOtp(otpArray.join(""));

    inputRefs.current[index - 1]?.focus();
  }
};


  // ==========================================
  // PASTE OTP
  // ==========================================

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pastedOtp = e.clipboardData
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


  // ==========================================
  // VERIFY OTP
  // ==========================================

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

      const response = await verifyLoginOTP({
        requestId,
        otp,
        deviceId,
      });

      console.log(
        "LOGIN OTP RESPONSE:",
        response
      );

      const {
        token,
        userId,
      } = response;

      if (!token) {
        alert("Login token not received.");
        return;
      }

      if (!userId) {
        alert("User ID not received.");
        return;
      }

      // ========================================
      // SAVE LOGIN DATA
      // ========================================

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


      // ========================================
      // REMOVE TEMP DATA
      // ========================================

      sessionStorage.removeItem(
        "requestId"
      );

      sessionStorage.removeItem(
        "mobile"
      );

      sessionStorage.removeItem(
        "otpType"
      );


      // ========================================
      // PRODUCTS
      // ========================================

      router.push("/products");

    } catch (err: any) {
  console.error(
    "OTP verification error:",
    err?.response?.data || err
  );

  // Clear wrong OTP
  setOtp("");

  // Focus first OTP box
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


  // ==========================================
  // RESEND OTP
  // ==========================================

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
      console.error(
        "Resend OTP error:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Unable to resend OTP."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // FORMATTED MOBILE
  // ==========================================

  const formattedMobile =
    mobile.length > 2
      ? `+${mobile.slice(0, 2)} ${mobile.slice(2)}`
      : mobile;


  if (!mounted) {
    return null;
  }


  // ==========================================
  // DESKTOP UI
  // ==========================================

  return (
    <div className="h-full w-full">

      <div className="flex h-full flex-col">

        {/* ====================================
            BACK BUTTON
        ==================================== */}

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="
            mb-2
            flex
            h-8
            w-8
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
          <ArrowLeft className="h-4 w-4" />
        </button>


        {/* ====================================
            TITLE
        ==================================== */}

        <div className="text-center">

          <h1 className="text-[32px] font-bold tracking-[-0.03em] text-[#101828]">
            Verify{" "}
            <span className="text-[#6D28D9]">
              Your Number
            </span>
          </h1>

          <p className="mt-1 text-[15px] text-[#7182A6]">
            OTP sent to{" "}
            <span className="font-semibold text-[#344054]">
              {formattedMobile}
            </span>
          </p>

        </div>


        {/* ====================================
            OTP INPUTS
        ==================================== */}

        <div className="mt-7 flex justify-center gap-4">

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
                h-[58px]
                w-[58px]
                rounded-[14px]
                border
                border-[#DDD5F8]
                bg-white
                text-center
                text-xl
                font-semibold
                text-slate-900
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


        {/* ====================================
            VERIFY BUTTON
        ==================================== */}

        <Button
          onClick={verifyOTP}
          disabled={
            loading ||
            otp.length !== 4
          }
          className="
            mt-6
            h-[52px]
            w-full
            rounded-[15px]
            bg-gradient-to-r
            from-[#7135E8]
            to-[#6931D8]
            text-[17px]
            font-bold
            text-white
            shadow-[0_8px_20px_rgba(109,40,217,0.25)]
            transition
            hover:-translate-y-0.5
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading
            ? "Verifying..."
            : "Verify OTP"}
        </Button>


        {/* ====================================
            RESEND
        ==================================== */}

        <div className="mt-6 text-center">

          {timer > 0 ? (
            <p className="text-sm text-[#7182A6]">

              Resend OTP{" "}

              <span className="font-semibold text-[#6D28D9]">
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
                hover:text-[#5B21B6]
                disabled:opacity-50
              "
            >
              Resend OTP
            </button>
          )}

        </div>


        {/* ====================================
            SECURITY
        ==================================== */}

        <div className="mt-auto pt-5">

          <p className="text-center text-[11px] leading-5 text-slate-400">
            Your OTP is secure and only used
            to verify your mobile number.
          </p>

        </div>

      </div>

    </div>
  );
}