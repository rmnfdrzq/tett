import { describe, expect, it } from "vitest";
import designToolReducer, {
  clearCell,
  placeTile,
  resetGrid,
  selectTile,
} from "./design-tool-slice";

describe("design tool slice", () => {
  it("selects and places tiles in a 6 by 6 grid", () => {
    const selected = designToolReducer(undefined, selectTile("forest-fern"));
    const placed = designToolReducer(selected, placeTile(8));

    expect(placed.selectedTileId).toBe("forest-fern");
    expect(placed.grid).toHaveLength(36);
    expect(placed.grid[8]).toBe("forest-fern");
  });

  it("clears individual cells and resets the grid", () => {
    const placed = designToolReducer(undefined, placeTile(0));
    const cleared = designToolReducer(placed, clearCell(0));
    const reset = designToolReducer(placed, resetGrid());

    expect(cleared.grid[0]).toBeNull();
    expect(reset.grid.every((cell) => cell === null)).toBe(true);
  });
});
