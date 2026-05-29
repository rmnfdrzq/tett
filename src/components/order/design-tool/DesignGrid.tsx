"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { selectDesignGrid, selectCartItems } from "@/lib/store/selectors";
import type { TileId } from "@/lib/tiles";
import { GridCell } from "./GridCell";

export function DesignGrid() {
  const grid = useAppSelector(selectDesignGrid);
  const cartItems = useAppSelector(selectCartItems);
  const cartTileIds = new Set(cartItems.map((i) => i.id));

  // Ячейки, ссылающиеся на плитки, которых нет в корзине, отображаются как пустые. Это позволяет избежать путаницы при удалении плиток из корзины.
  // Если же отображать их, то пользователь может не понять, почему он не может их перетащить в дизайн, и решить, что это баг.
  const filteredGrid = grid.map((tileId): TileId | null =>
    tileId && cartTileIds.has(tileId) ? tileId : null
  );

  return (
    <div
      className="design-tool-grid"
      role="application"
      aria-label="Tile layout grid 7 by 6"
    >
      {filteredGrid.map((tileId, index) => (
        <GridCell key={index} index={index} tileId={tileId} />
      ))}
    </div>
  );
}
