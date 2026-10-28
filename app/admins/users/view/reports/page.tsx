"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../../../../components/Sidebar";
import api from "../../../../services/businessApi";

interface Report {
  _id: string;
  reason: string;
  description?: string;
  reportedAt: string;

  user: {
    _id: string;
    name: string;
    username: string;
    profileImage?: string;
  };
}

function UserReportsContent() {
  const searchParams = useSearchParams();
const id = searchParams.get("id");

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/admin/reports/user/${id}`
      );

      setReports(data.reports);
    } catch (err) {
      console.log(err);
      alert("Unable to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReports();
    }
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-72 flex-1 h-screen overflow-y-auto p-8">
        <h1 className="text-4xl font-bold">
          User Reports
        </h1>

        <p className="text-gray-500 mt-2">
          Reports submitted against this user.
        </p>

        <div className="bg-white rounded-2xl shadow mt-8 overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-50">

              <tr>

                <th className="text-left p-4">
                  Reported By
                </th>

                <th className="text-left">
                  Reason
                </th>

                <th className="text-left">
                  Description
                </th>

                <th className="text-center">
                  Reported On
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan={4}
                    className="text-center py-10"
                  >
                    Loading...
                  </td>

                </tr>

              ) : reports.length === 0 ? (

                <tr>

                  <td
                    colSpan={4}
                    className="text-center py-10"
                  >
                    No reports found.
                  </td>

                </tr>

              ) : (

                reports.map((report) => (

                  <tr
                    key={report._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">

                      <div>

                        <p className="font-medium">
                          {report.user?.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          @{report.user?.username}
                        </p>

                      </div>

                    </td>

                    <td>
                      {report.reason}
                    </td>

                    <td>
                      {report.description || "-"}
                    </td>

                    <td className="text-center">

                      {new Date(
                        report.reportedAt
                      ).toLocaleDateString()}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </main>

    </div>
  );
}

export default function UserReportsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserReportsContent />
    </Suspense>
  );
}