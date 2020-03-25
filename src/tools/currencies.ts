import { Currency } from '../api/common';

export function toRub (currency: Currency, amount: number, usdPrice: number, eurPrice: number): number {
  if (currency === "RUB") {
    return amount;
  }

  if (currency === "USD") {
    return amount * usdPrice;
  }

  if (currency === "EUR") {
    return amount * eurPrice;
  }

  throw Error("Unknown currency");
}

export function toUsd (currency: Currency, amount: number, usdPrice: number, eurPrice: number): number {
  if (currency === "RUB") {
    return amount / usdPrice;
  }

  if (currency === "USD") {
    return amount;
  }

  if (currency === "EUR") {
    return (amount * eurPrice) / usdPrice;
  }

  throw Error("Unknown currency");
}

export function toEur (currency: Currency, amount: number, usdPrice: number, eurPrice: number): number {
  if (currency === "RUB") {
    return amount / eurPrice;
  }

  if (currency === "USD") {
    return (amount * usdPrice) / eurPrice;
  }

  if (currency === "EUR") {
    return amount;
  }

  throw Error("Unknown currency");
}

export function toCur (toCur: Currency, fromCur: Currency, amount: number, usdPrice: number, eurPrice: number): number {
  if (toCur === "RUB") return toRub(fromCur, amount, usdPrice, eurPrice);
  if (toCur === "USD") return toUsd(fromCur, amount, usdPrice, eurPrice);
  return toEur(fromCur, amount, usdPrice, eurPrice);
}

export class CurrenciesCalc {
  private usdCost: number
  private eurCost: number

  private rubTotal = 0

  constructor(usdPrice: number, eurPrice: number) {
    this.usdCost = usdPrice;
    this.eurCost = eurPrice;
  }

  add (currency: Currency, amount: number): CurrenciesCalc {
    if (currency === "RUB") this.rubTotal += amount;
    if (currency === "USD") this.rubTotal += amount * this.usdCost;
    if (currency === "EUR") this.rubTotal += amount * this.eurCost;
    return this;
  }

  addRub (amount: number): CurrenciesCalc {
    this.rubTotal += amount;
    return this;
  }

  addUsd (amount: number): CurrenciesCalc {
    this.rubTotal += amount * this.usdCost;
    return this;
  }

  addEur (amount: number): CurrenciesCalc {
    this.rubTotal += amount * this.eurCost;
    return this;
  }

  rub (): number {
    return this.rubTotal;
  }

  usd (): number {
    return this.rubTotal / this.usdCost;
  }

  eur (): number {
    return this.rubTotal / this.eurCost;
  }

  cur (c: Currency): number {
    if (c === "RUB") return this.rub();
    if (c === "USD") return this.usd();
    return this.eur();
  }
}
