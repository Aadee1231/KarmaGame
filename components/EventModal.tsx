'use client';

import { useState } from 'react';
import { Scenario, Choice } from '@/types/game';

interface EventModalProps {
  scenario: Scenario;
  onComplete: (choice: Choice) => void;
  onClose: () => void;
}

type ModalStep = 'intro' | 'minigame' | 'choice' | 'reflection';

export default function EventModal({ scenario, onComplete, onClose }: EventModalProps) {
  const [step, setStep] = useState<ModalStep>('intro');
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [miniGameComplete, setMiniGameComplete] = useState(false);

  const handleMiniGameComplete = () => {
    setMiniGameComplete(true);
    setStep('choice');
  };

  const handleChoiceSelect = (choice: Choice) => {
    setSelectedChoice(choice);
    setStep('reflection');
  };

  const handleComplete = () => {
    if (selectedChoice) {
      onComplete(selectedChoice);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500/30 shadow-2xl">
        <div className="p-8">
          {step === 'intro' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-purple-200">
                {scenario.title}
              </h2>
              <p className="text-lg text-purple-100 leading-relaxed">
                {scenario.description}
              </p>
              <button
                onClick={() => setStep('minigame')}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Continue
              </button>
            </div>
          )}

          {step === 'minigame' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-purple-200">
                Moment of Reflection
              </h3>
              <div className="bg-black/30 rounded-xl p-6 border border-purple-500/20">
                <p className="text-purple-100 mb-6">
                  Take a moment to consider this situation deeply. What would you do?
                </p>
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-purple-600 animate-pulse" />
                </div>
              </div>
              <button
                onClick={handleMiniGameComplete}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                I'm Ready to Choose
              </button>
            </div>
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
                    className="w-full p-6 bg-gradient-to-r from-purple-800/50 to-indigo-800/50 hover:from-purple-700/70 hover:to-indigo-700/70 border-2 border-purple-500/30 hover:border-purple-400/60 rounded-xl text-left transition-all duration-300 transform hover:scale-102 hover:shadow-xl group"
                  >
                    <p className="text-lg font-semibold text-purple-100 group-hover:text-white">
                      {choice.text}
                    </p>
                    <div className="mt-3 space-y-1 text-sm text-purple-300">
                      <p><span className="font-semibold">Intention:</span> {choice.intention}</p>
                      <p><span className="font-semibold">Action:</span> {choice.action}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'reflection' && selectedChoice && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-purple-200">
                Consequence & Reflection
              </h3>
              <div className="space-y-4">
                <div className="bg-black/30 rounded-xl p-6 border border-purple-500/20">
                  <p className="text-sm font-semibold text-purple-300 mb-2">Consequence:</p>
                  <p className="text-purple-100">{selectedChoice.consequence}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-900/30 to-purple-900/30 rounded-xl p-6 border-2 border-yellow-500/30">
                  <p className="text-sm font-semibold text-yellow-300 mb-2">Karmic Reflection:</p>
                  <p className="text-yellow-100 italic">{selectedChoice.reflection}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">
                    Karma Impact:{' '}
                    <span className={selectedChoice.karmaImpact >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {selectedChoice.karmaImpact >= 0 ? '+' : ''}{selectedChoice.karmaImpact}
                    </span>
                  </p>
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
