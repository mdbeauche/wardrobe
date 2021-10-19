import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useTypedSelector } from '../hooks/typedRedux';
import { UserState } from '../store/slices/userSlice';
import ContentWrapper from '../components/ContentWrapper/ContentWrapper';
import Loader from '../components/Loader/Loader';
import routes from './routes';
import './App.scss';

const App = () => {
  const { isAuthenticated, pending } = useTypedSelector(
    (state) => state.user as UserState
  );

  return (
    <div className="viewport">
      <Switch>
        {routes.map((route) => (
          <Route
            key={route.name}
            path={route.path}
            exact={route.exact}
            render={() => {
              const { isAuth = false } = route.params || {};

              // need to reset scroll position in between page change
              if (typeof window !== 'undefined') {
                window.scrollTo(0, 0);
              }

              if (!isAuth || (isAuth && isAuthenticated)) {
                return (
                  <ContentWrapper>
                    <route.component key={Date.now()} />
                  </ContentWrapper>
                );
              }

              if (isAuth && pending) {
                return <Loader />;
              }

              // unauthenticated
              return (
                <Redirect
                  to={{
                    pathname: `/login${route.path}`,
                    state: { authenticated: false },
                  }}
                />
              );
            }}
          />
        ))}
      </Switch>
    </div>
  );
};

export default App;
