"use client";

import Sidebar from "../components/Sidebar";



export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-h-screen md:ml-72">
        {children}
      </main>

    </div>
  );
}