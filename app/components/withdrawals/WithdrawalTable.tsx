"use client";

import WithdrawalRow from "./WithdrawalRow";

interface Withdrawal {
  _id: string;

  transactionId: string;

  totalCoins: number;

  amount: number;

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
  };
}

interface Props {
  withdrawals: Withdrawal[];
  loading: boolean;
}

export default function WithdrawalTable({
  withdrawals,
  loading,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow mt-8 overflow-hidden">

      <table className="w-full">

        <thead className="bg-blue-50">

          <tr>

            <th className="p-4 text-left">
              User
            </th>

            <th className="text-left">
              Transaction ID
            </th>

            <th className="text-center">
              Coins
            </th>

            <th className="text-center">
              Amount
            </th>

            <th className="text-center">
              Status
            </th>

            <th className="text-center">
              Requested On
            </th>

            <th className="text-center">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {loading ? (

            <tr>

              <td
                colSpan={7}
                className="text-center py-10"
              >
                Loading...
              </td>

            </tr>

          ) : withdrawals.length === 0 ? (

            <tr>

              <td
                colSpan={7}
                className="text-center py-10"
              >
                No Withdrawal Requests
              </td>

            </tr>

          ) : (

            withdrawals.map((withdrawal) => (

              <WithdrawalRow
                key={withdrawal._id}
                withdrawal={withdrawal}
              />

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}