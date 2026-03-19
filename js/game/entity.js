import { TILE_SIZE } from '../constants.js';

export class Entity {
  constructor({ id, name, x, y, tileX, tileY, hp, maxHp, color }) {
    this.id = id;
    this.name = name;
    this.tileX = tileX !== undefined ? tileX : x;
    this.tileY = tileY !== undefined ? tileY : y;
    // Pixel position (for smooth animation)
    this.x = (this.tileX) * TILE_SIZE;
    this.y = (this.tileY) * TILE_SIZE;
    this.hp = hp;
    this.maxHp = maxHp;
    this.color = color || '#888888';
  }

  get isDead() {
    return this.hp <= 0;
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    return this.isDead;
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  // Smoothly lerp pixel position toward tile position
  update(deltaTime) {
    const targetX = this.tileX * TILE_SIZE;
    const targetY = this.tileY * TILE_SIZE;
    const speed = 10; // lerp speed multiplier
    const dt = deltaTime / 1000;

    const dx = targetX - this.x;
    const dy = targetY - this.y;

    if (Math.abs(dx) < 1) {
      this.x = targetX;
    } else {
      this.x += dx * Math.min(1, speed * dt);
    }

    if (Math.abs(dy) < 1) {
      this.y = targetY;
    } else {
      this.y += dy * Math.min(1, speed * dt);
    }
  }

  distanceTo(other) {
    return Math.sqrt(
      Math.pow(this.tileX - other.tileX, 2) +
      Math.pow(this.tileY - other.tileY, 2)
    );
  }

  isAdjacentTo(other) {
    return this.distanceTo(other) <= 1.5;
  }
}
