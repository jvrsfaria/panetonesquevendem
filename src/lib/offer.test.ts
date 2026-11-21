import { describe, expect, it } from "vitest";
import { OFFER } from "./offer";

describe("Confirmed promotional offer", () => {
  it("keeps the regular product price at R$ 39,90", () => {
    expect(OFFER.regularPrice).toBe(39.9);
  });
  it("keeps the promotional product price at R$ 19,90", () => {
    expect(OFFER.promotionalPrice).toBe(19.9);
    expect(OFFER.promotionalPrice).toBeLessThan(OFFER.regularPrice);
  });
});