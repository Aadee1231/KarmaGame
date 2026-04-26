'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

interface Round {
  threat: string;
  correctAction: 'warn' | 'retreat';
}

const rounds: Round[] = [
  { threat: "Curious hiker", correctAction: 'retreat' },
  { threat: "Predator lunging", correctAction: 'warn' },
  { threat: "Child with a stick", correctAction: 'retreat' },
  { threat: "Animal attacking first", correctAction: 'warn' },
  { threat: "Farmer watching from distance", correctAction: 'retreat' },
  { threat: "A stranger insults you in public", correctAction: 'warn' },
  { threat: "A wild animal is approaching", correctAction: 'warn' },
  { threat: "A person is following you", correctAction: 'retreat' },
];

export default function FightOrFleeGame({ onComplete }: MiniGameProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [threatPosition, setThreatPosition] = useState(100);
  const completedRef = useRef(false);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const moveInterval = setInterval(() => {
      setThreatPosition(prev => Math.max(20, prev - 2));
    }, 50);

    return () => clearInterval(moveInterval);
  }, [currentRound, gameOver]);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          handleAnswer('retreat');
          return 20;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentRound, gameOver]);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleAnswer('warn');
      } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleAnswer('retreat');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentRound, gameOver]);

  const handleAnswer = (action: 'warn' | 'retreat') => {
    if (gameOver || completedRef.current) return;

    const isCorrect = rounds[currentRound].correctAction === action;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    if (currentRound >= rounds.length - 1) {
      setGameOver(true);
      completedRef.current = true;
      const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
      
      if (finalCorrect >= 5) {
        onComplete({
          success: true,
          consequenceBonus: 2,
          message: "You responded to danger with discernment instead of pure fear."
        });
      } else {
        onComplete({
          success: false,
          consequenceBonus: -2,
          message: "Fear made every situation look the same."
        });
      }
    } else {
      setCurrentRound(prev => prev + 1);
      setTimeLeft(3);
      setThreatPosition(100);
    }
  };

  if (gameOver) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Fight or Flee</h3>
        <p className="text-slate-300 text-sm">Space = Warn/Strike | S/↓ = Retreat</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-slate-400">Round: </span>
            <span className="text-purple-400 font-bold">{currentRound + 1} / {rounds.length}</span>
          </div>
          <div>
            <span className="text-slate-400">Time: </span>
            <span className="text-yellow-400 font-bold">{timeLeft.toFixed(1)}s</span>
          </div>
          <div>
            <span className="text-slate-400">Correct: </span>
            <span className="text-green-400 font-bold">{correctCount}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-red-900/30 rounded-xl p-6 min-h-[100px] flex items-center justify-center border-2 border-red-500/30">
          <p className="text-2xl font-bold text-red-300 text-center">
            {rounds[currentRound].threat}
          </p>
        </div>

        <div className="relative h-24 bg-slate-800 rounded-xl overflow-hidden">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl">
            🧍
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 text-4xl transition-all duration-100"
            style={{ left: `${threatPosition}%` }}
          >
            ⚠️
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswer('warn')}
            className="py-4 px-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Warn/Strike
          </button>
          <button
            onClick={() => handleAnswer('retreat')}
            className="py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Retreat
          </button>
        </div>
      </div>
    </div>
  );
}
