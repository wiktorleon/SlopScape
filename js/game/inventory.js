import { ITEMS } from '../data/items.js';

export class Inventory {
  constructor(size = 28) {
    this.size = size;
    this._slots = new Array(size).fill(null);
  }

  get slots() {
    return this._slots;
  }

  addItem(itemId, qty = 1) {
    const itemDef = ITEMS[itemId];
    if (!itemDef) return false;

    if (itemDef.stackable) {
      // Find existing stack
      const existingIdx = this._slots.findIndex(s => s && s.itemId === itemId);
      if (existingIdx !== -1) {
        this._slots[existingIdx].qty += qty;
        return true;
      }
      // New stack in empty slot
      const emptyIdx = this._slots.indexOf(null);
      if (emptyIdx === -1) return false; // inventory full
      this._slots[emptyIdx] = { itemId, qty };
      return true;
    } else {
      // Non-stackable: need qty empty slots
      let placed = 0;
      for (let i = 0; i < this._slots.length && placed < qty; i++) {
        if (this._slots[i] === null) {
          this._slots[i] = { itemId, qty: 1 };
          placed++;
        }
      }
      return placed === qty;
    }
  }

  removeItem(itemId, qty = 1) {
    const itemDef = ITEMS[itemId];
    if (!itemDef) return false;

    if (itemDef.stackable) {
      const idx = this._slots.findIndex(s => s && s.itemId === itemId);
      if (idx === -1) return false;
      if (this._slots[idx].qty < qty) return false;
      this._slots[idx].qty -= qty;
      if (this._slots[idx].qty === 0) {
        this._slots[idx] = null;
      }
      return true;
    } else {
      let removed = 0;
      for (let i = 0; i < this._slots.length && removed < qty; i++) {
        if (this._slots[i] && this._slots[i].itemId === itemId) {
          this._slots[i] = null;
          removed++;
        }
      }
      return removed === qty;
    }
  }

  hasItem(itemId, qty = 1) {
    return this.getCount(itemId) >= qty;
  }

  getCount(itemId) {
    let total = 0;
    for (const slot of this._slots) {
      if (slot && slot.itemId === itemId) {
        total += slot.qty;
      }
    }
    return total;
  }

  indexOf(itemId) {
    return this._slots.findIndex(s => s && s.itemId === itemId);
  }

  isFull() {
    return this._slots.indexOf(null) === -1;
  }

  freeSlots() {
    return this._slots.filter(s => s === null).length;
  }

  removeAtIndex(index) {
    if (index < 0 || index >= this._slots.length) return null;
    const item = this._slots[index];
    this._slots[index] = null;
    return item;
  }

  getSlot(index) {
    return this._slots[index] || null;
  }
}
