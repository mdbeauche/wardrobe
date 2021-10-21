import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTypedSelector } from '../../hooks/typedRedux';
import { UserState } from '../../store/slices/userSlice';
import { SERVER_PORT, SERVER_URI } from '../../config';
import Style from './scss/User.module.scss';

interface Response {
  success: boolean;
  message: String;
  data: Array<any>;
}

const Auth = () => {
  const user = useTypedSelector((state) => state.user as UserState);
  const [blogPosts, setBlogPosts] = useState<Array<any>>([]);
  const [totalBlogPosts, setTotalBlogPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const getBlogPosts = (page: number) => {
    axios({
      method: 'get',
      url: `${SERVER_URI}:${SERVER_PORT}/table/blog_posts/order`,
      params: {
        page,
        orders: [
          {
            field: 'created_at',
            ascending: false,
          },
        ],
      },
    })
      .then((_response) =>
        _response.status === 200
          ? (_response.data as Response)
          : ({ success: false } as Response)
      )
      .then((response: Response) => {
        if (response.success === true && Array.isArray(response.data)) {
          setBlogPosts(response.data[0]);
          setTotalBlogPosts(response.data[1]);
        }
      });
  };

  console.log('totalBlogPosts:', totalBlogPosts);
  console.log('setCurrentPage:', setCurrentPage);

  useEffect(() => {
    getBlogPosts(currentPage);
  }, [currentPage]);

  return (
    <div className={Style.User}>
      {user.isAuthenticated ? (
        <>
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
              {blogPosts.length > 0 && (
                <li>
                  Edit Blog Post:
                  <ul>
                    {blogPosts.map((post) => (
                      <li key={post.id}>
                        <Link
                          title="Edit Blog Post"
                          to={`blog/edit/${post.id}`}
                        >
                          Edit Post {post.id}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </div>
          <code>{JSON.stringify(user)}</code>
        </>
      ) : (
        <>Not currently authenticated</>
      )}
    </div>
  );
};

export default Auth;
