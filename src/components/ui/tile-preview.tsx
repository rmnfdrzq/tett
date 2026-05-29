import type { TileId } from "@/lib/tiles";
import { getTileSwatchSrc, tileIdToName } from "@/lib/tiles";
import { TilePatternImage } from "@/components/ui/TilePatternImage";

type TilePreviewProps = {
  tileId: TileId;
  size?: "xs" | "sm" | "md" | "lg" | "collection" | "item";
  label?: boolean;
};

const sizeClasses = {
  xs: "h-[18px] w-[18px]",
  sm: "h-9 w-9",
  md: "h-14 w-14",
  lg: "h-20 w-20",
  collection: "w-full max-w-[3rem] aspect-square mx-auto",
  item: "w-full max-w-[3.5rem] aspect-square mx-auto",
};

export function TilePreview({ tileId, size = "md", label = false }: TilePreviewProps) {
  const swatchSrc = getTileSwatchSrc(tileId);
  const name = tileIdToName(tileId);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`${sizeClasses[size]} bg-cream border-2 border-ink overflow-hidden flex items-center justify-center rounded-sm`}>
        <TilePatternImage
          src={swatchSrc}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
      {label ? (
        <span className="tile-preview-label">{name}</span>
      ) : null}
    </div>
  );
}

export function TilePattern({ tileId }: { tileId: TileId }) {
  if (tileId === "ocean-wave") {
    return (
      <>
        <rect width="80" height="80" className="fill-tile-preview" />
        <path d="M-8 22 C8 8 21 8 38 22 S67 36 88 18" fill="none" className="stroke-navy" strokeWidth="7" />
        <path d="M-9 38 C10 24 23 24 40 38 S69 51 88 34" fill="none" className="stroke-navy" strokeWidth="6" />
        <path d="M-8 54 C12 40 26 40 44 54 S70 66 88 50" fill="none" className="stroke-navy" strokeWidth="6" />
        <path d="M-8 28 C9 17 23 17 40 29 S68 42 88 25" fill="none" className="stroke-navy-muted" strokeWidth="2" />
        <path d="M-8 44 C11 33 25 33 42 45 S70 58 88 41" fill="none" className="stroke-navy-muted" strokeWidth="2" />
      </>
    );
  }

  if (tileId === "forest-fern") {
    return (
      <>
        <rect width="80" height="80" className="fill-tile-preview" />
        {[12, 32, 52].map((x, index) => (
          <g key={x} transform={`translate(${x} ${index % 2 ? 2 : 10}) rotate(-25)`}>
            <path d="M0 60 C8 43 12 25 10 4" fill="none" className="stroke-teal-dark" strokeWidth="4" />
            {Array.from({ length: 7 }, (_, leaf) => (
              <path
                key={leaf}
                d={`M${leaf % 2 ? 10 : 2} ${50 - leaf * 7} C${leaf % 2 ? 23 : -8} ${
                  43 - leaf * 7
                } ${leaf % 2 ? 23 : -7} ${36 - leaf * 7} ${leaf % 2 ? 12 : 8} ${36 - leaf * 7}`}
                fill="none"
                className="stroke-teal"
                strokeWidth="3"
              />
            ))}
          </g>
        ))}
      </>
    );
  }

  if (tileId === "terracotta-dot") {
    return (
      <>
        <rect width="80" height="80" className="fill-tile-preview" />
        {[
          [17, 15, 7],
          [43, 15, 10],
          [66, 18, 7],
          [24, 39, 12],
          [54, 42, 8],
          [15, 64, 7],
          [43, 63, 10],
          [67, 63, 7],
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} className="fill-terracotta" />
        ))}
      </>
    );
  }

  return (
    <>
      <rect width="80" height="80" className="fill-tile-preview" />
      <g className="fill-mustard">
        <path d="M40 8 48 30 72 22 55 42 70 62 47 55 39 75 31 54 8 63 25 43 10 23 33 30Z" />
        <circle cx="14" cy="14" r="4" />
        <circle cx="67" cy="12" r="4" />
        <circle cx="68" cy="69" r="4" />
      </g>
    </>
  );
}
