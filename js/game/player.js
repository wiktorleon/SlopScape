import { Entity } from './entity.js';
import { createSkills, addXp, calcCombatLevel } from './skills.js';
import { Inventory } from './inventory.js';
import { Equipment } from './equipment.js';
import { TILE_SIZE, WALK_TICK, RUN_TICK } from '../constants.js';
import { ITEMS } from '../data/items.js';

export const PRAYERS = [
  { name: 'Thick Skin',       level: 1,  drain: 0.5,  defBonus: 0.05,  key: 'thickSkin' },
  { name: 'Burst of Strength',level: 4,  drain: 0.5,  strBonus: 0.05,  key: 'burstStrength' },
  { name: 'Clarity of Thought',level: 7, drain: 0.5,  atkBonus: 0.05,  key: 'clarityThought' },
  { name: 'Rock Skin',        level: 10, drain: 1.0,  defBonus: 0.10,  key: 'rockSkin' },
  { name: 'Superhuman Strength',level:13,drain: 1.0,  strBonus: 0.10,  key: 'superStrength' },
  { name: 'Improved Reflexes',level: 16, drain: 1.0,  atkBonus: 0.10,  key: 'improvedReflexes' },
  { name: 'Rapid Restore',    level: 19, drain: 0.25, restoreBonus: true, key: 'rapidRestore' },
  { name: 'Rapid Heal',       level: 22, drain: 0.5,  healBonus: true, key: 'rapidHeal' },
  { name: 'Protect Item',     level: 25, drain: 0.5,  protectItem: true, key: 'protectItem' },
  { name: 'Steel Skin',       level: 28, drain: 2.0,  defBonus: 0.15,  key: 'steelSkin' },
  { name: 'Ultimate Strength',level: 31, drain: 2.0,  strBonus: 0.15,  key: 'ultimateStrength' },
  { name: 'Incredible Reflexes',level:34,drain: 2.0,  atkBonus: 0.15,  key: 'incredibleReflexes' },
  { name: 'Protect from Magic',level:37, drain: 2.0,  magicProt: true, key: 'protMagic' },
  { name: 'Protect from Missiles',level:40,drain:2.0, rangedProt:true, key: 'protMissiles' },
  { name: 'Protect from Melee',level:43, drain: 2.0,  meleeProt: true, key: 'protMelee' },
  { name: 'Retribution',      level: 46, drain: 0.5,  retribution: true, key: 'retribution' },
  { name: 'Redemption',       level: 49, drain: 0.5,  redemption: true, key: 'redemption' },
  { name: 'Smite',            level: 52, drain: 2.0,  smite: true,     key: 'smite' },
];

export class Player extends Entity {
  constructor(spawnX, spawnY) {
    super({
      id: 'player',
      name: 'Player',
      tileX: spawnX,
      tileY: spawnY,
      hp: 100,
      maxHp: 100,
      color: '#2255aa',
    });

    this.skills = createSkills();
    this.inventory = new Inventory(28);
    this.equipment = new Equipment();

    // Give starting gear
    this.inventory.addItem(2, 1);   // bronze sword
    this.inventory.addItem(20, 1);  // tinderbox
    this.inventory.addItem(30, 1);  // bronze pickaxe
    this.inventory.addItem(22, 1);  // bronze hatchet
    this.inventory.addItem(40, 3);  // bread
    this.inventory.addItem(0, 25);  // 25 coins

    this.prayerPoints = 10;
    this.maxPrayerPoints = 10;
    this.runEnergy = 100;
    this.isRunning = false;
    this.combatStyle = 'attack'; // attack, strength, defence

    this.activePrayers = {};
    this._prayerDrainAccum = 0;

    // Path following
    this.path = [];
    this.pathIndex = 0;
    this.moveTimer = 0;

    // Pending interactions
    this.pendingInteract = null;
    this.pendingPickup = null;
    this.pendingSkillAction = null;
    this.pendingAction = null;

    // Skill action state
    this.skillActionTimer = 0;
    this.skillActionActive = false;
    this.skillActionData = null;

    // XP popup callback
    this.onXpGain = null;
    this.onLevelUp = null;

    // Combat state
    this.inCombat = false;
    this.combatTarget = null;
  }

  get combatLevel() {
    return calcCombatLevel(this.skills);
  }

  get attackLevel() {
    return this.skills.attack.level;
  }

  get strengthLevel() {
    return this.skills.strength.level;
  }

  get defenceLevel() {
    return this.skills.defence.level;
  }

  get hitsLevel() {
    return this.skills.hits.level;
  }

  get prayerLevel() {
    return this.skills.prayer.level;
  }

  canReach(entity) {
    return this.isAdjacentTo(entity);
  }

  startPath(pathArray) {
    if (!pathArray || pathArray.length === 0) return;
    this.path = pathArray;
    this.pathIndex = 0;
    this.moveTimer = 0;
  }

