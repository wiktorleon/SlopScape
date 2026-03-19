import { TILE, MAP_WIDTH, MAP_HEIGHT } from '../constants.js';

function fillRect(map, x1, y1, x2, y2, tileId) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      if (y >= 0 && y < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
        map[y][x] = tileId;
      }
    }
  }
}

function drawHLine(map, y, x1, x2, tileId) {
  for (let x = x1; x <= x2; x++) {
    if (y >= 0 && y < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
      map[y][x] = tileId;
    }
  }
}

function drawVLine(map, x, y1, y2, tileId) {
  for (let y = y1; y <= y2; y++) {
    if (y >= 0 && y < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
      map[y][x] = tileId;
    }
  }
}

function drawBorder(map, x1, y1, x2, y2, tileId) {
  drawHLine(map, y1, x1, x2, tileId);
  drawHLine(map, y2, x1, x2, tileId);
  drawVLine(map, x1, y1, y2, tileId);
  drawVLine(map, x2, y1, y2, tileId);
}

export function generateMap() {
  // Initialize all to grass
  const map = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    map[y] = new Array(MAP_WIDTH).fill(TILE.GRASS);
  }

  // --- Forest: dense north and west ---
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (x < 38 || y < 38) {
        // Dense forest with some path breaks
        const noise = Math.sin(x * 0.7 + y * 1.3) * Math.cos(x * 1.1 - y * 0.8);
        if (noise > -0.3) {
          map[y][x] = TILE.TREE;
        }
      }
    }
  }

  // --- River running north-south around x=78-82 ---
  for (let y = 0; y < MAP_HEIGHT; y++) {
    // Deep center
    map[y][79] = TILE.DEEP_WATER;
    map[y][80] = TILE.DEEP_WATER;
    // Water
    map[y][78] = TILE.WATER;
    map[y][81] = TILE.WATER;
    // Shallow edges (fishing spots)
    map[y][77] = TILE.SHALLOW;
    map[y][82] = TILE.SHALLOW;
  }

  // --- Bridge crossing river at y=58-62 ---
  for (let y = 58; y <= 62; y++) {
    for (let x = 77; x <= 82; x++) {
      map[y][x] = TILE.BRIDGE;
    }
  }

  // --- Lumbridge Castle ---
  // Castle walls outer ring (55,52)-(72,72)
  fillRect(map, 55, 52, 72, 72, TILE.FLOOR);
  drawBorder(map, 55, 52, 72, 72, TILE.WALL);

  // Inner courtyard (57,54)-(70,70)
  fillRect(map, 57, 54, 70, 70, TILE.FLOOR);

  // Castle walls with openings
  // South gate at x=62-64, y=72 (entrance)
  map[72][62] = TILE.DOOR;
  map[72][63] = TILE.DOOR;
  map[72][64] = TILE.DOOR;

  // North gate at x=62-64, y=52
  map[52][62] = TILE.DOOR;
  map[52][63] = TILE.DOOR;

  // West gate at x=55, y=61-62
  map[61][55] = TILE.DOOR;
  map[62][55] = TILE.DOOR;

  // East gate at x=72, y=61-62
  map[61][72] = TILE.DOOR;
  map[62][72] = TILE.DOOR;

  // Castle interior rooms
  // Throne room (north)
  fillRect(map, 57, 54, 70, 58, TILE.FLOOR);
  // Kitchen (west wing)
  fillRect(map, 57, 60, 60, 68, TILE.FLOOR);

  // --- Bank: (58,50)-(64,53) ---
  fillRect(map, 58, 50, 64, 53, TILE.FLOOR);
  drawBorder(map, 58, 50, 64, 53, TILE.WALL);
  // Bank counter across south wall
  for (let x = 59; x <= 63; x++) {
    map[53][x] = TILE.BANK;
  }
  // Bank door
  map[53][61] = TILE.FLOOR;
  // Entry door
  map[50][61] = TILE.DOOR;

  // --- Church: (44,48)-(50,56) ---
  fillRect(map, 44, 48, 50, 56, TILE.FLOOR);
  drawBorder(map, 44, 48, 50, 56, TILE.WALL);
  // Altar
  map[50][47] = TILE.ALTAR;
  map[50][48] = TILE.ALTAR;
  // Church door
  map[56][47] = TILE.DOOR;
  map[56][48] = TILE.DOOR;

  // --- General store: (47,55)-(53,60) ---
  fillRect(map, 47, 55, 53, 60, TILE.FLOOR);
  drawBorder(map, 47, 55, 53, 60, TILE.WALL);
  // Counter
  map[55][48] = TILE.COUNTER;
  map[55][49] = TILE.COUNTER;
  map[55][50] = TILE.COUNTER;
  // Shop door
  map[60][49] = TILE.DOOR;
  map[60][50] = TILE.DOOR;

  // --- Path network ---
  // Main road south through town (y=62-75, x=61-65)
  for (let y = 62; y <= 75; y++) {
    for (let x = 60; x <= 65; x++) {
      if (map[y][x] === TILE.GRASS) map[y][x] = TILE.PATH;
    }
  }
  // East road to bridge (y=60-62, x=55-77)
  for (let x = 55; x <= 77; x++) {
    if (map[60][x] === TILE.GRASS || map[60][x] === TILE.FLOOR) {
      if (map[60][x] === TILE.GRASS) map[60][x] = TILE.PATH;
    }
    if (map[61][x] === TILE.GRASS) map[61][x] = TILE.PATH;
    if (map[62][x] === TILE.GRASS) map[62][x] = TILE.PATH;
  }
  // West road toward Draynor (y=61-63, x=38-55)
  for (let x = 38; x <= 55; x++) {
    if (map[61][x] === TILE.GRASS || map[61][x] === TILE.TREE) map[61][x] = TILE.PATH;
    if (map[62][x] === TILE.GRASS || map[62][x] === TILE.TREE) map[62][x] = TILE.PATH;
  }
  // Path north to bank
  for (let y = 52; y <= 62; y++) {
    if (map[y][63] === TILE.GRASS) map[y][63] = TILE.PATH;
  }

  // --- Cow field: x=83-105, y=48-74 enclosed by fence ---
  drawBorder(map, 83, 48, 105, 74, TILE.FENCE);
  // Fence gate opening
  map[74][93] = TILE.GRASS;
  map[74][94] = TILE.GRASS;

  // --- Goblin camp: x=55-72, y=78-98 ---
  for (let y = 78; y <= 98; y++) {
    for (let x = 55; x <= 72; x++) {
      if (map[y][x] === TILE.GRASS) {
        const noise = Math.sin(x * 1.5 + y * 0.9);
        map[y][x] = noise > 0 ? TILE.PATH : TILE.GRASS;
      }
    }
  }

  // --- Scattered trees in open areas ---
  const treePositions = [
    [40,42],[41,44],[43,40],[39,43],[44,41],
    [48,42],[49,40],[50,43],[51,41],[52,44],
    [40,65],[41,68],[42,70],[43,67],[44,72],
    [45,42],[46,44],[47,40],[45,75],[46,78],
    [48,77],[49,79],[50,80],[51,78],[52,76],
    [106,42],[107,44],[108,40],[109,43],[110,45],
    [106,60],[107,62],[108,58],[109,64],[110,60],
    [40,85],[41,88],[42,90],[43,87],[44,92],
    [108,80],[109,82],[110,78],[111,84],[112,80],
  ];
  for (const [y, x] of treePositions) {
    if (y >= 0 && y < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
      if (map[y][x] === TILE.GRASS) {
        map[y][x] = TILE.TREE;
      }
    }
  }

  // --- Mining rocks ---
  // Western cluster (around x=40, y=70)
  const rockPositions1 = [
    [40,70],[40,71],[40,72],[41,70],[41,71],[41,72],
    [42,70],[42,71],[43,72],[43,73],
  ];
  for (const [y, x] of rockPositions1) {
    if (map[y][x] === TILE.GRASS || map[y][x] === TILE.TREE) map[y][x] = TILE.ROCK;
  }

  // Eastern cluster (around x=110, y=40)
  const rockPositions2 = [
    [40,108],[40,109],[40,110],[41,108],[41,109],[41,110],
    [42,108],[42,109],[43,110],[43,111],
  ];
  for (const [y, x] of rockPositions2) {
    if (y >= 0 && y < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
      if (map[y][x] === TILE.GRASS || map[y][x] === TILE.TREE) map[y][x] = TILE.ROCK;
    }
  }

  // Additional rocks near goblin area
  const rockPositions3 = [
    [85,50],[85,51],[86,50],[86,52],[87,51],
  ];
  for (const [y, x] of rockPositions3) {
    if (map[y][x] === TILE.GRASS) map[y][x] = TILE.ROCK;
  }

  // --- Al Kharid gate area: x=113-115, y=55-65 ---
  for (let y = 55; y <= 65; y++) {
    map[y][113] = TILE.WALL;
  }
  // Gate opening
  map[60][113] = TILE.DOOR;
  map[61][113] = TILE.DOOR;

  // Al Kharid sandy area (east of river)
  for (let y = 45; y <= 80; y++) {
    for (let x = 83; x <= 113; x++) {
      if (map[y][x] === TILE.GRASS) {
        // Sandy/path area east of river
        if (x > 90) {
          const sand = Math.sin(x * 0.5 + y * 0.7) > 0.2;
          if (sand) map[y][x] = TILE.SAND;
        }
      }
    }
  }

  // Path east of bridge to Al Kharid
  for (let x = 82; x <= 113; x++) {
    if (map[60][x] === TILE.GRASS || map[60][x] === TILE.SAND) map[60][x] = TILE.PATH;
    if (map[61][x] === TILE.GRASS || map[61][x] === TILE.SAND) map[61][x] = TILE.PATH;
  }

  // Map boundary water/deep water
  for (let x = 0; x < MAP_WIDTH; x++) {
    map[0][x] = TILE.DEEP_WATER;
    map[MAP_HEIGHT-1][x] = TILE.DEEP_WATER;
  }
  for (let y = 0; y < MAP_HEIGHT; y++) {
    map[y][0] = TILE.DEEP_WATER;
    map[y][MAP_WIDTH-1] = TILE.DEEP_WATER;
  }

  return map;
}

export const SPAWN_POINTS = {
  player: { x: 62, y: 62 },
  monsters: [
    { monsterId: 0, x: 65, y: 75, count: 8 },   // chickens south of castle
    { monsterId: 1, x: 92, y: 60, count: 5 },   // cows in field
    { monsterId: 2, x: 62, y: 88, count: 8 },   // goblins south
    { monsterId: 4, x: 68, y: 68, count: 6 },   // spiders in castle area
    { monsterId: 5, x: 50, y: 62, count: 4 },   // men west of town
    { monsterId: 6, x: 56, y: 58, count: 3 },   // guards
    { monsterId: 9, x: 72, y: 72, count: 5 },   // skeletons
    { monsterId: 8, x: 70, y: 70, count: 5 },   // zombies
  ],
  npcs: [
    { npcId: 0, x: 60, y: 64 },  // Hans
    { npcId: 1, x: 60, y: 59 },  // Cook
    { npcId: 5, x: 61, y: 51 },  // Banker (in front of bank)
    { npcId: 6, x: 49, y: 57 },  // General store
    { npcId: 3, x: 50, y: 58 },  // Bob axes
  ],
};
