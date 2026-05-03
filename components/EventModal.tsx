'use client';

import { useState, useEffect, useRef } from 'react';
import { Scenario, Choice, KarmaBreakdown } from '@/types/game';
import { calculateKarmaChange } from '@/lib/karma';
import MiniGameRouter from './minigames/MiniGameRouter';

interface EventModalProps {
  scenario: Scenario;
  onComplete: (choice: Choice, karmaBreakdown: KarmaBreakdown) => void;
  onClose: () => void;
}

type ModalStep = 'minigame_intro' | 'minigame' | 'minigame_result' | 'scenario_intro' | 'choice' | 'reflection';

export default function EventModal({ scenario, onComplete, onClose }: EventModalProps) {
  const [step, setStep] = useState<ModalStep>('minigame_intro');
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [karmaBreakdown, setKarmaBreakdown] = useState<KarmaBreakdown | null>(null);
  const [miniGameResult, setMiniGameResult] = useState<{ success: boolean; consequenceBonus: number; message: string } | null>(null);

  const handleMiniGameComplete = (result: { success: boolean; consequenceBonus: number; message: string }) => {
    setMiniGameResult(result);
    setStep('minigame_result');
  };

  const handleChoiceSelect = (choice: Choice) => {
    const bonus = miniGameResult?.consequenceBonus || 0;
    const breakdown = calculateKarmaChange(
      choice.intentionScore,
      choice.actionScore,
      choice.consequenceScore,
      choice.attachmentScore,
      bonus
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

  const getMiniGameIntro = () => {
    const intros: Record<string, { title: string; objective: string; rules: string; relevance: string }> = {
      'memory-match': {
        title: 'Memory Match',
        objective: 'Remember and repeat a 7-symbol sequence',
        rules: 'Watch symbols appear one by one (4s each). Then click them in the correct order.',
        relevance: 'Actions create chains of consequences. Can you remember the pattern and not repeat mistakes?'
      },
      'frogger-crossing': {
        title: 'Frogger Crossing',
        objective: 'Survive 20 seconds without collision',
        rules: 'Use ↑↓ or W/S to move between lanes. Avoid moving obstacles. Timing is everything.',
        relevance: 'Life throws obstacles at you constantly. Can you navigate chaos with patience?'
      },
      'maze-escape': {
        title: 'Maze Escape',
        objective: 'Reach the exit before time runs out',
        rules: 'Use Arrow Keys or WASD to navigate. Find the door within 45 seconds.',
        relevance: 'Sometimes the path is unclear. Persistence reveals the way forward.'
      },
      'quick-dodge': {
        title: 'Quick Dodge',
        objective: 'Survive 10 seconds without getting hit',
        rules: 'Use ←→ or A/D to dodge falling hazards. Stay alert and keep moving.',
        relevance: 'Danger comes from above. Awareness and quick reflexes protect you.'
      },
      'reaction-bar': {
        title: 'Reaction Bar',
        objective: 'Stop in the green zone 3 out of 5 times',
        rules: 'Press Space or Enter to stop the moving bar. Hit the green zone for success.',
        relevance: 'Timing is crucial in life. Can you act at the right moment?'
      },
      'simon-says': {
        title: 'Simon Says',
        objective: 'Repeat the pattern for 7 rounds',
        rules: 'Watch the tiles flash, then click them in the same order. Pattern grows each round.',
        relevance: 'Attention and memory guide right action. Can you follow the pattern?'
      },
      'coin-collection': {
        title: 'Coin Collection',
        objective: 'Collect 40+ coins in 45 seconds',
        rules: 'Use Arrow Keys or WASD to move. Gather coins but avoid bombs.',
        relevance: 'Resources are limited. Can you gather what you need while avoiding danger?'
      },
      'lockpick': {
        title: 'Lockpick Timing',
        objective: 'Pick 3 locks successfully',
        rules: 'Press Space or Enter to stop the needle in the green zone. Each round gets faster.',
        relevance: 'Precision and timing unlock doors. Can you master the moment?'
      },
      'tile-pattern': {
        title: 'Tile Pattern Puzzle',
        objective: 'Step on tiles in the correct order',
        rules: 'Watch which tiles flash, then click them in the same sequence.',
        relevance: 'The path is shown briefly. Can you remember and follow it?'
      },
      'crate-push': {
        title: 'Crate Push Puzzle',
        objective: 'Push all crates onto the switches',
        rules: 'Use Arrow Keys or WASD to move and push crates. Plan your moves carefully.',
        relevance: 'Some problems require strategy, not force. Can you think ahead?'
      },
      'light-beam': {
        title: 'Light Beam Reflector',
        objective: 'Rotate mirrors so light reaches the target',
        rules: 'Click mirrors to rotate them 45°. Align them to guide the beam.',
        relevance: 'Clarity comes from proper alignment. Can you direct the light?'
      }
    };

    return intros[scenario.miniGameType] || intros['memory-match'];
  };

  const miniGameIntro = getMiniGameIntro();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500/30 shadow-2xl">
        <div className="p-8">
          {step === 'minigame_intro' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-purple-200 text-center">
                {miniGameIntro.title}
              </h2>
              
              <div className="bg-black/40 rounded-xl p-6 border border-purple-500/30 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">Objective</h3>
                  <p className="text-slate-200">{miniGameIntro.objective}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">Rules</h3>
                  <p className="text-slate-200">{miniGameIntro.rules}</p>
                </div>
                
                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                  <h3 className="text-lg font-semibold text-yellow-300 mb-2">Why This Matters</h3>
                  <p className="text-yellow-100 italic">{miniGameIntro.relevance}</p>
                </div>
              </div>

              <button
                onClick={() => setStep('minigame')}
                className="w-full py-5 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xl font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Begin Challenge
              </button>
              <button
                onClick={() => setStep('scenario_intro')}
                className="w-full py-2 px-4 text-slate-500 hover:text-slate-300 text-xs transition-all"
              >
                Skip Challenge (dev)
              </button>
            </div>
          )}

          {step === 'minigame' && (
            <div className="space-y-6">
              <MiniGameRouter
                miniGameType={scenario.miniGameType}
                onComplete={handleMiniGameComplete}
                scenarioTitle={scenario.title}
              />
              <button
                onClick={() => {
                  handleMiniGameComplete({
                    success: false,
                    consequenceBonus: -1,
                    message: "You chose to abandon the challenge. Sometimes walking away teaches its own lesson."
                  });
                }}
                className="w-full py-3 px-6 bg-gradient-to-r from-red-600/50 to-orange-600/50 hover:from-red-500/50 hover:to-orange-500/50 text-white font-semibold rounded-xl transition-all duration-300 border border-red-500/30"
              >
                Skip Challenge (-1 to consequences)
              </button>
            </div>
          )}

          {step === 'minigame_result' && miniGameResult && (
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-purple-200 text-center">
                Challenge Result
              </h3>
              <div className={`bg-gradient-to-br ${miniGameResult.success ? 'from-green-900/30 to-emerald-900/30 border-green-500/30' : 'from-red-900/30 to-orange-900/30 border-red-500/30'} rounded-xl p-8 border-2`}>
                <div className="text-center mb-4">
                  <div className="text-6xl mb-4">
                    {miniGameResult.success ? '✓' : '✗'}
                  </div>
                  <p className={`text-xl font-semibold ${miniGameResult.success ? 'text-green-300' : 'text-red-300'}`}>
                    {miniGameResult.success ? 'Success' : 'Failed'}
                  </p>
                </div>
                <p className="text-lg text-slate-200 leading-relaxed text-center italic">
                  "{miniGameResult.message}"
                </p>
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-400">Consequence Modifier:</p>
                  <p className={`text-2xl font-bold ${miniGameResult.consequenceBonus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {miniGameResult.consequenceBonus >= 0 ? '+' : ''}{miniGameResult.consequenceBonus}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStep('scenario_intro')}
                className="w-full py-5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xl font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Continue to Scenario
              </button>
            </div>
          )}

          {step === 'scenario_intro' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-purple-200">
                {scenario.title}
              </h2>
              <p className="text-lg text-slate-200 leading-relaxed">
                {scenario.description}
              </p>
              {miniGameResult && (
                <div className={`bg-gradient-to-br ${miniGameResult.success ? 'from-green-900/20 to-emerald-900/20 border-green-500/20' : 'from-red-900/20 to-orange-900/20 border-red-500/20'} rounded-xl p-4 border-2`}>
                  <p className="text-sm text-slate-300 text-center">
                    Your performance in the challenge has {miniGameResult.success ? 'improved' : 'worsened'} your circumstances ({miniGameResult.consequenceBonus >= 0 ? '+' : ''}{miniGameResult.consequenceBonus} to consequences).
                  </p>
                </div>
              )}
              <button
                onClick={() => setStep('choice')}
                className="w-full py-5 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xl font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Face the Choice
              </button>
            </div>
          )}

          {step === 'choice' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-purple-200">
                {scenario.title}
              </h2>
              <p className="text-lg text-slate-200 leading-relaxed mb-6">
                {scenario.description}
              </p>
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
                    <p className="text-lg font-semibold text-slate-100 group-hover:text-white">
                      {choice.text}
                    </p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  const neutralChoice = scenario.choices[0];
                  handleChoiceSelect(neutralChoice);
                }}
                className="w-full py-3 px-6 bg-gradient-to-r from-red-600/50 to-orange-600/50 hover:from-red-500/50 hover:to-orange-500/50 text-white font-semibold rounded-xl transition-all duration-300 border border-red-500/30"
              >
                Skip Scenario (auto-select first choice)
              </button>
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
                  </div>
                  {miniGameResult && (
                    <div className="pt-3 border-t border-slate-600/30">
                      <span className="text-slate-400 text-xs">Mini-game Bonus:</span>
                      <span className={`ml-2 font-bold ${miniGameResult.consequenceBonus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {miniGameResult.consequenceBonus >= 0 ? '+' : ''}{miniGameResult.consequenceBonus}
                      </span>
                    </div>
                  )}
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
