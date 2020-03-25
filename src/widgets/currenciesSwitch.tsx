import React from "react";
import { Currency } from '../api/common';
import { c } from "../tools/react";
import "./currenciesSwitch.scss";

interface P {
  currency: Currency;
  onCurSwitch: (currebcy: Currency) => void;
}

export class CurrenciesSwitch extends React.Component<P> {
  render (): JSX.Element {
    const cur = this.props.currency;

    return (
      <div className='cCurrenciesSwitch'>
        <div
          className={c("", [cur === "RUB", "active"])}
          onClick={(): void => this.props.onCurSwitch("RUB")}
        >
          в Рублях
        </div>
        <div
          className={c("", [cur === "USD", "active"])}
          onClick={(): void => this.props.onCurSwitch("USD")}
        >
          в Долларах
        </div>
        <div
          className={c("", [cur === "EUR", "active"])}
          onClick={(): void => this.props.onCurSwitch("EUR")}
        >
          в Евро
        </div>
      </div>
    );
  }
}