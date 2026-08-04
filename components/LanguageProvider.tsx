"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations, Lang } from "@/lib/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "zenxity-lang";
const COOKIE_NAME = "zenxity-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "ta" || stored === "en") return stored as Lang;
    } catch (e) {}
    return "en";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    // Set cookie for Server Components to read
    try {
      document.cookie = `${COOKIE_NAME}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) {}

    // Set document lang attribute for accessibility
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "en" ? "en" : "ta";
    }
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang: (l: Lang) => setLang(l),
      t: (key: string) => translations[lang]?.[key] ?? key,
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
