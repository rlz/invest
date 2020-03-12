import { API_TOKEN } from "./token";

export interface Candle {
  o: number;
  c: number;
  h: number;
  l: number;
  v: number;
  time: string;
  interval: string;
}

export async function loadCandles (figi: string, from: Date): Promise<Candle[]> {
  const urlParams = `figi=${figi}&from=${from.toISOString()}&to=${new Date().toISOString()}&interval=day`;
  const resp = await fetch(
    `https://api-invest.tinkoff.ru/openapi/market/candles?${urlParams}`,
    {
      headers: {
        accept: 'application/json',
        Authorization:
          `Bearer ${API_TOKEN}`
      }
    }
  );
  const data = await resp.json();
  return data.payload.candles;
}

export function findCandleIndex (candles: Candle[], date: Date): number | undefined {
  if (candles.length === 0) return;

  let low = 0;
  let high = candles.length - 1;

  if (date < new Date(candles[low].time))
    return;
  if (new Date(candles[high].time) <= date) return high;

  while (true) {
    if (high - low < 2) return low;
    const middle = low + ((high - low) / 2 | 0);
    const middleDate = new Date(candles[middle].time);
    if (middleDate < date) {
      low = middle;
    } else if (middleDate > date) {
      high = middle;
    } else {
      return middle;
    }
  }
}

export function findPrice (candles: Candle[], date: Date): number | undefined {
  const index = findCandleIndex(candles, date);
  if (index === undefined) {
    return;
  }
  return candles[index].c;
}
