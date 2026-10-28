"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

interface Report {
  _id: string;

  text: string;

  reportedAt: string;

  user: {
    _id: string;
    name: string;
    username: string;
  };

  vibe: {
    _id: string;
    topic: string;
    text: string;
  };
}

export default function VibeReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        "https://api.thover.in/v1/api/admin/reports/vibes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(data);

      setReports(data.reports);

    } catch (err) {
      console.log(err);
      alert("Unable to fetch vibe reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <main className="ml-72 flex-1 h-screen overflow-y-auto p-8">

        <h1 className="text-4xl font-bold">
          Vibe Reports
        </h1>

        <p className="text-gray-500 mt-2">
          Review all reported vibes.
        </p>

        <div className="bg-white rounded-2xl shadow mt-8 overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-50">

              <tr>

                <th className="p-4 text-left">
                  Reported By
                </th>

                <th className="text-left">
                  Vibe
                </th>

                <th className="text-left">
                  Reason
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
                    No Vibe Reports Found
                  </td>

                </tr>

              ) : (

                reports.map((report) => (

                  <tr
                    key={report._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">

                      <p className="font-medium">
                        {report.user?.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        @{report.user?.username}
                      </p>

                    </td>

                    <td>

                      <p className="font-medium">
                        {report.vibe?.topic || "-"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {report.vibe?.text}
                      </p>

                    </td>

                    <td>
                      {report.text}
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