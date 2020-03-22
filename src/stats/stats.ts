import { Candle, lastPrice } from '../api/candles';
import { Operation } from '../api/common';
import { Instrument, InstrumentsMap } from '../api/instruments';
import { InstrumentState } from './instrumentState';
import { Portfolio } from './portfolio';

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
  usdCost: number;
  eurCost: number;

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

      if (typeof op.figi !== "string") {
        console.log("Weird op figi", op);
        continue;
      }

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

    const stats: Omit<DayStats, "date" | "portfolio" | "instrumentsCosts" | "ops"> = {
      rub: 0,
      usd: 0,
      eur: 0,

      usdCost: 0,
      eurCost: 0,

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

        const { figi, quantity } = op;

        if (op.operationType === "Buy" || op.operationType === "BuyCard") {
          if (figi === undefined) {
            throw Error("undefined in op figi");
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
              cost: -1,
              currency,
              ops: []
            };
          } else {
            portfolio[figi].amount += quantity;
          }
        }

        if (op.operationType === "Sell") {
          if (figi === undefined) {
            throw Error("undefined in op figi");
          }

          if (figi === USD_FIGI) {
            stats.usd -= quantity;
          } else if (figi === EUR_FIGI) {
            stats.eur -= quantity;
          } else {
            portfolio[figi].amount -= quantity;
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

        ops.push(op);
      }

      dayStats.push({
        ...stats,
        date: d,
        portfolio,
        ops
      });
    }

    return dayStats;
  }

  portfolio (): Portfolio {
    const result = new Portfolio();

    for (const op of this.ops) {
      if (op.status !== "Done") {
        continue;
      }

      if (op.currency === "RUB") {
        result.rub += op.payment;
      } else if (op.currency === "USD") {
        result.usd += op.payment;
      } else if (op.currency === "EUR") {
        result.eur += op.payment;
      }

      const { figi, quantity } = op;

      if (op.operationType === "Buy" || op.operationType === "BuyCard") {
        if (figi === undefined) {
          throw Error("undefined in op figi");
        }

        if (figi === USD_FIGI) {
          result.usd += quantity;
        } else if (figi === EUR_FIGI) {
          result.eur += quantity;
        } else if (result.instruments[figi] === undefined) {
          const currency = this.instrumentsMap[figi]?.currency;

          if (currency === undefined) throw Error("Unknown instrument");

          result.instruments[figi] = {
            figi,
            amount: quantity,
            cost: -1,
            currency,
            ops: [op]
          };
        } else {
          result.instruments[figi].amount += quantity;
          result.instruments[figi].ops.push(op);
        }
      }

      if (op.operationType === "Sell") {
        if (figi === undefined) {
          throw Error("undefined in op figi");
        }

        if (figi === USD_FIGI) {
          result.usd -= quantity;
        } else if (figi === EUR_FIGI) {
          result.eur -= quantity;
        } else if (result.instruments[figi] === undefined) {
          const currency = this.instrumentsMap[figi]?.currency;

          if (currency === undefined) throw Error("Unknown instrument");

          result.instruments[figi] = {
            figi,
            amount: -quantity,
            cost: -1,
            currency,
            ops: [op]
          };
        } else {
          result.instruments[figi].amount -= quantity;
          result.instruments[figi].ops.push(op);
        }
      }

      if (op.operationType === "PayIn" || op.operationType === "PayOut") {
        if (op.currency === "RUB") {
          result.ownRub += op.payment;
        } else if (op.currency === "USD") {
          result.ownUsd += op.payment;
        } else {
          result.ownEur += op.payment;
        }
      }

      if (op.operationType === "Dividend") {
        if (figi === undefined) {
          throw Error("undefined in op figi");
        }

        result.instruments[figi].ops.push(op);
      }
    }

    for (const i of Object.values(result.instruments)) {
      i.cost = lastPrice(this.candles[i.figi]);
    }

    result.usdPrice = lastPrice(this.candles[USD_FIGI]);
    result.eurPrice = lastPrice(this.candles[EUR_FIGI]);

    return result;
  }
}

