'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

interface Obstacle {
  id: number;
  lane: number;
  position: number;
  speed: number;
}

export default function FroggerCrossingGame({ onComplete }: MiniGameProps) {
  const [playerLane, setPlayerLane] = useState(4);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);
  const obstacleIdRef = useRef(0);

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
              message: "You navigated the chaos with patience and timing."
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
    const spawnObstacle = () => {
      const lane = Math.floor(Math.random() * 5);
      const speed = 0.5 + Math.random() * 1.5;
      const direction = Math.random() > 0.5 ? 1 : -1;
      
      setObstacles(prev => [...prev, {
        id: obstacleIdRef.current++,
        lane,
        position: direction > 0 ? 0 : 100,
        speed: speed * direction
      }]);
    };

    const spawnInterval = setInterval(spawnObstacle, 800);
    return () => clearInterval(spawnInterval);
  }, []);

  useEffect(() => {
    const moveObstacles = setInterval(() => {
      setObstacles(prev => {
        const updated = prev.map(obs => ({
          ...obs,
          position: obs.position + obs.speed
        })).filter(obs => obs.position > -10 && obs.position < 110);

        return updated;
      });
    }, 50);

    return () => clearInterval(moveObstacles);
  }, []);

  useEffect(() => {
    if (gameOver || completedRef.current) return;
    
    const collision = obstacles.some(obs => 
      obs.lane === playerLane && obs.position > 45 && obs.position < 55
    );

    if (collision) {
      completedRef.current = true;
      setGameOver(true);
      onComplete({
        success: false,
        consequenceBonus: -2,
        message: "Impatience led to collision. Timing is everything."
      });
    }
  }, [obstacles, playerLane, gameOver, onComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      if (e.key === 'ArrowUp' || e.key === 'w') {
        setPlayerLane(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        setPlayerLane(prev => Math.min(4, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Frogger Crossing</h3>
        <p className="text-slate-300 text-sm">Survive {timeLeft}s without collision</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6">
        <div className="relative w-full h-80 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden border-2 border-purple-500/30">
          {[0, 1, 2, 3, 4].map(lane => (
            <div
              key={lane}
              className="absolute w-full h-16 border-b border-slate-700/50"
              style={{ top: `${lane * 64}px` }}
            >
              {obstacles
                .filter(obs => obs.lane === lane)
                .map(obs => (
                  <div
                    key={obs.id}
                    className="absolute top-2 w-12 h-12 bg-red-600 rounded flex items-center justify-center text-2xl"
                    style={{ left: `${obs.position}%`, transform: 'translateX(-50%)' }}
                  >
                    🚗
                  </div>
                ))}
            </div>
          ))}
          
          <div
            className="absolute w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-2xl transition-all duration-200"
            style={{ 
              left: '50%', 
              top: `${playerLane * 64 + 16}px`,
              transform: 'translateX(-50%)'
            }}
          >
            🐸
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-slate-400">
          Use ↑↓ or W/S to move between lanes
        </div>
      </div>
    </div>
  );
}
