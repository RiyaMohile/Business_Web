"use client";

import RoleBadge from "./RoleBadge";
import UserActionButton from "./UserActionButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  username: string;
  phoneNumber?: string;
  isAdmin: boolean;
}

interface Store {
  _id: string;
  storeId: string;
  storeName: string;
  category?: string;
  status?: string;
  isVerified?: boolean;
  isOnline?: boolean;
}

interface Props {
  user: User;
  stores: Store[];
  storesLoading: boolean;
  onRefresh: () => void;
}

export default function UserRow({
  user,
  stores,
  storesLoading,
  onRefresh,
}: Props) {
  const router = useRouter();

  return (
    <tr
      onClick={() =>
        router.push(`/admins/users/view?id=${user._id}`)
      }
      className="cursor-pointer hover:bg-gray-50"
    >
      <td className="p-4">
        {user.name}
      </td>

      <td>
        <Link
          href={`/admins/users/view?id=${user._id}`}
          className="font-medium text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {user.username}
        </Link>
      </td>

      <td>
        {user.phoneNumber || "-"}
      </td>

      <td className="text-center">
        <RoleBadge isAdmin={user.isAdmin} />
      </td>

      <td
        className="text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <UserActionButton
          id={user._id}
          isAdmin={user.isAdmin}
          stores={stores}
          storesLoading={storesLoading}
          onRefresh={onRefresh}
        />
      </td>
    </tr>
  );
}