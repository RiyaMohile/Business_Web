"use client";

import { useState } from "react";
import { updateBankAccount } from "../../../../services/bankAccountApi";

interface BankAccount {
  _id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  isPrimary?: boolean;
}

interface Props {
  account: BankAccount;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditBankAccount({
  account,
  onClose,
  onUpdated,
}: Props) {
  const [bankName, setBankName] = useState(
    account.bankName || ""
  );

  const [accountHolderName, setAccountHolderName] =
    useState(account.accountHolderName || "");

  const [accountNumber, setAccountNumber] = useState(
    account.accountNumber || ""
  );

  const [ifscCode, setIfscCode] = useState(
    account.ifscCode || ""
  );

  const [upiId, setUpiId] = useState(
    account.upiId || ""
  );

  const [isPrimary, setIsPrimary] = useState(
    account.isPrimary || false
  );

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!bankName.trim()) {
      alert("Bank name is required");
      return;
    }

    if (!accountHolderName.trim()) {
      alert("Account holder name is required");
      return;
    }

    if (!accountNumber.trim()) {
      alert("Account number is required");
      return;
    }

    if (!ifscCode.trim()) {
      alert("IFSC code is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        bankName: bankName.trim(),
        accountHolderName: accountHolderName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim(),
        upiId: upiId.trim(),
        isPrimary,
      };

      console.log(
        "UPDATE BANK ACCOUNT PAYLOAD:",
        payload
      );

      const response = await updateBankAccount(
        account._id,
        payload
      );

      console.log(
        "UPDATE BANK ACCOUNT RESPONSE:",
        response
      );

      if (response?.success) {
        alert("Bank account updated successfully!");

        onUpdated();
        onClose();
      } else {
        alert(
          response?.message ||
            "Unable to update bank account."
        );
      }
    } catch (error: any) {
      console.error(
        "UPDATE BANK ACCOUNT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update bank account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/50 pt-[92px] md:pt-20">

    <div
  className="
    w-[calc(100%-32px)]
    max-w-xl
    rounded-2xl
    bg-white
    shadow-xl
    flex
    flex-col
    overflow-hidden
    max-h-[calc(100dvh-125px)]
    md:w-full
    md:max-h-[calc(100dvh-115px)]
    md:rounded-b-2xl
  "
>

        {/* HEADER */}

        <div className="flex justify-between items-center p-6 border-b shrink-0">

          <div>
            <h2 className="text-2xl font-bold">
              Edit Bank Account
            </h2>

            <p className="text-gray-500 mt-1">
              Update your bank account details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-900"
          >
            ×
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-4 overflow-y-auto md:p-6 md:space-y-5"
        >

          {/* BANK NAME */}

          <div>
            <label className="block font-medium mb-2">
              Bank Name
            </label>

            <input
              type="text"
              value={bankName}
              onChange={(e) =>
                setBankName(e.target.value)
              }
              placeholder="Enter bank name"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          {/* ACCOUNT HOLDER */}

          <div>
            <label className="block font-medium mb-2">
              Account Holder Name
            </label>

            <input
              type="text"
              value={accountHolderName}
              onChange={(e) =>
                setAccountHolderName(e.target.value)
              }
              placeholder="Enter account holder name"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          {/* ACCOUNT NUMBER */}

          <div>
            <label className="block font-medium mb-2">
              Account Number
            </label>

            <input
              type="text"
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(e.target.value)
              }
              placeholder="Enter account number"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          {/* IFSC */}

          <div>
            <label className="block font-medium mb-2">
              IFSC Code
            </label>

            <input
              type="text"
              value={ifscCode}
              onChange={(e) =>
                setIfscCode(e.target.value.toUpperCase())
              }
              placeholder="e.g. HDFC0001234"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 uppercase outline-none focus:border-blue-500"
            />
          </div>

          {/* UPI */}

          <div>
            <label className="block font-medium mb-2">
              UPI ID
            </label>

            <input
              type="text"
              value={upiId}
              onChange={(e) =>
                setUpiId(e.target.value)
              }
              placeholder="e.g. riya@hdfcbank"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          {/* PRIMARY */}

          <label className="flex items-center gap-3 cursor-pointer">

            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) =>
                setIsPrimary(e.target.checked)
              }
              className="w-5 h-5"
            />

            <span className="font-medium">
              Make this primary bank account
            </span>

          </label>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 pt-4 border-t">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-7 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300"
            >
              {loading
                ? "Updating..."
                : "Update Account"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}