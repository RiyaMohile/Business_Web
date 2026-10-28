"use client";

import {
  FileText,
  User,
  Tag,
  Trash2,
  ShieldAlert,
  Pencil,
} from "lucide-react";

import StatusBadge from "./StatusBadge";

import { useRouter } from "next/navigation";

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
  post: PostType;

  onSuspend: (post: PostType) => void;
  onDelete: (post: PostType) => void;
  onAddTag: (post: PostType) => void;
  onUpdateTag: (post: PostType) => void;
  onViewTags: (tags: string[]) => void;
}

export default function PostRow({
  post,
  onSuspend,
  onDelete,
  onAddTag,
  onUpdateTag,
  onViewTags,
}: Props) {
  const router = useRouter();

  return (
    
    <tr className="hover:bg-gray-50 ">

      {/* User */}
      <td className="p-4">

        <div className="flex items-center gap-2">

          <User size={18} />

          {post.userData?.username || "-"}

        </div>

      </td>

      {/* Topic */}
      <td>

        <div className="flex items-center gap-2">

          <FileText
            size={18}
            className="text-blue-600"
          />

          {post.topic}

        </div>

      </td>

      {/* Description */}
      <td className="max-w-xs truncate">

        {post.description}

      </td>

      {/* Status */}
      <td>

        <StatusBadge status={post.status} />

      </td>

      {/* Tags */}
      <td className="p-4">

        <div className="flex flex-wrap gap-2 max-w-[220px]">

          {post.tags?.slice(0, 2).map((tag, index) => (

            <span
              key={index}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
            >
              #{tag}
            </span>

          ))}

          {post.tags?.length > 2 && (

            <button
              onClick={() => onViewTags(post.tags)}
              className="bg-gray-200 hover:bg-gray-300 text-xs px-2 py-1 rounded-full cursor-pointer"
            >
              +{post.tags.length - 2}
            </button>

          )}

        </div>

      </td>

      {/* Created */}
      <td>

        {new Date(post.createdAt).toLocaleDateString()}

      </td>

      {/* Actions */}
      <td>

        <div className="flex justify-center gap-2">
          <button
  onClick={() => router.push(`/reports/posts/view?id=${post._id}`)}
  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
>
  Reports
</button>

          <button
            onClick={() => onSuspend(post)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg"
          >
            <ShieldAlert size={18} />
          </button>

          <button
            onClick={() => onAddTag(post)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
          >
            <Tag size={18} />
          </button>

          <button
            onClick={() => onUpdateTag(post)}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(post)}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </td>

    </tr>
  );
}