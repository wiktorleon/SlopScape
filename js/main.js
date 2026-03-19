import { World } from './game/world.js';
import { Player } from './game/player.js';
import { CombatSystem } from './game/combat.js';
import { Renderer } from './engine/renderer.js';
import { InputHandler } from './engine/input.js';
import { UI } from './ui/ui.js';
import { findPath } from './engine/pathfinding.js';
import { CANVAS_W, CANVAS_H } from './constants.js';
import { SPAWN_POINTS } from './data/map.js';

class Pathfinder {
  findPath(worldMap, startX, startY, endX, endY, maxSteps = 200) {
    return findPath(worldMap, startX, startY, endX, endY, maxSteps);
  }
}

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = CANVAS_W;
    this.canvas.height = CANVAS_H;

    this.lastTimestamp = 0;
    this.running = false;

    // Core systems
    this.world = null;
    this.player = null;
    this.renderer = null;
    this.inputHandler = null;
    this.combat = null;
    this.ui = null;
    this.pathfinder = new Pathfinder();

    // Expose globally for UI HTML callbacks
    window._game = this;
  }

  init() {
    // 1. Create world
    this.world = new World();
    this.world.init();

    // 2. Create player at spawn
    const spawn = SPAWN_POINTS.player;
    this.player = new Player(spawn.x, spawn.y);

    // 3. Create chatbox early (combat needs it)
    // UI will wire everything up
    this.ui = new UI(this);
    this.ui.init();

    // 4. Wire chatbox to systems
    this.chatbox = this.ui.chatbox;

    // 5. Combat
    this.combat = new CombatSystem(this.chatbox);

    // 6. Renderer
    this.renderer = new Renderer(this.canvas, this.world);

    // 7. Input
    this.inputHandler = new InputHandler(this.canvas, this);

    // 8. Wire world back-reference
    this.world.game = this;

    // 9. Player XP callbacks
    this.player.onXpGain = (skillName, amount, levelUp, newLevel) => {
      // XP popup is handled inside player._doSkillAction and combat
    };

    // Welcome message
    this.chatbox.addMessage('Welcome to SlopScape!', '#ffff00');
    this.chatbox.addMessage('Left-click to move. Right-click for options.', '#ffffff');
    this.chatbox.addMessage("Press 'R' to toggle run mode.", '#ffffff');
    this.chatbox.addMessage('Attack monsters by clicking or right-clicking > Attack.', '#ffffff');

    // Start game loop
    this.running = true;
    requestAnimationFrame(t => this.gameLoop(t));
  }

  gameLoop(timestamp) {
    if (!this.running) return;

    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // Cap delta to prevent huge jumps after tab switch
    const cappedDelta = Math.min(deltaTime, 100);

    this.update(cappedDelta);
    this.render();

    requestAnimationFrame(t => this.gameLoop(t));
  }

  update(deltaTime) {
    // World (monsters, NPCs, ground items)
    this.world.update(deltaTime, this.player);

    // Player (movement, skills, prayers)
    this.player.update(deltaTime, this.world);

    // Combat
    this.combat.update(deltaTime, this.player, this.world);

    // UI
    this.ui.update(deltaTime);

    // Renderer popups
    this.renderer.update(deltaTime);

    // Aggressive monster pursuit
    this._updateAggressiveMonsters();
  }

  _updateAggressiveMonsters() {
    for (const monster of this.world.monsters) {
      if (monster.state !== 'aggressive') continue;
      if (!monster.currentTarget) continue;
      if (monster.isAdjacentTo(this.player)) {
        monster.state = 'combat';
      }
    }
  }

  render() {
    this.renderer.render(this.player, this.ui);
    this.ui.render();
  }
}

window.addEventListener('load', () => {
  const game = new Game();
  game.init();
});
