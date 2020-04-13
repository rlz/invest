import { deepCopy } from 'deep-copy-ts';
import { Candle, findPrice, lastPrice } from '../api/candles';
import { Operation } from '../api/common';
import { Instrument, InstrumentsMap } from '../api/instruments';
import { opQuantity } from '../tools/operations';
import { InstrumentState } from './instrumentState';

const NoFigiOps = new Set(["PayIn", "Tax", "TaxBack", "PayOut", "MarginCommission"]);
export const EUR_FIGI = "BBG0013HJJ31";
export const USD_FIGI = "BBG0013HGFT4";

export interface DayStats {
  date: Date;

  // what in pocket on the date
  rub: number;
  usd: number;
  eur: number;
  portfolio: {
    [figi: string]: InstrumentState;
  };

  // market cost
  usdPrice: number;
  eurPrice: number;

  // in/out ops all time
  ownRub: number;
  ownUsd: number;
  ownEur: number;

  ops: Operation[];
}

function startDay (date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function nextDay (date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  return d;
}

export class Stats {
  private instrumentsMap: InstrumentsMap
  private ops: Operation[]
  private candles: { [figi: string]: Candle[] }

  constructor(figiMap: InstrumentsMap, ops: Operation[], candles: { [figi: string]: Candle[] }) {
    this.instrumentsMap = figiMap;
    this.ops = ops;
    this.candles = candles;
  }

  usdPrice (): number {
    return lastPrice(this.candles[USD_FIGI]);
  }

  eurPrice (): number {
    return lastPrice(this.candles[EUR_FIGI]);
  }

  allInstruments (): Instrument[] {
    const figi = new Map<string, Instrument>();
    for (const op of this.ops) {
      if (NoFigiOps.has(op.operationType)) {
        continue;
      }

      if (op.figi === undefined) {
        console.log("Weird op figi", op);
        continue;
      }

      if (op.figi === USD_FIGI || op.figi === EUR_FIGI) continue;

      if (!figi.has(op.figi)) {
        const i = this.instrumentsMap[op.figi];

        if (i === undefined) {
          console.log("Unknown op figi", op);
          continue;
        }

        figi.set(op.figi, i);
      }
    }

    return [...figi.values()];
  }

  timeline (): DayStats[] {
    const dayStats: DayStats[] = [];

    const stats: Omit<DayStats, "date" | "portfolio" | "instrumentsCosts" | "ops" | "usdPrice" | "eurPrice"> = {
      rub: 0,
      usd: 0,
      eur: 0,

      ownRub: 0,
      ownUsd: 0,
      ownEur: 0,
    };

    const portfolio: {
      [figi: string]: InstrumentState;
    } = {};

    let opIndex = 0;

    for (let d = startDay(new Date(this.ops[0].date)); d < nextDay(new Date()); d = nextDay(d)) {
      const nd = nextDay(d);

      const ops: Operation[] = [];

      while (true) {
        const op = this.ops[opIndex];

        if (op === undefined || new Date(op.date) >= nd) {
          break;
        }

        opIndex++;

        if (op.status !== "Done") {
          continue;
        }

        stats[op.currency.toLowerCase() as "rub" | "usd" | "eur"] += op.payment;

        const { figi } = op;
        const quantity = opQuantity(op);

        if (op.operationType === "Buy" || op.operationType === "BuyCard") {
          if (figi === undefined) {
            throw Error("undefined in op figi");
          }

          if (quantity === undefined) {
            throw Error("undefined in op quantity");
          }

          if (figi === USD_FIGI) {
            stats.usd += quantity;
          } else if (figi === EUR_FIGI) {
            stats.eur += quantity;
          } else if (portfolio[figi] === undefined) {
            const currency = this.instrumentsMap[figi]?.currency;

            if (currency === undefined) throw Error("Unknown instrument");

            portfolio[figi] = {
              figi,
              amount: quantity,
              price: -1,
              currency,
              ops: [op]
            };
          } else {
            portfolio[figi].amount += quantity;
            portfolio[figi].ops.push(op);
          }
        }

        if (op.operationType === "Sell") {
          if (figi === undefined) {
            throw Error("undefined in op figi");
          }

          if (quantity === undefined) {
            throw Error("undefined in op quantity");
          }

          if (figi === USD_FIGI) {
            stats.usd -= quantity;
          } else if (figi === EUR_FIGI) {
            stats.eur -= quantity;
          } else if (portfolio[figi] === undefined) {
            const currency = this.instrumentsMap[figi]?.currency;

            if (currency === undefined) throw Error("Unknown instrument");

            portfolio[figi] = {
              figi,
              amount: -quantity,
              price: -1,
              currency,
              ops: [op]
            };
          } else {
            portfolio[figi].amount -= quantity;
            portfolio[figi].ops.push(op);
          }
        }

        if (op.operationType === "PayIn" || op.operationType === "PayOut") {
          if (op.currency === "RUB") {
            stats.ownRub += op.payment;
          } else if (op.currency === "USD") {
            stats.ownUsd += op.payment;
          } else {
            stats.ownEur += op.payment;
          }
        }

        if (op.operationType === "Dividend") {
          if (figi === undefined) {
            throw Error("undefined in op figi");
          }

          portfolio[figi].ops.push(op);
        }

        ops.push(op);
      }

      for (const i of Object.values(portfolio)) {
        const candles = this.candles[i.figi];
        const price = findPrice(candles, nd);

        if (price === undefined) {
          console.log(i, candles, nextDay);
          throw Error("Can't find price");
        }

        i.price = price;
      }

      const usdPrice = findPrice(this.candles[USD_FIGI], nd);
      if (usdPrice === undefined) throw Error("Can't find USD price");
      const eurPrice = findPrice(this.candles[EUR_FIGI], nd);
      if (eurPrice === undefined) throw Error("Can't find EUR price");

      dayStats.push({
        ...stats,
        date: d,
        portfolio: deepCopy(portfolio),
        ops,
        usdPrice,
        eurPrice
      });
    }

    return dayStats;
  }
}

