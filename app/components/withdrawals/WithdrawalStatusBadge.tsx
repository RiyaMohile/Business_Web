"use client";

interface Props {
  status:
    | "pending"
    | "approved"
    | "processing"
    | "completed"
    | "rejected"
    | "failed";
}

export default function WithdrawalStatusBadge({
  status,
}: Props) {
  switch (status) {
    case "pending":
      return (
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
          Pending
        </span>
      );

    case "approved":
      return (
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          Approved
        </span>
      );

    case "processing":
      return (
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
          Processing
        </span>
      );

    case "completed":
      return (
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          Completed
        </span>
      );

    case "rejected":
      return (
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
          Rejected
        </span>
      );

    case "failed":
      return (
        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
          Failed
        </span>
      );

    default:
      return null;
  }
}