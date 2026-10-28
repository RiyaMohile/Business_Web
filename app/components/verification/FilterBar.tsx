"use client";

interface Props {
  status: string;
  setStatus: (value: string) => void;
  onFilter: (status: string) => void;
}

export default function FilterBar({
  status,
  setStatus,
  onFilter,
}: Props) {
  return (
    <div className="flex items-center gap-4 mt-8">

      <label className="font-medium">
        Filter :
      </label>

      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          onFilter(e.target.value);
        }}
        className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">
          All
        </option>

        <option value="pending">
          Pending
        </option>

        <option value="approved">
          Approved
        </option>

        <option value="rejected">
          Rejected
        </option>

      </select>

    </div>
  );
}