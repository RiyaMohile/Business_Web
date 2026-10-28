"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Shield,
  Wallet,
  FileText,
  MessageCircle,
  ShieldCheck,
  FolderTree,
  BarChart3,
  Landmark,
  Store as StoreIcon,
} from "lucide-react";

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

interface Props {
  admin: AdminType | null;
  loading: boolean;
}

export default function SidebarMenu({
  admin,
  loading,
}: Props) {
  const pathname = usePathname();

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="px-6 py-4 text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  // ==========================================
  // ADMIN NOT FOUND
  // ==========================================

  if (!admin) {
    return null;
  }

  // ==========================================
  // ACTIVE MENU
  // ==========================================

  const isActive = (href: string) => {
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  // ==========================================
  // COMMON MENU LINK
  // ==========================================

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

  // ==========================================
  // SUPER ADMIN
  // ==========================================

  if (admin.isSuperAdmin) {
    return (
      <>
        <MenuLink
          href="/admins"
          title="Admins"
          icon={Shield}
        />

        <MenuLink
          href="/stores"
          title="Store Management"
          icon={StoreIcon}
        />

        <MenuLink
          href="/wallets"
          title="Wallets"
          icon={Wallet}
        />

        <MenuLink
          href="/posts"
          title="Posts"
          icon={FileText}
        />

        <MenuLink
          href="/vibes"
          title="Vibes"
          icon={MessageCircle}
        />

        <MenuLink
          href="/verifications"
          title="Verifications"
          icon={ShieldCheck}
        />

        <MenuLink
          href="/categories"
          title="Categories"
          icon={FolderTree}
        />

        <MenuLink
          href="/withdrawals"
          title="Withdrawals"
          icon={Landmark}
        />

        <MenuLink
          href="/reports/store-onboarding"
          title="Store Reports"
          icon={BarChart3}
        />

        <MenuLink
          href="/about"
          title="Pages"
          icon={FileText}
        />
      </>
    );
  }

  // ==========================================
  // NORMAL ADMIN
  // ONLY 5 PERMISSION BASED MENUS
  // ==========================================

  return (
    <>
      {/* STORE MANAGEMENT */}

      {admin.permissions.store && (
        <MenuLink
          href="/stores"
          title="Store Management"
          icon={StoreIcon}
        />
      )}

      {/* WALLET */}

      {admin.permissions.wallet && (
        <MenuLink
          href="/wallets"
          title="Wallet"
          icon={Wallet}
        />
      )}

      {/* VERIFICATION */}

      {admin.permissions.verification && (
        <MenuLink
          href="/verifications"
          title="Verification"
          icon={ShieldCheck}
        />
      )}

      {/* REPORT */}

      {admin.permissions.report && (
        <MenuLink
          href="/reports"
          title="Reports"
          icon={BarChart3}
        />
      )}

      {/* MANAGEMENT */}

      {admin.permissions.management && (
        <MenuLink
          href="/management"
          title="Management"
          icon={FolderTree}
        />
      )}
    </>
  );
}