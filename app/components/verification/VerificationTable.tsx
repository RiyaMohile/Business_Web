"use client";

import VerificationRow from "./VerificationRow";

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
  verifications: Verification[];
  loading: boolean;
}

export default function VerificationTable({
  verifications,
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
              Business
            </th>

            <th className="text-left">
              Category
            </th>

            <th className="text-center">
              Status
            </th>

            <th className="text-center">
              Submitted
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
                colSpan={6}
                className="text-center py-10"
              >
                Loading...
              </td>

            </tr>

          ) : verifications.length === 0 ? (

            <tr>

              <td
                colSpan={6}
                className="text-center py-10"
              >
                No Verification Requests
              </td>

            </tr>

          ) : (

            verifications.map((verification) => (

              <VerificationRow
                key={verification._id}
                verification={verification}
              />

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}