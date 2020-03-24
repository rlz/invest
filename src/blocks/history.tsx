import { DateTime } from 'luxon';
import React from "react";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';
import { Currency } from '../api/common';
import { InstrumentsMap } from '../api/instruments';
import { InstrumentState } from '../stats/instrumentState';
import { DayStats as DayState } from '../stats/stats';
import { toRub } from '../tools/currencies';
import { sortInstruments } from '../tools/instruments';
import { Cur, Eur, Prc, Rub, Usd } from '../widgets/spans';
import './history.scss';

interface Props {
  instruments: InstrumentsMap;
  states: DayState[];
}

interface State {
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

  totalRub: number;
  totalOwnRub: number;

  added1: number;
  added7: number;
  added30: number;

  performance: number;
  performance1: number;
  performance7: number;
  performance30: number;
}

function makeDateTooltipRenderer (type: Currency | "PERCENT") {
  return ({ active, label, payload }: TooltipProps): JSX.Element | undefined => {

    if (!active || label === undefined || payload === undefined) {
      return;
    }

    return (
      <div className='tooltip'>
        <div className='date'>{DateTime.fromMillis(label as number).toISODate()}</div>
        <table>
          <tbody>
            {payload.map(p => (
              <tr key={p.name}>
                <th><span style={{ color: p.color }}>{p.name}</span></th>
                <td>
                  {
                    type === "PERCENT" ?
                      <Prc v={(p.value as number) / 100} /> :
                      <Cur t={type} v={p.value as number} />
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
}

export class HistoryBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      expandedDays: new Set()
    };
  }

  render (): JSX.Element {
    const dayStates = this.props.states;

    const dayStats: DayStat[] = dayStates.map((dayState, i) => {
      const dayState1 = dayStates[Math.max(0, i - 1)];
      const dayState7 = dayStates[Math.max(0, i - 7)];
      const dayState30 = dayStates[Math.max(0, i - 30)];

      const totalRub = calcTotalRub(dayState);
      const totalOwnRub = calcTotalOwnRub(dayState);

      const totalRub1 = calcTotalRub(dayState1);
      const totalRub7 = calcTotalRub(dayState7);
      const totalRub30 = calcTotalRub(dayState30);

      const totalOwnRub1 = calcTotalOwnRub(dayState1);
      const totalOwnRub7 = calcTotalOwnRub(dayState7);
      const totalOwnRub30 = calcTotalOwnRub(dayState30);

      const added1 = totalOwnRub - totalOwnRub1;
      const added7 = totalOwnRub - totalOwnRub7;
      const added30 = totalOwnRub - totalOwnRub30;

      const performance = (totalRub - totalOwnRub) / totalRub;
      const performance1 = (totalRub - totalRub1 - added1) / (totalRub1 + added1);
      const performance7 = (totalRub - totalRub7 - added7) / (totalRub7 + added7);
      const performance30 = (totalRub - totalRub30 - added30) / (totalRub30 + added30);

      return {
        date: dayState.date.getTime(),

        totalRub,
        totalOwnRub,

        added1,
        added7,
        added30,

        performance,
        performance1,
        performance7,
        performance30
      };
    });

    const reverseDayStates = [...dayStates].reverse();
    const reverseDayStats = [...dayStats].reverse();

    return (
      <div className='bHistory'>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={dayStats}>
            <CartesianGrid stroke='#f5f5f5' />
            <XAxis
              dataKey='date'
              type='number'
              domain={["dataMin", "dataMax"]}
              scale='time'
              tickFormatter={(t: number): string => DateTime.fromMillis(t).toISODate()}
            />
            <YAxis />
            <Line name='Стоимость портфеля' dataKey='totalRub' stroke='#003f5c' />
            <Line name='Инвестированно (выведено)' dataKey='totalOwnRub' stroke='#ffa600' />
            <Tooltip content={makeDateTooltipRenderer("RUB")} />
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={dayStats}>
            <CartesianGrid stroke='#f5f5f5' />
            <XAxis
              dataKey='date'
              type='number'
              domain={["dataMin", "dataMax"]}
              scale='time'
              tickFormatter={(t: number): string => DateTime.fromMillis(t).toISODate()}
            />
            <YAxis />
            <ReferenceLine y={0} />
            <Line dataKey={(p): number => p.performance * 100} name='За все время' stroke='#003f5c' />
            <Line dataKey={(p): number => p.performance1 * 100} name='За день' stroke='#7a5195' />
            <Line dataKey={(p): number => p.performance7 * 100} name='За 7 дней' stroke='#ef5675' />
            <Line dataKey={(p): number => p.performance30 * 100} name='За 30 дней' stroke='#ffa600' />
            <Tooltip content={makeDateTooltipRenderer("PERCENT")} />
          </LineChart>
        </ResponsiveContainer>
        <div>
          {reverseDayStates.map((s, i) => this.renderDayStats(s, reverseDayStats[i]))}
        </div>
      </div>
    );
  }

  renderDayStats (dayState: DayState, dayStat: DayStat): JSX.Element {
    const expanded = this.state.expandedDays.has(dayState.date.toISOString()) ? " expanded" : "";

    const portfolio = sortInstruments(dayState.portfolio, this.props.instruments, dayState.usdPrice, dayState.eurPrice);

    return (
      <div className='dayStats'>
        <div className='date'>{DateTime.fromJSDate(dayState.date).toISODate()}</div>
        <div className='avail'>
          RUB: {dayState.rub.toFixed(2)}, USD: {dayState.usd.toFixed(2)}, EUR: {dayState.eur.toFixed(2)}
        </div>
        <div className='own'>
          OwnRUB: {dayState.ownRub.toFixed(2)}, OwnUSD: {dayState.ownUsd.toFixed(2)}, OwnEUR: {dayState.ownEur.toFixed(2)}<br />
        </div>
        <div className='currencies'>
          USD: <Rub v={dayState.usdPrice} /> EUR: <Rub v={dayState.eurPrice} />
        </div>
        <div className='portfolio'>
          {portfolio.filter(i => i.amount !== 0).map(i => this.renderInstrument(i))}
        </div>
        <div className='total'>
          Total: <Rub v={dayStat.totalRub} /> <Usd v={dayStat.totalRub / dayState.usdPrice} /> <Eur v={dayStat.totalRub / dayState.eurPrice} />
          {' '}<Prc v={dayStat.performance} color />
          {' '}За день: <Prc v={dayStat.performance1} color />
          {' '}За 7 дней: <Prc v={dayStat.performance7} color />
          {' '}За 30 дней: <Prc v={dayStat.performance30} color />
        </div>
        {/* <div
          className={'cApp-ops-expander' + expanded}
          onClick={(): void => this.flipExpandedDay(dayStats.date)}
        >{dayStats.ops.length} operations
        </div>
        <div className={'cApp-ops' + expanded}>{dayStats.ops.map((op, i) => <div key={i}>{JSON.stringify(op)}</div>)}</div> */}
      </div>
    );
  }

  renderInstrument (instrument: InstrumentState): JSX.Element {
    const info = this.props.instruments[instrument.figi];
    if (info === undefined) throw Error("Instrument not found");

    return (
      <div key={`i-${instrument.figi}`}>
        {info.name}
        <Cur t={instrument.currency} v={instrument.price} /> * {instrument.amount} = {instrument.price * instrument.amount}
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
