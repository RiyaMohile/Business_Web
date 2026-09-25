"use client";

import LoginForm from "../components/auth/LoginForm";
import DesktopDashboard from "../components/dashboard/DesktopDashboard";

export default function LoginPage() {
  return (
    <>
      {/* MOBILE */}
      <div className="block md:hidden">
        <LoginForm />
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <DesktopDashboard />
      </div>
    </>
  );
}