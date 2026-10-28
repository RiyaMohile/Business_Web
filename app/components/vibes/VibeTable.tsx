"use client";

import VibeRow from "./VibeRow";

interface Vibe {
  _id: string;
  topic: string;
  text: string;
  rating: number;
  likes: any[];
  createdAt: string;
  vibeType: string;

  media: {
    mediaUrl: string;
    mediaName: string;
  }[];

  userData?: {
    username: string;
    name: string;
  };

  user?: {
    username: string;
    name: string;
  };

  replyTo?: {
    vibeId?: string;
  };
}

interface Props {
  vibes: Vibe[];
  loading: boolean;
  onDelete: (vibe: Vibe) => void;
  onViewReports: (vibe: Vibe) => void;
}

export default function VibeTable({
  vibes,
  loading,
  onDelete,
  onViewReports,
}: Props) {
  return (
    <div className="mt-8 w-full overflow-hidden rounded-2xl bg-white shadow">

      {/* Only table area scrolls */}
      <div className="max-h-[calc(100vh-280px)] w-full overflow-auto">

        <table className="min-w-[1000px] w-full">

          <thead className="sticky top-0 z-10 bg-blue-50">

            <tr>

              <th className="whitespace-nowrap p-4 text-left">
                User
              </th>

              <th className="whitespace-nowrap p-4 text-left">
                Topic
              </th>

              <th className="whitespace-nowrap p-4 text-left">
                Text
              </th>

              <th className="whitespace-nowrap p-4 text-left">
                Rating
              </th>

              <th className="whitespace-nowrap p-4 text-left">
                Likes
              </th>

              <th className="whitespace-nowrap p-4 text-left">
                Media
              </th>

              <th className="whitespace-nowrap p-4 text-left">
                Type
              </th>

              <th className="whitespace-nowrap p-4 text-left">
                Created
              </th>

              <th className="whitespace-nowrap p-4 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={9}
                  className="py-10 text-center"
                >
                  Loading...
                </td>
              </tr>

            ) : vibes.length === 0 ? (

              <tr>
                <td
                  colSpan={9}
                  className="py-10 text-center"
                >
                  No Vibes Found
                </td>
              </tr>

            ) : (

              vibes.map((vibe) => (
                <VibeRow
                  key={vibe._id}
                  vibe={vibe}
                  onDelete={onDelete}
                  onViewReports={onViewReports}
                />
              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}