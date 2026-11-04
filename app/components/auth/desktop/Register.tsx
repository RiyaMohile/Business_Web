
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

  const { alert, showAlert, closeAlert } = useAlert();

  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  // MOBILE NUMBER CHANGE
  const handleMobileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setMobile(value);
    }
  };

  // SEND REGISTER OTP
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

    // DEVICE REGISTRATION
    let deviceId: string | null =
      localStorage.getItem("deviceId");

    if (!deviceId) {
      const deviceResponse = await registerDevice();

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

      const newDeviceId: string =
        deviceResponse.device.deviceId;

      localStorage.setItem("deviceId", newDeviceId);

      deviceId = newDeviceId;
    }

    console.log("DEVICE ID:", deviceId);

    // MOBILE NUMBER
    const mobileNumber = `91${mobile}`;

    // SEND REGISTER OTP
    const data = await sendRegisterOTP(mobileNumber);

    console.log("REGISTER OTP RESPONSE:", data);

    if (!data?.success) {
      showAlert(
        data?.message || "Unable to send OTP.",
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

    // SAVE OTP DETAILS
    sessionStorage.setItem("requestId", data.requestId);
    sessionStorage.setItem("mobile", mobileNumber);
    sessionStorage.setItem("otpType", "register");

    // REDIRECT
    router.push("/otp");

  } catch (error: any) {
    console.error(
      "REGISTER OTP ERROR:",
      error?.response?.data || error
    );

    showAlert(
      error?.response?.data?.message ||
        "Unable to send OTP. Please try again.",
      "error"
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <div className="w-full rounded-[28px] border border-[#EEE8FC] bg-white p-7 shadow-[0_15px_50px_rgba(109,40,217,0.08)] sm:p-9">

        {/* HEADER */}
        <div className="mb-8">

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3EEFF]">
            <UserPlus className="h-7 w-7 text-[#6D28D9]" />
          </div>

          <h1 className="text-[34px] font-bold leading-tight tracking-[-0.03em] text-[#101828]">
            Create{" "}
            <span className="text-[#6D28D9]">
              Account
            </span>{" "}
            🎉
          </h1>

          <p className="mt-2 text-[15px] leading-6 text-[#7182A6]">
            Join Thover and start exploring products
            from your nearby local stores.
          </p>

        </div>

        {/* MOBILE NUMBER */}
        <div>

          <label className="mb-2 block text-sm font-semibold text-[#344054]">
            Mobile Number
          </label>

          <div className="flex h-[58px] w-full overflow-hidden rounded-[14px] border border-[#DDD5F8] bg-white transition focus-within:border-[#7C3AED] focus-within:ring-4 focus-within:ring-[#7C3AED]/10">

            <div className="flex w-[52px] shrink-0 items-center justify-center">
              <Smartphone className="h-5 w-5 text-[#6D28D9]" />
            </div>

            <div className="flex w-[70px] shrink-0 items-center justify-center border-r border-[#E5E0F5] text-sm font-semibold text-[#101828]">
              +91
            </div>

            <Input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={mobile}
              onChange={handleMobileChange}
              placeholder="Enter your phone number"
              autoComplete="tel-national"
              className="h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-[15px] shadow-none focus-visible:ring-0"
            />

          </div>

          <p className="mt-2 text-xs text-slate-400">
            Enter your 10-digit mobile number.
          </p>

        </div>

        {/* SEND OTP BUTTON */}
        <Button
          onClick={sendOTP}
          disabled={loading || mobile.length !== 10}
          className="mt-6 flex h-[56px] w-full items-center justify-center gap-3 rounded-[15px] bg-gradient-to-r from-[#7135E8] to-[#6931D8] text-[16px] font-bold text-white shadow-[0_8px_20px_rgba(109,40,217,0.20)] transition hover:-translate-y-0.5 hover:from-[#6D28D9] hover:to-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-50"
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

        {/* SECURITY */}
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#FAF8FF] px-3 py-3 text-xs text-[#7182A6]">

          <ShieldCheck className="h-4 w-4 shrink-0 text-[#7C3AED]" />

          <span>
            Your phone number is securely protected.
          </span>

        </div>

        {/* LOGIN LINK */}
        <div className="mt-7 border-t border-slate-100 pt-6 text-center">

          <p className="text-sm text-slate-500">
            Already have an account?
          </p>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-2 text-base font-bold text-[#6D28D9] transition hover:text-[#5B21B6]"
          >
            Login to your account →
          </button>

        </div>

      </div>

      {/* ALERT */}
      <AlertBox
        open={alert.open}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
      />
    </>
  );
}
