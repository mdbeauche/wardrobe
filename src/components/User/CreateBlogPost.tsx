import { useState, useCallback } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';
import DOMPurify from 'dompurify';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiContentSave } from '@mdi/js';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useTypedSelector } from '../../hooks/typedRedux';
import { UserState } from '../../store/slices/userSlice';
import { SERVER_URI, SERVER_PORT } from '../../config';
import Style from './scss/CreateBlogPost.module.scss';

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

const CreateBlogPost = () => {
  const user = useTypedSelector((state) => state.user as UserState);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [title, setTitle] = useState(`New Post ${new Date().toDateString()}`);
  const [postCreated, setPostCreated] = useState(false);
  const [postPreview, setPostPreview] = useState('');
  const [error, setError] = useState('');

  const saveBlogPost = useCallback(() => {
    const html = convertToHTML(editorState.getCurrentContent());
    const body = DOMPurify.sanitize(html);

    const blogPost = {
      author: user.data.id,
      title,
      body,
    };

    setPostPreview(body);

    axios({
      method: 'post',
      url: `${SERVER_URI}:${SERVER_PORT}/table/blog_posts/create`,
      data: { record: blogPost },
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
          setError(`Failed to create record: ${response.message}`);
        }
      });
  }, [title, editorState]);

  return (
    <div className={Style.CreateBlogPostContainer}>
      {postCreated === false ? (
        <div className={Style.CreateBlogPost}>
          <div>
            <h1>Write a blog post about it</h1>
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
              onClick={saveBlogPost}
              onKeyPress={onKeyPressHandler(saveBlogPost)}
            >
              <Icon
                path={mdiContentSave}
                title="Create Blog Post"
                size="1.5em"
              />
              &nbsp;Create Blog Post
            </button>
            {error !== '' && <span>{error}</span>}
          </div>
        </div>
      ) : (
        <div className={Style.CreateBlogPost}>
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
        </div>
      )}
    </div>
  );
};

export default CreateBlogPost;
