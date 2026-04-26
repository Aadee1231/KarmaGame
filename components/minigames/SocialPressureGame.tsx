'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

interface Situation {
  text: string;
  correctAction: 'speak' | 'silent';
}

const situations: Situation[] = [
  { text: "Someone is being mocked", correctAction: 'speak' },
  { text: "Someone is sharing grief", correctAction: 'silent' },
  { text: "Friend is cheating someone", correctAction: 'speak' },
  { text: "Professor asks a question you don't know", correctAction: 'silent' },
  { text: "Group is excluding someone", correctAction: 'speak' },
  { text: "Angry person needs space", correctAction: 'silent' },
  { text: "Someone spreads a rumor", correctAction: 'speak' },
  { text: "Classmate makes honest mistake", correctAction: 'silent' },
];

const pressureComments = [
  "Don't get involved.",
  "Everyone else is quiet.",
  "You'll make it awkward.",
  "Just laugh it off.",
  "This is not your problem.",
  "Stay out of it.",
  "Mind your business.",
  "Don't be dramatic.",
];

export default function SocialPressureGame({ onComplete }: MiniGameProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [comments, setComments] = useState<Array<{ id: number; text: string; y: number }>>([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);
  const nextCommentId = useRef(0);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const timeInterval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    if (timeLeft <= 0) {
      handleAnswer('silent');
    }
  }, [timeLeft]);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const commentInterval = setInterval(() => {
      setComments(prev => {
        const newComment = {
          id: nextCommentId.current++,
          text: pressureComments[Math.floor(Math.random() * pressureComments.length)],
          y: -10
        };
        return [...prev.slice(-4), newComment];
      });
    }, 1500);

    return () => clearInterval(commentInterval);
  }, [currentRound, gameOver]);

  useEffect(() => {
    if (gameOver || completedRef.current) return;

    const moveInterval = setInterval(() => {
      setComments(prev =>
        prev.map(comment => ({ ...comment, y: comment.y + 2 })).filter(c => c.y < 110)
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameOver]);

  const handleAnswer = (action: 'speak' | 'silent') => {
    if (gameOver || completedRef.current) return;

    const isCorrect = situations[currentRound].correctAction === action;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    if (currentRound >= situations.length - 1) {
      setGameOver(true);
      completedRef.current = true;
      const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
      
      if (finalCorrect >= 5) {
        onComplete({
          success: true,
          consequenceBonus: 2,
          message: "You learned that courage is not always loud, and silence is not always cowardice."
        });
      } else {
        onComplete({
          success: false,
          consequenceBonus: -2,
          message: "Pressure blurred the difference between peace and avoidance."
        });
      }
    } else {
      setCurrentRound(prev => prev + 1);
      setComments([]);
    }
  };

  if (gameOver) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Social Pressure</h3>
        <p className="text-slate-300 text-sm">Choose when to speak and when to listen</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-slate-400">Situation: </span>
            <span className="text-purple-400 font-bold">{currentRound + 1} / {situations.length}</span>
          </div>
          <div>
            <span className="text-slate-400">Correct: </span>
            <span className="text-green-400 font-bold">{correctCount}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-purple-900/50 rounded-xl p-6 min-h-[80px] flex items-center justify-center border-2 border-purple-500/30">
          <p className="text-xl text-slate-100 text-center font-semibold">
            {situations[currentRound].text}
          </p>
        </div>

        <div className="relative h-32 bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-700">
          {comments.map(comment => (
            <div
              key={comment.id}
              className="absolute left-0 right-0 text-center text-sm text-red-300 italic opacity-70"
              style={{ top: `${comment.y}%` }}
            >
              "{comment.text}"
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswer('speak')}
            className="py-5 px-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Speak
          </button>
          <button
            onClick={() => handleAnswer('silent')}
            className="py-5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Stay Silent
          </button>
        </div>
      </div>
    </div>
  );
}
