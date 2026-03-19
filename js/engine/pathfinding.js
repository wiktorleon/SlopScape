import { TILES } from '../data/tiles.js';
import { MAP_WIDTH, MAP_HEIGHT } from '../constants.js';

function heuristic(ax, ay, bx, by) {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

function tilePassable(worldMap, x, y) {
  if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
  const tileId = worldMap[y][x];
  const tileDef = TILES[tileId];
  return tileDef ? tileDef.passable : false;
}

const key = (x, y) => `${x},${y}`;

function parsePosFromKey(k) {
  const parts = k.split(',');
  return { x: parseInt(parts[0], 10), y: parseInt(parts[1], 10) };
}

export function findPath(worldMap, startX, startY, endX, endY, maxSteps = 200) {
  // If target is impassable, find adjacent passable tile
  let targetX = endX;
  let targetY = endY;

  if (!tilePassable(worldMap, targetX, targetY)) {
    const adjacents = [
      { x: targetX - 1, y: targetY },
      { x: targetX + 1, y: targetY },
      { x: targetX, y: targetY - 1 },
      { x: targetX, y: targetY + 1 },
    ];
    let found = false;
    for (const adj of adjacents) {
      if (tilePassable(worldMap, adj.x, adj.y)) {
        targetX = adj.x;
        targetY = adj.y;
        found = true;
        break;
      }
    }
    if (!found) return [];
  }

  if (startX === targetX && startY === targetY) return [];

  // A* implementation
  // openSet: keys of nodes yet to be evaluated
  const openSet = new Set();
  // allNodes: key -> {x, y} for reconstruction
  const allNodes = new Map();
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  const startKey = key(startX, startY);
  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(startX, startY, targetX, targetY));
  openSet.add(startKey);
  allNodes.set(startKey, { x: startX, y: startY });

  let iterations = 0;

  while (openSet.size > 0 && iterations < maxSteps * 8) {
    iterations++;

    // Find node in openSet with lowest fScore
    let currentKey = null;
    let lowestF = Infinity;
    for (const k of openSet) {
      const f = fScore.get(k) ?? Infinity;
      if (f < lowestF) {
        lowestF = f;
        currentKey = k;
      }
    }

    if (!currentKey) break;

    const current = allNodes.get(currentKey);

    if (current.x === targetX && current.y === targetY) {
      // Reconstruct path
      const path = [];
      let ck = currentKey;
      while (cameFrom.has(ck)) {
        const node = allNodes.get(ck);
        path.unshift({ x: node.x, y: node.y });
        ck = cameFrom.get(ck);
      }
      return path.slice(0, maxSteps);
    }

    openSet.delete(currentKey);

    // Neighbors: 4-directional
    const cx = current.x;
    const cy = current.y;
    const neighbors = [
      { x: cx - 1, y: cy },
      { x: cx + 1, y: cy },
      { x: cx, y: cy - 1 },
      { x: cx, y: cy + 1 },
    ];

    const currentG = gScore.get(currentKey) ?? 0;

    for (const neighbor of neighbors) {
      if (!tilePassable(worldMap, neighbor.x, neighbor.y)) continue;

      const nKey = key(neighbor.x, neighbor.y);
      const tentativeG = currentG + 1;

      if (tentativeG < (gScore.get(nKey) ?? Infinity)) {
        cameFrom.set(nKey, currentKey);
        gScore.set(nKey, tentativeG);
        fScore.set(nKey, tentativeG + heuristic(neighbor.x, neighbor.y, targetX, targetY));
        if (!allNodes.has(nKey)) {
          allNodes.set(nKey, { x: neighbor.x, y: neighbor.y });
        }
        if (!openSet.has(nKey)) {
          openSet.add(nKey);
        }
      }
    }
  }

  return []; // No path found
}
