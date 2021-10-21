import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js';
import { SERVER_URI, SERVER_PORT, PAGINATION_SIZE } from '../../config';
import Style from './scss/TotalBlogPosts.module.scss';

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

const TotalBlogPosts = () => {
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

  useEffect(() => {
    getBlogPosts(currentPage);
  }, [currentPage]);

  return (
    <div className={Style.BlogContainer}>
      <div className={Style.TotalBlogPosts}>
        <div className={Style.BlogTitle}>
          <h1>Total Blog Posts</h1>
        </div>
        {totalBlogPosts > PAGINATION_SIZE && (
          <div className={Style.Controls}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              onKeyPress={onKeyPressHandler(() =>
                setCurrentPage(currentPage - 1)
              )}
              disabled={currentPage <= 0}
              type="button"
            >
              <Icon path={mdiArrowLeft} title="Previous Page" size="1.5em" />
            </button>
            <input
              type="number"
              min={0}
              max={Math.ceil(totalBlogPosts / PAGINATION_SIZE)}
              value={currentPage}
              onChange={(event) => setCurrentPage(Number(event.target.value))}
            />
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              onKeyPress={onKeyPressHandler(() =>
                setCurrentPage(currentPage + 1)
              )}
              disabled={totalBlogPosts < (currentPage + 1) * PAGINATION_SIZE}
              type="button"
            >
              <Icon path={mdiArrowRight} title="Next Page" size="1.5em" />
            </button>
          </div>
        )}
        {blogPosts.map((post) => (
          <div className={Style.BlogPost} key={post.id}>
            <h2 className={Style.BlogTitle}>
              <Link to={`${post.id}`} title={post.title}>
                {post.title}
              </Link>
              <span className={Style.Timestamp}>
                {' '}
                [{new Date(post.created_at).toDateString()}]
              </span>
            </h2>
            <div
              className={Style.BlogPostBody}
              // text was sanitized with dompurify before being saved in database
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </div>
        ))}
        {totalBlogPosts > PAGINATION_SIZE && (
          <div className={Style.Controls}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              onKeyPress={onKeyPressHandler(() =>
                setCurrentPage(currentPage - 1)
              )}
              disabled={currentPage <= 0}
              type="button"
            >
              <Icon path={mdiArrowLeft} title="Previous Page" size="1.5em" />
            </button>
            <input
              type="number"
              min={0}
              max={Math.ceil(totalBlogPosts / PAGINATION_SIZE)}
              value={currentPage}
              onChange={(event) => setCurrentPage(Number(event.target.value))}
            />
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              onKeyPress={onKeyPressHandler(() =>
                setCurrentPage(currentPage + 1)
              )}
              disabled={totalBlogPosts < (currentPage + 1) * PAGINATION_SIZE}
              type="button"
            >
              <Icon path={mdiArrowRight} title="Next Page" size="1.5em" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalBlogPosts;
