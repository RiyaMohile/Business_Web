"use client";

import { useState } from "react";
import api from "../../services/businessApi";

interface Props {
  withdrawalId: string;
  status: string;
  currentRemark?: string;

  onSuccess: () => void;
}

export default function CompleteWithdrawalCard({
  withdrawalId,
  status,
  currentRemark,
  onSuccess,
}: Props) {
  const [remark, setRemark] = useState(
    currentRemark || ""
  );

  const completeWithdrawal = async () => {
    try {
      await api.patch(
        `/withdrawal/admin/${withdrawalId}/complete`,
        {
          remark,
        }
      );

      alert("Withdrawal Completed");

      onSuccess();

    } catch (err) {
      console.log(err);
      alert("Unable to complete withdrawal.");
    }
  };

  if (status === "completed") {
    return (
      <div className="bg-white rounded-2xl shadow p-8 mt-8">

        <h2 className="text-2xl font-semibold mb-4">
          Admin Remark
        </h2>

        <p>{currentRemark || "-"}</p>

      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-8 mt-8">

      <h2 className="text-2xl font-semibold mb-4">
        Complete Withdrawal
      </h2>

      <textarea
        rows={4}
        value={remark}
        onChange={(e) =>
          setRemark(e.target.value)
        }
        placeholder="Enter remark (optional)"
        className="w-full border rounded-xl p-4"
      />

      <button
        onClick={completeWithdrawal}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
      >
        Complete Withdrawal
      </button>

    </div>
  );
}