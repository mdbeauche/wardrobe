import { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiDatabaseEdit } from '@mdi/js';
import TablePanel from './TablePanel';
import { SERVER_URI, SERVER_PORT } from '../../config';
import Style from './scss/DatabasePanel.module.scss';

interface Response {
  success: boolean;
  message: String;
  data: Array<Object>;
}

const DatabasePanel = () => {
  const [table, setTable] = useState('');
  const [tables, setTables] = useState<Array<any>>([]);

  const onKeyPressHandler = (fn: Function) => (event: { key: string }) => {
    if (event.key === 'Enter') {
      fn();
    }
  };

  useEffect(() => {
    // get list of databases
    axios({
      method: 'get',
      url: `${SERVER_URI}:${SERVER_PORT}/tables`,
    })
      .then((_response) =>
        _response.status === 200
          ? (_response.data as Response)
          : ({ success: false } as Response)
      )
      .then((response: Response) => {
        if (response.success === true && Array.isArray(response.data)) {
          setTables(response.data);
        }
      });
  }, []);

  return (
    <div className={Style.DatabasePanel}>
      {table === '' ? (
        <>
          <h1>Tables:</h1>
          <ul>
            {tables.map(({ table: tableName, count }) => (
              <li key={tableName}>
                <button
                  type="button"
                  onClick={() => setTable(tableName)}
                  onKeyPress={onKeyPressHandler(() => setTable(tableName))}
                >
                  <Icon
                    path={mdiDatabaseEdit}
                    title="Edit Database"
                    size="2em"
                  />
                </button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                {`${tableName} [${count}]`}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setTable('')}
            onKeyPress={onKeyPressHandler(() => setTable(''))}
          >
            Go back
          </button>
          <TablePanel name={table} />
        </>
      )}
    </div>
  );
};

export default DatabasePanel;
