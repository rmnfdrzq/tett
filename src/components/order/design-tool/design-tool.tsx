"use client";

import {
  type DragEndEvent,
  type DragStartEvent,
  DndContext,
  DragOverlay,
  pointerWithin,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import type { TileId } from "@/lib/tiles";
import { useAppDispatch } from "@/lib/store/hooks";
import { moveTile, placeTile } from "@/lib/store/design-tool-slice";
import { DesignGrid } from "./DesignGrid";
import { DesignPalette } from "./DesignPalette";
import { PaletteTilePreview } from "./PaletteTilePreview";

export function DesignTool() {
  const dispatch = useAppDispatch();
  const [activeTile, setActiveTile] = useState<TileId | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 8 },
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const tileId = event.active.data.current?.tileId as TileId | undefined;
    setActiveTile(tileId ?? null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTile(null);
      const tileId = event.active.data.current?.tileId as TileId | undefined;
      const sourceIndex = event.active.data.current?.sourceIndex as number | undefined;
      const overId = event.over?.id;
      if (!tileId || typeof overId !== "string") return;
      if (!overId.startsWith("cell-")) return;
      const index = Number(overId.replace("cell-", ""));
      if (!Number.isFinite(index)) return;

      // Проверяем, откуда был начат drag: из сетки или из палитры. 
      // Если из сетки, то это перемещение плитки внутри дизайна, если из палитры, то размещение новой плитки в дизайне
      const dragSourceId = event.active.id as string;
      if (dragSourceId.startsWith("grid-") && sourceIndex !== undefined) {
        // Перемещение внутри сетки
        dispatch(moveTile({ fromIndex: sourceIndex, toIndex: index }));
      } else {
        // Перемещение из палитры в сетку
        dispatch(placeTile({ index, tileId }));
      }
    },
    [dispatch]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <section className="design-tool-container">
        {/* VISUALIZE YOUR ORDER */}
        <div className="border-r-2 border-ink bg-transparent flex flex-col h-full">
          <div className="design-tool-header shrink-0">
            <h2 className="design-tool-title">Visualize Your Order:</h2>
            <p className="design-tool-desc">Drag and drop tiles here to create patterns.</p>
          </div>
          <div className="relative p-0 bg-transparent flex-1 flex items-center justify-center">
            <DesignGrid />
            <div className="absolute right-2 top-2 h-32 w-4 rounded-full border-2 border-ink bg-navy hidden" />
          </div>
        </div>

        {/* DESIGN PALATE */}
        <DesignPalette />
      </section>

      {typeof document !== "undefined"
        ? createPortal(
            <DragOverlay dropAnimation={{ duration: 180, easing: "ease-out" }}>
              {activeTile ? <PaletteTilePreview tileId={activeTile} /> : null}
            </DragOverlay>,
            document.body
          )
        : null}
    </DndContext>
  );
}