  stopPath() {
    this.path = [];
    this.pathIndex = 0;
    this.moveTimer = 0;
  }

  gainXp(skillName, amount) {
    const levelUp = addXp(this.skills, skillName, amount);
    const newLevel = this.skills[skillName].level;

    // Update max HP if hits skill leveled up
    if (skillName === 'hits') {
      this.maxHp = newLevel * 10;
    }

    if (this.onXpGain) {
      this.onXpGain(skillName, amount, levelUp, newLevel);
    }
    return levelUp;
  }

  activatePrayer(prayerDef) {
    if (this.skills.prayer.level < prayerDef.level) return false;
    if (this.prayerPoints <= 0) return false;
    this.activePrayers[prayerDef.key] = !this.activePrayers[prayerDef.key];
    return true;
  }

  drainPrayer(deltaTime) {
    let totalDrain = 0;
    for (const [key, active] of Object.entries(this.activePrayers)) {
      if (!active) continue;
      const prayerDef = PRAYERS.find(p => p.key === key);
      if (prayerDef) totalDrain += prayerDef.drain;
    }

    if (totalDrain > 0) {
      this._prayerDrainAccum += totalDrain * (deltaTime / 1000);
      const drainInt = Math.floor(this._prayerDrainAccum);
      if (drainInt > 0) {
        this._prayerDrainAccum -= drainInt;
        this.prayerPoints = Math.max(0, this.prayerPoints - drainInt);
        if (this.prayerPoints <= 0) {
          this.activePrayers = {};
        }
      }
    }
  }

  getPrayerBonus(stat) {
    let bonus = 0;
    for (const [key, active] of Object.entries(this.activePrayers)) {
      if (!active) continue;
      const p = PRAYERS.find(pr => pr.key === key);
      if (p && p[stat]) bonus += p[stat];
    }
    return bonus;
  }

  update(deltaTime, world) {
    // Move along path
    if (this.path.length > 0 && this.pathIndex < this.path.length) {
      const tickTime = this.isRunning ? RUN_TICK : WALK_TICK;
      this.moveTimer += deltaTime;

      if (this.moveTimer >= tickTime) {
        this.moveTimer -= tickTime;

        const nextTile = this.path[this.pathIndex];
        if (nextTile) {
          if (world.isPassable(nextTile.x, nextTile.y)) {
            this.tileX = nextTile.x;
            this.tileY = nextTile.y;
          }
          this.pathIndex++;
        }

        if (this.pathIndex >= this.path.length) {
          this.path = [];
          this.pathIndex = 0;

          // Arrived — check pending actions
          this._handleArrival(world);
        }

        // Run energy drain
        if (this.isRunning) {
          this.runEnergy = Math.max(0, this.runEnergy - 0.4);
          if (this.runEnergy <= 0) {
            this.isRunning = false;
          }
        }
      }
    } else {
      // Recover run energy while standing
      if (this.runEnergy < 100) {
        this.runEnergy = Math.min(100, this.runEnergy + deltaTime * 0.01);
      }
    }

    // Prayer drain
    this.drainPrayer(deltaTime);

    // Skill action tick
    if (this.skillActionActive && this.skillActionData) {
      this.skillActionTimer += deltaTime;
      const tickNeeded = 3000; // 3 second action tick
      if (this.skillActionTimer >= tickNeeded) {
        this.skillActionTimer = 0;
        this._doSkillAction(world);
      }
    }

    // Smooth pixel movement
    super.update(deltaTime);
  }

  _handleArrival(world) {
    // Handle pending interact (NPC)
    if (this.pendingInteract) {
      const npc = this.pendingInteract;
      if (this.isAdjacentTo(npc) || this.distanceTo(npc) <= 2) {
        if (this.pendingAction === 'trade') {
          world.game && world.game.ui.openShop(npc.def.shopId);
        } else if (this.pendingAction === 'bank') {
          world.game && world.game.ui.openBank();
        } else {
          npc.interact(this, world.game && world.game.chatbox);
        }
      }
      this.pendingInteract = null;
      this.pendingAction = null;
    }

    // Handle pending pickup
    if (this.pendingPickup) {
      const { x, y, itemId } = this.pendingPickup;
      const dist = Math.abs(this.tileX - x) + Math.abs(this.tileY - y);
      if (dist <= 1) {
        const picked = world.pickupItem(x, y, itemId);
        if (picked) {
          const added = this.inventory.addItem(itemId, 1);
          if (!added) {
            world.dropItem(x, y, itemId, 1);
            world.game && world.game.chatbox.addMessage("Your inventory is full!", '#ff4444');
          } else {
            const item = ITEMS[itemId];
            world.game && world.game.chatbox.addMessage(`You pick up the ${item ? item.name : 'item'}.`, '#ffffff');
          }
        }
      }
      this.pendingPickup = null;
    }

    // Handle skill actions
    if (this.pendingSkillAction) {
      this.skillActionData = this.pendingSkillAction;
      this.skillActionActive = true;
      this.skillActionTimer = 0;
      this.pendingSkillAction = null;
      // Do first action immediately
      this._doSkillAction(world);
    }
  }

