"use client";

import RegisterForm from "../components/auth/RegisterForm";
import DesktopDashboard from "../components/dashboard/DesktopDashboard";

export default function RegisterPage() {
  return (
    <>
      {/* MOBILE */}
      <div className="block md:hidden">
        <RegisterForm />
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <DesktopDashboard />
      </div>
    </>
  );
}