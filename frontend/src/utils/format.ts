/**
 * Maps i18n language codes to Intl locale strings.
 */
function toLocale(lang: string): string {
  const map: Record<string, string> = {
    fr: "fr-FR",
    en: "en-GB",
    nl: "nl-BE",
  };
  return map[lang] || lang;
}

/**
 * Formats a date according to the given locale.
 * @param date - Date string or Date object
 * @param locale - i18n language code (fr, en, nl)
 */
export function formatDate(
  date: string | Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const intlLocale = toLocale(locale);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...options,
  };
  return new Intl.DateTimeFormat(intlLocale, defaultOptions).format(d);
}

/**
 * Formats a time (hour:minute) according to the given locale.
 */
export function formatTime(date: string | Date, locale: string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const intlLocale = toLocale(locale);
  return new Intl.DateTimeFormat(intlLocale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Formats a date and time according to the given locale.
 */
export function formatDateTime(
  date: string | Date,
  locale: string
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const intlLocale = toLocale(locale);
  return new Intl.DateTimeFormat(intlLocale, {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Formats a price in EUR according to the given locale.
 */
export function formatCurrency(amount: number, locale: string): string {
  const intlLocale = toLocale(locale);
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
