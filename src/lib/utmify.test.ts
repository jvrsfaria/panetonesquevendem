import { beforeEach, expect, it, vi } from "vitest";
vi.mock("./consent", () => ({ canTrack: vi.fn(), onConsentChange: vi.fn(() => () => {}) }));
import { canTrack, onConsentChange } from "./consent";
import { startUtmify, UTMIFY_SCRIPT_URL } from "./utmify";

const flush = () => new Promise(resolve => setTimeout(resolve, 0));
beforeEach(() => {
  vi.clearAllMocks();
  document.head.querySelectorAll(`script[src="${UTMIFY_SCRIPT_URL}"]`).forEach(script => script.remove());
});
it("loads the supplied UTMify URL once with both supplied attributes", async () => {
  vi.mocked(canTrack).mockResolvedValue(true);
  const stop = startUtmify();
  const stopAgain = startUtmify();
  await flush();
  const scripts = document.querySelectorAll('script[src="https://cdn.utmify.com.br/scripts/utms/latest.js"]');
  expect(scripts).toHaveLength(1);
  expect(scripts[0]?.hasAttribute("data-utmify-prevent-xcod-sck")).toBe(true);
  expect(scripts[0]?.hasAttribute("data-utmify-prevent-subids")).toBe(true);
  stop(); stopAgain();
});
it("does not load without advertising permission", async () => {
  vi.mocked(canTrack).mockResolvedValue(false);
  const stop = startUtmify();
  await flush();
  expect(document.querySelector(`script[src="${UTMIFY_SCRIPT_URL}"]`)).toBeNull();
  stop();
});
it("stops vendor observers by reloading after refusal", async () => {
  vi.mocked(canTrack).mockResolvedValue(true);
  const reload = vi.fn();
  const stop = startUtmify(reload);
  await flush();
  vi.mocked(canTrack).mockResolvedValue(false);
  const listener = vi.mocked(onConsentChange).mock.calls[0]?.[0];
  listener?.();
  await flush();
  expect(reload).toHaveBeenCalledTimes(1);
  stop();
});
it("does not load after the sales page unmounts during the permission lookup", async () => {
  vi.mocked(canTrack).mockResolvedValue(true);
  const stop = startUtmify();
  stop();
  await flush();
  expect(document.querySelector(`script[src="${UTMIFY_SCRIPT_URL}"]`)).toBeNull();
});