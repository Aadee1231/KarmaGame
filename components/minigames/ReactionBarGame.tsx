'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

export default function ReactionBarGame({ onComplete }: MiniGameProps) {
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (gameOver) return;
    
    const moveBar = setInterval(() => {
      setPosition(prev => {
        let next = prev + direction * 2;
        if (next >= 100) {
          setDirection(-1);
          next = 100;
        } else if (next <= 0) {
          setDirection(1);
          next = 0;
        }
        return next;
      });
    }, 20);

    return () => clearInterval(moveBar);
  }, [direction, gameOver]);

  const handleStop = () => {
    if (gameOver || completedRef.current) return;

    const newAttempts = attempts + 1;
    const inGreenZone = position >= 45 && position <= 55;
    const newSuccesses = successes + (inGreenZone ? 1 : 0);

    setAttempts(newAttempts);
    setSuccesses(newSuccesses);

    if (newAttempts >= 5) {
      completedRef.current = true;
      setGameOver(true);
      
      if (newSuccesses >= 3) {
        onComplete({
          success: true,
          consequenceBonus: 2,
          message: "Perfect timing. You know when to act."
        });
      } else {
        onComplete({
          success: false,
          consequenceBonus: -1,
          message: "Timing was off. Practice brings precision."
        });
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleStop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position, attempts, successes, gameOver]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Reaction Bar</h3>
        <p className="text-slate-300 text-sm">Stop in green zone 3/5 times</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6 space-y-6">
        <div className="relative w-full h-20 bg-slate-800 rounded-lg overflow-hidden border-2 border-purple-500/30">
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-red-600/30"></div>
            <div className="w-[10%] bg-green-600/50"></div>
            <div className="flex-1 bg-red-600/30"></div>
          </div>

          <div
            className="absolute top-0 bottom-0 w-2 bg-yellow-400 shadow-lg"
            style={{ left: `${position}%`, transition: 'none' }}
          ></div>
        </div>

        <div className="text-center">
          <p className="text-lg text-slate-300">
            Attempts: {attempts}/5 | Successes: {successes}
          </p>
        </div>

        <button
          onClick={handleStop}
          disabled={gameOver}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all"
        >
          STOP (Space/Enter)
        </button>
      </div>
    </div>
  );
}
