import type { Metadata } from "next";
import DesktopDashboard from "../components/dashboard/DesktopDashboard";

export const metadata: Metadata = {
  title: "Dashboard – Thover Marketplace",

  description:
    "Manage your Thover Marketplace experience and discover local products, businesses, and services.",
};

export default function DashboardPage() {
  return <DesktopDashboard />;
}