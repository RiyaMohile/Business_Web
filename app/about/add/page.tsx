"use client";

import Sidebar from "../../components/Sidebar";
import AboutForm from "../../components/about/AboutForm";

export default function AddAboutPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <main className="ml-72 flex-1 h-screen overflow-y-auto p-8">

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            Create Page
          </h1>

          <p className="text-gray-500 mt-2">
            Create Privacy Policy, Terms of Use or About Us page.
          </p>

        </div>

        <AboutForm />

      </main>

    </div>
  );
}