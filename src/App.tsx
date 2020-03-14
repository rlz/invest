import React from 'react';
import { Candle, loadCandles } from './api/candles';
import { Operation } from './api/common';
import { InstrumentsMap, loadInstruments } from './api/instruments';
import { loadOps } from './api/operations';
import './App.scss';
import { InstrumentState } from './stats/instrumentState';
import { DayStats, EUR_FIGI, Stats, USD_FIGI } from './stats/stats';
import { Cur, Eur, Rub, Usd } from './widgets/spans';
import { Tabs } from './widgets/tabs';

interface State {
  instrumentsMap?: InstrumentsMap;
  ops?: Operation[];
  candles?: { [figi: string]: Candle[] };

  expandedDays: ReadonlySet<string>;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      expandedDays: new Set()
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

    return (
      <div className='cApp'>
        <Tabs activeTab={0} onTabClick={(): void => { return; }} />
        <div className='cApp-body'>
          <h1>Полная стоимость портфеля</h1>
          <div className='cApp-full-cost'>
            <Rub v={-1} />
            <Usd v={-1} />
            <Eur v={-1} />
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
          <div className='cApp-inst'>
            <h2>Инструменты</h2>
            {this.renderPortfolio()}
          </div>
          {/* {this.renderDays()} */}
          {/* {this.renderOps()} */}
        </div>
      </div>
    );
  }

  renderPortfolio (): JSX.Element | undefined {
    const { instrumentsMap, ops, candles } = this.state;

    if (!instrumentsMap || !ops || !candles) {
      return;
    }

    const stats = new Stats(instrumentsMap, ops, candles);
    const portfolio = stats.portfolio();

    return (
      <div className='cApp-portfolio'>
        {Object.values(portfolio.instruments).map(i => this.renderInstrument(i))}
      </div>
    );
  }

  renderInstrument (i: InstrumentState): JSX.Element | undefined {
    const { instrumentsMap } = this.state;

    if (!instrumentsMap) {
      return;
    }
    const name = instrumentsMap[i.figi]?.name;
    return (
      <div key={i.figi}>
        {name} <Cur t={i.currency} v={i.amount * i.cost} />{' '}
        ({i.amount}{'\xD7'}<Cur t={i.currency} v={i.cost} />)
      </div>
    );
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
