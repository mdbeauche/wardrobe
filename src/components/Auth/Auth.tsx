import React, { useState } from 'react';
import axios from 'axios';
// import Icon from '@mdi/react';
// import { mdiDatabaseEdit } from '@mdi/js';
import { SERVER_URI, SERVER_PORT } from '../../config';
import Style from './scss/Auth.module.scss';

interface Response {
  success: boolean;
  message: String;
  data: Array<Object>;
}

const Auth = () => {
  const [error, setError] = useState(null);

  const onKeyPressHandler = (fn: Function) => (event: { key: string }) => {
    if (event.key === 'Enter') {
      fn();
    }
  };

  const login = (event: React.ChangeEvent<any>) => {
    event.preventDefault();

    // TODO: move into the store
    axios({
      method: 'post',
      url: `${SERVER_URI}:${SERVER_PORT}/login`,
      data: {
        email: event.target.form.email.value,
        password: event.target.form.password.value,
      },
    })
      .then((_response) =>
        _response.status === 200
          ? (_response.data as Response)
          : ({ success: false } as Response)
      )
      .then((response: Response) => {
        if (response.success === false) {
          console.log('fail response');
        }

        if (response.success === true && Array.isArray(response.data)) {
          console.log('success response');
          console.log(response.data);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className={Style.Auth}>
      <form>
        <div>
          <label htmlFor="email">
            Email:
            <input id="email" type="email" name="email" />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            Password:
            <input id="password" type="password" name="password" />
          </label>
        </div>
        <div>
          <button
            type="submit"
            name="Log In"
            onClick={login}
            onKeyPress={onKeyPressHandler(login)}
          >
            Log In
          </button>
        </div>
        {error && <div>Error: {JSON.stringify(error)}</div>}
      </form>
    </div>
  );
};

export default Auth;
