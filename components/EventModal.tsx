'use client';

import { useState, useEffect, useRef } from 'react';
import { Scenario, Choice, KarmaBreakdown } from '@/types/game';
import { calculateKarmaChange } from '@/lib/karma';

interface EventModalProps {
  scenario: Scenario;
  onComplete: (choice: Choice, karmaBreakdown: KarmaBreakdown) => void;
  onClose: () => void;
}

type ModalStep = 'intro' | 'minigame' | 'choice' | 'reflection';

export default function EventModal({ scenario, onComplete, onClose }: EventModalProps) {
  const [step, setStep] = useState<ModalStep>('intro');
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [miniGameBonus, setMiniGameBonus] = useState(0);
  const [karmaBreakdown, setKarmaBreakdown] = useState<KarmaBreakdown | null>(null);

  const handleMiniGameComplete = (bonus: number) => {
    setMiniGameBonus(bonus);
    setStep('choice');
  };

  const handleChoiceSelect = (choice: Choice) => {
    const breakdown = calculateKarmaChange(
      choice.intentionScore,
      choice.actionScore,
      choice.consequenceScore,
      choice.attachmentScore,
      miniGameBonus
    );
    setKarmaBreakdown(breakdown);
    setSelectedChoice(choice);
    setStep('reflection');
  };

  const handleComplete = () => {
    if (selectedChoice && karmaBreakdown) {
      onComplete(selectedChoice, karmaBreakdown);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500/30 shadow-2xl">
        <div className="p-8">
          {step === 'intro' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-purple-200">
                {scenario.title}
              </h2>
              <p className="text-lg text-slate-200 leading-relaxed">
                {scenario.description}
              </p>
              <button
                onClick={() => setStep('minigame')}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Continue
              </button>
            </div>
          )}

          {step === 'minigame' && (
            <MiniGame
              type={scenario.miniGameType}
              onComplete={handleMiniGameComplete}
            />
          )}

          {step === 'choice' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-purple-200">
                What will you do?
              </h3>
              <div className="space-y-4">
                {scenario.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoiceSelect(choice)}
                    className="w-full p-6 bg-gradient-to-r from-slate-800/70 to-purple-800/70 hover:from-slate-700/90 hover:to-purple-700/90 border-2 border-purple-500/30 hover:border-purple-400/60 rounded-xl text-left transition-all duration-300 transform hover:scale-102 hover:shadow-xl group"
                  >
                    <p className="text-lg font-semibold text-slate-100 group-hover:text-white mb-2">
                      {choice.text}
                    </p>
                    <p className="text-sm text-slate-400 italic">
                      {choice.intention}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'reflection' && selectedChoice && karmaBreakdown && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-purple-200">
                Consequence & Reflection
              </h3>
              
              <div className="space-y-4">
                <div className="bg-black/30 rounded-xl p-6 border border-slate-600/30">
                  <p className="text-sm font-semibold text-slate-400 mb-2">Your Action:</p>
                  <p className="text-slate-200">{selectedChoice.action}</p>
                </div>

                <div className="bg-black/30 rounded-xl p-6 border border-slate-600/30">
                  <p className="text-sm font-semibold text-slate-400 mb-2">Consequence:</p>
                  <p className="text-slate-200">{selectedChoice.consequence}</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-900/30 to-purple-900/30 rounded-xl p-6 border-2 border-yellow-500/30">
                  <p className="text-sm font-semibold text-yellow-300 mb-2">Karmic Reflection:</p>
                  <p className="text-yellow-100 italic">{selectedChoice.reflection}</p>
                </div>

                <div className="bg-black/40 rounded-xl p-6 border border-purple-500/30 space-y-3">
                  <p className="text-sm font-bold text-purple-300 mb-3">Karma Breakdown:</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-400">Intention (35%):</span>
                      <span className={`ml-2 font-bold ${karmaBreakdown.intentionScore >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {karmaBreakdown.intentionScore >= 0 ? '+' : ''}{karmaBreakdown.intentionScore}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Action (25%):</span>
                      <span className={`ml-2 font-bold ${karmaBreakdown.actionScore >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {karmaBreakdown.actionScore >= 0 ? '+' : ''}{karmaBreakdown.actionScore}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Consequence (25%):</span>
                      <span className={`ml-2 font-bold ${karmaBreakdown.consequenceScore >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {karmaBreakdown.consequenceScore >= 0 ? '+' : ''}{karmaBreakdown.consequenceScore}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Attachment (15%):</span>
                      <span className={`ml-2 font-bold ${karmaBreakdown.attachmentScore >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {karmaBreakdown.attachmentScore >= 0 ? '+' : ''}{karmaBreakdown.attachmentScore}
                      </span>
                    </div>
                    {miniGameBonus !== 0 && (
                      <div className="col-span-2">
                        <span className="text-slate-400">Mini-game Bonus:</span>
                        <span className={`ml-2 font-bold ${miniGameBonus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {miniGameBonus >= 0 ? '+' : ''}{miniGameBonus}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t border-slate-600/30 mt-3">
                    <span className="text-slate-300">Total Karma Change:</span>
                    <span className={`ml-2 text-2xl font-bold ${karmaBreakdown.total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {karmaBreakdown.total >= 0 ? '+' : ''}{karmaBreakdown.total}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Return to World
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniGame({ type, onComplete }: { type: string; onComplete: (bonus: number) => void }) {
  const [gameState, setGameState] = useState<'playing' | 'success' | 'fail'>('playing');

  if (type === 'reflection') {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-purple-200">Moment of Reflection</h3>
        <div className="bg-black/30 rounded-xl p-8 border border-purple-500/20 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-purple-600 animate-pulse mb-6" />
          <p className="text-purple-100 mb-6">
            Take a moment to consider this situation deeply.
          </p>
          <p className="text-slate-400 text-sm">
            What would you do?
          </p>
        </div>
        <button
          onClick={() => onComplete(0)}
          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300"
        >
          I'm Ready to Choose
        </button>
      </div>
    );
  }

  if (type === 'timing') {
    return <TimingGame onComplete={onComplete} />;
  }

  if (type === 'memory') {
    return <MemoryGame onComplete={onComplete} />;
  }

  if (type === 'balance') {
    return <BalanceGame onComplete={onComplete} />;
  }

  if (type === 'collect') {
    return <CollectGame onComplete={onComplete} />;
  }

  return null;
}

function TimingGame({ onComplete }: { onComplete: (bonus: number) => void }) {
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [gameActive, setGameActive] = useState(true);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!gameActive) return;

    const animate = () => {
      setPosition((prev) => {
        const next = prev + direction * 2;
        if (next >= 100 || next <= 0) {
          setDirection((d) => -d);
        }
        return Math.max(0, Math.min(100, next));
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [direction, gameActive]);

  const handleClick = () => {
    setGameActive(false);
    const inTarget = position >= 40 && position <= 60;
    const bonus = inTarget ? 2 : -2;
    setTimeout(() => onComplete(bonus), 500);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-purple-200">Timing Challenge</h3>
      <div className="bg-black/30 rounded-xl p-8 border border-purple-500/20">
        <p className="text-purple-100 mb-6 text-center">
          Press when the marker is in the center zone!
        </p>
        <div className="relative h-12 bg-slate-800 rounded-lg mb-6 overflow-hidden">
          <div className="absolute inset-y-0 left-[40%] right-[40%] bg-green-500/30 border-x-2 border-green-500" />
          <div
            className="absolute inset-y-0 w-2 bg-yellow-400 transition-all duration-75"
            style={{ left: `${position}%` }}
          />
        </div>
        <button
          onClick={handleClick}
          disabled={!gameActive}
          className="w-full py-4 px-6 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-300"
        >
          {gameActive ? 'Press Now!' : 'Processing...'}
        </button>
      </div>
    </div>
  );
}

function MemoryGame({ onComplete }: { onComplete: (bonus: number) => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showing, setShowing] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const seq = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));
    setSequence(seq);
    setTimeout(() => setShowing(false), 3000);
  }, []);

  const handleClick = (index: number) => {
    if (showing || gameOver) return;
    
    const newUserSeq = [...userSequence, index];
    setUserSequence(newUserSeq);

    if (newUserSeq[newUserSeq.length - 1] !== sequence[newUserSeq.length - 1]) {
      setGameOver(true);
      setTimeout(() => onComplete(-2), 500);
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setGameOver(true);
      setTimeout(() => onComplete(2), 500);
    }
  };

  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-purple-200">Memory Challenge</h3>
      <div className="bg-black/30 rounded-xl p-8 border border-purple-500/20">
        <p className="text-purple-100 mb-6 text-center">
          {showing ? 'Watch the sequence...' : 'Repeat the pattern!'}
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {colors.map((color, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={showing || gameOver}
              className={`h-24 rounded-xl ${color} ${
                showing && sequence[Math.floor(Date.now() / 750) % sequence.length] === index
                  ? 'opacity-100 scale-110'
                  : 'opacity-50'
              } transition-all duration-200 disabled:cursor-not-allowed`}
            />
          ))}
        </div>
        {gameOver && (
          <p className="text-center text-slate-300">
            {userSequence.length === sequence.length ? 'Success!' : 'Incorrect sequence'}
          </p>
        )}
      </div>
    </div>
  );
}

function BalanceGame({ onComplete }: { onComplete: (bonus: number) => void }) {
  const [position, setPosition] = useState(50);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameActive, setGameActive] = useState(true);

  useEffect(() => {
    if (!gameActive) return;

    const drift = setInterval(() => {
      setPosition((prev) => {
        const drift = (Math.random() - 0.5) * 5;
        return Math.max(0, Math.min(100, prev + drift));
      });
    }, 100);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          setGameActive(false);
          const inZone = position >= 40 && position <= 60;
          setTimeout(() => onComplete(inZone ? 2 : -2), 500);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      clearInterval(drift);
      clearInterval(timer);
    };
  }, [gameActive, position, onComplete]);

  const handleLeft = () => {
    if (!gameActive) return;
    setPosition((prev) => Math.max(0, prev - 5));
  };

  const handleRight = () => {
    if (!gameActive) return;
    setPosition((prev) => Math.min(100, prev + 5));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-purple-200">Balance Challenge</h3>
      <div className="bg-black/30 rounded-xl p-8 border border-purple-500/20">
        <p className="text-purple-100 mb-4 text-center">
          Keep the marker in the center for {timeLeft.toFixed(1)}s
        </p>
        <div className="relative h-12 bg-slate-800 rounded-lg mb-6 overflow-hidden">
          <div className="absolute inset-y-0 left-[40%] right-[40%] bg-green-500/30 border-x-2 border-green-500" />
          <div
            className="absolute inset-y-0 w-3 bg-purple-500 transition-all duration-100"
            style={{ left: `${position}%` }}
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleLeft}
            disabled={!gameActive}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl"
          >
            ← Left
          </button>
          <button
            onClick={handleRight}
            disabled={!gameActive}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl"
          >
            Right →
          </button>
        </div>
      </div>
    </div>
  );
}

function CollectGame({ onComplete }: { onComplete: (bonus: number) => void }) {
  const [items, setItems] = useState<{ id: number; x: number; y: number }[]>([]);
  const [collected, setCollected] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameActive, setGameActive] = useState(true);

  useEffect(() => {
    const initialItems = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 10,
    }));
    setItems(initialItems);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          setGameActive(false);
          const success = collected >= 4;
          setTimeout(() => onComplete(success ? 2 : -2), 500);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [collected, onComplete]);

  const handleClick = (id: number) => {
    if (!gameActive) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    setCollected((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-purple-200">Collection Challenge</h3>
      <div className="bg-black/30 rounded-xl p-8 border border-purple-500/20">
        <p className="text-purple-100 mb-4 text-center">
          Collect 4+ items in {timeLeft.toFixed(1)}s (Collected: {collected})
        </p>
        <div className="relative h-64 bg-slate-800 rounded-lg overflow-hidden">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className="absolute w-8 h-8 bg-yellow-400 rounded-full hover:bg-yellow-300 transition-all"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              ✨
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
