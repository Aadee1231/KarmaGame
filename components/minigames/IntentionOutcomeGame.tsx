'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

interface Card {
  text: string;
  correctAnswer: 'intention' | 'outcome';
}

const cards: Card[] = [
  { text: "You helped someone because you wanted praise.", correctAnswer: 'intention' },
  { text: "You donated money and accidentally embarrassed the person.", correctAnswer: 'outcome' },
  { text: "You stayed silent because you feared conflict.", correctAnswer: 'intention' },
  { text: "You told the truth and hurt someone's feelings.", correctAnswer: 'outcome' },
  { text: "You apologized only so people would stop blaming you.", correctAnswer: 'intention' },
];

export default function IntentionOutcomeGame({ onComplete }: MiniGameProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          handleAnswer('intention');
          return 8;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameOver, currentCardIndex]);

  const handleAnswer = (answer: 'intention' | 'outcome') => {
    if (gameOver || completedRef.current) return;

    const isCorrect = cards[currentCardIndex].correctAnswer === answer;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    if (currentCardIndex >= cards.length - 1) {
      setGameOver(true);
      completedRef.current = true;
      const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
      
      if (finalCorrect >= 3) {
        onComplete({
          success: true,
          consequenceBonus: 2,
          message: "You noticed the difference between what someone meant and what actually happened."
        });
      } else {
        onComplete({
          success: false,
          consequenceBonus: -2,
          message: "Karma is harder than simple good/bad scoring. Intention and consequence can split apart."
        });
      }
    } else {
      setCurrentCardIndex(prev => prev + 1);
      setTimeLeft(8);
    }
  };

  if (gameOver) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Intention vs Outcome</h3>
        <p className="text-slate-300 text-sm">Classify each action</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-slate-400">Card: </span>
            <span className="text-purple-400 font-bold">{currentCardIndex + 1} / {cards.length}</span>
          </div>
          <div>
            <span className="text-slate-400">Time: </span>
            <span className="text-yellow-400 font-bold">{timeLeft.toFixed(1)}s</span>
          </div>
          <div>
            <span className="text-slate-400">Correct: </span>
            <span className="text-green-400 font-bold">{correctCount}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-purple-900/50 rounded-xl p-8 min-h-[120px] flex items-center justify-center border-2 border-purple-500/30">
          <p className="text-xl text-slate-100 text-center leading-relaxed">
            {cards[currentCardIndex].text}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswer('intention')}
            className="py-6 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Mostly Intention
          </button>
          <button
            onClick={() => handleAnswer('outcome')}
            className="py-6 px-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Mostly Outcome
          </button>
        </div>
      </div>
    </div>
  );
}
