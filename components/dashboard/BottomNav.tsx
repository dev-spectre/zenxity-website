"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { navigationItems } from "./SidebarNav";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // For mobile, we show the top 4 links to make space for a 'More' menu.
  const mainNavItems = navigationItems.slice(0, 4);
  const moreNavItems = navigationItems.slice(4);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border grid grid-cols-5 justify-items-center items-center z-50 h-16 px-2 pb-safe shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.1)]">
      {mainNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full py-2 space-y-0.5 transition-colors duration-200 ${
              isActive ? "text-primary font-semibold" : "text-muted-foreground"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
            <span className="text-[9px] max-w-full px-0.5 text-center leading-none truncate">{mounted ? t(item.label) : ""}</span>
          </Link>
        );
      })}

      {/* More Options Menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="flex flex-col items-center justify-center w-full h-full py-2 space-y-0.5 transition-colors duration-200 text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
            <span className="text-[9px] max-w-full px-0.5 text-center leading-none truncate">{mounted ? t("More") : ""}</span>
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-3xl px-4 pb-8 pt-6">
          <SheetHeader className="mb-4 text-left px-2">
            <SheetTitle className="text-xl font-bold">{mounted ? t("More Options") : ""}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2">
            {moreNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors ${
                    isActive ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-base">{mounted ? t(item.label) : ""}</span>
                </Link>
              );
            })}
            <div className="h-px bg-border my-2 mx-2" />
            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors text-red-600 hover:bg-red-50 text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-base font-medium">{mounted ? t("Logout") : ""}</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
