// import { lazy } from "react";
import { Redirect } from 'react-router-dom';
import Sandbox from '../components/Sandbox/Sandbox';
import Auth from '../components/Auth/Auth';
import Blog from '../components/Blog/Blog';
import TotalBlogPosts from '../components/Blog/TotalBlogPosts';
import SingleBlogPost from '../components/Blog/SingleBlogPost';
import User from '../components/User/User';
import CreateBlogPost from '../components/User/CreateBlogPost';
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
  {
    path: '/blog',
    exact: true,
    name: 'Blog',
    component: Blog,
    params: {
      isAuth: false,
    },
  },
  {
    path: '/blog/all',
    exact: true,
    name: 'TotalBlogPosts',
    component: TotalBlogPosts,
    params: {
      isAuth: false,
    },
  },
  {
    path: '/blog/:id',
    exact: false,
    name: 'SingleBlogPost',
    component: SingleBlogPost,
    params: {
      isAuth: false,
    },
  },
  {
    path: '/user',
    exact: true,
    name: 'User',
    component: User,
    params: {
      isAuth: true,
    },
  },
  {
    path: '/user/createBlogPost',
    exact: true,
    name: 'Create Blog Post',
    component: CreateBlogPost,
    params: {
      isAuth: true,
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
