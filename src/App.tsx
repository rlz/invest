import React from 'react';
import { Operation } from './api/common';
import { InstrumentsMap, loadInstruments } from './api/instruments';
import { loadOps } from './api/operations';
import './App.css';
import { DayStats, Stats } from './stats/stats';

interface State {
  instrumentsMap?: InstrumentsMap;
  ops?: Operation[];
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  async componentDidMount (): Promise<void> {
    const instrumentsMap = await loadInstruments();
    const ops = await loadOps();
    this.setState({ instrumentsMap, ops });
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
    const quantities = stats.apply(new Date());

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
    const dayStats = stats.days();

    return (
      <div>
        {dayStats.map(s => this.renderDayStats(s))}
      </div>
    );
  }

  renderDayStats (dayStats: DayStats): JSX.Element {
    return (
      <div>
        <div>{dayStats.date.toDateString()} | RUB: {dayStats.rub}, USD: {dayStats.usd}, EUR: {dayStats.eur}</div>
        <div>{dayStats.ops.map((op, i) => <div key={i}>{JSON.stringify(op)}</div>)}</div>
      </div>
    );
  }
}

export default App;
