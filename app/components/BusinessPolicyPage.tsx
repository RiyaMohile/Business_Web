"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
  ClipboardCheck,
  CalendarDays,
  ChevronDown,
  Info,
  Mail,
} from "lucide-react";
import axios from "axios";

const BASE_URL = "https://api.thover.in/v1/api";

interface Section {
  _id?: string;
  point: number;
  title: string;
  description?: string;
  content?: string[];
}

interface PolicyData {
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

interface BusinessPolicyPageProps {
  pageName: string;
}

export default function BusinessPolicyPage({
  pageName,
}: BusinessPolicyPageProps) {
  const router = useRouter();

  const [page, setPage] = useState<PolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState<number | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${BASE_URL}/about/page/${pageName}`
        );

        if (response.data?.success) {
          setPage(response.data.data);
        }
      } catch (error) {
        console.error("GET POLICY PAGE ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [pageName]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading...
        </p>
      </main>
    );
  }

  if (!page) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-red-500">
          Page not found.
        </p>
      </main>
    );
  }

  const isReturnPolicy =
    pageName === "return-refund-policy";

  const isTerms =
    pageName === "business-terms";

  const formattedDate = new Date(
    page.lastUpdated
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
            >
              <ArrowLeft size={28} />
            </button>

            <h1 className="text-xl font-semibold">
              {page.heading}
            </h1>

          </div>

          <ShieldCheck size={36} />

        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-7xl px-5 py-5">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">

          {/* INTRO */}
          <div className="flex flex-col gap-6 md:flex-row">

            <div className="flex h-25 w-25 shrink-0 items-center justify-center self-center rounded-full bg-blue-50 md:self-start">

              {isReturnPolicy ? (
                <RotateCcw
                  size={50}
                  className="text-blue-600"
                />
              ) : isTerms ? (
                <ClipboardCheck
                  size={50}
                  className="text-blue-600"
                />
              ) : (
                <ShieldCheck
                  size={50}
                  className="text-blue-600"
                />
              )}

            </div>

            <div className="flex-1">

              <h2 className="text-3xl font-bold text-slate-900">
                {page.heading}
              </h2>

              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                {page.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">

                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2 text-sm text-slate-700">
                  <CalendarDays
                    size={18}
                    className="text-blue-600"
                  />
                  Version {page.version}
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2 text-sm text-slate-700">
                  <CalendarDays
                    size={18}
                    className="text-blue-600"
                  />
                  Last Updated: {formattedDate}
                </div>

              </div>

            </div>

          </div>

          <div className="my-6 border-t" />

          {/* SECTION TITLE */}
          <h3 className="mb-4 text-2xl font-bold text-slate-900">
            {isTerms ? "Terms Sections" : "Policy Sections"}
          </h3>

          {/* SECTIONS */}
          <div className="space-y-2">

            {page.sections
              .slice()
              .sort((a, b) => a.point - b.point)
              .map((section, index) => {

                const isOpen =
                  openSection === index;

                return (
                  <div
                    key={
                      section._id ||
                      section.point
                    }
                    className="overflow-hidden rounded-xl border border-slate-200"
                  >

                    <button
                      type="button"
                      onClick={() =>
                        setOpenSection(
                          isOpen ? null : index
                        )
                      }
                      className="flex w-full items-center gap-4 px-4 py-4 text-left hover:bg-slate-50"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-semibold text-blue-600">
                        {section.point}
                      </div>

                      <div className="flex-1">

                        <p className="text-sm font-semibold text-slate-900">
                          {section.title}
                        </p>

                        {section.description && (
                          <p className="mt-1 text-sm text-slate-500">
                            {section.description}
                          </p>
                        )}

                      </div>

                      <ChevronDown
                        size={20}
                        className={
                          isOpen
                            ? "rotate-180 transition-transform"
                            : "transition-transform"
                        }
                      />

                    </button>

                    {isOpen && (
                      <div className="border-t bg-slate-50/50 px-5 py-4">

                        {section.content &&
                          section.content.map(
                            (item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="mb-3 flex gap-3 text-sm leading-6 text-slate-600"
                              >

                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />

                                <p>{item}</p>

                              </div>
                            )
                          )}

                      </div>
                    )}

                  </div>
                );
              })}

          </div>

          {/* SUPPORT */}
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

            <div className="flex gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                <Info size={20} />
              </div>

              <div className="flex-1">

                <p className="text-sm font-semibold leading-6 text-slate-900">
                  {page.footerText?.text ||
                    "For questions regarding this policy, please contact the Thover support team."}
                </p>

                {page.footerText?.email && (
                  <div className="mt-3">

                    <p className="text-xs text-slate-500">
                      Email
                    </p>

                    <div className="mt-1 flex items-center gap-2">

                      <Mail
                        size={18}
                        className="text-blue-600"
                      />

                      <a
                        href={`mailto:${page.footerText.email}`}
                        className="text-sm font-semibold text-blue-600 no-underline"
                      >
                        {page.footerText.email}
                      </a>

                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="pb-5 text-center">

        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Thover. All rights reserved.
        </p>

      </footer>

    </main>
  );
}