"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Info,
  Mail,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";

const BASE_URL = "https://api.thover.in/v1/api";

// These slugs must match the values accepted by your backend route:
// GET /about/page/:pageName
const POLICY_SLUGS = [
  "business-return-policy",
  "business-refund-policy",
  "business-exchange-policy",
] as const;

interface Section {
  _id?: string;
  point: number;
  title: string;
  description?: string;
  content?: string[];
}

interface PolicyData {
  _id?: string;
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

export default function BusinessPolicyPages() {
  const router = useRouter();

  const [pages, setPages] = useState<PolicyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    let isMounted = true;

    const fetchPolicies = async () => {
      try {
        setLoading(true);
        setError("");

        const results = await Promise.allSettled(
          POLICY_SLUGS.map((slug) =>
            axios.get(`${BASE_URL}/about/page/${encodeURIComponent(slug)}`)
          )
        );

        const fetchedPages = results.flatMap((result) => {
          if (
            result.status === "fulfilled" &&
            result.value.data?.success &&
            result.value.data?.data
          ) {
            return [result.value.data.data as PolicyData];
          }

          if (result.status === "rejected") {
            console.error("Failed to fetch a business policy:", result.reason);
          }

          return [];
        });

        if (isMounted) {
          setPages(fetchedPages);

          if (fetchedPages.length === 0) {
            setError(
              "Policies could not be loaded. Please check the policy API slugs and try again."
            );
          } else if (fetchedPages.length < POLICY_SLUGS.length) {
            setError(
              "Some policies could not be loaded. Please verify the policy API slugs."
            );
          }
        }
      } catch (fetchError) {
        console.error("GET BUSINESS POLICIES ERROR:", fetchError);
        if (isMounted) {
          setError("Unable to load policies. Please try again later.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPolicies();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateValue?: string) => {
    if (!dateValue) return "Not available";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "Not available";

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
            >
              <ArrowLeft size={24} />
            </button>

            <div>
              <h1 className="text-xl font-semibold sm:text-2xl">
                Business Policies
              </h1>
              <p className="mt-1 text-sm text-blue-100">
                Return, refund and exchange policies
              </p>
            </div>
          </div>

          <ShieldCheck size={32} className="shrink-0" />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-8">
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            Loading business policies...
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
          >
            {error}
          </div>
        )}

        {!loading && pages.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              No policies available
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Please check the backend page names and API response.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {pages.map((page, pageIndex) => (
            <section
              key={page._id || page.name || POLICY_SLUGS[pageIndex]}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7"
            >
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center self-start rounded-2xl bg-blue-50 text-blue-600">
                  <ShieldCheck size={34} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {page.heading}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {page.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      <CalendarDays size={17} className="text-blue-600" />
                      Version {page.version || "N/A"}
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      <CalendarDays size={17} className="text-blue-600" />
                      Updated: {formatDate(page.lastUpdated)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-6 border-t border-slate-200" />

              <h3 className="mb-4 text-xl font-bold text-slate-900">
                Policy Sections
              </h3>

              <div className="space-y-2">
                {(page.sections || [])
                  .slice()
                  .sort((a, b) => a.point - b.point)
                  .map((section, sectionIndex) => {
                    const sectionKey = `${
                      page._id || page.name || pageIndex
                    }-${section._id || section.point}-${sectionIndex}`;
                    const isOpen = Boolean(openSections[sectionKey]);

                    return (
                      <div
                        key={section._id || sectionKey}
                        className="overflow-hidden rounded-xl border border-slate-200"
                      >
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() =>
                            setOpenSections((previous) => ({
                              ...previous,
                              [sectionKey]: !previous[sectionKey],
                            }))
                          }
                          className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-slate-50"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-600">
                            {section.point}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-slate-900">
                              {section.title}
                            </span>
                            {section.description && (
                              <span className="mt-1 block text-sm text-slate-500">
                                {section.description}
                              </span>
                            )}
                          </span>

                          <ChevronDown
                            size={20}
                            className={`shrink-0 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="border-t border-slate-200 bg-slate-50/50 px-5 py-4">
                            {(section.content || []).map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="mb-3 flex gap-3 text-sm leading-6 text-slate-600 last:mb-0"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                                <p className="whitespace-pre-line">{item}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {(page.footerText?.text || page.footerText?.email) && (
                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <Info
                      size={20}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div className="min-w-0 flex-1">
                      {page.footerText?.text && (
                        <p className="text-sm font-semibold leading-6 text-slate-900">
                          {page.footerText.text}
                        </p>
                      )}

                      {page.footerText?.email && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                          <Mail size={17} className="text-blue-600" />
                          <a
                            href={`mailto:${page.footerText.email}`}
                            className="font-semibold text-blue-600 hover:underline"
                          >
                            {page.footerText.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      <footer className="px-4 pb-5 text-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Thover. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
