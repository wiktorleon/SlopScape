import { PANEL } from '../constants.js';
import { ITEMS } from '../data/items.js';
import { SKILL_NAMES, XP_TABLE } from '../game/skills.js';
import { PRAYERS } from '../game/player.js';

const SKILL_COLORS = {
  attack:     '#cc0000',
  defence:    '#ffff00',
  strength:   '#00aa00',
  hits:       '#00aaaa',
  ranged:     '#44aa44',
  prayer:     '#aaaaff',
  magic:      '#00aaff',
  cooking:    '#ff8800',
  woodcut:    '#885522',
  fletching:  '#228833',
  fishing:    '#2255aa',
  firemaking: '#ff4400',
  crafting:   '#aaaa00',
  smithing:   '#888888',
  mining:     '#666699',
  herblaw:    '#00aa44',
  agility:    '#882288',
  thieving:   '#334488',
};

const SPELLS = [
  { name: 'Wind Strike',   level: 1,  runes: [{id:94,qty:1},{id:90,qty:1}], maxHit: 2,  color: '#88ffff' },
  { name: 'Water Strike',  level: 5,  runes: [{id:94,qty:1},{id:91,qty:1},{id:90,qty:1}], maxHit: 4, color: '#4488ff' },
  { name: 'Earth Strike',  level: 9,  runes: [{id:94,qty:1},{id:92,qty:2},{id:90,qty:1}], maxHit: 6, color: '#8b4513' },
  { name: 'Fire Strike',   level: 13, runes: [{id:94,qty:1},{id:93,qty:3},{id:90,qty:1}], maxHit: 8, color: '#ff4400' },
  { name: 'Wind Bolt',     level: 17, runes: [{id:96,qty:1},{id:90,qty:2}], maxHit: 9,  color: '#88ffff' },
  { name: 'Water Bolt',    level: 23, runes: [{id:96,qty:1},{id:91,qty:2},{id:90,qty:2}], maxHit: 10, color: '#4488ff' },
  { name: 'Earth Bolt',    level: 29, runes: [{id:96,qty:1},{id:92,qty:3},{id:90,qty:2}], maxHit: 11, color: '#8b4513' },
  { name: 'Fire Bolt',     level: 35, runes: [{id:96,qty:1},{id:93,qty:4},{id:90,qty:2}], maxHit: 12, color: '#ff4400' },
  { name: 'Wind Blast',    level: 41, runes: [{id:97,qty:1},{id:90,qty:3}], maxHit: 13, color: '#88ffff' },
  { name: 'Water Blast',   level: 47, runes: [{id:97,qty:1},{id:91,qty:3},{id:90,qty:3}], maxHit: 14, color: '#4488ff' },
  { name: 'Earth Blast',   level: 53, runes: [{id:97,qty:1},{id:92,qty:4},{id:90,qty:3}], maxHit: 15, color: '#8b4513' },
  { name: 'Fire Blast',    level: 59, runes: [{id:97,qty:1},{id:93,qty:5},{id:90,qty:3}], maxHit: 16, color: '#ff4400' },
  { name: 'Wind Wave',     level: 62, runes: [{id:98,qty:1},{id:90,qty:5}], maxHit: 17, color: '#88ffff' },
  { name: 'Water Wave',    level: 65, runes: [{id:98,qty:1},{id:91,qty:7},{id:90,qty:5}], maxHit: 18, color: '#4488ff' },
  { name: 'Earth Wave',    level: 70, runes: [{id:98,qty:1},{id:92,qty:7},{id:90,qty:5}], maxHit: 19, color: '#8b4513' },
  { name: 'Fire Wave',     level: 75, runes: [{id:98,qty:1},{id:93,qty:7},{id:90,qty:5}], maxHit: 20, color: '#ff4400' },
  { name: 'Teleport Home', level: 1,  runes: [{id:91,qty:1},{id:92,qty:1},{id:100,qty:1}], maxHit: 0, color: '#ffffff', isTeleport: true },
];

export class Sidebar {
  constructor(sidebarCanvas, minimapCanvas, game) {
    this.canvas = sidebarCanvas;
    this.ctx = sidebarCanvas.getContext('2d');
    this.minimapCanvas = minimapCanvas;
    this.minimapCtx = minimapCanvas ? minimapCanvas.getContext('2d') : null;
    this.game = game;
    this.activePanel = PANEL.INVENTORY;
    this.hoveredSlot = -1;
    this.scrollOffset = 0;

    // Click handler
    this.canvas.addEventListener('click', e => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handleClick(x, y);
    });

