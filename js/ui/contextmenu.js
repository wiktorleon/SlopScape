export class ContextMenu {
  constructor(container) {
    this.container = container;
    this.element = document.createElement('div');
    this.element.id = 'contextMenu';
    this.element.style.cssText = `
      display: none;
      position: fixed;
      z-index: 1000;
      background: #3d2b0a;
      border: 2px solid #000000;
      min-width: 120px;
      padding: 2px 0;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      box-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    `;
    document.body.appendChild(this.element);

    // Close on any click outside
    document.addEventListener('mousedown', e => {
      if (!this.element.contains(e.target)) {
        this.hide();
      }
    });
  }

  show(x, y, options) {
    this.element.innerHTML = '';

    // Title bar
    const title = document.createElement('div');
    title.textContent = 'Choose option';
    title.style.cssText = `
      color: #ffffff;
      background: #1a0d00;
      padding: 3px 8px;
      font-size: 11px;
      border-bottom: 1px solid #665500;
      font-style: italic;
    `;
    this.element.appendChild(title);

    for (const option of options) {
      const item = document.createElement('div');
      item.textContent = option.label;
      item.style.cssText = `
        color: #ffffff;
        padding: 3px 8px;
        cursor: pointer;
        white-space: nowrap;
      `;
      item.addEventListener('mouseenter', () => {
        item.style.background = '#5a3a0d';
      });
      item.addEventListener('mouseleave', () => {
        item.style.background = '';
      });
      item.addEventListener('click', e => {
        e.stopPropagation();
        option.action();
        this.hide();
      });
      this.element.appendChild(item);
    }

    // Position the menu
    this.element.style.display = 'block';
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;

    // Ensure it doesn't go off screen
    const rect = this.element.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      this.element.style.left = `${x - rect.width}px`;
    }
    if (rect.bottom > window.innerHeight) {
      this.element.style.top = `${y - rect.height}px`;
    }
  }

  hide() {
    this.element.style.display = 'none';
  }
}
