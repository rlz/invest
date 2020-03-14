import { Currency } from '../api/common';

export interface InstrumentState {
  figi: string;
  amount: number;
  currency: Currency;
  cost: number;
}
