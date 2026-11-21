import { describe, expect, it } from "vitest";
import { OFFER } from "./offer";

describe("Confirmed main price", () => {
  it("keeps R$ 19,90 as the only product price without a promotional pair", () => {
    expect(OFFER).toEqual({ price: 19.9 });
  });
});