import { COMBAT_TICK } from '../constants.js';
import { ITEMS } from '../data/items.js';

export class CombatSystem {
  constructor(chatbox) {
    this.chatbox = chatbox;
    this.combatTimer = 0;
  }

  startCombat(player, target, world) {
    if (!target || target.state === 'dead') return;
    player.inCombat = true;
    player.combatTarget = target;
    player.pendingInteract = null;
    player.pendingSkillAction = null;
    player.skillActionActive = false;

    this.chatbox && this.chatbox.addMessage(`You attack the ${target.name}!`, '#ff8800');

    // Start walking toward target if not already adjacent
    if (!player.isAdjacentTo(target) && world && world.game && world.game.pathfinder) {
      const path = world.game.pathfinder.findPath(
        world.map,
        player.tileX, player.tileY,
        target.tileX, target.tileY
      );
      player.startPath(path);
    }
  }

  stopCombat(player) {
    player.inCombat = false;
    player.combatTarget = null;
    this.combatTimer = 0;
  }

  rollHit(attacker, defender) {
    const attackLevel = attacker.attackLevel !== undefined ? attacker.attackLevel : attacker.def.level;
    const strengthLevel = attacker.strengthLevel !== undefined ? attacker.strengthLevel : attacker.def.level;
    const defenceLevel = defender.defenceLevel !== undefined ? defender.defenceLevel : (defender.def ? defender.def.level : 1);

    const equipAttack = attacker.equipment ? attacker.equipment.getBonus('attackBonus') : (attacker.def ? attacker.def.attackBonus : 0);
    const equipStrength = attacker.equipment ? attacker.equipment.getBonus('strengthBonus') : 0;
    const equipDefence = defender.equipment ? defender.equipment.getBonus('defenceBonus') : (defender.def ? defender.def.defenceBonus : 0);

    // Prayer bonuses (player only)
    const atkPrayerBonus = attacker.getPrayerBonus ? attacker.getPrayerBonus('atkBonus') : 0;
    const strPrayerBonus = attacker.getPrayerBonus ? attacker.getPrayerBonus('strBonus') : 0;

    const effectiveAttack = Math.floor(attackLevel * (1 + atkPrayerBonus));
    const effectiveStrength = Math.floor(strengthLevel * (1 + strPrayerBonus));

    const attackRoll = Math.floor(Math.random() * (effectiveAttack + equipAttack + 1));
    const defenceRoll = Math.floor(Math.random() * (defenceLevel + equipDefence + 1));

    if (attackRoll <= defenceRoll) return 0; // miss

    const maxHit = Math.floor(effectiveStrength * 0.1 + equipStrength * 0.1 + 1.05);
    return Math.floor(Math.random() * (maxHit + 1));
  }

  rollMonsterHit(monster, player) {
    const monsterLevel = monster.def.level;
    const monsterAttack = monster.def.attackBonus || 0;
    const monsterMaxHit = monster.def.maxHit;
    const playerDefence = player.defenceLevel;
    const equipDefence = player.equipment.getBonus('defenceBonus');

    const defPrayerBonus = player.getPrayerBonus ? player.getPrayerBonus('defBonus') : 0;
    const effectiveDefence = Math.floor(playerDefence * (1 + defPrayerBonus));

    const attackRoll = Math.floor(Math.random() * (monsterLevel + monsterAttack + 1));
    const defenceRoll = Math.floor(Math.random() * (effectiveDefence + equipDefence + 1));

    if (attackRoll <= defenceRoll) return 0;
    return Math.floor(Math.random() * (monsterMaxHit + 1));
  }

  calcXp(damage, style) {
    // 4 XP per damage to main style, 1.33 XP to hits
    if (damage <= 0) return [];
    const mainXp = damage * 4;
    const hitsXp = Math.floor(damage * 1.33);

    const xpGains = [];
    if (style === 'attack') {
      xpGains.push({ skill: 'attack', amount: mainXp });
    } else if (style === 'strength') {
      xpGains.push({ skill: 'strength', amount: mainXp });
    } else if (style === 'defence') {
      xpGains.push({ skill: 'defence', amount: mainXp });
    } else if (style === 'controlled') {
      // Controlled: split evenly
      const split = Math.floor(mainXp / 3);
      xpGains.push({ skill: 'attack', amount: split });
      xpGains.push({ skill: 'strength', amount: split });
      xpGains.push({ skill: 'defence', amount: split });
    }
    if (hitsXp > 0) {
      xpGains.push({ skill: 'hits', amount: hitsXp });
    }
    return xpGains;
  }

