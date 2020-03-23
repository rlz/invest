import { Currency, Operation } from '../api/common';

export interface InstrumentState {
  figi: string;
  amount: number;
  currency: Currency;
  price: number;
  ops: Operation[];
}
