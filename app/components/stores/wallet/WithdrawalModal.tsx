"use client";

import { useState } from "react";
import {
  X,
  Coins,
  IndianRupee,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { createWithdrawal } from "../../../services/withdrawalApi";

interface Props {
  onClose: () => void;
}

export default function WithdrawalModal({ onClose }: Props) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const withdrawalAmount = Number(amount) || 0;
const coinsToDeduct = withdrawalAmount * 100;

  const handleWithdraw = async () => {
  if (!amount) {
    alert("Please enter withdrawal amount");
    return;
  }

  const withdrawalAmount = Number(amount);

  if (!Number.isFinite(withdrawalAmount) || withdrawalAmount <= 0) {
    alert("Withdrawal amount must be greater than 0");
    return;
  }

  try {
    setLoading(true);

    const response = await createWithdrawal({
  amount: withdrawalAmount,
  totalCoins: coinsToDeduct,
});

    console.log("WITHDRAWAL RESPONSE:", response);

    alert(
      response?.message ||
        "Withdrawal request created successfully"
    );

    onClose();
  } catch (error: any) {
    console.error("WITHDRAWAL ERROR:", error);

    alert(
      error.response?.data?.message ||
        "Failed to create withdrawal request"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

      {/* MODAL */}
      <div
        className="
          w-full
          max-w-md
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >

        {/* ================= HEADER ================= */}
        <div className="border-b border-slate-100 px-5 py-4">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-indigo-50
                "
              >
                <Coins
                  size={20}
                  className="text-indigo-600"
                />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Withdraw Coins
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Withdraw your coins to your bank account
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                text-slate-400
                transition
                hover:bg-slate-100
                hover:text-slate-700
                disabled:opacity-50
              "
            >
              <X size={19} />
            </button>

          </div>

        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-5">

          {/* CONVERSION INFO */}
          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-indigo-100
              bg-indigo-50/70
              p-3
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
              "
            >
              <Coins
                size={17}
                className="text-indigo-600"
              />
            </div>

            <div className="flex-1">

              <p className="text-xs font-semibold text-slate-800">
                100 Coins = ₹1
              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Your coins are converted automatically.
              </p>

            </div>

          </div>

          {/* ================= AMOUNT ================= */}
          <div className="mt-4">

            <label className="text-sm font-medium text-slate-800">
              Withdrawal Amount
            </label>

            <div
              className="
                mt-2
                flex
                h-12
                items-center
                gap-3
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                transition
                focus-within:border-indigo-500
                focus-within:ring-2
                focus-within:ring-indigo-100
              "
            >

              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-emerald-50
                "
              >
                <IndianRupee
                  size={16}
                  className="text-emerald-600"
                />
              </div>

              <input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                disabled={loading}
                className="
                  w-full
                  bg-transparent
                  text-sm
                  font-medium
                  text-slate-800
                  outline-none
                  placeholder:text-slate-400
                  disabled:opacity-50
                "
              />

              <span className="text-xs font-medium text-slate-400">
                INR
              </span>

            </div>

            <p className="mt-1.5 text-[10px] text-slate-400">
              Enter the amount you want to receive.
            </p>

          </div>

          {withdrawalAmount > 0 && (
  <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50 p-3">
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500">
        Withdrawal Amount
      </span>

      <span className="text-sm font-semibold text-gray-800">
        ₹{withdrawalAmount.toLocaleString("en-IN")}
      </span>
    </div>

    <div className="my-2 border-t border-indigo-100" />

    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500">
        Coins to be deducted
      </span>

      <span className="text-sm font-semibold text-indigo-600">
        {coinsToDeduct.toLocaleString("en-IN")} Coins
      </span>
    </div>

    <p className="mt-2 text-[11px] text-gray-500">
      100 Coins = ₹1
    </p>
  </div>
)}

          {/* ================= SECURITY INFO ================= */}
          <div
            className="
              mt-5
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-emerald-100
              bg-emerald-50
              p-3
            "
          >

            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <div>

              <p className="text-xs font-semibold text-emerald-800">
                Secure Withdrawal
              </p>

              <p className="mt-1 text-[10px] leading-4 text-emerald-700">
                Your withdrawal request will be securely
                processed through your linked bank account.
              </p>

            </div>

          </div>

          {/* ================= BUTTONS ================= */}
          <div className="mt-6 flex gap-3">

            {/* CANCEL */}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                h-12
                flex-1
                rounded-xl
                border
                border-slate-200
                bg-white
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-50
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            {/* WITHDRAW */}
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={loading}
              className="
                flex
                h-12
                flex-1
                items-center
                justify-center
                gap-2
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
                disabled:bg-indigo-300
              "
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  Withdraw
                  <ArrowRight size={17} />
                </>
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}