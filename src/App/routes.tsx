// import { lazy } from "react";
import { Redirect } from 'react-router-dom';
import Sandbox from '../views/Sandbox';
import Auth from '../components/Auth/Auth';
// import Loader from '../Loader/Loader';

// const LazyPage = lazy(() => import('../Booth/LazyPage'));

const routes = [
  // {
  //   path: '/loader',
  //   exact: true,
  //   name: 'Loader Test',
  //   component: Loader,
  //   params: {
  //     isAuth: false,
  //   },
  // },
  {
    path: '/',
    exact: true,
    name: 'Sandbox',
    component: Sandbox,
    params: {
      isAuth: true,
    },
  },
  {
    path: '/login/:redirect?',
    exact: false,
    name: 'Login',
    component: Auth,
    params: {
      isAuth: false,
    },
  },
  // {
  //   path: '/Lazy',
  //   exact: true,
  //   name: 'Lazy',
  //   component: LazyPage,
  //   params: {
  //     isAuth: false,
  //   },
  // },
];

const route404 = {
  path: '/*',
  name: 'Not Found',
  exact: false,
  component: () => (
    <Redirect
      to={{
        pathname: `/`,
        state: { authenticated: false },
      }}
    />
  ),
  params: {
    isAuth: false,
  },
};

// needs to go last in <Switch> list
routes.push(route404);

export default routes;
