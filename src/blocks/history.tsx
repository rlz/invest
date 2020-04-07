import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon';
import React from "react";
import { Currency, Operation } from '../api/common';
import { Instrument, InstrumentsMap } from '../api/instruments';
import { InstrumentState } from '../stats/instrumentState';
import { DayStats as DayState } from '../stats/stats';
import { CurrenciesCalc, toCur, toRub } from '../tools/currencies';
import { sortInstruments } from '../tools/instruments';
import { c } from '../tools/react';
import { CurrenciesSwitch } from '../widgets/currenciesSwitch';
import { DaysSwitch } from '../widgets/daysSwitch';
import { Graph } from '../widgets/graph';
import { Cur, Prc, Rub } from '../widgets/spans';
import './history.scss';

interface Props {
  instruments: InstrumentsMap;
  states: DayState[];
}

interface State {
  drawAllTime: boolean;
  drawDay1: boolean;
  drawDay7: boolean;
  drawDay30: boolean;

  currency: Currency;
  expandedDays: ReadonlySet<string>;
}

function calcTotalRub (dayState: DayState): number {
  let total = dayState.rub;
  total += dayState.usd * dayState.usdPrice;
  total += dayState.eur * dayState.eurPrice;

  for (const i of Object.values(dayState.portfolio)) {
    total += toRub(i.currency, i.amount * i.price, dayState.usdPrice, dayState.eurPrice);
  }

  return total;
}

function calcTotalOwnRub (dayState: DayState): number {
  return dayState.ownRub + dayState.ownUsd * dayState.usdPrice + dayState.ownEur * dayState.eurPrice;
}

interface DayStat {
  date: number;

  totalCur: number;
  totalOwnCur: number;

  added1: number;
  added7: number;
  added30: number;

  performance: number;
  performance1: number;
  performance7: number;
  performance30: number;
}

