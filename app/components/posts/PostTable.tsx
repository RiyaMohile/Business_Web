"use client";

import PostRow from "./PostRow";

interface PostType {
  _id: string;
  topic: string;
  description: string;
  status: string;
  tags: string[];
  createdAt: string;

  userData?: {
    username: string;
    name: string;
    email: string;
  };
}

interface Props {
  posts: PostType[];
  loading: boolean;

  onSuspend: (post: PostType) => void;
  onDelete: (post: PostType) => void;
  onAddTag: (post: PostType) => void;
  onUpdateTag: (post: PostType) => void;
  onViewTags: (tags: string[]) => void;
}

export default function PostTable({
  posts,
  loading,
  onSuspend,
  onDelete,
  onAddTag,
  onUpdateTag,
  onViewTags,
}: Props) {
  return (
    <div className="mt-8 w-full overflow-hidden rounded-2xl bg-white shadow">

      {/* Only table area will scroll */}
      <div className="max-h-[calc(100vh-280px)] w-full overflow-auto">

        <table className="min-w-[1000px] w-full">

          <thead className="sticky top-0 z-10 bg-blue-50">

            <tr>

              <th className="whitespace-nowrap p-4 text-left">
                User
              </th>

              <th className="whitespace-nowrap p-4 text-left">
                Topic
              </th>

              <th className="whitespace-nowrap p-4 text-left">
                Description
              </th>

              <th className="whitespace-nowrap p-4 text-left">
                Status
              </th>

              <th className="whitespace-nowrap p-4 text-left">
                Tags
              </th>

              <th className="whitespace-nowrap p-4 text-left">
                Created
              </th>

              <th className="whitespace-nowrap p-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center"
                >
                  Loading...
                </td>
              </tr>

            ) : posts.length === 0 ? (

              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center"
                >
                  No Posts Found
                </td>
              </tr>

            ) : (

              posts.map((post) => (

                <PostRow
                  key={post._id}
                  post={post}
                  onSuspend={onSuspend}
                  onDelete={onDelete}
                  onAddTag={onAddTag}
                  onUpdateTag={onUpdateTag}
                  onViewTags={onViewTags}
                />

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}