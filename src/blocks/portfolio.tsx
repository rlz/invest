import { faAngleRight, faChevronDown, faChevronUp, faCoins, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import React from "react";
import { Currency, Operation } from '../api/common';
import { InstrumentsMap } from '../api/instruments';
import { InstrumentState } from "../stats/instrumentState";
import { Portfolio } from '../stats/portfolio';
import { CurrenciesCalc, toEur, toRub, toUsd } from '../tools/currencies';
import { Cur, Eur, Prc, Rub, Usd } from "../widgets/spans";
import './portfolio.scss';

interface Props {
  instruments: InstrumentsMap;
  portfolio: Portfolio;
}

interface State {
  expandedInstruments: ReadonlySet<string>;
}

function sortInstruments (
  states: { [figi: string]: InstrumentState },
  infos: InstrumentsMap,
  usdPrice: number,
  eurPrice: number
): InstrumentState[] {
  return Object.values(states)
    .sort((a, b) => {
      const c = (
        Math.abs(toRub(b.currency, b.amount * b.cost, usdPrice, eurPrice))
        - Math.abs(toRub(a.currency, a.amount * a.cost, usdPrice, eurPrice))
      );
      if (c !== 0) return c;
      const aTicker = infos[a.figi]?.ticker;
      const bTicker = infos[b.figi]?.ticker;
      if (aTicker === undefined || bTicker === undefined) {
        throw Error("Unknown instruments");
      }
      return aTicker.localeCompare(bTicker);
    });
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

    const totalPortfolioCost = new CurrenciesCalc(portfolio.usdPrice, portfolio.eurPrice);
    totalPortfolioCost.addRub(portfolio.totalRub());
    for (const i of Object.values(portfolio.instruments)) {
      totalPortfolioCost.add(i.currency, i.amount * i.cost);
    }

    return (
      <div className='bPortfolio'>
        <h1>Полная стоимость портфеля</h1>
        <div className='bPortfolio-full-cost'>
          <Rub v={totalPortfolioCost.rub()} />
          <Usd v={totalPortfolioCost.usd()} />
          <Eur v={totalPortfolioCost.eur()} />
          <Prc v={(totalPortfolioCost.rub() - portfolio.totalOwnRub()) / totalPortfolioCost.rub()} color />
        </div>
        <table>
          <tbody>
            {this.renderOwnMoney(portfolio)}
            {this.renderAvailable(portfolio)}
            <tr>
              <th colSpan={2} className='th-first-line'>Инструменты</th>
              {this.renderEmptyAllCurrenciesColumns()}
            </tr>
            {sortInstruments(portfolio.instruments, instruments, portfolio.usdPrice, portfolio.eurPrice)
              .map(i => this.renderInstrument(i, portfolio.usdPrice, portfolio.eurPrice))}
          </tbody>
        </table>
      </div>
    );
  }

  renderAvailable (portfolio: Portfolio): JSX.Element[] {
    const availLine = (c: Currency): JSX.Element => {
      let v = portfolio.rub;
      if (c === "USD") v = portfolio.usd;
      if (c === "EUR") v = portfolio.eur;
      return (
        <tr key={`avail-${c}`}>
          <td colSpan={2}>
            <Cur t={c} v={v} />
          </td>
          {this.renderAllCurrenciesColumns(c, v, portfolio.usdPrice, portfolio.eurPrice)}
        </tr>
      );
    };

    return [
      <tr key='available-th'>
        <th colSpan={2} className='th-first-line'>Доступно</th>
        {this.renderEmptyAllCurrenciesColumns()}
      </tr>,
      availLine("RUB"),
      availLine("USD"),
      availLine("EUR"),
      <tr key='available-total' className='total'>
        <th colSpan={2}>
          Всего
        </th>
        {this.renderAllCurrenciesColumns("RUB", portfolio.totalRub(), portfolio.usdPrice, portfolio.eurPrice)}
      </tr>
    ];
  }

  renderOwnMoney (portfolio: Portfolio): JSX.Element[] {
    const ownMoneyLine = (c: Currency): JSX.Element => {
      const ownMoneyCase = { "RUB": "ownRub", "USD": "ownUsd", "EUR": "ownEur" }[c];
      const v = (portfolio as unknown as { [_: string]: number })[ownMoneyCase];
      return (
        <tr key={`ownMoney-${c.toLowerCase()}`}>
          <td colSpan={2}>
            <Cur t={c} v={v} />
          </td>
          {this.renderAllCurrenciesColumns(c, v, portfolio.usdPrice, portfolio.eurPrice)}
        </tr>
      );
    };

    return [
      <tr key='ownMoney-th'>
        <th colSpan={2} className='th-first-line'>Инвестированно (выведено)</th>
        <th colSpan={3} className='all-cur'>Итого</th>
      </tr>,
      ownMoneyLine("RUB"),
      ownMoneyLine("USD"),
      ownMoneyLine("EUR"),
      <tr key='ownMoney-total' className='total'>
        <th colSpan={2}>
          Всего
        </th>
        {this.renderAllCurrenciesColumns("RUB", portfolio.totalOwnRub(), portfolio.usdPrice, portfolio.eurPrice)}
      </tr>
    ];
  }

  renderInstrument (i: InstrumentState, usdPrice: number, eurPrice: number): JSX.Element[] {
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

    const op1 = i.ops[i.ops.length - 1];

    const result = [
      <tr key={i.figi} className='inst-main-line'>
        <td className='name'>
          {instrumentInfo.name}
        </td>
        <td>{i.amount} {'\xD7'} <Cur t={i.currency} v={i.cost} /> = <Cur t={i.currency} v={i.amount * i.cost} /></td>
        {this.renderAllCurrenciesColumns(i.currency, i.cost * i.amount, usdPrice, eurPrice)}
      </tr>,
      <tr key={i.figi + "-sl"} className='inst-ticker-line'>
        <td className='ticker'>
          {instrumentInfo.ticker}
        </td>
        <td><Cur t={i.currency} v={effect} color /></td>
        {this.renderAllCurrenciesColumns(i.currency, effect, usdPrice, eurPrice, true)}
      </tr>
    ];

    if (this.state.expandedInstruments.has(i.figi)) {
      result.push(
        <tr key={`expand-${i.figi}`}>
          <td colSpan={2}>
            {i.ops.length} операций{' '}
            <button onClick={(): void => this.switchOps(i.figi)}>
              <FontAwesomeIcon icon={faChevronUp} /> Скрыть
            </button>
          </td>
          {this.renderEmptyAllCurrenciesColumns()}
        </tr>
      );

      const ops = [...i.ops].reverse();

      for (const op of ops) {
        result.push(this.renderOperation(i, op, usdPrice, eurPrice));
      }
    } else {
      result.push(
        this.renderOperation(i, op1, usdPrice, eurPrice)
      );
      result.push(
        <tr key={`expand-${i.figi}`}>
          <td colSpan={2}>
            {i.ops.length} операций{' '}
            <button onClick={(): void => this.switchOps(i.figi)}>
              <FontAwesomeIcon icon={faChevronDown} /> Показать все
            </button>
          </td>
          {this.renderEmptyAllCurrenciesColumns()}
        </tr>
      );
    }

    return result;
  }

  private switchOps (figi: string): void {
    const newSet = new Set(this.state.expandedInstruments);
    if (newSet.has(figi)) {
      newSet.delete(figi);
    } else {
      newSet.add(figi);
    }
    this.setState({ expandedInstruments: newSet });
  }

  renderOperation (i: InstrumentState, op: Operation, usdPrice: number, eurPrice: number): JSX.Element {
    if (op.operationType === "Buy" || op.operationType === "BuyCard" || op.operationType === "Sell") {
      const opName = {
        "Buy": <span><FontAwesomeIcon icon={faAngleRight} /> <FontAwesomeIcon icon={faWallet} /></span>,
        "BuyCard": <span><FontAwesomeIcon icon={faAngleRight} /> <FontAwesomeIcon icon={faWallet} /></span>,
        "Sell": <span><FontAwesomeIcon icon={faWallet} /> <FontAwesomeIcon icon={faAngleRight} /></span>
      }[op.operationType as unknown as "Buy" | "BuyCard" | "Sell"];

      return (
        <tr key={`${i.figi}-op-${op.date}-${op.id}`} className='op-line'>
          <td>{DateTime.fromISO(op.date).toISODate()} {opName}</td>
          <td>
            {op.quantity} {'\xD7'} <Cur t={op.currency} v={op.price} />{' '}
            = <Cur t={op.currency} v={op.quantity * op.price} />
          </td>
          {this.renderAllCurrenciesColumns(op.currency, op.quantity * op.price, usdPrice, eurPrice)}
        </tr>
      );
    }

    if (op.operationType === "Dividend") {
      return (
        <tr key={`${i.figi}-op-${op.date}-${op.id}`} className='op-line'>
          <td>{DateTime.fromISO(op.date).toISODate()} <FontAwesomeIcon icon={faCoins} /></td>
          <td><Cur t={op.currency} v={op.payment} /></td>
          {this.renderAllCurrenciesColumns(op.currency, op.payment, usdPrice, eurPrice)}
        </tr>
      );
    }

    throw Error("Unexpected operationType");
  }

  renderAllCurrenciesColumns (
    cur: Currency, amount: number, usdPrice: number, eurPrice: number, color?: boolean
  ): JSX.Element[] {
    return [
      <td key='total-rub' className='all-cur'><Rub v={toRub(cur, amount, usdPrice, eurPrice)} color={color} /></td>,
      <td key='total-usd' className='all-cur'><Usd v={toUsd(cur, amount, usdPrice, eurPrice)} color={color} /></td>,
      <td key='total-eur' className='all-cur'><Eur v={toEur(cur, amount, usdPrice, eurPrice)} color={color} /></td>
    ];
  }

  renderEmptyAllCurrenciesColumns (): JSX.Element[] {
    return [
      <td key='total-rub' className='all-cur' />,
      <td key='total-usd' className='all-cur' />,
      <td key='total-eur' className='all-cur' />
    ];
  }
}
