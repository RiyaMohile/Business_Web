"use client";

import { Star } from "lucide-react";

interface RatingBadgeProps {
  rating?: number;
}

export default function RatingBadge({
  rating,
}: RatingBadgeProps) {
  if (!rating || rating === 0) {
    return (
      <span className="text-gray-400">
        No Rating
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-yellow-600 font-medium">
      <Star
        size={16}
        fill="currentColor"
      />
      {rating}
    </span>
  );
}