  _doSkillAction(world) {
    if (!this.skillActionData) return;
    const { type, x, y } = this.skillActionData;
    const dist = Math.abs(this.tileX - x) + Math.abs(this.tileY - y);

    if (dist > 1) {
      // Moved away, stop skill action
      this.skillActionActive = false;
      this.skillActionData = null;
      return;
    }

    if (type === 'woodcut') {
      this._doWoodcutting(world, x, y);
    } else if (type === 'mine') {
      this._doMining(world, x, y);
    } else if (type === 'fish') {
      this._doFishing(world, x, y);
    } else if (type === 'altar') {
      this._doAltar(world);
    }
  }

  _doWoodcutting(world, x, y) {
    const tileId = world.tileAt(x, y);
    if (tileId !== 2) { // not a tree
      this.skillActionActive = false;
      return;
    }
    const wcLevel = this.skills.woodcut.level;
    const logId = 72; // normal logs
    if (this.inventory.isFull()) {
      world.game && world.game.chatbox.addMessage("Your inventory is full!", '#ff4444');
      this.skillActionActive = false;
      return;
    }
    const success = Math.random() < (0.3 + wcLevel * 0.007);
    if (success) {
      this.inventory.addItem(logId, 1);
      const xpGained = 25;
      const leveled = this.gainXp('woodcut', xpGained);
      world.game && world.game.chatbox.addMessage(`You chop some logs. (+${xpGained} Woodcutting XP)`, '#ffffff');
      if (leveled) {
        world.game && world.game.chatbox.addMessage(`LEVEL UP! Woodcutting is now ${this.skills.woodcut.level}!`, '#ffff00');
      }
      if (world.game && world.game.renderer) {
        world.game.renderer.addXpPopup(this.x, this.y, `+${xpGained} Woodcutting`, '#88ff88');
      }
    } else {
      world.game && world.game.chatbox.addMessage('You swing at the tree...', '#aaaaaa');
    }
  }

  _doMining(world, x, y) {
    const tileId = world.tileAt(x, y);
    if (tileId !== 7) { // not a rock
      this.skillActionActive = false;
      return;
    }
    const miningLevel = this.skills.mining.level;
    if (this.inventory.isFull()) {
      world.game && world.game.chatbox.addMessage("Your inventory is full!", '#ff4444');
      this.skillActionActive = false;
      return;
    }
    // Check for pickaxe
    const hasPick = this.inventory.hasItem(30) || this.inventory.hasItem(31) ||
                    this.inventory.hasItem(32) || this.inventory.hasItem(33) ||
                    this.inventory.hasItem(34) || this.inventory.hasItem(35) ||
                    this.equipment.slots.weapon?.id >= 30 && this.equipment.slots.weapon?.id <= 35;
    if (!hasPick) {
      world.game && world.game.chatbox.addMessage("You need a pickaxe to mine!", '#ff4444');
      this.skillActionActive = false;
      return;
    }

    const success = Math.random() < (0.25 + miningLevel * 0.007);
    if (success) {
      // Mine copper or tin ore (level 1)
      const oreId = Math.random() < 0.5 ? 55 : 56; // copper or tin
      this.inventory.addItem(oreId, 1);
      const xpGained = 17;
      const leveled = this.gainXp('mining', xpGained);
      const item = ITEMS[oreId];
      world.game && world.game.chatbox.addMessage(`You mine some ${item.name}. (+${xpGained} Mining XP)`, '#ffffff');
      if (leveled) {
        world.game && world.game.chatbox.addMessage(`LEVEL UP! Mining is now ${this.skills.mining.level}!`, '#ffff00');
      }
      if (world.game && world.game.renderer) {
        world.game.renderer.addXpPopup(this.x, this.y, `+${xpGained} Mining`, '#88ff88');
      }
    } else {
      world.game && world.game.chatbox.addMessage('You swing your pickaxe at the rock...', '#aaaaaa');
    }
  }

