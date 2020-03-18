import { DateTime } from "luxon";
import React from "react";
import { Operation } from "../api/common";
import { InstrumentsMap } from '../api/instruments';
import { InstrumentState } from "../stats/instrumentState";
import { Portfolio } from "../stats/portfolio";
import { CurrenciesCalc, toEur, toRub, toUsd } from '../tools/currencies';
import { Cur, Eur, Rub, Usd } from "../widgets/spans";
import './portfolio.scss';

interface Props {
  instruments: InstrumentsMap;
  portfolio: Portfolio;
}

interface State {
  expandedInstruments: ReadonlySet<string>;
}

export class PortfolioBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      expandedInstruments: new Set()
    };
  }

  render (): JSX.Element {
    const { portfolio, instruments } = this.props;

    const totalPortfolioCost = new CurrenciesCalc(portfolio.usdCost, portfolio.eurCost);
    totalPortfolioCost.addRub(portfolio.totalRub());
    for (const i of Object.values(portfolio.instruments)) {
      totalPortfolioCost.add(i.currency, i.amount * i.cost);
    }

    return (
      <div className=''>
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
                const aTicker = instruments[a.figi]?.ticker;
                const bTicker = instruments[b.figi]?.ticker;
                if (aTicker === undefined || bTicker === undefined) {
                  throw Error("Unknown instruments");
                }
                return aTicker.localeCompare(bTicker);
              })
              .map(i => this.renderInstrument(i, portfolio.usdCost, portfolio.eurCost))}
          </div>
        </div>
      </div>
    );
  }

  renderInstrument (i: InstrumentState, usdCost: number, eurCost: number): JSX.Element[] {
    const { instruments } = this.props;

    if (!instruments) throw Error("No instruments map loaded!");
    const instrumentInfo = instruments[i.figi];
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
}