"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
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

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(clearCell(index));
  }, [dispatch, index]);

  const src = tileId ? getTilePatternSrc(tileId) : "";
  const name = tileId ? tileIdToName(tileId) : "";

  return (
    <div ref={setDroppableRef} className="relative w-full h-full group">
      <button
        ref={tileId ? setDraggableRef : null}
        {...(tileId ? listeners : {})}
        {...(tileId ? attributes : {})}
        type="button"
        className={`design-tool-cell relative h-full w-full overflow-hidden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy ${
          isOver ? "bg-cream/40" : ""
        } ${tileId ? "cursor-grab active:cursor-grabbing" : ""} ${isDragging ? "opacity-40" : ""}`}
        aria-label={
          tileId
            ? `Cell ${index + 1}, ${name}. Hover and click the trash bin icon to clear.`
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

      {/* Кнопка удаления плитки */}
      {tileId && !isDragging ? (
        <button
          type="button"
          onClick={handleClear}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute top-1 right-1 z-20 flex h-5 w-5 items-center justify-center rounded-full border border-ink bg-terracotta text-paper opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md cursor-pointer hover:scale-110 active:scale-95"
          aria-label={`Clear tile from cell ${index + 1}`}
          title="Clear cell"
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
