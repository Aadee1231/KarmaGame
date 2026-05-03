'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

const COLORS = ['red', 'blue', 'green', 'yellow'];

export default function SimonSaysGame({ onComplete }: MiniGameProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [currentFlash, setCurrentFlash] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const newSequence = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    setPlayerSequence([]);
    setIsShowing(true);
    showSequence(newSequence);
  };

  const showSequence = async (seq: number[]) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentFlash(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentFlash(null);
    }
    setIsShowing(false);
  };

  const handleTileClick = (index: number) => {
    if (isShowing || gameOver || completedRef.current) return;

    const newPlayerSeq = [...playerSequence, index];
    setPlayerSequence(newPlayerSeq);

    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      completedRef.current = true;
      setGameOver(true);
      onComplete({
        success: false,
        consequenceBonus: -1,
        message: "The pattern broke. Attention to detail matters."
      });
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      const newRound = round + 1;
      setRound(newRound);

      if (newRound >= 7) {
        completedRef.current = true;
        setGameOver(true);
        onComplete({
          success: true,
          consequenceBonus: 2,
          message: "You followed the pattern perfectly. Mindfulness prevails."
        });
      } else {
        setTimeout(() => startNewRound(), 1000);
      }
    }
  };

  const getTileColor = (index: number) => {
    const colors = {
      0: 'bg-red-600 hover:bg-red-500',
      1: 'bg-blue-600 hover:bg-blue-500',
      2: 'bg-green-600 hover:bg-green-500',
      3: 'bg-yellow-600 hover:bg-yellow-500'
    };
    return colors[index as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Simon Says</h3>
        <p className="text-slate-300 text-sm">
          {isShowing ? 'Watch the pattern...' : `Repeat it! Round ${round + 1}/7`}
        </p>
      </div>

      <div className="bg-black/40 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {[0, 1, 2, 3].map(index => (
            <button
              key={index}
              onClick={() => handleTileClick(index)}
              disabled={isShowing || gameOver}
              className={`h-32 rounded-xl transition-all duration-200 ${getTileColor(index)} ${
                currentFlash === index ? 'scale-95 brightness-150' : ''
              } disabled:cursor-not-allowed border-2 border-black/30`}
            />
          ))}
        </div>

        <div className="mt-4 text-center text-sm text-slate-400">
          {isShowing ? 'Memorize the sequence' : 'Click the tiles in order'}
        </div>
      </div>
    </div>
  );
}
