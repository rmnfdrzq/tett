import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_DESIGN_GRID, type TileId } from "@/lib/tiles";
import { removeItem } from "./cart-slice";

export type DesignToolState = {
  selectedTileId: TileId;
  grid: (TileId | null)[];
};

const initialGrid = Array.from({ length: 36 }, () => null as TileId | null);
initialGrid[0] = "tile1";
initialGrid[1] = "tile8";
initialGrid[6] = "tile17";
initialGrid[7] = "tile7";

const initialState: DesignToolState = {
  selectedTileId: "tile1",
  grid: initialGrid,
};

const designToolSlice = createSlice({
  name: "designTool",
  initialState,
  reducers: {
    selectTile(state, action: PayloadAction<TileId>) {
      state.selectedTileId = action.payload;
    },
    placeTile(state, action: PayloadAction<number | { index: number; tileId: TileId }>) {
      const payload = action.payload;
      if (typeof payload === "number") {
        const index = payload;
        if (index >= 0 && index < state.grid.length) {
          state.grid[index] = state.selectedTileId;
        }
      } else {
        const { index, tileId } = payload;
        if (index >= 0 && index < state.grid.length) {
          state.grid[index] = tileId;
        }
      }
    },
    clearCell(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index >= 0 && index < state.grid.length) {
        state.grid[index] = null;
      }
    },
    moveTile(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
      const { fromIndex, toIndex } = action.payload;
      if (
        fromIndex >= 0 &&
        fromIndex < state.grid.length &&
        toIndex >= 0 &&
        toIndex < state.grid.length
      ) {
        const temp = state.grid[toIndex];
        state.grid[toIndex] = state.grid[fromIndex];
        state.grid[fromIndex] = temp;
      }
    },
    resetGrid(state) {
      state.grid = Array.from({ length: 36 }, () => null);
    },
  },
  extraReducers: (builder) => {
    // Когда плитка полностью удаляется из корзины, очищаем каждую ячейку сетки, которая
    // содержала эту плитку, чтобы она также не отображалась в визуализации заказа.
    builder.addCase(removeItem, (state, action) => {
      const removedId = action.payload;
      state.grid = state.grid.map((id) => (id === removedId ? null : id));
    });
  },
});

export const { clearCell, moveTile, placeTile, resetGrid, selectTile } = designToolSlice.actions;
// Повторно экспортируем DEFAULT_DESIGN_GRID для других модулей, если это необходимо
export { DEFAULT_DESIGN_GRID };

export default designToolSlice.reducer;
