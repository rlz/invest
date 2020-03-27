import React from "react";
import { c } from "../tools/react";
import "./daysSwitch.scss";

interface P {
  drawAllTime: boolean;
  drawDay1: boolean;
  drawDay7: boolean;
  drawDay30: boolean;

  setFlags: (drawAllTime: boolean, drawDay1: boolean, drawDay7: boolean, drawDay30: boolean) => void;
}

export class DaysSwitch extends React.Component<P> {
  render (): JSX.Element {
    const { drawAllTime, drawDay1, drawDay7, drawDay30, setFlags } = this.props;

    return (
      <div className='cDaysSwitch'>
        <div
          className={c("all-time-switch", [drawAllTime, "active"])}
          onClick={(): void => setFlags(!drawAllTime, drawDay1, drawDay7, drawDay30)}
        >
          <div className={c("all-time-mark", [drawAllTime, "active"])} />
          за все время
        </div>
        <div className='radio-switch'>
          <div
            className={c("", [drawDay1, "active"])}
            onClick={(): void => setFlags(drawAllTime, true, false, false)}
          >
            за день
          </div>
          <div
            className={c("", [drawDay7, "active"])}
            onClick={(): void => setFlags(drawAllTime, false, true, false)}
          >
            за 7 дней
          </div>
          <div
            className={c("", [drawDay30, "active"])}
            onClick={(): void => setFlags(drawAllTime, false, false, true)}
          >
            за 30 дней
          </div>
        </div>
      </div>
    );
  }
}