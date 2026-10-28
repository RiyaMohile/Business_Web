"use client";

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
    email?: string;
  };
}

interface Props {
  posts: PostType[];
  loading: boolean;
  onViewTags: (tags: string[]) => void;
}

export default function UserPostTable({
  posts,
  loading,
  onViewTags,
}: Props) {
  return (
    <div className="mt-8 w-full overflow-hidden rounded-2xl bg-white shadow">

      {/* Only table will scroll */}
      <div className="max-h-[calc(100vh-280px)] w-full overflow-auto">

        <table className="min-w-[900px] w-full">

          <thead className="sticky top-0 z-10 bg-blue-50">

            <tr>

              <th className="p-4 text-left">
                Topic
              </th>

              <th className="p-4 text-left">
                Description
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Tags
              </th>

              <th className="p-4 text-left">
                Created
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

            ) : posts.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="py-10 text-center"
                >
                  No Posts Found
                </td>

              </tr>

            ) : (

              posts.map((post) => (

                <tr
                  key={post._id}
                  className="hover:bg-gray-50"
                >

                  {/* Topic */}
                  <td className="p-4 font-medium">
                    {post.topic}
                  </td>

                  {/* Description */}
                  <td className="max-w-sm p-4">

                    <p className="line-clamp-2 text-gray-600">
                      {post.description}
                    </p>

                  </td>

                  {/* Status */}
                  <td className="p-4">

                    {post.status === "public" ? (

                      <span className="whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        Public
                      </span>

                    ) : (

                      <span className="whitespace-nowrap rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
                        Suspended
                      </span>

                    )}

                  </td>

                  {/* Tags */}
                  <td className="p-4">

                    <div className="flex flex-wrap gap-2">

                      {post.tags?.length ? (

                        post.tags
                          .slice(0, 2)
                          .map((tag) => (

                            <span
                              key={tag}
                              className="whitespace-nowrap rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700"
                            >
                              {tag}
                            </span>

                          ))

                      ) : (

                        <span className="text-gray-400">
                          -
                        </span>

                      )}

                      {post.tags?.length > 2 && (

                        <button
                          onClick={() =>
                            onViewTags(post.tags)
                          }
                          className="cursor-pointer whitespace-nowrap rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200"
                        >
                          +{post.tags.length - 2}
                        </button>

                      )}

                    </div>

                  </td>

                  {/* Created */}
                  <td className="p-4 whitespace-nowrap">

                    {new Date(
                      post.createdAt
                    ).toLocaleDateString()}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}