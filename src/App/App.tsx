import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
// import { useDispatch, useSelector } from "react-redux";
import ContentWrapper from '../components/ContentWrapper/ContentWrapper';
import Loader from '../components/Loader/Loader';
// import { fetchGlobal } from "../../store/slices/globalSlice";
import routes from './routes';
// import { clearUser, setUser } from "../../store/slices/userSlice";
import './App.css';

const App = () => {
  // const dispatch = useDispatch();

  // const { isAuthenticated, pending } = useSelector((state) => state.user);
  const isAuthenticated = true;
  const pending = false;

  // useEffect(() => {
  //   dispatch(fetchGlobal());
  // }, []);

  return (
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
                  pathname: '/',
                  state: { authenticated: false },
                }}
              />
            );
          }}
        />
      ))}
    </Switch>
  );
};

export default App;
