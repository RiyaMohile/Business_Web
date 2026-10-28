"use client";

import { useState } from "react";
import { ArrowLeft, User, CheckCircle, LockKeyhole, Clock } from "lucide-react";
import { createWallet } from "../../../services/walletApi";

interface CreateWalletProps {
  onClose: () => void;
  onContinue: () => void;
}

export default function CreateWallet({
  onClose,
  onContinue,
}: CreateWalletProps) {
  const [accountHolderName, setAccountHolderName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
  if (!accountHolderName.trim()) {
    alert("Please enter account holder name.");
    return;
  }

  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    // Create wallet
    const response = await createWallet(
      accountHolderName.trim()
    );

    console.log("CREATE WALLET RESPONSE:", response);

    if (response?.success) {
      alert("Wallet created successfully!");

      // Wallet successfully create hone ke baad
      // Bank Account page par jao
      onContinue();

    } else {
      alert(
        response?.message ||
          "Unable to create wallet."
      );
    }

  } catch (error: any) {
    console.error(
      "CREATE WALLET ERROR:",
      error.response?.data || error
    );

    alert(
      error.response?.data?.message ||
        "Unable to create wallet."
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <main className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <div className="min-h-screen px-4 py-5">

        <div className="mx-auto w-full max-w-md">

          {/* HEADER */}
          <div className="relative flex items-center justify-center">

            <button
              type="button"
              onClick={onClose}
              className="
                absolute
                left-0
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-slate-800
                hover:bg-slate-100
              "
            >
              <ArrowLeft size={22} />
            </button>

            <div className="text-center">
              <h1 className="text-xl font-bold text-slate-900">
                Create Wallet
              </h1>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Step 1 of 3
              </p>
            </div>

          </div>

          {/* STEPPER */}
          {/* ================= STEPPER ================= */}
<div className="mt-3 flex w-full items-start px-4">

  {/* STEP 1 */}
  <div className="relative flex w-8 shrink-0 flex-col items-center">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
      1
    </div>

    <span className="mt-2 whitespace-nowrap text-xs font-medium text-indigo-600">
      Wallet
    </span>
  </div>


  {/* LINE 1 */}
  <div className="mt-4 h-[2px] flex-1 bg-indigo-600" />


  {/* STEP 2 */}
  <div className="relative flex w-8 shrink-0 flex-col items-center">
    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-medium text-slate-700">
      2
    </div>

    <span className="mt-2 whitespace-nowrap text-xs font-medium text-slate-600">
      Bank Account
    </span>
  </div>


  {/* LINE 2 */}
  <div className="mt-4 h-[2px] flex-1 bg-slate-200" />


  {/* STEP 3 */}
  <div className="relative flex w-8 shrink-0 flex-col items-center">
    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-medium text-slate-700">
      3
    </div>

    <span className="mt-2 whitespace-nowrap text-xs font-medium text-slate-600">
      Done
    </span>
  </div>

</div>

          {/* WALLET IMAGE */}
          <div className="mt-8 flex justify-center">
            <img
              src="/images/wallet-create.png"
              alt="Wallet"
              className=" w-50 object-contain"
            />
          </div>

          {/* TITLE */}
          <div className="text-center">

            <h2 className="text-xl font-medium text-slate-900">
              Create Your Wallet
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Start by creating a secure wallet for your account.
            </p>

          </div>

          {/* FORM CARD */}
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-slate-100
              bg-white
              p-4
              shadow-sm
            "
          >

            {/* ACCOUNT HOLDER NAME */}
            <div>

              <label className="text-sm font-medium text-slate-800">
                Account Holder Name
              </label>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Enter your full name as per your identity proof.
              </p>

              <div
                className="
                  mt-3
                  flex
                  h-12
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-indigo-100
                  px-4
                "
              >
                <User
                  size={19}
                  className="shrink-0 text-indigo-500"
                />

                <input
                  type="text"
                  value={accountHolderName}
                  onChange={(e) =>
                    setAccountHolderName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  className="
                    w-full
                    bg-transparent
                    text-sm
                    font-medium
                    text-slate-800
                    outline-none
                    placeholder:text-slate-400
                  "
                />
              </div>

            </div>

            {/* WHY NAME */}
            <div className="mt-5">

              <h3 className="text-sm font-medium text-slate-800">
                Why do we need your name?
              </h3>

              <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                Your name helps us secure your wallet and
                ensure safe transactions.
              </p>

            </div>

            <div className="my-4 h-px bg-slate-100" />

            {/* INSTANT ACTIVATION */}
            <div className="flex items-center gap-4 py-2">

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-emerald-50
                "
              >
                <CheckCircle
                  size={20}
                  className="text-emerald-500"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800">
                  Instant Activation
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Your wallet will be activated instantly.
                </p>
              </div>

            </div>

            <div className="my-2 h-px bg-slate-100" />

            {/* SAFE */}
            <div className="flex items-center gap-4 py-2">

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-indigo-50
                "
              >
                <LockKeyhole
                  size={19}
                  className="text-indigo-500"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800">
                  Safe & Secure
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  We use top security to protect your wallet.
                </p>
              </div>

            </div>

            <div className="my-2 h-px bg-slate-100" />

            {/* WITHDRAW */}
            <div className="flex items-center gap-4 py-2">

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-orange-50
                "
              >
                <Clock
                  size={19}
                  className="text-orange-500"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800">
                  Withdraw Anytime
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Withdraw your earnings whenever you want.
                </p>
              </div>

            </div>

            {/* CONTINUE BUTTON */}
            <button
  type="button"
  onClick={handleContinue}
  disabled={loading}
  className="
    mt-6
    flex
    h-12
    w-full
    items-center
    justify-center
    rounded-xl
    bg-indigo-600
    text-sm
    font-medium
    text-white
    shadow-sm
    transition
    hover:bg-indigo-700
    active:scale-[0.98]
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
>
  {loading ? (
    "Creating Wallet..."
  ) : (
    <>
      Continue
      <span className="ml-2 text-lg">→</span>
    </>
  )}
</button>

          </div>

          {/* EXTRA BOTTOM SPACE FOR SCROLL */}
          <div className="h-8" />

        </div>
      </div>
    </main>
  );
}