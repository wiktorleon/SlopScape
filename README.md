# SlopScape

A browser-based classic MMORPG built entirely in vanilla JavaScript and HTML5 Canvas. No build step, no dependencies, no nonsense.

![SlopScape](https://img.shields.io/badge/engine-vanilla%20JS-yellow) ![SlopScape](https://img.shields.io/badge/build-none-green) ![SlopScape](https://img.shields.io/badge/license-MIT-blue)

---

## Play

```bash
git clone https://github.com/wiktorleon/SlopScape
cd SlopScape
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser.

> ES modules require a local server — you can't open `index.html` directly.

---

## Controls

| Input | Action |
|-------|--------|
| **Left click** tile | Walk there |
| **Left click** monster | Attack |
| **Left click** NPC | Talk / interact |
| **Right click** anything | Options menu |
| **R** | Toggle run |

---

## Features

**World**
- 120×120 tile map — town, castle, river, forests, fields, a goblin camp, mining areas, fishing spots
- A\* pathfinding with smooth pixel-interpolated movement

**Combat**
- Turn-based combat at authentic 1.8s ticks
- Hit formula based on attack/strength/defence levels + equipment bonuses
- Floating damage numbers and XP popups
- Monster respawns after death

**Skills** — all 18 classic skills with the authentic XP curve
| | | |
|-|-|-|
| Attack | Defence | Strength |
| Hits | Ranged | Prayer |
| Magic | Cooking | Woodcutting |
| Fletching | Fishing | Firemaking |
| Crafting | Smithing | Mining |
| Herblaw | Agility | Thieving |

**Inventory & Equipment**
- 28-slot inventory
- Full equipment doll (head, body, legs, weapon, shield, cape, ring, arrows...)
- Stat bonuses applied from equipped gear

**Interactions**
- Chop trees → Woodcutting XP + logs
- Mine rocks → Mining XP + ores
- Fish shallow water → Fishing XP + raw fish
- Cook food on fires → Cooking XP
- Eat food to heal
- Bank for unlimited item storage
- Shops to buy and sell gear

**Prayers** — 18 prayers with drain rates, restore at the altar

---

## Structure

```
SlopScape/
├── index.html
├── style.css
└── js/
    ├── constants.js
    ├── main.js
    ├── data/          # tiles, items, monsters, NPCs, map, shops
    ├── engine/        # renderer, pathfinding, input
    ├── game/          # player, combat, skills, inventory, world
    └── ui/            # sidebar panels, chatbox, context menu
```

---

## Tech

- **Rendering** — HTML5 Canvas, drawn every frame via `requestAnimationFrame`
- **Pathfinding** — A\* with Manhattan heuristic, capped at 200 steps
- **Modules** — Native ES modules (`type="module"`)
- **No frameworks, no bundler, no npm**

---

## License

MIT