  _doFishing(world, x, y) {
    const tileId = world.tileAt(x, y);
    if (tileId !== 8) { // not shallow
      this.skillActionActive = false;
      return;
    }
    const fishingLevel = this.skills.fishing.level;
    if (this.inventory.isFull()) {
      world.game && world.game.chatbox.addMessage("Your inventory is full!", '#ff4444');
      this.skillActionActive = false;
      return;
    }

    const success = Math.random() < (0.3 + fishingLevel * 0.008);
    if (success) {
      const fishId = fishingLevel < 20 ? 80 : (fishingLevel < 40 ? 82 : 86); // shrimp, trout, tuna
      this.inventory.addItem(fishId, 1);
      const xpGained = fishingLevel < 20 ? 10 : (fishingLevel < 40 ? 50 : 80);
      const leveled = this.gainXp('fishing', xpGained);
      const item = ITEMS[fishId];
      world.game && world.game.chatbox.addMessage(`You catch a ${item.name}. (+${xpGained} Fishing XP)`, '#ffffff');
      if (leveled) {
        world.game && world.game.chatbox.addMessage(`LEVEL UP! Fishing is now ${this.skills.fishing.level}!`, '#ffff00');
      }
      if (world.game && world.game.renderer) {
        world.game.renderer.addXpPopup(this.x, this.y, `+${xpGained} Fishing`, '#88ff88');
      }
    } else {
      world.game && world.game.chatbox.addMessage('You cast your line...', '#aaaaaa');
    }
  }

  _doAltar(world) {
    const maxPP = this.prayerLevel;
    this.prayerPoints = Math.min(this.maxPrayerPoints, maxPP);
    this.maxPrayerPoints = maxPP;
    world.game && world.game.chatbox.addMessage("You pray at the altar. Prayer points restored.", '#aaffff');
    this.skillActionActive = false;
    this.skillActionData = null;
  }

  eat(slotIndex, world) {
    const slot = this.inventory.getSlot(slotIndex);
    if (!slot) return;
    const item = ITEMS[slot.itemId];
    if (!item || item.type !== 'food') return;

    const healed = Math.min(item.healAmount, this.maxHp - this.hp);
    this.heal(item.healAmount);
    this.inventory.removeItem(slot.itemId, 1);

    world && world.game && world.game.chatbox.addMessage(
      `You eat the ${item.name} and heal ${healed} hits.`,
      '#ffffff'
    );
    if (world && world.game && world.game.renderer) {
      world.game.renderer.addXpPopup(this.x, this.y, `+${healed} HP`, '#00ff88');
    }
  }

  cookFish(slotIndex, world) {
    const slot = this.inventory.getSlot(slotIndex);
    if (!slot) return;
    const item = ITEMS[slot.itemId];
    if (!item || item.type !== 'raw_fish') {
      world && world.game && world.game.chatbox.addMessage("You can only cook raw fish!", '#ff4444');
      return;
    }
    const cookingLevel = this.skills.cooking.level;
    const burnChance = Math.max(0, 0.5 - cookingLevel * 0.01);
    if (Math.random() < burnChance) {
      this.inventory.removeItem(slot.itemId, 1);
      world && world.game && world.game.chatbox.addMessage("You accidentally burn the fish!", '#ff8800');
      return;
    }
    this.inventory.removeItem(slot.itemId, 1);
    const cookedId = item.cookedId;
    this.inventory.addItem(cookedId, 1);
    const xpGained = 30 + cookingLevel;
    this.gainXp('cooking', xpGained);
    const cooked = ITEMS[cookedId];
    world && world.game && world.game.chatbox.addMessage(
      `You cook the ${item.name}. (+${xpGained} Cooking XP)`, '#ffffff'
    );
  }

  lightFire(slotIndex, world) {
    const slot = this.inventory.getSlot(slotIndex);
    if (!slot) return;
    const item = ITEMS[slot.itemId];
    if (!item || item.type !== 'logs') return;

    if (!this.inventory.hasItem(20)) { // tinderbox
      world && world.game && world.game.chatbox.addMessage("You need a tinderbox to light a fire!", '#ff4444');
      return;
    }
    const firemakingLevel = this.skills.firemaking.level;
    if (firemakingLevel < (item.fireLevel || 1)) {
      world && world.game && world.game.chatbox.addMessage("Your firemaking level is too low!", '#ff4444');
      return;
    }
    const success = Math.random() < (0.5 + firemakingLevel * 0.005);
    if (success) {
      this.inventory.removeItem(slot.itemId, 1);
      const xpGained = 40 + firemakingLevel;
      this.gainXp('firemaking', xpGained);
      world && world.game && world.game.chatbox.addMessage(
        `You light a fire. (+${xpGained} Firemaking XP)`, '#ff8800'
      );
    } else {
      world && world.game && world.game.chatbox.addMessage("You fail to light the fire.", '#aaaaaa');
    }
  }

  dropItem(slotIndex, world) {
    const slot = this.inventory.getSlot(slotIndex);
    if (!slot) return;
    this.inventory.removeAtIndex(slotIndex);
    world.dropItem(this.tileX, this.tileY, slot.itemId, slot.qty);
    const item = ITEMS[slot.itemId];
    world.game && world.game.chatbox.addMessage(`You drop the ${item ? item.name : 'item'}.`, '#ffffff');
  }
}
