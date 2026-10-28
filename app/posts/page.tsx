"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/posts/SearchBar";
import PostTable from "../components/posts/PostTable";
import SuspendDeleteModal from "../components/posts/SuspendDeleteModal";
import TagModal from "../components/posts/TagModal";
import ViewTagsModal from "../components/posts/ViewTagsModal";
import { useRouter } from "next/navigation";

interface PostType {
  _id: string;
  topic: string;
  description: string;
  status: string;
  reason?: string;
  tags: string[];
  createdAt: string;
  userData?: {
    username: string;
    name: string;
    email: string;
  };
}

export default function PostsPage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [tag, setTag] = useState("");
  const [showTagsModal, setShowTagsModal] = useState(false);
const [selectedTags, setSelectedTags] = useState<string[]>([]);

const router = useRouter();

const [tags, setTags] = useState("");

  const [search, setSearch] = useState("");

  // For next part
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [action, setAction] = useState<
    "suspend" | "delete" | "addTag" | "updateTag" | null
  >(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "https://api.thover.in/v1/api/post/all-posts"
      );

      setPosts(data.posts);
      setFilteredPosts(data.posts);
    } catch (err) {
      console.log(err);
      alert("Unable to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const result = posts.filter(
      (post) =>
        post.topic?.toLowerCase().includes(search.toLowerCase()) ||
        post.description?.toLowerCase().includes(search.toLowerCase()) ||
        post.userData?.username
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );

    setFilteredPosts(result);
  };

  const suspendPost = async () => {
  if (!selectedPost) return;

  try {
    const token = localStorage.getItem("token");

    await axios.patch(
      `https://api.thover.in/v1/api/admin/admin-suspend-post/${selectedPost._id}`,
      {
        status: "suspended",
        reason,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Post suspended successfully");

    setSelectedPost(null);
    setReason("");
    setAction(null);

    fetchPosts();

  } catch (err: any) {
    alert(err.response?.data?.message || "Something went wrong");
  }
};

const deletePost = async () => {
  if (!selectedPost) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `https://api.thover.in/v1/api/admin/admin-delete-post/${selectedPost._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Post deleted successfully");

    setSelectedPost(null);
    setAction(null);

    fetchPosts();

  } catch (err: any) {
    alert(err.response?.data?.message || "Something went wrong");
  }
};

const addTag = async () => {
  if (!selectedPost) return;

  if (!tag.trim()) {
    alert("Enter a tag");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "https://api.thover.in/v1/api/admin/admin-add-post-tags",
      {
        postId: selectedPost._id,
        tag,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Tag added successfully");

    setTag("");
    setAction(null);
    setSelectedPost(null);

    fetchPosts();

  } catch (err: any) {
    alert(err.response?.data?.message || "Unable to add tag");
  }
};

const updateTags = async () => {
  if (!selectedPost) return;

  if (!tags.trim()) {
    alert("Enter tags");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await axios.post(
      "https://api.thover.in/v1/api/admin/admin-update-post-tags",
      {
        postId: selectedPost._id,
        tags: tagArray,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Tags updated successfully");

    setTags("");
    setSelectedPost(null);
    setAction(null);

    fetchPosts();

  } catch (err: any) {
    alert(err.response?.data?.message || "Unable to update tags");
  }
};

  return (
    <div className="flex min-h-screen bg-gray-50">
    
        <Sidebar />
    
        <main className="ml-0 md:ml-72 flex-1 h-screen overflow-hidden px-4 pb-6 pt-20 md:p-8">

      <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">

  <div>
    <h1 className="text-3xl font-bold md:text-4xl">
      Posts Management
    </h1>

    <p className="mt-2 text-gray-500">
      Manage all user posts
    </p>
  </div>

</div>

      {/* Search */}

<SearchBar
  value={search}
  onChange={setSearch}
  onSearch={handleSearch}
  onReports={() => router.push("/reports/posts")}
/>

      {/* Table */}

      <PostTable
  posts={filteredPosts}
  loading={loading}
  onSuspend={(post) => {
    setSelectedPost(post);
    setAction("suspend");
  }}
  onDelete={(post) => {
    setSelectedPost(post);
    setAction("delete");
  }}
  onAddTag={(post) => {
    setSelectedPost(post);
    setAction("addTag");
  }}
  onUpdateTag={(post) => {
    setSelectedPost(post);
    setAction("updateTag");
  }}
  onViewTags={(tags) => {
    setSelectedTags(tags);
    setShowTagsModal(true);
  }}
/>

<SuspendDeleteModal
  open={
    selectedPost !== null &&
    (action === "suspend" || action === "delete")
  }
  action={
    action === "suspend" || action === "delete"
      ? action
      : null
  }
  post={selectedPost}
  reason={reason}
  setReason={setReason}
  onClose={() => {
    setSelectedPost(null);
    setAction(null);
    setReason("");
  }}
  onSuspend={suspendPost}
  onDelete={deletePost}
/>

<TagModal
  open={
    selectedPost !== null &&
    (action === "addTag" || action === "updateTag")
  }
  post={selectedPost}
  action={
    action === "addTag" || action === "updateTag"
      ? action
      : null
  }
  tag={tag}
  setTag={setTag}
  tags={tags}
  setTags={setTags}
  onClose={() => {
    setSelectedPost(null);
    setAction(null);
    setTag("");
    setTags("");
  }}
  onAddTag={addTag}
  onUpdateTags={updateTags}
/>

<ViewTagsModal
  open={showTagsModal}
  tags={selectedTags}
  onClose={() => setShowTagsModal(false)}
/>

    </main>
    </div>
  );
}