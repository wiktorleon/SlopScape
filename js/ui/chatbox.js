export class Chatbox {
  constructor(element) {
    this.element = element;
    this.messages = [];
    this.maxMessages = 100;
  }

  addMessage(text, color = '#ffff00') {
    this.messages.push({ text, color });
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }
    this._render();
  }

  clear() {
    this.messages = [];
    this._render();
  }

  _render() {
    if (!this.element) return;
    this.element.innerHTML = '';

    // Show last ~8 messages visible
    const visible = this.messages.slice(-8);
    for (const msg of visible) {
      const line = document.createElement('div');
      line.textContent = msg.text;
      line.style.color = msg.color;
      line.style.lineHeight = '1.3';
      this.element.appendChild(line);
    }

    // Scroll to bottom
    this.element.scrollTop = this.element.scrollHeight;
  }
}
