"use client";

import CustomerLandingPage from "./CustomerLandingPage";
import DesktopDashboard from "./dashboard/DesktopDashboard";

export default function ResponsiveHome() {
  return (
    <>
      {/* MOBILE */}
      <div className="block md:hidden">
        <CustomerLandingPage />
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <DesktopDashboard />
      </div>
    </>
  );
}