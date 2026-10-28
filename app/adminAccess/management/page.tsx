"use client";

import {
  FolderTree,
  ChevronRight,
  FileText,
  MessageSquareText,
  Images,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ManagementPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage categories and other system data
          </p>
        </div>

        {/* MANAGEMENT CARDS */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* CATEGORY */}
          <button
            type="button"
            onClick={() =>
              router.push("/adminAccess/management/category")
            }
            className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
          >

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FolderTree size={24} />
              </div>

              <ChevronRight
                size={20}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
              />

            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              Category Management
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Add, view, delete and update category
              media.
            </p>

          </button>

          {/* ABOUT PAGE MANAGEMENT */}

<button
  type="button"
  onClick={() =>
    router.push(
      "/adminAccess/management/about"
    )
  }
  className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
>
  <div className="flex items-start justify-between">

    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
      <FileText size={24} />
    </div>

    <ChevronRight
      size={20}
      className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-purple-600"
    />

  </div>

  <h2 className="mt-5 text-lg font-semibold text-gray-900">
    About Page Management
  </h2>

  <p className="mt-2 text-sm leading-6 text-gray-500">
    Create, view, update and delete About pages.
  </p>
</button>

{/* FEEDBACK MANAGEMENT */}
<button
  type="button"
  onClick={() =>
    router.push("/adminAccess/management/feedback")
  }
  className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
>
  <div className="flex items-start justify-between">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
      <MessageSquareText size={24} />
    </div>

    <ChevronRight
      size={20}
      className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-purple-600"
    />
  </div>

  <h2 className="mt-5 text-lg font-semibold text-gray-900">
    Feedback Management
  </h2>

  <p className="mt-2 text-sm leading-6 text-gray-500">
    View customer feedback, user details and submission dates.
  </p>
</button>


{/* POST MANAGEMENT */}
<button
  type="button"
  onClick={() =>
    router.push("/adminAccess/management/posts")
  }
  className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
>
  <div className="flex items-start justify-between">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
      <Images size={24} />
    </div>

    <ChevronRight
      size={20}
      className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-purple-600"
    />
  </div>

  <h2 className="mt-5 text-lg font-semibold text-gray-900">
    Post Management
  </h2>

  <p className="mt-2 text-sm leading-6 text-gray-500">
    Filter posts by city, view and download images,
    and create multiple posts.
  </p>
</button>


        </div>

        

      </div>

    </div>
  );
}