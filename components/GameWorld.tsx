'use client';

import { useEffect, useRef, useState } from 'react';
import { EventObject, Life } from '@/types/game';

interface GameWorldProps {
  life: Life;
  events: EventObject[];
  onEventTrigger: (eventId: string) => void;
  completedEvents: Set<string>;
  karma?: number;
  visitedLives?: string[];
}

const TILE_SIZE = 36;
const MAP_COLS = 20;
const MAP_ROWS = 14;

type TileType = 'grass' | 'path' | 'tree' | 'bush' | 'water' | 'building' | 'floor' | 'wall' | 'sand' | 'temple' | 'rock' | 'fence' | 'flower' | 'bench' | 'fountain' | 'tallGrass' | 'lab';

interface Tile {
  type: TileType;
  walkable: boolean;
  jumpable?: boolean;
  jumpDirection?: 'up' | 'down' | 'left' | 'right';
}

const PLAYER_SPRITES: Record<string, string> = {
  poor_student: '🎓',
  dog: '🐕',
  snake: '🐍',
  rich_human: '💎',
  monk: '🧘',
  microorganism: '🦠',
};

interface MapConfig {
  orbPositions: { row: number; col: number }[];
  startPos: { row: number; col: number };
}

const MAP_TITLES: Record<string, string> = {
  poor_student: 'Campus Path',
  dog: 'Alley Park',
  snake: 'Forest Edge',
  rich_human: 'Mansion Garden',
  monk: 'Mountain Temple',
  microorganism: 'Petri Dish',
};

const MAP_CONFIGS: Record<string, MapConfig> = {
  poor_student: {
    orbPositions: [
      { row: 2, col: 6 }, { row: 2, col: 14 }, { row: 4, col: 6 },
      { row: 5, col: 5 }, { row: 5, col: 14 }, { row: 6, col: 10 },
      { row: 8, col: 14 }, { row: 9, col: 5 }, { row: 10, col: 10 }, { row: 12, col: 6 },
    ],
    startPos: { row: 11, col: 10 },
  },
  dog: {
    orbPositions: [
      { row: 2, col: 9 }, { row: 3, col: 5 }, { row: 3, col: 13 },
      { row: 5, col: 9 }, { row: 6, col: 4 }, { row: 6, col: 15 },
      { row: 8, col: 9 }, { row: 10, col: 6 }, { row: 10, col: 12 }, { row: 12, col: 9 },
    ],
    startPos: { row: 11, col: 9 },
  },
  snake: {
    orbPositions: [
      { row: 2, col: 6 }, { row: 2, col: 13 }, { row: 3, col: 5 },
      { row: 3, col: 14 }, { row: 6, col: 6 }, { row: 7, col: 4 },
      { row: 7, col: 15 }, { row: 9, col: 13 }, { row: 11, col: 5 }, { row: 11, col: 14 },
    ],
    startPos: { row: 11, col: 10 },
  },
  rich_human: {
    orbPositions: [
      { row: 2, col: 9 }, { row: 4, col: 6 }, { row: 4, col: 12 },
      { row: 6, col: 9 }, { row: 7, col: 5 }, { row: 7, col: 14 },
      { row: 8, col: 9 }, { row: 9, col: 6 }, { row: 10, col: 11 }, { row: 12, col: 9 },
    ],
    startPos: { row: 11, col: 9 },
  },
  monk: {
    orbPositions: [
      { row: 3, col: 10 }, { row: 4, col: 6 }, { row: 4, col: 14 },
      { row: 5, col: 5 }, { row: 5, col: 15 }, { row: 6, col: 10 },
      { row: 9, col: 5 }, { row: 9, col: 15 }, { row: 10, col: 6 }, { row: 10, col: 14 },
    ],
    startPos: { row: 11, col: 10 },
  },
  microorganism: {
    orbPositions: [
      { row: 2, col: 10 }, { row: 3, col: 8 }, { row: 3, col: 11 },
      { row: 4, col: 7 }, { row: 4, col: 12 }, { row: 5, col: 7 },
      { row: 8, col: 7 }, { row: 9, col: 8 }, { row: 9, col: 11 }, { row: 10, col: 10 },
    ],
    startPos: { row: 11, col: 10 },
  },
};

