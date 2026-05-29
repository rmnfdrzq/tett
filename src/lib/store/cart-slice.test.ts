import { describe, expect, it } from "vitest";
import cartReducer, {
  addItem,
  incrementQuantity,
  removeItem,
  setQuantity,
} from "./cart-slice";
import { INITIAL_CART_ITEMS } from "@/lib/tiles";

describe("cart slice", () => {
  it("increments, sets, and removes cart item quantities", () => {
    const initialState = { items: INITIAL_CART_ITEMS };

    const incremented = cartReducer(initialState, incrementQuantity("tile1"));
    expect(incremented.items.find((item) => item.id === "tile1")?.quantity).toBe(151);

    const updated = cartReducer(incremented, setQuantity({ id: "tile8", quantity: 12 }));
    expect(updated.items.find((item) => item.id === "tile8")?.quantity).toBe(12);

    const removed = cartReducer(updated, removeItem("tile17"));
    expect(removed.items.some((item) => item.id === "tile17")).toBe(false);
  });

  it("adds a removed tile back to the cart with quantity one", () => {
    const withoutStar = cartReducer({ items: INITIAL_CART_ITEMS }, removeItem("tile7"));
    const restored = cartReducer(withoutStar, addItem("tile7"));

    expect(restored.items.find((item) => item.id === "tile7")?.quantity).toBe(1);
  });
});
