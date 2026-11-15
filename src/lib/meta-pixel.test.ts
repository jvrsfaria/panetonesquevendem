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
  expect(window.fbq?.queue.filter(args => args[0] === "track")).toEqual([["track", "PageView"]]);
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
  expect(window.fbq?.queue.filter(args => args[0] === "track")).toHaveLength(1);
});