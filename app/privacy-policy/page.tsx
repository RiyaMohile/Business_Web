
import type { Metadata } from "next";
import PrivacyPolicy from "./PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Thover",

  description:
    "Read Thover's Privacy Policy to understand how we collect, use, store, and protect your personal information when you use our hyperlocal marketplace.",

  alternates: {
    canonical: "https://thover.in/privacy-policy",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "article",
    title: "Privacy Policy | Thover",
    description:
      "Learn how Thover collects, uses, and protects your personal information.",
    url: "https://thover.in/privacy-policy",
    siteName: "Thover",
  },

  twitter: {
    card: "summary",
    title: "Privacy Policy | Thover",
    description:
      "Learn how Thover handles and protects your personal information.",
  },
};

export default function Page() {
  return <PrivacyPolicy />;
}
