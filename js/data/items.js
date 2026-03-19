export const ITEMS = {
  // Currency
  0: { id:0, name:'Coins', stackable:true, value:1, examine:'Lovely money!', type:'currency', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },

  // Misc
  1: { id:1, name:'Bones', stackable:false, value:1, examine:'Yuk, a pile of bones.', type:'misc', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },

  // Bronze weapons
  2: { id:2, name:'Bronze sword', stackable:false, value:32, examine:'A bronze sword.', type:'weapon', slot:'weapon', attackBonus:4, strengthBonus:3, defenceBonus:0, healAmount:0, skill:'attack', level:1 },
  3: { id:3, name:'Bronze scimitar', stackable:false, value:80, examine:'A curved bronze blade.', type:'weapon', slot:'weapon', attackBonus:5, strengthBonus:6, defenceBonus:0, healAmount:0, skill:'attack', level:1 },
  4: { id:4, name:'Bronze axe', stackable:false, value:16, examine:'A bronze axe.', type:'weapon', slot:'weapon', attackBonus:3, strengthBonus:2, defenceBonus:0, healAmount:0, skill:'attack', level:1, choppingLevel:1 },

  // Iron weapons
  5: { id:5, name:'Iron sword', stackable:false, value:112, examine:'An iron sword.', type:'weapon', slot:'weapon', attackBonus:8, strengthBonus:7, defenceBonus:0, healAmount:0, skill:'attack', level:1 },
  6: { id:6, name:'Iron scimitar', stackable:false, value:256, examine:'A curved iron blade.', type:'weapon', slot:'weapon', attackBonus:10, strengthBonus:11, defenceBonus:0, healAmount:0, skill:'attack', level:1 },

  // Steel weapons
  7: { id:7, name:'Steel sword', stackable:false, value:400, examine:'A steel sword.', type:'weapon', slot:'weapon', attackBonus:13, strengthBonus:12, defenceBonus:0, healAmount:0, skill:'attack', level:5 },
  8: { id:8, name:'Steel scimitar', stackable:false, value:800, examine:'A curved steel blade.', type:'weapon', slot:'weapon', attackBonus:15, strengthBonus:16, defenceBonus:0, healAmount:0, skill:'attack', level:5 },

  // Mithril / Adamant / Rune weapons
  9: { id:9, name:'Mithril sword', stackable:false, value:2560, examine:'A mithril sword.', type:'weapon', slot:'weapon', attackBonus:22, strengthBonus:20, defenceBonus:0, healAmount:0, skill:'attack', level:20 },
  10: { id:10, name:'Adamant sword', stackable:false, value:6400, examine:'An adamant sword.', type:'weapon', slot:'weapon', attackBonus:29, strengthBonus:27, defenceBonus:0, healAmount:0, skill:'attack', level:30 },
  11: { id:11, name:'Rune sword', stackable:false, value:20800, examine:'A rune sword.', type:'weapon', slot:'weapon', attackBonus:45, strengthBonus:44, defenceBonus:0, healAmount:0, skill:'attack', level:40 },

  // Armour - helmets
  12: { id:12, name:'Bronze helm', stackable:false, value:84, examine:'A bronze helmet.', type:'armour', slot:'head', attackBonus:0, strengthBonus:0, defenceBonus:3, healAmount:0, skill:'defence', level:1 },
  13: { id:13, name:'Iron helm', stackable:false, value:336, examine:'An iron helmet.', type:'armour', slot:'head', attackBonus:0, strengthBonus:0, defenceBonus:5, healAmount:0, skill:'defence', level:1 },
  14: { id:14, name:'Steel helm', stackable:false, value:1200, examine:'A steel helmet.', type:'armour', slot:'head', attackBonus:0, strengthBonus:0, defenceBonus:9, healAmount:0, skill:'defence', level:5 },
  15: { id:15, name:'Mithril helm', stackable:false, value:5760, examine:'A mithril helmet.', type:'armour', slot:'head', attackBonus:0, strengthBonus:0, defenceBonus:13, healAmount:0, skill:'defence', level:20 },

  // Armour - body
  16: { id:16, name:'Bronze chainbody', stackable:false, value:200, examine:'A bronze chainbody.', type:'armour', slot:'body', attackBonus:0, strengthBonus:0, defenceBonus:7, healAmount:0, skill:'defence', level:1 },
  17: { id:17, name:'Iron chainbody', stackable:false, value:840, examine:'An iron chainbody.', type:'armour', slot:'body', attackBonus:0, strengthBonus:0, defenceBonus:12, healAmount:0, skill:'defence', level:1 },
  18: { id:18, name:'Steel chainbody', stackable:false, value:3000, examine:'A steel chainbody.', type:'armour', slot:'body', attackBonus:0, strengthBonus:0, defenceBonus:20, healAmount:0, skill:'defence', level:5 },
  19: { id:19, name:'Mithril chainbody', stackable:false, value:10000, examine:'A mithril chainbody.', type:'armour', slot:'body', attackBonus:0, strengthBonus:0, defenceBonus:28, healAmount:0, skill:'defence', level:20 },

  // Tools
  20: { id:20, name:'Tinderbox', stackable:false, value:1, examine:'Useful for lighting fires.', type:'tool', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  21: { id:21, name:'Hatchet', stackable:false, value:16, examine:'A standard hatchet.', type:'tool', slot:'weapon', attackBonus:1, strengthBonus:1, defenceBonus:0, healAmount:0, choppingLevel:1 },
  22: { id:22, name:'Bronze hatchet', stackable:false, value:16, examine:'A bronze hatchet.', type:'tool', slot:'weapon', attackBonus:2, strengthBonus:2, defenceBonus:0, healAmount:0, choppingLevel:1 },
  23: { id:23, name:'Iron hatchet', stackable:false, value:56, examine:'An iron hatchet.', type:'tool', slot:'weapon', attackBonus:4, strengthBonus:4, defenceBonus:0, healAmount:0, choppingLevel:1 },
  24: { id:24, name:'Steel hatchet', stackable:false, value:200, examine:'A steel hatchet.', type:'tool', slot:'weapon', attackBonus:6, strengthBonus:6, defenceBonus:0, healAmount:0, choppingLevel:6 },
  25: { id:25, name:'Mithril hatchet', stackable:false, value:1280, examine:'A mithril hatchet.', type:'tool', slot:'weapon', attackBonus:9, strengthBonus:9, defenceBonus:0, healAmount:0, choppingLevel:21 },
  26: { id:26, name:'Adamant hatchet', stackable:false, value:3200, examine:'An adamant hatchet.', type:'tool', slot:'weapon', attackBonus:13, strengthBonus:13, defenceBonus:0, healAmount:0, choppingLevel:31 },
  27: { id:27, name:'Rune hatchet', stackable:false, value:10400, examine:'A rune hatchet.', type:'tool', slot:'weapon', attackBonus:21, strengthBonus:21, defenceBonus:0, healAmount:0, choppingLevel:41 },

  // Pickaxes
  30: { id:30, name:'Bronze pickaxe', stackable:false, value:1, examine:'A bronze pickaxe.', type:'tool', slot:'weapon', attackBonus:2, strengthBonus:2, defenceBonus:0, healAmount:0, miningLevel:1 },
  31: { id:31, name:'Iron pickaxe', stackable:false, value:140, examine:'An iron pickaxe.', type:'tool', slot:'weapon', attackBonus:4, strengthBonus:4, defenceBonus:0, healAmount:0, miningLevel:1 },
  32: { id:32, name:'Steel pickaxe', stackable:false, value:500, examine:'A steel pickaxe.', type:'tool', slot:'weapon', attackBonus:6, strengthBonus:6, defenceBonus:0, healAmount:0, miningLevel:6 },
  33: { id:33, name:'Mithril pickaxe', stackable:false, value:1300, examine:'A mithril pickaxe.', type:'tool', slot:'weapon', attackBonus:9, strengthBonus:9, defenceBonus:0, healAmount:0, miningLevel:21 },
  34: { id:34, name:'Adamant pickaxe', stackable:false, value:3200, examine:'An adamant pickaxe.', type:'tool', slot:'weapon', attackBonus:13, strengthBonus:13, defenceBonus:0, healAmount:0, miningLevel:31 },
  35: { id:35, name:'Rune pickaxe', stackable:false, value:10400, examine:'A rune pickaxe.', type:'tool', slot:'weapon', attackBonus:21, strengthBonus:21, defenceBonus:0, healAmount:0, miningLevel:41 },

  // Food
  40: { id:40, name:'Bread', stackable:false, value:24, examine:'A fresh loaf of bread.', type:'food', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:80 },
  41: { id:41, name:'Cooked chicken', stackable:false, value:1, examine:'A cooked chicken.', type:'food', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:30 },
  42: { id:42, name:'Cooked beef', stackable:false, value:1, examine:'A cooked piece of beef.', type:'food', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:30 },
  43: { id:43, name:'Lobster', stackable:false, value:150, examine:'A cooked lobster.', type:'food', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:120 },
  44: { id:44, name:'Tuna', stackable:false, value:100, examine:'A cooked tuna.', type:'food', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:100 },
  45: { id:45, name:'Shrimp', stackable:false, value:1, examine:'A cooked shrimp.', type:'food', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:30 },
  46: { id:46, name:'Anchovies', stackable:false, value:1, examine:'A cooked anchovy.', type:'food', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:30 },

  // Ores
  55: { id:55, name:'Copper ore', stackable:false, value:17, examine:'A copper ore.', type:'ore', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  56: { id:56, name:'Tin ore', stackable:false, value:17, examine:'A tin ore.', type:'ore', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  57: { id:57, name:'Iron ore', stackable:false, value:35, examine:'An iron ore.', type:'ore', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  58: { id:58, name:'Coal', stackable:false, value:65, examine:'A lump of coal.', type:'ore', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  59: { id:59, name:'Mithril ore', stackable:false, value:97, examine:'A mithril ore.', type:'ore', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  60: { id:60, name:'Gold ore', stackable:false, value:225, examine:'A gold ore.', type:'ore', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  61: { id:61, name:'Runite ore', stackable:false, value:10000, examine:'A runite ore.', type:'ore', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },

  // Bars
  65: { id:65, name:'Bronze bar', stackable:false, value:18, examine:'A bronze bar.', type:'bar', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  66: { id:66, name:'Iron bar', stackable:false, value:56, examine:'An iron bar.', type:'bar', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  67: { id:67, name:'Steel bar', stackable:false, value:98, examine:'A steel bar.', type:'bar', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  68: { id:68, name:'Gold bar', stackable:false, value:225, examine:'A gold bar.', type:'bar', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  69: { id:69, name:'Mithril bar', stackable:false, value:195, examine:'A mithril bar.', type:'bar', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  70: { id:70, name:'Adamantite bar', stackable:false, value:400, examine:'An adamantite bar.', type:'bar', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  71: { id:71, name:'Runite bar', stackable:false, value:2400, examine:'A runite bar.', type:'bar', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },

  // Logs
  72: { id:72, name:'Logs', stackable:false, value:4, examine:'Some logs.', type:'logs', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0, fireLevel:1 },
  73: { id:73, name:'Oak logs', stackable:false, value:25, examine:'Some oak logs.', type:'logs', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0, fireLevel:15 },
  74: { id:74, name:'Willow logs', stackable:false, value:25, examine:'Some willow logs.', type:'logs', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0, fireLevel:30 },
  75: { id:75, name:'Maple logs', stackable:false, value:40, examine:'Some maple logs.', type:'logs', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0, fireLevel:45 },
  76: { id:76, name:'Yew logs', stackable:false, value:160, examine:'Some yew logs.', type:'logs', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0, fireLevel:60 },
  77: { id:77, name:'Magic logs', stackable:false, value:1000, examine:'Some magic logs.', type:'logs', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0, fireLevel:75 },

  // Raw fish
  80: { id:80, name:'Raw shrimp', stackable:false, value:1, examine:'A raw shrimp.', type:'raw_fish', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0, cookedId:45 },
  81: { id:81, name:'Raw anchovies', stackable:false, value:1, examine:'A raw anchovy.', type:'raw_fish', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0, cookedId:46 },
  82: { id:82, name:'Raw trout', stackable:false, value:10, examine:'A raw trout.', type:'raw_fish', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0, cookedId:83 },
  83: { id:83, name:'Trout', stackable:false, value:10, examine:'A cooked trout.', type:'food', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:70 },
  84: { id:84, name:'Raw salmon', stackable:false, value:10, examine:'A raw salmon.', type:'raw_fish', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0, cookedId:85 },
  85: { id:85, name:'Salmon', stackable:false, value:10, examine:'A cooked salmon.', type:'food', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:90 },
  86: { id:86, name:'Raw tuna', stackable:false, value:25, examine:'A raw tuna.', type:'raw_fish', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0, cookedId:44 },
  87: { id:87, name:'Raw lobster', stackable:false, value:90, examine:'A raw lobster.', type:'raw_fish', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0, cookedId:43 },
  88: { id:88, name:'Raw swordfish', stackable:false, value:200, examine:'A raw swordfish.', type:'raw_fish', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0, cookedId:89 },
  89: { id:89, name:'Swordfish', stackable:false, value:200, examine:'A cooked swordfish.', type:'food', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:140 },

  // Runes
  90: { id:90, name:'Air rune', stackable:true, value:4, examine:'Used for air spells.', type:'rune', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  91: { id:91, name:'Water rune', stackable:true, value:4, examine:'Used for water spells.', type:'rune', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  92: { id:92, name:'Earth rune', stackable:true, value:4, examine:'Used for earth spells.', type:'rune', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  93: { id:93, name:'Fire rune', stackable:true, value:4, examine:'Used for fire spells.', type:'rune', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  94: { id:94, name:'Mind rune', stackable:true, value:3, examine:'Used for mind spells.', type:'rune', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  95: { id:95, name:'Body rune', stackable:true, value:3, examine:'Used for body spells.', type:'rune', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  96: { id:96, name:'Chaos rune', stackable:true, value:80, examine:'Used for chaos spells.', type:'rune', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  97: { id:97, name:'Death rune', stackable:true, value:150, examine:'Used for death spells.', type:'rune', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  98: { id:98, name:'Blood rune', stackable:true, value:300, examine:'Used for blood spells.', type:'rune', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  99: { id:99, name:'Nature rune', stackable:true, value:200, examine:'Used for nature spells.', type:'rune', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  100: { id:100, name:'Law rune', stackable:true, value:200, examine:'Used for law spells.', type:'rune', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },

  // Fletching/Ranging
  101: { id:101, name:'Bow string', stackable:false, value:50, examine:'A bow string.', type:'misc', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  102: { id:102, name:'Shortbow (u)', stackable:false, value:5, examine:'An unstrung shortbow.', type:'misc', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  103: { id:103, name:'Shortbow', stackable:false, value:100, examine:'A shortbow.', type:'weapon', slot:'weapon', attackBonus:5, strengthBonus:0, defenceBonus:0, healAmount:0, skill:'ranged', level:1 },
  104: { id:104, name:'Arrow shaft', stackable:true, value:1, examine:'An arrow shaft.', type:'misc', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  105: { id:105, name:'Bronze arrow', stackable:true, value:1, examine:'A bronze tipped arrow.', type:'ammo', slot:'arrows', attackBonus:5, strengthBonus:0, defenceBonus:0, healAmount:0 },
  106: { id:106, name:'Iron arrow', stackable:true, value:2, examine:'An iron tipped arrow.', type:'ammo', slot:'arrows', attackBonus:10, strengthBonus:0, defenceBonus:0, healAmount:0 },

  // Prayer items
  110: { id:110, name:'Holy symbol', stackable:false, value:500, examine:'A holy symbol of Saradomin.', type:'armour', slot:'neck', attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  111: { id:111, name:"Monk's robe top", stackable:false, value:26, examine:"A monk's robe top.", type:'armour', slot:'body', attackBonus:0, strengthBonus:0, defenceBonus:1, healAmount:0 },
  112: { id:112, name:"Monk's robe", stackable:false, value:26, examine:"A monk's robe.", type:'armour', slot:'legs', attackBonus:0, strengthBonus:0, defenceBonus:1, healAmount:0 },

  // Potions
  120: { id:120, name:'Antipoison potion', stackable:false, value:90, examine:'A potion to cure poison.', type:'potion', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },
  121: { id:121, name:'Strength potion', stackable:false, value:100, examine:'Temporarily boosts strength.', type:'potion', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0, strengthBoost:3 },
  122: { id:122, name:'Attack potion', stackable:false, value:100, examine:'Temporarily boosts attack.', type:'potion', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0, attackBoost:3 },

  // Monster drops
  200: { id:200, name:'Cowhide', stackable:false, value:25, examine:'The hide of a cow.', type:'misc', slot:null, attackBonus:0, strengthBonus:0, defenceBonus:0, healAmount:0 },

  // Legs armour
  201: { id:201, name:'Bronze platelegs', stackable:false, value:200, examine:'Bronze platelegs.', type:'armour', slot:'legs', attackBonus:0, strengthBonus:0, defenceBonus:5, healAmount:0, skill:'defence', level:1 },
  202: { id:202, name:'Iron platelegs', stackable:false, value:800, examine:'Iron platelegs.', type:'armour', slot:'legs', attackBonus:0, strengthBonus:0, defenceBonus:9, healAmount:0, skill:'defence', level:1 },
  203: { id:203, name:'Steel platelegs', stackable:false, value:3200, examine:'Steel platelegs.', type:'armour', slot:'legs', attackBonus:0, strengthBonus:0, defenceBonus:15, healAmount:0, skill:'defence', level:5 },
};

export const ITEMS_BY_NAME = {};
for (const [id, item] of Object.entries(ITEMS)) {
  ITEMS_BY_NAME[item.name.toLowerCase()] = item;
}
