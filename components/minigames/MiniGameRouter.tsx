'use client';

import { MiniGameType, MiniGameProps } from '@/types/game';
import KarmaBalanceGame from './KarmaBalanceGame';
import IntentionOutcomeGame from './IntentionOutcomeGame';
import ImpulseControlGame from './ImpulseControlGame';
import BreathFocusGame from './BreathFocusGame';
import ShareOrHoardGame from './ShareOrHoardGame';
import FightOrFleeGame from './FightOrFleeGame';
import DonationDilemmaGame from './DonationDilemmaGame';
import SocialPressureGame from './SocialPressureGame';
import MemoryConsequencesGame from './MemoryConsequencesGame';
import EgoTrapGame from './EgoTrapGame';
import MicroLifeChaosGame from './MicroLifeChaosGame';

interface MiniGameRouterProps extends MiniGameProps {
  miniGameType: MiniGameType;
}

export default function MiniGameRouter({ miniGameType, onComplete, scenarioTitle }: MiniGameRouterProps) {
  switch (miniGameType) {
    case 'karma-balance':
      return <KarmaBalanceGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'intention-outcome':
      return <IntentionOutcomeGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'impulse-control':
      return <ImpulseControlGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'breath-focus':
      return <BreathFocusGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'share-or-hoard':
      return <ShareOrHoardGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'fight-or-flee':
      return <FightOrFleeGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'donation-dilemma':
      return <DonationDilemmaGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'social-pressure':
      return <SocialPressureGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'memory-consequences':
      return <MemoryConsequencesGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'ego-trap':
      return <EgoTrapGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    case 'micro-life-chaos':
      return <MicroLifeChaosGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
    default:
      return <KarmaBalanceGame onComplete={onComplete} scenarioTitle={scenarioTitle} />;
  }
}
