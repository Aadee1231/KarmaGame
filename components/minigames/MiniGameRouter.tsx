'use client';

import { MiniGameType, MiniGameProps } from '@/types/game';
import MemoryMatchGame from './MemoryConsequencesGame';
import FroggerCrossingGame from './FroggerCrossingGame';
import MazeEscapeGame from './MazeEscapeGame';
import QuickDodgeGame from './QuickDodgeGame';
import ReactionBarGame from './ReactionBarGame';
import SimonSaysGame from './SimonSaysGame';
import CoinCollectionGame from './CoinCollectionGame';
import LockpickGame from './LockpickGame';
import TilePatternGame from './TilePatternGame';
import CratePushGame from './CratePushGame';
import LightBeamGame from './LightBeamGame';

interface MiniGameRouterProps extends MiniGameProps {
  miniGameType: MiniGameType;
}

export default function MiniGameRouter({ miniGameType, onComplete, scenarioTitle }: MiniGameRouterProps) {
  switch (miniGameType) {
    case 'memory-match':
      return <MemoryMatchGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'frogger-crossing':
      return <FroggerCrossingGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'maze-escape':
      return <MazeEscapeGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'quick-dodge':
      return <QuickDodgeGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'reaction-bar':
      return <ReactionBarGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'simon-says':
      return <SimonSaysGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'coin-collection':
      return <CoinCollectionGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'lockpick':
      return <LockpickGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'tile-pattern':
      return <TilePatternGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'crate-push':
      return <CratePushGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'light-beam':
      return <LightBeamGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    default:
      return <MemoryMatchGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
  }
}
