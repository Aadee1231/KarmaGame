'use client';

import { useState, useEffect, useRef } from 'react';
import { MiniGameProps } from '@/types/game';

export default function DonationDilemmaGame({ onComplete }: MiniGameProps) {
  const [timeLeft, setTimeLeft] = useState(180);
  const [coins, setCoins] = useState(100);
  const [helpImpact, setHelpImpact] = useState(0);
  const [egoMeter, setEgoMeter] = useState(0);
  const [selfComfort, setSelfComfort] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);

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
    if (helpImpact >= 50 && egoMeter <= 35) {
      onComplete({
        success: true,
        consequenceBonus: 2,
        message: "You helped without making compassion into a performance."
      });
    } else {
      onComplete({
        success: false,
        consequenceBonus: -2,
        message: "The help may have been real, but attachment to being seen changed its karmic weight."
      });
    }
  }, [gameOver, helpImpact, egoMeter, onComplete]);

  const handlePublicDonation = () => {
    if (coins >= 10) {
      setCoins(prev => prev - 10);
      setHelpImpact(prev => prev + 8);
      setEgoMeter(prev => prev + 6);
    }
  };

  const handlePrivateHelp = () => {
    if (coins >= 10) {
      setCoins(prev => prev - 10);
      setHelpImpact(prev => prev + 6);
      setEgoMeter(prev => prev + 2);
    }
  };

  const handleSelfComfort = () => {
    if (coins >= 10) {
      setCoins(prev => prev - 10);
      setSelfComfort(prev => prev + 5);
      setHelpImpact(prev => Math.max(0, prev - 2));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-2">Donation Dilemma</h3>
        <p className="text-slate-300 text-sm">Allocate your resources wisely</p>
      </div>

      <div className="bg-black/40 rounded-xl p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-slate-400">Time: </span>
            <span className="text-yellow-400 font-bold">{timeLeft.toFixed(1)}s</span>
          </div>
          <div>
            <span className="text-slate-400">Coins: </span>
            <span className="text-yellow-400 font-bold">{coins}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="text-slate-400 mb-1">Help Impact</div>
            <div className="text-green-400 font-bold text-lg">{helpImpact}</div>
            <div className="h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${Math.min(100, helpImpact)}%` }}
              />
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="text-slate-400 mb-1">Ego Meter</div>
            <div className="text-orange-400 font-bold text-lg">{egoMeter}</div>
            <div className="h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all"
                style={{ width: `${Math.min(100, egoMeter)}%` }}
              />
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="text-slate-400 mb-1">Self Comfort</div>
            <div className="text-blue-400 font-bold text-lg">{selfComfort}</div>
            <div className="h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${Math.min(100, selfComfort)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handlePublicDonation}
            disabled={coins < 10}
            className="w-full py-4 px-6 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          >
            +10 Public Donation
            <div className="text-xs text-yellow-200 mt-1">High impact, increases ego</div>
          </button>
          <button
            onClick={handlePrivateHelp}
            disabled={coins < 10}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          >
            +10 Private Help
            <div className="text-xs text-green-200 mt-1">Moderate impact, low ego</div>
          </button>
          <button
            onClick={handleSelfComfort}
            disabled={coins < 10}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          >
            +10 Self Comfort
            <div className="text-xs text-blue-200 mt-1">Preserves coins, lowers compassion</div>
          </button>
        </div>
      </div>
    </div>
  );
}
