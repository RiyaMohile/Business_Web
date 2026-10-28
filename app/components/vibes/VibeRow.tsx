"use client";

import {
  MessageCircle,
  Heart,
  Image,
  Reply,
  Trash2,
} from "lucide-react";

import RatingBadge from "./RatingBadge";

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
  vibe: Vibe;
  onDelete: (vibe: Vibe) => void;
  onViewReports: (vibe: Vibe) => void;
}

export default function VibeRow({
  vibe,
  onDelete,
  onViewReports,
}: Props) {
  return (
    <tr className="hover:bg-gray-50">

      {/* User */}

      <td className="p-4">

        <div className="flex items-center gap-2">

          <MessageCircle
            size={18}
            className="text-blue-600"
          />

          <div>

            <p className="font-medium">

              {vibe.userData?.username ||
                vibe.user?.username ||
                "-"}

            </p>

          </div>

        </div>

      </td>

      {/* Topic */}

      <td>

        {vibe.topic || "-"}

      </td>

      {/* Text */}

      <td className="max-w-sm truncate">

        {vibe.text}

      </td>

      {/* Rating */}

      <td>

        <RatingBadge
          rating={vibe.rating}
        />

      </td>

      {/* Likes */}

      <td>

        <div className="flex items-center gap-2">

          <Heart
            size={17}
            className="text-red-500"
          />

          {vibe.likes?.length || 0}

        </div>

      </td>

      {/* Media */}

      <td>

        <div className="flex items-center gap-2">

          <Image
            size={18}
            className="text-blue-600"
          />

          {vibe.media?.length || 0}

        </div>

      </td>

      {/* Type */}

      <td>

        {vibe.replyTo?.vibeId ? (

          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit">

            <Reply size={13} />

            Reply

          </span>

        ) : (

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

            Original

          </span>

        )}

      </td>

      {/* Created */}

      <td>

        {new Date(
          vibe.createdAt
        ).toLocaleDateString()}

      </td>

      {/* Actions */}

      <td>

  <div className="flex justify-center gap-2">

    <button
      onClick={() => onViewReports(vibe)}
      className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg"
    >
      Reports
    </button>

    <button
      onClick={() => onDelete(vibe)}
      className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-2"
    >
      <Trash2 size={18} />
    </button>

  </div>

</td>

    </tr>
  );
}