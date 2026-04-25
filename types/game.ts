export type MiniGameType = 'reflection' | 'timing' | 'memory' | 'choice';

export interface Choice {
  text: string;
  intention: string;
  action: string;
  consequence: string;
  reflection: string;
  karmaImpact: number;
  flagsAdded?: string[];
  flagsRequired?: string[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  miniGameType: MiniGameType;
  choices: Choice[];
  flagsRequired?: string[];
}

export interface Life {
  id: string;
  name: string;
  emoji: string;
  description: string;
  scenarios: Scenario[];
  karmaThreshold: number;
}

export interface EventObject {
  id: string;
  scenarioId: string;
  x: number;
  y: number;
  completed: boolean;
  emoji: string;
}

export interface Player {
  x: number;
  y: number;
  emoji: string;
}

export interface GameState {
  currentLifeId: string | null;
  karma: number;
  completedScenarios: string[];
  flags: string[];
  lifeIndex: number;
}
