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
  post: PostType;
}

export default function UserPostRow({
  post,
}: Props) {
  return (
    <tr className="border-b hover:bg-gray-50">

      {/* Topic */}

      <td className="p-4">

        <p className="font-medium">
          {post.topic}
        </p>

      </td>

      {/* Description */}

      <td className="max-w-sm">

        <p className="text-gray-600 line-clamp-2">

          {post.description}

        </p>

      </td>

      {/* Status */}

      <td>

        {post.status === "public" ? (

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

            Public

          </span>

        ) : (

          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">

            Suspended

          </span>

        )}

      </td>

      {/* Tags */}

      <td>

        <div className="flex flex-wrap gap-2">

          {post.tags?.length > 0 ? (

            <>
              {post.tags.slice(0, 2).map((tag) => (

                <span
                  key={tag}
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>

              ))}

              {post.tags.length > 2 && (

                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">

                  +{post.tags.length - 2}

                </span>

              )}
            </>

          ) : (

            <span className="text-gray-400">

              -

            </span>

          )}

        </div>

      </td>

      {/* Created Date */}

      <td>

        {new Date(post.createdAt).toLocaleDateString()}

      </td>

    </tr>
  );
}