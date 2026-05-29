"use client";

import type { TileId } from "@/lib/tiles";
import { getTilePatternSrc } from "@/lib/tiles";
import { TilePatternImage } from "@/components/ui/TilePatternImage";

export function PaletteTilePreview({ tileId }: { tileId: TileId }) {
  const patternSrc = getTilePatternSrc(tileId);
  return (
    <div className="h-14 w-14 overflow-hidden rounded-md border border-ink shadow-xl sm:h-16 sm:w-16">
      <TilePatternImage src={patternSrc} className="h-full w-full object-cover" />
    </div>
  );
}
