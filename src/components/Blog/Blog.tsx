import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URI, SERVER_PORT } from '../../config';
import Style from './scss/Blog.module.scss';

interface Response {
  success: boolean;
  message: String;
  data: Array<any>;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<Array<any>>([]);
  const [totalBlogPosts, setTotalBlogPosts] = useState(0);

  const getBlogPosts = () => {
    axios({
      method: 'get',
      url: `${SERVER_URI}:${SERVER_PORT}/table/blog_posts/order`,
      params: {
        page: 0,
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
    getBlogPosts();
  }, []);

  return (
    <div className={Style.BlogContainer}>
      <div className={Style.Blog}>
        <div className={Style.BlogTitle}>
          <h1>Welcome to my personal blog</h1>
        </div>
        {blogPosts.length > 0 && (
          <>
            <div className={Style.BlogPostMain}>
              <h2>
                <Link to={`blog/${blogPosts[0].id}`} title={blogPosts[0].title}>
                  {blogPosts[0].title}
                </Link>
                &nbsp;
                <span className={Style.Timestamp}>
                  {new Date(blogPosts[0].created_at).toDateString()}
                </span>
              </h2>
              <div
                className={Style.BlogPostMainBody}
                // text was sanitized with dompurify before being saved in database
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: blogPosts[0].body }}
              />
            </div>
            <div className={Style.OlderPosts}>
              <h3>Older Posts</h3>
              {blogPosts.slice(1, 4).map((post) => (
                <React.Fragment key={post.id}>
                  <h4>
                    <Link to={`blog/${post.id}`} title={post.title}>
                      {post.title}
                    </Link>
                    &nbsp;
                    <span className={Style.Timestamp}>
                      {new Date(post.created_at).toDateString()}
                    </span>
                  </h4>
                  <div
                    className={Style.OlderPost}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: post.body }}
                  />
                </React.Fragment>
              ))}
            </div>
            <div className={Style.Controls}>
              <Link to="blog/all">Total Blog Posts</Link> [{totalBlogPosts}]
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
