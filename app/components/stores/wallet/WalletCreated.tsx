"use client";

import {
  ArrowLeft,
  Check,
  Lightbulb,
  Landmark,
  Clock3,
  WalletCards,
} from "lucide-react";

interface WalletCreatedProps {
  onClose: () => void;
  onViewWallet: () => void;
}

export default function WalletCreated({
  onClose,
  onViewWallet,
}: WalletCreatedProps) {
  return (
    <main className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <div className="min-h-screen px-4 py-5">
        <div className="mx-auto w-full max-w-md">

          {/* ================= HEADER ================= */}

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
              <ArrowLeft size={21} />
            </button>

            <div className="text-center">
              <h1 className="text-xl font-bold text-slate-900">
                Wallet Created
              </h1>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Step 3 of 3
              </p>
            </div>
          </div>

          {/* ================= STEPPER ================= */}

          <div className="mt-4 flex w-full items-start px-1">

            {/* STEP 1 */}

            <div className="flex shrink-0 flex-col items-center">
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-indigo-600
                  text-white
                "
              >
                <Check size={16} strokeWidth={2.5} />
              </div>

              <span className="mt-2 whitespace-nowrap text-xs font-medium text-indigo-600">
                Wallet
              </span>
            </div>

            {/* LINE 1 */}

            <div className="mt-4 h-[2px] flex-1 bg-indigo-600" />

            {/* STEP 2 */}

            <div className="flex shrink-0 flex-col items-center">
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-indigo-600
                  text-white
                "
              >
                <Check size={16} strokeWidth={2.5} />
              </div>

              <span className="mt-2 whitespace-nowrap text-xs font-medium text-indigo-600">
                Bank Account
              </span>
            </div>

            {/* LINE 2 */}

            <div className="mt-4 h-[2px] flex-1 bg-indigo-600" />

            {/* STEP 3 */}

            <div className="flex shrink-0 flex-col items-center">
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-indigo-600
                  text-sm
                  font-medium
                  text-white
                "
              >
                3
              </div>

              <span className="mt-2 whitespace-nowrap text-xs font-medium text-indigo-600">
                Done
              </span>
            </div>

          </div>

          {/* ================= SUCCESS IMAGE ================= */}

          <div className="mt-10 flex justify-center">
            <img
              src="/images/wallet-complete.png"
              alt="Wallet Created"
              className="h-40 w-50 object-contain"
            />
          </div>

          {/* ================= CONGRATULATIONS ================= */}

          <div className="mt-5 text-center">

            <h2 className="text-2xl font-bold text-slate-900">
              Congratulations!
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Your wallet has been created successfully.
            </p>

          </div>

          {/* ================= WHAT'S NEXT ================= */}

          <div
            className="
              mt-5
              flex
              gap-3
              rounded-xl
              border
              border-blue-100
              bg-blue-50
              p-4
            "
          >

            <div className="shrink-0">
              <Lightbulb
                size={22}
                className="text-indigo-500"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                What's Next?
              </p>

              <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                You can now add money, view transactions
                and withdraw your earnings.
              </p>
            </div>

          </div>

          {/* ================= BUTTONS ================= */}

          <div className="mt-6 space-y-3 pb-6">

            <button
              type="button"
              onClick={onViewWallet}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-indigo-600
                bg-white
                text-sm
                font-medium
                text-indigo-600
                transition
                hover:bg-indigo-50
                active:scale-[0.98]
              "
            >
              View Wallet
            </button>

          </div>

        </div>
      </div>
    </main>
  );
}