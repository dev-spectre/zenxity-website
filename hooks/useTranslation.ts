"use client";

import { useCallback } from "react";
import { useLanguage } from "@/components/LanguageProvider";

// Hook wrapper that returns the translation function from LanguageProvider.
export function useTranslation() {
  const { t } = useLanguage();

  const translate = useCallback((key: string) => {
    return t(key);
  }, [t]);

  return { t: translate };
}
