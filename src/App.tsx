import React from 'react';
import { Candle, loadCandles } from './api/candles';
import { Operation } from './api/common';
import { InstrumentsMap, loadInstruments } from './api/instruments';
import { loadOps } from './api/operations';
import './App.scss';
import { HistoryBlock } from './blocks/history';
import { PortfolioBlock } from './blocks/portfolio';
import { TopPanelBlock } from './blocks/topPanel';
import { EUR_FIGI, Stats, USD_FIGI } from './stats/stats';

interface State {
  instrumentsMap?: InstrumentsMap;
  ops?: Operation[];
  candles?: { [figi: string]: Candle[] };
  loading: boolean;
  activeTab: "PF" | "TL";
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      loading: false,
      activeTab: "PF"
    };
  }

  async componentDidMount (): Promise<void> {
    this.loadData();
  }

  render (): JSX.Element {
    const { instrumentsMap, ops, candles, activeTab } = this.state;

    if (!instrumentsMap || !ops || !candles) {
      return (
        <div className='cApp'>
          <TopPanelBlock
            activeTab={activeTab}
            onTabClick={(tab): void => this.setState({ activeTab: tab })}
          />
          <div className='cApp-body' />
        </div>
      );
    }

    const stats = new Stats(instrumentsMap, ops, candles);

    if (activeTab === "PF") {
      const portfolio = stats.portfolio();

      return (
        <div className='cApp'>
          <TopPanelBlock
            activeTab={activeTab}
            onTabClick={(tab): void => this.setState({ activeTab: tab })}
            usdPrice={stats.usdPrice()}
            eurPrice={stats.eurPrice()}
          />
          <div className='cApp-body'>
            <PortfolioBlock instruments={instrumentsMap} portfolio={portfolio} />
          </div>
        </div>
      );
    }

    return (
      <div className='cApp'>
        <TopPanelBlock
          activeTab={activeTab}
          onTabClick={(tab): void => this.setState({ activeTab: tab })}
          usdPrice={stats.usdPrice()}
          eurPrice={stats.eurPrice()}
        />
        <div className='cApp-body'>
          <HistoryBlock dayStats={stats.timeline()} />
        </div>
      </div>
    );
  }

  async loadData (): Promise<void> {
    this.setState({ loading: true });

    try {
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
    } finally {
      this.setState({ loading: false });
    }
  }
}

export default App;
