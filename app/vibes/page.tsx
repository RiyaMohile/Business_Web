"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/vibes/SearchBar";
import VibeTable from "../components/vibes/VibeTable";
import DeleteVibeModal from "../components/vibes/DeleteVibeModal";
import { useRouter } from "next/navigation";


interface Vibe {
  _id: string;
  topic: string;
  text: string;
  rating: number;
  likes: any[];
  createdAt: string;
  vibeType: string;
  media: {
    mediaUrl: string;
    mediaName: string;
  }[];
  userData?: {
    username: string;
    name: string;
  };
  user?: {
    username: string;
    name: string;
  };
  replyTo?: {
    vibeId?: string;
  };
}

export default function VibesPage() {
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [filtered, setFiltered] = useState<Vibe[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedVibe, setSelectedVibe] = useState<Vibe | null>(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const router = useRouter();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : "";

  const fetchVibes = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
  "https://api.thover.in/v1/api/vibe/get-vibes?page=1&limit=100",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      setVibes(data.data);
setFiltered(data.data);
    } catch (err) {
      console.log(err);
      alert("Unable to fetch vibes.");
    } finally {
      setLoading(false);
    }
  };
  const deleteVibe = async () => {
  if (!selectedVibe) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `https://api.thover.in/v1/api/admin/admin-delete-vibes/${selectedVibe._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Vibe deleted successfully");

    setShowDeleteModal(false);
    setSelectedVibe(null);

    fetchVibes();

  } catch (err: any) {
    alert(err.response?.data?.message || "Unable to delete vibe");
  }
};

  useEffect(() => {
    fetchVibes();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(vibes);
      return;
    }

    const keyword = search.toLowerCase();

    setFiltered(
      vibes.filter(
        (vibe) =>
          vibe.topic?.toLowerCase().includes(keyword) ||
          vibe.text?.toLowerCase().includes(keyword)
      )
    );
  }, [search, vibes]);

  return (
     <div className="flex min-h-screen bg-gray-50">
        
            <Sidebar />
        
            <main className="ml-0 md:ml-72 flex-1 h-screen overflow-hidden px-4 pb-6 pt-20 md:p-8">

      <div>

       <h1 className="text-3xl font-bold md:text-4xl">
          Vibes Management
        </h1>

        <p className="text-gray-500 mt-2">
          Search and manage user vibes
        </p>

      </div>
<div className="mt-8 flex flex-col gap-4 md:flex-row">

  <div className="w-full flex-1">
    <SearchBar
      value={search}
      onChange={setSearch}
      placeholder="Search topic or text..."
    />
  </div>

  <button
    onClick={() => router.push("/reports/vibes")}
    className="w-full rounded-xl bg-red-600 px-8 py-3 text-white hover:bg-red-700 md:w-auto"
  >
    Vibe Reports
  </button>

</div>

      {/* Table */}

<VibeTable
  vibes={filtered}
  loading={loading}
  onDelete={(vibe) => {
    setSelectedVibe(vibe);
    setShowDeleteModal(true);
  }}
  onViewReports={(vibe) => {
    router.push(`/reports/vibes/view?id=${vibe._id}`);
  }}
/>
<DeleteVibeModal
  open={showDeleteModal}
  vibe={selectedVibe}
  onClose={() => {
    setShowDeleteModal(false);
    setSelectedVibe(null);
  }}
  onDelete={deleteVibe}
/>
      </main>

    </div>
  );
}