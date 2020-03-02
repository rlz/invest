import React from 'react';
import { Operation } from './api/common';
import { FigiMap, loadInstruments } from './api/instruments';
import { loadOps } from './api/operations';
import './App.css';
import { Stats } from './stats/stats';

interface State {
  instrumentsMap?: FigiMap;
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
        {this.renderOps()}
      </div>
    );
  }

  renderInstruments (): JSX.Element | undefined {
    const { instrumentsMap: figiMap, ops } = this.state;

    if (!figiMap || !ops) {
      return;
    }

    const stats = new Stats(figiMap, ops);
    const quantities = stats.apply(new Date());

    return (
      <div className='cApp-instruments'>
        RUB: {quantities.rub}
        {stats.allInstruments().map(i => <div key={i.figi}>{i.name}, {i.figi}, {quantities[i.figi]}</div>)}
      </div>
    );
  }

  renderOps (): JSX.Element | undefined {
    const ops = this.state.ops;

    if (ops === undefined) {
      return;
    }

    return (
      <div className='cApp-ops'>
        {ops.map((o, i) => <div key={i}><pre>{JSON.stringify(o, undefined, 2)}</pre></div>)}
      </div>
    );
  }
}

export default App;
