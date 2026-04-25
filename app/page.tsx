'use client';

import { useState } from 'react';
import { lives } from '@/data/gameData';
import { Life, GameState, Choice } from '@/types/game';
import GameWorld from '@/components/GameWorld';
import { calculateKarma, getKarmaLevel, getNextLife, getRebirthMessage } from '@/lib/karma';

type GameScreen = 'start' | 'playing' | 'rebirth' | 'ending';

export default function Home() {
  const [screen, setScreen] = useState<GameScreen>('start');
  const [gameState, setGameState] = useState<GameState>({
    currentLifeId: null,
    karma: 50,
    completedScenarios: [],
    flags: [],
    lifeIndex: 0,
  });

  const currentLife = lives.find((l) => l.id === gameState.currentLifeId);

  const handleStartGame = (lifeId: string) => {
    const selectedLife = lives.find((l) => l.id === lifeId);
    if (selectedLife) {
      setGameState({
        currentLifeId: lifeId,
        karma: 50,
        completedScenarios: [],
        flags: [],
        lifeIndex: lives.indexOf(selectedLife),
      });
      setScreen('playing');
    }
  };

  const handleScenarioComplete = (scenarioId: string, choice: Choice) => {
    const newKarma = calculateKarma(gameState.karma, choice.karmaImpact);
    const newFlags = [...gameState.flags, ...(choice.flagsAdded || [])];

    setGameState((prev) => ({
      ...prev,
      karma: newKarma,
      completedScenarios: [...prev.completedScenarios, scenarioId],
      flags: newFlags,
    }));
  };

  const handleAllScenariosComplete = () => {
    setScreen('rebirth');
  };

  const handleRebirth = () => {
    const nextLifeIndex = getNextLife(gameState.karma, gameState.lifeIndex);

    if (nextLifeIndex === 5 && gameState.lifeIndex === 5) {
      setScreen('ending');
      return;
    }

    const nextLife = lives[nextLifeIndex];
    setGameState({
      currentLifeId: nextLife.id,
      karma: gameState.karma,
      completedScenarios: [],
      flags: gameState.flags,
      lifeIndex: nextLifeIndex,
    });
    setScreen('playing');
  };

  const handleRestart = () => {
    setGameState({
      currentLifeId: null,
      karma: 50,
      completedScenarios: [],
      flags: [],
      lifeIndex: 0,
    });
    setScreen('start');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      {screen === 'start' && (
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-purple-200 to-pink-200 animate-pulse">
              Karma & Rebirth
            </h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              A journey through the cycle of life, death, and rebirth. Your choices shape your karma and determine your next existence.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-xl rounded-2xl p-8 border-2 border-purple-500/30 shadow-2xl">
            <h2 className="text-3xl font-bold text-purple-200 mb-6 text-center">
              Choose Your First Life
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lives.slice(0, 3).map((life) => (
                <button
                  key={life.id}
                  onClick={() => handleStartGame(life.id)}
                  className="p-6 bg-gradient-to-br from-purple-800/50 to-indigo-800/50 hover:from-purple-700/70 hover:to-indigo-700/70 border-2 border-purple-500/30 hover:border-purple-400/60 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-left group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{life.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold text-purple-100 group-hover:text-white">
                        {life.name}
                      </h3>
                      <p className="text-sm text-purple-300 mt-1">
                        {life.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-purple-300 text-sm">
            <p>A game about intention, action, and consequence</p>
            <p className="mt-2">Created for Asian Religions Final Project</p>
          </div>
        </div>
      )}

      {screen === 'playing' && currentLife && (
        <GameWorld
          life={currentLife}
          karma={gameState.karma}
          completedScenarios={gameState.completedScenarios}
          onScenarioComplete={handleScenarioComplete}
          onAllScenariosComplete={handleAllScenariosComplete}
        />
      )}

      {screen === 'rebirth' && (
        <div className="max-w-2xl w-full space-y-8">
          <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-purple-500/30 shadow-2xl space-y-6">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-purple-200 text-center">
              Life Complete
            </h2>

            <div className="text-center space-y-4">
              <div className="text-6xl">{currentLife?.emoji}</div>
              <h3 className="text-2xl font-bold text-purple-200">
                {currentLife?.name}
              </h3>
            </div>

            <div className="bg-black/30 rounded-xl p-6 border border-purple-500/20 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-purple-300">Final Karma:</span>
                <span className={`text-2xl font-bold ${gameState.karma >= 50 ? 'text-green-400' : gameState.karma >= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {gameState.karma}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300">Karma Level:</span>
                <span className="text-xl font-bold text-purple-100">
                  {getKarmaLevel(gameState.karma)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300">Scenarios Completed:</span>
                <span className="text-xl font-bold text-blue-400">
                  {gameState.completedScenarios.length}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/30 to-purple-900/30 rounded-xl p-6 border-2 border-yellow-500/30">
              <p className="text-yellow-100 text-center text-lg">
                {getRebirthMessage(gameState.karma, getNextLife(gameState.karma, gameState.lifeIndex))}
              </p>
            </div>

            <div className="text-center space-y-4">
              <p className="text-purple-200 text-lg">
                Your next life will be: <span className="font-bold text-2xl">{lives[getNextLife(gameState.karma, gameState.lifeIndex)].emoji}</span>
              </p>
              <p className="text-xl font-bold text-purple-100">
                {lives[getNextLife(gameState.karma, gameState.lifeIndex)].name}
              </p>
            </div>

            <button
              onClick={handleRebirth}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xl rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Begin Next Life
            </button>
          </div>
        </div>
      )}

      {screen === 'ending' && (
        <div className="max-w-2xl w-full space-y-8">
          <div className="bg-gradient-to-br from-yellow-900/90 via-purple-900/90 to-indigo-900/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-yellow-500/50 shadow-2xl space-y-6">
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-purple-200 text-center animate-pulse">
              Enlightenment Achieved
            </h2>

            <div className="text-center space-y-4">
              <div className="text-8xl">🧘✨</div>
              <p className="text-2xl text-yellow-100 font-bold">
                You have transcended the cycle of rebirth
              </p>
            </div>

            <div className="bg-black/30 rounded-xl p-6 border border-yellow-500/30 space-y-3">
              <p className="text-yellow-100 text-center text-lg italic">
                Through countless lives, you have learned the nature of suffering, compassion, and wisdom.
              </p>
              <p className="text-yellow-100 text-center text-lg italic">
                Your karma has reached {gameState.karma}, a state of {getKarmaLevel(gameState.karma)}.
              </p>
              <p className="text-yellow-100 text-center text-lg italic">
                You are now free from the wheel of samsara.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/30 to-purple-900/30 rounded-xl p-6 border-2 border-yellow-500/30">
              <p className="text-yellow-100 text-center text-xl font-bold">
                "The mind is everything. What you think, you become."
              </p>
              <p className="text-yellow-300 text-center text-sm mt-2">
                - Buddha
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRestart}
                className="w-full py-4 px-6 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold text-xl rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Begin a New Journey
              </button>
              <p className="text-center text-purple-300 text-sm">
                Experience different paths and choices
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
