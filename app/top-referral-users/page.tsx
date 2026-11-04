
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Crown, Users, Trophy, RefreshCw } from "lucide-react";

interface ReferralUser {
  _id: string;
  name?: string;
  username?: string;
  totalReferrals: number;
}

interface ReferralApiResponse {
  success: boolean;
  count: number;
  topReferrers: ReferralUser[];
}

const API_URL = "https://api.thover.in/v1/api/user";

const rankStyles: Record<
  number,
  { badge: string; card: string; avatar: string }
> = {
  1: {
    badge: "bg-amber-400 text-white",
    card: "border-purple-500 shadow-xl shadow-purple-100",
    avatar: "from-purple-300 to-violet-100",
  },
  2: {
    badge: "bg-slate-400 text-white",
    card: "border-purple-100 shadow-sm",
    avatar: "from-violet-200 to-purple-50",
  },
  3: {
    badge: "bg-orange-500 text-white",
    card: "border-purple-100 shadow-sm",
    avatar: "from-purple-200 to-fuchsia-50",
  },
};

function ReferralCard({
  user,
  rank,
}: {
  user: ReferralUser;
  rank: number;
}) {
  const style = rankStyles[rank];
  const displayName = user.name?.trim() || user.username || "THOVER User";

  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <article
      className={`relative flex h-full flex-col items-center rounded-3xl border-2 bg-white px-4 pb-4 pt-8 text-center transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:px-5 md:pb-5 md:pt-9 ${
        style.card
      }`}
    >
      {/* Rank badge */}
      <div
        className={`absolute -top-4 flex h-10 w-10 items-center justify-center rounded-full text-lg font-extrabold shadow-md sm:h-11 sm:w-11 ${style.badge}`}
        aria-label={`Rank ${rank}`}
      >
        {rank === 1 ? (
          <Crown size={24} fill="currentColor" strokeWidth={1.5} />
        ) : (
          rank
        )}
      </div>

      {/* Avatar */}
      <div
        className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-extrabold text-purple-700 ring-4 ring-purple-50 sm:h-24 sm:w-24 sm:text-3xl ${style.avatar}`}
      >
        {initials}
      </div>

      {/* User details */}
      <h2 className="mt-4 max-w-full break-words text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
        {displayName}
      </h2>

      <p className="mt-1 max-w-full break-all text-sm text-slate-500 sm:text-base">
        @{user.username || "user"}
      </p>

      {/* Referral count */}
      <div className="mt-4 flex min-h-24 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100/70 px-3 py-4 sm:mt-5 md:min-h-28">
        <Users
          size={32}
          className="shrink-0 text-purple-600 sm:h-9 sm:w-9"
          strokeWidth={2.5}
        />

        <div className="text-center">
          <p className="text-3xl font-extrabold leading-tight text-purple-700 sm:text-4xl">
            {user.totalReferrals}
          </p>

          <p className="mt-1 text-sm font-medium text-slate-500 sm:text-base">
            Referrals
          </p>
        </div>
      </div>

      {/* Rank label */}
      <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-purple-500">
        {rank === 1
          ? "Top Referrer"
          : rank === 2
            ? "2nd Place"
            : "3rd Place"}
      </p>
    </article>
  );
}

export default function TopReferralUsersPage() {
  const [users, setUsers] = useState<ReferralUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTopReferrers = async () => {
    setLoading(true);
    setError("");

    try {
      if (!API_URL) {
        throw new Error(
          "API URL is missing. Please configure NEXT_PUBLIC_API_URL."
        );
      }

      const response = await fetch(
  `${API_URL}/top-referral-users`,
  {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  }
);

      const data: ReferralApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Unable to load referral leaderboard.");
      }

      const sortedUsers = [...(data.topReferrers || [])]
        .sort((a, b) => b.totalReferrals - a.totalReferrals)
        .slice(0, 3);

      setUsers(sortedUsers);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTopReferrers();
  }, []);

  return (
    <main className="flex min-h-dvh flex-col overflow-x-hidden bg-[#F7F5FC] text-slate-900 md:h-dvh md:overflow-hidden">
      {/* THOVER Header */}
      <header className="w-full bg-white px-4 py-4 text-black sm:px-8 sm:py-5 lg:px-12">
  <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
    {/* THOVER Logo */}
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <Image
        src="/icon.png"
        alt="THOVER logo"
        width={64}
        height={64}
        priority
        className="h-10 w-10 object-contain sm:h-14 sm:w-14 rounded-lg"
      />

      <span className="text-2xl font-extrabold tracking-wide text-black sm:text-4xl">
        THOVER
      </span>
    </div>

    {/* Tagline */}
    <p className="text-right text-sm font-medium text-gray-900 sm:text-xl">
      Shop Local{" "}
      <span className="font-bold text-purple-700">Shop Better</span>
    </p>
  </div>
</header>

      {/* Main leaderboard */}
      <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-5 sm:px-8 md:min-h-0 md:py-4">
        {/* Heading */}
        <div className="mb-6 shrink-0 text-center sm:mb-8 md:mb-5">
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 sm:h-12 sm:w-12">
            <Trophy size={25} />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Top <span className="text-purple-700">Referral</span> Users
          </h1>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-lg">
            Our top community members who have referred the most users.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-purple-200 border-t-purple-700" />

            <p className="text-sm font-medium text-slate-500">
              Loading referral leaderboard...
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            role="alert"
            className="mx-auto w-full max-w-lg rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm"
          >
            <p className="font-semibold text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => void fetchTopReferrers()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-700 px-5 py-3 font-semibold text-white transition hover:bg-purple-800"
            >
              <RefreshCw size={17} />
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && users.length === 0 && (
          <div className="mx-auto rounded-2xl border border-purple-100 bg-white p-8 text-center shadow-sm">
            <Users size={42} className="mx-auto text-purple-500" />

            <h2 className="mt-3 text-xl font-bold">No referrals yet</h2>

            <p className="mt-2 text-sm text-slate-500">
              The leaderboard will appear when users start referring others.
            </p>
          </div>
        )}

        {/* Leaderboard cards */}
        {!loading && !error && users.length > 0 && (
          <>
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-7 pt-4 sm:gap-8 md:min-h-0 md:grid-cols-3 md:gap-5 md:pt-2">
              {/* Second place */}
              {users[1] && (
                <div className="order-2 md:order-1 md:pt-7">
                  <ReferralCard user={users[1]} rank={2} />
                </div>
              )}

              {/* First place */}
              {users[0] && (
                <div className="order-1 md:order-2">
                  <ReferralCard user={users[0]} rank={1} />
                </div>
              )}

              {/* Third place */}
              {users[2] && (
                <div className="order-3 md:pt-7">
                  <ReferralCard user={users[2]} rank={3} />
                </div>
              )}
            </div>

            {/* <p className="mt-5 shrink-0 text-center text-xs text-slate-500 sm:text-sm">
              Showing the top {users.length} referrer
              {users.length === 1 ? "" : "s"} in the THOVER community.
            </p> */}
          </>
        )}
      </section>
    </main>
  );
}
