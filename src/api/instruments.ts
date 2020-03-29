import { Currency, InstrumentType, OkResponse } from './common';
import { apiToken } from './token';

interface StocksResponse extends OkResponse {
  payload: {
    instruments: Instrument[];
    total: number;
  };
}

export interface Instrument {
  figi: string;
  ticker: string;
  isin?: string;
  minPriceIncrement?: number;
  lot?: number;
  currency?: Currency;
  name: string;
  type: InstrumentType;
}

export interface InstrumentsMap {
  [figi: string]: Instrument | undefined;
}

async function load (type: string): Promise<Instrument[]> {
  const resp = await fetch(`https://api-invest.tinkoff.ru/openapi/market/${type}`, {
    headers: {
      accept: 'application/json',
      Authorization:
        `Bearer ${apiToken()}`
    }
  });
  const data = await resp.json() as StocksResponse;
  return data.payload.instruments;
}

export async function loadInstruments (): Promise<InstrumentsMap> {
  const stocksCall = load("stocks");
  const bondsCall = load("bonds");
  const etfsCall = load("etfs");
  const currenciesCall = load("currencies");

  const stocks = await stocksCall;
  const bonds = await bondsCall;
  const etfs = await etfsCall;
  const currencies = await currenciesCall;

  // fixes of returning values
  const instruments = [
    ...stocks,
    ...bonds.map(b => { b.type = "Bond"; return b; }),
    ...etfs.map(i => { i.type = "Etf"; return i; }),
    ...currencies.map(i => { i.type = "Currency"; return i; }),
  ];

  const m: InstrumentsMap = {};
  instruments.forEach(i => {
    m[i.figi] = i;
  });
  return m;
}