  update(deltaTime, player, world) {
    if (!player.inCombat || !player.combatTarget) return;

    const target = player.combatTarget;

    // Check if target is dead or gone
    if (target.state === 'dead' || target.hp <= 0) {
      this.stopCombat(player);
      return;
    }

    // If player is not adjacent to target, try to walk there
    if (!player.isAdjacentTo(target)) {
      if (player.path.length === 0) {
        // Pathfind to monster
        if (world.game && world.game.pathfinder) {
          const path = world.game.pathfinder.findPath(
            world.map,
            player.tileX,
            player.tileY,
            target.tileX,
            target.tileY
          );
          player.startPath(path);
        }
      }
      return;
    }

    // Player is adjacent — do combat
    this.combatTimer += deltaTime;
    if (this.combatTimer < COMBAT_TICK) return;
    this.combatTimer -= COMBAT_TICK;

    // Stop path since we're in combat
    player.stopPath();

    // Player hits monster
    const playerDamage = this.rollHit(player, target);
    target.hp = Math.max(0, target.hp - playerDamage);

    if (playerDamage > 0) {
      this.chatbox && this.chatbox.addMessage(
        `You hit ${target.name} for ${playerDamage} damage.`, '#ff8800'
      );
    } else {
      this.chatbox && this.chatbox.addMessage(
        `You miss ${target.name}.`, '#aaaaaa'
      );
    }

    // Show damage popup
    if (world.game && world.game.renderer) {
      world.game.renderer.addDamagePopup(target.x, target.y, playerDamage, false);
    }

    // Give XP
    if (playerDamage > 0) {
      const xpGains = this.calcXp(playerDamage, player.combatStyle);
      for (const gain of xpGains) {
        const leveled = player.gainXp(gain.skill, gain.amount);
        if (leveled) {
          this.chatbox && this.chatbox.addMessage(
            `LEVEL UP! ${gain.skill.charAt(0).toUpperCase() + gain.skill.slice(1)} is now ${player.skills[gain.skill].level}!`,
            '#ffff00'
          );
        }
      }
      // XP popup
      if (world.game && world.game.renderer) {
        const mainGain = xpGains.find(g => g.skill !== 'hits');
        if (mainGain) {
          world.game.renderer.addXpPopup(
            player.x, player.y,
            `+${mainGain.amount} ${mainGain.skill}`,
            '#00ff88'
          );
        }
      }
    }

    // Monster dies
    if (target.hp <= 0) {
      this._handleMonsterDeath(target, player, world);
      return;
    }

    // Monster hits player
    const monsterDamage = this.rollMonsterHit(target, player);
    player.hp = Math.max(0, player.hp - monsterDamage);

    if (monsterDamage > 0) {
      this.chatbox && this.chatbox.addMessage(
        `${target.name} hits you for ${monsterDamage} damage.`, '#ff4444'
      );
    } else {
      this.chatbox && this.chatbox.addMessage(
        `${target.name} misses you.`, '#aaaaaa'
      );
    }

    // Show player damage popup
    if (world.game && world.game.renderer) {
      world.game.renderer.addDamagePopup(player.x, player.y, monsterDamage, true);
    }

    // Player dies
    if (player.hp <= 0) {
      this._handlePlayerDeath(player, world);
    }
  }

  _handleMonsterDeath(monster, player, world) {
    monster.state = 'dead';
    monster.respawnTimer = 0;

    this.chatbox && this.chatbox.addMessage(`You have defeated the ${monster.name}!`, '#ffff00');

    // Drop items
    const drops = monster.getDrops();
    for (const drop of drops) {
      world.dropItem(monster.tileX, monster.tileY, drop.itemId, drop.qty);
      const item = ITEMS[drop.itemId];
      if (item) {
        this.chatbox && this.chatbox.addMessage(
          `${monster.name} drops: ${item.name} x${drop.qty}`, '#aaffaa'
        );
      }
    }

    this.stopCombat(player);
  }

  _handlePlayerDeath(player, world) {
    this.chatbox && this.chatbox.addMessage(
      'Oh dear, you are dead! You respawn at Lumbridge.', '#ff4444'
    );

    // Teleport player to Lumbridge spawn
    const spawn = { x: 62, y: 62 };
    player.tileX = spawn.x;
    player.tileY = spawn.y;
    player.x = spawn.x * 32;
    player.y = spawn.y * 32;
    player.hp = Math.max(1, Math.floor(player.maxHp * 0.5)); // restore half HP on death
    player.stopPath();
    this.stopCombat(player);
  }
}
