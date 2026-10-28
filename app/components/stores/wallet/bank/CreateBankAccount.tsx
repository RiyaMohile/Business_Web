"use client";

import { useState } from "react";
import {
  ArrowLeft,
  UserRound,
  CreditCard,
  KeyRound,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Check,
  ChevronDown,
} from "lucide-react";
import AlertBox from "@/app/components/common/AlertBox";
import { useAlert } from "@/app/hooks/useAlert";

import { createBankAccount } from "../../../../services/bankAccountApi";

interface CreateBankAccountProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBankAccount({
  onClose,
  onSuccess,
}: CreateBankAccountProps) {
  const {
  alert,
  showAlert,
  closeAlert,
} = useAlert();
  const [loading, setLoading] = useState(false);

  const [bankName, setBankName] = useState("");
  const [customBankName, setCustomBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!bankName.trim()) {
  showAlert(
    "Bank name is required.",
    "warning"
  );
  return;
}

if (bankName === "Other" && !customBankName.trim()) {
  showAlert(
    "Please enter your bank name.",
    "warning"
  );
  return;
}

  if (!accountHolderName.trim()) {
    showAlert(
      "Account holder name is required.",
      "warning"
    );
    return;
  }

  if (!accountNumber.trim()) {
    showAlert(
      "Account number is required.",
      "warning"
    );
    return;
  }

  if (!ifscCode.trim()) {
    showAlert(
      "IFSC code is required.",
      "warning"
    );
    return;
  }

  // UPI is optional, so no validation here

  try {
    setLoading(true);

    const finalBankName =
  bankName === "Other"
    ? customBankName.trim()
    : bankName.trim();

const payload = {
  bankName: finalBankName,
  accountHolderName: accountHolderName.trim(),
  accountNumber: accountNumber.trim(),
  ifscCode: ifscCode.trim().toUpperCase(),
  upiId: upiId.trim(),
};

    console.log(
      "CREATE BANK ACCOUNT PAYLOAD:",
      payload
    );

    const response =
      await createBankAccount(payload);

    console.log(
      "CREATE BANK ACCOUNT RESPONSE:",
      response
    );

    if (response?.success) {
      showAlert(
        "Bank account created successfully.",
        "success"
      );

      onSuccess();
    } else {
      showAlert(
        response?.message ||
          "Unable to create bank account.",
        "error"
      );
    }

  } catch (error: any) {
    console.error(
      "CREATE BANK ACCOUNT ERROR:",
      error
    );

    showAlert(
      error?.response?.data?.message ||
        "Unable to create bank account.",
      "error"
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 overflow-y-auto z-50 bg-white">

      {/* ================= MAIN MOBILE PAGE ================= */}

      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white">

        {/* ================= HEADER ================= */}

        <header className="flex items-start px-4 pt-3">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              text-slate-800
              transition
              hover:bg-slate-100
              disabled:opacity-50
            "
          >
            <ArrowLeft
              size={21}
              strokeWidth={1.8}
            />
          </button>

          <div className="flex-1 text-center pr-9">

            <h1 className="text-[20px] font-bold text-slate-900">
              Add Bank Account
            </h1>

            <p className="mt-0.5 text-[10px] font-medium text-slate-500">
              Step 2 of 3
            </p>

          </div>

        </header>


        {/* ================= STEP PROGRESS ================= */}

        <div className="flex w-full items-start px-4 mt-3">

  {/* STEP 1 */}
  <div className="flex shrink-0 flex-col items-center">
    <div
      className="
        flex h-8 w-8 items-center justify-center
        rounded-full
        bg-indigo-600
        text-sm font-medium text-white
      "
    >
      1
    </div>

    <span className="mt-2 whitespace-nowrap text-xs font-medium text-indigo-600">
      Wallet
    </span>
  </div>


  {/* LINE 1 — STEP 1 → STEP 2 */}
  <div className="mt-4 h-[2px] flex-1 bg-indigo-600" />


  {/* STEP 2 */}
  <div className="flex shrink-0 flex-col items-center">
    <div
      className="
        flex h-8 w-8 items-center justify-center
        rounded-full
        border border-slate-300
        bg-white
        text-sm font-medium text-slate-700
      "
    >
      2
    </div>

    <span className="mt-2 whitespace-nowrap text-xs font-medium text-slate-600">
      Bank Account
    </span>
  </div>


  {/* LINE 2 — STEP 2 → STEP 3 */}
  <div className="mt-4 h-[2px] flex-1 bg-slate-200" />


  {/* STEP 3 */}
  <div className="flex shrink-0 flex-col items-center">
    <div
      className="
        flex h-8 w-8 items-center justify-center
        rounded-full
        border border-slate-300
        bg-white
        text-sm font-medium text-slate-700
      "
    >
      3
    </div>

    <span className="mt-2 whitespace-nowrap text-xs font-medium text-slate-600">
      Done
    </span>
  </div>

</div>


        {/* ================= SCROLLABLE CONTENT ================= */}

        <div className="flex-1 overflow-y-auto px-4 pb-8">

          {/* ================= BANK IMAGE ================= */}

          <div className="mt-7 flex justify-center">

            <img
              src="/images/bank-create.png"
              alt="Bank Account"
              className="
                
                w-50
                object-contain
              "
            />

          </div>


          {/* ================= TITLE ================= */}

          <div className="mt-3 text-center">

            <h2 className="text-[18px] font-medium text-slate-900">
              Add Your Bank Account
            </h2>

            <p className="mx-auto mt-1 max-w-[260px] text-[12px] leading-4 font-medium text-slate-500">
              Add your bank details to receive
              <br />
              withdrawals securely.
            </p>

          </div>


          {/* ================= FORM CARD ================= */}

          <div
            className="
              mt-5
              rounded-2xl
              border
              border-slate-100
              bg-white
              p-4
              shadow-[0_2px_12px_rgba(15,23,42,0.06)]
            "
          >

            <form
              onSubmit={handleSubmit}
              className="space-y-3"
            >


              <h2 className="text-[16px] font-bold text-slate-900">
              Bank Account Details
            </h2>

            <p className="mt-1 text-[12px] text-slate-500">
              Link your bank account to withdraw coins.
            </p>

              {/* ================= BANK NAME ================= */}

              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-slate-600">
                  Bank Name
                </label>

                <div className="relative">

                  <select
                    value={bankName}
                    onChange={(e) => {
  const value = e.target.value;

  setBankName(value);

  if (value !== "Other") {
    setCustomBankName("");
  }
}}
                    disabled={loading}
                    className="
                      h-[42px]
                      w-full
                      appearance-none
                      rounded-xl
                      border
                      border-indigo-100
                      bg-white
                      px-4
                      pr-10
                      text-[13px]
                      text-slate-700
                      outline-none
                      transition
                      focus:border-indigo-400
                      focus:ring-2
                      focus:ring-indigo-100
                      disabled:bg-slate-50
                    "
                  >
                    <option value="">
                      Select Bank
                    </option>

                    <option value="HDFC Bank">
                      HDFC Bank
                    </option>

                    <option value="State Bank of India">
                      State Bank of India
                    </option>

                    <option value="ICICI Bank">
                      ICICI Bank
                    </option>

                    <option value="Axis Bank">
                      Axis Bank
                    </option>

                    <option value="Kotak Mahindra Bank">
                      Kotak Mahindra Bank
                    </option>

                    <option value="Punjab National Bank">
                      Punjab National Bank
                    </option>
                    <option value="Other">
  Other
</option>
                  </select>

                  {bankName === "Other" && (
  <input
    type="text"
    value={customBankName}
    onChange={(e) => setCustomBankName(e.target.value)}
    placeholder="Enter your bank name"
    disabled={loading}
    className="
      mt-3
      h-[42px]
      w-full
      rounded-xl
      border
      border-indigo-100
      bg-white
      px-4
      text-[13px]
      text-slate-700
      outline-none
      transition
      placeholder:text-slate-400
      focus:border-indigo-400
      focus:ring-2
      focus:ring-indigo-100
      disabled:bg-slate-50
    "
  />
)}

                  <ChevronDown
                    size={18}
                    className="
                      pointer-events-none
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-600
                    "
                  />

                </div>
              </div>

              {/* ================= ACCOUNT HOLDER ================= */}

              <div>

                <label className="mb-1.5 block text-[11px] font-medium text-slate-700">
                  Account Holder Name
                </label>

                <div className="relative">

                  <UserRound
                    size={14}
                    strokeWidth={1.8}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-indigo-400
                    "
                  />

                  <input
                    type="text"
                    value={accountHolderName}
                    onChange={(e) =>
                      setAccountHolderName(
                        e.target.value
                      )
                    }
                    placeholder="Enter full name"
                    disabled={loading}
                    className="
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-indigo-100
                      bg-white
                      pl-9
                      pr-3
                      text-[12px]
                      font-medium
                      text-slate-700
                      outline-none
                      placeholder:text-slate-400
                      focus:border-indigo-400
                      focus:ring-2
                      focus:ring-indigo-50
                    "
                  />

                </div>

              </div>


              {/* ================= ACCOUNT NUMBER ================= */}

              <div>

                <label className="mb-1.5 block text-[11px] font-medium text-slate-700">
                  Account Number
                </label>

                <div className="relative">

                  <CreditCard
                    size={14}
                    strokeWidth={1.8}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-indigo-400
                    "
                  />

                  <input
                    type="text"
                    inputMode="numeric"
                    value={accountNumber}
                    onChange={(e) =>
                      setAccountNumber(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="Enter account number"
                    disabled={loading}
                    className="
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-indigo-100
                      bg-white
                      pl-9
                      pr-3
                      text-[12px]
                      font-medium
                      text-slate-700
                      outline-none
                      placeholder:text-slate-400
                      focus:border-indigo-400
                      focus:ring-2
                      focus:ring-indigo-50
                    "
                  />

                </div>

              </div>


              {/* ================= IFSC ================= */}

              <div>

                <label className="mb-1.5 block text-[11px] font-medium text-slate-700">
                  IFSC Code
                </label>

                <div className="relative">

                  <KeyRound
                    size={14}
                    strokeWidth={1.8}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-indigo-400
                    "
                  />

                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) =>
                      setIfscCode(
                        e.target.value.toUpperCase()
                      )
                    }
                    placeholder="Enter IFSC code"
                    maxLength={11}
                    disabled={loading}
                    className="
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-indigo-100
                      bg-white
                      pl-9
                      pr-3
                      text-[11px]
                      font-medium
                      uppercase
                      text-slate-700
                      outline-none
                      placeholder:normal-case
                      placeholder:text-slate-400
                      focus:border-indigo-400
                      focus:ring-2
                      focus:ring-indigo-50
                    "
                  />

                </div>

              </div>


              {/* ================= UPI ================= */}

              <div>

                <label className="mb-1.5 block text-[11px] font-medium text-slate-700">
                  UPI ID{" "}
                  <span className="font-medium text-slate-400">
                    (Optional)
                  </span>
                </label>

                <div className="relative">

                  <Smartphone
                    size={14}
                    strokeWidth={1.8}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-indigo-400
                    "
                  />

                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) =>
                      setUpiId(e.target.value)
                    }
                    placeholder="Enter UPI ID"
                    disabled={loading}
                    className="
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-indigo-100
                      bg-white
                      pl-9
                      pr-3
                      text-[11px]
                      font-medium
                      text-slate-700
                      outline-none
                      placeholder:text-slate-400
                      focus:border-indigo-400
                      focus:ring-2
                      focus:ring-indigo-50
                    "
                  />

                </div>

                <p className="mt-1.5 text-[9px] font-medium text-slate-400">
                  UPI ID is optional. You can add it later.
                </p>

              </div>


              {/* ================= SECURITY ================= */}

              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-2.5
                  rounded-lg
                  border
                  border-emerald-100
                  bg-emerald-50
                  px-3
                  py-2.5
                "
              >

                <div
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                  "
                >
                  <ShieldCheck
                    size={15}
                    strokeWidth={1.8}
                    className="text-emerald-500"
                  />
                </div>

                <div>

                  <p className="text-[10px] font-medium text-emerald-700">
                    Your bank details are 100% secure and encrypted.
                  </p>

                  

                </div>

              </div>


              {/* ================= BUTTON ================= */}

              <button
                type="submit"
                disabled={loading}
                className="
                  mt-4
                  flex
                  h-10
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-indigo-600
                  text-[12px]
                  font-medium
                  text-white
                  shadow-md
                  shadow-indigo-100
                  transition
                  hover:bg-indigo-700
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:bg-indigo-300
                "
              >

                <span>
                  {loading
                    ? "Saving..."
                    : "Verify & Continue"}
                </span>

                {!loading && (
                  <ArrowRight
                    size={15}
                    strokeWidth={1.8}
                  />
                )}

              </button>

            </form>

          </div>

        </div>

      </main>
<AlertBox
  open={alert.open}
  title={alert.title}
  message={alert.message}
  type={alert.type}
  onClose={closeAlert}
/>
    </div>
  );
}