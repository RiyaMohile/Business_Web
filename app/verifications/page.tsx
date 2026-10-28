"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import api from "../services/businessApi";

interface Verification {
  _id: string;

  status: "PENDING" | "VERIFIED" | "REJECTED";

  createdAt: string;

  legalProof: {
    proofType: string;
  };

  addressProof?: {
    proofType: string;
  };

  userId: {
    _id: string;
    name: string;
    username: string;
  };
}

export default function VerificationPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [verifications, setVerifications] = useState<Verification[]>([]);

  const fetchVerification = async (selectedStatus?: string) => {
    try {
      setLoading(true);

      let url = "/business-verification/all";

      if (selectedStatus) {
        url += `?status=${selectedStatus}`;
      }

      const { data } = await api.get(url);

      console.log(data.data);

      setVerifications(data.data);
    } catch (err) {
      console.log(err);
      alert("Unable to fetch verification requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerification();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      {/* Desktop same, mobile responsive */}
      <main className="ml-0 md:ml-72 flex-1 h-screen overflow-hidden px-4 pb-6 pt-20 md:p-8">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-bold md:text-4xl">
              Business Verifications
            </h1>

            <p className="mt-2 text-gray-500">
              Review and approve business verification requests.
            </p>
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              fetchVerification(e.target.value);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 md:w-auto"
          >
            <option value="">All</option>

            <option value="PENDING">
              Pending
            </option>

            <option value="VERIFIED">
              Approved
            </option>

            <option value="REJECTED">
              Rejected
            </option>
          </select>

        </div>

        {/* Table */}
        <div className="mt-8 w-full overflow-hidden rounded-2xl bg-white shadow">

          {/* ONLY TABLE SCROLLS */}
          <div className="max-h-[calc(100vh-280px)] w-full overflow-auto">

            <table className="min-w-[900px] w-full">

              <thead className="sticky top-0 z-10 bg-blue-50">

                <tr>

                  <th className="p-4 text-left">
                    User
                  </th>

                  <th className="p-4 text-left">
                    Legal Proof
                  </th>

                  <th className="p-4 text-left">
                    Address Proof
                  </th>

                  <th className="p-4 text-center">
                    Status
                  </th>

                  <th className="p-4 text-center">
                    Submitted
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
                      colSpan={6}
                      className="py-10 text-center"
                    >
                      Loading...
                    </td>

                  </tr>

                ) : verifications.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="py-10 text-center"
                    >
                      No Verification Requests
                    </td>

                  </tr>

                ) : (

                  verifications.map((item) => (

                    <tr
                      key={item._id}
                      className="hover:bg-gray-50"
                    >

                      <td className="p-4">

                        <div>
                          <p className="font-medium">
                            {item.userId?.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            @{item.userId?.username}
                          </p>
                        </div>

                      </td>

                      <td className="p-4">
                        {item.legalProof.proofType}
                      </td>

                      <td className="p-4">
                        {item.addressProof?.proofType || "-"}
                      </td>

                      <td className="p-4 text-center">

                        {item.status === "VERIFIED" && (
                          <span className="whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-green-700">
                            Approved
                          </span>
                        )}

                        {item.status === "PENDING" && (
                          <span className="whitespace-nowrap rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">
                            Pending
                          </span>
                        )}

                        {item.status === "REJECTED" && (
                          <span className="whitespace-nowrap rounded-full bg-red-100 px-3 py-1 text-red-700">
                            Rejected
                          </span>
                        )}

                      </td>

                      <td className="p-4 text-center whitespace-nowrap">

                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}

                      </td>

                      <td className="p-4 text-center">

                        <button
                          onClick={() =>
                            router.push(
                              `/verifications/view?id=${item.userId._id}`
                            )
                          }
                          className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                          View
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