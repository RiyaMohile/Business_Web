"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import AboutForm from "../../../components/about/AboutForm";

function EditAboutContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <main className="ml-0 md:ml-72 flex-1 h-screen overflow-y-auto px-4 pb-8 pt-20 md:p-8">

        <h1 className="text-3xl font-bold md:text-4xl">
          Edit Page
        </h1>

        <p className="mt-2 text-gray-500">
          Update Page
        </p>

        <div className="mt-6 md:mt-8">

          <AboutForm
            edit
            pageId={id ?? ""}
          />

        </div>

      </main>

    </div>
  );
}

export default function EditAboutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditAboutContent />
    </Suspense>
  );
}