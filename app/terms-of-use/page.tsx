
import type { Metadata } from "next";
import TermsOfUseClient from "./TermsOfUseClient";

export const metadata: Metadata = {
  title: "Terms of Use | Thover",

  description:
    "Read Thover's Terms of Use to understand user responsibilities, account security, platform guidelines, and conditions for using our hyperlocal marketplace.",

  alternates: {
    canonical: "https://thover.in/terms-of-use",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "article",
    title: "Terms of Use | Thover",
    description:
      "Read the terms and conditions for using the Thover platform.",
    url: "https://thover.in/terms-of-use",
    siteName: "Thover",
  },
};

export default function Page() {
  return <TermsOfUseClient />;
}
