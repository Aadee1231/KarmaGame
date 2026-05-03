'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

interface Hazard {
  id: number;
  x: number;
  y: number;
}

export default function QuickDodgeGame({ onComplete }: MiniGameProps) {
  const [playerX, setPlayerX] = useState(50);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);
  const hazardIdRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (!completedRef.current) {
            completedRef.current = true;
            setGameOver(true);
            onComplete({
              success: true,
              consequenceBonus: 2,
              message: "You dodged the chaos. Awareness protects you."
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
    const spawnHazard = () => {
      setHazards(prev => [...prev, {
        id: hazardIdRef.current++,
        x: Math.random() * 90 + 5,
        y: 0
      }]);
    };

    const spawnInterval = setInterval(spawnHazard, 600);
    return () => clearInterval(spawnInterval);
  }, []);

  useEffect(() => {
    const moveHazards = setInterval(() => {
      setHazards(prev => {
        const updated = prev.map(h => ({ ...h, y: h.y + 3 })).filter(h => h.y < 100);
        return updated;
      });
    }, 50);

    return () => clearInterval(moveHazards);
  }, []);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const collision = hazards.some(h => 
      h.y > 85 && h.y < 95 && Math.abs(h.x - playerX) < 8
    );

    if (collision) {
      completedRef.current = true;
      setGameOver(true);
      onComplete({
        success: false,
        consequenceBonus: -2,
        message: "Hit by falling karma. Stay alert to what comes."
      });
    }
  }, [hazards, playerX, gameOver, onComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPlayerX(prev => Math.max(5, prev - 5));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPlayerX(prev => Math.min(95, prev + 5));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Quick Dodge</h3>
        <p className="text-slate-300 text-sm">Survive {timeLeft}s without getting hit</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6">
        <div className="relative w-full h-96 bg-gradient-to-b from-purple-900/30 to-slate-900 rounded-lg overflow-hidden border-2 border-purple-500/30">
          {hazards.map(h => (
            <div
              key={h.id}
              className="absolute w-8 h-8 text-2xl"
              style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              ⚡
            </div>
          ))}

          <div
            className="absolute bottom-4 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-2xl transition-all duration-100"
            style={{ left: `${playerX}%`, transform: 'translateX(-50%)' }}
          >
            🧘
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-slate-400">
          Use ←→ or A/D to dodge
        </div>
      </div>
    </div>
  );
}
