'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

export default function LightBeamGame({ onComplete }: MiniGameProps) {
  const [mirrors, setMirrors] = useState([45, 135, 45]);
  const [selectedMirror, setSelectedMirror] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);

  const checkWin = (mirrorAngles: number[]) => {
    return mirrorAngles[0] === 45 && mirrorAngles[1] === 45 && mirrorAngles[2] === 135;
  };

  useEffect(() => {
    if (checkWin(mirrors) && !completedRef.current) {
      completedRef.current = true;
      setGameOver(true);
      onComplete({
        success: true,
        consequenceBonus: 2,
        message: "Light reaches its destination. Clarity comes from right alignment."
      });
    }
  }, [mirrors, onComplete]);

  const rotateMirror = (index: number) => {
    if (gameOver) return;
    const newMirrors = [...mirrors];
    newMirrors[index] = (newMirrors[index] + 45) % 180;
    setMirrors(newMirrors);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Light Beam Reflector</h3>
        <p className="text-slate-300 text-sm">Rotate mirrors so light reaches the target</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6">
        <div className="relative w-full h-80 bg-gradient-to-br from-indigo-900/30 to-slate-900 rounded-lg border-2 border-purple-500/30 p-4">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xl">
            💡
          </div>

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-xl">
            🎯
          </div>

          <div className="absolute left-1/4 top-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={() => rotateMirror(0)}
              disabled={gameOver}
              className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-3xl border-2 border-blue-400 hover:scale-110 transition-all disabled:cursor-not-allowed"
              style={{ transform: `rotate(${mirrors[0]}deg)` }}
            >
              🪞
            </button>
          </div>

          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={() => rotateMirror(1)}
              disabled={gameOver}
              className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-3xl border-2 border-blue-400 hover:scale-110 transition-all disabled:cursor-not-allowed"
              style={{ transform: `rotate(${mirrors[1]}deg)` }}
            >
              🪞
            </button>
          </div>

          <div className="absolute right-1/4 bottom-1/4 transform translate-x-1/2 translate-y-1/2">
            <button
              onClick={() => rotateMirror(2)}
              disabled={gameOver}
              className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-3xl border-2 border-blue-400 hover:scale-110 transition-all disabled:cursor-not-allowed"
              style={{ transform: `rotate(${mirrors[2]}deg)` }}
            >
              🪞
            </button>
          </div>

          {checkWin(mirrors) && (
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" style={{ position: 'absolute', top: 0, left: 0 }}>
                <line x1="10%" y1="50%" x2="25%" y2="25%" stroke="yellow" strokeWidth="3" opacity="0.8" />
                <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="yellow" strokeWidth="3" opacity="0.8" />
                <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="yellow" strokeWidth="3" opacity="0.8" />
                <line x1="75%" y1="75%" x2="90%" y2="50%" stroke="yellow" strokeWidth="3" opacity="0.8" />
              </svg>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-sm text-slate-400">
          Click mirrors to rotate them 45°
        </div>
      </div>
    </div>
  );
}
