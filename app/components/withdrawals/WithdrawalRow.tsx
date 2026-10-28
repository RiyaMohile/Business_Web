"use client";

import { useRouter } from "next/navigation";
import WithdrawalStatusBadge from "./WithdrawalStatusBadge";

interface Withdrawal {
  _id: string;

  transactionId: string;

  amount: number;

  totalCoins: number;

  createdAt: string;

  status:
    | "pending"
    | "approved"
    | "processing"
    | "completed"
    | "rejected"
    | "failed";

  userId: {
    _id: string;
    name: string;
    username: string;
  };
}

interface Props {
  withdrawal: Withdrawal;
}

export default function WithdrawalRow({
  withdrawal,
}: Props) {
  const router = useRouter();

  return (
    <tr
      className="border-b hover:bg-gray-50 cursor-pointer"
      onClick={() =>
        router.push(
          `/withdrawals/view?id=${withdrawal._id}`
        )
      }
    >
      <td className="p-4">

        <div>

          <p className="font-medium">
            {withdrawal.userId?.name}
          </p>

          <p className="text-sm text-gray-500">
            @{withdrawal.userId?.username}
          </p>

        </div>

      </td>

      <td>
        {withdrawal.transactionId}
      </td>

      <td>
        {withdrawal.totalCoins}
      </td>

      <td>
        ₹{withdrawal.amount}
      </td>

      <td className="text-center">
        <WithdrawalStatusBadge
          status={withdrawal.status}
        />
      </td>

      <td className="text-center">
        {new Date(
          withdrawal.createdAt
        ).toLocaleDateString()}
      </td>

      <td className="text-center">

        <button
          onClick={(e) => {
            e.stopPropagation();

            router.push(
              `/withdrawals/view?id=${withdrawal._id}`
            );
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          View
        </button>

      </td>

    </tr>
  );
}