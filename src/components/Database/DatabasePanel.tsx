import { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiDelete, mdiPencil, mdiContentSave } from '@mdi/js';
// import { useTypedSelector, useTypedDispatch } from '../../hooks/typedRedux';
import { SERVER_URI, SERVER_PORT } from '../../config';
import Style from './scss/DatabasePanel.module.scss';

interface Response {
  success: boolean;
  message: String;
  data: Array<Object>;
}

interface TObject {
  [key: string]: string;
}

export default function DatabasePanel({ name }: { name: string }) {
  // const [schema, setSchema] = useState<{
  //   [key: string]: string | undefined;
  // }>({});
  const [schema, setSchema] = useState<TObject>({});
  const [records, setRecords] = useState<Array<any>>([]);
  const [selectedRow, setSelectedRow] = useState('');
  const [selectedCell, setSelectedCell] = useState('');
  const [unlockedRow, setUnlockedRow] = useState('');

  const onKeyPressHandler = (fn: Function) => (event: { key: string }) => {
    if (event.key === 'Enter') {
      fn();
    }
  };

  const getSchema = () => {
    axios({
      method: 'get',
      url: `${SERVER_URI}:${SERVER_PORT}/${name}/schema`,
    })
      .then((_response) =>
        _response.status === 200
          ? (_response.data as Response)
          : ({ success: false } as Response)
      )
      .then((response: Response) => {
        if (response.success === true && Array.isArray(response.data)) {
          setSchema(response.data[0] as TObject);
        }
      });
  };

  const getRecords = () => {
    axios({
      method: 'get',
      url: `${SERVER_URI}:${SERVER_PORT}/${name}`,
    })
      .then((_response) =>
        _response.status === 200
          ? (_response.data as Response)
          : ({ success: false } as Response)
      )
      .then((response: Response) => {
        if (response.success === true && Array.isArray(response.data)) {
          setRecords(response.data);
        }
      });
  };

  const deleteRecord = (id: number) => () => {
    axios({
      method: 'post',
      url: `${SERVER_URI}:${SERVER_PORT}/${name}/${id}/delete`,
    })
      .then((_response) =>
        _response.status === 200
          ? (_response.data as Response)
          : ({ success: false } as Response)
      )
      .then((response: Response) => {
        if (response.success) {
          getRecords();
        } else {
          // TODO
          console.log(`delete record failure: ${JSON.stringify(response)}`);
        }
      });
  };

  const updateRecord = (row: { id: number }) => () => {
    const updates = JSON.parse(JSON.stringify(row));
    delete updates.id;
    delete updates.created_at;
    delete updates.updated_at;

    axios({
      method: 'post',
      url: `${SERVER_URI}:${SERVER_PORT}/${name}/${row.id}/update`,
      data: {
        updates: [updates],
      },
    })
      .then((_response) =>
        _response.status === 200
          ? (_response.data as Response)
          : ({ success: false } as Response)
      )
      .then((response: Response) => {
        if (response.success) {
          getRecords();
        } else {
          // TODO
          console.log(`update record failure: ${JSON.stringify(response)}`);
        }
      });
  };

  useEffect(() => {
    getSchema();
    getRecords();
  }, []);

  return (
    <div className={Style.DatabasePanel}>
      {records.length > 0 && (
        <div>
          <h1>
            Table: {name} [{records.length}]
          </h1>
          <h2>Schema: {JSON.stringify(schema)}</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(records[0]).map((key) => (
                  <th key={`${key}`}>{`${key}`}</th>
                ))}
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {records.map((row) => (
                <tr
                  key={row.id}
                  className={[
                    row.id === unlockedRow ? Style.UnlockedRow : null,
                    row.id === selectedRow ? Style.SelectedRow : null,
                  ]
                    .filter((c) => c)
                    .join(' ')}
                  onClick={() => setSelectedRow(row.id)}
                  onKeyPress={onKeyPressHandler(() => setSelectedRow(row.id))}
                >
                  {Object.entries(row).map(([key, value]) => (
                    <td
                      key={`${row.id}:${key}`}
                      className={
                        selectedCell === `${row.id}:${key}`
                          ? Style.SelectedCell
                          : ''
                      }
                    >
                      <div
                        onClick={() => setSelectedCell(`${row.id}:${key}`)}
                        onKeyPress={onKeyPressHandler(() =>
                          setSelectedCell(`${row.id}:${key}`)
                        )}
                        role="textbox"
                        tabIndex={0}
                      >
                        {unlockedRow === row.id &&
                        selectedCell === `${row.id}:${key}` ? (
                          <>
                            {/* TODO different buttons */}
                            {key.includes('_at') || key === 'id' ? (
                              `${value}`
                            ) : (
                              <>
                                {schema[key]?.includes('char') ? (
                                  <input
                                    type="text"
                                    defaultValue={`${value}`}
                                    maxLength={Number(
                                      schema[key].match(/\((\d+)\)/)![1]
                                    )}
                                  />
                                ) : (
                                  `${value}`
                                )}
                              </>
                            )}
                          </>
                        ) : (
                          `${value}`
                        )}
                      </div>
                    </td>
                  ))}
                  <td>
                    <div
                      style={{
                        visibility:
                          row.id === selectedRow ? 'visible' : 'hidden',
                      }}
                    >
                      <button
                        onClick={() =>
                          setUnlockedRow((prevState) =>
                            prevState !== row.id ? row.id : ''
                          )
                        }
                        onKeyPress={() =>
                          setUnlockedRow((prevState) =>
                            prevState !== row.id ? row.id : ''
                          )
                        }
                        type="button"
                      >
                        <Icon
                          path={mdiPencil}
                          title="Edit Record"
                          size="1.5em"
                        />
                      </button>
                      <button
                        onClick={updateRecord(row)}
                        onKeyPress={onKeyPressHandler(updateRecord(row))}
                        disabled={unlockedRow !== row.id}
                        type="button"
                      >
                        <Icon
                          path={mdiContentSave}
                          title="Save Record"
                          size="1.5em"
                        />
                      </button>
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
                    </div>
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
