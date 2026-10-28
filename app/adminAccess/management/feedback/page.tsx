"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  MessageSquareText,
  Search,
  RefreshCw,
  UserRound,
  CalendarDays,
  Mail,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getAllFeedbacks,
  type Feedback,
} from "../../../services/feedbackService";

export default function FeedbackManagementPage() {
  const router = useRouter();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllFeedbacks();
      setFeedbacks(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load feedback.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchFeedbacks();
  }, []);

  const filteredFeedbacks = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return feedbacks;

    return feedbacks.filter((feedback) => {
      const user = feedback.user_id;

      return [
        feedback.text,
        user?.name,
        user?.username,
        user?.email,
      ].some((value) =>
        value?.toLowerCase().includes(query)
      );
    });
  }, [feedbacks, search]);

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-7">
          <button
            onClick={() => router.push("/adminAccess/management")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-purple-600"
          >
            <ArrowLeft size={17} />
            Back to Management
          </button>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Feedback Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View and review feedback submitted by users.
              </p>
            </div>

            <button
              onClick={() => void fetchFeedbacks()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-purple-200 hover:text-purple-600 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="mb-6 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <MessageSquareText size={24} />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Feedback
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "—" : feedbacks.length}
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by user, email or feedback..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
            />
          </div>
        </div>

        {/* ERROR */}
        {error && !loading && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">
                Failed to load feedback
              </p>
              <p className="mt-1 break-words">{error}</p>
              <button
                onClick={() => void fetchFeedbacks()}
                className="mt-2 font-semibold underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white">
            <LoaderCircle
              size={32}
              className="animate-spin text-purple-600"
            />
            <p className="mt-3 text-sm text-gray-500">
              Loading feedback...
            </p>
          </div>
        ) : error ? null : filteredFeedbacks.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 text-purple-500">
              <MessageSquareText size={30} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              {search ? "No feedback found" : "No feedback yet"}
            </h2>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
              {search
                ? "Try searching with another name, email or keyword."
                : "User feedback will appear here when it is submitted."}
            </p>
          </div>
        ) : (
          /* FEEDBACK LIST */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredFeedbacks.length}
                </span>{" "}
                of {feedbacks.length} feedback entries
              </p>
            </div>

            {filteredFeedbacks.map((feedback) => {
              const user = feedback.user_id;
              const displayName =
                user?.name ||
                user?.username ||
                "Unknown user";

              return (
                <article
                  key={feedback._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-purple-200 hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                        <UserRound size={21} />
                      </div>

                      <div className="min-w-0">
                        <h2 className="break-words font-semibold text-gray-900">
                          {displayName}
                        </h2>

                        {user?.email ? (
                          <p className="mt-1 flex items-center gap-1.5 break-all text-sm text-gray-500">
                            <Mail size={14} className="shrink-0" />
                            {user.email}
                          </p>
                        ) : (
                          <p className="mt-1 text-sm text-gray-400">
                            User details unavailable
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 text-xs text-gray-500 sm:justify-end">
                      <CalendarDays
                        size={15}
                        className="text-purple-500"
                      />
                      {formatDate(
                        feedback.timestamp || feedback.createdAt || ""
                      )}
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Feedback message
                    </p>
                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">
                      {feedback.text}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}