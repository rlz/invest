import { faAngleRight, faChevronDown, faChevronUp, faCoins, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import React from "react";
import { Currency, Operation } from "../api/common";
import { InstrumentsMap } from '../api/instruments';
import { InstrumentState } from '../stats/instrumentState';
import { DayStats } from '../stats/stats';
import { toEur, toRub, toUsd } from '../tools/currencies';
import { plural } from "../tools/lang";
import { opQuantity } from "../tools/operations";
import { Cur, Eur, Rub, Usd } from "./spans";

interface Props {
  instruments: InstrumentsMap;
  i: InstrumentState;

  initDay: DayStats | undefined;
  curDay: DayStats;
}

interface State {
  expanded: boolean;
}

export class Instrument extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  render (): JSX.Element[] {
    const { instruments, i, initDay, curDay } = this.props;

    const instrumentInfo = instruments[i.figi];
    if (instrumentInfo === undefined) throw Error("Unknown instrument");

    const initialInstrumentState = initDay?.portfolio?.[i.figi];
    const initialInstrumentCost = (initialInstrumentState?.amount ?? 0) * (initialInstrumentState?.price ?? 0);

    let effect = i.amount * i.price - initialInstrumentCost;

    const startDt = initDay === undefined ? DateTime.fromMillis(0) : DateTime.fromJSDate(initDay.date).plus({ days: 1 });

    for (const op of i.ops) {
      if (DateTime.fromISO(op.date) <= startDt) continue;

      if (op.operationType.startsWith("Buy")) {
        const q = opQuantity(op);
        if (q === undefined) throw Error("undefined quantity");
        effect -= op.price * q;
      } else if (op.operationType === "Sell") {
        const q = opQuantity(op);
        if (q === undefined) throw Error("undefined quantity");
        effect += op.price * q;
      } else if (op.operationType === "Dividend") {
        effect += op.payment;
      }
    }

    const op1 = i.ops[i.ops.length - 1];

    const result = [
      <tr key={i.figi} className='inst-main-line'>
        <td className='name'>
          {instrumentInfo.name}
        </td>
        <td>{i.amount} {'\xD7'} <Cur t={i.currency} v={i.price} /> = <Cur t={i.currency} v={i.amount * i.price} /></td>
        {this.renderAllCurrenciesColumns(i.currency, i.price * i.amount, curDay.usdPrice, curDay.eurPrice)}
      </tr>,
      <tr key={i.figi + "-sl"} className='inst-ticker-line'>
        <td className='ticker'>
          {instrumentInfo.ticker}
        </td>
        <td><Cur t={i.currency} v={effect} color /></td>
        {this.renderAllCurrenciesColumns(i.currency, effect, curDay.usdPrice, curDay.eurPrice, true)}
      </tr>
    ];

    if (this.state.expanded) {
      result.push(
        <tr key={`expand-${i.figi}`}>
          <td colSpan={2}>
            {i.ops.length} операций{' '}
            <button onClick={(): void => this.setState({ expanded: false })}>
              <FontAwesomeIcon icon={faChevronUp} /> Скрыть
            </button>
          </td>
          {this.renderEmptyAllCurrenciesColumns()}
        </tr>
      );

      const ops = [...i.ops].reverse();

      for (const op of ops) {
        if (DateTime.fromISO(op.date) <= startDt) continue;
        result.push(this.renderOperation(i, op, curDay.usdPrice, curDay.eurPrice));
      }

      if (initDay !== undefined && initialInstrumentState !== undefined) {
        const is = initialInstrumentState;
        result.push(
          <tr key='initial' className='op-line'>
            <td>{DateTime.fromJSDate(initDay.date).toISODate()} в портфеле</td>
            <td>
              {is.amount} {'\xD7 '}
              <Cur t={is.currency} v={is.price} />{' '}
              = <Cur t={is.currency} v={is.amount * is.price} />
            </td>
            {this.renderAllCurrenciesColumns(is.currency, is.amount * is.price, initDay.usdPrice, initDay.eurPrice)}
          </tr>
        );
      }
    } else if (i.ops.length === 1) {
      result.push(
        <tr key={`expand-${i.figi}`}>
          <td colSpan={2}>1 операция</td>
          {this.renderEmptyAllCurrenciesColumns()}
        </tr>
      );
      result.push(
        this.renderOperation(i, op1, curDay.usdPrice, curDay.eurPrice)
      );
    } else {
      result.push(
        <tr key={`expand-${i.figi}`}>
          <td colSpan={2}>
            {i.ops.length} {plural(i.ops.length, "операция", "операции", "операций")}{' '}
            <button onClick={(): void => this.setState({ expanded: true })}>
              <FontAwesomeIcon icon={faChevronDown} /> Показать все
            </button>
          </td>
          {this.renderEmptyAllCurrenciesColumns()}
        </tr>
      );
      result.push(
        this.renderOperation(i, op1, curDay.usdPrice, curDay.eurPrice)
      );
      result.push(
        <tr key={`op-more-${i.figi}`}>
          <td colSpan={2}>...</td>
          <td colSpan={3} className='all-cur' />
        </tr>
      );
    }

    return result;
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

  renderOperation (i: InstrumentState, op: Operation, usdPrice: number, eurPrice: number): JSX.Element {
    if (op.operationType === "Buy" || op.operationType === "BuyCard" || op.operationType === "Sell") {
      const opName = {
        "Buy": <span><FontAwesomeIcon icon={faAngleRight} /> <FontAwesomeIcon icon={faWallet} /></span>,
        "BuyCard": <span><FontAwesomeIcon icon={faAngleRight} /> <FontAwesomeIcon icon={faWallet} /></span>,
        "Sell": <span><FontAwesomeIcon icon={faWallet} /> <FontAwesomeIcon icon={faAngleRight} /></span>
      }[op.operationType as unknown as "Buy" | "BuyCard" | "Sell"];

      const q = opQuantity(op);
      if (q === undefined) throw Error("undefined quantity");

      return (
        <tr key={`${i.figi}-op-${op.date}-${op.id}`} className='op-line'>
          <td>{DateTime.fromISO(op.date).toISODate()} {opName}</td>
          <td>
            {q} {'\xD7'} <Cur t={op.currency} v={op.price} />{' '}
            = <Cur t={op.currency} v={q * op.price} />
          </td>
          {this.renderAllCurrenciesColumns(op.currency, q * op.price, usdPrice, eurPrice)}
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
}