import {useState, useEffect} from 'react';
import {DatabagSDK, SqlStore, Session} from 'databag-client-sdk';
import SQLite from 'react-native-sqlite-storage';
const DATABAG_DB = 'db_v200.db';

class Store implements SqlStore {
  private db: any = null;

  constructor() {
    SQLite.DEBUG(false);
    SQLite.enablePromise(true);
  }

  public async open(path: string) {
    this.db = await SQLite.openDatabase({name: path, location: 'default'});
  }

  public async set(
    stmt: string,
    params: (string | number | null)[],
  ): Promise<void> {
    await this.db.executeSql(stmt, params);
  }

  public async get(
    stmt: string,
    params: (string | number | null)[],
  ): Promise<any[]> {
    const res = await this.db.executeSql(stmt, params);
    const rows = [];
    if (res[0] && res[0].rows && res[0].rows > 1) {
      for (let i = 0; i < res[0].rows.length; i++) {
        rows.push(res[0].rows.item(i));
      }
    }
    return rows;
  }
}

export function useAppContext() {
  const [state, setState] = useState({
    accountMfa: (boolean = false),
    accountSet: (boolean = false),
    adminMfa: (boolean = false),
    adminSet: (boolean = false),
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const sdk = new DatabagSDK(null);
    const store = new Store();
    await store.open(DATABAG_DB);
    const session = await sdk.initOfflineStore(store);
    if (session) {
      console.log('init session');
      updateState({accountSet: true, sdk, session});
    } else {
      const params = {
        topicBatch: 16,
        tagBatch: 16,
        channelTypes: ['test'],
        pushType: 'fcm',
        deviceToken: 'aabbcc',
        notifications: [{event: 'msg', messageTitle: 'msgd'}],
        deviceId: '0011',
        version: '0.0.1',
        appName: 'databag',
      };
      console.log('-----> SDK LOGIN');
      try {
        const login = await sdk.login(
          'asdf',
          'asdf',
          'https://balzack.coredb.org',
          null,
          params,
        );
        console.log(login);
        updateState({accountSet: true, sdk, session: login});
      } catch (err) {
        console.log('ERR:', err);
      }
    }
  };

  const actions = {
    loginAccount: async (
      handle: string,
      password: string,
      url: string,
      mfaCode: string | null,
    ) => {},
    accessAccount: async (url: string, token: string) => {},
    createAccount: async (
      handle: string,
      password: string,
      url: string,
      token: string | null,
    ) => {},
    logoutAccount: async () => {},
    loginAdmin: async (
      token: string,
      url: string,
      mfaCode: string | null,
    ) => {},
    logoutAdmin: async () => {},
  };

  return {state, actions};
}
