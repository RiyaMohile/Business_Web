"use client";

import { useRouter } from "next/navigation";

interface Verification {
  _id: string;

  status: "PENDING" | "VERIFIED" | "REJECTED";

  createdAt: string;

  storeId: {
    _id: string;
    storeName: string;
    category: string;
  };

  userId: {
    _id: string;
    name: string;
    username: string;
  };
}

interface Props {
  verification: Verification;
}

export default function VerificationRow({
  verification,
}: Props) {
  const router = useRouter();

  return (
    <tr
      className="border-b hover:bg-gray-50 cursor-pointer"
      onClick={() =>
        router.push(
          `/verifications/view?id=${verification.userId._id}`
        )
      }
    >
      <td className="p-4">

        <div>

          <p className="font-medium">
            {verification.userId?.name}
          </p>

          <p className="text-sm text-gray-500">
            @{verification.userId?.username}
          </p>

        </div>

      </td>

      <td>
        {verification.storeId?.storeName}
      </td>

      <td>
        {verification.storeId?.category}
      </td>

      <td className="text-center">

        {verification.status==="VERIFIED" ? (

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

            Approved

          </span>

        ) : verification.status === "PENDING" ? (

          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">

            Pending

          </span>

        ) : (

          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">

            Rejected

          </span>

        )}

      </td>

      <td className="text-center">

        {new Date(
          verification.createdAt
        ).toLocaleDateString()}

      </td>

      <td className="text-center">

        <button
          onClick={(e) => {
            e.stopPropagation();

            router.push(
              `/verifications/view?id=${verification.userId._id}`
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