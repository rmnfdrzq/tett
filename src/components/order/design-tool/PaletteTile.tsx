"use client";

import { useDraggable } from "@dnd-kit/core";
import type { TileId } from "@/lib/tiles";
import { getTilePatternSrc, tileIdToName } from "@/lib/tiles";
import { TilePatternImage } from "@/components/ui/TilePatternImage";

export function PaletteTile({ tileId }: { tileId: TileId }) {
  const name = tileIdToName(tileId);
  const patternSrc = getTilePatternSrc(tileId);

  const { attributes, listeners, setNodeRef, isDragging } =
    useDraggable({
      id: `palette-${tileId}`,
      data: { tileId },
    });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`relative aspect-square w-full ${isDragging ? "opacity-40" : ""}`}
    >
      <button
        type="button"
        className="absolute inset-0 h-full w-full overflow-hidden rounded-sm border border-ink bg-white transition hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy cursor-grab active:cursor-grabbing"
        aria-label={`Drag ${name} pattern`}
        title={name}
      >
        <TilePatternImage
          src={patternSrc}
          className="h-full w-full object-cover"
        />
      </button>
    </div>
  );
}
