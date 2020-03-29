import React from "react";
import { setApiToken } from '../api/token';
import "./loginForm.scss";

interface Props {
  onLoggedIn: () => void;
}

interface State {
  token: string;
}

export class LoginForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      token: ""
    };
  }

  render (): JSX.Element {
    return (
      <div className='bLoginForm'>
        <form>
          <input
            type='text'
            value={this.state.token}
            onChange={(ev): void => this.setState({ token: ev.target.value })}
            placeholder='API Token'
            autoFocus
          />
          <button type='button' onClick={(): void => this.onLoginClick()}>Login</button>
        </form>
      </div>
    );
  }

  onLoginClick (): void {
    if (this.state.token === "") return;

    setApiToken(this.state.token);

    this.props.onLoggedIn();
  }
}