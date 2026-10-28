"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../services/businessApi";

interface Report {
  _id: string;

  text: string;

  reportedAt: string;

  user: {
    _id: string;
    name: string;
    username: string;
  };

  post: {
    _id: string;
    topic: string;
    description: string;
  };
}

export default function PostReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/admin/reports/posts"
      );

      console.log(data);

      setReports(data.reports);

    } catch (err) {
      console.log(err);
      alert("Unable to fetch reports");
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
          Post Reports
        </h1>

        <p className="text-gray-500 mt-2">
          All reported posts.
        </p>

        <div className="bg-white rounded-2xl shadow mt-8 overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-50">

              <tr>

                <th className="p-4 text-left">
                  Reported By
                </th>

                <th className="text-left">
                  Post
                </th>

                <th className="text-left">
                  Reason
                </th>

                <th className="text-center">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan={4} className="text-center py-10">
                    Loading...
                  </td>
                </tr>

              ) : reports.length === 0 ? (

                <tr>
                  <td colSpan={4} className="text-center py-10">
                    No Reports Found
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
                        {report.post?.topic}
                      </p>

                      <p className="text-sm text-gray-500">
                        {report.post?.description}
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