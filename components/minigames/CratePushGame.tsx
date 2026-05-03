'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

const LEVEL = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 3, 0, 0, 1],
  [1, 0, 2, 0, 3, 0, 1],
  [1, 0, 0, 2, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
];

export default function CratePushGame({ onComplete }: MiniGameProps) {
  const [playerPos, setPlayerPos] = useState({ row: 2, col: 2 });
  const [crates, setCrates] = useState([
    { row: 3, col: 2 },
    { row: 4, col: 3 }
  ]);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);

  const switches = [
    { row: 2, col: 3 },
    { row: 3, col: 4 }
  ];

  useEffect(() => {
    const allOnSwitches = switches.every(sw =>
      crates.some(cr => cr.row === sw.row && cr.col === sw.col)
    );

    if (allOnSwitches && !completedRef.current) {
      completedRef.current = true;
      setGameOver(true);
      onComplete({
        success: true,
        consequenceBonus: 2,
        message: "Puzzle solved. Strategy and patience align."
      });
    }
  }, [crates, onComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      let dr = 0, dc = 0;
      if (e.key === 'ArrowUp' || e.key === 'w') dr = -1;
      else if (e.key === 'ArrowDown' || e.key === 's') dr = 1;
      else if (e.key === 'ArrowLeft' || e.key === 'a') dc = -1;
      else if (e.key === 'ArrowRight' || e.key === 'd') dc = 1;
      else return;

      const newRow = playerPos.row + dr;
      const newCol = playerPos.col + dc;

      if (LEVEL[newRow][newCol] === 1) return;

      const crateIndex = crates.findIndex(c => c.row === newRow && c.col === newCol);
      
      if (crateIndex !== -1) {
        const crateNewRow = newRow + dr;
        const crateNewCol = newCol + dc;

        if (LEVEL[crateNewRow][crateNewCol] === 1) return;
        if (crates.some(c => c.row === crateNewRow && c.col === crateNewCol)) return;

        const newCrates = [...crates];
        newCrates[crateIndex] = { row: crateNewRow, col: crateNewCol };
        setCrates(newCrates);
      }

      setPlayerPos({ row: newRow, col: newCol });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, crates, gameOver]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Crate Push</h3>
        <p className="text-slate-300 text-sm">Push crates onto all switches</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6 flex justify-center">
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(7, 44px)` }}>
          {LEVEL.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isPlayer = playerPos.row === rowIndex && playerPos.col === colIndex;
              const crate = crates.find(c => c.row === rowIndex && c.col === colIndex);
              const isSwitch = switches.some(s => s.row === rowIndex && s.col === colIndex);
              const isWall = cell === 1;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-11 h-11 flex items-center justify-center text-2xl ${
                    isWall ? 'bg-slate-700' : isSwitch ? 'bg-green-900/50' : 'bg-slate-900'
                  } border border-slate-600`}
                >
                  {isPlayer ? '🧘' : crate ? '📦' : isSwitch ? '🎯' : ''}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="text-center text-sm text-slate-400">
        Use Arrow Keys or WASD to push crates
      </div>
    </div>
  );
}
