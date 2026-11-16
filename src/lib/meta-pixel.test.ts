import { beforeEach, expect, it, vi } from "vitest";
vi.mock("./consent", () => ({ canTrack: vi.fn(), onConsentChange: vi.fn(() => () => {}) }));
import { canTrack } from "./consent";

beforeEach(() => {
  vi.resetModules();
  delete window.fbq;
  delete window._fbq;
  document.head.querySelectorAll('script[src*="fbevents"]').forEach(s => s.remove());
});
it("initializes the supplied pixel and sends exactly one PageView", async () => {
  vi.mocked(canTrack).mockResolvedValue(true);
  const { syncMetaPixel } = await import("./meta-pixel");
  await syncMetaPixel();
  await syncMetaPixel();
  expect(window.fbq?.queue).toContainEqual(["init", "3540747909429722", {}, { agent: "lovable" }]);
  expect(window.fbq?.queue.filter(args => args[0] === "track" && args[1] === "PageView")).toEqual([["track", "PageView"]]);
  expect(window.fbq?.queue.filter(args => args[0] === "track" && args[1] === "ViewContent")).toHaveLength(1);
  expect(document.head.querySelectorAll('script[src*="fbevents"]')).toHaveLength(1);
});
it("never installs or sends when advertising permission is absent", async () => {
  vi.mocked(canTrack).mockResolvedValue(false);
  const { syncMetaPixel } = await import("./meta-pixel");
  await syncMetaPixel();
  expect(window.fbq).toBeUndefined();
  expect(document.head.querySelector('script[src*="fbevents"]')).toBeNull();
});
it("revokes immediately after advertising refusal without another event", async () => {
  vi.mocked(canTrack).mockResolvedValue(true);
  const { syncMetaPixel } = await import("./meta-pixel");
  await syncMetaPixel();
  vi.mocked(canTrack).mockResolvedValue(false);
  await syncMetaPixel();
  expect(window.fbq?.queue.at(-1)).toEqual(["consent", "revoke"]);
  expect(window.fbq?.queue.filter(args => args[0] === "track")).toHaveLength(2);
});
it("sends a single checkout event with the actual R$ 19,90 price, never Purchase", async () => {
  vi.mocked(canTrack).mockResolvedValue(true);
  const { trackCheckout } = await import("./meta-pixel");
  await Promise.all([trackCheckout(), trackCheckout()]);
  const events = window.fbq?.queue.filter(args => args[1] === "InitiateCheckout");
  expect(events).toHaveLength(1);
  expect(events?.[0]?.[2]).toMatchObject({ value: 19.9, currency: "BRL", num_items: 1 });
  expect(window.fbq?.queue.some(args => args[1] === "Purchase")).toBe(false);
});
it("blocks checkout events after refusal", async () => {
  vi.mocked(canTrack).mockResolvedValue(true);
  const { syncMetaPixel, trackCheckout } = await import("./meta-pixel");
  await syncMetaPixel();
  vi.mocked(canTrack).mockResolvedValue(false);
  await trackCheckout();
  expect(window.fbq?.queue.some(args => args[1] === "InitiateCheckout")).toBe(false);
});