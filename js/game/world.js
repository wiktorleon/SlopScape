import { generateMap, SPAWN_POINTS } from '../data/map.js';
import { MONSTERS } from '../data/monsters.js';
import { NPCS } from '../data/npcs.js';
import { ITEMS } from '../data/items.js';
import { TILES } from '../data/tiles.js';
import { Monster } from './monster.js';
import { NPC } from './npc.js';
import { MAP_WIDTH, MAP_HEIGHT } from '../constants.js';

export class World {
  constructor() {
    this.map = null;
    this.monsters = [];
    this.npcs = [];
    this.groundItems = [];
    this.game = null; // set by Game after construction
    this.itemData = ITEMS;
  }

  init() {
    this.map = generateMap();
    this.spawnNpcs();
    this.spawnMonsters();
  }

  tileAt(x, y) {
    if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return 3; // wall
    return this.map[y][x];
  }

  isPassable(x, y) {
    if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return false;
    const tileId = this.map[y][x];
    const tileDef = TILES[tileId];
    return tileDef ? tileDef.passable : false;
  }

  getEntityAt(x, y) {
    // Check monsters first
    for (const monster of this.monsters) {
      if (monster.state === 'dead') continue;
      if (monster.tileX === x && monster.tileY === y) return monster;
    }
    // Check NPCs
    for (const npc of this.npcs) {
      if (npc.tileX === x && npc.tileY === y) return npc;
    }
    return null;
  }

  getGroundItems(x, y) {
    return this.groundItems.filter(gi => gi.x === x && gi.y === y && gi.qty > 0);
  }

  dropItem(x, y, itemId, qty) {
    const existing = this.groundItems.find(gi => gi.x === x && gi.y === y && gi.itemId === itemId);
    if (existing) {
      existing.qty += qty;
    } else {
      this.groundItems.push({ x, y, itemId, qty, spawnTime: Date.now() });
    }
  }

  pickupItem(x, y, itemId) {
    const idx = this.groundItems.findIndex(gi => gi.x === x && gi.y === y && gi.itemId === itemId && gi.qty > 0);
    if (idx === -1) return false;
    this.groundItems[idx].qty--;
    if (this.groundItems[idx].qty <= 0) {
      this.groundItems.splice(idx, 1);
    }
    return true;
  }

  spawnMonsters() {
    this.monsters = [];
    for (const spawnPoint of SPAWN_POINTS.monsters) {
      const monsterDef = MONSTERS[spawnPoint.monsterId];
      if (!monsterDef) continue;
      for (let i = 0; i < spawnPoint.count; i++) {
        // Spread monsters around the spawn point
        const offsetX = Math.floor((Math.random() - 0.5) * 6);
        const offsetY = Math.floor((Math.random() - 0.5) * 6);
        const tx = Math.max(1, Math.min(MAP_WIDTH - 2, spawnPoint.x + offsetX));
        const ty = Math.max(1, Math.min(MAP_HEIGHT - 2, spawnPoint.y + offsetY));

        if (this.isPassable(tx, ty)) {
          const monster = new Monster(monsterDef, tx, ty);
          this.monsters.push(monster);
        } else {
          // Try spawn point directly
          const monster = new Monster(monsterDef, spawnPoint.x, spawnPoint.y);
          this.monsters.push(monster);
        }
      }
    }
  }

  spawnNpcs() {
    this.npcs = [];
    for (const spawnPoint of SPAWN_POINTS.npcs) {
      const npcDef = NPCS[spawnPoint.npcId];
      if (!npcDef) continue;
      const npc = new NPC(npcDef, spawnPoint.x, spawnPoint.y);
      this.npcs.push(npc);
    }
  }

  update(deltaTime, player) {
    // Update monsters
    for (const monster of this.monsters) {
      monster.update(deltaTime, this, player);
    }

    // Update NPCs
    for (const npc of this.npcs) {
      npc.update(deltaTime);
    }

    // Clean up old ground items (after 5 minutes)
    const now = Date.now();
    this.groundItems = this.groundItems.filter(gi => {
      return !gi.spawnTime || (now - gi.spawnTime) < 300000;
    });
  }
}
