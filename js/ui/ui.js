import { PANEL } from '../constants.js';
import { Sidebar } from './sidebar.js';
import { Chatbox } from './chatbox.js';
import { ContextMenu } from './contextmenu.js';
import { SHOPS } from '../data/shops.js';
import { ITEMS } from '../data/items.js';

export class UI {
  constructor(game) {
    this.game = game;
    this.sidebar = null;
    this.chatbox = null;
    this.contextMenu = null;
    this.shopOpen = false;
    this.shopId = null;
    this.bankOpen = false;
    this.shopElement = null;
    this.bankElement = null;
  }

  init() {
    const sidebarCanvas = document.getElementById('sidebarCanvas');
    const minimapCanvas = document.getElementById('minimapCanvas');
    const chatEl = document.getElementById('chatMessages');

    this.sidebar = new Sidebar(sidebarCanvas, minimapCanvas, this.game);
    this.chatbox = new Chatbox(chatEl);
    this.contextMenu = new ContextMenu(document.body);

    // Create shop modal
    this._createShopModal();
    this._createBankModal();

    // Tab buttons
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        this.handleTabClick(i);
        tabs.forEach((b, j) => {
          b.classList.toggle('active', j === i);
        });
      });
    });
  }

  handleTabClick(tabIndex) {
    this.sidebar.setPanel(tabIndex);
  }

  openShop(shopId) {
    if (shopId === null || shopId === undefined) return;
    this.shopId = shopId;
    this.shopOpen = true;
    this._renderShop();
    if (this.shopElement) {
      this.shopElement.style.display = 'block';
    }
  }

  closeShop() {
    this.shopOpen = false;
    if (this.shopElement) {
      this.shopElement.style.display = 'none';
    }
  }

  openBank() {
    this.bankOpen = true;
    this._renderBank();
    if (this.bankElement) {
      this.bankElement.style.display = 'block';
    }
  }

  closeBank() {
    this.bankOpen = false;
    if (this.bankElement) {
      this.bankElement.style.display = 'none';
    }
  }

  _createShopModal() {
    const el = document.createElement('div');
    el.id = 'shopModal';
    el.style.cssText = `
      display: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #2d1a00;
      border: 3px solid #cc9900;
      padding: 10px;
      z-index: 500;
      min-width: 400px;
      max-width: 500px;
      font-family: 'Courier New', monospace;
      color: #ffffff;
      max-height: 400px;
      overflow-y: auto;
    `;
    document.body.appendChild(el);
    this.shopElement = el;
  }

  _createBankModal() {
    const el = document.createElement('div');
    el.id = 'bankModal';
    el.style.cssText = `
      display: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #1a1a00;
      border: 3px solid #ffd700;
      padding: 10px;
      z-index: 500;
      min-width: 450px;
      max-width: 600px;
      font-family: 'Courier New', monospace;
      color: #ffffff;
      max-height: 500px;
      overflow-y: auto;
    `;
    document.body.appendChild(el);
    this.bankElement = el;

    // Bank storage
    this.bankStorage = [];
  }

  _renderShop() {
    if (!this.shopElement) return;
    const shop = SHOPS[this.shopId];
    if (!shop) return;
    const player = this.game.player;
    const coins = player.inventory.getCount(0);

    let html = `
      <div style="background:#1a0d00; padding:6px; margin-bottom:8px; border-bottom:2px solid #cc9900;">
        <span style="color:#ffcc00; font-size:14px; font-weight:bold;">${shop.name}</span>
        <span style="float:right; color:#ffd700;">Your coins: ${coins}</span>
        <button onclick="window._game.ui.closeShop()" style="float:right; margin-right:10px; background:#5a0000; color:#fff; border:1px solid #cc0000; cursor:pointer; font-family:inherit; padding:2px 8px;">Close</button>
      </div>
      <div style="font-size:11px; color:#aaaaaa; margin-bottom:6px;">Left-click to buy, shop sells at listed price.</div>
    `;

    for (const stockItem of shop.stock) {
      const item = ITEMS[stockItem.itemId];
      if (!item) continue;
      const canAfford = coins >= stockItem.price;
      const inStock = stockItem.qty > 0 || item.stackable;

      let color = '#888888';
      if (item.type === 'weapon') color = '#cccccc';
      if (item.type === 'armour') color = '#8888aa';
      if (item.type === 'food')   color = '#ff8800';
      if (item.type === 'tool')   color = '#aa6600';
      if (item.type === 'rune')   color = '#8888ff';

      html += `
        <div style="display:flex; align-items:center; padding:4px; border:1px solid #3a2500; margin-bottom:3px; background:${canAfford && inStock ? '#1a1200' : '#0d0800'}; cursor:${canAfford && inStock ? 'pointer' : 'default'};"
             onclick="window._game.ui.buyItem(${stockItem.itemId}, ${stockItem.price})">
          <div style="width:20px; height:20px; background:${color}; border:1px solid #333; flex-shrink:0;"></div>
          <div style="flex:1; margin-left:8px;">
            <div style="color:${canAfford ? '#ffffff' : '#666666'}; font-size:12px;">${item.name}</div>
            <div style="color:#aaaaaa; font-size:10px;">${item.examine}</div>
          </div>
          <div style="text-align:right; margin-left:8px;">
            <div style="color:#ffd700; font-size:12px;">${stockItem.price} gp</div>
            <div style="color:#aaaaaa; font-size:10px;">Stock: ${stockItem.qty}</div>
          </div>
        </div>
      `;
    }

    html += `<div style="margin-top:8px; font-size:10px; color:#888888; text-align:center;">Press Escape to close</div>`;
    this.shopElement.innerHTML = html;
  }

  _renderBank() {
    if (!this.bankElement) return;
    const player = this.game.player;

    let html = `
      <div style="background:#0a0a00; padding:6px; margin-bottom:8px; border-bottom:2px solid #ffd700;">
        <span style="color:#ffd700; font-size:14px; font-weight:bold;">Bank of Lumbridge</span>
        <button onclick="window._game.ui.closeBank()" style="float:right; background:#5a0000; color:#fff; border:1px solid #cc0000; cursor:pointer; font-family:inherit; padding:2px 8px;">Close</button>
      </div>
      <div style="display:flex; gap:10px;">
        <div style="flex:1;">
          <div style="color:#ffcc00; font-size:11px; margin-bottom:4px;">Your Inventory:</div>
    `;

    const inv = player.inventory;
    for (let i = 0; i < 28; i++) {
      const slot = inv.getSlot(i);
      if (!slot) continue;
      const item = ITEMS[slot.itemId];
      if (!item) continue;
      html += `
        <div style="display:flex; align-items:center; padding:3px; border:1px solid #2a2000; margin-bottom:2px; cursor:pointer; font-size:11px;"
             onclick="window._game.ui.depositItem(${slot.itemId}, ${slot.qty})">
          <span style="color:#ffffff;">${item.name}</span>
          <span style="color:#ffd700; margin-left:4px;">x${slot.qty}</span>
          <span style="color:#888888; margin-left:auto; font-size:9px;">Deposit</span>
        </div>
      `;
    }

    html += `</div><div style="flex:1;">
      <div style="color:#ffcc00; font-size:11px; margin-bottom:4px;">Bank Storage (${this.bankStorage.length} items):</div>
    `;

    for (let i = 0; i < this.bankStorage.length; i++) {
      const bs = this.bankStorage[i];
      const item = ITEMS[bs.itemId];
      if (!item) continue;
      html += `
        <div style="display:flex; align-items:center; padding:3px; border:1px solid #2a2000; margin-bottom:2px; cursor:pointer; font-size:11px;"
             onclick="window._game.ui.withdrawItem(${i})">
          <span style="color:#ffffff;">${item.name}</span>
          <span style="color:#ffd700; margin-left:4px;">x${bs.qty}</span>
          <span style="color:#888888; margin-left:auto; font-size:9px;">Withdraw</span>
        </div>
      `;
    }

    html += `</div></div><div style="margin-top:8px; font-size:10px; color:#888888; text-align:center;">Click items to deposit/withdraw. Press Escape to close.</div>`;
    this.bankElement.innerHTML = html;
  }

  buyItem(itemId, price) {
    if (!this.shopOpen) return;
    const player = this.game.player;
    const coins = player.inventory.getCount(0);

    if (coins < price) {
      this.game.chatbox.addMessage("You don't have enough coins!", '#ff4444');
      return;
    }
    if (player.inventory.isFull() && !ITEMS[itemId]?.stackable) {
      this.game.chatbox.addMessage("Your inventory is full!", '#ff4444');
      return;
    }

    player.inventory.removeItem(0, price);
    player.inventory.addItem(itemId, 1);

    const item = ITEMS[itemId];
    this.game.chatbox.addMessage(`You buy a ${item ? item.name : 'item'} for ${price} coins.`, '#ffffff');

    // Update shop stock display
    const shop = SHOPS[this.shopId];
    if (shop) {
      const stockItem = shop.stock.find(s => s.itemId === itemId);
      if (stockItem && stockItem.qty > 0) stockItem.qty--;
    }
    this._renderShop();
  }

  depositItem(itemId, qty) {
    const player = this.game.player;
    player.inventory.removeItem(itemId, qty);

    const existing = this.bankStorage.find(b => b.itemId === itemId);
    if (existing) {
      existing.qty += qty;
    } else {
      this.bankStorage.push({ itemId, qty });
    }
    this._renderBank();
    const item = ITEMS[itemId];
    this.game.chatbox.addMessage(`You deposit ${qty}x ${item ? item.name : 'item'}.`, '#ffffff');
  }

  withdrawItem(bankIndex) {
    const player = this.game.player;
    const bs = this.bankStorage[bankIndex];
    if (!bs) return;

    if (player.inventory.isFull() && !ITEMS[bs.itemId]?.stackable) {
      this.game.chatbox.addMessage("Your inventory is full!", '#ff4444');
      return;
    }

    const withdrawQty = Math.min(bs.qty, 1);
    player.inventory.addItem(bs.itemId, withdrawQty);
    bs.qty -= withdrawQty;
    if (bs.qty <= 0) {
      this.bankStorage.splice(bankIndex, 1);
    }
    this._renderBank();
    const item = ITEMS[bs.itemId];
    this.game.chatbox.addMessage(`You withdraw ${withdrawQty}x ${item ? item.name : 'item'}.`, '#ffffff');
  }

  update(deltaTime) {
    // Any UI animations
  }

  render() {
    if (this.sidebar) {
      this.sidebar.render();
    }
  }
}
