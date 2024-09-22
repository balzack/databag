import {useState, useEffect, useRef} from 'react';
import {DatabagSDK, Session} from 'databag-client-sdk';
import {SessionStore} from '../SessionStore';
import {LocalStore} from '../LocalStore';
const DATABAG_DB = 'db_v202.db';
const SETTINGS_DB = 'ls_v001.db';

export function useAppContext() {
  const local = useRef(new LocalStore());
  const sdk = useRef(new DatabagSDK(null));
  const [state, setState] = useState({
    session: null as null | Session,
    fullDayTime: false,
    monthFirstDate: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  const setup = async () => {
    await local.current.open(SETTINGS_DB);
    const fullDayTime = await local.current.get('time_format', '12h') === '24h';
    const monthFirstDate = await local.current.get('date_format', 'month_first') === 'month_first';
    
    const store = new SessionStore();
    await store.open(DATABAG_DB);
    const session: Session | null = await sdk.current.initOfflineStore(store);
    if (session) {
      updateState({session, fullDayTime, monthFirstDate});
    }
  };

  useEffect(() => {
    setup();
  }, []);

  const actions = {
    setMonthFirstDate: async (monthFirstDate: boolean) => {
      updateState({ monthFirstDate });
      await local.current.set('date_format', monthFirstDate ? 'month_first' : 'day_first');
    },
    setFullDayTime: async (fullDayTime: boolean) => {
      updateState({ fullDayTime });
      await local.current.set('time_format', fullDayTime ? '24h' : '12h');
    },
    accountLogin: async (
      username: string,
      password: string,
      node: string,
      secure: boolean,
      code: string,
    ) => {
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

      console.log('SDK LOGIN:', username, password, node, secure);

      const login = await sdk.current.login(
        username,
        password,
        node,
        secure,
        code,
        params,
      );
      updateState({session: login});
    },
    accountLogout: async () => {
      if (state.session) {
        await sdk.current.logout(state.session, false);
        updateState({session: null});
      }
    },
    accountCreate: async (
      handle: string,
      password: string,
      node: string,
      secure: boolean,
      token: string,
    ) => {
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
      const session = await sdk.current.create(
        handle,
        password,
        node,
        secure,
        token,
        params,
      );
      updateState({session});
    },
    accountAccess: async (node: string, secure: boolean, token: string) => {
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
      const session = await sdk.current.access(node, secure, token, params);
      updateState({session});
    },
    getAvailable: async (node: string, secure: boolean) => {
      return await sdk.current.available(node, secure);
    },
    getUsername: async (
      username: string,
      token: string,
      node: string,
      secure: boolean,
    ) => {
      return await sdk.current.username(username, token, node, secure);
    },
    adminLogin: async (
      token: string,
      node: string,
      secure: boolean,
      code: string,
    ) => {
      const login = await sdk.current.configure(node, secure, token, code);
      updateState({node: login});
    },
    adminLogout: async () => {
      updateState({node: null});
    },
  };

  return {state, actions};
}
