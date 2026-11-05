
import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800", "900"],
});



export const metadata: Metadata = {
  metadataBase: new URL("https://thover.in"),

  title: {
    default: "Thover – Shop Local Products & Discover Nearby Stores",
    template: "%s | Thover",
  },

  description:
    "Discover local stores, shop products, and explore nearby businesses with Thover. Shop local and support local businesses.",

  applicationName: "Thover",

  alternates: {
    canonical: "https://thover.in/",
  },

  openGraph: {
    type: "website",
    url: "https://thover.in/",
    siteName: "Thover",
    title: "Thover – Shop Local Products & Discover Nearby Stores",
    description:
      "Discover local stores, shop products, and explore nearby businesses with Thover.",
    images: [{ url: "/logo.png", alt: "Thover – Shop Local" }],
  },

  twitter: {
    card: "summary",
    title: "Thover – Shop Local Products",
    description:
      "Discover local stores and products with Thover.",
    images: ["/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} font-sans  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
