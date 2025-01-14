import {useState, useEffect, useRef} from 'react';
import {DatabagSDK, Session, Focus} from 'databag-client-sdk';
import {SessionStore} from '../SessionStore';
import {NativeCrypto} from '../NativeCrypto';
import {LocalStore} from '../LocalStore';
import { StagingFiles } from '../StagingFiles'
import messaging from '@react-native-firebase/messaging';
const DATABAG_DB = 'db_v239.db';
const SETTINGS_DB = 'ls_v001.db';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('**** FIREBASE Authorization status:', authStatus);
  }
}

const databag = new DatabagSDK(
  {
    tagBatch: 24,
    topicBatch: 24,
    articleTypes: [],
    channelTypes: ['sealed', 'superbasic'],
  },
  new NativeCrypto(),
  new StagingFiles(),
);

const notifications = [
    { event: 'contact.addCard', messageTitle: 'New Contact Request' },
    { event: 'contact.updateCard', messageTitle: 'Contact Update' },
    { event: 'content.addChannel.superbasic', messageTitle: 'New Topic' },
    { event: 'content.addChannel.sealed', messageTitle: 'New Topic' },
    { event: 'content.addChannelTopic.superbasic', messageTitle: 'New Topic Message' },
    { event: 'content.addChannelTopic.sealed', messageTitle: 'New Topic Message' },
    { event: 'ring', messageTitle: 'Incoming Call' },
  ];

export function useAppContext() {
  const local = useRef(new LocalStore());
  const sdk = useRef(databag);
  const [state, setState] = useState({
    session: null as null | Session,
    focus: null as null | Focus,
    fullDayTime: false,
    monthFirstDate: true,
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  const setup = async () => {
    await local.current.open(SETTINGS_DB);
    const fullDayTime = (await local.current.get('time_format', '12h')) === '24h';
    const monthFirstDate = (await local.current.get('date_format', 'month_first')) === 'month_first';

    const store = new SessionStore();
    await store.open(DATABAG_DB);
    const session: Session | null = await sdk.current.initOfflineStore(store);
    if (session) {
      updateState({session, fullDayTime, monthFirstDate});
    }
  };

  useEffect(() => {
    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actions = {
    setMonthFirstDate: async (monthFirstDate: boolean) => {
      updateState({monthFirstDate});
      await local.current.set('date_format', monthFirstDate ? 'month_first' : 'day_first');
    },
    setFullDayTime: async (fullDayTime: boolean) => {
      updateState({fullDayTime});
      await local.current.set('time_format', fullDayTime ? '24h' : '12h');
    },
    accountLogin: async (username: string, password: string, node: string, secure: boolean, code: string) => {
      await requestUserPermission();
      const deviceToken = await messaging().getToken();

      const params = {
        topicBatch: 16,
        tagBatch: 16,
        channelTypes: ['test'],
        pushType: 'fcm',
        deviceToken: deviceToken,
        notifications: notifications,
        deviceId: '0011',
        version: '0.0.1',
        appName: 'databag',
      };

      const login = await sdk.current.login(username, password, node, secure, code, params);
      updateState({session: login});
    },
    accountLogout: async (all: boolean) => {
      if (state.session) {
        await sdk.current.logout(state.session, all);
        updateState({session: null});
      }
    },
    accountRemove: async () => {
      if (state.session) {
        await sdk.current.remove(state.session);
        updateState({session: null});
      }
    },
    accountCreate: async (handle: string, password: string, node: string, secure: boolean, token: string) => {
      await requestUserPermission();
      const deviceToken = await messaging().getToken();

      const params = {
        topicBatch: 16,
        tagBatch: 16,
        channelTypes: ['test'],
        pushType: 'fcm',
        deviceToken: deviceToken,
        notifications: notifications,
        deviceId: '0011',
        version: '0.0.1',
        appName: 'databag',
      };
      const session = await sdk.current.create(handle, password, node, secure, token, params);
      updateState({session});
    },
    accountAccess: async (node: string, secure: boolean, token: string) => {
      await requestUserPermission();
      const deviceToken = await messaging().getToken();

      const params = {
        topicBatch: 16,
        tagBatch: 16,
        channelTypes: ['test'],
        pushType: 'fcm',
        deviceToken: deviceToken,
        notifications: notifications,
        deviceId: '0011',
        version: '0.0.1',
        appName: 'databag',
      };
      const session = await sdk.current.access(node, secure, token, params);
      updateState({session});
    },
    setFocus: async (cardId: string | null, channelId: string) => {
      if (state.session) {
        const focus = await state.session.setFocus(cardId, channelId);
        updateState({ focus });
      }
    },
    clearFocus: () => {
      if (state.session) { 
        state.session.clearFocus();
        updateState({ focus: null });
      }
    },
    getAvailable: async (node: string, secure: boolean) => {
      return await sdk.current.available(node, secure);
    },
    getUsername: async (username: string, token: string, node: string, secure: boolean) => {
      return await sdk.current.username(username, token, node, secure);
    },
    adminLogin: async (token: string, node: string, secure: boolean, code: string) => {
      const login = await sdk.current.configure(node, secure, token, code);
      updateState({node: login});
    },
    adminLogout: async () => {
      updateState({node: null});
    },
  };

  return {state, actions};
}
