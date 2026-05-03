'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MiniGameProps } from '@/types/game';

export default function LockpickGame({ onComplete }: MiniGameProps) {
  const [angle, setAngle] = useState(0);
  const [direction, setDirection] = useState(1);
  const [speed, setSpeed] = useState(2);
  const [locksCompleted, setLocksCompleted] = useState(0);
  const [successZone, setSuccessZone] = useState({ start: 70, end: 110 });
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'success' | 'fail' | null>(null);
  const completedRef = useRef(false);
  const angleRef = useRef(0);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = () => {
      setAngle(prev => {
        let next = prev + direction * speed;
        if (next >= 180) {
          setDirection(-1);
          next = 180;
        } else if (next <= 0) {
          setDirection(1);
          next = 0;
        }
        angleRef.current = next;
        return next;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    if (!gameOver) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [direction, speed, gameOver]);

  const handleStop = useCallback(() => {
    if (gameOver || completedRef.current) return;

    const currentAngle = angleRef.current;
    const inSuccessZone = currentAngle >= successZone.start && currentAngle <= successZone.end;

    if (inSuccessZone) {
      setFeedback('success');
      const newLocksCompleted = locksCompleted + 1;
      setLocksCompleted(newLocksCompleted);

      setTimeout(() => {
        setFeedback(null);
        if (newLocksCompleted >= 3) {
          completedRef.current = true;
          setGameOver(true);
          onComplete({
            success: true,
            consequenceBonus: 2,
            message: "Lock picked with precision. Skill and timing unlock doors."
          });
        } else {
          setSpeed(s => s + 0.8);
          const newStart = 60 + Math.random() * 60;
          setSuccessZone({ start: newStart, end: newStart + 40 });
          setAngle(0);
          setDirection(1);
        }
      }, 500);
    } else {
      setFeedback('fail');
      setTimeout(() => {
        setFeedback(null);
        completedRef.current = true;
        setGameOver(true);
        onComplete({
          success: false,
          consequenceBonus: -1,
          message: "The lock resisted. Patience and precision are needed."
        });
      }, 500);
    }
  }, [gameOver, successZone, locksCompleted, onComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleStop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStop]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Lockpick Timing</h3>
        <p className="text-slate-300 text-sm">Pick 3 locks | Completed: {locksCompleted}/3</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6 space-y-6">
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#334155"
                strokeWidth="20"
              />
              
              <path
                d={`M 100 100 L ${100 + 80 * Math.cos((successZone.start - 90) * Math.PI / 180)} ${100 + 80 * Math.sin((successZone.start - 90) * Math.PI / 180)} A 80 80 0 0 1 ${100 + 80 * Math.cos((successZone.end - 90) * Math.PI / 180)} ${100 + 80 * Math.sin((successZone.end - 90) * Math.PI / 180)} Z`}
                fill="#22c55e"
                opacity="0.6"
              />

              <line
                x1="100"
                y1="100"
                x2={100 + 70 * Math.cos((angle - 90) * Math.PI / 180)}
                y2={100 + 70 * Math.sin((angle - 90) * Math.PI / 180)}
                stroke={feedback === 'success' ? '#22c55e' : feedback === 'fail' ? '#ef4444' : '#fbbf24'}
                strokeWidth="4"
                strokeLinecap="round"
              />

              <circle
                cx="100"
                cy="100"
                r="12"
                fill={feedback === 'success' ? '#22c55e' : feedback === 'fail' ? '#ef4444' : '#fbbf24'}
              />
            </svg>

            {feedback === 'success' && (
              <div className="absolute inset-0 flex items-center justify-center text-6xl animate-ping">
                ✓
              </div>
            )}
            {feedback === 'fail' && (
              <div className="absolute inset-0 flex items-center justify-center text-6xl animate-ping text-red-500">
                ✗
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleStop}
          disabled={gameOver}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all"
        >
          PICK LOCK (Space/Enter)
        </button>

        <div className="text-center text-sm text-slate-400">
          Stop the needle in the green zone
        </div>
      </div>
    </div>
  );
}
