export const TILE_SIZE = 32;
export const VIEWPORT_COLS = 19;
export const VIEWPORT_ROWS = 13;
export const CANVAS_W = TILE_SIZE * VIEWPORT_COLS; // 608
export const CANVAS_H = TILE_SIZE * VIEWPORT_ROWS; // 416
export const COMBAT_TICK = 1800; // ms
export const WALK_TICK = 600;    // ms per tile
export const RUN_TICK = 300;
export const MAP_WIDTH = 120;
export const MAP_HEIGHT = 120;

export const TILE = {
  GRASS: 0,
  WATER: 1,
  TREE: 2,
  WALL: 3,
  FLOOR: 4,
  PATH: 5,
  SAND: 6,
  ROCK: 7,
  SHALLOW: 8,
  DOOR: 9,
  FENCE: 10,
  ALTAR: 11,
  BANK: 12,
  COUNTER: 13,
  BRIDGE: 14,
  DEEP_WATER: 15
};

export const PANEL = {
  INVENTORY: 0,
  STATS: 1,
  EQUIPMENT: 2,
  PRAYER: 3,
  MAGIC: 4
};
