import React from "react";
import { DayStats } from '../stats/stats';

interface Props {
  dayStats: DayStats[];
}

interface State {
  expandedDays: ReadonlySet<string>;
}

export class HistoryBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      expandedDays: new Set()
    };
  }
  render (): JSX.Element {
    return (
      <div className='bHistory'>
        {this.renderDays()}
      </div>
    );
  }
  renderDays (): JSX.Element | undefined {
    const dayStats = this.props.dayStats;

    return (
      <div>
        {dayStats.map(s => this.renderDayStats(s))}
      </div>
    );
  }

  renderDayStats (dayStats: DayStats): JSX.Element {
    const expanded = this.state.expandedDays.has(dayStats.date.toISOString()) ? " expanded" : "";
    // console.log("E", this.state.expandedDays, dayStats.date, this.state.expandedDays.has(dayStats.date));
    return (
      <div>
        <div className='cApp-day'>
          {dayStats.date.toDateString()} |
          RUB: {dayStats.rub.toFixed(2)}, USD: {dayStats.usd.toFixed(2)}, EUR: {dayStats.eur.toFixed(2)}<br />
          OwnRUB: {dayStats.ownRub.toFixed(2)}, OwnUSD: {dayStats.ownUsd.toFixed(2)}, OwnEUR: {dayStats.ownEur.toFixed(2)}<br />
        </div>
        <div
          className={'cApp-ops-expander' + expanded}
          onClick={(): void => this.flipExpandedDay(dayStats.date)}
        >{dayStats.ops.length} operations
        </div>
        <div className={'cApp-ops' + expanded}>{dayStats.ops.map((op, i) => <div key={i}>{JSON.stringify(op)}</div>)}</div>
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