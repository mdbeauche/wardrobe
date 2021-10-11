// import { lazy } from "react";
// import { Redirect } from "react-router-dom";
import Sandbox from '../views/Sandbox';
// import HomePage from '../Home/HomePage';
// import Loader from '../Loader/Loader';

// const PharmacyPage = lazy(() => import('../Booth/PharmacyPage'));
// const ShowcasePage = lazy(() => import('../Booth/ShowcasePage'));

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
      isAuth: false,
    },
  },
  // {
  //   path: '/Pharmacy',
  //   exact: true,
  //   name: 'Pharmacy',
  //   component: PharmacyPage,
  //   params: {
  //     isAuth: false,
  //   },
  // },
  // {
  //   path: '/Showcase',
  //   exact: true,
  //   name: 'Showcase',
  //   component: ShowcasePage,
  //   params: {
  //     isAuth: false,
  //   },
  // },
];

// const route404 = {
//   path: "/*",
//   name: "Not Found",
//   component: () => {
//     return (
//       <Redirect
//         to={{
//           pathname: "/",
//         }}
//       />
//     );
//   },
//   params: {
//     isAuth: false,
//   },
// };

// needs to go last in <Switch> list
// routes.push(route404);

export default routes;
