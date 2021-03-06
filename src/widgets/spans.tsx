import React from 'react';
import { Currency } from '../api/common';
import { c } from '../tools/react';
import "./spans.scss";

export function fNum (v: number): string {
  return (Math.round(v * 100) / 100).toLocaleString("ru-RU");
}

export const Rub = (props: { v: number; color?: boolean }): JSX.Element => {
  const cls = c('currency rub', [props.v > 0, "positive"], [props.v < 0, "negative"], [props.color === true, "color"]);
  return <span className={cls}>{'\u20BD'} {fNum(props.v)}</span>;
};

export const Usd = (props: { v: number; color?: boolean }): JSX.Element => {
  const cls = c('currency usd', [props.v > 0, "positive"], [props.v < 0, "negative"], [props.color === true, "color"]);
  return <span className={cls}>$ {fNum(props.v)}</span>;
};

export const Eur = (props: { v: number; color?: boolean }): JSX.Element => {
  const cls = c('currency eur', [props.v > 0, "positive"], [props.v < 0, "negative"], [props.color === true, "color"]);
  return <span className={cls}>{'\u20AC'} {fNum(props.v)}</span>;
};

export const Cur = (props: { t: Currency; v: number; color?: boolean }): JSX.Element => {
  const { t, v } = props;

  if (t === "RUB")
    return <Rub v={v} color={props.color} />;

  if (t === "USD")
    return <Usd v={v} color={props.color} />;

  return <Eur v={v} color={props.color} />;
};

export const Prc = (props: { v: number; color?: boolean }): JSX.Element => {
  const cls = c('percent', [props.v > 0, "positive"], [props.v < 0, "negative"], [props.color === true, "color"]);
  return <span className={cls}>{fNum(props.v * 100)}%</span>;
};
