"use client";

import React from "react";
import {
  Search,
  User,
  UserPlus,
  ChevronDown,
  X,
} from "lucide-react";

interface UserType {
  _id: string;
  username?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
}

interface AddMemberModalsProps {
  // Search Modal
  showAddMemberModal: boolean;
  setShowAddMemberModal: (value: boolean) => void;

  // Users
  users: UserType[];
  searchUser: string;
  setSearchUser: (value: string) => void;

  onSearchUsers: (search: string) => void;

  // Selected User
  selectedUser: UserType | null;
  setSelectedUser: (user: UserType | null) => void;

  // Details Modal
  // Details Modal
showMemberDetailsModal: boolean;
setShowMemberDetailsModal: (value: boolean) => void;

  // Add Member
  onAddMember: () => void;
  addingMember?: boolean;
}

export default function AddMemberModals({
  showAddMemberModal,
  setShowAddMemberModal,

  users,
  searchUser,
  setSearchUser,
   onSearchUsers,

  selectedUser,
  setSelectedUser,

  showMemberDetailsModal,
  setShowMemberDetailsModal,

  onAddMember,
  addingMember = false,
}: AddMemberModalsProps) {
  /*
  ============================================================
  SELECT USER
  ============================================================
  */

  const handleSelectUser = (user: UserType) => {
    setSelectedUser(user);

    setShowAddMemberModal(false);

    setShowMemberDetailsModal(true);
  };

  /*
  ============================================================
  CLOSE DETAILS MODAL
  ============================================================
  */

  const handleCloseDetails = () => {
    setShowMemberDetailsModal(false);
    setSelectedUser(null);
  };


  return (
    <>
      {/* ======================================================
          ADD MEMBER SEARCH MODAL
      ====================================================== */}

      {showAddMemberModal && (
        <div
          className="
            fixed
            inset-0
            z-[1000]
            flex
            items-center
            justify-center
            bg-black/40
            p-4
          "
          onClick={() => setShowAddMemberModal(false)}
        >
          <div
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-100
                px-5
                py-4
              "
            >
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Add Member
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Search and select a user
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddMemberModal(false)
                }
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-500
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* SEARCH */}

            <div className="p-5">
              <div className="relative">
                <Search
                  size={17}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => {
  const value = e.target.value;

  setSearchUser(value);
  onSearchUsers(value);
}}
                  placeholder="Search username, name or email..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    py-3
                    pl-10
                    pr-4
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    focus:border-violet-500
                    focus:bg-white
                  "
                />
              </div>

              {/* USER LIST */}

              <div
                className="
                  mt-4
                  max-h-[350px]
                  overflow-y-auto
                  pr-1
                "
              >
                {users.length > 0 ? (
                  users.map((user) => (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() =>
                        handleSelectUser(user)
                      }
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-left
                        transition
                        hover:bg-violet-50
                      "
                    >
                      {/* USER ICON */}

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-violet-50
                        "
                      >
                        <User
                          size={18}
                          className="text-violet-600"
                        />
                      </div>

                      {/* USER INFO */}

                      <div className="min-w-0 flex-1">
                        <p
                          className="
                            truncate
                            text-sm
                            font-semibold
                            text-slate-800
                          "
                        >
                          {user.username || "—"}
                        </p>

                        <p
                          className="
                            truncate
                            text-xs
                            text-slate-400
                          "
                        >
                          {user.name || "No name"}
                        </p>

                        {user.email && (
                          <p
                            className="
                              truncate
                              text-[11px]
                              text-slate-400
                            "
                          >
                            {user.email}
                          </p>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  /* NO USERS */

                  <div className="py-10 text-center">
                    <div
                      className="
                        mx-auto
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-slate-100
                      "
                    >
                      <User
                        size={20}
                        className="text-slate-400"
                      />
                    </div>

                    <p
                      className="
                        mt-3
                        text-sm
                        font-medium
                        text-slate-700
                      "
                    >
                      No users found
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-400
                      "
                    >
                      Try searching with another name or
                      username.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          MEMBER DETAILS MODAL
      ====================================================== */}

      {showMemberDetailsModal && selectedUser && (
        <div
          className="
            fixed
            inset-0
            z-[1100]
            flex
            items-center
            justify-center
            bg-black/40
            p-4
          "
          onClick={handleCloseDetails}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              bg-white
              p-5
              shadow-2xl
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <div>
                <h2
                  className="
                    text-base
                    font-bold
                    text-slate-900
                  "
                >
                  Add Member
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-500
                  "
                >
                  Review member details
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseDetails}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-500
                  transition
                  hover:bg-slate-100
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* USER PROFILE */}

            <div
              className="
                mt-5
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-violet-100
                bg-violet-50/50
                p-4
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-violet-100
                "
              >
                <User
                  size={21}
                  className="text-violet-600"
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-slate-800
                  "
                >
                  {selectedUser.username || "—"}
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-xs
                    text-slate-500
                  "
                >
                  {selectedUser.name || "No name"}
                </p>
              </div>
            </div>

            {/* USERNAME */}

            <div
              className="
                mt-4
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                p-3
              "
            >
              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                Username
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-semibold
                  text-slate-800
                "
              >
                {selectedUser.username || "—"}
              </p>
            </div>

            {/* NAME */}

            <div
              className="
                mt-3
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                p-3
              "
            >
              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                Name
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-semibold
                  text-slate-800
                "
              >
                {selectedUser.name || "—"}
              </p>
            </div>

            {/* EMAIL */}

            {selectedUser.email && (
              <div
                className="
                  mt-3
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-3
                "
              >
                <p
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  Email
                </p>

                <p
                  className="
                    mt-1
                    truncate
                    text-sm
                    font-semibold
                    text-slate-800
                  "
                >
                  {selectedUser.email}
                </p>
              </div>
            )}

            {/* ROLE */}

            <div className="mt-4">
  <p className="text-xs font-medium text-slate-500">
    Role
  </p>

  <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
    <p className="text-sm font-semibold text-slate-800">
      Manager
    </p>
  </div>
</div>

            {/* BUTTONS */}

            <div className="mt-5 flex gap-3">
              {/* CANCEL */}

              <button
                type="button"
                onClick={handleCloseDetails}
                disabled={addingMember}
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              {/* ADD MEMBER */}

              <button
                type="button"
                onClick={onAddMember}
                disabled={addingMember}
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-violet-600
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-violet-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {addingMember ? (
                  <>
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/40
                        border-t-white
                      "
                    />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus size={17} />
                    Add Member
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}