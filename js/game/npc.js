import { Entity } from './entity.js';
import { TILE_SIZE } from '../constants.js';

export class NPC extends Entity {
  constructor(npcDef, tileX, tileY) {
    super({
      id: `npc_${npcDef.id}_${tileX}_${tileY}`,
      name: npcDef.name,
      tileX,
      tileY,
      hp: 100,
      maxHp: 100,
      color: npcDef.color,
    });

    this.def = npcDef;
    this.dialogueIndex = 0;
  }

  interact(player, chatbox) {
    if (this.def.isBanker) {
      chatbox && chatbox.addMessage(`${this.name}: Welcome to the bank! (Open bank via right-click > Bank)`, '#ffff00');
      return;
    }

    const dialogue = this.def.dialogue;
    if (!dialogue || dialogue.length === 0) {
      chatbox && chatbox.addMessage(`${this.name}: ...`, '#ffff00');
      return;
    }

    const line = dialogue[this.dialogueIndex % dialogue.length];
    chatbox && chatbox.addMessage(`${this.name}: ${line}`, '#ffff00');
    this.dialogueIndex++;
  }

  getDialogue() {
    const dialogue = this.def.dialogue;
    if (!dialogue || dialogue.length === 0) return '...';
    return dialogue[this.dialogueIndex % dialogue.length];
  }

  update(deltaTime) {
    // NPCs don't move — keep pixel position synced to tile
    this.x = this.tileX * TILE_SIZE;
    this.y = this.tileY * TILE_SIZE;
  }
}
