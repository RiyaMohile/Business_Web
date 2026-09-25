import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Thover",
    template: "%s | Thover",
  },

  description:
    "Thover is a hyperlocal marketplace platform that helps users discover nearby businesses, products, services, and shopping experiences.",

  keywords: [
    "hyperlocal marketplace",
    "Thover marketplace",
    "local marketplace",
    "hyperlocal shopping",
    "local sellers",
    "shop local",
    "products near you",
    "local businesses",
  ],  

  icons: {
    icon: "/icon.png",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