function generateCampusMap(): Tile[][] {
  const map: Tile[][] = [];
  for (let row = 0; row < MAP_ROWS; row++) {
    map[row] = [];
    for (let col = 0; col < MAP_COLS; col++) {
      if (row === 0 || row === MAP_ROWS - 1 || col === 0 || col === MAP_COLS - 1) {
        map[row][col] = { type: 'tree', walkable: false };
      } else if (row === 5 && col >= 4 && col <= 15) {
        map[row][col] = { type: 'path', walkable: true };
      } else if (col === 10 && row >= 2 && row <= 12) {
        map[row][col] = { type: 'path', walkable: true };
      } else if (row === 9 && col >= 4 && col <= 15) {
        map[row][col] = { type: 'path', walkable: true };
      } else if (col === 6 && row >= 2 && row <= 12) {
        map[row][col] = { type: 'path', walkable: true };
      } else if (col === 14 && row >= 2 && row <= 12) {
        map[row][col] = { type: 'path', walkable: true };
      } else if ((row === 2 || row === 3) && col >= 2 && col <= 4) {
        map[row][col] = { type: 'building', walkable: false };
      } else if ((row === 2 || row === 3) && col >= 16 && col <= 18) {
        map[row][col] = { type: 'building', walkable: false };
      } else if ((row === 11 || row === 12) && col >= 2 && col <= 4) {
        map[row][col] = { type: 'building', walkable: false };
      } else if ((row === 11 || row === 12) && col >= 16 && col <= 18) {
        map[row][col] = { type: 'building', walkable: false };
      } else if ((row === 6 || row === 7) && (col === 3 || col === 16)) {
        map[row][col] = { type: 'tree', walkable: false };
      } else if (row === 3 && (col === 8 || col === 12)) {
        map[row][col] = { type: 'bush', walkable: false, jumpable: true, jumpDirection: 'down' };
      } else if (row === 4 && (col === 8 || col === 12)) {
        map[row][col] = { type: 'bush', walkable: false };
      } else if (row === 10 && (col === 8 || col === 12)) {
        map[row][col] = { type: 'bush', walkable: false, jumpable: true, jumpDirection: 'down' };
      } else if (row === 11 && (col === 8 || col === 12)) {
        map[row][col] = { type: 'bush', walkable: false };
      } else if (row === 7 && col >= 7 && col <= 9) {
        map[row][col] = { type: 'water', walkable: false };
      } else if (row === 7 && col >= 11 && col <= 13) {
        map[row][col] = { type: 'water', walkable: false };
      } else {
        map[row][col] = { type: 'grass', walkable: true };
      }
    }
  }
  return map;
}

function generateParkMap(): Tile[][] {
  const map: Tile[][] = [];
  for (let row = 0; row < MAP_ROWS; row++) {
    map[row] = [];
    for (let col = 0; col < MAP_COLS; col++) {
      if (row === 0 || row === MAP_ROWS - 1 || col === 0 || col === MAP_COLS - 1) {
        map[row][col] = { type: 'fence', walkable: false };
      } else if (row === 6 && col >= 2 && col <= 17) {
        map[row][col] = { type: 'path', walkable: true };
      } else if (col === 9 && row >= 1 && row <= 12) {
        map[row][col] = { type: 'path', walkable: true };
      } else if ((row === 3 || row === 10) && col >= 4 && col <= 14) {
        map[row][col] = { type: 'path', walkable: true };
      } else if ((row === 4 || row === 5) && (col === 2 || col === 3 || col === 16 || col === 17)) {
        map[row][col] = { type: 'tree', walkable: false };
      } else if ((row === 8 || row === 9) && (col === 2 || col === 3 || col === 16 || col === 17)) {
        map[row][col] = { type: 'tree', walkable: false };
      } else if (row === 7 && (col === 5 || col === 13)) {
        map[row][col] = { type: 'bench', walkable: false };
      } else if ((row === 2 || row === 11) && (col === 5 || col === 14)) {
        map[row][col] = { type: 'flower', walkable: true };
      } else {
        map[row][col] = { type: 'grass', walkable: true };
      }
    }
  }
  return map;
}

