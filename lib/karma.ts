export function calculateKarma(
  currentKarma: number,
  karmaImpact: number
): number {
  return currentKarma + karmaImpact;
}

export function getKarmaLevel(karma: number): string {
  if (karma >= 80) return 'Enlightened';
  if (karma >= 60) return 'Virtuous';
  if (karma >= 40) return 'Balanced';
  if (karma >= 20) return 'Struggling';
  return 'Lost';
}

export function getNextLife(karma: number, currentLifeIndex: number): number {
  if (currentLifeIndex >= 5) return 5;
  
  if (karma >= 70) {
    return Math.min(currentLifeIndex + 2, 5);
  } else if (karma >= 50) {
    return Math.min(currentLifeIndex + 1, 5);
  } else if (karma >= 30) {
    return currentLifeIndex;
  } else {
    return Math.max(currentLifeIndex - 1, 0);
  }
}

export function getRebirthMessage(karma: number, nextLifeIndex: number): string {
  const level = getKarmaLevel(karma);
  
  if (nextLifeIndex === 5) {
    return `Your karma (${karma}) has reached ${level} status. You have achieved spiritual enlightenment!`;
  } else if (nextLifeIndex > 3) {
    return `Your karma (${karma}) is ${level}. You are ascending toward enlightenment.`;
  } else if (nextLifeIndex === 3) {
    return `Your karma (${karma}) is ${level}. You maintain balance in the cycle.`;
  } else {
    return `Your karma (${karma}) is ${level}. You must learn more in your next life.`;
  }
}
