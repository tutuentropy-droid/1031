import { elementFacts, getElementFact as getElementFactFromStore, getRandomElementFact as getRandomElementFactFromStore } from '../data/store';
import type { ElementFact } from '../../shared/types';

export function getElementFactByElementId(elementId: string): ElementFact | undefined {
  return getElementFactFromStore(elementId);
}

export function getRandomElementFact(chemistId?: string): ElementFact | null {
  return getRandomElementFactFromStore(chemistId);
}

export function getAllElementFacts(): ElementFact[] {
  return elementFacts;
}
