import { canTrack, onConsentChange } from "./consent";

export const META_PIXEL_ID = "3540747909429722";
type Pixel = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Pixel;
  loaded: boolean;
  version: string;
};
declare global {
  interface Window { fbq?: Pixel; _fbq?: Pixel }
}
let initialized = false;
let pageViewed = false;
let contentViewed = false;
let checkoutStarted = false;

export const PRODUCT_DATA = {
  content_name: "Kit Encomendas de Natal — Panetones que Vendem",
  content_ids: ["panetones-que-vendem"],
  content_type: "product",
  value: 19.9,
  currency: "BRL",
};

export async function syncMetaPixel() {
  const permitted = await canTrack("advertising");
  if (!permitted) {
    window.fbq?.("consent", "revoke");
    return;
  }
  if (!window.fbq) {
    const pixel = function (...args: unknown[]) {
      if (pixel.callMethod) pixel.callMethod.apply(pixel, args);
      else pixel.queue.push(args);
    } as Pixel;
    pixel.queue = [];
    pixel.push = pixel;
    pixel.loaded = true;
    pixel.version = "2.0";
    window.fbq = pixel;
    window._fbq = pixel;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }
  const pixel = window.fbq;
  pixel("consent", "grant");
  if (!initialized) {
    pixel("init", META_PIXEL_ID, {}, { agent: "lovable" });
    initialized = true;
  }
  if (!pageViewed) {
    pixel("track", "PageView");
    pageViewed = true;
  }
  if (!contentViewed) {
    pixel("track", "ViewContent", PRODUCT_DATA, { eventID: crypto.randomUUID() });
    contentViewed = true;
  }
}

/** Called only by a link that actually leaves for the configured checkout. */
export async function trackCheckout() {
  if (checkoutStarted || !(await canTrack("advertising"))) return;
  await syncMetaPixel();
  const stillPermitted = await canTrack("advertising");
  if (checkoutStarted || !stillPermitted || !window.fbq) return;
  checkoutStarted = true;
  window.fbq("track", "InitiateCheckout", { ...PRODUCT_DATA, num_items: 1 }, { eventID: crypto.randomUUID() });
}

export function startMetaPixel() {
  void syncMetaPixel();
  return onConsentChange(() => { void syncMetaPixel(); });
}