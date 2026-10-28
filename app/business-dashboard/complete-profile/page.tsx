"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, AtSign, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import api from "../../services/businessApi";

export default function CompleteProfilePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
const [usernameNumber] = useState(() =>
  Math.floor(10 + Math.random() * 90)
);

const [usernameManuallyChanged, setUsernameManuallyChanged] =
  useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  const type = sessionStorage.getItem("otpType");

  if (type !== "register") {
    router.replace("/business-dashboard");
  }
}, [router]);

const generateUsername = (name: string, number: number) => {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  if (!cleanName) return "";

  const namePart = cleanName.slice(0, 8);

  return `${namePart}@${number}`;
};


  const handleSubmit = async () => {
    setError("");

    // ==========================================
    // 1. Validation
    // ==========================================

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // 2. Check token
      // ==========================================

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      // ==========================================
      // 3. Complete Profile API
      // ==========================================

      const response = await api.put(
        "/user/complete-profile",
        {
          name: name.trim(),
          username: username.trim(),
        }
      );

      console.log(
        "COMPLETE PROFILE RESPONSE:",
        response.data
      );

      // ==========================================
      // 4. Success
      // ==========================================

      if (response.data.success) {
        // Save updated user locally
        if (response.data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
          );
        }

         sessionStorage.removeItem("otpType");
        // Go to business dashboard
        router.replace("/business-dashboard");
      }
    } catch (error: any) {
      console.error(
        "COMPLETE PROFILE ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to complete your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-slate-50">
      <div className="flex min-h-[100dvh] items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">

          {/* ==========================================
              HEADER
          ========================================== */}

          <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 px-6 pb-12 pt-10 text-center">

            <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-sm">
              <User
                className="h-8 w-8 text-white"
                strokeWidth={1.8}
              />
            </div>

            <h1 className="relative z-10 mt-5 text-2xl font-bold text-white">
              Complete Your Profile
            </h1>

            <p className="relative z-10 mt-2 text-sm text-blue-100">
              Just a few details before you continue
            </p>

            {/* Decorative circles */}

            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />

            <div className="absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-white/10" />
          </div>

          {/* ==========================================
              FORM
          ========================================== */}

          <div className="px-6 pb-8 pt-7">

            {/* ==========================================
                NAME
            ========================================== */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Your Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
  const value = e.target.value;

  setName(value);
  setError("");

  if (!usernameManuallyChanged) {
    setUsername(
      generateUsername(value, usernameNumber)
    );
  }
}}
                  placeholder="Enter your name"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    pl-11
                    pr-4
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />
              </div>
            </div>

            {/* ==========================================
                USERNAME
            ========================================== */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Username
              </label>

              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
  let value = e.target.value;

  if (value && !value.startsWith("@")) {
    value = `@${value}`;
  }

  setUsername(value);
  setUsernameManuallyChanged(true);
  setError("");
}}
                  placeholder="Choose a username"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    pl-11
                    pr-4
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                This username will be visible to other users.
              </p>
            </div>

            {/* ==========================================
                ERROR
            ========================================== */}

            {error && (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* ==========================================
                CONTINUE BUTTON
            ========================================== */}

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="
                mt-7
                h-12
                w-full
                rounded-xl
                bg-blue-600
                text-sm
                font-semibold
                shadow-sm
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              Complete your profile to continue to your
              business dashboard.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

