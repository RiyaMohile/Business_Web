"use client";

import OtpForm from "../components/auth/OtpForm";
import DesktopDashboard from "../components/dashboard/DesktopDashboard";

export default function OtpPage() {
  return (
    <>
      {/* ================= MOBILE ================= */}

      <div className="block md:hidden">
        <OtpForm />
      </div>


      {/* ================= DESKTOP ================= */}

      <div className="hidden md:block">
        <DesktopDashboard />
      </div>
    </>
  );
}