function generateForestMap(): Tile[][] {
  const map: Tile[][] = [];
  for (let row = 0; row < MAP_ROWS; row++) {
    map[row] = [];
    for (let col = 0; col < MAP_COLS; col++) {
      if (row === 0 || row === MAP_ROWS - 1 || col === 0 || col === MAP_COLS - 1) {
        map[row][col] = { type: 'tree', walkable: false };
      } else if ((row === 3 || row === 7 || row === 11) && col >= 3 && col <= 16) {
        map[row][col] = { type: 'path', walkable: true };
      } else if ((col === 6 || col === 13) && row >= 2 && row <= 12) {
        map[row][col] = { type: 'path', walkable: true };
      } else if (row === 5 && col >= 8 && col <= 11) {
        map[row][col] = { type: 'water', walkable: false };
      } else if ((row === 2 || row === 4) && (col === 4 || col === 9 || col === 15)) {
        map[row][col] = { type: 'tree', walkable: false };
      } else if ((row === 8 || row === 10) && (col === 5 || col === 11 || col === 14)) {
        map[row][col] = { type: 'rock', walkable: false };
      } else if ((row === 6) && (col === 3 || col === 16)) {
        map[row][col] = { type: 'bush', walkable: false };
      } else if ((row === 2 || row === 9) && (col === 7 || col === 12)) {
        map[row][col] = { type: 'tallGrass', walkable: true };
      } else {
        map[row][col] = { type: 'tallGrass', walkable: true };
      }
    }
  }
  return map;
}

function generateMansionMap(): Tile[][] {
  const map: Tile[][] = [];
  for (let row = 0; row < MAP_ROWS; row++) {
    map[row] = [];
    for (let col = 0; col < MAP_COLS; col++) {
      if (row === 0 || row === MAP_ROWS - 1 || col === 0 || col === MAP_COLS - 1) {
        map[row][col] = { type: 'wall', walkable: false };
      } else if (row === 7 && col >= 3 && col <= 16) {
        map[row][col] = { type: 'floor', walkable: true };
      } else if (col === 9 && row >= 2 && row <= 12) {
        map[row][col] = { type: 'floor', walkable: true };
      } else if ((row === 4 || row === 10) && col >= 5 && col <= 13) {
        map[row][col] = { type: 'floor', walkable: true };
      } else if ((row === 2 || row === 3) && col >= 2 && col <= 5) {
        map[row][col] = { type: 'building', walkable: false };
      } else if ((row === 2 || row === 3) && col >= 13 && col <= 16) {
        map[row][col] = { type: 'building', walkable: false };
      } else if (row === 5 && col >= 10 && col <= 12) {
        map[row][col] = { type: 'fountain', walkable: false };
      } else if ((row === 8 || row === 9) && (col === 5 || col === 6 || col === 12 || col === 13)) {
        map[row][col] = { type: 'flower', walkable: true };
      } else {
        map[row][col] = { type: 'grass', walkable: true };
      }
    }
  }
  return map;
}

function generateTempleMap(): Tile[][] {
  const map: Tile[][] = [];
  for (let row = 0; row < MAP_ROWS; row++) {
    map[row] = [];
    for (let col = 0; col < MAP_COLS; col++) {
      if (row === 0 || row === MAP_ROWS - 1 || col === 0 || col === MAP_COLS - 1) {
        map[row][col] = { type: 'rock', walkable: false };
      } else if (col === 10 && row >= 1 && row <= 12) {
        map[row][col] = { type: 'temple', walkable: true };
      } else if ((row === 5 || row === 9) && col >= 4 && col <= 16) {
        map[row][col] = { type: 'temple', walkable: true };
      } else if ((col === 6 || col === 14) && row >= 3 && row <= 11) {
        map[row][col] = { type: 'temple', walkable: true };
      } else if ((row === 1 || row === 2) && col >= 8 && col <= 12) {
        map[row][col] = { type: 'building', walkable: false };
      } else if (row === 7 && col >= 8 && col <= 12) {
        map[row][col] = { type: 'water', walkable: false };
      } else if ((row === 3 || row === 11) && (col === 4 || col === 16)) {
        map[row][col] = { type: 'tree', walkable: false };
      } else {
        map[row][col] = { type: 'sand', walkable: true };
      }
    }
  }
  return map;
}

