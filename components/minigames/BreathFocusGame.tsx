'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

export default function BreathFocusGame({ onComplete }: MiniGameProps) {
  const [timeLeft, setTimeLeft] = useState(120);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [circleScale, setCircleScale] = useState(0.5);
  const [successfulBreaths, setSuccessfulBreaths] = useState(0);
  const [badPresses, setBadPresses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const breathCycle = setInterval(() => {
      setPhaseProgress(prev => {
        if (prev >= 4) {
          setBreathPhase(current => current === 'inhale' ? 'exhale' : 'inhale');
          return 0;
        }
        return prev + 0.05;
      });
    }, 50);

    return () => clearInterval(breathCycle);
  }, [gameOver]);

  useEffect(() => {
    if (breathPhase === 'inhale') {
      setCircleScale(0.5 + (phaseProgress / 4) * 0.5);
    } else {
      setCircleScale(1 - (phaseProgress / 4) * 0.5);
    }
  }, [phaseProgress, breathPhase]);

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

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        const isNearPeak = (breathPhase === 'inhale' && phaseProgress >= 3.5) ||
                          (breathPhase === 'exhale' && phaseProgress >= 3.5);
        
        if (isNearPeak) {
          setSuccessfulBreaths(prev => prev + 1);
        } else {
          setBadPresses(prev => prev + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [breathPhase, phaseProgress, gameOver]);

  useEffect(() => {
    if (completedRef.current || !gameOver) return;

    completedRef.current = true;
    if (successfulBreaths >= 6 && badPresses <= 5) {
      onComplete({
        success: true,
        consequenceBonus: 2,
        message: "You followed the rhythm of attention. Awareness became action."
      });
    } else {
      onComplete({
        success: false,
        consequenceBonus: -2,
        message: "The breath was there, but attention wandered."
      });
    }
  }, [gameOver, successfulBreaths, badPresses, onComplete]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Breath Focus</h3>
        <p className="text-slate-300 text-sm">Press Space at the peak of each breath</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-slate-400">Time: </span>
            <span className="text-yellow-400 font-bold">{timeLeft.toFixed(1)}s</span>
          </div>
          <div>
            <span className="text-slate-400">Successful: </span>
            <span className="text-green-400 font-bold">{successfulBreaths} / 6</span>
          </div>
          <div>
            <span className="text-slate-400">Mistakes: </span>
            <span className="text-red-400 font-bold">{badPresses}</span>
          </div>
        </div>

        <div className="relative h-64 flex items-center justify-center">
          <div
            className="rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 transition-all duration-100 shadow-2xl"
            style={{
              width: `${circleScale * 200}px`,
              height: `${circleScale * 200}px`,
            }}
          />
        </div>

        <div className="text-center">
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
            {breathPhase === 'inhale' ? 'Inhale' : 'Exhale'}
          </p>
        </div>
      </div>
    </div>
  );
}
