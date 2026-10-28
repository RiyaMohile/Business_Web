"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import api from "../../services/businessApi";
import CompleteWithdrawalCard from "@/app/components/withdrawals/CompleteWithdrawalCard";
import WithdrawalDetailsCard from "@/app/components/withdrawals/WithdrawalDetailsCard";

interface Withdrawal {
  _id: string;

  totalCoins: number;
  amount: number;

  transactionId: string;

  status:
    | "pending"
    | "approved"
    | "processing"
    | "completed"
    | "rejected"
    | "failed";

  remark?: string;

  createdAt: string;

  completedAt?: string;

  userId: {
    _id: string;
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
  };

  bankAccountId: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  };

  walletId: {
    balance: number;
  };
}

function WithdrawalDetailsContent() {
  const searchParams = useSearchParams();
const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);

  const [withdrawal, setWithdrawal] =
    useState<Withdrawal | null>(null);

  const [remark, setRemark] = useState("");

  const fetchWithdrawal = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `https://api.thover.in/v1/api/withdrawal/admin/${id}`
      );

      setWithdrawal(data.withdrawal);

    } catch (err) {
      console.log(err);
      alert("Unable to fetch withdrawal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchWithdrawal();
    }
  }, [id]);

  const completeWithdrawal = async () => {
    if (!withdrawal) return;

    try {
      await api.patch(
        `https://api.thover.in/v1/api/withdrawal/admin/${withdrawal._id}/complete`,
        {
          remark,
        }
      );

      alert("Withdrawal Completed");

      fetchWithdrawal();

    } catch (err) {
      console.log(err);
      alert("Unable to complete withdrawal.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="flex-1 flex items-center justify-center">
          Loading...
        </main>
      </div>
    );
  }

  if (!withdrawal) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="flex-1 flex items-center justify-center">
          Withdrawal Not Found
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

<main className="ml-72 flex-1 h-screen overflow-y-auto p-8">

  <h1 className="text-4xl font-bold">
    Withdrawal Details
  </h1>

  <WithdrawalDetailsCard
    withdrawal={withdrawal}
  />

  <CompleteWithdrawalCard
    withdrawalId={withdrawal._id}
    status={withdrawal.status}
    currentRemark={withdrawal.remark}
    onSuccess={fetchWithdrawal}
  />

</main>

    </div>
  );
}

export default function WithdrawalDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WithdrawalDetailsContent />
    </Suspense>
  );
}