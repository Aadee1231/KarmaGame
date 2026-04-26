'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

interface Hazard {
  id: number;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const hazardEmojis = ['🧼', '🧽', '☀️', '👟'];

export default function MicroLifeChaosGame({ onComplete }: MiniGameProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [isDead, setIsDead] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);
  const nextHazardId = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const spawnInterval = setInterval(() => {
      setHazards(prev => {
        if (prev.length < 5) {
          return [...prev, {
            id: nextHazardId.current++,
            emoji: hazardEmojis[Math.floor(Math.random() * hazardEmojis.length)],
            x: Math.random() * 100,
            y: Math.random() * 100,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4
          }];
        }
        return prev;
      });
    }, 1500);

    return () => clearInterval(spawnInterval);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || completedRef.current || isDead) return;

    const moveInterval = setInterval(() => {
      setPlayerPos(prev => {
        let newX = prev.x;
        let newY = prev.y;

        if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) {
          newY = Math.max(0, prev.y - 2);
        }
        if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
          newY = Math.min(100, prev.y + 2);
        }
        if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
          newX = Math.max(0, prev.x - 2);
        }
        if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
          newX = Math.min(100, prev.x + 2);
        }

        const slipFactor = 0.3;
        newX += (Math.random() - 0.5) * slipFactor;
        newY += (Math.random() - 0.5) * slipFactor;

        return {
          x: Math.max(0, Math.min(100, newX)),
          y: Math.max(0, Math.min(100, newY))
        };
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameOver, isDead]);

  useEffect(() => {
    if (gameOver || completedRef.current || isDead) return;

    const hazardInterval = setInterval(() => {
      setHazards(prev =>
        prev.map(h => {
          let newX = h.x + h.vx;
          let newY = h.y + h.vy;
          let newVx = h.vx;
          let newVy = h.vy;

          if (newX <= 0 || newX >= 100) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(100, newX));
          }
          if (newY <= 0 || newY >= 100) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(100, newY));
          }

          return { ...h, x: newX, y: newY, vx: newVx, vy: newVy };
        })
      );
    }, 50);

    return () => clearInterval(hazardInterval);
  }, [gameOver, isDead]);

  useEffect(() => {
    if (gameOver || completedRef.current || isDead) return;

    const collisionCheck = setInterval(() => {
      const collision = hazards.some(h => {
        const dx = h.x - playerPos.x;
        const dy = h.y - playerPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < 8;
      });

      if (collision) {
        setIsDead(true);
        setGameOver(true);
      }
    }, 50);

    return () => clearInterval(collisionCheck);
  }, [hazards, playerPos, gameOver, isDead]);

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

    completedRef.current = true;
    if (!isDead) {
      onComplete({
        success: true,
        consequenceBonus: 2,
        message: "Against all logic, you survived as a speck. The universe is confused."
      });
    } else {
      onComplete({
        success: false,
        consequenceBonus: -2,
        message: "You lived briefly, panicked sincerely, and became part of the cycle again."
      });
    }
  }, [gameOver, isDead, onComplete]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Micro Life Chaos</h3>
        <p className="text-slate-300 text-sm">Survive if you can. (WASD or arrows)</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-slate-400">Time: </span>
            <span className="text-yellow-400 font-bold">{timeLeft.toFixed(1)}s</span>
          </div>
          <div>
            <span className="text-slate-400">Status: </span>
            <span className={`font-bold ${isDead ? 'text-red-400' : 'text-green-400'}`}>
              {isDead ? 'Dead' : 'Alive'}
            </span>
          </div>
        </div>

        <div className="relative h-80 bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-xl border-2 border-green-500/30 overflow-hidden">
          <div
            className="absolute text-2xl transition-all duration-100"
            style={{
              left: `${playerPos.x}%`,
              top: `${playerPos.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            🦠
          </div>

          {hazards.map(hazard => (
            <div
              key={hazard.id}
              className="absolute text-3xl transition-all duration-100"
              style={{
                left: `${hazard.x}%`,
                top: `${hazard.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {hazard.emoji}
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-slate-400 italic">
          "Limited agency. Absurd circumstances. Still karma."
        </div>
      </div>
    </div>
  );
}
