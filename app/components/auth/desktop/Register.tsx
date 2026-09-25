"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Smartphone,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import AlertBox from "../../common/AlertBox";
import { useAlert } from "../../../hooks/useAlert";

import { sendRegisterOTP } from "../../../services/authApi";
import { registerDevice } from "../../../services/deviceApi";

export default function Register() {
  const router = useRouter();

  const {
    alert,
    showAlert,
    closeAlert,
  } = useAlert();

  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // MOBILE CHANGE
  // ==========================================

  const handleMobileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setMobile(value);
    }
  };

  // ==========================================
  // SEND REGISTER OTP
  // ==========================================

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

      // ========================================
      // DEVICE ID
      // ========================================

      let deviceId =
        localStorage.getItem("deviceId");

      // ========================================
      // REGISTER DEVICE IF NOT EXISTS
      // ========================================

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
          showAlert(
            deviceResponse?.response ||
              "Unable to register device.",
            "error"
          );

          return;
        }

        // Device ID is definitely a string
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
      }

      // ========================================
      // MOBILE NUMBER
      // ========================================

      const mobileNumber = `91${mobile}`;

      // ========================================
      // SEND REGISTER OTP
      // ========================================

      const data =
        await sendRegisterOTP(
          mobileNumber
        );

      console.log(
        "REGISTER OTP RESPONSE:",
        data
      );

      // ========================================
      // CHECK RESPONSE
      // ========================================

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

      // ========================================
      // SAVE OTP DATA
      // ========================================

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

      // ========================================
      // GO TO OTP
      // ========================================

      router.push("/otp");

    } catch (error: any) {
      console.error(
        "REGISTER OTP ERROR:",
        error?.response?.data ||
          error
      );

      showAlert(
        error?.response?.data?.message ||
          "Unable to send OTP.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
    <div className="h-full w-full">

      <div className="flex h-full flex-col">

        {/* ================= HEADING ================= */}

        <div>

          <h1 className="text-[38px] font-bold leading-tight tracking-[-0.03em] text-[#101828]">
            Create{" "}
            <span className="text-[#6D28D9]">
              Account
            </span>{" "}
            🎉
          </h1>

          <p className="mt-1 text-[17px] text-[#7182A6]">
            Register with your phone number to continue
          </p>

        </div>


        {/* ================= PHONE ================= */}

        <div className="mt-7">

          <label className="mb-2 block text-[14px] font-medium text-[#344054]">
            Mobile Number
          </label>

          <div className="flex h-[54px] overflow-hidden rounded-[13px] border border-[#DDD5F8] bg-white">

            <div className="flex w-[55px] shrink-0 items-center justify-center">
              <Smartphone className="h-6 w-6 text-[#6D28D9]" />
            </div>

            <div className="flex w-[75px] shrink-0 items-center justify-center border-r border-[#E5E0F5] text-[14px] font-semibold text-[#101828]">
              +91
            </div>

            <Input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={mobile}
              onChange={handleMobileChange}
              placeholder="Enter your phone number"
              className="
                min-w-0
                flex-1
                border-0
                bg-transparent
                px-4
                text-[15px]
                text-slate-900
                shadow-none
                outline-none
                focus-visible:ring-0
              "
            />

          </div>

        </div>


        {/* ================= SEND OTP ================= */}

        <Button
          onClick={sendOTP}
          disabled={
            loading ||
            mobile.length !== 10
          }
          className="
            mt-5
            flex
            h-[52px]
            w-full
            items-center
            justify-center
            gap-3
            rounded-[15px]
            bg-gradient-to-r
            from-[#7135E8]
            to-[#6931D8]
            text-[18px]
            font-bold
            text-white
            shadow-[0_8px_20px_rgba(109,40,217,0.25)]
            transition
            hover:-translate-y-0.5
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >

          {loading ? (
            "Sending OTP..."
          ) : (
            <>
              <Smartphone className="h-5 w-5" />

              Send OTP

              <ArrowRight className="h-5 w-5" />
            </>
          )}

        </Button>


        {/* ================= SECURITY ================= */}

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">

          <ShieldCheck className="h-4 w-4 text-[#7C3AED]" />

          <span>
            Your phone number is securely protected
          </span>

        </div>


        {/* ================= LOGIN ================= */}

        <div className="mt-8 border-t border-slate-100 pt-7 text-center">

          <p className="text-sm text-slate-500">
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


      {/* ================= ALERT ================= */}

      <AlertBox
        open={alert.open}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
      />

    </div>
  </>
);
}