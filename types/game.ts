export type MiniGameType =
  | "memory-match"
  | "frogger-crossing"
  | "maze-escape"
  | "quick-dodge"
  | "reaction-bar"
  | "simon-says"
  | "coin-collection"
  | "lockpick"
  | "tile-pattern"
  | "crate-push"
  | "light-beam";

export interface MiniGameProps {
  onComplete: (result: { success: boolean; consequenceBonus: number; message: string }) => void;
  scenarioTitle?: string;
}

export interface Choice {
  text: string;
  intention: string;
  action: string;
  consequence: string;
  reflection: string;
  intentionScore: number;
  actionScore: number;
  consequenceScore: number;
  attachmentScore: number;
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
  x: number;
  y: number;
  locked: boolean;
  label?: string;
}

export interface Player {
  x: number;
  y: number;
  emoji: string;
}

export interface GameState {
  currentLifeId: string;
  karma: number;
  completedScenarios: string[];
  flags: string[];
  visitedLives: string[];
  choicePatterns: {
    compassionate: number;
    selfish: number;
    detached: number;
    attached: number;
  };
}

export interface KarmaBreakdown {
  intentionScore: number;
  actionScore: number;
  consequenceScore: number;
  attachmentScore: number;
  miniGameBonus: number;
  total: number;
}
