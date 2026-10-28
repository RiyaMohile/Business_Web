"use client";

import { useState } from "react";
import api from "../../services/businessApi";

interface Verification {
  _id: string;

  businessName: string;

  status: "pending" | "approved" | "rejected";
}

interface Props {
  open: boolean;
  verification: Verification | null;

  onClose: () => void;

  onRefresh: () => void;
}

export default function ReviewModal({
  open,
  verification,
  onClose,
  onRefresh,
}: Props) {
  const [reason, setReason] = useState("");

  if (!open || !verification) return null;

  const approveVerification = async () => {
    try {
      await api.put(
        `/verification/review/${verification._id}`,
        {
          status: "approved",
        }
      );

      alert("Verification Approved");

      onRefresh();
      onClose();

    } catch (err) {
      console.log(err);
      alert("Unable to approve verification.");
    }
  };

  const rejectVerification = async () => {
    if (!reason.trim()) {
      alert("Please enter rejection reason.");
      return;
    }

    try {
      await api.put(
        `/verification/review/${verification._id}`,
        {
          status: "rejected",
          rejectionReason: reason,
        }
      );

      alert("Verification Rejected");

      setReason("");

      onRefresh();

      onClose();

    } catch (err) {
      console.log(err);
      alert("Unable to reject verification.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-[520px] p-8">

        <h2 className="text-2xl font-bold">
          Review Verification
        </h2>

        <p className="text-gray-500 mt-2">
          Business :
          <span className="font-semibold ml-2">
            {verification.businessName}
          </span>
        </p>

        <textarea
          placeholder="Rejection reason (required only if rejecting)..."
          value={reason}
          onChange={(e) =>
            setReason(e.target.value)
          }
          className="w-full border rounded-xl p-4 mt-6 h-32 resize-none outline-none"
        />

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={() => {
              setReason("");
              onClose();
            }}
            className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={approveVerification}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            Approve
          </button>

          <button
            onClick={rejectVerification}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            Reject
          </button>

        </div>

      </div>

    </div>
  );
}