"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback } from "react";
import type { TileId } from "@/lib/tiles";
import { getTilePatternSrc, tileIdToName } from "@/lib/tiles";
import { useAppDispatch } from "@/lib/store/hooks";
import { clearCell } from "@/lib/store/design-tool-slice";
import { TilePatternImage } from "@/components/ui/TilePatternImage";

export function GridCell({
  index,
  tileId,
}: {
  index: number;
  tileId: TileId | null;
}) {
  const dispatch = useAppDispatch();
  const id = `cell-${index}`;

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({ id });

  const { attributes, listeners, setNodeRef: setDraggableRef, isDragging } = useDraggable({
    id: `grid-${index}`,
    data: { tileId, sourceIndex: index },
    disabled: !tileId,
  });

  const onDoubleClick = useCallback(() => {
    dispatch(clearCell(index));
  }, [dispatch, index]);

  const src = tileId ? getTilePatternSrc(tileId) : "";
  const name = tileId ? tileIdToName(tileId) : "";

  return (
    <div ref={setDroppableRef} className="relative w-full h-full">
      <button
        ref={tileId ? setDraggableRef : null}
        {...(tileId ? listeners : {})}
        {...(tileId ? attributes : {})}
        type="button"
        onDoubleClick={onDoubleClick}
        className={`design-tool-cell group relative h-full w-full overflow-hidden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy ${
          isOver ? "bg-cream/40" : ""
        } ${tileId ? "cursor-grab active:cursor-grabbing" : ""} ${isDragging ? "opacity-40" : ""}`}
        aria-label={
          tileId
            ? `Cell ${index + 1}, ${name}. Double-click to clear.`
            : `Empty cell ${index + 1}. Drop a tile here.`
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          {tileId ? (
            <motion.span
              key={`${tileId}-${index}`}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="absolute inset-0 block"
            >
              <TilePatternImage
                src={src}
                className="block h-full w-full object-cover animate-fade-in"
              />
            </motion.span>
          ) : null}
        </AnimatePresence>


      </button>
    </div>
  );
}
