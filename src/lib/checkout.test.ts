import { describe, expect, it } from "vitest";
import { CHECKOUT_URL, buildCheckoutUrl } from "./checkout";

describe("buildCheckoutUrl", () => {
  it("returns the plain Celetus link when there are no tracking params", () => {
    expect(buildCheckoutUrl("")).toBe(CHECKOUT_URL);
    expect(buildCheckoutUrl("?foo=bar")).toBe(CHECKOUT_URL);
  });

  it("forwards UTMs, src and sck to the checkout", () => {
    expect(
      buildCheckoutUrl("?utm_source=fb&utm_campaign=natal&src=ad1&sck=x9&gclid=zzz"),
    ).toBe(`${CHECKOUT_URL}?utm_source=fb&utm_campaign=natal&src=ad1&sck=x9`);
  });

  it("appends with & when the checkout link already has a query", () => {
    expect(buildCheckoutUrl("?utm_medium=cpc", "https://pay.celetus.com/x?a=1")).toBe(
      "https://pay.celetus.com/x?a=1&utm_medium=cpc",
    );
  });
});
