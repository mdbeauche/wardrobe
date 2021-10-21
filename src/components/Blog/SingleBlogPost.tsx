import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URI, SERVER_PORT } from '../../config';
import Style from './scss/Blog.module.scss';

interface Response {
  success: boolean;
  message: String;
  data: Array<any>;
}

const Blog = () => {
  const { id = '0' } = useParams<{ id?: string }>();
  // console.log('params:', params);

  const [blogPost, setBlogPost] = useState<any>({});

  const getBlogPost = (postId: string) => {
    axios({
      method: 'get',
      url: `${SERVER_URI}:${SERVER_PORT}/table/blog_posts/${postId}`,
    })
      .then((_response) =>
        _response.status === 200
          ? (_response.data as Response)
          : ({ success: false } as Response)
      )
      .then((response: Response) => {
        if (response.success === true && Array.isArray(response.data)) {
          setBlogPost(response.data[0]);
        }
      });
  };

  useEffect(() => {
    getBlogPost(id);
  }, []);

  return (
    <div className={Style.BlogContainer}>
      <div className={Style.Blog}>
        <div className={Style.BlogTitle}>
          <h1>Welcome to my personal blog</h1>
        </div>
        {Object.keys(blogPost).length > 0 && (
          <>
            <div className={Style.BlogPostMain}>
              <h2>{blogPost.title}</h2>
              <span className={Style.Timestamp}>
                {new Date(blogPost.created_at).toDateString()}
              </span>
              <div
                className={Style.BlogPostMainBody}
                // text was sanitized with dompurify before being saved in database
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: blogPost.body }}
              />
            </div>
            <div className={Style.Controls}>
              <Link to="all" title="All Blog Posts">
                All Blog Posts
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