function generatePetriDishMap(): Tile[][] {
  const map: Tile[][] = [];
  for (let row = 0; row < MAP_ROWS; row++) {
    map[row] = [];
    for (let col = 0; col < MAP_COLS; col++) {
      const centerRow = MAP_ROWS / 2;
      const centerCol = MAP_COLS / 2;
      const distFromCenter = Math.sqrt(Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2));
      
      if (distFromCenter > 6.5) {
        map[row][col] = { type: 'wall', walkable: false };
      } else if ((row === 4 || row === 9) && col >= 6 && col <= 13) {
        map[row][col] = { type: 'lab', walkable: true };
      } else if ((col === 7 || col === 12) && row >= 4 && row <= 9) {
        map[row][col] = { type: 'lab', walkable: true };
      } else if ((row === 6 && col === 10) || (row === 8 && col === 9)) {
        map[row][col] = { type: 'water', walkable: false };
      } else if ((row === 5 && col === 9) || (row === 8 && col === 13)) {
        map[row][col] = { type: 'rock', walkable: false };
      } else if (distFromCenter < 1.5) {
        map[row][col] = { type: 'water', walkable: false };
      } else {
        map[row][col] = { type: 'lab', walkable: true };
      }
    }
  }
  return map;
}

function generateMapForLife(lifeId: string): Tile[][] {
  switch (lifeId) {
    case 'poor_student': return generateCampusMap();
    case 'dog': return generateParkMap();
    case 'snake': return generateForestMap();
    case 'rich_human': return generateMansionMap();
    case 'monk': return generateTempleMap();
    case 'microorganism': return generatePetriDishMap();
    default: return generateCampusMap();
  }
}

function getTileColor(type: TileType): string {
  switch (type) {
    case 'grass': return 'bg-green-600';
    case 'path': return 'bg-amber-700';
    case 'tree': return 'bg-green-900';
    case 'bush': return 'bg-green-700';
    case 'water': return 'bg-blue-500';
    case 'building': return 'bg-gray-600';
    case 'floor': return 'tile-floor';
    case 'wall': return 'tile-wall';
    case 'sand': return 'tile-sand';
    case 'temple': return 'tile-temple';
    case 'rock': return 'tile-rock';
    case 'fence': return 'tile-fence';
    case 'flower': return 'tile-flower';
    case 'bench': return 'tile-bench';
    case 'fountain': return 'tile-fountain';
    case 'tallGrass': return 'tile-tallGrass';
    case 'lab': return 'tile-lab';
    default: return 'bg-gray-500';
  }
}

function getTileDecoration(type: TileType): string {
  switch (type) {
    case 'tree': return '';
    case 'bush': return '';
    case 'water': return '';
    case 'building': return '';
    case 'wall': return '';
    case 'rock': return '';
    case 'fence': return '';
    case 'flower': return '';
    case 'bench': return '';
    case 'fountain': return '';
    case 'tallGrass': return '';
    case 'temple': return '';
    case 'lab': return '';
    default: return '';
  }
}

