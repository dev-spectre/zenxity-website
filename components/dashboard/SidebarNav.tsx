"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  LayoutDashboard,
  Map,
  ClipboardList,
  IndianRupee,
  Activity,
  Phone,
  User,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export const navigationItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/land", icon: Map, label: "My Land" },
  { href: "/dashboard/projects", icon: ClipboardList, label: "Projects" },
  { href: "/dashboard/earnings", icon: IndianRupee, label: "Earnings" },
  { href: "/dashboard/updates", icon: Activity, label: "Live Updates" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/dashboard/support", icon: Phone, label: "Support" },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-border h-full sticky top-0">
      <div className="h-16 flex items-center border-b border-border px-6">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
          <img src="/logo-transparent.png" alt="Zenxity" className="w-10 h-10" />
          <span className="font-bold text-primary">Zenxity</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left transition ${
                isActive
                  ? "bg-secondary text-primary border-r-4 border-primary"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{mounted ? t(item.label) : ""}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-5 h-5" />
          <span>{mounted ? t("Logout") : ""}</span>
        </Button>
      </div>
    </aside>
  );
}