export class HistoryBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      drawAllTime: true,
      drawDay1: false,
      drawDay7: false,
      drawDay30: true,

      currency: "RUB",
      expandedDays: new Set()
    };
  }

  render (): JSX.Element {
    const dayStates = this.props.states;

    const dayStats: DayStat[] = dayStates.map((dayState, i) => {
      const dayState1 = dayStates[Math.max(0, i - 1)];
      const dayState7 = dayStates[Math.max(0, i - 7)];
      const dayState30 = dayStates[Math.max(0, i - 30)];

      const totalCur = toCur(this.state.currency, "RUB", calcTotalRub(dayState), dayState.usdPrice, dayState.eurPrice);
      const totalOwnCur = toCur(
        this.state.currency, "RUB", calcTotalOwnRub(dayState), dayState.usdPrice, dayState.eurPrice
      );

      const totalCur1 = toCur(
        this.state.currency, "RUB", calcTotalRub(dayState1), dayState.usdPrice, dayState.eurPrice);
      const totalCur7 = toCur(
        this.state.currency, "RUB", calcTotalRub(dayState7), dayState.usdPrice, dayState.eurPrice);
      const totalCur30 = toCur(
        this.state.currency, "RUB", calcTotalRub(dayState30), dayState.usdPrice, dayState.eurPrice);

      const totalOwnCur1 = toCur(
        this.state.currency, "RUB", calcTotalOwnRub(dayState1), dayState.usdPrice, dayState.eurPrice
      );
      const totalOwnCur7 = toCur(
        this.state.currency, "RUB", calcTotalOwnRub(dayState7), dayState.usdPrice, dayState.eurPrice
      );
      const totalOwnCur30 = toCur(
        this.state.currency, "RUB", calcTotalOwnRub(dayState30), dayState.usdPrice, dayState.eurPrice
      );

      const added1 = totalOwnCur - totalOwnCur1;
      const added7 = totalOwnCur - totalOwnCur7;
      const added30 = totalOwnCur - totalOwnCur30;

      const performance = (totalCur - totalOwnCur) / totalCur;
      const performance1 = (totalCur - totalCur1 - added1) / (totalCur1 + added1);
      const performance7 = (totalCur - totalCur7 - added7) / (totalCur7 + added7);
      const performance30 = (totalCur - totalCur30 - added30) / (totalCur30 + added30);

      return {
        date: dayState.date.getTime(),

        usdPrice: dayState.usdPrice,
        eurPrice: dayState.eurPrice,

        totalCur,
        totalOwnCur,

        added1,
        added7,
        added30,

        performance,
        performance1,
        performance7,
        performance30
      };
    });

    const reverseDayStates = [...dayStates].reverse().slice(0, 100);
    const reverseDayStats = [...dayStats].reverse().slice(0, 100);

    const perfLabel = this.state.drawDay1 ? "За день" : (this.state.drawDay7 ? "За 7 дней" : "За 30 дней");
    const perfData = dayStats.map(
      s => (this.state.drawDay1 ?
        s.performance1 * 100 :
        (this.state.drawDay7 ? (s.performance7 * 100) : (s.performance30 * 100)))
    );

    const { currency } = this.state;

    return (
      <div className='bHistory'>
        <CurrenciesSwitch currency={currency} onCurSwitch={(currency): void => this.setState({ currency })} />
        <h1>Стоимость портфеля и вложения</h1>
        <Graph
          timestamps={dayStats.map(s => s.date / 1000)}
          valType={currency}
          s1={{ label: "Стоимость портфеля", data: dayStats.map(s => s.totalCur) }}
          s2={{ label: "Инвестированно (выведено)", data: dayStats.map(s => s.totalOwnCur) }}
        />
        <h1>Доходы и потери</h1>
        <DaysSwitch
          drawAllTime={this.state.drawAllTime}
          drawDay1={this.state.drawDay1}
          drawDay7={this.state.drawDay7}
          drawDay30={this.state.drawDay30}

          setFlags={(a, d1, d7, d30): void =>
            this.setState({ drawAllTime: a, drawDay1: d1, drawDay7: d7, drawDay30: d30 })}
        />
        {
          this.state.drawAllTime ?
            <Graph
              timestamps={dayStats.map(s => s.date / 1000)}
              valType='PERCENT'
              s1={{ label: perfLabel, data: perfData }}
              s2={{ label: "За все время", data: dayStats.map(s => s.performance * 100) }}
            /> :
            <Graph
              timestamps={dayStats.map(s => s.date / 1000)}
              valType='PERCENT'
              s1={{ label: perfLabel, data: perfData }}
            />
        }
        <div>
          {reverseDayStates.map((s, i) => this.renderDayStats(s, reverseDayStats[i]))}
        </div>
      </div>
    );
  }

  renderDayStats (dayState: DayState, dayStat: DayStat): JSX.Element {
    const expanded = this.state.expandedDays.has(dayState.date.toISOString());

    const portfolio = sortInstruments(dayState.portfolio, this.props.instruments, dayState.usdPrice, dayState.eurPrice);

    const available = new CurrenciesCalc(dayState.usdPrice, dayState.eurPrice)
      .addRub(dayState.rub).addUsd(dayState.usd).addEur(dayState.eur).cur(this.state.currency);

    const own = new CurrenciesCalc(dayState.usdPrice, dayState.eurPrice)
      .addRub(dayState.ownRub).addUsd(dayState.ownUsd).addEur(dayState.ownEur).cur(this.state.currency);

    return (
      <div key={`day-${dayState.date.toISOString()}`} className='dayStats'>
        <div className='title'>
          <span className='date'>{DateTime.fromJSDate(dayState.date).toISODate()}</span>{' '}
          USD: <Rub v={dayState.usdPrice} />{' '}
          EUR: <Rub v={dayState.eurPrice} />
        </div>
        <div className='avail'>
          Доступно: <Cur t={this.state.currency} v={available} />
        </div>
        <div className='own'>
          Инвестировано (выведено): <Cur t={this.state.currency} v={own} />
        </div>
        <div className='portfolio'>
          {portfolio
            .filter(i => i.amount !== 0)
            .map(i => this.renderInstrument(i, this.state.currency, dayState.usdPrice, dayState.eurPrice))}
        </div>
        <div className='total'>
          Итого: <Cur t={this.state.currency} v={dayStat.totalCur} />
          {' '}За все время: <Prc v={dayStat.performance} color />
          {' '}За день: <Prc v={dayStat.performance1} color />
          {' '}За 7 дней: <Prc v={dayStat.performance7} color />
          {' '}За 30 дней: <Prc v={dayStat.performance30} color />
        </div>
        <div
          className={c('ops-expander', [expanded, "expanded"])}
          onClick={(): void => this.flipExpandedDay(dayState.date)}
        >
          {dayState.ops.length} операций
          {dayState.ops.length > 0 ?
            <button onClick={(): void => this.flipExpandedDay(dayState.date)}>
              {expanded ?
                <span><FontAwesomeIcon icon={faAngleUp} /> скрыть</span> :
                <span><FontAwesomeIcon icon={faAngleDown} /> показать</span>}
            </button> :
            undefined}
        </div>
        {
          expanded ?
            <div className='ops'>
              {dayState.ops.map((op, i) => this.renderOp(op, i.toString()))}
            </div> :
            undefined
        }
      </div>
    );
  }

  renderInstrument (instrument: InstrumentState, cur: Currency, usdPrice: number, eurPrice: number): JSX.Element {
    const info = this.props.instruments[instrument.figi];
    if (info === undefined) throw Error("Instrument not found");

    return (
      <span key={`i-${instrument.figi}`}>
        {info.ticker}({instrument.amount}):{' '}
        <Cur t={cur} v={toCur(cur, instrument.currency, instrument.price * instrument.amount, usdPrice, eurPrice)} />
      </span>
    );
  }

  renderOp (op: Operation, key: string): JSX.Element {
    const opJson: Operation & { instrument?: Instrument } = { ...op };

    if (opJson.figi !== undefined) {
      opJson.instrument = this.props.instruments[opJson.figi];
    }

    return (
      <pre key={key}>{JSON.stringify(opJson, undefined, 2)}</pre>
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
