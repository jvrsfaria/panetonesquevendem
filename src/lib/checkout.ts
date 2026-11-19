export const CHECKOUT_URL = "https://pay.kiwify.com.br/g1qGR6r";

/** Ad-tracking params forwarded from the landing URL to the Kirvano checkout. */
export const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "src",
  "sck",
] as const;

export function buildCheckoutUrl(search: string, base: string = CHECKOUT_URL): string {
  const incoming = new URLSearchParams(search);
  const keep = new URLSearchParams();
  for (const key of TRACKING_PARAMS) {
    const value = incoming.get(key);
    if (value) keep.set(key, value);
  }
  const query = keep.toString();
  if (!query) return base;
  return base + (base.includes("?") ? "&" : "?") + query;
}
