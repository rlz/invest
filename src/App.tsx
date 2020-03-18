import { DateTime } from 'luxon';
import React from 'react';
import { Candle, loadCandles } from './api/candles';
import { Operation } from './api/common';
import { InstrumentsMap, loadInstruments } from './api/instruments';
import { loadOps } from './api/operations';
import './App.scss';
import { InstrumentState } from './stats/instrumentState';
import { DayStats, EUR_FIGI, Stats, USD_FIGI } from './stats/stats';
import { CurrenciesCalc, toEur, toRub, toUsd } from './tools/currencies';
import { Cur, Eur, Rub, Usd } from './widgets/spans';
import { Tabs } from './widgets/tabs';

interface State {
  instrumentsMap?: InstrumentsMap;
  ops?: Operation[];
  candles?: { [figi: string]: Candle[] };

  expandedDays: ReadonlySet<string>;
  expandedInstruments: ReadonlySet<string>;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      expandedDays: new Set(),
      expandedInstruments: new Set()
    };
  }

  async componentDidMount (): Promise<void> {
    const instrumentsMap = await loadInstruments();
    const ops = await loadOps();
    const stats = new Stats(instrumentsMap, ops, {});
    const candles: { [figi: string]: Candle[] } = {};
    const cPromises: Promise<void>[] = [];

    for (const i of stats.allInstruments()) {
      if (i.figi === USD_FIGI || i.figi === EUR_FIGI) continue;

      cPromises.push((async (): Promise<void> => {
        const c = await loadCandles(i.figi, new Date(ops[0].date));
        candles[i.figi] = c;
      })());
    }

    cPromises.push((async (): Promise<void> => {
      const c = await loadCandles(USD_FIGI, new Date(ops[0].date));
      candles[USD_FIGI] = c;
    })());

    cPromises.push((async (): Promise<void> => {
      const c = await loadCandles(EUR_FIGI, new Date(ops[0].date));
      candles[EUR_FIGI] = c;
    })());

    await Promise.all(cPromises);

    this.setState({ instrumentsMap, ops, candles });
  }

  render (): JSX.Element {
    const { instrumentsMap, ops, candles } = this.state;

    if (!instrumentsMap || !ops || !candles) {
      return (
        <div className='cApp'>
          <Tabs activeTab={0} onTabClick={(): void => { return; }} />
          <div className='cApp-body' />
        </div>
      );
    }

    const stats = new Stats(instrumentsMap, ops, candles);
    const portfolio = stats.portfolio();

    const totalPortfolioCost = new CurrenciesCalc(portfolio.usdCost, portfolio.eurCost);
    totalPortfolioCost.addRub(portfolio.totalRub());
    for (const i of Object.values(portfolio.instruments)) {
      totalPortfolioCost.add(i.currency, i.amount * i.cost);
    }

    return (
      <div className='cApp'>
        <Tabs activeTab={0} onTabClick={(): void => { return; }} />
        <div className='cApp-body'>
          <h1>Полная стоимость портфеля</h1>
          <div className='cApp-full-cost'>
            <Rub v={totalPortfolioCost.rub()} />
            <Usd v={totalPortfolioCost.usd()} />
            <Eur v={totalPortfolioCost.eur()} />
            <span className='cApp-pc'>{((totalPortfolioCost.rub() - portfolio.totalOwnRub()) / totalPortfolioCost.rub() * 100).toFixed(2)}%</span>
          </div>
          <div className='cApp-own cApp-row'>
            <div>
              <h2>Собственные средства</h2>
              <div>
                <Rub v={portfolio.ownRub} /> <Usd v={portfolio.ownUsd} /> <Eur v={portfolio.ownEur} />
              </div>
            </div>
            <div>
              <h2>Итого</h2>
              <div>
                <Rub v={portfolio.totalOwnRub()} />{' '}
                <Usd v={portfolio.totalOwnUsd()} />{' '}
                <Eur v={portfolio.totalOwnEur()} />
              </div>
            </div>
          </div>
          <div className='cApp-avail cApp-row'>
            <div>
              <h2>Доступно</h2>
              <div>
                <Rub v={portfolio.rub} /> <Usd v={portfolio.usd} /> <Eur v={portfolio.eur} />
              </div>
            </div>
            <div>
              <h2>Итого</h2>
              <div>
                <Rub v={portfolio.totalRub()} /> <Usd v={portfolio.totalUsd()} /> <Eur v={portfolio.totalEur()} />
              </div>
            </div>
          </div>
          <div className='cApp-insts'>
            <h2>Инструменты</h2>
            <div className='cApp-portfolio'>
              {Object.values(portfolio.instruments)
                .sort((a, b) => {
                  const c = (
                    toRub(b.currency, b.amount * b.cost, portfolio.usdCost, portfolio.eurCost)
                    - toRub(a.currency, a.amount * a.cost, portfolio.usdCost, portfolio.eurCost)
                  );
                  if (c !== 0) return c;
                  const aTicker = instrumentsMap[a.figi]?.ticker;
                  const bTicker = instrumentsMap[b.figi]?.ticker;
                  if (aTicker === undefined || bTicker === undefined) {
                    throw Error("Unknown instruments");
                  }
                  return aTicker.localeCompare(bTicker);
                })
                .map(i => this.renderInstrument(i, portfolio.usdCost, portfolio.eurCost))}
            </div>
          </div>
        </div>
        <div className='cApp-footer'>
          USD: <Rub v={portfolio.usdCost} /> EUR: <Rub v={portfolio.eurCost} />
        </div>
      </div>
    );
  }

  renderInstrument (i: InstrumentState, usdCost: number, eurCost: number): JSX.Element[] {
    const { instrumentsMap } = this.state;

    if (!instrumentsMap) throw Error("No instruments map loaded!");
    const instrumentInfo = instrumentsMap[i.figi];
    if (instrumentInfo === undefined) throw Error("Unknown instrument");

    let effect = 0;

    for (const op of i.ops) {
      if (op.operationType.startsWith("Buy")) {
        effect -= op.price * op.quantity;
      } else if (op.operationType === "Sell") {
        effect += op.price * op.quantity;
      } else if (op.operationType === "Dividend") {
        effect += op.payment;
      }
    }

    effect += i.amount * i.cost;

    const result = [
      <div key={i.figi} className='cApp-inst cApp-row'>
        <div className='cApp-inst-1'>
          <div
            className='cApp-inst-name'
            onClick={(): void => {
              if (this.state.expandedInstruments.has(i.figi)) {
                const ei = new Set(this.state.expandedInstruments);
                ei.delete(i.figi);
                this.setState({ expandedInstruments: ei });
              } else {
                const ei = new Set(this.state.expandedInstruments);
                ei.add(i.figi);
                this.setState({ expandedInstruments: ei });
              }
            }}
          >
            {instrumentInfo.name}
          </div>
          <div>
            {i.amount} {'\xD7'} <Cur t={i.currency} v={i.cost} /> = <Cur t={i.currency} v={i.amount * i.cost} />
          </div>
        </div>
        <div>
          <Rub v={toRub(i.currency, i.cost * i.amount, usdCost, eurCost)} />
          <Usd v={toUsd(i.currency, i.cost * i.amount, usdCost, eurCost)} />
          <Eur v={toEur(i.currency, i.cost * i.amount, usdCost, eurCost)} />
        </div>
      </div>,
      <div key={i.figi + "-sl"} className='cApp-inst-sl cApp-row'>
        <div className='cApp-ticker-line'>
          <div className='cApp-ticker'>
            {instrumentInfo.ticker}
          </div>
          <div>
            <Cur t={i.currency} v={effect} />
          </div>
        </div>
        <div>ggg</div>
      </div>
    ];

    if (this.state.expandedInstruments.has(i.figi)) {
      const ops = i.ops.reverse();
      result.push(
        <div className='cApp-inst-ops'>
          {ops.map(op => this.renderOperation(i, op))}
        </div>
      );
    }

    return result;
  }

  renderOperation (i: InstrumentState, op: Operation): JSX.Element {
    if (op.operationType === "Buy" || op.operationType === "BuyCard") {
      return (
        <div className='cApp-op'>
          {DateTime.fromISO(op.date).toISODate()}{' '}
          Покупка{' '}
          {op.quantity} {'\xD7'} <Cur t={op.currency} v={op.price} />{' '}
          = <Cur t={op.currency} v={op.quantity * op.price} />
        </div>
      );
    }

    if (op.operationType === "Sell") {
      return (
        <div className='cApp-op'>
          {DateTime.fromISO(op.date).toISODate()}{' '}
          Продажа{' '}
          {op.quantity} {'\xD7'} <Cur t={op.currency} v={op.price} />{' '}
          = <Cur t={op.currency} v={op.quantity * op.price} />
        </div>
      );
    }

    if (op.operationType === "Dividend") {
      return (
        <div className='cApp-op'>
          {DateTime.fromISO(op.date).toISODate()} Dividend <Cur t={op.currency} v={op.payment} />
        </div>
      );
    }

    throw Error("Unexpected operationType");
  }

  renderDays (): JSX.Element | undefined {
    const { instrumentsMap, ops, candles } = this.state;

    if (!instrumentsMap || !ops || !candles) {
      return;
    }

    const stats = new Stats(instrumentsMap, ops, candles);
    const dayStats = stats.timeline();

    return (
      <div>
        {dayStats.map(s => this.renderDayStats(s))}
      </div>
    );
  }

  renderDayStats (dayStats: DayStats): JSX.Element {
    const expanded = this.state.expandedDays.has(dayStats.date.toISOString()) ? " expanded" : "";
    // console.log("E", this.state.expandedDays, dayStats.date, this.state.expandedDays.has(dayStats.date));
    return (
      <div>
        <div className='cApp-day'>
          {dayStats.date.toDateString()} |
          RUB: {dayStats.rub.toFixed(2)}, USD: {dayStats.usd.toFixed(2)}, EUR: {dayStats.eur.toFixed(2)}<br />
          OwnRUB: {dayStats.ownRub.toFixed(2)}, OwnUSD: {dayStats.ownUsd.toFixed(2)}, OwnEUR: {dayStats.ownEur.toFixed(2)}<br />
        </div>
        <div
          className={'cApp-ops-expander' + expanded}
          onClick={(): void => this.flipExpandedDay(dayStats.date)}
        >{dayStats.ops.length} operations
        </div>
        <div className={'cApp-ops' + expanded}>{dayStats.ops.map((op, i) => <div key={i}>{JSON.stringify(op)}</div>)}</div>
      </div>
    );
  }

  flipExpandedDay (date: Date): void {
    const ed = new Set(this.state.expandedDays);
    if (ed.has(date.toISOString())) {
      ed.delete(date.toISOString());
    } else {
      ed.add(date.toISOString());
    }
    this.setState({ expandedDays: ed });
  }
}

export default App;
