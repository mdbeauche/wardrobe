import React, { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useTypedSelector, useTypedDispatch } from '../../hooks/typedRedux';
import { UserState, login } from '../../store/slices/userSlice';
import Style from './scss/Auth.module.scss';

const Auth = () => {
  const { redirect } = useParams<{ redirect?: string }>();
  const user = useTypedSelector((state) => state.user as UserState);
  const dispatch = useTypedDispatch();
  const [authenticated, setAuthenticated] = useState(user.isAuthenticated);

  const onKeyPressHandler = (fn: Function) => (event: { key: string }) => {
    if (event.key === 'Enter') {
      fn();
    }
  };

  const loginUser = (event: React.ChangeEvent<any>) => {
    event.preventDefault();

    dispatch(
      login({
        email: event.target.form.email.value,
        password: event.target.form.password.value,
      })
    );
  };

  useEffect(() => {
    if (user.isAuthenticated) {
      setAuthenticated(true);
    }
  }, [user.isAuthenticated]);

  if (authenticated) {
    return (
      <Redirect
        to={{
          pathname: redirect !== undefined ? `/${redirect}` : '/',
          state: { authenticated: true },
        }}
      />
    );
  }

  return (
    <div className={Style.Auth}>
      <form>
        <div>
          <label htmlFor="email">
            Email:&nbsp;
            <input id="email" type="email" name="email" />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            Password:&nbsp;
            <input id="password" type="password" name="password" />
          </label>
        </div>
        <div>
          <button
            type="submit"
            name="Log In"
            onClick={loginUser}
            onKeyPress={onKeyPressHandler(loginUser)}
          >
            Log In
          </button>
        </div>
        <div
          className={Style.Error}
          style={{ visibility: user.error ? 'visible' : 'hidden' }}
        >
          Error: {JSON.stringify(user.errorMessage)}
        </div>
      </form>
    </div>
  );
};

export default Auth;
