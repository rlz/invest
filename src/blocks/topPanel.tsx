import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { c } from "../tools/react";
import { Rub } from "../widgets/spans";
import "./topPanel.scss";

interface Props {
  activeTab: "PF" | "TL";
  onTabClick: (tab: "PF" | "TL") => void;
  onReloadClick: () => void;
  loading: boolean;
  usdPrice?: number;
  eurPrice?: number;
}

export class TopPanelBlock extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render (): JSX.Element {
    const { activeTab, usdPrice, eurPrice, onTabClick } = this.props;

    return (
      <div className='bTopPanel'>
        <div
          className={c("tab", [activeTab === "PF", "active-tab"])}
          onClick={(): void => onTabClick("PF")}
        >Портфель
        </div>
        <div
          className={c("tab", [activeTab === "TL", "active-tab"])}
          onClick={(): void => onTabClick("TL")}
        >История
        </div>
        <div className='spacer' />
        <div>
          USD: <Rub v={usdPrice ?? -1} /> EUR: <Rub v={eurPrice ?? -1} />
        </div>
        <div>
          Выйти
        </div>
        <div>
          {
            this.props.loading ?
              <FontAwesomeIcon icon={faSpinner} pulse /> :
              <button onClick={this.props.onReloadClick}>Обновить</button>
          }
        </div>
      </div>
    );
  }
}