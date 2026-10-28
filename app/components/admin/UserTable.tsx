"use client";

import UserRow from "./UserRow";

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
  users: User[];
  stores: Store[];
  storesLoading: boolean;
  loading: boolean;
  onRefresh: () => void;
}

export default function UserTable({
  users,
  stores,
  storesLoading,
  loading,
  onRefresh,
}: Props) {
  return (
    <div className="mt-8 w-full overflow-hidden rounded-2xl bg-white shadow">

      {/* ONLY TABLE SCROLLS */}
      <div className="max-h-[calc(100vh-280px)] overflow-auto">

        <table className="min-w-[700px] w-full">

          <thead className="sticky top-0 z-10 bg-blue-50">

            <tr>

              <th className="p-4 text-left">
                Name
              </th>

              <th className="text-left">
                Username
              </th>

              <th className="text-left">
                Phone
              </th>

              <th className="text-center">
                Role
              </th>

              <th className="text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center"
                >
                  Loading...
                </td>
              </tr>

            ) : users.length === 0 ? (

              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center"
                >
                  No Users Found
                </td>
              </tr>

            ) : (

              users.map((user) => (
                <UserRow
                  key={user._id}
                  user={user}
                  stores={stores}
                  storesLoading={storesLoading}
                  onRefresh={onRefresh}
                />
              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}