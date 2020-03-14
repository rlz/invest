import { InstrumentState } from "./instrumentState";

export class Portfolio {
  rub = 0;
  usd = 0;
  eur = 0;

  ownRub = 0;
  ownUsd = 0;
  ownEur = 0;

  usdCost = 0;
  eurCost = 0;

  instruments: {
    [figi: string]: InstrumentState;
  } = {};

  totalRub (): number {
    return this.rub + this.usdCost * this.usd + this.eurCost * this.eur;
  }

  totalUsd (): number {
    return this.usd + this.rub / this.usdCost + this.eurCost * this.eur / this.usdCost;
  }

  totalEur (): number {
    return this.eur + this.rub / this.eurCost + this.usdCost * this.usd / this.eurCost;
  }

  totalOwnRub (): number {
    return this.ownRub + this.usdCost * this.ownUsd + this.eurCost * this.ownEur;
  }

  totalOwnUsd (): number {
    return this.ownUsd + this.ownRub / this.usdCost + this.eurCost * this.ownEur / this.usdCost;
  }

  totalOwnEur (): number {
    return this.ownEur + this.ownRub / this.eurCost + this.usdCost * this.ownUsd / this.eurCost;
  }
}