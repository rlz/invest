import { Currency } from '../api/common';

export function toRub (currency: Currency, amount: number, usdCost: number, eurCost: number): number {
  if (currency === "RUB") {
    return amount;
  }

  if (currency === "USD") {
    return amount * usdCost;
  }

  if (currency === "EUR") {
    return amount * eurCost;
  }

  throw Error("Unknown currency");
}

export function toUsd (currency: Currency, amount: number, usdCost: number, eurCost: number): number {
  if (currency === "RUB") {
    return amount / usdCost;
  }

  if (currency === "USD") {
    return amount;
  }

  if (currency === "EUR") {
    return (amount * eurCost) / usdCost;
  }

  throw Error("Unknown currency");
}

export function toEur (currency: Currency, amount: number, usdCost: number, eurCost: number): number {
  if (currency === "RUB") {
    return amount / eurCost;
  }

  if (currency === "USD") {
    return (amount * usdCost) / eurCost;
  }

  if (currency === "EUR") {
    return amount;
  }

  throw Error("Unknown currency");
}

export class CurrenciesCalc {
  private usdCost: number
  private eurCost: number

  private rubTotal = 0

  constructor(usdCost: number, eurCost: number) {
    this.usdCost = usdCost;
    this.eurCost = eurCost;
  }

  add (currency: Currency, amount: number): void {
    if (currency === "RUB") this.rubTotal += amount;
    if (currency === "USD") this.rubTotal += amount * this.usdCost;
    if (currency === "EUR") this.rubTotal += amount * this.eurCost;
  }

  addRub (amount: number): void {
    this.rubTotal += amount;
  }

  addUsd (amount: number): void {
    this.rubTotal += amount * this.usdCost;
  }

  addEur (amount: number): void {
    this.rubTotal += amount * this.eurCost;
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
}
