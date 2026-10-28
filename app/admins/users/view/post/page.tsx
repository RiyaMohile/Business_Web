"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../../../../components/Sidebar";
import UserPostTable from "../../../../components/posts/UserPostTable";
import api from "../../../../services/businessApi";

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

  media?: {
    mediaUrl: string;
    mediaName: string;
  }[];
}

function UserPostsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagsModal, setShowTagsModal] = useState(false);

  const handleViewTags = (tags: string[]) => {
    setSelectedTags(tags);
    setShowTagsModal(true);
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/post/user/${id}/posts?status=all`
      );

      setPosts(data.data.posts);
    } catch (err) {
      console.log(err);
      alert("Unable to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPosts();
    }
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <main className="ml-0 md:ml-72 flex-1 h-screen overflow-y-auto px-4 pb-8 pt-20 md:p-8">

        <h1 className="text-3xl font-bold md:text-4xl">
          User Posts
        </h1>

        <p className="mt-2 text-gray-500">
          All posts created by this user.
        </p>

        <UserPostTable
          posts={posts}
          loading={loading}
          onViewTags={handleViewTags}
        />

        {/* Tags Modal */}
        {showTagsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

            <div className="w-full max-w-[450px] rounded-xl bg-white p-5 md:p-6">

              <div className="mb-5 flex items-center justify-between">

                <h2 className="text-xl font-bold">
                  All Tags
                </h2>

                <button
                  onClick={() => setShowTagsModal(false)}
                  className="cursor-pointer text-2xl"
                >
                  ×
                </button>

              </div>

              <div className="flex max-h-[60vh] flex-wrap gap-3 overflow-y-auto">

                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-100 px-3 py-2 text-blue-700"
                  >
                    {tag}
                  </span>
                ))}

              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}

export default function UserPostsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserPostsContent />
    </Suspense>
  );
}