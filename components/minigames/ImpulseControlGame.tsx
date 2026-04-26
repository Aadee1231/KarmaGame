'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

const temptingTexts = [
  "Click for instant reward",
  "Take the shortcut",
  "Just one click",
  "Everyone else clicks",
  "You deserve this now"
];

export default function ImpulseControlGame({ onComplete }: MiniGameProps) {
  const [timeLeft, setTimeLeft] = useState(90);
  const [buttonText, setButtonText] = useState(temptingTexts[0]);
  const [buttonPosition, setButtonPosition] = useState({ x: 50, y: 50 });
  const [rewardMeter, setRewardMeter] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);

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

    const moveInterval = setInterval(() => {
      setButtonPosition({
        x: 30 + Math.random() * 40,
        y: 40 + Math.random() * 20
      });
      setButtonText(temptingTexts[Math.floor(Math.random() * temptingTexts.length)]);
      setRewardMeter(prev => Math.min(100, prev + 10));
    }, 3000);

    return () => clearInterval(moveInterval);
  }, [gameOver]);

  useEffect(() => {
    if (completedRef.current || !gameOver) return;

    completedRef.current = true;
    onComplete({
      success: true,
      consequenceBonus: 2,
      message: "You resisted the pull of immediate reward. Sometimes the action is not acting."
    });
  }, [gameOver, onComplete]);

  const handleClick = () => {
    if (completedRef.current) return;
    
    setGameOver(true);
    completedRef.current = true;
    onComplete({
      success: false,
      consequenceBonus: -2,
      message: "The shortcut was tempting. Attachment can make a small action feel urgent."
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Impulse Control</h3>
        <p className="text-slate-300 text-sm font-bold">Do not click until the timer ends</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-slate-400">Time Remaining: </span>
            <span className="text-yellow-400 font-bold text-lg">{timeLeft.toFixed(1)}s</span>
          </div>
        </div>

        <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border-2 border-purple-500/30 overflow-hidden">
          <button
            onClick={handleClick}
            className="absolute px-8 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-110 shadow-2xl animate-pulse"
            style={{
              left: `${buttonPosition.x}%`,
              top: `${buttonPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {buttonText}
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Fake Reward Meter (ignore this)</span>
            <span>{rewardMeter}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300"
              style={{ width: `${rewardMeter}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
