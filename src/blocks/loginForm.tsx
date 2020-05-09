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
        <div className='description'>
          <p>
            Приложение анализирует насколько успешно вы торгуете через сервис «Тинькофф Инвестиции».
          </p>
          <p>
            Приложению требуется API токен только для чтения ваших транзакций
            — приложение не способно совершать операции на бирже.
            Токен используется только для чтения и остается внутри вашего браузера, как и все ваши данные.
          </p>
          <p>
            Исходный код приложения доступен для аудита на{' '}
            <a target='blank' href='https://github.com/rlz/invest'>GitHub</a>.
          </p>
          <p>
            Получениие API токена описано в{' '}
            <a target='blank' href='https://tinkoffcreditsystems.github.io/invest-openapi/auth/'>
              документации к «Тинькофф Инвестиции OpenApi»
            </a>.
          </p>
        </div>
        <div className='disclaimer'>
          <h1>Внимание</h1>
          <p>
            Данное приложение не является официальным прииложениием Тинькофф,
            но созданно независимым разработчиком в исследовательских целях.
          </p>
          <p>
            Вводя свой API токен вы подтверждаете, что осознаете все риски,
            связанные с использованием приложения и берете их на себя.
          </p>
          <p>
            Приложение предоставляется "как есть" без каких-либо гарантий
            и возможно содержит недоработки и ошибки реализации, за которые автор не несет
            никакой ответственности.
          </p>
        </div>
        <form>
          <input
            type='text'
            value={this.state.token}
            onChange={(ev): void => this.setState({ token: ev.target.value })}
            placeholder='API Токен'
            autoFocus
          />
          <button type='button' onClick={(): void => this.onLoginClick()}>Войти</button>
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