import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import {
  mdiDelete,
  mdiPencil,
  mdiContentSave,
  mdiCheck,
  mdiClose,
  mdiPlus,
} from '@mdi/js';
// import { useTypedSelector, useTypedDispatch } from '../../hooks/typedRedux';
import { SERVER_URI, SERVER_PORT } from '../../config';
import Style from './scss/TablePanel.module.scss';

interface Response {
  success: boolean;
  message: String;
  data: Array<Object>;
}

interface TObject {
  [key: string]: string;
}

export default function TablePanel({ name }: { name: string }) {
  const [schema, setSchema] = useState<TObject>({});
  const [records, setRecords] = useState<Array<any>>([]);
  const [selectedRow, setSelectedRow] = useState('');
  const [selectedCell, setSelectedCell] = useState('');
  const [unlockedRow, setUnlockedRow] = useState('');
  const [cellUpdate, setCellUpdate] = useState<TObject>({});
  const [rowUpdate, setRowUpdate] = useState<TObject>({});
  const [createNewRow, setCreateNewRow] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
          // also reset selections
          setSelectedRow('');
          setSelectedCell('');
          setUnlockedRow('');
          setCellUpdate({});
          setRowUpdate({});
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
          setSuccess(`Success: ${response.message}`);
        } else {
          console.log(`Failed to delete record ${id}: ${response.message}`);
          setError(`Failed to delete record ${id}: ${response.message}`);
        }
      });
  };

  const updateRecord = useCallback(
    (id: number) => () => {
      const updates = [];

      for (const key in rowUpdate) {
        if (Object.prototype.hasOwnProperty.call(rowUpdate, key)) {
          updates.push({ field: key, value: rowUpdate[key] });
        }
      }

      axios({
        method: 'post',
        url: `${SERVER_URI}:${SERVER_PORT}/${name}/${id}/update`,
        data: {
          updates,
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
            setSuccess(`Success: updated record  ${id}`);
          } else {
            console.log(`Failed to update record ${id}: ${response.message}`);
            setError(`Failed to update record ${id}: ${response.message}`);
          }
        });
    },
    [rowUpdate]
  );

  const createRecord = useCallback(() => {
    axios({
      method: 'post',
      url: `${SERVER_URI}:${SERVER_PORT}/${name}/create`,
      data: { record: rowUpdate },
    })
      .then((_response) =>
        _response.status === 200
          ? (_response.data as Response)
          : ({ success: false } as Response)
      )
      .then((response: Response) => {
        if (response.success) {
          getRecords();
          setCreateNewRow(false);
          setSuccess(`Success: ${response.message}`);
        } else {
          console.log(`Failed to create record: ${response.message}`);
          setError(`Failed to create record: ${response.message}`);
        }
      });
  }, [rowUpdate]);

  const saveEditCallback = useCallback(
    (event) => {
      setRowUpdate((prevUpdate) => ({ ...prevUpdate, ...cellUpdate }));
      setSelectedCell('');
      event.stopPropagation();
    },
    [cellUpdate]
  );

  useEffect(() => {
    getSchema();
    getRecords();
  }, []);

  return (
    <div className={Style.TablePanel}>
      {Object.keys(schema).length > 0 && (
        <>
          <h1>
            Table: {name} [{records.length}]
          </h1>
          <table>
            <thead>
              <tr>
                <th>
                  <button
                    type="button"
                    onClick={() => setCreateNewRow((prev) => !prev)}
                  >
                    <Icon path={mdiPlus} title="Create Record" size="0.8em" />
                  </button>
                </th>
                <th>id</th>
                <th>created_at</th>
                <th>updated_at</th>
                {Object.keys(schema).map((key) => (
                  <th key={`${key}`} title={`${schema[key]}`}>
                    {`${key}`}
                  </th>
                ))}
                <th>&nbsp;</th>
              </tr>
              {success !== '' && (
                <tr className={Style.Success}>
                  <td colSpan={Object.keys(schema).length + 4}>{success}</td>
                  <td>
                    <button
                      onClick={() => setSuccess('')}
                      onKeyPress={onKeyPressHandler(() => setSuccess(''))}
                      type="button"
                    >
                      <Icon path={mdiClose} title="Close Result" size="2em" />
                    </button>
                  </td>
                </tr>
              )}
              {error !== '' && (
                <tr className={Style.Error}>
                  <td colSpan={Object.keys(schema).length + 4}>{error}</td>
                  <td>
                    <button
                      onClick={() => setError('')}
                      onKeyPress={onKeyPressHandler(() => setError(''))}
                      type="button"
                    >
                      <Icon path={mdiClose} title="Close Error" size="2em" />
                    </button>
                  </td>
                </tr>
              )}
              {createNewRow && (
                <tr className={Style.NewRow}>
                  <td>&nbsp;</td>
                  <td>id</td>
                  <td>created_at</td>
                  <td>updated_at</td>
                  {Object.keys(schema).length > 0 &&
                    Object.keys(schema).map((key) => (
                      <td key={key}>
                        <div
                          className={
                            rowUpdate[key] === undefined
                              ? Style.RequiredCell
                              : ''
                          }
                          onClick={() => setSelectedCell(`new:${key}`)}
                          onKeyPress={onKeyPressHandler(() =>
                            setSelectedCell(`new:${key}`)
                          )}
                          role="textbox"
                          tabIndex={0}
                        >
                          {selectedCell === `new:${key}` ? (
                            <>
                              {schema[key]?.includes('int') && (
                                <input
                                  type="number"
                                  defaultValue={
                                    rowUpdate[key] !== undefined
                                      ? rowUpdate[key]
                                      : ''
                                  }
                                  min={0}
                                  max={
                                    schema[key]?.includes('(')
                                      ? Number(
                                          schema[key].match(/\((\d+)\)/)![1]
                                        )
                                      : undefined
                                  }
                                  onChange={(event) =>
                                    setCellUpdate({
                                      [key]: event.target.value,
                                    })
                                  }
                                />
                              )}
                              {schema[key]?.includes('char') ||
                              schema[key]?.includes('text') ? (
                                <>
                                  <textarea
                                    autoComplete="on"
                                    // eslint-disable-next-line jsx-a11y/no-autofocus
                                    autoFocus
                                    maxLength={
                                      schema[key]?.includes('(')
                                        ? Number(
                                            schema[key].match(/\((\d+)\)/)![1]
                                          )
                                        : undefined
                                    }
                                    defaultValue={
                                      rowUpdate[key] !== undefined
                                        ? rowUpdate[key]
                                        : ''
                                    }
                                    onBlur={(event) => {
                                      // onBlur called when textarea loses focus -> save updates
                                      setCellUpdate({
                                        [key]: event.target.value,
                                      });
                                    }}
                                  />
                                </>
                              ) : (
                                ''
                              )}
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedCell('');
                                  setCellUpdate({});
                                }}
                                onKeyPress={onKeyPressHandler(
                                  (event: Event) => {
                                    event.stopPropagation();
                                    setSelectedCell('');
                                    setCellUpdate({});
                                  }
                                )}
                                type="button"
                              >
                                <Icon
                                  path={mdiClose}
                                  title="Cancel Edit"
                                  size="1em"
                                />
                              </button>
                              <button
                                onClick={saveEditCallback}
                                onKeyPress={onKeyPressHandler(saveEditCallback)}
                                type="button"
                              >
                                <Icon
                                  path={mdiCheck}
                                  title="Save Edit"
                                  size="1em"
                                />
                              </button>
                            </>
                          ) : (
                            <>
                              {rowUpdate[key] !== undefined
                                ? rowUpdate[key]
                                : schema[key]}
                            </>
                          )}
                        </div>
                      </td>
                    ))}
                  <td>
                    <div>
                      <button
                        onClick={createRecord}
                        onKeyPress={onKeyPressHandler(createRecord)}
                        type="button"
                      >
                        <Icon
                          path={mdiContentSave}
                          title="Save Record"
                          size="1.5em"
                        />
                      </button>
                      <button
                        onClick={() => {
                          setCellUpdate({});
                          setRowUpdate({});
                          setCreateNewRow(false);
                        }}
                        onKeyPress={onKeyPressHandler(() => {
                          setCellUpdate({});
                          setRowUpdate({});
                          setCreateNewRow(false);
                        })}
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
              )}
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
                  <td>&nbsp;</td>
                  {Object.entries(row).map(([key, value]) => (
                    <td
                      key={`${row.id}:${key}`}
                      className={[
                        selectedCell === `${row.id}:${key}`
                          ? Style.SelectedCell
                          : '',
                        unlockedRow === row.id && rowUpdate[key] !== undefined
                          ? Style.ModifiedCell
                          : '',
                      ]
                        .filter((c) => c)
                        .join()}
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
                            {key.includes('_at') || key === 'id' ? (
                              `${value}`
                            ) : (
                              <>
                                <>
                                  {schema[key]?.includes('int') && (
                                    <input
                                      type="number"
                                      defaultValue={
                                        rowUpdate[key] !== undefined
                                          ? rowUpdate[key]
                                          : `${value}`
                                      }
                                      min={0}
                                      max={
                                        schema[key]?.includes('(')
                                          ? Number(
                                              schema[key].match(/\((\d+)\)/)![1]
                                            )
                                          : undefined
                                      }
                                      onChange={(event) =>
                                        setCellUpdate({
                                          [key]: event.target.value,
                                        })
                                      }
                                    />
                                  )}
                                  {schema[key]?.includes('char') ||
                                  schema[key]?.includes('text') ? (
                                    <>
                                      <textarea
                                        autoComplete="on"
                                        // eslint-disable-next-line jsx-a11y/no-autofocus
                                        autoFocus
                                        maxLength={
                                          schema[key]?.includes('(')
                                            ? Number(
                                                schema[key].match(
                                                  /\((\d+)\)/
                                                )![1]
                                              )
                                            : undefined
                                        }
                                        defaultValue={
                                          rowUpdate[key] !== undefined
                                            ? rowUpdate[key]
                                            : `${value}`
                                        }
                                        onBlur={(event) => {
                                          // onBlur when textarea loses focus -> save updates
                                          setCellUpdate({
                                            [key]: event.target.value,
                                          });
                                        }}
                                      />
                                    </>
                                  ) : (
                                    ''
                                  )}
                                  <button
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedCell('');
                                      setCellUpdate({});
                                    }}
                                    onKeyPress={onKeyPressHandler(
                                      (event: Event) => {
                                        event.stopPropagation();
                                        setSelectedCell('');
                                        setCellUpdate({});
                                      }
                                    )}
                                    type="button"
                                  >
                                    <Icon
                                      path={mdiClose}
                                      title="Cancel Edit"
                                      size="1em"
                                    />
                                  </button>
                                  <button
                                    onClick={saveEditCallback}
                                    onKeyPress={onKeyPressHandler(
                                      saveEditCallback
                                    )}
                                    type="button"
                                  >
                                    <Icon
                                      path={mdiCheck}
                                      title="Save Edit"
                                      size="1em"
                                    />
                                  </button>
                                </>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {unlockedRow === row.id &&
                            rowUpdate[key] !== undefined
                              ? rowUpdate[key]
                              : `${value}`}
                          </>
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
                        onClick={() => {
                          setUnlockedRow((prevState) =>
                            prevState !== row.id ? row.id : ''
                          );
                          setCellUpdate({});
                          setRowUpdate({});
                        }}
                        onKeyPress={onKeyPressHandler(() => {
                          setUnlockedRow((prevState) =>
                            prevState !== row.id ? row.id : ''
                          );
                          setCellUpdate({});
                          setRowUpdate({});
                        })}
                        type="button"
                      >
                        <Icon
                          path={mdiPencil}
                          title="Edit Record"
                          size="1.5em"
                        />
                      </button>
                      <button
                        onClick={updateRecord(row.id)}
                        onKeyPress={onKeyPressHandler(updateRecord(row.id))}
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
                        disabled={unlockedRow === row.id}
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
        </>
      )}
    </div>
  );
}
