
import type { Metadata } from "next";
import ReturnRefundPolicy from "./ReturnRefundPolicyClient";

export const metadata: Metadata = {
  title: "Return, Refund & Exchange Policy | Thover",

  description:
    "Read Thover's Return, Refund and Exchange Policy to understand return eligibility, refund conditions, exchange rules, and customer support guidelines.",

  alternates: {
    canonical:
      "https://thover.in/return-refund-exchange-policy",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "article",
    title: "Return, Refund & Exchange Policy | Thover",
    description:
      "Learn about Thover's return, refund and exchange conditions and customer support guidelines.",
    url: "https://thover.in/return-refund-exchange-policy",
    siteName: "Thover",
  },

  twitter: {
    card: "summary",
    title: "Return, Refund & Exchange Policy | Thover",
    description:
      "Read Thover's return, refund and exchange policy.",
  },
};

export default function Page() {
  return <ReturnRefundPolicy />;
}
