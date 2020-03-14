import React from 'react';
import { Currency } from '../api/common';

export const Rub = (props: { v: number }): JSX.Element => {
  return <span className='currency rub'>{'\u20BD'}{props.v.toFixed(2)}</span>;
};

export const Usd = (props: { v: number }): JSX.Element => {
  return <span className='currency usd'>${props.v.toFixed(2)}</span>;
};

export const Eur = (props: { v: number }): JSX.Element => {
  return <span className='currency eur'>{'\u20AC'}{props.v.toFixed(2)}</span>;
};

export const Cur = (props: { t: Currency; v: number }): JSX.Element => {
  const { t, v } = props;

  if (t === "RUB")
    return <Rub v={v} />;

  if (t === "USD")
    return <Usd v={v} />;

  return <Eur v={v} />;
};
