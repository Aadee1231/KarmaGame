'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

export default function TilePatternGame({ onComplete }: MiniGameProps) {
  const [pattern, setPattern] = useState<number[]>([]);
  const [playerPattern, setPlayerPattern] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState(true);
  const [currentFlash, setCurrentFlash] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const newPattern: number[] = [];
    while (newPattern.length < 6) {
      const tile = Math.floor(Math.random() * 9);
      if (!newPattern.includes(tile)) {
        newPattern.push(tile);
      }
    }
    setPattern(newPattern);
    showPattern(newPattern);
  }, []);

  const showPattern = async (pat: number[]) => {
    setIsShowing(true);
    for (let i = 0; i < pat.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentFlash(pat[i]);
      await new Promise(resolve => setTimeout(resolve, 700));
      setCurrentFlash(null);
    }
    setIsShowing(false);
  };

  const handleTileClick = (index: number) => {
    if (isShowing || gameOver || completedRef.current) return;

    const newPlayerPattern = [...playerPattern, index];
    setPlayerPattern(newPlayerPattern);

    if (newPlayerPattern[newPlayerPattern.length - 1] !== pattern[newPlayerPattern.length - 1]) {
      completedRef.current = true;
      setGameOver(true);
      onComplete({
        success: false,
        consequenceBonus: -2,
        message: "Wrong path. Memory guides us through life's patterns."
      });
      return;
    }

    if (newPlayerPattern.length === pattern.length) {
      completedRef.current = true;
      setGameOver(true);
      onComplete({
        success: true,
        consequenceBonus: 2,
        message: "You walked the right path. Memory serves wisdom."
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Tile Pattern</h3>
        <p className="text-slate-300 text-sm">
          {isShowing ? 'Watch the pattern...' : `Step on tiles in order (${playerPattern.length}/${pattern.length})`}
        </p>
      </div>

      <div className="bg-black/40 rounded-xl p-6">
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          {Array.from({ length: 9 }).map((_, index) => {
            const isInPattern = pattern.includes(index);
            const isClicked = playerPattern.includes(index);
            const isFlashing = currentFlash === index;

            return (
              <button
                key={index}
                onClick={() => handleTileClick(index)}
                disabled={isShowing || gameOver}
                className={`h-24 rounded-xl transition-all duration-300 border-2 ${
                  isFlashing
                    ? 'bg-yellow-400 border-yellow-300 scale-95'
                    : isClicked
                    ? 'bg-green-600 border-green-500'
                    : 'bg-slate-700 border-slate-600'
                } disabled:cursor-not-allowed flex items-center justify-center text-3xl`}
              >
                {isClicked ? '✓' : ''}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-center text-sm text-slate-400">
          {isShowing ? 'Memorize which tiles flash' : 'Click the tiles in the order they flashed'}
        </div>
      </div>
    </div>
  );
}
