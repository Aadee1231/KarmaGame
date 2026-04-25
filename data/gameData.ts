import { Life } from '@/types/game';
import { poorStudentLife } from './lives/poorStudent';
import { dogLife } from './lives/dog';
import { snakeLife } from './lives/snake';
import { richHumanLife } from './lives/richHuman';
import { monkLife } from './lives/monk';
import { microorganismLife } from './lives/microorganism';

export const lives: Life[] = [
  microorganismLife,
  snakeLife,
  dogLife,
  poorStudentLife,
  richHumanLife,
  monkLife,
];

export function getLifeById(id: string): Life | undefined {
  return lives.find(life => life.id === id);
}

export function getLifeByIndex(index: number): Life | undefined {
  return lives[index];
}
