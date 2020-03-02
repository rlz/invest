import { InstrumentType, OkResponse } from './common';
import { API_TOKEN } from './token';

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
  currency?: string;
  name: string;
  type: InstrumentType;
}

export interface FigiMap {
  [figi: string]: Instrument | undefined;
}

async function load (type: string) {
  const resp = await fetch(`https://api-invest.tinkoff.ru/openapi/market/${type}`, {
    headers: {
      accept: 'application/json',
      Authorization:
        `Bearer ${API_TOKEN}`
    }
  })
  const data = await resp.json() as StocksResponse
  return data.payload.instruments
}

export async function loadInstruments (): Promise<FigiMap> {
  const stocks = load("stocks")
  const bonds = load("bonds")
  const etfs = load("etfs")
  const currencies = load("currencies")

  const instruments = (await Promise.all([stocks, bonds, etfs, currencies])).flat()

  const m: FigiMap = {}
  instruments.forEach(i => {
    m[i.figi] = i
  })
  return m
}