    this.canvas.addEventListener('contextmenu', e => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handleRightClick(x, y, e.clientX, e.clientY);
    });

    this.canvas.addEventListener('mousemove', e => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this._updateHover(x, y);
    });
  }

  setPanel(panelId) {
    this.activePanel = panelId;
    this.scrollOffset = 0;
  }

  render() {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;

    // Background
    ctx.fillStyle = '#2d2015';
    ctx.fillRect(0, 0, W, H);

    // Tab bar
    this._drawTabs(ctx, W);

    // Panel content
    const contentY = 32;
    const contentH = H - contentY;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, contentY, W, contentH);
    ctx.clip();

    switch (this.activePanel) {
      case PANEL.INVENTORY:  this.renderInventory(ctx, W, contentY, contentH); break;
      case PANEL.STATS:      this.renderStats(ctx, W, contentY, contentH); break;
      case PANEL.EQUIPMENT:  this.renderEquipment(ctx, W, contentY, contentH); break;
      case PANEL.PRAYER:     this.renderPrayer(ctx, W, contentY, contentH); break;
      case PANEL.MAGIC:      this.renderMagic(ctx, W, contentY, contentH); break;
    }

    ctx.restore();

    // Minimap in bottom section
    if (this.minimapCtx && this.game && this.game.renderer) {
      this.minimapCtx.clearRect(0, 0, 60, 60);
      this.game.renderer.drawMinimap(this.minimapCtx, this.game.world, this.game.player);
    }

    // Run energy / prayer indicator strip
    this._drawStatusBar(ctx, W, H);
  }

  _drawTabs(ctx, W) {
    const tabs = ['INV', 'STATS', 'EQUIP', 'PRAY', 'MAGIC'];
    const tabW = W / tabs.length;

    for (let i = 0; i < tabs.length; i++) {
      const tx = i * tabW;
      const isActive = i === this.activePanel;

      ctx.fillStyle = isActive ? '#5a3a00' : '#3a2500';
      ctx.fillRect(tx, 0, tabW - 1, 30);

      ctx.strokeStyle = isActive ? '#cc9900' : '#665500';
      ctx.lineWidth = 1;
      ctx.strokeRect(tx, 0, tabW - 1, 30);

      ctx.font = isActive ? 'bold 10px Courier New' : '10px Courier New';
      ctx.fillStyle = isActive ? '#ffcc00' : '#aa8800';
      ctx.textAlign = 'center';
      ctx.fillText(tabs[i], tx + tabW / 2, 19);
    }
  }

  _drawStatusBar(ctx, W, H) {
    if (!this.game) return;
    const player = this.game.player;

    // Prayer points bar
    const ppRatio = player.prayerPoints / player.maxPrayerPoints;
    ctx.fillStyle = '#222266';
    ctx.fillRect(0, H - 18, W / 2 - 2, 16);
    ctx.fillStyle = '#4444ff';
    ctx.fillRect(0, H - 18, (W / 2 - 2) * ppRatio, 16);
    ctx.font = '10px Courier New';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`PP: ${Math.floor(player.prayerPoints)}/${player.maxPrayerPoints}`, W / 4, H - 7);

    // Run energy bar
    const runRatio = player.runEnergy / 100;
    ctx.fillStyle = '#226622';
    ctx.fillRect(W / 2 + 1, H - 18, W / 2 - 1, 16);
    ctx.fillStyle = '#44cc44';
    ctx.fillRect(W / 2 + 1, H - 18, (W / 2 - 1) * runRatio, 16);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    const runLabel = player.isRunning ? 'RUN' : 'WALK';
    ctx.fillText(`${runLabel}: ${Math.floor(player.runEnergy)}%`, W * 3 / 4, H - 7);
  }

  renderInventory(ctx, W, startY, H) {
    if (!this.game) return;
    const player = this.game.player;
    const inv = player.inventory;
    const slots = inv.slots;

    ctx.font = 'bold 11px Courier New';
    ctx.fillStyle = '#ffcc00';
    ctx.textAlign = 'center';
    ctx.fillText('Inventory', W / 2, startY + 14);

    const cols = 4;
    const rows = 7;
    const slotW = Math.floor((W - 8) / cols);
    const slotH = 34;
    const startX = 4;
    const itemStartY = startY + 24;

    for (let i = 0; i < 28; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const sx = startX + col * slotW;
      const sy = itemStartY + row * slotH;
      const slot = slots[i];

      // Slot background
      const isHovered = this.hoveredSlot === i && this.activePanel === PANEL.INVENTORY;
      ctx.fillStyle = isHovered ? '#4a3a20' : '#1a1208';
      ctx.fillRect(sx, sy, slotW - 2, slotH - 2);
      ctx.strokeStyle = '#4a3000';
      ctx.lineWidth = 1;
      ctx.strokeRect(sx, sy, slotW - 2, slotH - 2);

      if (slot) {
        const item = ITEMS[slot.itemId];
        if (!item) continue;

        // Item color square
        let color = '#888888';
        if (item.type === 'weapon')   color = '#cccccc';
        if (item.type === 'armour')   color = '#8888aa';
        if (item.type === 'food')     color = '#ff8800';
        if (item.type === 'currency') color = '#ffd700';
        if (item.type === 'rune')     color = '#8888ff';
        if (item.type === 'logs')     color = '#8B4513';
        if (item.type === 'ore')      color = '#666666';
        if (item.type === 'bar')      color = '#aaaaaa';
        if (item.type === 'tool')     color = '#aa6600';
        if (item.type === 'raw_fish') color = '#88aacc';
        if (item.type === 'potion')   color = '#aa44aa';

        ctx.fillStyle = color;
        ctx.fillRect(sx + 4, sy + 4, slotW - 10, slotH - 12);

        // Item name (abbreviated)
        ctx.font = '8px Courier New';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        const shortName = item.name.length > 8 ? item.name.slice(0, 7) + '.' : item.name;
        ctx.fillText(shortName, sx + slotW / 2 - 1, sy + slotH - 5);

        // Quantity for stackable
        if (item.stackable && slot.qty > 1) {
          ctx.font = 'bold 9px Courier New';
          ctx.fillStyle = '#ffff00';
          ctx.textAlign = 'left';
          ctx.fillText(slot.qty > 999 ? '999+' : slot.qty, sx + 2, sy + 11);
        }
      }
    }

    // Weight info
    ctx.font = '9px Courier New';
    ctx.fillStyle = '#aaaaaa';
    ctx.textAlign = 'center';
    ctx.fillText('(R-click item to use/drop)', W / 2, startY + H - 8);
  }

  renderStats(ctx, W, startY, H) {
    if (!this.game) return;
    const player = this.game.player;
    const skills = player.skills;

    ctx.font = 'bold 11px Courier New';
    ctx.fillStyle = '#ffcc00';
    ctx.textAlign = 'center';
    ctx.fillText('Skills', W / 2, startY + 14);

    // Combat level
    ctx.font = '10px Courier New';
    ctx.fillStyle = '#ffaa00';
    ctx.fillText(`Combat Lv: ${player.combatLevel}`, W / 2, startY + 28);

    const cols = 3;
    const skillList = SKILL_NAMES;
    const skillW = Math.floor(W / cols);
    const skillH = 28;
    const gridStartY = startY + 36;

    for (let i = 0; i < skillList.length; i++) {
      const skillName = skillList[i];
      const skill = skills[skillName];
      if (!skill) continue;

      const col = i % cols;
      const row = Math.floor(i / cols);
      const sx = col * skillW + 2;
      const sy = gridStartY + row * skillH;

      const color = SKILL_COLORS[skillName] || '#aaaaaa';

      // Background
      ctx.fillStyle = '#0d0a05';
      ctx.fillRect(sx, sy, skillW - 4, skillH - 2);
      ctx.strokeStyle = color + '88';
      ctx.lineWidth = 1;
      ctx.strokeRect(sx, sy, skillW - 4, skillH - 2);

      // XP bar
      const nextLevelXp = XP_TABLE[skill.level] || XP_TABLE[98];
      const prevLevelXp = XP_TABLE[skill.level - 1] || 0;
      const xpRange = nextLevelXp - prevLevelXp;
      const xpProgress = skill.xp - prevLevelXp;
      const progress = skill.level >= 99 ? 1 : Math.min(1, xpProgress / xpRange);

      ctx.fillStyle = color + '44';
      ctx.fillRect(sx + 1, sy + skillH - 6, (skillW - 6) * progress, 4);

      // Color indicator dot
      ctx.fillStyle = color;
      ctx.fillRect(sx + 2, sy + 3, 5, 5);

      // Skill name
      ctx.font = '8px Courier New';
      ctx.fillStyle = '#cccccc';
      ctx.textAlign = 'left';
      const dispName = skillName.charAt(0).toUpperCase() + skillName.slice(1);
      ctx.fillText(dispName.slice(0, 7), sx + 9, sy + 9);

      // Level
      ctx.font = 'bold 11px Courier New';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.fillText(skill.level, sx + skillW / 2 + 8, sy + 20);
    }
  }

  renderEquipment(ctx, W, startY, H) {
    if (!this.game) return;
    const player = this.game.player;
    const equip = player.equipment.slots;

    ctx.font = 'bold 11px Courier New';
    ctx.fillStyle = '#ffcc00';
    ctx.textAlign = 'center';
    ctx.fillText('Equipment', W / 2, startY + 14);

    // Equipment doll layout
    const slots = [
      { name: 'head',    label: 'Head',    col: 1, row: 0 },
      { name: 'cape',    label: 'Cape',    col: 0, row: 1 },
      { name: 'neck',    label: 'Neck',    col: 1, row: 1 },
      { name: 'arrows',  label: 'Ammo',   col: 2, row: 1 },
      { name: 'weapon',  label: 'Weapon', col: 0, row: 2 },
      { name: 'body',    label: 'Body',   col: 1, row: 2 },
      { name: 'shield',  label: 'Shield', col: 2, row: 2 },
      { name: 'legs',    label: 'Legs',   col: 1, row: 3 },
      { name: 'feet',    label: 'Feet',   col: 1, row: 4 },
      { name: 'ring',    label: 'Ring',   col: 2, row: 4 },
    ];

    const slotW = Math.floor(W / 3) - 4;
    const slotH = 30;
    const gridStartY = startY + 24;

    for (const slotDef of slots) {
      const sx = slotDef.col * (slotW + 4) + 2;
      const sy = gridStartY + slotDef.row * (slotH + 2);
      const equipped = equip[slotDef.name];

      ctx.fillStyle = equipped ? '#2a1a08' : '#0d0a05';
      ctx.fillRect(sx, sy, slotW, slotH);
      ctx.strokeStyle = equipped ? '#cc9900' : '#3a2500';
      ctx.lineWidth = 1;
      ctx.strokeRect(sx, sy, slotW, slotH);

      if (equipped) {
        ctx.font = '8px Courier New';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        const shortName = equipped.name.length > 9 ? equipped.name.slice(0, 8) + '.' : equipped.name;
        ctx.fillText(shortName, sx + slotW / 2, sy + slotH / 2 + 3);
      } else {
        ctx.font = '8px Courier New';
        ctx.fillStyle = '#555555';
        ctx.textAlign = 'center';
        ctx.fillText(slotDef.label, sx + slotW / 2, sy + slotH / 2 + 3);
      }
    }

    // Stat totals
    const atkBonus = player.equipment.getBonus('attackBonus');
    const strBonus = player.equipment.getBonus('strengthBonus');
    const defBonus = player.equipment.getBonus('defenceBonus');

    const statsY = gridStartY + 5 * (slotH + 2) + 8;
    ctx.font = '9px Courier New';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ff8888'; ctx.fillText(`Atk: +${atkBonus}`, 4, statsY);
    ctx.fillStyle = '#ff6600'; ctx.fillText(`Str: +${strBonus}`, 4, statsY + 12);
    ctx.fillStyle = '#88ff88'; ctx.fillText(`Def: +${defBonus}`, 4, statsY + 24);
  }

  renderPrayer(ctx, W, startY, H) {
    if (!this.game) return;
    const player = this.game.player;

    ctx.font = 'bold 11px Courier New';
    ctx.fillStyle = '#ffcc00';
    ctx.textAlign = 'center';
    ctx.fillText('Prayer', W / 2, startY + 14);

    ctx.font = '10px Courier New';
    ctx.fillStyle = '#aaaaff';
    ctx.fillText(`Points: ${Math.floor(player.prayerPoints)} / ${player.maxPrayerPoints}`, W / 2, startY + 26);

    const listStartY = startY + 36;
    const itemH = 22;

    for (let i = 0; i < PRAYERS.length; i++) {
      const prayer = PRAYERS[i];
      const sy = listStartY + i * itemH - this.scrollOffset;
      if (sy > startY + H - 20 || sy < startY + 30) continue;

      const isActive = !!player.activePrayers[prayer.key];
      const canUse = player.prayerLevel >= prayer.level;

      ctx.fillStyle = isActive ? '#22226a' : (canUse ? '#0d0a05' : '#050302');
      ctx.fillRect(2, sy, W - 4, itemH - 2);
      ctx.strokeStyle = isActive ? '#8888ff' : (canUse ? '#3a2500' : '#1a1208');
      ctx.lineWidth = 1;
      ctx.strokeRect(2, sy, W - 4, itemH - 2);

      // Checkbox
      ctx.fillStyle = isActive ? '#4444ff' : (canUse ? '#333333' : '#1a1a1a');
      ctx.fillRect(4, sy + 3, 14, 14);
      ctx.strokeStyle = '#888888';
      ctx.strokeRect(4, sy + 3, 14, 14);
      if (isActive) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(6, sy + 10);
        ctx.lineTo(10, sy + 14);
        ctx.lineTo(16, sy + 6);
        ctx.stroke();
        ctx.lineWidth = 1;
      }

      ctx.font = canUse ? '9px Courier New' : '9px Courier New';
      ctx.fillStyle = canUse ? (isActive ? '#aaaaff' : '#cccccc') : '#555555';
      ctx.textAlign = 'left';
      ctx.fillText(`${prayer.name} (${prayer.level})`, 22, sy + 14);
    }
  }

  renderMagic(ctx, W, startY, H) {
    if (!this.game) return;
    const player = this.game.player;

    ctx.font = 'bold 11px Courier New';
    ctx.fillStyle = '#ffcc00';
    ctx.textAlign = 'center';
    ctx.fillText('Magic', W / 2, startY + 14);

    ctx.font = '10px Courier New';
    ctx.fillStyle = '#88aaff';
    ctx.fillText(`Magic Level: ${player.skills.magic.level}`, W / 2, startY + 26);

    const listStartY = startY + 36;
    const itemH = 22;

    for (let i = 0; i < SPELLS.length; i++) {
      const spell = SPELLS[i];
      const sy = listStartY + i * itemH - this.scrollOffset;
      if (sy > startY + H - 20 || sy < startY + 30) continue;

      const canCast = player.skills.magic.level >= spell.level;
      const hasRunes = spell.runes.every(r => player.inventory.hasItem(r.id, r.qty));

      ctx.fillStyle = canCast && hasRunes ? '#0d1a2a' : '#050810';
      ctx.fillRect(2, sy, W - 4, itemH - 2);
      ctx.strokeStyle = canCast ? spell.color + '88' : '#1a1a2a';
      ctx.lineWidth = 1;
      ctx.strokeRect(2, sy, W - 4, itemH - 2);

      // Color dot
      ctx.fillStyle = canCast ? spell.color : '#333333';
      ctx.beginPath();
      ctx.arc(10, sy + itemH / 2, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '9px Courier New';
      ctx.fillStyle = canCast ? '#ffffff' : '#555555';
      ctx.textAlign = 'left';
      ctx.fillText(`${spell.name} (${spell.level})`, 20, sy + 10);

      if (!spell.isTeleport) {
        ctx.fillStyle = canCast ? '#ffaa44' : '#444444';
        ctx.fillText(`Max: ${spell.maxHit}`, 20, sy + 19);
      } else {
        ctx.fillStyle = '#aaaaff';
        ctx.fillText('Teleport', 20, sy + 19);
      }
    }
  }

  handleClick(x, y) {
    // Tab bar clicks
    if (y < 32) {
      const tabW = this.canvas.width / 5;
      const tabIndex = Math.floor(x / tabW);
      if (tabIndex >= 0 && tabIndex <= 4) {
        this.setPanel(tabIndex);
      }
      return;
    }

    // Prayer checkboxes
    if (this.activePanel === PANEL.PRAYER && this.game) {
      const player = this.game.player;
      const listStartY = 32 + 36;
      const itemH = 22;

      for (let i = 0; i < PRAYERS.length; i++) {
        const prayer = PRAYERS[i];
        const sy = listStartY + i * itemH - this.scrollOffset;
        if (y >= sy && y < sy + itemH) {
          if (player.prayerLevel >= prayer.level) {
            const wasActive = !!player.activePrayers[prayer.key];
            player.activePrayers[prayer.key] = !wasActive;
            if (!wasActive && player.prayerPoints <= 0) {
              player.activePrayers[prayer.key] = false;
              this.game.chatbox && this.game.chatbox.addMessage("You have no prayer points!", '#ff4444');
            }
          } else {
            this.game.chatbox && this.game.chatbox.addMessage(
              `You need level ${prayer.level} Prayer to use ${prayer.name}.`, '#ff4444'
            );
          }
          return;
        }
      }
    }

    // Run toggle in status bar
    if (y > this.canvas.height - 20 && x > this.canvas.width / 2) {
      if (this.game) {
        this.game.player.isRunning = !this.game.player.isRunning;
        this.game.chatbox && this.game.chatbox.addMessage(
          this.game.player.isRunning ? 'You toggle run on.' : 'You toggle run off.', '#ffffff'
        );
      }
    }
  }

  handleRightClick(x, y, absX, absY) {
    if (!this.game) return;
    if (this.activePanel !== PANEL.INVENTORY) return;

    const player = this.game.player;
    const inv = player.inventory;
    const W = this.canvas.width;
    const cols = 4;
    const slotW = Math.floor((W - 8) / cols);
    const slotH = 34;
    const startX = 4;
    const itemStartY = 32 + 24;

    // Find which slot was clicked
    for (let i = 0; i < 28; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const sx = startX + col * slotW;
      const sy = itemStartY + row * slotH;
      if (x >= sx && x < sx + slotW && y >= sy && y < sy + slotH) {
        const slot = inv.getSlot(i);
        if (!slot) return;
        const item = ITEMS[slot.itemId];
        if (!item) return;

        const options = [];
        const slotIdx = i;

        // Equip
        if (item.slot) {
          options.push({
            label: `Equip ${item.name}`,
            action: () => {
              const unequipped = player.equipment.equip(item);
              inv.removeItem(item.id, 1);
              if (unequipped) {
                inv.addItem(unequipped.id, 1);
              }
              this.game.chatbox.addMessage(`You equip the ${item.name}.`, '#ffffff');
            }
          });
        }

        // Eat food
        if (item.type === 'food') {
          options.push({
            label: `Eat ${item.name}`,
            action: () => player.eat(slotIdx, this.game.world)
          });
        }

        // Cook raw fish
        if (item.type === 'raw_fish') {
          options.push({
            label: `Cook ${item.name}`,
            action: () => player.cookFish(slotIdx, this.game.world)
          });
        }

        // Light fire with logs
        if (item.type === 'logs') {
          options.push({
            label: `Light ${item.name}`,
            action: () => player.lightFire(slotIdx, this.game.world)
          });
        }

        // Examine
        options.push({
          label: `Examine`,
          action: () => this.game.chatbox.addMessage(item.examine, '#aaffaa')
        });

        // Drop
        options.push({
          label: `Drop ${item.name}`,
          action: () => player.dropItem(slotIdx, this.game.world)
        });

        options.push({ label: 'Cancel', action: () => {} });

        this.game.ui.contextMenu.show(absX, absY, options);
        return;
      }
    }

    // Equipment slot right-clicks
    if (this.activePanel === PANEL.EQUIPMENT) {
      // unequip on click
    }
  }

  _updateHover(x, y) {
    if (this.activePanel !== PANEL.INVENTORY) {
      this.hoveredSlot = -1;
      return;
    }
    const W = this.canvas.width;
    const cols = 4;
    const slotW = Math.floor((W - 8) / cols);
    const slotH = 34;
    const startX = 4;
    const itemStartY = 32 + 24;

    for (let i = 0; i < 28; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const sx = startX + col * slotW;
      const sy = itemStartY + row * slotH;
      if (x >= sx && x < sx + slotW && y >= sy && y < sy + slotH) {
        this.hoveredSlot = i;
        return;
      }
    }
    this.hoveredSlot = -1;
  }
}
