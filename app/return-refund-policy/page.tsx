
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Section {
  _id: string;
  point: number;
  title: string;
  description?: string;
  content: string[];
}

interface PageData {
  _id: string;
  name: string;
  heading: string;
  description: string;
  version: string;
  sections: Section[];
  footerText?: {
    text?: string;
    email?: string;
    phone?: string;
  };
  lastUpdated: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.thover.in/v1/api";

export default function ReturnRefundPolicy() {
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/about/page/return-refund-policy`
        );

        if (data?.success && data?.data) {
          setPage(data.data);
        } else {
          setPage(null);
        }
      } catch (error) {
        console.error("GET RETURN/REFUND POLICY ERROR:", error);
        setPage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 transition-colors duration-300 dark:bg-black">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#6D28D9] border-t-transparent" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Loading Return, Refund & Exchange Policy...
          </p>
        </div>
      </main>
    );
  }

  if (!page) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 transition-colors duration-300 dark:bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-500">
            Return, Refund & Exchange Policy not found
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Unable to load the policy. Please try again later.
          </p>
        </div>
      </main>
    );
  }

  const formattedDate = page.lastUpdated
    ? new Date(page.lastUpdated).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  return (
    <main className="min-h-screen bg-white transition-colors duration-300 dark:bg-black">
      <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8 lg:px-10">
        {/* HEADER */}
        <header className="mb-14">
          <h1 className="text-center text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            {page.heading}
          </h1>

          <p className="mx-auto mt-5 max-w-4xl text-center text-lg leading-8 text-gray-600 dark:text-gray-400">
            {page.description}
          </p>

          <div className="mt-12 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong className="text-gray-800 dark:text-gray-200">
                Version:
              </strong>{" "}
              {page.version}
            </p>

            <p className="mt-2">
              <strong className="text-gray-800 dark:text-gray-200">
                Last Updated:
              </strong>{" "}
              {formattedDate}
            </p>
          </div>
        </header>

        {/* POLICY SECTIONS */}
        <div className="space-y-12">
          {[...(page.sections || [])]
            .sort((a, b) => a.point - b.point)
            .map((section) => (
              <section
                key={section._id || section.point}
                className="border-b border-gray-200 pb-10 last:border-b-0 dark:border-gray-800"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                  {section.point}. {section.title}
                </h2>

                {section.description && (
                  <p className="mt-2 text-base font-medium text-[#6D28D9] dark:text-purple-400">
                    {section.description}
                  </p>
                )}

                <ul className="mt-6 list-disc space-y-3 pl-6">
                  {(section.content || []).map((item, index) => (
                    <li
                      key={index}
                      className="whitespace-pre-line text-gray-700 leading-8 dark:text-gray-300"
                    >
                      {item.replace(/^\s*•\s*/, "")}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </div>

        {/* CONTACT INFORMATION */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Contact Information
          </h2>

          {page.footerText?.text && (
            <p className="mt-5 leading-8 text-gray-700 dark:text-gray-300">
              {page.footerText.text}
            </p>
          )}

          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-100 p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white">
              Thover Support Team
            </p>

            {page.footerText?.email && (
              <p className="mt-3 break-words text-gray-700 dark:text-gray-300">
                <strong className="text-gray-900 dark:text-gray-200">
                  Email:
                </strong>{" "}
                <a
                  href={`mailto:${page.footerText.email}`}
                  className="text-[#6D28D9] hover:underline dark:text-purple-400"
                >
                  {page.footerText.email}
                </a>
              </p>
            )}

            {page.footerText?.phone && (
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                <strong className="text-gray-900 dark:text-gray-200">
                  Phone:
                </strong>{" "}
                {page.footerText.phone}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