export default function GameWorld({ life, events, onEventTrigger, completedEvents, karma = 60, visitedLives = [] }: GameWorldProps) {
  const mapConfig = MAP_CONFIGS[life.id] || MAP_CONFIGS.poor_student;
  const [tileMap, setTileMap] = useState<Tile[][]>(() => generateMapForLife(life.id));
  const [playerPos, setPlayerPos] = useState(mapConfig.startPos);
  const [facing, setFacing] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [eventTriggered, setEventTriggered] = useState(false);
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMoveRef = useRef<number>(0);
  const playerPosRef = useRef(mapConfig.startPos);
  const isMovingRef = useRef(false);
  const tileMapRef = useRef<Tile[][]>(tileMap);

  const playerSprite = PLAYER_SPRITES[life.id] || '🎓';
  const orbPositions = mapConfig.orbPositions;
  const mapTitle = MAP_TITLES[life.id] || 'Unknown Area';

  useEffect(() => {
    const newMap = generateMapForLife(life.id);
    setTileMap(newMap);
    tileMapRef.current = newMap;
    setPlayerPos(mapConfig.startPos);
    playerPosRef.current = mapConfig.startPos;
    setFacing('down');
    setIsMoving(false);
    isMovingRef.current = false;
    setIsJumping(false);
  }, [life.id, mapConfig.startPos]);

  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  useEffect(() => {
    isMovingRef.current = isMoving;
  }, [isMoving]);

  useEffect(() => {
    tileMapRef.current = tileMap;
  }, [tileMap]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMovingRef.current) return;
      
      const now = Date.now();
      if (now - lastMoveRef.current < 200) return;

      const key = e.key.toLowerCase();
      const currentPos = playerPosRef.current;
      let newRow = currentPos.row;
      let newCol = currentPos.col;

      let direction: 'up' | 'down' | 'left' | 'right' | null = null;

      if (key === 'arrowup' || key === 'w') {
        newRow = currentPos.row - 1;
        direction = 'up';
      } else if (key === 'arrowdown' || key === 's') {
        newRow = currentPos.row + 1;
        direction = 'down';
      } else if (key === 'arrowleft' || key === 'a') {
        newCol = currentPos.col - 1;
        direction = 'left';
      } else if (key === 'arrowright' || key === 'd') {
        newCol = currentPos.col + 1;
        direction = 'right';
      } else {
        return;
      }

      if (newRow >= 0 && newRow < MAP_ROWS && newCol >= 0 && newCol < MAP_COLS) {
        const targetTile = tileMapRef.current[newRow][newCol];
        
        if (targetTile.walkable) {
          isMovingRef.current = true;
          setIsMoving(true);
          lastMoveRef.current = now;
          const newPos = { row: newRow, col: newCol };
          playerPosRef.current = newPos;
          setPlayerPos(newPos);
          if (direction) setFacing(direction);
          
          if (moveTimeoutRef.current) {
            clearTimeout(moveTimeoutRef.current);
          }
          moveTimeoutRef.current = setTimeout(() => {
            isMovingRef.current = false;
            setIsMoving(false);
          }, 200);
        } else if (targetTile.jumpable && targetTile.jumpDirection === direction) {
          let landRow = newRow;
          let landCol = newCol;
          
          if (direction === 'up') landRow -= 1;
          else if (direction === 'down') landRow += 1;
          else if (direction === 'left') landCol -= 1;
          else if (direction === 'right') landCol += 1;
          
          if (
            landRow >= 0 && landRow < MAP_ROWS &&
            landCol >= 0 && landCol < MAP_COLS &&
            tileMapRef.current[landRow][landCol].walkable
          ) {
            isMovingRef.current = true;
            setIsMoving(true);
            setIsJumping(true);
            lastMoveRef.current = now;
            const newPos = { row: landRow, col: landCol };
            playerPosRef.current = newPos;
            setPlayerPos(newPos);
            if (direction) setFacing(direction);
            
            if (moveTimeoutRef.current) {
              clearTimeout(moveTimeoutRef.current);
            }
            moveTimeoutRef.current = setTimeout(() => {
              isMovingRef.current = false;
              setIsMoving(false);
              setIsJumping(false);
            }, 300);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, []);

  const isOnActiveOrb = () => {
    const completedCount = completedEvents.size;
    if (completedCount >= events.length) return false;
    
    const nextOrbPos = orbPositions[completedCount];
    if (!nextOrbPos) return false;
    
    return playerPos.row === nextOrbPos.row && playerPos.col === nextOrbPos.col;
  };

  useEffect(() => {
    const handleInteract = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'enter') return;
      
      const completedCount = completedEvents.size;
      if (completedCount >= events.length) return;
      
      const nextEvent = events[completedCount];
      const nextOrbPos = orbPositions[completedCount];
      
      if (nextOrbPos && playerPos.row === nextOrbPos.row && playerPos.col === nextOrbPos.col) {
        if (!completedEvents.has(nextEvent.id)) {
          setEventTriggered(true);
          onEventTrigger(nextEvent.id);
        }
      }
    };

    window.addEventListener('keydown', handleInteract);
    return () => window.removeEventListener('keydown', handleInteract);
  }, [playerPos, events, completedEvents, onEventTrigger, orbPositions]);

  useEffect(() => {
    setEventTriggered(false);
  }, [completedEvents.size]);

  const getKarmaCategory = (karmaValue: number): string => {
    if (karmaValue >= 95) return 'Enlightened';
    if (karmaValue >= 80) return 'Noble';
    if (karmaValue >= 60) return 'Good';
    if (karmaValue >= 40) return 'Neutral';
    if (karmaValue >= 21) return 'Troubled';
    return 'Lost';
  };

  return (
    <div className="retro-game-screen">
      <div className="retro-hud">
        <div className="retro-hud-row">
          <div className="retro-hud-item">
            <span className="retro-hud-label">Life:</span>
            <span className="retro-hud-value">{life.emoji} {life.name}</span>
          </div>
          <div className="retro-hud-item">
            <span className="retro-hud-label">Karma:</span>
            <span className="retro-hud-value">{Math.round(karma)} ({getKarmaCategory(karma)})</span>
          </div>
        </div>
        <div className="retro-hud-row">
          <div className="retro-hud-item">
            <span className="retro-hud-label">Progress:</span>
            <span className="retro-hud-value">{completedEvents.size}/{events.length}</span>
          </div>
          <div className="retro-hud-item">
            <span className="retro-hud-label">Lives:</span>
            <span className="retro-hud-value">{visitedLives.length}/6</span>
          </div>
        </div>
        <div className="retro-hud-instruction">
          ✨ Find the Karma Orb • Stand on it and press ENTER
        </div>
      </div>
      
      <div className="retro-viewport">
        <div className="retro-map-title">
          {mapTitle}
        </div>
        <div
          className="retro-game-frame"
          style={{
            width: MAP_COLS * TILE_SIZE,
            height: MAP_ROWS * TILE_SIZE,
          }}
        >
        <div
          className="relative"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${MAP_COLS}, ${TILE_SIZE}px)`,
            gridTemplateRows: `repeat(${MAP_ROWS}, ${TILE_SIZE}px)`,
            width: MAP_COLS * TILE_SIZE,
            height: MAP_ROWS * TILE_SIZE,
          }}
        >
          {tileMap.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`${getTileColor(tile.type)} ${tile.jumpable ? 'tile-jumpable' : ''} border border-black/20 flex items-center justify-center text-xs`}
                style={{
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  imageRendering: 'pixelated',
                }}
              >
                {getTileDecoration(tile.type)}
              </div>
            ))
          )}
        </div>

        {orbPositions.slice(0, events.length).map((orbPos: { row: number; col: number }, index: number) => {
          const eventId = events[index]?.id;
          const isCompleted = completedEvents.has(eventId);
          const isActive = index === completedEvents.size;
          const isFuture = index > completedEvents.size;

          return (
            <div
              key={`orb-${index}`}
              className="absolute pointer-events-none flex items-center justify-center"
              style={{
                left: orbPos.col * TILE_SIZE,
                top: orbPos.row * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
                zIndex: 5,
              }}
            >
              <div
                className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'opacity-30 grayscale'
                    : isFuture
                    ? 'opacity-5'
                    : 'animate-pulse'
                }`}
                style={{
                  width: isActive ? 22 : 20,
                  height: isActive ? 22 : 20,
                  fontSize: isActive ? '16px' : '14px',
                  background: isCompleted
                    ? 'rgba(100, 100, 100, 0.5)'
                    : isFuture
                    ? 'rgba(110, 110, 110, 0.15)'
                    : 'radial-gradient(circle, rgba(255, 235, 0, 1), rgba(255, 215, 0, 0.95), rgba(255, 185, 0, 0.85), rgba(255, 165, 0, 0.7))',
                  boxShadow: isActive 
                    ? '0 0 20px rgba(255, 215, 0, 1), 0 0 12px rgba(255, 215, 0, 0.8), 0 0 6px rgba(255, 185, 0, 0.6), inset 0 0 8px rgba(255, 255, 255, 0.5)' 
                    : 'none',
                }}
              >
                {isFuture ? '○' : isCompleted ? '✓' : '✨'}
              </div>
            </div>
          );
        })}

        <div
          className="absolute"
          style={{
            left: playerPos.col * TILE_SIZE,
            top: playerPos.row * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
            zIndex: 10,
            transition: 'left 0.2s ease-out, top 0.2s ease-out',
          }}
        >
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            style={{
              width: '26px',
              height: '8px',
              background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 80%)',
              borderRadius: '50%',
            }}
          />
          <div
            className={`retro-player absolute flex items-center justify-center ${isJumping ? 'player-jumping' : isMoving ? 'player-moving' : ''} facing-${facing}`}
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {playerSprite}
          </div>
        </div>

        {isOnActiveOrb() && !eventTriggered && (
          <div className="retro-interact-hint">
            ✨ Press ENTER to play
          </div>
        )}
        
        {!eventTriggered && (
          <div className="retro-controls-hint">
            Use Arrow Keys or WASD to move
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
