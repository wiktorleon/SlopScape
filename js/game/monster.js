import { Entity } from './entity.js';
import { TILE_SIZE, WALK_TICK, MAP_WIDTH, MAP_HEIGHT } from '../constants.js';

export class Monster extends Entity {
  constructor(monsterDef, tileX, tileY) {
    super({
      id: `monster_${monsterDef.id}_${tileX}_${tileY}_${Math.random().toString(36).slice(2)}`,
      name: monsterDef.name,
      tileX,
      tileY,
      hp: monsterDef.hp,
      maxHp: monsterDef.hp,
      color: monsterDef.color,
    });

    this.def = monsterDef;
    this.spawnX = tileX;
    this.spawnY = tileY;
    this.state = 'idle'; // idle, aggressive, combat, dead, respawning
    this.currentTarget = null;
    this.respawnTimer = 0;
    this.aggroRange = monsterDef.aggressive ? 5 : 3;

    // Wandering
    this.wanderTimer = 0;
    this.wanderCooldown = 2000 + Math.random() * 3000;
    this.path = [];
    this.pathIndex = 0;
    this.moveTimer = 0;
  }

  getDrops() {
    const drops = [];
    for (const drop of this.def.drops) {
      if (Math.random() < drop.chance) {
        drops.push({ itemId: drop.itemId, qty: drop.qty });
      }
    }
    return drops;
  }

  respawn() {
    this.tileX = this.spawnX;
    this.tileY = this.spawnY;
    this.x = this.tileX * TILE_SIZE;
    this.y = this.tileY * TILE_SIZE;
    this.hp = this.maxHp;
    this.state = 'idle';
    this.currentTarget = null;
    this.path = [];
    this.pathIndex = 0;
    this.respawnTimer = 0;
  }

  update(deltaTime, world, player) {
    if (this.state === 'dead' || this.state === 'respawning') {
      this.respawnTimer += deltaTime;
      if (this.respawnTimer >= this.def.respawnTime) {
        this.respawn();
      }
      return;
    }

    // Update pixel position
    super.update(deltaTime);

    // Check aggro toward player
    if (this.state === 'idle' || this.state === 'aggressive') {
      const dist = this.distanceTo(player);
      if (dist <= this.aggroRange && this.def.aggressive) {
        this.state = 'aggressive';
        this.currentTarget = player;
      }
    }

    // Wander when idle
    if (this.state === 'idle') {
      this.wanderTimer += deltaTime;
      if (this.wanderTimer >= this.wanderCooldown && this.path.length === 0) {
        this.wanderTimer = 0;
        this.wanderCooldown = 2000 + Math.random() * 4000;
        this._wander(world);
      }
    }

    // Move along path
    if (this.path.length > 0 && this.pathIndex < this.path.length) {
      this.moveTimer += deltaTime;
      if (this.moveTimer >= WALK_TICK * 1.5) {
        this.moveTimer = 0;
        const next = this.path[this.pathIndex];
        if (next && world.isPassable(next.x, next.y)) {
          this.tileX = next.x;
          this.tileY = next.y;
        }
        this.pathIndex++;
        if (this.pathIndex >= this.path.length) {
          this.path = [];
          this.pathIndex = 0;
        }
      }
    }
  }

  _wander(world) {
    // Pick a random tile nearby spawn
    const radius = 4;
    const tx = this.spawnX + Math.floor((Math.random() - 0.5) * radius * 2);
    const ty = this.spawnY + Math.floor((Math.random() - 0.5) * radius * 2);

    const clampedX = Math.max(1, Math.min(MAP_WIDTH - 2, tx));
    const clampedY = Math.max(1, Math.min(MAP_HEIGHT - 2, ty));

    if (world.isPassable(clampedX, clampedY)) {
      // Simple direct move if adjacent
      const dx = Math.abs(clampedX - this.tileX);
      const dy = Math.abs(clampedY - this.tileY);
      if (dx + dy <= 3) {
        this.path = [{ x: clampedX, y: clampedY }];
        this.pathIndex = 0;
        this.moveTimer = 0;
      }
    }
  }
}
