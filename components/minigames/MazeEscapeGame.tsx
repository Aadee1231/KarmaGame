'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

const MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export default function MazeEscapeGame({ onComplete }: MiniGameProps) {
  const [playerPos, setPlayerPos] = useState({ row: 1, col: 1 });
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (!completedRef.current) {
            completedRef.current = true;
            setGameOver(true);
            onComplete({
              success: false,
              consequenceBonus: -1,
              message: "Lost in the maze. Sometimes we need to find our way faster."
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    if (MAZE[playerPos.row][playerPos.col] === 2 && !completedRef.current) {
      completedRef.current = true;
      setGameOver(true);
      onComplete({
        success: true,
        consequenceBonus: 2,
        message: "You found the exit. Persistence reveals the path."
      });
    }
  }, [playerPos, onComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      let newRow = playerPos.row;
      let newCol = playerPos.col;

      if (e.key === 'ArrowUp' || e.key === 'w') newRow--;
      else if (e.key === 'ArrowDown' || e.key === 's') newRow++;
      else if (e.key === 'ArrowLeft' || e.key === 'a') newCol--;
      else if (e.key === 'ArrowRight' || e.key === 'd') newCol++;
      else return;

      if (MAZE[newRow]?.[newCol] !== 1) {
        setPlayerPos({ row: newRow, col: newCol });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, gameOver]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Maze Escape</h3>
        <p className="text-slate-300 text-sm">Reach the exit in {timeLeft}s</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6 flex justify-center">
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(13, 32px)` }}>
          {MAZE.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isPlayer = playerPos.row === rowIndex && playerPos.col === colIndex;
              const isExit = cell === 2;
              const isWall = cell === 1;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-8 h-8 flex items-center justify-center text-xl ${
                    isWall ? 'bg-slate-700' : 'bg-slate-900'
                  } border border-slate-600`}
                >
                  {isPlayer ? '🧘' : isExit ? '🚪' : ''}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="text-center text-sm text-slate-400">
        Use Arrow Keys or WASD to navigate
      </div>
    </div>
  );
}
