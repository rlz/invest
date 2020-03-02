import { Operation } from '../api/common';
import { FigiMap, Instrument } from '../api/instruments';

const NoFigiOps = new Set(["PayIn", "Tax", "TaxBack", "PayOut"]);
const EUR_FIGI = "BBG0013HJJ31";
const USD_FIGI = "BBG0013HGFT4";
const CURRENCY_TO_FIGI = {
  "RUB": "rub",
  "EUR": EUR_FIGI,
  "USD": USD_FIGI
};

export class Stats {
  private figiMap: FigiMap
  private ops: Operation[]

  constructor(figiMap: FigiMap, ops: Operation[]) {
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

      if (figi === "BBG0013HGFT4") {
        console.log(op.date, op.operationType, op.quantity, result[figi]);
      }

      if (op.currency === "USD") {
        console.log(op.date, op.operationType, op.payment, result[USD_FIGI]);
      }
    }

    return result;
  }
}