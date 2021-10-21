import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js';
import { useTypedSelector } from '../../hooks/typedRedux';
import { UserState } from '../../store/slices/userSlice';
import { SERVER_PORT, SERVER_URI, PAGINATION_SIZE } from '../../config';
import Style from './scss/EditAllBlogPosts.module.scss';

interface Response {
  success: boolean;
  message: String;
  data: Array<any>;
}

const onKeyPressHandler = (fn: Function) => (event: { key: string }) => {
  if (event.key === 'Enter') {
    fn();
  }
};

const EditAllBlogPosts = () => {
  const user = useTypedSelector((state) => state.user as UserState);
  const [blogPosts, setBlogPosts] = useState<Array<any>>([]);
  const [totalBlogPosts, setTotalBlogPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const getBlogPosts = (page: number) => {
    axios({
      method: 'get',
      url: `${SERVER_URI}:${SERVER_PORT}/table/blog_posts/query`,
      params: {
        page,
        query: {
          column: 'author',
          value: user.data.id,
        },
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

  useEffect(() => {
    getBlogPosts(currentPage);
  }, [currentPage]);

  return (
    <div className={Style.EditAllBlogPostsContainer}>
      {user.isAuthenticated ? (
        <div className={Style.EditAllBlogPosts}>
          <div>
            <h1>Edit your blog posts</h1>
          </div>
          <div>
            {blogPosts.length > 0 && (
              <>
                <div className={Style.Controls}>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    onKeyPress={onKeyPressHandler(() =>
                      setCurrentPage(currentPage - 1)
                    )}
                    disabled={currentPage <= 0}
                    type="button"
                  >
                    <Icon
                      path={mdiArrowLeft}
                      title="Previous Page"
                      size="1.5em"
                    />
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={Math.ceil(totalBlogPosts / PAGINATION_SIZE)}
                    value={currentPage}
                    onChange={(event) =>
                      setCurrentPage(Number(event.target.value))
                    }
                  />
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    onKeyPress={onKeyPressHandler(() =>
                      setCurrentPage(currentPage + 1)
                    )}
                    disabled={
                      totalBlogPosts < (currentPage + 1) * PAGINATION_SIZE
                    }
                    type="button"
                  >
                    <Icon path={mdiArrowRight} title="Next Page" size="1.5em" />
                  </button>
                </div>
                <ul>
                  {blogPosts.map((post) => (
                    <li key={post.id}>
                      <Link title="Edit Blog Post" to={`/blog/edit/${post.id}`}>
                        Edit Post {post.id}
                      </Link>
                      &nbsp;{post.title}{' '}
                      <span className={Style.Timestamp}>
                        {post.created_at}]
                      </span>
                    </li>
                  ))}
                </ul>
                <div className={Style.Controls}>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    onKeyPress={onKeyPressHandler(() =>
                      setCurrentPage(currentPage - 1)
                    )}
                    disabled={currentPage <= 0}
                    type="button"
                  >
                    <Icon
                      path={mdiArrowLeft}
                      title="Previous Page"
                      size="1.5em"
                    />
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={Math.ceil(totalBlogPosts / PAGINATION_SIZE)}
                    value={currentPage}
                    onChange={(event) =>
                      setCurrentPage(Number(event.target.value))
                    }
                  />
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    onKeyPress={onKeyPressHandler(() =>
                      setCurrentPage(currentPage + 1)
                    )}
                    disabled={
                      totalBlogPosts < (currentPage + 1) * PAGINATION_SIZE
                    }
                    type="button"
                  >
                    <Icon path={mdiArrowRight} title="Next Page" size="1.5em" />
                  </button>
                </div>
              </>
            )}
          </div>
          <code>{JSON.stringify(user)}</code>
        </div>
      ) : (
        <div className={Style.EditAllBlogPosts}>
          Not currently authenticated
        </div>
      )}
    </div>
  );
};

export default EditAllBlogPosts;
