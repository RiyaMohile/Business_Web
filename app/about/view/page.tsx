"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import axios from "axios";
import Sidebar from "../../components/Sidebar";

interface Section {
  _id: string;
  point: number;
  title: string;
  description: string;
  content: string[];
}

interface PageData {
  _id: string;
  name: string;
  heading: string;
  description: string;
  version: string;

  sections: Section[];

  footerText: {
    text: string;
    email: string;
    phone: string;
  };

  lastUpdated: string;
}

function ViewAboutContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPage = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `https://api.thover.in/v1/api/about/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPage(data.data);
    } catch (err) {
      console.log(err);
      alert("Unable to fetch page");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPage();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />

        <main className="ml-72 flex-1 flex items-center justify-center">
          <p className="text-xl font-semibold">
            Loading...
          </p>
        </main>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />

        <main className="ml-0 flex flex-1 items-center justify-center px-4 pt-16 md:ml-72 md:px-0 md:pt-0">
          <p className="text-xl font-semibold text-red-600">
            Page not found
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="ml-0 md:ml-72 flex-1 h-screen overflow-y-auto px-4 pb-8 pt-20 md:p-10">
        <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-5 shadow-md md:p-10">

          <h1 className="text-3xl font-bold md:text-5xl">
            {page.heading}
          </h1>

          <p className="mt-4 text-base leading-7 text-gray-600 md:mt-5 md:text-lg md:leading-8">
            {page.description}
          </p>

          <div className="mt-8 md:mt-12">
            {page.sections.map((section) => (
              <div
                key={section._id}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold md:text-3xl">
                  {section.point}. {section.title}
                </h2>

                <p className="mt-3 text-gray-600 leading-7 md:mt-4 md:leading-8">
                  {section.description}
                </p>

                <ul className="mt-4 list-disc space-y-3 pl-5 md:mt-5 md:pl-6">
                  {section.content.map((item, index) => (
                   <li
  key={index}
  className="text-gray-700 leading-7 md:leading-8"
>
  {item}
</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <hr className="my-10" />

         <h3 className="text-xl font-semibold md:text-2xl">
            Contact Information
          </h3>

          <p className="mt-4">
            {page.footerText.text}
          </p>

          <p className="mt-2">
            <strong>Email:</strong>{" "}
            {page.footerText.email}
          </p>

          <p className="mt-2">
            <strong>Phone:</strong>{" "}
            {page.footerText.phone}
          </p>

          <div className="mt-8 text-sm text-gray-500">
            <p>
              Version: {page.version}
            </p>

            <p>
              Last Updated:{" "}
              {new Date(
                page.lastUpdated
              ).toLocaleDateString()}
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function ViewAboutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewAboutContent />
    </Suspense>
  );
}