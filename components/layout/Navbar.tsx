"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User, LogOut, ChevronDown, LayoutDashboard, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;

      setIsScrolled(scrollTop > 50);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    return null;
  }

  const isHomePage = pathname === "/";

  const navLinks = [
    { key: "features", label: t("Features"), href: isHomePage ? "#features" : "/#features" },
    { key: "how", label: t("How It Works"), href: isHomePage ? "#how-it-works" : "/#how-it-works" },
    { key: "partner", label: t("Partner"), href: isHomePage ? "#partner" : "/#partner" },
    { key: "about", label: t("About Us"), href: isHomePage ? "#about" : "/#about" },
    { key: "contact", label: t("Contact"), href: isHomePage ? "#contact" : "/#contact" },
  ];

  return (
    <nav
      className={cn(
        "z-50 transition-all duration-500 w-full",
        isHomePage
          ? cn(
            "fixed top-0 left-0 right-0 md:backdrop-blur-md",
            isScrolled || isMenuOpen ? "bg-white text-foreground shadow-md" : "bg-transparent text-white"
          )
          : "sticky top-0 bg-white text-foreground shadow-sm border-b border-border"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-colors duration-500 flex-shrink-0 group">
          <img src="/logo-transparent.png" alt="Zenxity Logo" className="w-10 h-10" />
          <span className={cn(
            "text-2xl font-bold transition-all duration-500",
            (isHomePage && !isScrolled && !isMenuOpen)
              ? "text-white group-hover:text-green-400"
              : "text-green-600 group-hover:text-green-700"
          )}>
            Zenxity
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors duration-500",
                (isHomePage && !isScrolled && !isMenuOpen) ? "text-white/90 hover:text-green-400" : "text-foreground/80 hover:text-green-600"
              )}
            >
              <span className={cn(link.key !== "how" ? "whitespace-nowrap" : "", link.key === "features" ? "ml-4" : "")}>
                {mounted ? link.label : ""}
              </span>
            </Link>
          ))}
          {/* Language Selector next to nav links */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className={cn((isHomePage && !isScrolled && !isMenuOpen) ? "text-white hover:bg-white/10" : "text-foreground hover:bg-gray-100")}>
                {mounted ? t("Language") : ""}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onClick={() => setLang("en")}>{mounted ? t("English") : ""}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("ta")}>{mounted ? t("Tamil") : ""}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>

        {/* Right Side Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {session?.user ? (
            <>
              <span className={cn("font-medium text-sm transition-colors duration-500", (isHomePage && !isScrolled && !isMenuOpen) ? "text-white" : "text-foreground")}>
                {mounted ? `${t("Welcome")}, ${session.user.name}` : ""}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className={cn("gap-2 transition-colors duration-500", (isHomePage && !isScrolled) ? "text-white hover:bg-white/10 hover:text-white" : "text-foreground hover:bg-gray-100")}>
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary text-white font-bold rounded-full flex items-center justify-center text-sm shadow-sm">
                        {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        {mounted ? t("Dashboard") : ""}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="w-4 h-4 mr-2" />
                      {mounted ? t("Profile") : ""}
                    </Link>
                  </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="w-4 h-4 mr-2" />
                      {mounted ? t("Logout") : ""}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
              <Button
              asChild
              className="bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-900/20 transition-all duration-500 rounded-lg font-semibold"
            >
                {/* <Link href="/login">{mounted ? t("Login") : ""}</Link> */}
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          {session?.user && (
            <span className={cn("font-medium text-sm hidden xs:inline transition-colors duration-500", (isHomePage && !isScrolled && !isMenuOpen) ? "text-white" : "text-foreground")}>
              {session.user.name}
            </span>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "p-2 rounded-md transition-colors duration-500",
              (isHomePage && !isScrolled && !isMenuOpen) ? "text-white hover:bg-white/10" : "text-foreground hover:bg-gray-100"
            )}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div
          className={cn(
            "md:hidden absolute top-16 left-0 right-0 border-b shadow-lg py-4 px-4 space-y-4 backdrop-blur-lg z-50 transition-colors duration-500",
            (isHomePage && !isScrolled && !isMenuOpen) ? "bg-white/10 backdrop-blur-xl border-white/10 text-white" : "bg-white text-foreground border-border"
          )}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block text-base font-medium py-2 hover:text-green-600 transition-colors"
            >
              {mounted ? link.label : ""}
            </Link>
          ))}
          <div className="flex gap-2">
            <button onClick={() => { setLang("en"); setIsMenuOpen(false); }} className="px-3 py-2 rounded bg-gray-100 text-sm">{mounted ? t("English") : ""}</button>
            <button onClick={() => { setLang("ta"); setIsMenuOpen(false); }} className="px-3 py-2 rounded bg-gray-100 text-sm">{mounted ? t("Tamil") : ""}</button>
          </div>
          <div className={cn("pt-4 border-t flex flex-col gap-4", (isHomePage && !isScrolled) ? "border-white/10" : "border-border")}>
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-base font-medium"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  {mounted ? t("Dashboard") : ""}
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-base font-medium"
                >
                  <User className="w-5 h-5" />
                  {mounted ? t("Profile") : ""}
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center gap-2 py-2 text-base font-medium text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                  {mounted ? t("Logout") : ""}
                </button>
              </>
            ) : (
              <Button
                asChild
                className="w-full justify-center bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-900/20 transition-all duration-500 rounded-xl font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/login">{mounted ? t("Login") : ""}</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
