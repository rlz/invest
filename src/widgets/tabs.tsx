import React from "react";
import "./tabs.scss";

interface Props {
  activeTab: "PF" | "TL";
  onTabClick: (tab: "PF" | "TL") => void;
}

export class Tabs extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render (): JSX.Element {
    return (
      <div className='cTabs'>
        <div
          className={this.props.activeTab === "PF" ? "cTabs-active-tab" : ""}
          onClick={(): void => this.props.onTabClick("PF")}
        >Портфель
        </div>
        <div
          className={this.props.activeTab === "TL" ? "cTabs-active-tab" : ""}
          onClick={(): void => this.props.onTabClick("TL")}
        >История
        </div>
      </div>
    );
  }
}