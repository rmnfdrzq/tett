import { calculateGrandTotal, calculateShipping, calculateSubtotal } from "@/lib/cart/calculations";
import type { RootState } from "./store";

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectDesignGrid = (state: RootState) => state.designTool.grid;
export const selectSelectedTileId = (state: RootState) => state.designTool.selectedTileId;

export const selectSubtotal = (state: RootState) => calculateSubtotal(selectCartItems(state));
export const selectShipping = (state: RootState) => calculateShipping(selectSubtotal(state));
export const selectGrandTotal = (state: RootState) => calculateGrandTotal(selectSubtotal(state));
export const selectCartCount = (state: RootState) =>
  selectCartItems(state).reduce((count, item) => count + item.quantity, 0);
