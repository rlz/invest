import React from 'react';
import { Candle, loadCandles } from './api/candles';
import { Operation } from './api/common';
import { InstrumentsMap, loadInstruments } from './api/instruments';
import { loadOps } from './api/operations';
import './App.scss';
import { DayStats, Stats } from './stats/stats';

interface State {
  instrumentsMap?: InstrumentsMap;
  ops?: Operation[];
  candles?: Map<string, Candle[]>;

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
    const stats = new Stats(instrumentsMap, ops);
    const candles = new Map<string, Candle[]>();
    const cPromises: Promise<void>[] = [];
    for (const i of stats.allInstruments()) {
      cPromises.push((async (): Promise<void> => {
        const c = await loadCandles(i.figi, new Date(ops[0].date));
        candles.set(i.figi, c);
      })());
    }
    await Promise.all(cPromises);
    this.setState({ instrumentsMap, ops, candles });
    console.log(candles);
  }

  render (): JSX.Element {
    return (
      <div className='cApp'>
        {this.renderInstruments()}
        {this.renderDays()}
        {/* {this.renderOps()} */}
      </div>
    );
  }

  renderInstruments (): JSX.Element | undefined {
    const { instrumentsMap, ops } = this.state;

    if (!instrumentsMap || !ops) {
      return;
    }

    const stats = new Stats(instrumentsMap, ops);
    const quantities = stats.portfolio();

    return (
      <div className='cApp-instruments'>
        RUB: {quantities.rub}
        {stats.allInstruments().map(i => <div key={i.figi}>{i.name}, {i.figi}, {quantities[i.figi]}</div>)}
      </div>
    );
  }

  renderDays (): JSX.Element | undefined {
    const { instrumentsMap, ops } = this.state;

    if (!instrumentsMap || !ops) {
      return;
    }

    const stats = new Stats(instrumentsMap, ops);
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
