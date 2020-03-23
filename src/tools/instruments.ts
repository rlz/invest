import { InstrumentsMap } from "../api/instruments";
import { InstrumentState } from "../stats/instrumentState";
import { toRub } from "./currencies";

export function sortInstruments (
  states: { [figi: string]: InstrumentState },
  infos: InstrumentsMap,
  usdPrice: number,
  eurPrice: number
): InstrumentState[] {
  return Object.values(states)
    .sort((a, b) => {
      const c = (
        Math.abs(toRub(b.currency, b.amount * b.price, usdPrice, eurPrice))
        - Math.abs(toRub(a.currency, a.amount * a.price, usdPrice, eurPrice))
      );
      if (c !== 0) return c;
      const aTicker = infos[a.figi]?.ticker;
      const bTicker = infos[b.figi]?.ticker;
      if (aTicker === undefined || bTicker === undefined) {
        throw Error("Unknown instruments");
      }
      return aTicker.localeCompare(bTicker);
    });
}
