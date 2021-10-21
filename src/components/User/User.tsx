import { Link } from 'react-router-dom';
import { useTypedSelector } from '../../hooks/typedRedux';
import { UserState } from '../../store/slices/userSlice';
import Style from './scss/User.module.scss';

const Auth = () => {
  const user = useTypedSelector((state) => state.user as UserState);

  return (
    <div className={Style.User}>
      <h1>
        {user.isAuthenticated ? (
          <>
            <div>User: {`${user.data.email} [${user.data.id}]`}</div>
            <div>
              <ul>
                Links:
                <li>
                  <Link title="Create Blog Post" to="user/createBlogPost">
                    Create Blog Post
                  </Link>
                </li>
              </ul>
            </div>
            <code>{JSON.stringify(user)}</code>
          </>
        ) : (
          <>Not currently authenticated</>
        )}
      </h1>
    </div>
  );
};

export default Auth;
