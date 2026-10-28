"use client";

import Link from "next/link";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

interface AboutPageType {
  _id: string;
  name: string;
  heading: string;
}

export default function AboutPage() {
  const [pages, setPages] = useState<AboutPageType[]>([]);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        "https://api.thover.in/v1/api/about",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPages(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar />

      <main className="ml-0 flex-1 overflow-y-auto pt-16 md:ml-72 md:pt-0">

        <div className="mx-auto max-w-6xl px-4 pb-8 pt-6 md:p-10">

          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">

            <div>

              <h1 className="text-3xl font-bold md:text-4xl">
                About Pages
              </h1>

              <p className="mt-2 text-gray-500">
                Manage Privacy Policy, Terms of Use and About Us.
              </p>

            </div>

            <Link
              href="/about/add"
              className="w-full rounded-xl bg-blue-600 px-6 py-3 text-center text-white hover:bg-blue-700 md:w-auto"
            >
              + Create Page
            </Link>

          </div>

          {/* Pages */}
          <div className="mt-8 space-y-4 md:mt-10 md:space-y-6">

            {pages.map((page) => (

              <div
                key={page._id}
                className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-md md:flex-row md:items-center md:justify-between md:p-6"
              >

                <div className="min-w-0">

                  <h2 className="break-words text-xl font-semibold md:text-2xl">
                    {page.heading}
                  </h2>

                  <p className="mt-1 break-words text-gray-500">
                    {page.name}
                  </p>

                </div>

                <div className="flex w-full gap-3 md:w-auto">

                  <Link
                    href={`/about/view?id=${page._id}`}
                    className="flex-1 rounded-lg bg-blue-600 px-5 py-2 text-center text-white md:flex-none"
                  >
                    View
                  </Link>

                  <Link
                    href={`/about/view/edit?id=${page._id}`}
                    className="flex-1 rounded-lg bg-green-600 px-5 py-2 text-center text-white md:flex-none"
                  >
                    Edit
                  </Link>

                </div>

              </div>

            ))}

          </div>

        </div>

      </main>

    </div>
  );
}