import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { EditorState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';
import DOMPurify from 'dompurify';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiContentSave } from '@mdi/js';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useTypedSelector } from '../../hooks/typedRedux';
import { UserState } from '../../store/slices/userSlice';
import Error from '../Error/Error';
import { SERVER_URI, SERVER_PORT } from '../../config';
import Style from './scss/EditBlogPost.module.scss';

interface Response {
  success: boolean;
  message: String;
  data: Array<Object>;
}

const onKeyPressHandler = (fn: Function) => (event: { key: string }) => {
  if (event.key === 'Enter') {
    fn();
  }
};

const EditBlogPost = () => {
  const { id = '0' } = useParams<{ id?: string }>();
  const user = useTypedSelector((state) => state.user as UserState);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [author, setAuthor] = useState(-1);
  const [title, setTitle] = useState(`New Post ${new Date().toDateString()}`);
  const [postCreated, setPostCreated] = useState(false);
  const [postPreview, setPostPreview] = useState('');
  const [error, setError] = useState('');

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
          const post = response.data[0] as {
            author: number;
            title: string;
            body: string;
          };

          setAuthor(post.author);

          setTitle(post.title);

          setEditorState(
            EditorState.createWithContent(stateFromHTML(post.body))
          );
        }
      });
  };

  const saveEditedBlogPost = useCallback(() => {
    const html = convertToHTML(editorState.getCurrentContent());
    const body = DOMPurify.sanitize(html);

    setPostPreview(body);

    axios({
      method: 'post',
      url: `${SERVER_URI}:${SERVER_PORT}/table/blog_posts/update/${id}`,
      data: {
        id,
        updates: [
          { field: 'title', value: title },
          { field: 'body', value: body },
        ],
      },
    })
      .then((_response) =>
        _response.status === 200
          ? (_response.data as Response)
          : ({ success: false } as Response)
      )
      .then((response: Response) => {
        if (response.success) {
          setPostCreated(true);
        } else {
          setError(`Failed to update record: ${response.message}`);
        }
      });
  }, [title, editorState]);

  useEffect(() => {
    getBlogPost(id);
  }, []);

  if (author !== -1) {
    if (user.data.id !== author) {
      return (
        <Error
          error="You are not the author of this post."
          location={window.location}
        />
      );
    }
  }

  return (
    <div className={Style.EditBlogPost}>
      {postCreated === false ? (
        <>
          <div>
            <h1>Edit your blog post</h1>
            <h2>
              Title:{' '}
              <input
                type="text"
                defaultValue={title}
                maxLength={255}
                onChange={(event) => setTitle(event.target.value)}
              />
            </h2>
            <h3>as {user.data.email}</h3>
          </div>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName={Style.EditorWrapper}
            editorClassName={Style.EditorBody}
            toolbarClassName={Style.EditorToolbar}
          />
          <div>
            <button
              type="button"
              onClick={saveEditedBlogPost}
              onKeyPress={onKeyPressHandler(saveEditedBlogPost)}
            >
              <Icon
                path={mdiContentSave}
                title="Update Blog Post"
                size="1.5em"
              />
              &nbsp;Update Blog Post
            </button>
            {error !== '' && <span>{error}</span>}
          </div>
        </>
      ) : (
        <>
          <div className={Style.BlogPostMain}>
            <h1>Preview:</h1>
            <h2>{title}</h2>
            <div
              className={Style.BlogPostMainBody}
              // text was sanitized with dompurify before being saved in database
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: postPreview }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default EditBlogPost;
