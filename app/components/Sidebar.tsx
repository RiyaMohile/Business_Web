"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Shield,
  Wallet,
  ShieldCheck,
  FolderTree,
  BarChart3,
  Menu,
  X,
  Store as StoreIcon,
  CreditCard,
  Landmark,
  RotateCcw,
} from "lucide-react";

import api from "../services/businessApi";

// =====================================================
// TYPES
// =====================================================

interface UserType {
  _id: string;
  username: string;
  isAdmin: boolean;
}

interface AdminPermissions {
  store: boolean;
  wallet: boolean;
  verification: boolean;
  report: boolean;
  management: boolean;
}

interface AdminType {
  isSuperAdmin: boolean;
  permissions: AdminPermissions;
  managedStoreIds: string[];
  status: string;
}

// =====================================================
// SIDEBAR
// =====================================================

export default function Sidebar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [admin, setAdmin] =
    useState<AdminType | null>(null);

  const [isAdminUser, setIsAdminUser] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // FETCH CURRENT USER + ADMIN ACCESS
  // =====================================================

  useEffect(() => {
    const fetchSidebarData = async () => {
      console.log(
        "========== SIDEBAR START =========="
      );

      try {
        setLoading(true);

        // =================================================
        // 1. GET USER FROM LOCAL STORAGE
        // =================================================

        const storedUser =
          localStorage.getItem("user");

        console.log(
          "1. Stored User:",
          storedUser
        );

        if (!storedUser) {
          console.log(
            "2. No user found in localStorage"
          );

          setIsAdminUser(false);
          return;
        }

        const user: UserType =
          JSON.parse(storedUser);

        console.log(
          "2. Parsed User:",
          user
        );

        console.log(
          "3. User isAdmin:",
          user.isAdmin
        );

        // =================================================
        // 2. CHECK USER.isAdmin
        // =================================================

        if (!user.isAdmin) {
          console.log(
            "4. User is NOT admin"
          );

          setIsAdminUser(false);
          return;
        }

        console.log(
          "4. User IS admin"
        );

        setIsAdminUser(true);

        // =================================================
        // 3. GET THOVER ADMIN ACCESS
        // =================================================

        console.log(
          "5. Calling /thover-admin/my-access"
        );

        const response = await api.get(
          "https://api.thover.in/v1/api/thover-admin/my-access"
        );

        

        console.log(
          "6. Admin Access Response:",
          response.data
        );

        const adminData =
          response.data?.admin;

        console.log(
          "7. Admin Data:",
          adminData
        );

        console.log(
          "8. isSuperAdmin:",
          adminData?.isSuperAdmin
        );

        console.log(
          "9. Permissions:",
          adminData?.permissions
        );

        setAdmin(adminData || null);

        console.log(
          "========== SIDEBAR SUCCESS =========="
        );
      } catch (error: any) {
        console.log(
          "========== SIDEBAR ERROR =========="
        );

        console.log(
          "Error:",
          error
        );

        console.log(
          "Error Response:",
          error.response?.data
        );

        console.log(
          "Error Status:",
          error.response?.status
        );

        setAdmin(null);
      } finally {
        setLoading(false);

        console.log(
          "========== SIDEBAR END =========="
        );
      }
    };

    fetchSidebarData();
  }, []);

  // =====================================================
  // CLOSE MOBILE MENU AFTER ROUTE CHANGE
  // =====================================================

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // =====================================================
  // ACTIVE URL
  // =====================================================

  const isActive = (href: string) => {
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  // =====================================================
  // MENU LINK
  // =====================================================

  const MenuLink = ({
    href,
    title,
    icon: Icon,
  }: {
    href: string;
    title: string;
    icon: any;
  }) => {
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-6 py-4 transition ${
          isActive(href)
            ? "bg-blue-700 text-white"
            : "text-gray-700 hover:bg-blue-50"
        }`}
      >
        <Icon size={20} />

        <span>{title}</span>
      </Link>
    );
  };

  // =====================================================
  // SIDEBAR MENU
  // =====================================================

  const SidebarMenu = () => {
    // User is not admin
    if (!isAdminUser) {
      return null;
    }

    // Still loading admin access
    if (loading) {
      return (
        <div className="px-6 py-4 text-sm text-gray-500">
          Loading...
        </div>
      );
    }

    // Admin record not found
    if (!admin) {
      return (
        <div className="px-6 py-4 text-sm text-red-500">
          Admin access not found
        </div>
      );
    }

    console.log(
      "SIDEBAR RENDER ADMIN:",
      admin
    );

    console.log(
      "SIDEBAR SUPER ADMIN:",
      admin.isSuperAdmin
    );

    return (
      <>
        {/* ================================================= */}
        {/* STORE MANAGEMENT */}
        {/* ================================================= */}

        {(admin.isSuperAdmin ||
          admin.permissions?.store) && (
          <MenuLink
            href="/adminAccess/stores"
            title="Store Management"
            icon={StoreIcon}
          />
        )}

        {/* ================================================= */}
        {/* WALLET */}
        {/* ================================================= */}

        {(admin.isSuperAdmin ||
          admin.permissions?.wallet) && (
          <MenuLink
            href="/wallets"
            title="Wallet"
            icon={Wallet}
          />
        )}

        {/* ================================================= */}
        {/* VERIFICATION */}
        {/* ================================================= */}

        {(admin.isSuperAdmin ||
          admin.permissions?.verification) && (
          <MenuLink
            href="/verifications"
            title="Verification"
            icon={ShieldCheck}
          />
        )}

        {/* ================================================= */}
        {/* REPORTS */}
        {/* ================================================= */}

        {(admin.isSuperAdmin ||
          admin.permissions?.report) && (
          <MenuLink
            href="/reports"
            title="Reports"
            icon={BarChart3}
          />
        )}

        {/* ================================================= */}
        {/* MANAGEMENT */}
        {/* ================================================= */}

        {(admin.isSuperAdmin ||
          admin.permissions?.management) && (
          <MenuLink
            href="/adminAccess/management"
            title="Management"
            icon={FolderTree}
          />
        )}

        {/* ================================================= */}
{/* PLAN / SUBSCRIPTION - ONLY SUPER ADMIN */}
{/* ================================================= */}

{admin.isSuperAdmin && (
  <MenuLink
    href="/adminAccess/plans"
    title="Plan / Subscription"
    icon={CreditCard}
  />
)}

        {/* ================================================= */}
        {/* ADMINS - ONLY SUPER ADMIN */}
        {/* ================================================= */}

        {admin.isSuperAdmin && (
          <MenuLink
            href="/admins"
            title="Admins"
            icon={Shield}
          />
        )}

        
{/* WITHDRAWALS - ONLY SUPER ADMIN */}

{admin.isSuperAdmin && (
  <MenuLink
    href="/withdrawals"
    title="Withdrawals"
    icon={Landmark}
  />
)}

{/* REFUNDS - ONLY SUPER ADMIN */}
{admin.isSuperAdmin && (
  <MenuLink
    href="/refunds"
    title="Refunds"
    icon={RotateCcw}
  />
)}

      </>
    );
  };

  // =====================================================
  // IF USER IS NOT ADMIN
  // =====================================================

  if (!loading && !isAdminUser) {
    return null;
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <>
      {/* ================================================= */}
      {/* MOBILE TOP BAR */}
      {/* ================================================= */}

      <div className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm md:hidden">
        <div className="text-xl font-bold text-blue-700">
          Thover Admin
        </div>

        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              (prev) => !prev
            )
          }
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
        >
          {mobileOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* ================================================= */}
      {/* MOBILE SIDEBAR */}
      {/* ================================================= */}

      {mobileOpen && (
        <div className="fixed left-0 top-16 z-40 w-full border-b border-gray-200 bg-white shadow-lg md:hidden">
          <nav className="max-h-[calc(100vh-4rem)] overflow-y-auto py-2">
            <SidebarMenu />
          </nav>
        </div>
      )}

      {/* ================================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ================================================= */}

      <aside className="fixed left-0 top-0 hidden h-screen w-72 overflow-y-auto bg-white shadow-lg md:block">

        {/* LOGO */}

        <div className="border-b border-gray-200 p-6 text-3xl font-bold text-blue-700">
          Thover Admin
        </div>

        {/* NAVIGATION */}

        <nav className="mt-6">
          <SidebarMenu />
        </nav>
      </aside>
    </>
  );
}