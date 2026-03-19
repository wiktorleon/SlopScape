import { ITEMS } from '../data/items.js';

export const EQUIP_SLOTS = ['head', 'neck', 'body', 'legs', 'feet', 'weapon', 'shield', 'cape', 'arrows', 'ring'];

export class Equipment {
  constructor() {
    this._slots = {};
    for (const slot of EQUIP_SLOTS) {
      this._slots[slot] = null;
    }
  }

  get slots() {
    return this._slots;
  }

  equip(item) {
    if (!item || !item.slot) return null;
    const slot = item.slot;
    if (!EQUIP_SLOTS.includes(slot)) return null;

    const unequipped = this._slots[slot]; // item previously in slot (may be null)
    this._slots[slot] = item;
    return unequipped; // return what was replaced (null if empty)
  }

  unequip(slotName) {
    if (!EQUIP_SLOTS.includes(slotName)) return null;
    const item = this._slots[slotName];
    this._slots[slotName] = null;
    return item;
  }

  getBonus(stat) {
    let total = 0;
    for (const slotName of EQUIP_SLOTS) {
      const item = this._slots[slotName];
      if (item && item[stat] !== undefined) {
        total += item[stat];
      }
    }
    return total;
  }

  getWeapon() {
    return this._slots['weapon'];
  }
}
