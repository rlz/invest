import { DateTime, Duration } from "luxon";
import React from "react";
import { Currency } from '../api/common';
import { InstrumentsMap } from '../api/instruments';
import { DayStats } from '../stats/stats';
import { CurrenciesCalc, toEur, toRub, toUsd } from '../tools/currencies';
import { sortInstruments } from "../tools/instruments";
import { DateRangeSelector } from "../widgets/dateRangeSelector";
import { Instrument } from "../widgets/instrument";
import { Cur, Eur, Prc, Rub, Usd } from "../widgets/spans";
import './portfolio.scss';

interface Props {
  instruments: InstrumentsMap;
  timeline: DayStats[];
}

interface State {
  startPosition: number;
  endPosition: number;
  expandedInstruments: ReadonlySet<string>;
}

export class PortfolioBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      startPosition: 0,
      endPosition: props.timeline.length - 1,
      expandedInstruments: new Set()
    };
  }

  render (): JSX.Element {
    const { timeline, instruments } = this.props;
    const initial = timeline[this.state.startPosition - 1] as DayStats | undefined;
    const current = timeline[this.state.endPosition];

    const initialTotal = new CurrenciesCalc(initial?.usdPrice ?? 1, initial?.eurPrice ?? 1);
    initialTotal.addRub(initial?.rub ?? 0).addUsd(initial?.usd ?? 0).addEur(initial?.eur ?? 0);
    for (const i of Object.values(initial?.portfolio ?? {})) {
      initialTotal.add(i.currency, i.amount * i.price);
    }

    const currentTotal = new CurrenciesCalc(current.usdPrice, current.eurPrice);
    currentTotal.addRub(current.rub).addUsd(current.usd).addEur(current.eur);
    for (const i of Object.values(current.portfolio)) {
      currentTotal.add(i.currency, i.amount * i.price);
    }

    const initialOwn = new CurrenciesCalc(initial?.usdPrice ?? 1, initial?.eurPrice ?? 1)
      .addRub(initial?.ownRub ?? 0).addUsd(initial?.ownUsd ?? 0).addEur(initial?.ownEur ?? 0);

    const currentOwn = new CurrenciesCalc(current.usdPrice, current.eurPrice)
      .addRub(current.ownRub).addUsd(current.ownUsd).addEur(current.ownEur);

    const addedUsd = currentOwn.usd() - initialOwn.usd();

    const minDate = DateTime.fromJSDate(timeline[0].date);
    const maxDate = DateTime.fromJSDate(timeline[timeline.length - 1].date);
    const startDate = minDate.plus(Duration.fromObject({ days: this.state.startPosition }));
    const endDate = minDate.plus(Duration.fromObject({ days: this.state.endPosition }));

    return (
      <div className='bPortfolio'>
        <DateRangeSelector
          min={minDate}
          max={maxDate}
          start={startDate}
          end={endDate}
          timeline={timeline}
          onChange={(start, end): void => {
            this.setState({
              startPosition: this.dateToPos(start) ?? 0,
              endPosition: this.dateToPos(end) ?? (timeline.length - 1)
            });
          }}
        />
        <h1>Полная стоимость портфеля</h1>
        <div className='bPortfolio-full-cost'>
          <Rub v={currentTotal.rub()} />
          <Usd v={currentTotal.usd()} />
          <Eur v={currentTotal.eur()} />
          <Prc v={(currentTotal.usd() - initialTotal.usd() - addedUsd) / currentTotal.usd()} color />
        </div>
        <table>
          <tbody>
            {this.renderOwnMoney(current)}
            {this.renderAvailable(current)}
            <tr>
              <th colSpan={2} className='th-first-line'>Инструменты</th>
              {this.renderEmptyAllCurrenciesColumns()}
            </tr>
            {sortInstruments(current.portfolio, instruments, current.usdPrice, current.eurPrice)
              .map(i => <Instrument key={i.figi} instruments={instruments} i={i} initDay={initial} curDay={current} />)}
          </tbody>
        </table>
      </div>
    );
  }

  renderAvailable (portfolio: DayStats): JSX.Element[] {
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

    const total = new CurrenciesCalc(portfolio.usdPrice, portfolio.eurPrice)
      .addRub(portfolio.rub).addUsd(portfolio.usd).addEur(portfolio.eur);

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
        {this.renderAllCurrenciesColumns("RUB", total.rub(), portfolio.usdPrice, portfolio.eurPrice)}
      </tr>
    ];
  }

  renderOwnMoney (portfolio: DayStats): JSX.Element[] {
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

    const totalOwn = new CurrenciesCalc(portfolio.usdPrice, portfolio.eurPrice)
      .addRub(portfolio.ownRub).addUsd(portfolio.ownUsd).addEur(portfolio.ownEur);

    return [
      <tr key='ownMoney-th'>
        <th colSpan={2} className='th-first-line'>Инвестированно (выведено)</th>
        <th colSpan={3} className='all-cur'>В разных валютах</th>
      </tr>,
      ownMoneyLine("RUB"),
      ownMoneyLine("USD"),
      ownMoneyLine("EUR"),
      <tr key='ownMoney-total' className='total'>
        <th colSpan={2}>
          Всего
        </th>
        {this.renderAllCurrenciesColumns("RUB", totalOwn.rub(), portfolio.usdPrice, portfolio.eurPrice)}
      </tr>
    ];
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

  dateToPos (date: DateTime): number | undefined {
    const days = date.diff(DateTime.fromJSDate(this.props.timeline[0].date)).as("days");

    if (days < 0 || days > this.props.timeline.length - 1) {
      return undefined;
    }

    return days;
  }
}
