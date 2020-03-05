import { Operation } from '../api/common';
import { Instrument, InstrumentsMap } from '../api/instruments';

const NoFigiOps = new Set(["PayIn", "Tax", "TaxBack", "PayOut"]);
const EUR_FIGI = "BBG0013HJJ31";
const USD_FIGI = "BBG0013HGFT4";
const CURRENCY_TO_FIGI = {
  "RUB": "rub",
  "EUR": EUR_FIGI,
  "USD": USD_FIGI
};


export interface DayStats {
  date: Date;

  rub: number;
  usd: number;
  eur: number;
  portfolio: {
    [figi: string]: number;
  };

  usdCost: number;
  eurCost: number;

  instrumentsCosts: {
    [figi: string]: number;
  };

  inRub: number;
  inUsd: number;
  inEur: number;

  outRub: number;
  outUsd: number;
  outEur: number;

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
  private figiMap: InstrumentsMap
  private ops: Operation[]

  constructor(figiMap: InstrumentsMap, ops: Operation[]) {
    this.figiMap = figiMap;
    this.ops = ops;
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
        const i = this.figiMap[op.figi];

        if (i === undefined) {
          console.log("Unknown op figi", op);
          continue;
        }

        figi.set(op.figi, i);
      }
    }

    return [...figi.values()];
  }

  days (): DayStats[] {
    const dayStats: DayStats[] = [];

    const stats: DayStats = {
      date: new Date(),

      rub: 0,
      usd: 0,
      eur: 0,
      portfolio: {
      },

      usdCost: 0,
      eurCost: 0,

      instrumentsCosts: {},

      inRub: 0,
      inUsd: 0,
      inEur: 0,

      outRub: 0,
      outUsd: 0,
      outEur: 0,

      ops: []
    };

    const portfolio: {
      [figi: string]: number;
    } = {};
    const instrumentsCost: {
      [figi: string]: number;
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
            portfolio[figi] = quantity;
          } else {
            portfolio[figi] += quantity;
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
            portfolio[figi] -= quantity;
          }
        }

        ops.push(op);
      }

      dayStats.push({
        ...stats,
        date: d,
        portfolio: { ...portfolio },
        instrumentsCosts: { ...instrumentsCost },
        ops
      });
    }

    return dayStats;
  }

  apply (date: Date): { [figi: string]: number } {
    const result: {
      [figi: string]: number;
      rub: number;
    } = {
      rub: 0
    };
    result[USD_FIGI] = 0;
    result[EUR_FIGI] = 0;

    for (const op of this.ops) {
      if (new Date(op.date) > date) {
        break;
      }

      if (op.status !== "Done") {
        continue;
      }

      result[CURRENCY_TO_FIGI[op.currency]] += op.payment;

      const { figi, quantity } = op;

      if (op.operationType === "Buy" || op.operationType === "BuyCard") {
        if (figi === undefined) {
          throw Error("undefined in op figi");
        }

        if (result[figi] === undefined) {
          result[figi] = quantity;
        } else {
          result[figi] += quantity;
        }
      }

      if (op.operationType === "Sell") {
        if (figi === undefined) {
          throw Error("undefined in op figi");
        }

        result[figi] -= quantity;
      }
    }

    return result;
  }
}

