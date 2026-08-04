import { cookies } from "next/headers";
import { translations } from "./translations";

export async function getServerTranslation() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("zenxity-lang")?.value || "en") as "en" | "ta";

  const t = (key: string) => {
    return translations[lang]?.[key] ?? key;
  };

  return { t, lang };
}
