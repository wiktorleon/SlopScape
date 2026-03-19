import { TILE_SIZE, CANVAS_W, CANVAS_H } from '../constants.js';

export class InputHandler {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.game = game;
    this.mouseX = 0;
    this.mouseY = 0;
    this.keys = {};

    this.canvas.addEventListener('mousemove', e => this._onMouseMove(e));
    this.canvas.addEventListener('click', e => this._onClick(e));
    this.canvas.addEventListener('contextmenu', e => this._onContextMenu(e));
    window.addEventListener('keydown', e => this._onKeyDown(e));
    window.addEventListener('keyup', e => this._onKeyUp(e));
  }

  _getCanvasPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      sx: e.clientX - rect.left,
      sy: e.clientY - rect.top,
    };
  }

  _onMouseMove(e) {
    const { sx, sy } = this._getCanvasPos(e);
    this.mouseX = sx;
    this.mouseY = sy;

    const tile = this.getMouseTile();
    this.game.renderer.hoverTile = tile;
    this.game.renderer.lastMouseScreen = { sx, sy };
  }

  _onClick(e) {
    if (e.button !== 0) return;
    this.game.ui.contextMenu.hide();

    const tile = this.getMouseTile();
    if (!tile) return;

    const { x, y } = tile;

    // Check for entity at tile — default left-click action
    const entity = this.game.world.getEntityAt(x, y);
    if (entity) {
      if (entity.constructor.name === 'Monster' && entity.state !== 'dead') {
        this.game.combat.startCombat(this.game.player, entity, this.game.world);
        return;
      }
      if (entity.constructor.name === 'NPC') {
        // Walk to NPC, then interact
        this.game.player.pendingInteract = entity;
        const path = this.game.pathfinder.findPath(
          this.game.world.map,
          this.game.player.tileX,
          this.game.player.tileY,
          x, y
        );
        this.game.player.startPath(path);
        return;
      }
    }

    // Check for ground items
    const groundItems = this.game.world.getGroundItems(x, y);
    if (groundItems.length > 0) {
      // Walk there then pick up
      this.game.player.pendingPickup = { x, y, itemId: groundItems[0].itemId };
      const path = this.game.pathfinder.findPath(
        this.game.world.map,
        this.game.player.tileX,
        this.game.player.tileY,
        x, y
      );
      this.game.player.startPath(path);
      return;
    }

    // Walk to tile
    const path = this.game.pathfinder.findPath(
      this.game.world.map,
      this.game.player.tileX,
      this.game.player.tileY,
      x, y
    );
    this.game.player.startPath(path);
    this.game.player.pendingInteract = null;
    this.game.player.pendingPickup = null;
    this.game.combat.stopCombat(this.game.player);
  }

  _onContextMenu(e) {
    e.preventDefault();
    const { sx, sy } = this._getCanvasPos(e);
    const tile = this.getMouseTile();
    if (!tile) return;

    const { x, y } = tile;
    const options = [];

    const entity = this.game.world.getEntityAt(x, y);

    if (entity) {
      if (entity.constructor.name === 'Monster' && entity.state !== 'dead') {
        options.push({
          label: `Attack ${entity.name}`,
          action: () => {
            this.game.combat.startCombat(this.game.player, entity, this.game.world);
          }
        });
        options.push({
          label: `Examine ${entity.name}`,
          action: () => {
            this.game.chatbox.addMessage(entity.def.examine, '#aaffaa');
          }
        });
      } else if (entity.constructor.name === 'NPC') {
        options.push({
          label: `Talk-to ${entity.name}`,
          action: () => {
            this.game.player.pendingInteract = entity;
            const path = this.game.pathfinder.findPath(
              this.game.world.map,
              this.game.player.tileX,
              this.game.player.tileY,
              x, y
            );
            this.game.player.startPath(path);
          }
        });
        if (entity.def.shopId !== null) {
          options.push({
            label: `Trade ${entity.name}`,
            action: () => {
              this.game.player.pendingInteract = entity;
              this.game.player.pendingAction = 'trade';
              const path = this.game.pathfinder.findPath(
                this.game.world.map,
                this.game.player.tileX,
                this.game.player.tileY,
                x, y
              );
              this.game.player.startPath(path);
            }
          });
        }
        if (entity.def.isBanker) {
          options.push({
            label: `Bank ${entity.name}`,
            action: () => {
              this.game.player.pendingInteract = entity;
              this.game.player.pendingAction = 'bank';
              const path = this.game.pathfinder.findPath(
                this.game.world.map,
                this.game.player.tileX,
                this.game.player.tileY,
                x, y
              );
              this.game.player.startPath(path);
            }
          });
        }
        options.push({
          label: `Examine ${entity.name}`,
          action: () => {
            this.game.chatbox.addMessage(entity.def.examine, '#aaffaa');
          }
        });
      }
    }

    // Ground items
    const groundItems = this.game.world.getGroundItems(x, y);
    for (const gi of groundItems) {
      const item = this.game.world.itemData[gi.itemId];
      if (!item) continue;
      options.push({
        label: `Pick up ${item.name}`,
        action: () => {
          this.game.player.pendingPickup = { x, y, itemId: gi.itemId };
          const path = this.game.pathfinder.findPath(
            this.game.world.map,
            this.game.player.tileX,
            this.game.player.tileY,
            x, y
          );
          this.game.player.startPath(path);
        }
      });
      options.push({
        label: `Examine ${item.name}`,
        action: () => {
          this.game.chatbox.addMessage(item.examine, '#aaffaa');
        }
      });
    }

    // Tile-based actions
    const tileId = this.game.world.tileAt(x, y);
    if (tileId === 2) { // TREE
      options.push({
        label: 'Chop down tree',
        action: () => {
          this.game.player.pendingSkillAction = { type: 'woodcut', x, y };
          const path = this.game.pathfinder.findPath(
            this.game.world.map,
            this.game.player.tileX,
            this.game.player.tileY,
            x, y
          );
          this.game.player.startPath(path);
        }
      });
    }
    if (tileId === 7) { // ROCK
      options.push({
        label: 'Mine rock',
        action: () => {
          this.game.player.pendingSkillAction = { type: 'mine', x, y };
          const path = this.game.pathfinder.findPath(
            this.game.world.map,
            this.game.player.tileX,
            this.game.player.tileY,
            x, y
          );
          this.game.player.startPath(path);
        }
      });
    }
    if (tileId === 8) { // SHALLOW
      options.push({
        label: 'Fish here',
        action: () => {
          this.game.player.pendingSkillAction = { type: 'fish', x, y };
          const path = this.game.pathfinder.findPath(
            this.game.world.map,
            this.game.player.tileX,
            this.game.player.tileY,
            x, y
          );
          this.game.player.startPath(path);
        }
      });
    }
    if (tileId === 11) { // ALTAR
      options.push({
        label: 'Pray at altar',
        action: () => {
          this.game.player.pendingSkillAction = { type: 'altar', x, y };
          const path = this.game.pathfinder.findPath(
            this.game.world.map,
            this.game.player.tileX,
            this.game.player.tileY,
            x, y
          );
          this.game.player.startPath(path);
        }
      });
    }

    options.push({
      label: 'Walk here',
      action: () => {
        const path = this.game.pathfinder.findPath(
          this.game.world.map,
          this.game.player.tileX,
          this.game.player.tileY,
          x, y
        );
        this.game.player.startPath(path);
        this.game.combat.stopCombat(this.game.player);
      }
    });
    options.push({ label: 'Cancel', action: () => {} });

    // Get viewport-relative position for context menu (fixed positioning)
    const rect = this.canvas.getBoundingClientRect();
    const absX = rect.left + sx;
    const absY = rect.top + sy;
    this.game.ui.contextMenu.show(absX, absY, options);
  }

  _onKeyDown(e) {
    this.keys[e.key] = true;
    if (e.key === 'r' || e.key === 'R') {
      this.game.player.isRunning = !this.game.player.isRunning;
      this.game.chatbox.addMessage(
        this.game.player.isRunning ? 'You are now running.' : 'You are now walking.',
        '#ffffff'
      );
    }
    if (e.key === 'Escape') {
      this.game.ui.contextMenu.hide();
      this.game.ui.closeShop();
      this.game.ui.closeBank();
    }
  }

  _onKeyUp(e) {
    this.keys[e.key] = false;
  }

  getMouseTile() {
    const player = this.game.player;
    const cameraX = Math.max(CANVAS_W / TILE_SIZE / 2, Math.min(120 - CANVAS_W / TILE_SIZE / 2, player.x / TILE_SIZE));
    const cameraY = Math.max(CANVAS_H / TILE_SIZE / 2, Math.min(120 - CANVAS_H / TILE_SIZE / 2, player.y / TILE_SIZE));
    const wx = Math.floor((this.mouseX - CANVAS_W / 2) / TILE_SIZE + cameraX);
    const wy = Math.floor((this.mouseY - CANVAS_H / 2) / TILE_SIZE + cameraY);
    if (wx < 0 || wy < 0 || wx >= 120 || wy >= 120) return null;
    return { x: wx, y: wy };
  }

  getMouseScreen() {
    return { sx: this.mouseX, sy: this.mouseY };
  }

  isKeyDown(key) {
    return !!this.keys[key];
  }
}
