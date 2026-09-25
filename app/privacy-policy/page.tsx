"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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

export default function PrivacyPolicy() {
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    try {
      const { data } = await axios.get(
        "https://api.thover.in/v1/api/about/page/privacy-policy"
      );

      setPage(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Sections where content should be displayed
   * as bullet points.
   */
  const bulletSections = [
    3,  // How We Use Your Information
    4,  // Information Sharing
    6,  // Notifications
    8,  // Data Retention
    9,  // Your Rights
    11, // Third-Party Services
    13, // Account Deletion
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#6D28D9] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Loading Privacy Policy...
          </p>
        </div>
      </main>
    );
  }

  if (!page) {
    return (
      <main className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Privacy Policy not found
          </h2>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Unable to load the Privacy Policy at this time.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14">

        {/* Header */}
        {/* Header */}
<div className="mb-14">

  {/* Title - Center */}
  <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 dark:text-white">
    {page.heading}
  </h1>

  {/* Description - Center */}
  <p className="mt-5 max-w-4xl mx-auto text-center text-lg leading-8 text-gray-600 dark:text-gray-400">
    {page.description}
  </p>

  {/* Version & Last Updated - Left */}
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
      {new Date(page.lastUpdated).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }
      )}
    </p>

  </div>

</div>

        {/* Privacy Policy Sections */}
        <div className="space-y-12">

          {page.sections.map((section) => {

            const isBulletSection = bulletSections.includes(
              section.point
            );

            return (
              <section
                key={section._id}
                className="border-b border-gray-200 dark:border-gray-800 pb-10 last:border-b-0"
              >

                {/* Section Heading */}
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {section.point}. {section.title}
                </h2>

                {/* Section Description */}
                {section.description && (
                  <p className="mt-2 text-base font-medium text-[#6D28D9] dark:text-purple-400">
                    {section.description}
                  </p>
                )}

                {/* Content */}
                <div className="mt-6">

                  {isBulletSection ? (

                    /*
                     * Bullet-style sections
                     */
                    <ul className="list-disc pl-6 space-y-3">
                      {section.content.map((item, index) => (
                        <li
                          key={index}
                          className="text-gray-700 dark:text-gray-300 leading-8"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>

                  ) : (

                    /*
                     * Paragraph-style sections
                     */
                    <div className="space-y-5">
                      {section.content.map((item, index) => (
                        <p
                          key={index}
                          className="text-gray-700 dark:text-gray-300 leading-8"
                        >
                          {item}
                        </p>
                      ))}
                    </div>

                  )}

                </div>

              </section>
            );
          })}

        </div>

        {/* Contact Information */}
        <section className="mt-12">

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Contact Information
          </h2>

          <p className="mt-5 text-gray-700 dark:text-gray-300 leading-8">
            {page.footerText.text}
          </p>

          <div className="mt-6 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">

            <p className="font-semibold text-gray-900 dark:text-white">
              Thover Support Team
            </p>

            <p className="mt-3 text-gray-700 dark:text-gray-300">
              <strong>Email:</strong>{" "}
              {page.footerText.email}
            </p>

            {/* <p className="mt-2 text-gray-700 dark:text-gray-300">
              <strong>Phone:</strong>{" "}
              {page.footerText.phone}
            </p> */}

          </div>

        </section>

      </div>
    </main>
  );
}