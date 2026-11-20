import { beforeEach, expect, it, vi } from "vitest";
vi.mock("./consent", () => ({ canTrack: vi.fn(), onConsentChange: vi.fn() }));
import { canTrack, onConsentChange } from "./consent";
import { startUtmifyPixel, UTMIFY_PIXEL_URL } from "./utmify-pixel";

let changed: () => void;
beforeEach(() => {
  document.head.querySelectorAll(`script[src="${UTMIFY_PIXEL_URL}"]`).forEach(s => s.remove());
  delete window.pixelId;
  vi.mocked(onConsentChange).mockImplementation(listener => {
    changed = listener;
    return () => {};
  });
});
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

it("installs the supplied UTMify pixel exactly once with its supplied ID", async () => {
  vi.mocked(canTrack).mockResolvedValue(true);
  const stop = startUtmifyPixel();
  await flush();
  changed();
  await flush();
  expect(window.pixelId).toBe("6affbdeb3872e1106d428389");
  const scripts = document.head.querySelectorAll<HTMLScriptElement>(`script[src="${UTMIFY_PIXEL_URL}"]`);
  expect(scripts).toHaveLength(1);
  expect(scripts[0]?.async).toBe(true);
  expect(scripts[0]?.defer).toBe(true);
  stop();
});
it("does not install or set the pixel ID without advertising permission", async () => {
  vi.mocked(canTrack).mockResolvedValue(false);
  const stop = startUtmifyPixel();
  await flush();
  expect(window.pixelId).toBeUndefined();
  expect(document.querySelector(`script[src="${UTMIFY_PIXEL_URL}"]`)).toBeNull();
  stop();
});
it("reloads on withdrawal after installation to stop the vendor SDK", async () => {
  vi.mocked(canTrack).mockResolvedValue(true);
  const reload = vi.fn();
  const stop = startUtmifyPixel(reload);
  await flush();
  vi.mocked(canTrack).mockResolvedValue(false);
  changed();
  await flush();
  expect(reload).toHaveBeenCalledTimes(1);
  stop();
});
it("does not install after unmount during a pending permission lookup", async () => {
  let resolve: (value: boolean) => void = () => {};
  vi.mocked(canTrack).mockImplementation(() => new Promise<boolean>(r => { resolve = r; }));
  const stop = startUtmifyPixel();
  stop();
  resolve(true);
  await flush();
  expect(document.querySelector(`script[src="${UTMIFY_PIXEL_URL}"]`)).toBeNull();
});