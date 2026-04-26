'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

export default function KarmaBalanceGame({ onComplete }: MiniGameProps) {
  const [timeLeft, setTimeLeft] = useState(120);
  const [centeredTime, setCenteredTime] = useState(0);
  const [markerPosition, setMarkerPosition] = useState(50);
  const [drift, setDrift] = useState(0.3);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        setMarkerPosition(prev => Math.max(0, prev - 3));
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        setMarkerPosition(prev => Math.min(100, prev + 3));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const driftInterval = setInterval(() => {
      setMarkerPosition(prev => {
        const newPos = prev + drift;
        return Math.max(0, Math.min(100, newPos));
      });
      setDrift(prev => prev + (Math.random() - 0.5) * 0.4);
    }, 50);

    return () => clearInterval(driftInterval);
  }, [drift, gameOver]);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const checkInterval = setInterval(() => {
      if (markerPosition >= 40 && markerPosition <= 60) {
        setCenteredTime(prev => prev + 0.1);
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, [markerPosition, gameOver]);

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
    if (completedRef.current || !gameOver) return;

    if (centeredTime >= 60) {
      completedRef.current = true;
      onComplete({
        success: true,
        consequenceBonus: 2,
        message: "You maintained balance for a full minute. Karma flows through equilibrium."
      });
    } else {
      completedRef.current = true;
      onComplete({
        success: false,
        consequenceBonus: -2,
        message: "The mind kept drifting. Karma is shaped by how we respond when pulled off-center."
      });
    }
  }, [gameOver, centeredTime, onComplete]);

  useEffect(() => {
    if (completedRef.current) return;
    
    if (centeredTime >= 60) {
      setGameOver(true);
    }
  }, [centeredTime]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Karma Balance</h3>
        <p className="text-slate-300 text-sm">Use A/D or arrow keys to stay centered</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-slate-400">Time: </span>
            <span className="text-yellow-400 font-bold">{timeLeft.toFixed(1)}s</span>
          </div>
          <div>
            <span className="text-slate-400">Balanced: </span>
            <span className="text-green-400 font-bold">{centeredTime.toFixed(1)}s / 60s</span>
          </div>
        </div>

        <div className="relative h-12 bg-slate-800 rounded-lg overflow-hidden">
          <div className="absolute inset-y-0 left-[40%] right-[40%] bg-green-500/20 border-x-2 border-green-500/50" />
          
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg transition-all duration-75"
            style={{ left: `calc(${markerPosition}% - 6px)` }}
          />
        </div>

        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${(centeredTime / 60) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
