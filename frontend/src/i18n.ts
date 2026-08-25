import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import frTranslation from "./locales/fr/translation.json";
import enTranslation from "./locales/en/translation.json";
import nlTranslation from "./locales/nl/translation.json";

export const SUPPORTED_LANGUAGES = ["fr", "en", "nl"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** Aligne la valeur backend (FR, fr-FR, etc.) sur les clés i18next (fr, en, nl). */
export function resolveUserLanguageTag(
  raw: string | undefined | null
): SupportedLanguage {
  if (raw == null || String(raw).trim() === "") return "fr";
  const base = String(raw).trim().toLowerCase().split(/[-_]/)[0];
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(base)
    ? (base as SupportedLanguage)
    : "fr";
}

/** À appeler après login / refreshProfile : UI + localStorage (LanguageDetector). */
export async function applyUserLanguagePreference(
  raw: string | undefined | null
): Promise<void> {
  const lng = resolveUserLanguageTag(raw);
  await i18n.changeLanguage(lng);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: frTranslation },
      en: { translation: enTranslation },
      nl: { translation: nlTranslation },
    },
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18n;
