import { Link } from 'react-router-dom';
import { useTypedSelector } from '../../hooks/typedRedux';
import { UserState } from '../../store/slices/userSlice';
import Style from './scss/User.module.scss';

const User = () => {
  const user = useTypedSelector((state) => state.user as UserState);

  return (
    <div className={Style.UserContainer}>
      {user.isAuthenticated ? (
        <div className={Style.User}>
          <div>
            <h1>User: {`${user.data.email} [${user.data.id}]`}</h1>
          </div>
          <div>
            <ul>
              Links:
              <li>
                <Link title="Create Blog Post" to="user/createBlogPost">
                  Create Blog Post
                </Link>
              </li>
              <li>
                <Link title="Edit Blog Posts" to="user/editAllBlogPosts">
                  Edit Your Blog Posts
                </Link>
              </li>
            </ul>
          </div>
          <code>{JSON.stringify(user)}</code>
        </div>
      ) : (
        <div className={Style.User}>Not currently authenticated</div>
      )}
    </div>
  );
};

export default User;
