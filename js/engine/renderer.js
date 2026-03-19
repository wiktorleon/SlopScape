import { TILE_SIZE, VIEWPORT_COLS, VIEWPORT_ROWS, CANVAS_W, CANVAS_H, MAP_WIDTH, MAP_HEIGHT, TILE } from '../constants.js';
import { TILES } from '../data/tiles.js';
import { ITEMS } from '../data/items.js';

export class Renderer {
  constructor(canvas, world) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.world = world;
    this.hoverTile = null;
    this.xpPopups = [];
    this.damagePopups = [];
  }

  addXpPopup(x, y, text, color = '#00ff00') {
    this.xpPopups.push({ x, y, text, color, life: 1.5, maxLife: 1.5 });
  }

  addDamagePopup(x, y, damage, isPlayer = false) {
    const text = damage === 0 ? '0' : `${damage}`;
    const color = damage === 0 ? '#4444ff' : (isPlayer ? '#ff4444' : '#ff8800');
    this.damagePopups.push({ x, y, text, color, life: 1.2, maxLife: 1.2, offsetY: 0 });
  }

  worldToScreen(worldX, worldY, cameraX, cameraY) {
    return {
      sx: (worldX - cameraX) * TILE_SIZE + CANVAS_W / 2,
      sy: (worldY - cameraY) * TILE_SIZE + CANVAS_H / 2,
    };
  }

  screenToWorld(sx, sy, cameraX, cameraY) {
    return {
      wx: Math.floor((sx - CANVAS_W / 2) / TILE_SIZE + cameraX),
      wy: Math.floor((sy - CANVAS_H / 2) / TILE_SIZE + cameraY),
    };
  }

  render(player, ui) {
    const ctx = this.ctx;
    const cameraX = Math.max(VIEWPORT_COLS / 2, Math.min(MAP_WIDTH - VIEWPORT_COLS / 2, player.x / TILE_SIZE));
    const cameraY = Math.max(VIEWPORT_ROWS / 2, Math.min(MAP_HEIGHT - VIEWPORT_ROWS / 2, player.y / TILE_SIZE));

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Calculate visible tile range
    const startTileX = Math.floor(cameraX - VIEWPORT_COLS / 2) - 1;
    const startTileY = Math.floor(cameraY - VIEWPORT_ROWS / 2) - 1;
    const endTileX = startTileX + VIEWPORT_COLS + 2;
    const endTileY = startTileY + VIEWPORT_ROWS + 2;

    // Draw tiles
    for (let ty = startTileY; ty <= endTileY; ty++) {
      for (let tx = startTileX; tx <= endTileX; tx++) {
        if (tx < 0 || ty < 0 || tx >= MAP_WIDTH || ty >= MAP_HEIGHT) continue;
        const { sx, sy } = this.worldToScreen(tx, ty, cameraX, cameraY);
        const tileId = this.world.tileAt(tx, ty);
        this.drawTile(ctx, tileId, sx, sy, tx, ty);
      }
    }

    // Draw hover highlight
    if (this.hoverTile) {
      const { sx, sy } = this.worldToScreen(this.hoverTile.x, this.hoverTile.y, cameraX, cameraY);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(sx, sy, TILE_SIZE, TILE_SIZE);
    }

    // Draw ground items
    for (const gi of this.world.groundItems) {
      if (gi.qty <= 0) continue;
      const { sx, sy } = this.worldToScreen(gi.x, gi.y, cameraX, cameraY);
      if (sx < -TILE_SIZE || sx > CANVAS_W + TILE_SIZE) continue;
      if (sy < -TILE_SIZE || sy > CANVAS_H + TILE_SIZE) continue;
      this.drawGroundItem(ctx, gi, sx, sy);
    }

    // Draw NPCs
    for (const npc of this.world.npcs) {
      const { sx, sy } = this.worldToScreen(npc.x / TILE_SIZE, npc.y / TILE_SIZE, cameraX, cameraY);
      if (sx < -TILE_SIZE || sx > CANVAS_W + TILE_SIZE) continue;
      if (sy < -TILE_SIZE || sy > CANVAS_H + TILE_SIZE) continue;
      this.drawEntity(ctx, npc, sx, sy);
      // NPC name label
      ctx.font = '10px Courier New';
      ctx.fillStyle = '#ffff00';
      ctx.textAlign = 'center';
      ctx.fillText(npc.name, sx + TILE_SIZE / 2, sy - 2);
    }

    // Draw monsters
    for (const monster of this.world.monsters) {
      if (monster.state === 'dead') continue;
      const { sx, sy } = this.worldToScreen(monster.x / TILE_SIZE, monster.y / TILE_SIZE, cameraX, cameraY);
      if (sx < -TILE_SIZE || sx > CANVAS_W + TILE_SIZE) continue;
      if (sy < -TILE_SIZE || sy > CANVAS_H + TILE_SIZE) continue;
      this.drawEntity(ctx, monster, sx, sy);
      if (monster.hp < monster.maxHp) {
        this.drawHealthBar(ctx, monster, sx, sy);
      }
      // Monster name
      ctx.font = '10px Courier New';
      ctx.fillStyle = '#ff6666';
      ctx.textAlign = 'center';
      ctx.fillText(`${monster.name} (${monster.def.level})`, sx + TILE_SIZE / 2, sy - 2);
    }

    // Draw player
    const { sx: psx, sy: psy } = this.worldToScreen(player.x / TILE_SIZE, player.y / TILE_SIZE, cameraX, cameraY);
    this.drawPlayer(ctx, player, psx, psy);

    // HUD: tile coordinates top-left
    ctx.font = '12px Courier New';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(`X:${player.tileX} Y:${player.tileY}`, 5, 15);

    // Player name + combat level top above player
    ctx.font = '11px Courier New';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`Player (${player.combatLevel})`, psx + TILE_SIZE / 2, psy - 14);

    // Draw damage popups
    for (const popup of this.damagePopups) {
      const { sx, sy } = this.worldToScreen(popup.x / TILE_SIZE, popup.y / TILE_SIZE, cameraX, cameraY);
      const alpha = popup.life / popup.maxLife;
      ctx.globalAlpha = alpha;
      ctx.font = 'bold 14px Courier New';
      ctx.fillStyle = popup.color;
      ctx.textAlign = 'center';
      const floatY = sy - (1 - alpha) * 30;
      ctx.fillText(popup.text, sx + TILE_SIZE / 2, floatY);
      ctx.globalAlpha = 1;
    }

    // Draw XP popups
    for (const popup of this.xpPopups) {
      const { sx, sy } = this.worldToScreen(popup.x / TILE_SIZE, popup.y / TILE_SIZE, cameraX, cameraY);
      const alpha = popup.life / popup.maxLife;
      ctx.globalAlpha = alpha;
      ctx.font = '12px Courier New';
      ctx.fillStyle = popup.color;
      ctx.textAlign = 'center';
      const floatY = sy - (1 - alpha) * 40 - 20;
      ctx.fillText(popup.text, sx + TILE_SIZE / 2, floatY);
      ctx.globalAlpha = 1;
    }

    // Hover item tooltip
    if (this.hoverTile) {
      const items = this.world.getGroundItems(this.hoverTile.x, this.hoverTile.y);
      if (items.length > 0) {
        const item = ITEMS[items[0].itemId];
        if (item) {
          const mouseScreen = this.lastMouseScreen || { sx: 0, sy: 0 };
          ctx.font = '11px Courier New';
          const text = `${item.name}`;
          const tw = ctx.measureText(text).width + 10;
          ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.fillRect(mouseScreen.sx + 10, mouseScreen.sy - 15, tw, 18);
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'left';
          ctx.fillText(text, mouseScreen.sx + 15, mouseScreen.sy - 2);
        }
      }
    }
  }

  drawTile(ctx, tileId, screenX, screenY, tx, ty) {
    const tileDef = TILES[tileId] || TILES[0];
    ctx.fillStyle = tileDef.color;
    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

    // Decorations
    if (tileId === TILE.TREE) {
      // Trunk
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.6, TILE_SIZE * 0.2, TILE_SIZE * 0.4);
      // Canopy
      ctx.fillStyle = '#1a4a10';
      ctx.beginPath();
      ctx.arc(screenX + TILE_SIZE / 2, screenY + TILE_SIZE * 0.45, TILE_SIZE * 0.35, 0, Math.PI * 2);
      ctx.fill();
    } else if (tileId === TILE.ROCK) {
      ctx.fillStyle = '#455a64';
      ctx.beginPath();
      ctx.ellipse(screenX + TILE_SIZE / 2, screenY + TILE_SIZE * 0.6, TILE_SIZE * 0.4, TILE_SIZE * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#78909c';
      ctx.beginPath();
      ctx.ellipse(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.45, TILE_SIZE * 0.25, TILE_SIZE * 0.2, -0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (tileId === TILE.WATER || tileId === TILE.DEEP_WATER) {
      // Wave lines
      ctx.strokeStyle = tileId === TILE.DEEP_WATER ? '#1a4a6e' : '#2874a6';
      ctx.lineWidth = 1;
      const waveOffset = (Date.now() / 1000 + tx * 0.3 + ty * 0.5) % 1;
      for (let i = 0; i < 3; i++) {
        const wy = screenY + (i * 10 + waveOffset * 10) % TILE_SIZE;
        ctx.beginPath();
        ctx.moveTo(screenX, wy);
        ctx.bezierCurveTo(
          screenX + TILE_SIZE * 0.3, wy - 2,
          screenX + TILE_SIZE * 0.7, wy + 2,
          screenX + TILE_SIZE, wy
        );
        ctx.stroke();
      }
    } else if (tileId === TILE.PATH) {
      // Path texture - small dots
      ctx.fillStyle = '#c4a882';
      for (let i = 0; i < 3; i++) {
        const px = screenX + ((tx * 7 + i * 11) % (TILE_SIZE - 4)) + 2;
        const py = screenY + ((ty * 13 + i * 7) % (TILE_SIZE - 4)) + 2;
        ctx.fillRect(px, py, 2, 2);
      }
    } else if (tileId === TILE.WALL) {
      // Stone border
      ctx.strokeStyle = '#3e2723';
      ctx.lineWidth = 2;
      ctx.strokeRect(screenX + 1, screenY + 1, TILE_SIZE - 2, TILE_SIZE - 2);
      // Brick pattern
      ctx.fillStyle = '#4a3728';
      const row = ty % 2;
      for (let bx = 0; bx < 2; bx++) {
        const brickX = screenX + bx * TILE_SIZE / 2 + (row === 1 ? TILE_SIZE / 4 : 0);
        ctx.strokeRect(brickX, screenY + 2, TILE_SIZE / 2 - 1, TILE_SIZE / 2 - 2);
        ctx.strokeRect(brickX, screenY + TILE_SIZE / 2 + 2, TILE_SIZE / 2 - 1, TILE_SIZE / 2 - 3);
      }
    } else if (tileId === TILE.SHALLOW) {
      // Fishing spot indicator
      ctx.fillStyle = '#1a6a99';
      ctx.beginPath();
      ctx.arc(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (tileId === TILE.BANK) {
      ctx.fillStyle = '#b8860b';
      ctx.font = 'bold 10px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('B', screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2 + 4);
    } else if (tileId === TILE.ALTAR) {
      ctx.strokeStyle = '#aaaaaa';
      ctx.lineWidth = 2;
      ctx.strokeRect(screenX + 4, screenY + 4, TILE_SIZE - 8, TILE_SIZE - 8);
      // Cross
      ctx.beginPath();
      ctx.moveTo(screenX + TILE_SIZE / 2, screenY + 8);
      ctx.lineTo(screenX + TILE_SIZE / 2, screenY + TILE_SIZE - 8);
      ctx.moveTo(screenX + 8, screenY + TILE_SIZE / 2 - 4);
      ctx.lineTo(screenX + TILE_SIZE - 8, screenY + TILE_SIZE / 2 - 4);
      ctx.stroke();
    } else if (tileId === TILE.DOOR) {
      ctx.strokeStyle = '#4a2c10';
      ctx.lineWidth = 2;
      ctx.strokeRect(screenX + 4, screenY + 2, TILE_SIZE - 8, TILE_SIZE - 4);
      // Door knob
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.5, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (tileId === TILE.FENCE) {
      ctx.strokeStyle = '#5d4037';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(screenX, screenY + TILE_SIZE / 2);
      ctx.lineTo(screenX + TILE_SIZE, screenY + TILE_SIZE / 2);
      ctx.stroke();
      // Posts
      for (let i = 0; i <= 2; i++) {
        const px = screenX + i * TILE_SIZE / 2;
        ctx.beginPath();
        ctx.moveTo(px, screenY + 4);
        ctx.lineTo(px, screenY + TILE_SIZE - 4);
        ctx.stroke();
      }
    } else if (tileId === TILE.BRIDGE) {
      // Bridge planks
      ctx.fillStyle = '#6d4c30';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(screenX + 1, screenY + i * 8 + 2, TILE_SIZE - 2, 5);
      }
    }
  }

  drawGroundItem(ctx, gi, screenX, screenY) {
    const item = ITEMS[gi.itemId];
    if (!item) return;
    // Small colored square on ground
    let color = '#ffff00';
    if (item.type === 'food') color = '#ff8800';
    else if (item.type === 'weapon') color = '#cccccc';
    else if (item.type === 'armour') color = '#888888';
    else if (item.type === 'currency') color = '#ffd700';
    else if (item.type === 'rune') color = '#8888ff';
    else if (item.type === 'logs') color = '#8B4513';
    else if (item.type === 'ore') color = '#666666';

    ctx.fillStyle = color;
    ctx.fillRect(screenX + 10, screenY + 16, 12, 10);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(screenX + 10, screenY + 16, 12, 10);
  }

  drawEntity(ctx, entity, screenX, screenY) {
    const color = entity.color || '#888888';
    ctx.fillStyle = color;
    ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
  }

  drawPlayer(ctx, player, screenX, screenY) {
    // Player body (blue)
    ctx.fillStyle = '#2255aa';
    ctx.fillRect(screenX + 3, screenY + 3, TILE_SIZE - 6, TILE_SIZE - 6);

    // White highlight border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX + 3, screenY + 3, TILE_SIZE - 6, TILE_SIZE - 6);

    // Cross mark
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(screenX + TILE_SIZE / 2, screenY + 6);
    ctx.lineTo(screenX + TILE_SIZE / 2, screenY + TILE_SIZE - 6);
    ctx.moveTo(screenX + 6, screenY + TILE_SIZE / 2);
    ctx.lineTo(screenX + TILE_SIZE - 6, screenY + TILE_SIZE / 2);
    ctx.stroke();

    // Health bar
    this.drawHealthBar(ctx, player, screenX, screenY);
  }

  drawHealthBar(ctx, entity, screenX, screenY) {
    const barW = TILE_SIZE - 4;
    const barH = 4;
    const barY = screenY - 8;
    const ratio = entity.hp / entity.maxHp;

    ctx.fillStyle = '#333333';
    ctx.fillRect(screenX + 2, barY, barW, barH);

    let barColor;
    if (ratio > 0.6) barColor = '#00cc00';
    else if (ratio > 0.3) barColor = '#cccc00';
    else barColor = '#cc0000';

    ctx.fillStyle = barColor;
    ctx.fillRect(screenX + 2, barY, Math.max(0, barW * ratio), barH);
  }

  drawMinimap(ctx, world, player) {
    const mmW = 120;
    const mmH = 120;
    const mmX = 0;
    const mmY = 0;
    const scale = mmW / 120;

    ctx.fillStyle = '#000033';
    ctx.fillRect(mmX, mmY, mmW, mmH);

    // Draw tiles (compressed)
    for (let ty = 0; ty < 120; ty++) {
      for (let tx = 0; tx < 120; tx++) {
        const tileId = world.tileAt(tx, ty);
        const tileDef = TILES[tileId];
        if (tileId === 0) continue; // skip grass for perf
        ctx.fillStyle = tileDef ? tileDef.color : '#4a7c3f';
        ctx.fillRect(mmX + tx * scale, mmY + ty * scale, Math.max(1, scale), Math.max(1, scale));
      }
    }

    // Draw player dot (bright white, 3x3)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(
      mmX + player.tileX * scale - 1,
      mmY + player.tileY * scale - 1,
      3, 3
    );
    // Player center (red dot)
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(
      mmX + player.tileX * scale,
      mmY + player.tileY * scale,
      1, 1
    );

    // Border
    ctx.strokeStyle = '#665500';
    ctx.lineWidth = 1;
    ctx.strokeRect(mmX, mmY, mmW, mmH);
  }

  update(deltaTime) {
    // Update popups
    this.xpPopups = this.xpPopups.filter(p => {
      p.life -= deltaTime / 1000;
      return p.life > 0;
    });
    this.damagePopups = this.damagePopups.filter(p => {
      p.life -= deltaTime / 1000;
      return p.life > 0;
    });
  }
}
