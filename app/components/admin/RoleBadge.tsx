"use client";

import { Shield } from "lucide-react";

interface Props {
  isAdmin: boolean;
}

export default function RoleBadge({ isAdmin }: Props) {
  if (isAdmin) {
    return (
      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full">
        <Shield size={14} />
        Admin
      </span>
    );
  }

  return (
    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
      User
    </span>
  );
}