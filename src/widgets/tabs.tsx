import React from "react";
import "./tabs.scss";

interface Props {
  activeTab: 0 | 1;
  onTabClick: (tab: 0 | 1) => void;
}

export class Tabs extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render (): JSX.Element {
    return (
      <div className='cTabs'>
        <div
          className={this.props.activeTab === 0 ? "cTabs-active-tab" : ""}
          onClick={(): void => this.props.onTabClick(0)}
        >Портфель
        </div>
        <div
          className={this.props.activeTab === 1 ? "cTabs-active-tab" : ""}
          onClick={(): void => this.props.onTabClick(1)}
        >История
        </div>
      </div>
    );
  }
}