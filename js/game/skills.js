function generateXpTable() {
  const table = [0]; // level 1 = 0 xp
  let points = 0;
  for (let level = 1; level < 99; level++) {
    points += Math.floor(level + 300 * Math.pow(2, level / 7));
    table.push(Math.floor(points / 4));
  }
  return table;
}

export const XP_TABLE = generateXpTable();

export function xpToLevel(xp) {
  let level = 1;
  for (let i = 1; i < XP_TABLE.length; i++) {
    if (xp >= XP_TABLE[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return Math.min(99, level);
}

export function levelToXp(level) {
  if (level <= 1) return 0;
  if (level > 99) level = 99;
  return XP_TABLE[level - 1];
}

export const SKILL_NAMES = [
  'attack', 'defence', 'strength', 'hits', 'ranged', 'prayer', 'magic',
  'cooking', 'woodcut', 'fletching', 'fishing', 'firemaking', 'crafting',
  'smithing', 'mining', 'herblaw', 'agility', 'thieving'
];

export function createSkills() {
  const skills = {};
  for (const name of SKILL_NAMES) {
    skills[name] = { xp: 0, level: 1 };
  }
  // Start hits at level 10 with some xp (more fun)
  skills.hits.xp = XP_TABLE[9];
  skills.hits.level = 10;
  return skills;
}

export function addXp(skills, skillName, amount) {
  if (!skills[skillName]) return false;
  const prevLevel = skills[skillName].level;
  skills[skillName].xp += amount;
  const newLevel = xpToLevel(skills[skillName].xp);
  skills[skillName].level = newLevel;
  return newLevel > prevLevel;
}

export function calcCombatLevel(skills) {
  const def = skills.defence.level;
  const hits = skills.hits.level;
  const atk = skills.attack.level;
  const str = skills.strength.level;
  const ranged = skills.ranged.level;
  const magic = skills.magic.level;
  return Math.floor((def + hits) / 4 + Math.max(atk + str, ranged * 1.5, magic * 2) / 4);
}

export function xpToNextLevel(skills, skillName) {
  const skill = skills[skillName];
  if (!skill) return 0;
  if (skill.level >= 99) return 0;
  return XP_TABLE[skill.level] - skill.xp;
}
