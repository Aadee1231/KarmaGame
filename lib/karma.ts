import { KarmaBreakdown } from '@/types/game';

export function calculateKarmaChange(
  intentionScore: number,
  actionScore: number,
  consequenceScore: number,
  attachmentScore: number,
  miniGameBonus: number = 0
): KarmaBreakdown {
  const total = 
    intentionScore * 0.35 +
    actionScore * 0.25 +
    consequenceScore * 0.25 +
    attachmentScore * 0.15 +
    miniGameBonus;

  return {
    intentionScore,
    actionScore,
    consequenceScore,
    attachmentScore,
    miniGameBonus,
    total: Math.round(total * 10) / 10,
  };
}

export function applyKarma(currentKarma: number, karmaDelta: number): number {
  return Math.max(0, Math.min(100, currentKarma + karmaDelta));
}

export function getKarmaLevel(karma: number): string {
  if (karma >= 95) return 'Enlightened';
  if (karma >= 80) return 'Virtuous';
  if (karma >= 60) return 'Balanced';
  if (karma >= 40) return 'Struggling';
  if (karma >= 21) return 'Wavering';
  return 'Lost';
}

export function getNextLifeId(karma: number): string {
  if (karma >= 95) return 'monk';
  if (karma >= 80) return 'rich_human';
  if (karma >= 60) return 'poor_student';
  if (karma >= 40) return 'dog';
  if (karma >= 21) return 'snake';
  return 'microorganism';
}

export function getLifeIndex(lifeId: string): number {
  const order = ['microorganism', 'snake', 'dog', 'poor_student', 'rich_human', 'monk'];
  return order.indexOf(lifeId);
}

export function getRebirthMessage(karma: number, nextLifeId: string): string {
  const messages: Record<string, string> = {
    monk: `Your karma has reached ${Math.round(karma)}. Through compassion, wisdom, and detachment, you are reborn as a spiritual guide.`,
    rich_human: `Your karma is ${Math.round(karma)}. Your virtuous actions have earned you a life of privilege and responsibility.`,
    poor_student: `Your karma is ${Math.round(karma)}. You return to human form, where growth and learning await.`,
    dog: `Your karma is ${Math.round(karma)}. You are reborn as a loyal companion, learning unconditional love.`,
    snake: `Your karma is ${Math.round(karma)}. Fear, attachment, or harmful actions have led you to a lower form.`,
    microorganism: `Your karma has fallen to ${Math.round(karma)}. You must begin again from the smallest form of life.`,
  };
  return messages[nextLifeId] || 'The wheel of samsara turns...';
}

export function getStrongestPattern(patterns: {
  compassionate: number;
  selfish: number;
  detached: number;
  attached: number;
}): string {
  const entries = Object.entries(patterns);
  const max = Math.max(...entries.map(([_, v]) => v));
  if (max === 0) return 'Balanced';
  
  const strongest = entries.find(([_, v]) => v === max);
  if (!strongest) return 'Balanced';
  
  const labels: Record<string, string> = {
    compassionate: 'Compassionate',
    selfish: 'Selfish',
    detached: 'Detached',
    attached: 'Attached',
  };
  
  return labels[strongest[0]] || 'Balanced';
}
