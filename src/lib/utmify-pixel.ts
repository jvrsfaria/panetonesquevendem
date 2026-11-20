import { canTrack, onConsentChange } from "./consent";

export const UTMIFY_PIXEL_ID = "6affbdeb3872e1106d428389";
export const UTMIFY_PIXEL_URL = "https://cdn.utmify.com.br/scripts/pixel/pixel.js";

declare global {
  interface Window { pixelId?: string }
}

/** Decoded supplied loader; the vendor owns events, avoiding a second Meta installation. */
export function startUtmifyPixel(reload = () => window.location.reload()) {
  let active = true;
  const sync = async () => {
    const permitted = await canTrack("advertising");
    if (!active) return;
    const existing = document.querySelector(`script[src="${UTMIFY_PIXEL_URL}"]`);
    if (!permitted) {
      // This SDK has timers, network retries and observers with no teardown API.
      // A persisted refusal prevents it from running again after reload.
      if (existing) reload();
      return;
    }
    if (existing) return;
    window.pixelId = UTMIFY_PIXEL_ID;
    const script = document.createElement("script");
    script.src = UTMIFY_PIXEL_URL;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  };
  void sync().catch(() => {});
  const unsubscribe = onConsentChange(() => { void sync().catch(() => {}); });
  return () => { active = false; unsubscribe(); };
}