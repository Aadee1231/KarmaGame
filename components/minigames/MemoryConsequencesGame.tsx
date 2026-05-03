'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

const symbols = ['📚', '🪪', '🍲', '🐍', '💎', '🧘'];

export default function MemoryMatchGame({ onComplete }: MiniGameProps) {
  const [phase, setPhase] = useState<'showing' | 'recall'>('showing');
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentShowIndex, setCurrentShowIndex] = useState(0);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...symbols].sort(() => Math.random() - 0.5);
    setSequence(shuffled.slice(0, 7));
  }, []);

  useEffect(() => {
    if (phase !== 'showing' || sequence.length === 0) return;

    const showInterval = setInterval(() => {
      setCurrentShowIndex(prev => {
        if (prev >= sequence.length - 1) {
          setTimeout(() => setPhase('recall'), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(showInterval);
  }, [phase, sequence]);

  const handleSymbolClick = (symbol: string) => {
    if (phase !== 'recall' || gameOver || completedRef.current) return;

    const newPlayerSequence = [...playerSequence, symbol];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence.length >= sequence.length) {
      setGameOver(true);
      completedRef.current = true;

      const isCorrect = newPlayerSequence.every((sym, idx) => sym === sequence[idx]);
      
      if (isCorrect) {
        onComplete({
          success: true,
          consequenceBonus: 2,
          message: "You remembered the chain. Karma often returns as relationship and memory."
        });
      } else {
        onComplete({
          success: false,
          consequenceBonus: -2,
          message: "The past did not disappear just because the moment ended."
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Memory Match</h3>
        <p className="text-slate-300 text-sm">
          {phase === 'showing' ? 'Watch the sequence carefully' : 'Repeat the sequence'}
        </p>
      </div>

      <div className="bg-black/40 rounded-xl p-6 space-y-4">
        {phase === 'showing' && (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <div className="text-8xl mb-4">
              {sequence[currentShowIndex]}
            </div>
            <div className="text-slate-400 text-sm">
              Symbol {currentShowIndex + 1} of {sequence.length}
            </div>
          </div>
        )}

        {phase === 'recall' && (
          <>
            <div className="bg-slate-800 rounded-xl p-4 min-h-[80px] flex items-center justify-center">
              <div className="text-4xl space-x-2">
                {playerSequence.map((sym, idx) => (
                  <span key={idx}>{sym}</span>
                ))}
                {playerSequence.length < sequence.length && (
                  <span className="text-slate-600">?</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {symbols.map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => handleSymbolClick(symbol)}
                  disabled={gameOver}
                  className="py-6 text-5xl bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 border-2 border-purple-500/30"
                >
                  {symbol}
                </button>
              ))}
            </div>

            <div className="text-center text-sm text-slate-400">
              Selected: {playerSequence.length} / {sequence.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
