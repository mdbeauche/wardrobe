import { ReactChildren } from 'react';
import Header from '../components/Header/Header';
import Style from './scss/Home.module.scss';

const Home = ({ children }: { children: ReactChildren }) => (
  <>
    <a href="#main-content" className="sr-only sr-only-focusable">
      Skip to main content
    </a>
    <Header />
    <main id="main-content" role="main" className={Style.Home}>
      {children}
    </main>
    {/* <Footer /> */}
  </>
);

export default Home;
