'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

interface Coin {
  id: number;
  x: number;
  y: number;
}

interface Hazard {
  id: number;
  x: number;
  y: number;
}

export default function CoinCollectionGame({ onComplete }: MiniGameProps) {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const [coins, setCoins] = useState<Coin[]>([]);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [collected, setCollected] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const completedRef = useRef(false);
  const coinIdRef = useRef(0);
  const hazardIdRef = useRef(0);

  useEffect(() => {
    for (let i = 0; i < 50; i++) {
      setCoins(prev => [...prev, {
        id: coinIdRef.current++,
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5
      }]);
    }
    
    for (let i = 0; i < 8; i++) {
      let x, y;
      do {
        x = Math.random() * 90 + 5;
        y = Math.random() * 90 + 5;
      } while (Math.abs(x - 50) < 15 && Math.abs(y - 50) < 15);
      
      setHazards(prev => [...prev, {
        id: hazardIdRef.current++,
        x,
        y
      }]);
    }
    
    setTimeout(() => setGameStarted(true), 100);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (!completedRef.current) {
            completedRef.current = true;
            setGameOver(true);
            
            if (collected >= 40) {
              onComplete({
                success: true,
                consequenceBonus: 2,
                message: "You gathered what you needed. Resourcefulness is wisdom."
              });
            } else {
              onComplete({
                success: false,
                consequenceBonus: -1,
                message: "Not enough collected. Sometimes we must move faster."
              });
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [collected, onComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      let dx = 0, dy = 0;
      if (e.key === 'ArrowUp' || e.key === 'w') dy = -3;
      else if (e.key === 'ArrowDown' || e.key === 's') dy = 3;
      else if (e.key === 'ArrowLeft' || e.key === 'a') dx = -3;
      else if (e.key === 'ArrowRight' || e.key === 'd') dx = 3;
      else return;

      setPlayerPos(prev => ({
        x: Math.max(5, Math.min(95, prev.x + dx)),
        y: Math.max(5, Math.min(95, prev.y + dy))
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    setCoins(prev => {
      const remaining = prev.filter(coin => {
        const dist = Math.sqrt(
          Math.pow(coin.x - playerPos.x, 2) + Math.pow(coin.y - playerPos.y, 2)
        );
        if (dist < 8) {
          setCollected(c => c + 1);
          return false;
        }
        return true;
      });
      return remaining;
    });

    if (gameStarted) {
      hazards.forEach(hazard => {
        const dist = Math.sqrt(
          Math.pow(hazard.x - playerPos.x, 2) + Math.pow(hazard.y - playerPos.y, 2)
        );
        if (dist < 8 && !completedRef.current) {
          completedRef.current = true;
          setGameOver(true);
          onComplete({
            success: false,
            consequenceBonus: -2,
            message: "You hit a hazard. Greed without caution brings harm."
          });
        }
      });
    }
  }, [playerPos, hazards, onComplete, gameStarted]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Coin Collection</h3>
        <p className="text-slate-300 text-sm">Collect 40+ coins in {timeLeft}s | Collected: {collected}</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6">
        <div className="relative w-full h-96 bg-gradient-to-br from-amber-900/20 to-slate-900 rounded-lg overflow-hidden border-2 border-purple-500/30">
          {coins.map(coin => (
            <div
              key={coin.id}
              className="absolute w-6 h-6 text-2xl"
              style={{ left: `${coin.x}%`, top: `${coin.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              💰
            </div>
          ))}

          {hazards.map(hazard => (
            <div
              key={hazard.id}
              className="absolute w-6 h-6 text-2xl"
              style={{ left: `${hazard.x}%`, top: `${hazard.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              💣
            </div>
          ))}

          <div
            className="absolute w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xl transition-all duration-100"
            style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            🧘
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-slate-400">
          Use Arrow Keys or WASD to move
        </div>
      </div>
    </div>
  );
}
