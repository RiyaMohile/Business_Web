"use client";

interface Props {
  status: string;
}

export default function StatusBadge({
  status,
}: Props) {
  return status === "suspended" ? (
    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
      Suspended
    </span>
  ) : (
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
      Public
    </span>
  );
}