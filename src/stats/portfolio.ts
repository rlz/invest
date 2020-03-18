import { InstrumentState } from "./instrumentState";

export class Portfolio {
  rub = 0;
  usd = 0;
  eur = 0;

  ownRub = 0;
  ownUsd = 0;
  ownEur = 0;

  usdPrice = 0;
  eurPrice = 0;

  instruments: {
    [figi: string]: InstrumentState;
  } = {};

  totalRub (): number {
    return this.rub + this.usdPrice * this.usd + this.eurPrice * this.eur;
  }

  totalUsd (): number {
    return this.usd + this.rub / this.usdPrice + this.eurPrice * this.eur / this.usdPrice;
  }

  totalEur (): number {
    return this.eur + this.rub / this.eurPrice + this.usdPrice * this.usd / this.eurPrice;
  }

  totalOwnRub (): number {
    return this.ownRub + this.usdPrice * this.ownUsd + this.eurPrice * this.ownEur;
  }

  totalOwnUsd (): number {
    return this.ownUsd + this.ownRub / this.usdPrice + this.eurPrice * this.ownEur / this.usdPrice;
  }

  totalOwnEur (): number {
    return this.ownEur + this.ownRub / this.eurPrice + this.usdPrice * this.ownUsd / this.eurPrice;
  }
}