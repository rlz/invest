import { DateTime, Duration } from 'luxon';
import { Range } from 'rc-slider';
import React from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.min.css';
import uPlot from 'uplot';
import "uplot/dist/uPlot.min.css";
import { DayStats } from '../stats/stats';
import { CurrenciesCalc } from '../tools/currencies';
import "./dateRangeSelector.scss";

interface Props {
  min: DateTime;
  max: DateTime;

  start: DateTime;
  end: DateTime;

  timeline: DayStats[];

  onChange: (start: DateTime, end: DateTime) => void;
}

export class DateRangeSelector extends React.Component<Props> {
  uPlot: uPlot | null = null
  chartDiv: HTMLDivElement | null = null

  componentDidMount (): void {
    if (this.chartDiv === null) return;

    const opts: uPlot.Options = {
      width: this.chartDiv.clientWidth,
      height: this.chartDiv.clientHeight,
      class: "spark",
      cursor: {
        show: false
      },
      // select: {
      //   show: false,
      // },
      legend: {
        show: false,
      },
      scales: {
        x: {
          time: false,
        },
      },
      axes: [
        {
          show: false,
        },
        {
          show: false,
        }
      ],
      series: [
        {},
        {
          stroke: "#aaaaaa",
          fill: "#aaaaaa",
        },
      ],
      fmtDate: () => (): string => ""
    };
    this.uPlot = new uPlot(opts, this.data(), this.chartDiv);
  }

  componentWillUnmount (): void {
    this.uPlot?.destroy();
    this.uPlot = null;
  }

  componentDidUpdate (): void {
    this.uPlot?.setData(this.data());
  }

  render (): JSX.Element {
    const max = this.props.max.diff(this.props.min).as("days");
    const startPos = this.props.start.diff(this.props.min).as("days");
    const endPos = this.props.end.diff(this.props.min).as("days");

    return (
      <div className='cDateRangeSelector'>
        <div className='dates'>
          <div className='from'>
            С
            <DatePicker
              dateFormat='yyyy-MM-dd'
              selected={this.props.start.toJSDate()}
              onChange={
                (date): void =>
                  this.props.onChange(date !== null ? DateTime.fromJSDate(date) : this.props.min, this.props.end)
              }
            />
          </div>
          <div className='until'>
            по
            <DatePicker
              dateFormat='yyyy-MM-dd'
              selected={this.props.end.toJSDate()}
              onChange={
                (date): void =>
                  this.props.onChange(this.props.start, date !== null ? DateTime.fromJSDate(date) : this.props.max)
              }
            />
          </div>
        </div>

        <div className='range-chart'>
          <div className='chart' ref={(el): void => { this.chartDiv = el; }} />

          <Range
            min={0}
            max={max}
            value={[startPos, endPos]}
            onChange={([start, end]): void =>
              this.props.onChange(this.posToDate(start), this.posToDate(end))}
          />
        </div>
      </div>
    );
  }

  posToDate (position: number): DateTime {
    return this.props.min.plus(Duration.fromObject({ days: position }));
  }

  data (): number[][] {
    const date: number[] = [];
    const total: number[] = [];

    for (const d of this.props.timeline) {
      date.push(d.date.getTime());
      const t = new CurrenciesCalc(d.usdPrice, d.eurPrice);
      t.add("RUB", d.rub).add("USD", d.usd).add("EUR", d.eur);
      for (const i of Object.values(d.portfolio)) {
        t.add(i.currency, i.price * i.amount);
      }
      total.push(t.usd());
    }

    return [date, total];
  }
}