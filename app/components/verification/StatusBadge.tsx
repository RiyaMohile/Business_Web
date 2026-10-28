"use client";

interface Props {
  status: "pending" | "VERIFIED" | "REJECTED";
}

export default function StatusBadge({
  status,
}: Props) {
  if (status === "VERIFIED") {
    return (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
        Approved
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
        Rejected
      </span>
    );
  }

  return (
    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
      Pending
    </span>
  );
}