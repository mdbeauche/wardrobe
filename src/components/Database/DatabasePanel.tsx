import { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiDelete, mdiPencil } from '@mdi/js';
// import { useTypedSelector, useTypedDispatch } from '../../hooks/typedRedux';
import { SERVER_URI, SERVER_PORT } from '../../config';
import Style from './scss/DatabasePanel.module.scss';

export default function DatabasePanel({ name }: { name: String }) {
  // setup here
  const [getData, setGetData] = useState<Array<any>>([]);
  const [selectedRow, setSelectedRow] = useState('');

  const onKeyPressHandler = (fn: Function) => (event: { key: String }) => {
    if (event.key === 'Enter') {
      fn();
    }
  };

  const deleteRecord = (id: number) => () => {
    axios({
      method: 'post',
      url: `${SERVER_URI}:${SERVER_PORT}/${name}/${id}/delete`,
    })
      .then((_response) => (_response.status === 200 ? _response.data : []))
      .then((data) => {
        if (Array.isArray(data)) {
          console.log('response:', data);
        } else {
          console.log('response not array:', data);
        }
      });
  };

  useEffect(() => {
    axios({
      method: 'get',
      url: `${SERVER_URI}:${SERVER_PORT}/${name}`,
    })
      .then((_response) => (_response.status === 200 ? _response.data : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setGetData(data);
        }
      });
  }, []);

  return (
    <div className={Style.DatabasePanel}>
      {getData.length > 0 && (
        <div>
          <h1>
            Table: {name} [{getData.length}]
          </h1>
          <table>
            <thead>
              <tr>
                {Object.keys(getData[0]).map((key) => (
                  <th key={`${key}`}>{`${key}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getData.map((row) => (
                <tr
                  key={row.id}
                  className={row.id === selectedRow ? Style.SelectedRow : ''}
                  onClick={() => {
                    setSelectedRow(row.id);
                  }}
                >
                  {Object.entries(row).map(([key, value]) => (
                    <td key={`${key}:${value}`}>{`${value}`}</td>
                  ))}
                  <td>
                    {row.id === selectedRow && (
                      <>
                        <Icon
                          path={mdiPencil}
                          title="Edit Record"
                          size="1.5em"
                        />
                        <button
                          onClick={deleteRecord(row.id)}
                          onKeyPress={onKeyPressHandler(deleteRecord(row.id))}
                          type="button"
                        >
                          <Icon
                            path={mdiDelete}
                            title="Delete Record"
                            size="1.5em"
                          />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
