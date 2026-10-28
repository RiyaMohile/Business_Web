"use client";

import {Fragment, useEffect, useState } from "react";
import {
  Store,
  FileText,
  CalendarDays,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Tag,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import { getStoreOnboardingReport } from "../../services/reportApi";

interface Post {
  _id: string;
  postId?: string;
  topic?: string;
  createdAt: string;
}

interface StoreReport {
  _id: string;
  storeId: string;
  storeName: string;
  category?: string;
  storeCreatedAt: string;
  ownerName?: string;
  ownerPhone?: string;
  postCount: number;
  posts: Post[];
}

interface ReportResponse {
  success: boolean;
  message: string;
  filters: {
    from: string;
    to: string;
  };
  summary: {
    totalStores: number;
    totalPosts: number;
  };
  stores: StoreReport[];
}

const formatDate = (date: string) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function StoreOnboardingReportPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [report, setReport] =
    useState<ReportResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [expandedStore, setExpandedStore] =
    useState<string | null>(null);

  // ==========================================
  // DEFAULT DATE RANGE
  // ==========================================

  useEffect(() => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      today.getDate()
    ).padStart(2, "0");

    const firstDay = `${year}-${month}-01`;
    const todayDate = `${year}-${month}-${day}`;

    setFrom(firstDay);
    setTo(todayDate);
  }, []);

  // ==========================================
  // FETCH REPORT
  // ==========================================

  const fetchReport = async () => {
    if (!from || !to) {
      setError("Please select both dates.");
      return;
    }

    if (from > to) {
      setError(
        "From date cannot be greater than To date."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data =
        await getStoreOnboardingReport({
          from,
          to,
        });

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Unable to fetch report."
        );
      }

      setReport(data);
      setExpandedStore(null);
    } catch (err: any) {
      console.error(
        "STORE ONBOARDING REPORT ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to fetch store onboarding report."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH AFTER DEFAULT DATES ARE SET
  // ==========================================

  useEffect(() => {
    if (from && to) {
      fetchReport();
    }
  }, [from, to]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN */}

      <main className="ml-0 min-h-screen flex-1 overflow-y-auto px-4 pb-8 pt-20 md:ml-72 md:p-8">
        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-8">
  <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Store Onboarding Report
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Track stores created and their
                onboarding activity.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchReport}
              disabled={loading}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-violet-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-violet-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              {loading
                ? "Loading..."
                : "Generate Report"}
            </button>
          </div>
        </div>

        {/* ======================================
            DATE FILTER
        ====================================== */}

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays
              size={19}
              className="text-violet-600"
            />

            <h2 className="font-semibold text-slate-900">
              Report Period
            </h2>
          </div>

          <div className="flex flex-col items-stretch gap-4 md:flex-row md:flex-wrap md:items-end">
            {/* FROM */}

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-500">
                From Date
              </label>

              <input
                type="date"
                value={from}
                onChange={(e) =>
                  setFrom(e.target.value)
                }
                className="
                  h-11
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  text-slate-700
                  outline-none
                  transition
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                "
              />
            </div>

            {/* TO */}

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-500">
                To Date
              </label>

              <input
                type="date"
                value={to}
                onChange={(e) =>
                  setTo(e.target.value)
                }
                className="
                  h-11
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  text-slate-700
                  outline-none
                  transition
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                "
              />
            </div>

            {/* APPLY */}

            <button
              type="button"
              onClick={fetchReport}
              disabled={loading}
              className="
                h-11
                rounded-xl
                border
                border-violet-200
                bg-violet-50
                px-5
                text-sm
                font-semibold
                text-violet-700
                transition
                hover:bg-violet-100
                disabled:opacity-60
              "
            >
              Apply Filter
            </button>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* ======================================
            SUMMARY CARDS
        ====================================== */}

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* TOTAL STORES */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Stores
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {report?.summary
                    ?.totalStores ?? 0}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50">
                <Store
                  size={23}
                  className="text-violet-600"
                />
              </div>
            </div>
          </div>

          {/* TOTAL POSTS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Posts
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {report?.summary
                    ?.totalPosts ?? 0}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <FileText
                  size={23}
                  className="text-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================
            STORE TABLE
        ====================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* TABLE HEADER */}

          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">
              Stores
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Stores created during the selected
              period.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <RefreshCw
                  size={18}
                  className="animate-spin"
                />

                Loading report...
              </div>
            </div>
          ) : !report ||
            report.stores.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Store
                  size={22}
                  className="text-slate-400"
                />
              </div>

              <p className="font-semibold text-slate-700">
                No stores found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                No stores were created during the
                selected date range.
              </p>
            </div>
          ) : (
            <div className="max-h-[calc(100vh-280px)] overflow-auto">
  <table className="w-full min-w-[1050px]">
                <thead className="sticky top-0 z-10 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Store
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Owner
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Created
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                      Posts
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {report.stores.map(
                    (store) => {
                      const isExpanded =
                        expandedStore ===
                        store._id;

                      return (
                        <Fragment key={store._id}>
                          {/* STORE ROW */}

                          <tr className="transition hover:bg-slate-50">
                            {/* STORE */}

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                                  <Store
                                    size={19}
                                    className="text-violet-600"
                                  />
                                </div>

                                <div>
                                  <p className="font-semibold text-slate-900">
                                    {store.storeName ||
                                      "Unnamed Store"}
                                  </p>

                                  <p className="mt-0.5 text-xs text-slate-400">
                                    ID:{" "}
                                    {store.storeId}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* OWNER */}

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <User
                                  size={16}
                                  className="text-slate-400"
                                />

                                <span className="text-sm font-medium text-slate-700">
                                  {store.ownerName ||
                                    "-"}
                                </span>
                              </div>
                            </td>

                            {/* PHONE */}

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <Phone
                                  size={15}
                                  className="text-slate-400"
                                />

                                <span className="text-sm text-slate-600">
                                  {store.ownerPhone ||
                                    "-"}
                                </span>
                              </div>
                            </td>

                            {/* CATEGORY */}

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <Tag
                                  size={15}
                                  className="text-slate-400"
                                />

                                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                  {store.category ||
                                    "N/A"}
                                </span>
                              </div>
                            </td>

                            {/* CREATED */}

                            <td className="px-6 py-5 text-sm text-slate-600">
                              {formatDate(
                                store.storeCreatedAt
                              )}
                            </td>

                            {/* POSTS */}

                            <td className="px-6 py-5 text-center">
                              <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
                                {store.postCount}
                              </span>
                            </td>

                            {/* DETAILS */}

                            <td className="px-6 py-5 text-center">
                              {store.posts?.length >
                              0 ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedStore(
                                      isExpanded
                                        ? null
                                        : store._id
                                    )
                                  }
                                  className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-xs
                                    font-semibold
                                    text-violet-600
                                    transition
                                    hover:bg-violet-50
                                  "
                                >
                                  {isExpanded
                                    ? "Hide"
                                    : "View"}

                                  {isExpanded ? (
                                    <ChevronUp
                                      size={15}
                                    />
                                  ) : (
                                    <ChevronDown
                                      size={15}
                                    />
                                  )}
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400">
                                  No posts
                                </span>
                              )}
                            </td>
                          </tr>

                          {/* EXPANDED POSTS */}

                          {isExpanded && (
                            <tr key={`${store._id}-posts`}>
                              <td
  colSpan={7}
  className="bg-slate-50 px-4 py-5 md:px-8"
>
                                <div className="rounded-xl border border-slate-200 bg-white">
                                  <div className="border-b border-slate-100 px-5 py-4">
                                    <h3 className="font-semibold text-slate-800">
                                      Posts by{" "}
                                      {store.storeName}
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-400">
                                      {store.posts.length}{" "}
                                      posts found
                                    </p>
                                  </div>

                                  <div className="divide-y divide-slate-100">
                                    {store.posts.map(
                                      (post) => (
                                        <div
                                          key={
                                            post._id
                                          }
                                          className="flex flex-col items-start justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center"
                                        >
                                          <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                                              <FileText
                                                size={17}
                                                className="text-blue-600"
                                              />
                                            </div>

                                            <div>
                                              <p className="text-sm font-semibold text-slate-800">
                                                {post.topic ||
                                                  "Untitled Post"}
                                              </p>

                                              {post.postId && (
                                                <p className="text-xs text-slate-400">
                                                  Post ID:{" "}
                                                  {
                                                    post.postId
                                                  }
                                                </p>
                                              )}
                                            </div>
                                          </div>

                                          <span className="text-xs text-slate-400">
                                            {formatDate(
                                              post.createdAt
                                            )}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}