'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

interface Bubble {
  id: number;
  text: string;
  type: 'ego' | 'compassion';
  x: number;
  y: number;
}

const egoBubbles = [
  "You are enlightened.",
  "You are better than everyone.",
  "You are so humble.",
  "Post this wisdom online.",
  "Everyone should admire you.",
  "You've transcended.",
  "You're the most spiritual.",
];

const compassionBubbles = [
  "Listen.",
  "Serve.",
  "Breathe.",
  "Let go.",
  "Return.",
  "Be present.",
  "Practice.",
];

export default function EgoTrapGame({ onComplete }: MiniGameProps) {
  const [timeLeft, setTimeLeft] = useState(90);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [egoClicks, setEgoClicks] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);
  const nextBubbleId = useRef(0);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const spawnInterval = setInterval(() => {
      setBubbles(prev => {
        if (prev.length < 6) {
          const isEgo = Math.random() > 0.4;
          const texts = isEgo ? egoBubbles : compassionBubbles;
          
          return [...prev, {
            id: nextBubbleId.current++,
            text: texts[Math.floor(Math.random() * texts.length)],
            type: isEgo ? 'ego' : 'compassion',
            x: Math.random() * 80 + 10,
            y: 100
          }];
        }
        return prev;
      });
    }, 1200);

    return () => clearInterval(spawnInterval);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const moveInterval = setInterval(() => {
      setBubbles(prev =>
        prev.map(bubble => ({ ...bubble, y: bubble.y - 1.5 })).filter(b => b.y > -10)
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameOver]);

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
    if (score >= 15 && egoClicks <= 5) {
      onComplete({
        success: true,
        consequenceBonus: 2,
        message: "You let praise pass through without building a self around it."
      });
    } else {
      onComplete({
        success: false,
        consequenceBonus: -2,
        message: "Even spirituality can become another form of ego."
      });
    }
  }, [gameOver, score, egoClicks, onComplete]);

  const handleBubbleClick = (bubble: Bubble) => {
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));
    
    if (bubble.type === 'compassion') {
      setScore(prev => prev + 1);
    } else {
      setScore(prev => prev - 2);
      setEgoClicks(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Ego Trap</h3>
        <p className="text-slate-300 text-sm">Click only compassion bubbles, avoid ego bubbles</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-slate-400">Time: </span>
            <span className="text-yellow-400 font-bold">{timeLeft.toFixed(1)}s</span>
          </div>
          <div>
            <span className="text-slate-400">Score: </span>
            <span className={`font-bold ${score >= 0 ? 'text-green-400' : 'text-red-400'}`}>{score}</span>
          </div>
          <div>
            <span className="text-slate-400">Ego Clicks: </span>
            <span className="text-red-400 font-bold">{egoClicks}</span>
          </div>
        </div>

        <div className="relative h-80 bg-gradient-to-br from-slate-900 to-purple-900/30 rounded-xl border-2 border-purple-500/30 overflow-hidden">
          {bubbles.map(bubble => (
            <button
              key={bubble.id}
              onClick={() => handleBubbleClick(bubble)}
              className={`absolute px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 transform hover:scale-110 ${
                bubble.type === 'ego'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
              }`}
              style={{
                left: `${bubble.x}%`,
                bottom: `${bubble.y}%`,
                transform: 'translate(-50%, 50%)'
              }}
            >
              {bubble.text}
            </button>
          ))}
        </div>

        <div className="text-center text-xs text-slate-400">
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
              <span>Compassion (+1)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
              <span>Ego (-2)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
