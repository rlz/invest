import { DateTime } from 'luxon';
import React from 'react';
import { Candle, loadCandles } from './api/candles';
import { Operation } from './api/common';
import { InstrumentsMap, loadInstruments } from './api/instruments';
import { loadOps } from './api/operations';
import { apiToken, clearApiToken } from './api/token';
import './App.scss';
import { HistoryBlock } from './blocks/history';
import { LoginForm } from './blocks/loginForm';
import { PortfolioBlock } from './blocks/portfolio/portfolio';
import { TopPanelBlock } from './blocks/topPanel';
import { DayStats, EUR_FIGI, Stats, USD_FIGI } from './stats/stats';

interface State {
  instrumentsMap?: InstrumentsMap;
  ops?: Operation[];
  candles?: { [figi: string]: Candle[] };
  timeline?: DayStats[];
  loading: boolean;
  activeTab: "PF" | "TL";
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      loading: false,
      activeTab: "PF",
    };
  }

  async componentDidMount (): Promise<void> {
    this.loadData();
  }

  render (): JSX.Element {
    if (apiToken() === null) {
      return <LoginForm onLoggedIn={(): void => { this.loadData(); this.forceUpdate(); }} />;
    }

    const { instrumentsMap, timeline, activeTab } = this.state;

    let usdPrice: number | undefined = undefined;
    let eurPrice: number | undefined = undefined;

    if (timeline !== undefined && timeline.length > 0) {
      const lastDay = timeline[timeline.length - 1];
      usdPrice = lastDay.usdPrice;
      eurPrice = lastDay.eurPrice;
    }

    const topPanel = (
      <TopPanelBlock
        loading={this.state.loading}
        activeTab={activeTab}
        usdPrice={usdPrice}
        eurPrice={eurPrice}
        onTabClick={(tab): void => this.setState({ activeTab: tab })}
        onReloadClick={(): void => { this.loadData(); }}
        onLogoutClick={(): void => {
          clearApiToken();
          this.setState({ instrumentsMap: undefined, ops: undefined, candles: undefined });
        }}
      />
    );

    if (instrumentsMap === undefined || timeline === undefined) {
      return (
        <div className='cApp'>
          {topPanel}
          <div className='cApp-body' />
        </div>
      );
    }

    if (activeTab === "PF") {
      return (
        <div className='cApp'>
          {topPanel}
          <div className='cApp-body'>
            <PortfolioBlock instruments={instrumentsMap} timeline={timeline} />
          </div>
        </div>
      );
    }

    return (
      <div className='cApp'>
        {topPanel}
        <div className='cApp-body'>
          <HistoryBlock instruments={instrumentsMap} states={timeline} />
        </div>
      </div>
    );
  }

  async loadData (): Promise<void> {
    if (apiToken() === null) {
      return;
    }

    this.setState({ loading: true });

    try {
      const instrumentsMap = await loadInstruments();
      const ops = await loadOps();

      const stats = new Stats(instrumentsMap, ops, {});
      const candles: { [figi: string]: Candle[] } = {};
      const cPromises: Promise<void>[] = [];
      const candlesLoadFrom = DateTime.fromISO(ops[0].date).minus({ hours: 7 * 24 }).toJSDate();

      for (const i of stats.allInstruments()) {
        cPromises.push((async (): Promise<void> => {
          const c = await loadCandles(i.figi, candlesLoadFrom);
          candles[i.figi] = c;
        })());
      }

      cPromises.push((async (): Promise<void> => {
        const c = await loadCandles(USD_FIGI, candlesLoadFrom);
        candles[USD_FIGI] = c;
      })());

      cPromises.push((async (): Promise<void> => {
        const c = await loadCandles(EUR_FIGI, candlesLoadFrom);
        candles[EUR_FIGI] = c;
      })());

      await Promise.all(cPromises);

      const timeline = new Stats(instrumentsMap, ops, candles).timeline();

      this.setState({ instrumentsMap, ops, candles, timeline });
    } finally {
      this.setState({ loading: false });
    }
  }
}

export default App;
