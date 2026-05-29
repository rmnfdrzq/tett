import { describe, expect, it } from "vitest";
import cartReducer, {
  addItem,
  decrementQuantity,
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

  it("decrements quantity and removes item if it becomes 0", () => {
    // Initial quantity of tile7 is 50 in INITIAL_CART_ITEMS
    const initialState = { items: INITIAL_CART_ITEMS };

    // Decrement tile7 (should decrease to 49)
    const decrementedOnce = cartReducer(initialState, decrementQuantity("tile7"));
    expect(decrementedOnce.items.find((item) => item.id === "tile7")?.quantity).toBe(49);

    // Now set quantity of tile7 to 1
    const setToOne = cartReducer(decrementedOnce, setQuantity({ id: "tile7", quantity: 1 }));
    expect(setToOne.items.find((item) => item.id === "tile7")?.quantity).toBe(1);

    // Decrement tile7 again (should become 0 and get removed from cart)
    const decrementedToZero = cartReducer(setToOne, decrementQuantity("tile7"));
    expect(decrementedToZero.items.some((item) => item.id === "tile7")).toBe(false);
  });

  it("adds a removed tile back to the cart with quantity one", () => {
    const withoutStar = cartReducer({ items: INITIAL_CART_ITEMS }, removeItem("tile7"));
    const restored = cartReducer(withoutStar, addItem("tile7"));

    expect(restored.items.find((item) => item.id === "tile7")?.quantity).toBe(1);
  });
});
