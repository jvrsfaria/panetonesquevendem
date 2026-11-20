import { canTrack, onConsentChange } from "./consent";

export const UTMIFY_SCRIPT_URL = "https://cdn.utmify.com.br/scripts/utms/latest.js";

/** The supplied loader decoded to this URL and these two attributes (no globals). */
export function startUtmify(reload = () => window.location.reload()) {
  let active = true;
  const sync = async () => {
    const permitted = await canTrack("advertising");
    if (!active) return;
    const existing = document.querySelector(`script[src="${UTMIFY_SCRIPT_URL}"]`);
    if (!permitted) {
      // The vendor installs observers and timers with no teardown API. Reload after
      // refusal to stop them; the persisted refusal prevents loading on the next page.
      if (existing) reload();
      return;
    }
    if (existing) return;
    const script = document.createElement("script");
    script.src = UTMIFY_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-utmify-prevent-xcod-sck", "");
    script.setAttribute("data-utmify-prevent-subids", "");
    document.head.appendChild(script);
  };
  void sync().catch(() => {});
  const unsubscribe = onConsentChange(() => { void sync().catch(() => {}); });
  return () => { active = false; unsubscribe(); };
}