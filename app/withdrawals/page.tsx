"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/businessApi";

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

  createdAt: string;

  userId: {
    _id: string;
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
  };

  bankAccountId: {
    bankName: string;
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
  } | null;
}

export default function WithdrawalPage() {
  const [loading, setLoading] = useState(false);

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "https://api.thover.in/v1/api/withdrawal/admin/pending"
      );

      console.log(data.withdrawals);

      setWithdrawals(data.withdrawals);
    } catch (err) {
      console.log(err);
      alert("Unable to fetch withdrawals.");
    } finally {
      setLoading(false);
    }
  };

  const completeWithdrawal = async (withdrawalId: string) => {
    try {
      const remark =
        window.prompt("Enter remark (optional):") || "";

      await api.patch(
        `https://api.thover.in/v1/api/withdrawal/admin/${withdrawalId}/complete`,
        {
          remark,
        }
      );

      alert("Withdrawal completed successfully.");

      fetchWithdrawals();
    } catch (err: any) {
      console.log(err);

      alert(
        err?.response?.data?.message ||
          "Unable to complete withdrawal."
      );
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      {/* Mobile responsive, desktop same */}
      <main className="ml-0 md:ml-72 flex-1 h-screen overflow-hidden px-4 pb-8 pt-20 md:p-8">

        <h1 className="text-3xl font-bold md:text-4xl">
          Withdrawal Requests
        </h1>

        <p className="mt-2 text-gray-500">
          Review all pending withdrawal requests.
        </p>

        {/* Table */}
        <div className="mt-8 w-full overflow-hidden rounded-2xl bg-white shadow">

          {/* ONLY TABLE SCROLLS */}
          <div className="max-h-[calc(100vh-280px)] w-full overflow-auto">

            <table className="min-w-[1000px] w-full">

              <thead className="sticky top-0 z-10 bg-blue-50">

                <tr>

                  <th className="p-4 text-left">
                    User
                  </th>

                  <th className="p-4 text-center">
                    Coins
                  </th>

                  <th className="p-4 text-center">
                    Amount
                  </th>

                  <th className="p-4 text-left">
                    Bank
                  </th>

                  <th className="p-4 text-center">
                    Status
                  </th>

                  <th className="p-4 text-center">
                    Requested
                  </th>

                  <th className="p-4 text-center">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="py-10 text-center"
                    >
                      Loading...
                    </td>

                  </tr>

                ) : withdrawals.length === 0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="py-10 text-center"
                    >
                      No Pending Withdrawals
                    </td>

                  </tr>

                ) : (

                  withdrawals.map((item) => (

                    <tr
                      key={item._id}
                      className="hover:bg-gray-50"
                    >

                      {/* User */}
                      <td className="p-4">

                        <div>
                          <p className="font-medium">
                            {item.userId?.name ||
                              "Unknown User"}
                          </p>

                          {item.userId?.username && (
                            <p className="text-sm text-gray-500">
                              @{item.userId.username}
                            </p>
                          )}
                        </div>

                      </td>

                      {/* Coins */}
                      <td className="p-4 text-center">
                        {item.totalCoins}
                      </td>

                      {/* Amount */}
                      <td className="p-4 text-center whitespace-nowrap">
                        ₹{item.amount}
                      </td>

                      {/* Bank */}
                      <td className="p-4">

                        {item.bankAccountId ? (

                          <div>
                            <p className="font-medium whitespace-nowrap">
                              {item.bankAccountId.bankName}
                            </p>

                            <p className="text-sm text-gray-500 whitespace-nowrap">
                              A/C:{" "}
                              {item.bankAccountId.accountNumber}
                            </p>
                          </div>

                        ) : (

                          <span className="whitespace-nowrap text-gray-400">
                            Bank details unavailable
                          </span>

                        )}

                      </td>

                      {/* Status */}
                      <td className="p-4 text-center">

                        <span className="whitespace-nowrap rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">
                          {item.status}
                        </span>

                      </td>

                      {/* Requested */}
                      <td className="p-4 text-center whitespace-nowrap">

                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}

                      </td>

                      {/* Action */}
                      <td className="p-4 text-center">

                        <button
                          onClick={() =>
                            completeWithdrawal(item._id)
                          }
                          className="whitespace-nowrap rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                          Complete
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}