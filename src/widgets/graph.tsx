import { DateTime } from 'luxon';
import React from "react";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";
import { Currency } from '../api/common';
import { fNum } from './spans';

// const componentCounter = 0;

type ValType = Currency | "PERCENT";
interface SeriaOpts {
  label: string;
  data: number[];
}

interface Props {
  timestamps: number[];

  valType: ValType;

  s1: SeriaOpts;
  s2?: SeriaOpts;
  s3?: SeriaOpts;
  s4?: SeriaOpts;
}

function formatYear (d: Date): string {
  return d.getFullYear().toString();
}

function formatMonth (d: Date): string {
  return ["Янв", "Фев", "Мар", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек"][d.getMonth()];
}

function formatDate (d: Date): string {
  const date = d.getDate();
  return date < 10 ? `0${date}` : date.toString();
}

function formatHour (d: Date): string {
  const h = d.getHours();
  return h < 10 ? `0${h}` : h.toString();
}

interface DateFormatSpec {
  timeGap: number;
  regularFormat: (date: Date) => string;
  yearGapFormat?: (date: Date) => string;
  monthGapFormat?: (date: Date) => string;
  dayGapFormat?: (date: Date) => string;
}

const dateFormatSpecs: DateFormatSpec[] = [
  {
    timeGap: 365 * 24 * 60 * 60,
    regularFormat: formatYear,
  },
  {
    timeGap: 28 * 24 * 60 * 60,
    regularFormat: formatMonth,
    yearGapFormat: (d): string => `${formatMonth(d)}\n${formatYear(d)}`
  },
  {
    timeGap: 24 * 60 * 60,
    regularFormat: formatDate,
    yearGapFormat: (d): string => `${formatDate(d)}\n${formatYear(d)}, ${formatMonth(d)}`,
    monthGapFormat: (d): string => `${formatDate(d)}\n${formatMonth(d)}`,
  },
  {
    timeGap: 60 * 60,
    regularFormat: formatHour,
    dayGapFormat: (d): string => `${formatHour(d)}\n${formatDate(d)} ${formatMonth(d)}`,
    yearGapFormat: (d): string => `${formatHour(d)}\n${formatDate(d)} ${formatMonth(d)} ${formatYear(d)}`
  },
  {
    timeGap: 60,
    regularFormat: (d): string => DateTime.fromJSDate(d).toFormat("HH:mm"),
    dayGapFormat: (d): string => `${DateTime.fromJSDate(d).toFormat("HH:mm")}\n${formatDate(d)} ${formatMonth(d)} ${formatYear(d)}`,
  },
  {
    timeGap: 1,
    regularFormat: (d): string => DateTime.fromJSDate(d).toFormat("HH:mm:ss"),
    dayGapFormat: (d): string => `${DateTime.fromJSDate(d).toFormat("HH:mm:ss")}\n${formatDate(d)} ${formatMonth(d)} ${formatYear(d)}`,
  },
  {
    timeGap: 0,
    regularFormat: (d): string => DateTime.fromJSDate(d).toFormat("HH:mm:ss.SSS"),
    dayGapFormat: (d): string => `${DateTime.fromJSDate(d).toFormat("HH:mm:ss.SSS")}\n${formatDate(d)} ${formatMonth(d)} ${formatYear(d)}`,
  }
];

function formatDateVals (self: unknown, splits: number[]): string[] {
  const gap = Math.ceil((splits[1] - splits[0]) * 1000) / 1000;
  const s = dateFormatSpecs.find(function (e) { return gap >= e.timeGap; });

  if (s === undefined) throw Error("Too small gap");

  // these track boundaries when a full label is needed again
  let prevY: number | null = null;
  let prevM: number | null = null;
  let prevDate: number | null = null;

  return splits.map((ts) => {
    const d = new Date(ts * 1000);

    const y = d.getFullYear();
    const m = d.getMonth();
    const date = d.getDate();

    const diffY = y !== prevY;
    const diffM = m !== prevM;
    const diffDate = date !== prevDate;

    prevY = y;
    prevM = m;
    prevDate = date;

    if (diffY && s.yearGapFormat !== undefined) return s.yearGapFormat(d);
    if (diffM && s.monthGapFormat !== undefined) return s.monthGapFormat(d);
    if (diffDate && s.dayGapFormat !== undefined) return s.dayGapFormat(d);
    return s.regularFormat(d);
  });
}

function roundDigits (val: number, digits: number): number {
  return Math.round(val * 10 * digits) / (10 * digits);
}

function formatValShort (val: number, type: ValType): string {
  if (type === "PERCENT") {
    return val.toFixed(0) + "%";
  }

  const curSign = { RUB: "\u20BD", USD: "$", EUR: "\u20AC" }[type];

  if (val > 1000000) {
    return `${curSign}${(val / 1000000).toFixed(0)}м`;
  }

  if (val > 1000) {
    return `${curSign}${(val / 1000).toFixed(0)}т`;
  }

  if (val > 100) {
    return `${curSign}${roundDigits(val / 1000, 1)}т`;
  }

  return `${curSign}${(val).toFixed(0)}`;
}

function formatValLong (val: number, type: ValType): string {
  if (type === "PERCENT") {
    return val.toFixed(2) + "%";
  }

  const curSign = { RUB: "\u20BD", USD: "$", EUR: "\u20AC" }[type];

  return `${curSign} ${fNum(val)}`;
}

class Graph<P extends Props> extends React.Component<P> {
  // private id: number;
  private uplot!: uPlot
  private el: HTMLDivElement | null = null

  private resizeListener = (): void => {
    if (this.el === null) return;

    this.uplot.setSize({ width: this.el.clientWidth, height: 300 });
  };

  constructor(props: P) {
    super(props);
    // this.id = componentCounter++;
  }

  componentDidMount (): void {
    if (this.el === null) throw Error("No element?");

    window.addEventListener("resize", this.resizeListener);

    const { s1, s2, s3, s4 } = this.props;

    const data = [
      this.props.timestamps, s1.data
    ];
    const seriesOpts = {
      width: 2,
      value: (_: uPlot, v: number): string => formatValLong(v, this.props.valType)
    };

    const series: uPlot.Series[] = [
      {
        value: (_, timestamp): string => {
          const d = new Date(timestamp * 1000);
          return `${formatDate(d)} ${formatMonth(d)} ${formatYear(d)}`;
        }
      },
      { ...seriesOpts, label: s1.label, stroke: "#003f5c", fill: "#003f5c30", }
    ];

    if (s2 !== undefined) {
      data.push(s2.data);
      series.push({ ...seriesOpts, label: s2.label, stroke: "#7a5195", fill: "#7a519530" });
    }

    if (s3 !== undefined) {
      data.push(s3.data);
      series.push({ ...seriesOpts, label: s3.label, stroke: "#ef5675", fill: "#ef567530", });
    }

    if (s4 !== undefined) {
      data.push(s4.data);
      series.push({ label: s4.label, stroke: "#ffa600", fill: "#ffa60030", });
    }

    const opts: uPlot.Options = {
      width: this.el.clientWidth,
      height: 300,
      series,
      axes: [
        {
          values: formatDateVals
        },
        {
          values: (_, splits): string[] => splits.map(s => formatValShort(s, this.props.valType))
        }
      ]
    };

    this.uplot = new uPlot(opts, data, this.el);
  }

  componentDidUpdate (): void {
    const { s1, s2, s3, s4 } = this.props;

    const data = [
      this.props.timestamps, s1.data
    ];

    if (s2 !== undefined) {
      data.push(s2.data);
    }

    if (s3 !== undefined) {
      data.push(s3.data);
    }

    if (s4 !== undefined) {
      data.push(s4.data);
    }

    this.uplot.setData(data);
  }

  componentWillUnmount (): void {
    window.removeEventListener("resize", this.resizeListener);
  }

  render (): JSX.Element {
    return (
      <div ref={(el): void => { this.el = el; }} />
    );
  }
}

interface Props1 {
  timestamps: number[];
  valType: ValType;
  s1: SeriaOpts;
}

export class Graph1 extends Graph<Props1> { }

interface Props2 {
  timestamps: number[];
  valType: ValType;
  s1: SeriaOpts;
  s2: SeriaOpts;
}

export class Graph2 extends Graph<Props2> { }
