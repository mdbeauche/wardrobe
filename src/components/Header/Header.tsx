import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiHome } from '@mdi/js';
import { useTypedSelector } from '../../hooks/typedRedux';
import { UserState } from '../../store/slices/userSlice';
import Style from './scss/Header.module.scss';

const Header = () => {
  const user = useTypedSelector((state) => state.user as UserState);

  return (
    <header className={Style.Header} role="banner">
      <nav className={Style.HeaderNav} aria-labelledby="hdr_label">
        <h2 id="hdr_label" className="sr-only">
          Header Navigation
        </h2>
        <div className={Style.HeaderNavLinks}>
          <div>
            <Icon path={mdiHome} title="Home Logo WIP" size="2em" />
          </div>
          <div>
            <Link title="Home" to="/">
              Home
            </Link>
          </div>
          <div>
            <Link title="Blog" to="/blog">
              Blog
            </Link>
          </div>
          <div>
            <Link title="User" to="/user">
              User
            </Link>
          </div>
          {user.isAuthenticated && (
            <div>
              <Link title="Database" to="/">
                Database
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
