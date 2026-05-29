import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { findTileDefinition, INITIAL_CART_ITEMS, type CartItem, type TileId } from "@/lib/tiles";

export type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: INITIAL_CART_ITEMS,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    incrementQuantity(state, action: PayloadAction<TileId>) {
      const item = state.items.find((cartItem) => cartItem.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity(state, action: PayloadAction<TileId>) {
      const item = state.items.find((cartItem) => cartItem.id === action.payload);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          state.items = state.items.filter((cartItem) => cartItem.id !== action.payload);
        }
      }
    },
    setQuantity(state, action: PayloadAction<{ id: TileId; quantity: number }>) {
      const item = state.items.find((cartItem) => cartItem.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(0, Math.floor(action.payload.quantity || 0));
      }
    },
    removeItem(state, action: PayloadAction<TileId>) {
      state.items = state.items.filter((cartItem) => cartItem.id !== action.payload);
    },
    addItem(state, action: PayloadAction<TileId>) {
      const item = state.items.find((cartItem) => cartItem.id === action.payload);
      if (item) {
        item.quantity += 1;
        return;
      }

      state.items.push({
        ...findTileDefinition(action.payload),
        quantity: 1,
      });
    },
  },
});

export const { addItem, decrementQuantity, incrementQuantity, removeItem, setQuantity } =
  cartSlice.actions;

export default cartSlice.reducer;
