import { TILE } from '../constants.js';

export const TILES = {
  [TILE.GRASS]:      { name: 'Grass',      color: '#4a7c3f', passable: true,  opacity: 1.0 },
  [TILE.WATER]:      { name: 'Water',      color: '#1a5276', passable: false, opacity: 1.0 },
  [TILE.TREE]:       { name: 'Tree',       color: '#2d6a1e', passable: false, opacity: 1.0 },
  [TILE.WALL]:       { name: 'Wall',       color: '#5d4037', passable: false, opacity: 1.0 },
  [TILE.FLOOR]:      { name: 'Floor',      color: '#8d6e63', passable: true,  opacity: 1.0 },
  [TILE.PATH]:       { name: 'Path',       color: '#a1887f', passable: true,  opacity: 1.0 },
  [TILE.SAND]:       { name: 'Sand',       color: '#d4b483', passable: true,  opacity: 1.0 },
  [TILE.ROCK]:       { name: 'Rock',       color: '#607d8b', passable: false, opacity: 1.0 },
  [TILE.SHALLOW]:    { name: 'Shallow water', color: '#2980b9', passable: true,  opacity: 1.0 },
  [TILE.DOOR]:       { name: 'Door',       color: '#6d4c41', passable: true,  opacity: 1.0 },
  [TILE.FENCE]:      { name: 'Fence',      color: '#8d6e63', passable: false, opacity: 1.0 },
  [TILE.ALTAR]:      { name: 'Altar',      color: '#f5f5f5', passable: true,  opacity: 1.0 },
  [TILE.BANK]:       { name: 'Bank booth', color: '#ffd700', passable: false, opacity: 1.0 },
  [TILE.COUNTER]:    { name: 'Counter',    color: '#a1887f', passable: false, opacity: 1.0 },
  [TILE.BRIDGE]:     { name: 'Bridge',     color: '#8d6e63', passable: true,  opacity: 1.0 },
  [TILE.DEEP_WATER]: { name: 'Deep water', color: '#0d3349', passable: false, opacity: 1.0 },
};
