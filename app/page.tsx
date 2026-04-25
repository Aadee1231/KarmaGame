'use client';

import { useState, useEffect } from 'react';
import GameWorld from '@/components/GameWorld';
import EventModal from '@/components/EventModal';
import { GameState, EventObject, Choice, KarmaBreakdown } from '@/types/game';
import { getLifeById } from '@/data/gameData';
import { applyKarma, getKarmaLevel, getNextLifeId, getRebirthMessage, getStrongestPattern } from '@/lib/karma';

type GamePhase = 'intro' | 'playing' | 'life_complete' | 'rebirth' | 'true_ending';

export default function Home() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [gameState, setGameState] = useState<GameState>({
    currentLifeId: 'poor_student',
    karma: 60,
    completedScenarios: [],
    flags: [],
    visitedLives: [],
    choicePatterns: { compassionate: 0, selfish: 0, detached: 0, attached: 0 },
  });
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [completedEvents, setCompletedEvents] = useState<Set<string>>(new Set());

  const currentLife = getLifeById(gameState.currentLifeId);

  const generateEvents = (): EventObject[] => {
    if (!currentLife) return [];

    return currentLife.scenarios.map((scenario, index) => {
      const angle = (index / currentLife.scenarios.length) * 2 * Math.PI;
      const radius = 200;
      const x = 400 + Math.cos(angle) * radius;
      const y = 300 + Math.sin(angle) * radius;

      const isCompleted = gameState.completedScenarios.includes(scenario.id);
      const isLocked = index > 0 && !gameState.completedScenarios.includes(currentLife.scenarios[index - 1].id);

      return {
        id: scenario.id,
        x,
        y,
        locked: isLocked,
        label: `${index + 1}. ${scenario.title}`,
      };
    });
  };

  const events = generateEvents();

  const handleEventTrigger = (eventId: string) => {
    if (!completedEvents.has(eventId)) {
      setCurrentEventId(eventId);
    }
  };

  const handleEventComplete = (choice: Choice, karmaBreakdown: KarmaBreakdown) => {
    if (!currentEventId || !currentLife) return;

    const newKarma = applyKarma(gameState.karma, karmaBreakdown.total);
    const newCompletedScenarios = [...gameState.completedScenarios, currentEventId];
    const newFlags = [...gameState.flags, ...(choice.flagsAdded || [])];

    const newPatterns = { ...gameState.choicePatterns };
    if (choice.intentionScore >= 7) newPatterns.compassionate++;
    if (choice.intentionScore <= -5) newPatterns.selfish++;
    if (choice.attachmentScore >= 7) newPatterns.detached++;
    if (choice.attachmentScore <= -5) newPatterns.attached++;

    setGameState({
      ...gameState,
      karma: newKarma,
      completedScenarios: newCompletedScenarios,
      flags: newFlags,
      choicePatterns: newPatterns,
    });

    setCompletedEvents((prev) => {
      const newSet = new Set(prev);
      newSet.add(currentEventId);
      return newSet;
    });

    setCurrentEventId(null);

    if (newCompletedScenarios.length >= currentLife.scenarios.length) {
      setTimeout(() => setGamePhase('life_complete'), 500);
    }
  };

  const handleRebirth = () => {
    const nextLifeId = getNextLifeId(gameState.karma);
    const newVisitedLives = [...new Set([...gameState.visitedLives, gameState.currentLifeId])];

    if (nextLifeId === 'monk' && gameState.karma >= 95 && newVisitedLives.length >= 4) {
      setGamePhase('true_ending');
      return;
    }

    setGameState({
      currentLifeId: nextLifeId,
      karma: gameState.karma,
      completedScenarios: [],
      flags: [],
      visitedLives: newVisitedLives,
      choicePatterns: { compassionate: 0, selfish: 0, detached: 0, attached: 0 },
    });

    setCompletedEvents(new Set());
    setGamePhase('rebirth');
  };

  const handleContinueAfterRebirth = () => {
    setGamePhase('playing');
  };

  const handleStartGame = () => {
    setGamePhase('playing');
  };

  const currentScenario = currentEventId && currentLife
    ? currentLife.scenarios.find((s) => s.id === currentEventId)
    : null;

  if (gamePhase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <div className="max-w-3xl bg-black/40 backdrop-blur-xl rounded-3xl p-12 border-2 border-purple-500/30 shadow-2xl">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-purple-200 to-pink-200 mb-6 text-center">
            The Karma Game
          </h1>
          <p className="text-xl text-slate-200 mb-8 text-center leading-relaxed">
            A journey through six lives. Your choices shape your karma. Your karma shapes your rebirth.
          </p>
          <div className="space-y-4 mb-8 text-slate-300">
            <p className="text-center text-lg">
              <strong className="text-purple-300">The Path:</strong>
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-black/30 p-4 rounded-xl border border-slate-700/30">
                <div className="text-2xl mb-2">🦠</div>
                <div className="font-semibold text-slate-200">Micro-organism</div>
                <div className="text-slate-400 text-xs">Karma: 0-20</div>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-slate-700/30">
                <div className="text-2xl mb-2">🐍</div>
                <div className="font-semibold text-slate-200">Snake</div>
                <div className="text-slate-400 text-xs">Karma: 21-39</div>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-slate-700/30">
                <div className="text-2xl mb-2">🐕</div>
                <div className="font-semibold text-slate-200">Dog</div>
                <div className="text-slate-400 text-xs">Karma: 40-59</div>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-slate-700/30">
                <div className="text-2xl mb-2">🎓</div>
                <div className="font-semibold text-slate-200">Poor Human Student</div>
                <div className="text-slate-400 text-xs">Karma: 60-79</div>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-slate-700/30">
                <div className="text-2xl mb-2">💎</div>
                <div className="font-semibold text-slate-200">Rich Human</div>
                <div className="text-slate-400 text-xs">Karma: 80-94</div>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-slate-700/30">
                <div className="text-2xl mb-2">🧘</div>
                <div className="font-semibold text-slate-200">Monk / Spiritual Guide</div>
                <div className="text-slate-400 text-xs">Karma: 95+</div>
              </div>
            </div>
          </div>
          <p className="text-center text-slate-400 mb-8 italic">
            Reach enlightenment by visiting 4+ lives and achieving Monk status with 95+ karma.
          </p>
          <button
            onClick={handleStartGame}
            className="w-full py-5 px-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Begin Your Journey
          </button>
        </div>
      </div>
    );
  }

  if (gamePhase === 'life_complete') {
    const pattern = getStrongestPattern(gameState.choicePatterns);
    const karmaLevel = getKarmaLevel(gameState.karma);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 flex items-center justify-center p-4">
        <div className="max-w-3xl bg-black/40 backdrop-blur-xl rounded-3xl p-12 border-2 border-purple-500/30 shadow-2xl">
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-purple-200 mb-6 text-center">
            Life Complete
          </h2>
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">{currentLife?.emoji}</div>
            <h3 className="text-3xl font-semibold text-slate-200 mb-2">{currentLife?.name}</h3>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-black/30 rounded-xl p-6 border border-purple-500/20">
              <h4 className="text-xl font-semibold text-purple-300 mb-4">Karma Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Final Karma:</span>
                  <span className="text-2xl font-bold text-yellow-400">{gameState.karma}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Karma Level:</span>
                  <span className="text-lg font-semibold text-purple-300">{karmaLevel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Scenarios Completed:</span>
                  <span className="text-lg text-slate-200">{gameState.completedScenarios.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-6 border border-purple-500/20">
              <h4 className="text-xl font-semibold text-purple-300 mb-4">Pattern Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">Compassionate Choices:</span>
                  <span className="text-green-400 font-semibold">{gameState.choicePatterns.compassionate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Selfish Choices:</span>
                  <span className="text-red-400 font-semibold">{gameState.choicePatterns.selfish}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Detached Choices:</span>
                  <span className="text-blue-400 font-semibold">{gameState.choicePatterns.detached}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Attached Choices:</span>
                  <span className="text-orange-400 font-semibold">{gameState.choicePatterns.attached}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-600/30">
                <p className="text-slate-300">
                  <strong className="text-purple-300">Dominant Pattern:</strong>{' '}
                  <span className="text-yellow-300">{pattern}</span>
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/30 to-purple-900/30 rounded-xl p-6 border-2 border-yellow-500/30">
              <h4 className="text-xl font-semibold text-yellow-300 mb-3">Rebirth Awaits</h4>
              <p className="text-yellow-100 mb-4">
                {getRebirthMessage(gameState.karma, getNextLifeId(gameState.karma))}
              </p>
              <p className="text-slate-300 text-sm">
                Lives visited: {gameState.visitedLives.length + 1} / 6
              </p>
            </div>
          </div>

          <button
            onClick={handleRebirth}
            className="w-full py-5 px-8 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-white text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Accept Rebirth
          </button>
        </div>
      </div>
    );
  }

  if (gamePhase === 'rebirth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-indigo-950 flex items-center justify-center p-4">
        <div className="max-w-2xl bg-black/40 backdrop-blur-xl rounded-3xl p-12 border-2 border-purple-500/30 shadow-2xl text-center">
          <div className="text-8xl mb-6 animate-pulse">{currentLife?.emoji}</div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-purple-200 mb-4">
            You Are Reborn
          </h2>
          <h3 className="text-3xl font-semibold text-slate-200 mb-6">{currentLife?.name}</h3>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            {currentLife?.description}
          </p>
          <div className="bg-black/30 rounded-xl p-6 border border-purple-500/20 mb-8">
            <p className="text-slate-300">
              <strong className="text-purple-300">Current Karma:</strong>{' '}
              <span className="text-2xl font-bold text-yellow-400">{gameState.karma}</span>
            </p>
          </div>
          <button
            onClick={handleContinueAfterRebirth}
            className="w-full py-5 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Begin This Life
          </button>
        </div>
      </div>
    );
  }

  if (gamePhase === 'true_ending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-purple-900 flex items-center justify-center p-4">
        <div className="max-w-3xl bg-black/40 backdrop-blur-xl rounded-3xl p-12 border-2 border-yellow-500/50 shadow-2xl text-center">
          <div className="text-9xl mb-6 animate-pulse">🕉️</div>
          <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-purple-200 mb-6">
            Enlightenment
          </h2>
          <p className="text-2xl text-yellow-100 mb-8 leading-relaxed">
            You have walked the path through many forms. You have learned compassion, faced suffering, and transcended attachment.
          </p>
          <div className="bg-black/30 rounded-xl p-8 border-2 border-yellow-500/30 mb-8 space-y-4">
            <p className="text-xl text-slate-200">
              <strong className="text-yellow-300">Lives Experienced:</strong> {gameState.visitedLives.length + 1}
            </p>
            <p className="text-xl text-slate-200">
              <strong className="text-yellow-300">Final Karma:</strong>{' '}
              <span className="text-3xl font-bold text-yellow-400">{gameState.karma}</span>
            </p>
            <p className="text-xl text-slate-200">
              <strong className="text-yellow-300">Final Form:</strong> {currentLife?.name}
            </p>
          </div>
          <p className="text-lg text-purple-200 italic mb-8">
            "The cycle is complete. You are free."
          </p>
          <button
            onClick={() => window.location.reload()}
            className="py-5 px-8 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-400 hover:via-orange-400 hover:to-pink-400 text-white text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Begin Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 mb-4 border-2 border-purple-500/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-5xl">{currentLife?.emoji}</div>
              <div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-purple-200">
                  {currentLife?.name}
                </h2>
                <p className="text-slate-400 text-sm">{currentLife?.description}</p>
              </div>
            </div>
            <div className="flex gap-6 items-center">
              <div className="text-center">
                <div className="text-sm text-slate-400">Karma</div>
                <div className="text-3xl font-bold text-yellow-400">{gameState.karma}</div>
                <div className="text-xs text-purple-300">{getKarmaLevel(gameState.karma)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400">Progress</div>
                <div className="text-2xl font-bold text-purple-300">
                  {gameState.completedScenarios.length} / {currentLife?.scenarios.length || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400">Lives Visited</div>
                <div className="text-2xl font-bold text-indigo-300">{gameState.visitedLives.length}</div>
              </div>
            </div>
          </div>
        </div>

        <GameWorld
          life={currentLife!}
          events={events}
          onEventTrigger={handleEventTrigger}
          completedEvents={completedEvents}
        />

        {currentScenario && (
          <EventModal
            scenario={currentScenario}
            onComplete={handleEventComplete}
            onClose={() => setCurrentEventId(null)}
          />
        )}
      </div>
    </div>
  );
}
