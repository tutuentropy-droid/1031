import { elements, getElementById as getElementByIdFromStore, getElementsByChemist as getElementsByChemistFromStore } from '../data/store';
import type { Element } from '../../shared/types';

export function getAllElements(): Element[] {
  return elements;
}

export function getElementById(id: string): Element | undefined {
  return getElementByIdFromStore(id);
}

export function getElementsByChemist(chemistId: string): Element[] {
  return getElementsByChemistFromStore(chemistId);
}
