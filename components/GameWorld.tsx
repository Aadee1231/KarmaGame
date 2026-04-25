'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Life, EventObject, Player, Scenario } from '@/types/game';
import EventModal from './EventModal';
import { Choice } from '@/types/game';

interface GameWorldProps {
  life: Life;
  karma: number;
  completedScenarios: string[];
  onScenarioComplete: (scenarioId: string, choice: Choice) => void;
  onAllScenariosComplete: () => void;
}

const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 600;
const PLAYER_SIZE = 40;
const EVENT_SIZE = 50;
const MOVE_SPEED = 5;

export default function GameWorld({
  life,
  karma,
  completedScenarios,
  onScenarioComplete,
  onAllScenariosComplete,
}: GameWorldProps) {
  const [player, setPlayer] = useState<Player>({
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    emoji: life.emoji,
  });

  const [events, setEvents] = useState<EventObject[]>([]);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const gameLoopRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const availableScenarios = life.scenarios.filter(
      (s) => !completedScenarios.includes(s.id)
    );

    const newEvents: EventObject[] = availableScenarios.map((scenario, index) => {
      const angle = (index / availableScenarios.length) * Math.PI * 2;
      const radius = Math.min(WORLD_WIDTH, WORLD_HEIGHT) * 0.35;
      return {
        id: scenario.id,
        scenarioId: scenario.id,
        x: WORLD_WIDTH / 2 + Math.cos(angle) * radius,
        y: WORLD_HEIGHT / 2 + Math.sin(angle) * radius,
        completed: false,
        emoji: '✨',
      };
    });

    setEvents(newEvents);
  }, [life, completedScenarios]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
      e.preventDefault();
      setKeys((prev) => {
        const newKeys = new Set(prev);
        newKeys.add(e.key.toLowerCase());
        return newKeys;
      });
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeys((prev) => {
      const newKeys = new Set(prev);
      newKeys.delete(e.key.toLowerCase());
      return newKeys;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    const gameLoop = () => {
      setPlayer((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        if (keys.has('arrowleft') || keys.has('a')) newX -= MOVE_SPEED;
        if (keys.has('arrowright') || keys.has('d')) newX += MOVE_SPEED;
        if (keys.has('arrowup') || keys.has('w')) newY -= MOVE_SPEED;
        if (keys.has('arrowdown') || keys.has('s')) newY += MOVE_SPEED;

        newX = Math.max(PLAYER_SIZE / 2, Math.min(WORLD_WIDTH - PLAYER_SIZE / 2, newX));
        newY = Math.max(PLAYER_SIZE / 2, Math.min(WORLD_HEIGHT - PLAYER_SIZE / 2, newY));

        return { ...prev, x: newX, y: newY };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [keys]);

  useEffect(() => {
    events.forEach((event) => {
      const distance = Math.sqrt(
        Math.pow(player.x - event.x, 2) + Math.pow(player.y - event.y, 2)
      );

      if (distance < (PLAYER_SIZE + EVENT_SIZE) / 2 && !event.completed) {
        const scenario = life.scenarios.find((s) => s.id === event.scenarioId);
        if (scenario && !activeScenario) {
          setActiveScenario(scenario);
        }
      }
    });
  }, [player, events, life.scenarios, activeScenario]);

  const handleScenarioComplete = (choice: Choice) => {
    if (activeScenario) {
      onScenarioComplete(activeScenario.id, choice);
      setEvents((prev) =>
        prev.map((e) =>
          e.scenarioId === activeScenario.id ? { ...e, completed: true } : e
        )
      );
      setActiveScenario(null);

      if (completedScenarios.length + 1 >= life.scenarios.length) {
        setTimeout(() => {
          onAllScenariosComplete();
        }, 500);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 w-full max-w-4xl">
        <div className="flex justify-between items-center text-white">
          <div>
            <span className="text-2xl mr-2">{life.emoji}</span>
            <span className="font-bold text-lg">{life.name}</span>
          </div>
          <div className="flex gap-6">
            <div>
              <span className="text-purple-300">Karma: </span>
              <span className={`font-bold ${karma >= 50 ? 'text-green-400' : karma >= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                {karma}
              </span>
            </div>
            <div>
              <span className="text-purple-300">Events: </span>
              <span className="font-bold text-blue-400">
                {completedScenarios.length}/{life.scenarios.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 rounded-2xl border-4 border-purple-500/40 shadow-2xl overflow-hidden"
        style={{ width: WORLD_WIDTH, height: WORLD_HEIGHT }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

        {events.map((event) => (
          !event.completed && (
            <div
              key={event.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
              style={{
                left: event.x,
                top: event.y,
                width: EVENT_SIZE,
                height: EVENT_SIZE,
              }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-purple-600 flex items-center justify-center text-3xl animate-pulse shadow-lg shadow-purple-500/50 border-2 border-yellow-300/50">
                {event.emoji}
              </div>
            </div>
          )
        ))}

        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
          style={{
            left: player.x,
            top: player.y,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-2xl shadow-xl border-2 border-white/30">
            {player.emoji}
          </div>
        </div>
      </div>

      <div className="text-purple-300 text-sm text-center bg-black/30 rounded-lg p-3 border border-purple-500/20">
        <p>Use <span className="font-bold text-white">Arrow Keys</span> or <span className="font-bold text-white">WASD</span> to move</p>
        <p className="mt-1">Walk into glowing events to trigger scenarios</p>
      </div>

      {activeScenario && (
        <EventModal
          scenario={activeScenario}
          onComplete={handleScenarioComplete}
          onClose={() => setActiveScenario(null)}
        />
      )}
    </div>
  );
}
