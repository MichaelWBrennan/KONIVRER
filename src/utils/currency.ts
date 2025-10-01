// Basic currency utilities for locale-aware formatting and sensible defaults

const regionToCurrency: Record<string, string> = {
  US: "USD",
  CA: "CAD",
  MX: "MXN",
  BR: "BRL",
  GB: "GBP",
  IE: "EUR",
  FR: "EUR",
  DE: "EUR",
  ES: "EUR",
  IT: "EUR",
  PT: "EUR",
  NL: "EUR",
  BE: "EUR",
  LU: "EUR",
  AT: "EUR",
  FI: "EUR",
  GR: "EUR",
  SK: "EUR",
  SI: "EUR",
  MT: "EUR",
  CY: "EUR",
  LV: "EUR",
  LT: "EUR",
  EE: "EUR",
  JP: "JPY",
  CN: "CNY",
  HK: "HKD",
  SG: "SGD",
  TW: "TWD",
  KR: "KRW",
  AU: "AUD",
  NZ: "NZD",
  IN: "INR",
  ZA: "ZAR",
  CH: "CHF",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
};

const zeroDecimalCurrencies = new Set<string>(["JPY", "KRW", "VND", "CLP", "XOF", "XAF", "XPF"]);

export function detectUserLocale(): string {
  try {
    if (typeof navigator !== "undefined" && navigator.language) return navigator.language;
  } catch {}
  return "en-US";
}

function getRegionFromLocale(locale: string): string | undefined {
  const parts = locale.replace('_', '-').split('-');
  // Try last part as region (e.g., en-US or en-Latn-US)
  const last = parts[parts.length - 1];
  if (last && last.length === 2 && /[A-Z]{2}/.test(last)) return last;
  // Try second part
  if (parts.length >= 2) {
    const maybe = parts[1];
    if (maybe && maybe.length === 2 && /[A-Z]{2}/.test(maybe)) return maybe;
  }
  return undefined;
}

export function detectCurrencyCode(): string {
  const locale = detectUserLocale();
  const region = getRegionFromLocale(locale);
  if (region && regionToCurrency[region]) return regionToCurrency[region];
  // Default fallback
  return "USD";
}

export function isZeroDecimalCurrency(currencyCode: string): boolean {
  return zeroDecimalCurrencies.has(currencyCode.toUpperCase());
}

export function getCurrencySymbol(currencyCode: string, locale?: string): string {
  try {
    const nf = new Intl.NumberFormat(locale || detectUserLocale(), {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "symbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const parts = nf.formatToParts(0);
    const sym = parts.find((p) => p.type === "currency");
    return sym?.value || "";
  } catch {
    return "$";
  }
}

export function formatCurrency(amount: number, currencyCode?: string, locale?: string): string {
  const code = (currencyCode || detectCurrencyCode()).toUpperCase();
  const useZero = isZeroDecimalCurrency(code);
  try {
    return new Intl.NumberFormat(locale || detectUserLocale(), {
      style: "currency",
      currency: code,
      minimumFractionDigits: useZero ? 0 : 2,
      maximumFractionDigits: useZero ? 0 : 2,
    }).format(amount);
  } catch {
    // Fallback: simple formatting
    const fixed = useZero ? Math.round(amount).toString() : amount.toFixed(2);
    return `${getCurrencySymbol(code)}${fixed}`;
  }
}

export function getDefaultPriceRangeForCurrency(currencyCode?: string): { min: number; max: number; step: number } {
  const code = (currencyCode || detectCurrencyCode()).toUpperCase();
  const zero = isZeroDecimalCurrency(code);
  const step = zero ? 1 : 0.01;
  // Sensible defaults by currency
  switch (code) {
    case "JPY":
      return { min: 0, max: 10000, step };
    case "KRW":
      return { min: 0, max: 120000, step };
    case "INR":
      return { min: 0, max: 8000, step };
    case "CNY":
      return { min: 0, max: 800, step };
    case "BRL":
      return { min: 0, max: 400, step };
    case "GBP":
      return { min: 0, max: 80, step };
    case "EUR":
      return { min: 0, max: 100, step };
    case "AUD":
    case "NZD":
    case "CAD":
      return { min: 0, max: 120, step };
    case "USD":
    default:
      return { min: 0, max: 100, step };
  }
}

const symbolToCode: Record<string, string> = {
  "$": "USD", // ambiguous; fallback to USD
  "£": "GBP",
  "€": "EUR",
  "¥": "JPY", // ambiguous with CNY; prefer JPY for symbol-only
  "A$": "AUD",
  "C$": "CAD",
  "NZ$": "NZD",
  "R$": "BRL",
};

export function normalizeCurrencyCode(input?: string | null): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  if (/^[A-Za-z]{3}$/.test(trimmed)) return trimmed.toUpperCase();
  if (symbolToCode[trimmed]) return symbolToCode[trimmed];
  // If a single $ provided, fallback to locale currency
  if (trimmed === "$") return detectCurrencyCode();
  return undefined;
}

