import { atom } from 'jotai';
import { DEFAULT_FX_RATES } from '@/data/countries';

export const fxRatesAtom = atom<Record<string, number>>({ ...DEFAULT_FX_RATES });

export type ActiveTab = 'labor' | 'infra' | 'land' | 'port' | 'supply' | 'competitors';
export const activeTabAtom = atom<ActiveTab>('labor');
