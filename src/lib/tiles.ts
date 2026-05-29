import tilesJson from "@/data/tiles.json";

// Типы и константы, связанные с плитками и корзиной

export type TileId =
  | `tile${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22}`
  | "ocean-wave"
  | "forest-fern"
  | "terracotta-dot"
  | "yellow-star";

export type TileDefinition = {
  id: TileId;
  name: string;
  unitPrice: number;
  imageSrc: string;
};

export type CartItem = TileDefinition & {
  quantity: number;
};

// Каталог

export const TILE_DEFINITIONS: TileDefinition[] = tilesJson as TileDefinition[];

export const ALL_TILE_IDS: TileId[] = TILE_DEFINITIONS.map(
  (t) => t.id as TileId,
);

// Утилиты для работы с плитками

export function findTileDefinition(id: TileId): TileDefinition {
  return TILE_DEFINITIONS.find((t) => t.id === id) ?? TILE_DEFINITIONS[0];
}

export function mapTileIdToNum(tileId: TileId): number {
  if (tileId.startsWith("tile")) {
    return Number(tileId.slice(4));
  }
  return 1;
}

export function getTileSwatchSrc(tileId: TileId): string {
  return findTileDefinition(tileId).imageSrc;
}

export function getTilePatternSrc(tileId: TileId): string {
  return findTileDefinition(tileId).imageSrc;
}

export function tileIdToName(tileId: TileId): string {
  return findTileDefinition(tileId).name;
}

// Начальные данные корзины

export const INITIAL_CART_ITEMS: CartItem[] = [
  { ...findTileDefinition("tile1"), quantity: 150 },
  { ...findTileDefinition("tile8"), quantity: 75 },
  { ...findTileDefinition("tile17"), quantity: 200 },
  { ...findTileDefinition("tile7"), quantity: 50 },
];

// Расположение плиток в дизайне по умолчанию (6x6 сетка, null = пустая ячейка)

export const DEFAULT_DESIGN_GRID: (TileId | null)[] = [
  "tile11",
  "tile4",
  "tile22",
  "tile8",
  null,
  null,
  "tile3",
  "tile15",
  "tile1",
  "tile19",
  null,
  null,
  "tile17",
  "tile6",
  "tile12",
  "tile2",
  null,
  null,
  "tile9",
  "tile21",
  "tile5",
  "tile14",
  null,
  null,
  "tile20",
  "tile7",
  "tile13",
  "tile10",
  null,
  null,
  "tile16",
  "tile18",
  "tile2",
  null,
  null,
  null,
];

// Доп. плитки для демонстрации (не входят в начальную корзину)
export const TILE_MAPPING: Record<string, TileId> = {
  "ocean-wave": "tile1",
  "yellow-star": "tile7",
  "forest-fern": "tile8",
  "terracotta-dot": "tile17",
};
