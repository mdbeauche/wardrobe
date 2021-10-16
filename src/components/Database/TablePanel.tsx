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
  mdiMessageOutline,
  mdiMessageAlertOutline,
  mdiArrowLeft,
  mdiArrowRight,
} from '@mdi/js';
// import { useTypedSelector, useTypedDispatch } from '../../hooks/typedRedux';
import { SERVER_URI, SERVER_PORT, PAGINATION_SIZE } from '../../config';
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
  const [totalRecords, setTotalRecords] = useState(0);
  const [records, setRecords] = useState<Array<any>>([]);
  const [currentPage, setCurrentPage] = useState(0);
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

  const getData = () => {
    axios({
      method: 'get',
      url: `${SERVER_URI}:${SERVER_PORT}/${name}/data`,
    })
      .then((_response) =>
        _response.status === 200
          ? (_response.data as Response)
          : ({ success: false } as Response)
      )
      .then((response: Response) => {
        if (response.success === true && Array.isArray(response.data)) {
          setSchema(response.data[0] as TObject);
          setTotalRecords(response.data[1] as number);
          setRecords(response.data[2] as Array<any>);
        }
      });
  };

  const getRecords = (page: number) => {
    axios({
      method: 'get',
      url: `${SERVER_URI}:${SERVER_PORT}/${name}`,
      params: {
        page,
      },
    })
      .then((_response) =>
        _response.status === 200
          ? (_response.data as Response)
          : ({ success: false } as Response)
      )
      .then((response: Response) => {
        if (response.success === true && Array.isArray(response.data)) {
          setRecords(response.data);
          setCurrentPage(page);
          // also reset selections
          setSelectedRow('');
          setSelectedCell('');
          setUnlockedRow('');
          setCellUpdate({});
          setRowUpdate({});
        }
      });
  };

  const deleteRecord = useCallback(
    (id: number) => () => {
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
            getRecords(currentPage);
            setSuccess(`Success: ${response.message}`);
          } else {
            console.log(`Failed to delete record ${id}: ${response.message}`);
            setError(`Failed to delete record ${id}: ${response.message}`);
          }
        });
    },
    [currentPage]
  );

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
            getRecords(currentPage);
            setSuccess(`Success: updated record  ${id}`);
          } else {
            console.log(`Failed to update record ${id}: ${response.message}`);
            setError(`Failed to update record ${id}: ${response.message}`);
          }
        });
    },
    [rowUpdate, currentPage]
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
          getRecords(currentPage);
          setCreateNewRow(false);
          setSuccess(`Success: ${response.message}`);
        } else {
          console.log(`Failed to create record: ${response.message}`);
          setError(`Failed to create record: ${response.message}`);
        }
      });
  }, [rowUpdate, currentPage]);

  const saveEditCallback = useCallback(
    (event) => {
      setRowUpdate((prevUpdate) => ({ ...prevUpdate, ...cellUpdate }));
      setSelectedCell('');
      event.stopPropagation();
    },
    [cellUpdate]
  );

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={Style.TablePanel}>
      {Object.keys(schema).length > 0 && (
        <>
          <h1>
            Table: {name} [{totalRecords}]
          </h1>
          <table>
            <thead>
              <tr>
                <th>
                  <button
                    type="button"
                    onClick={() => setCreateNewRow((prev) => !prev)}
                  >
                    <Icon path={mdiPlus} title="Create Record" size="1.5em" />
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
                {/* <th>&nbsp;</th> */}
                <th>
                  <button
                    onClick={() => getRecords(currentPage - 1)}
                    onKeyPress={onKeyPressHandler(() =>
                      getRecords(currentPage - 1)
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
                  <button
                    onClick={() => getRecords(currentPage + 1)}
                    onKeyPress={onKeyPressHandler(() =>
                      getRecords(currentPage + 1)
                    )}
                    disabled={
                      totalRecords < (currentPage + 1) * PAGINATION_SIZE
                    }
                    type="button"
                  >
                    <Icon path={mdiArrowRight} title="Next Page" size="1.5em" />
                  </button>
                </th>
              </tr>
              {success !== '' && (
                <tr className={Style.Success}>
                  <td>
                    <Icon
                      path={mdiMessageOutline}
                      title="Result Message"
                      size="1.5em"
                    />
                  </td>
                  <td colSpan={Object.keys(schema).length + 3}>{success}</td>
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
                  <td>
                    <Icon
                      path={mdiMessageAlertOutline}
                      title="Error Message"
                      size="1.5em"
                    />
                  </td>
                  <td colSpan={Object.keys(schema).length + 3}>{error}</td>
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
                  {['id', 'created_at', 'updated_at'].map((key) => (
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
                        {`${row[key]}`}
                      </div>
                    </td>
                  ))}
                  {Object.entries(row)
                    .filter(([key]) => !key.includes('_at') && key !== 'id')
                    .map(([key, value]) => (
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
                                            schema[key].match(/\((\d+)\)/)![1]
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
              {totalRecords > records.length ? (
                <tr>
                  <td colSpan={Object.keys(schema).length + 3} />
                  <td>Page {currentPage}</td>
                  <td>
                    <button
                      onClick={() => getRecords(currentPage - 1)}
                      onKeyPress={onKeyPressHandler(() =>
                        getRecords(currentPage - 1)
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
                    <button
                      onClick={() => getRecords(currentPage + 1)}
                      onKeyPress={onKeyPressHandler(() =>
                        getRecords(currentPage + 1)
                      )}
                      disabled={
                        totalRecords < (currentPage + 1) * PAGINATION_SIZE
                      }
                      type="button"
                    >
                      <Icon
                        path={mdiArrowRight}
                        title="Next Page"
                        size="1.5em"
                      />
                    </button>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
