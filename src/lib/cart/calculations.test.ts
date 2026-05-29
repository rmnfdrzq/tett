import { describe, expect, it } from "vitest";
import { INITIAL_CART_ITEMS } from "@/lib/tiles";
import { calculateGrandTotal, calculateShipping, calculateSubtotal } from "./calculations";

describe("cart calculations", () => {
  it("calculates subtotal as quantity multiplied by unit price", () => {
    expect(calculateSubtotal(INITIAL_CART_ITEMS)).toBe(13100);
  });

  it("returns free shipping when subtotal is greater than 500", () => {
    expect(calculateShipping(501)).toBe(0);
  });

  it("returns fixed shipping when subtotal is 500 or less", () => {
    expect(calculateShipping(500)).toBe(25);
  });

  it("calculates grand total as subtotal plus shipping", () => {
    expect(calculateGrandTotal(400)).toBe(425);
    expect(calculateGrandTotal(13100)).toBe(13100);
  });
});
