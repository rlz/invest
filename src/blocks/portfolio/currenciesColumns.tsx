import React from "react";
import { Currency } from "../../api/common";
import { toEur, toRub, toUsd } from "../../tools/currencies";
import { Eur, Rub, Usd } from "../../widgets/spans";

interface Props {
  cur: Currency;
  amount: number;
  usdPrice: number;
  eurPrice: number;
  color?: boolean;
}

export class CurrenciesColumns extends React.Component<Props> {
  render (): JSX.Element {
    const { cur, amount, usdPrice, eurPrice, color } = this.props;

    return (
      <>
        <td key='total-rub' className='all-cur'><Rub v={toRub(cur, amount, usdPrice, eurPrice)} color={color} /></td>
        <td key='total-usd' className='all-cur'><Usd v={toUsd(cur, amount, usdPrice, eurPrice)} color={color} /></td>
        <td key='total-eur' className='all-cur'><Eur v={toEur(cur, amount, usdPrice, eurPrice)} color={color} /></td>
      </>
    );
  }
}

export class EmptyCurrenciesColunms extends React.Component {
  render (): JSX.Element {
    return (
      <>
        <td key='total-rub' className='all-cur' />
        <td key='total-usd' className='all-cur' />
        <td key='total-eur' className='all-cur' />
      </>
    );
  }
}