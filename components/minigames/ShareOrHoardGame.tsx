'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

interface Food {
  id: number;
  x: number;
  y: number;
}

export default function ShareOrHoardGame({ onComplete }: MiniGameProps) {
  const [timeLeft, setTimeLeft] = useState(120);
  const [foods, setFoods] = useState<Food[]>([]);
  const [collectedFood, setCollectedFood] = useState(0);
  const [sharedCount, setSharedCount] = useState(0);
  const [showSharePrompt, setShowSharePrompt] = useState(false);
  const [otherBeingTrust, setOtherBeingTrust] = useState(50);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);
  const nextFoodId = useRef(0);
  const lastShareTime = useRef(0);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const spawnInterval = setInterval(() => {
      setFoods(prev => {
        if (prev.length < 8) {
          return [...prev, {
            id: nextFoodId.current++,
            x: Math.random() * 80 + 10,
            y: Math.random() * 70 + 10
          }];
        }
        return prev;
      });
    }, 1500);

    return () => clearInterval(spawnInterval);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          setGameOver(true);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const promptInterval = setInterval(() => {
      const now = Date.now();
      if (now - lastShareTime.current > 5000 && collectedFood > 0) {
        setShowSharePrompt(true);
      }
    }, 5000);

    return () => clearInterval(promptInterval);
  }, [gameOver, collectedFood]);

  useEffect(() => {
    if (completedRef.current || !gameOver) return;

    completedRef.current = true;
    if (sharedCount >= 4 && collectedFood >= 10) {
      onComplete({
        success: true,
        consequenceBonus: 2,
        message: "You survived without turning scarcity into cruelty."
      });
    } else {
      onComplete({
        success: false,
        consequenceBonus: -2,
        message: "Fear of not having enough narrowed your compassion."
      });
    }
  }, [gameOver, sharedCount, collectedFood, onComplete]);

  const handleFoodClick = (foodId: number) => {
    setFoods(prev => prev.filter(f => f.id !== foodId));
    setCollectedFood(prev => prev + 1);
  };

  const handleShare = () => {
    setShowSharePrompt(false);
    setSharedCount(prev => prev + 1);
    setOtherBeingTrust(prev => Math.min(100, prev + 15));
    lastShareTime.current = Date.now();
  };

  const handleKeepCollecting = () => {
    setShowSharePrompt(false);
    setOtherBeingTrust(prev => Math.max(0, prev - 10));
    lastShareTime.current = Date.now();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Share or Hoard</h3>
        <p className="text-slate-300 text-sm">Collect food, but remember others need to survive too</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-slate-400">Time: </span>
            <span className="text-yellow-400 font-bold">{timeLeft.toFixed(1)}s</span>
          </div>
          <div>
            <span className="text-slate-400">Your Food: </span>
            <span className="text-green-400 font-bold">{collectedFood}</span>
          </div>
          <div>
            <span className="text-slate-400">Shared: </span>
            <span className="text-blue-400 font-bold">{sharedCount}</span>
          </div>
        </div>

        <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border-2 border-purple-500/30 overflow-hidden">
          {foods.map(food => (
            <button
              key={food.id}
              onClick={() => handleFoodClick(food.id)}
              className="absolute text-2xl hover:scale-125 transition-transform cursor-pointer"
              style={{
                left: `${food.x}%`,
                top: `${food.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              🍎
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Other Being Trust</span>
            <span>{otherBeingTrust}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
              style={{ width: `${otherBeingTrust}%` }}
            />
          </div>
        </div>

        {showSharePrompt && (
          <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-xl p-4 border-2 border-yellow-500/30">
            <p className="text-yellow-200 mb-3 text-center font-semibold">Leave some for the other being?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleShare}
                className="py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-lg transition-all duration-300"
              >
                Share
              </button>
              <button
                onClick={handleKeepCollecting}
                className="py-3 px-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-lg transition-all duration-300"
              >
                Keep Collecting
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
