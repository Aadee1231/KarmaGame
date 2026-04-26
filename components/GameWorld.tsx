'use client';

import { useEffect, useRef, useState } from 'react';
import { EventObject, Life } from '@/types/game';

interface GameWorldProps {
  life: Life;
  events: EventObject[];
  onEventTrigger: (eventId: string) => void;
  completedEvents: Set<string>;
}

const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 600;
const PLAYER_SIZE = 32;
const EVENT_SIZE = 40;
const MOVE_SPEED = 3;
const ACCELERATION = 0.3;
const FRICTION = 0.85;

const LIFE_THEMES: Record<string, { bg: string; ground: string; decoration: string[] }> = {
  microorganism: {
    bg: 'from-teal-900 via-cyan-900 to-blue-900',
    ground: 'bg-cyan-800/30',
    decoration: ['🦠', '🧬', '💧', '⚛️'],
  },
  snake: {
    bg: 'from-green-900 via-emerald-900 to-teal-900',
    ground: 'bg-green-800/30',
    decoration: ['🌿', '🪨', '🍃', '🌾'],
  },
  dog: {
    bg: 'from-amber-800 via-yellow-800 to-orange-800',
    ground: 'bg-amber-700/30',
    decoration: ['🏡', '🦴', '🌳', '⚽'],
  },
  poor_student: {
    bg: 'from-slate-800 via-gray-800 to-zinc-800',
    ground: 'bg-slate-700/30',
    decoration: ['📚', '🏫', '🚌', '☕'],
  },
  rich_human: {
    bg: 'from-purple-900 via-indigo-900 to-violet-900',
    ground: 'bg-purple-800/30',
    decoration: ['💎', '🏛️', '🏰', '🎭'],
  },
  monk: {
    bg: 'from-orange-900 via-amber-900 to-yellow-900',
    ground: 'bg-orange-800/30',
    decoration: ['🕉️', '🏯', '🌸', '🔔'],
  },
};

export default function GameWorld({ life, events, onEventTrigger, completedEvents }: GameWorldProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [playerPos, setPlayerPos] = useState({ x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const animationRef = useRef<number | undefined>(undefined);

  const theme = LIFE_THEMES[life.id] || LIFE_THEMES.poor_student;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const newSet = new Set(prev);
        newSet.add(e.key.toLowerCase());
        return newSet;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(e.key.toLowerCase());
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const gameLoop = () => {
      setVelocity((vel) => {
        let newVelX = vel.x;
        let newVelY = vel.y;

        if (keys.has('arrowup') || keys.has('w')) newVelY -= ACCELERATION;
        if (keys.has('arrowdown') || keys.has('s')) newVelY += ACCELERATION;
        if (keys.has('arrowleft') || keys.has('a')) newVelX -= ACCELERATION;
        if (keys.has('arrowright') || keys.has('d')) newVelX += ACCELERATION;

        newVelX *= FRICTION;
        newVelY *= FRICTION;

        const maxSpeed = MOVE_SPEED;
        const speed = Math.sqrt(newVelX ** 2 + newVelY ** 2);
        if (speed > maxSpeed) {
          newVelX = (newVelX / speed) * maxSpeed;
          newVelY = (newVelY / speed) * maxSpeed;
        }

        return { x: newVelX, y: newVelY };
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [keys]);

  useEffect(() => {
    setPlayerPos((pos) => {
      const newX = Math.max(PLAYER_SIZE / 2, Math.min(WORLD_WIDTH - PLAYER_SIZE / 2, pos.x + velocity.x));
      const newY = Math.max(PLAYER_SIZE / 2, Math.min(WORLD_HEIGHT - PLAYER_SIZE / 2, pos.y + velocity.y));
      return { x: newX, y: newY };
    });
  }, [velocity]);

  useEffect(() => {
    events.forEach((event) => {
      if (event.locked || completedEvents.has(event.id)) return;

      const dx = playerPos.x - event.x;
      const dy = playerPos.y - event.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 50) {
        onEventTrigger(event.id);
      }
    });
  }, [playerPos, events, completedEvents, onEventTrigger]);

  return (
    <div className="relative flex items-center justify-center p-4">
      <div
        ref={canvasRef}
        className={`relative rounded-2xl overflow-hidden shadow-2xl border-4 border-purple-500/30 bg-gradient-to-br ${theme.bg}`}
        style={{ width: WORLD_WIDTH, height: WORLD_HEIGHT }}
      >
        <div className={`absolute inset-0 ${theme.ground} opacity-40`} />

        {events.map((event) => {
          const isCompleted = completedEvents.has(event.id);
          const isLocked = event.locked;

          return (
            <div
              key={event.id}
              className="absolute flex flex-col items-center"
              style={{
                left: event.x - EVENT_SIZE / 2,
                top: event.y - EVENT_SIZE / 2,
              }}
            >
              <div
                className={`w-${EVENT_SIZE} h-${EVENT_SIZE} rounded-full flex items-center justify-center text-3xl transition-all duration-300 ${
                  isCompleted
                    ? 'opacity-30 grayscale'
                    : isLocked
                    ? 'opacity-40 blur-sm'
                    : 'animate-pulse shadow-lg shadow-yellow-500/50'
                }`}
                style={{
                  width: EVENT_SIZE,
                  height: EVENT_SIZE,
                  background: isCompleted
                    ? 'rgba(100, 100, 100, 0.3)'
                    : isLocked
                    ? 'rgba(150, 150, 150, 0.2)'
                    : 'radial-gradient(circle, rgba(255, 215, 0, 0.8), rgba(255, 165, 0, 0.6))',
                }}
              >
                {isLocked ? '🔒' : isCompleted ? '✓' : '✨'}
              </div>
            </div>
          );
        })}

        <div
          className="absolute rounded-full bg-white shadow-lg border-4 border-purple-400"
          style={{
            left: playerPos.x - PLAYER_SIZE / 2,
            top: playerPos.y - PLAYER_SIZE / 2,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
          }}
        />

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 px-4 py-2 rounded-lg text-white text-sm">
          Use Arrow Keys or WASD to move
        </div>
      </div>
    </div>
  );
}
