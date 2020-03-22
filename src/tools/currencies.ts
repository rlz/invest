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

export class CurrenciesCalc {
  private usdCost: number
  private eurCost: number

  private rubTotal = 0

  constructor(usdPrice: number, eurPrice: number) {
    this.usdCost = usdPrice;
    this.eurCost = eurPrice;
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
