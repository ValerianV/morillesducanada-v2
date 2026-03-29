import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { fr } from "@/i18n/fr";
import { en } from "@/i18n/en";

export type Locale = "fr" | "en";

type Translations = typeof fr;

const translationsMap: Record<Locale, Translations> = { fr, en };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  translations: Translations;
}

const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: Record<string, any>, path: string): string {
  const value = path.split(".").reduce((acc, part) => acc?.[part], obj);
  return typeof value === "string" ? value : path;
}

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem("locale");
    return (stored === "en" ? "en" : "fr") as Locale;
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
    document.documentElement.lang = l;
  }, []);

  const currentTranslations = translationsMap[locale];

  const t = useCallback(
    (key: string) => getNestedValue(currentTranslations as any, key),
    [currentTranslations]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, translations: currentTranslations }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
