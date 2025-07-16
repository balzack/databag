import {useState, useEffect, useRef} from 'react';
import {DatabagSDK, Service, Session, Focus} from 'databag-client-sdk';
import {NativeModules, Platform, PermissionsAndroid} from 'react-native';
import {SessionStore} from '../SessionStore';
import {NativeCrypto} from '../NativeCrypto';
import {LocalStore} from '../LocalStore';
import {StagingFiles} from '../StagingFiles';
import {UnsentTopic} from 'AppContext';

const DATABAG_DB = 'db_v251.db';
const SETTINGS_DB = 'ls_v003.db';

const databag = new DatabagSDK(
  {
    channelTypes: ['sealed', 'superbasic'],
  },
  new NativeCrypto(),
  new StagingFiles(),
);

const notifications = [
  {event: 'contact.addCard', messageTitle: 'New Contact Request'},
  {event: 'contact.updateCard', messageTitle: 'Contact Update'},
  {event: 'content.addChannel.superbasic', messageTitle: 'New Topic'},
  {event: 'content.addChannel.sealed', messageTitle: 'New Topic'},
  {event: 'content.addChannelTopic.superbasic', messageTitle: 'New Topic Message'},
  {event: 'content.addChannelTopic.sealed', messageTitle: 'New Topic Message'},
  {event: 'ring', messageTitle: 'Incoming Call'},
];

export function useAppContext() {
  const local = useRef(new LocalStore());
  const sdk = useRef(databag);
  const topics = useRef(new Map<string, UnsentTopic>());
  const [state, setState] = useState({
    service: null as null | Service,
    session: null as null | Session,
    focus: null as null | Focus,
    favorite: [] as {cardId: null | string; channelId: string}[],
    fullDayTime: false,
    monthFirstDate: true,
    fontSize: 0,
    lanaguge: null as null | string,
    initialized: false,
    showWelcome: false,
    sharing: null as null | {cardId: string; channelId: string; filePath: string; mimeType: string},
    createSealed: true,
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  const setup = async () => {
    await local.current.open(SETTINGS_DB);
    const favorite = JSON.parse(await local.current.get('favorite', JSON.stringify([])));
    const fullDayTime = (await local.current.get('time_format', '12h')) === '24h';
    const monthFirstDate = (await local.current.get('date_format', 'month_first')) === 'month_first';
    const setLanguage = await local.current.get('language', null);
    const fontSize = parseInt(await local.current.get('font_size', '0'), 10) || 0;
    const createSealed = (await local.current.get('create_sealed', 'true')) === 'true';

    const locale =
      Platform.OS === 'ios' ? NativeModules.SettingsManager?.settings.AppleLocale || NativeModules.SettingsManager?.settings.AppleLanguages[0] : NativeModules.I18nManager?.localeIdentifier;
    const defaultLanguage = locale?.slice(0, 2) || '';
    const lang = setLanguage ? setLanguage : defaultLanguage;
    const language = lang === 'fr' ? 'fr' : lang === 'es' ? 'es' : lang === 'pt' ? 'pt' : lang === 'de' ? 'de' : lang === 'ru' ? 'ru' : lang === 'el' ? 'el' : 'en';

    const store = new SessionStore();
    await store.open(DATABAG_DB);
    const session: Session | null = await sdk.current.initOfflineStore(store);
    if (session) {
      updateState({session, fullDayTime, monthFirstDate, fontSize, createSealed, language, favorite, initialized: true});
    } else {
      updateState({fullDayTime, monthFirstDate, language, fontSize, createSealed, initialized: true});
    }
  };

  useEffect(() => {
    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      return {token, type: 'fcm'};
    } catch (err) {
      console.log(err);
      return {token: '', type: ''};
    }
  };

  const actions = {
    getUnsent: (cardId: string, channelId: string) => {
      const id = `${cardId}:${channelId}`;
      if (topics.current.has(id)) {
        return topics.current.get(id);
      }
      return {message: null, assets: []};
    },
    setUnsent: (cardId: string, channelId: string, topic: UnsentTopic) => {
      const id = `${cardId}:${channelId}`;
      topics.current.set(id, topic);
    },
    setMonthFirstDate: async (monthFirstDate: boolean) => {
      updateState({monthFirstDate});
      await local.current.set('date_format', monthFirstDate ? 'month_first' : 'day_first');
    },
    setFullDayTime: async (fullDayTime: boolean) => {
      updateState({fullDayTime});
      await local.current.set('time_format', fullDayTime ? '24h' : '12h');
    },
    setFontSize: async (fontSize: number) => {
      updateState({fontSize});
      await local.current.set('font_size', fontSize.toString());
    },
    setCreateSealed: async (createSealed: boolean) => {
      updateState({createSealed});
      await local.current.set('create_sealed', createSealed ? 'true' : 'false');
    },
    setLanguage: async (language: string) => {
      updateState({language});
      await local.current.set('language', language);
    },
    setFavorite: async (favorite: {cardId: string | null; channelId: string}[]) => {
      updateState({favorite});
      await local.current.set('favorite', JSON.stringify(favorite));
    },
    setShowWelcome: async (showWelcome: boolean) => {
      updateState({showWelcome});
    },
    accountLogin: async (username: string, password: string, node: string, secure: boolean, code: string) => {
      const deviceToken = await getToken();

      const params = {
        topicBatch: 16,
        tagBatch: 16,
        channelTypes: ['test'],
        pushType: deviceToken.type,
        deviceToken: deviceToken.token,
        notifications: notifications,
        deviceId: '0011',
        version: '0.0.1',
        appName: 'databag',
      };

      const login = await sdk.current.login(username, password, node, secure, code, params);
      updateState({session: login, showWelcome: false});
    },
    accountLogout: async (all: boolean) => {
      if (state.session) {
        await local.current.clear('favorite');
        await sdk.current.logout(state.session, all);
        updateState({session: null});
      }
    },
    accountRemove: async () => {
      if (state.session) {
        await local.current.clear('favorite');
        await sdk.current.remove(state.session);
        updateState({session: null});
      }
    },
    accountCreate: async (handle: string, password: string, node: string, secure: boolean, token: string) => {
      const deviceToken = await getToken();

      const params = {
        topicBatch: 16,
        tagBatch: 16,
        channelTypes: ['test'],
        pushType: deviceToken.type,
        deviceToken: deviceToken.token,
        notifications: notifications,
        deviceId: '0011',
        version: '0.0.1',
        appName: 'databag',
      };
      const session = await sdk.current.create(handle, password, node, secure, token, params);
      updateState({session, showWelcome: true});
    },
    accountAccess: async (node: string, secure: boolean, token: string) => {
      const deviceToken = await getToken();

      const params = {
        topicBatch: 16,
        tagBatch: 16,
        channelTypes: ['test'],
        pushType: deviceToken.type,
        deviceToken: deviceToken.token,
        notifications: notifications,
        deviceId: '0011',
        version: '0.0.1',
        appName: 'databag',
      };
      const session = await sdk.current.access(node, secure, token, params);
      updateState({session, showWelcome: false});
    },
    setFocus: async (cardId: string | null, channelId: string) => {
      if (state.session) {
        const focus = await state.session.setFocus(cardId, channelId);
        updateState({focus});
      }
    },
    clearFocus: () => {
      if (state.session) {
        state.session.clearFocus();
        updateState({focus: null});
      }
    },
    getAvailable: async (node: string, secure: boolean) => {
      return await sdk.current.available(node, secure);
    },
    getUsername: async (username: string, token: string, node: string, secure: boolean) => {
      return await sdk.current.username(username, token, node, secure);
    },
    adminLogin: async (token: string, node: string, secure: boolean, code: string) => {
      const service = await sdk.current.configure(node, secure, token, code);
      updateState({service});
    },
    adminLogout: async () => {
      updateState({service: null});
    },
    setSharing: (sharing: {cardId: string; channelId: string; filePath: string; mimeType: string}) => {
      updateState({sharing});
    },
    clearSharing: () => {
      updateState({sharing: null});
    },
    requestPermission: async () => {
      await requestUserPermission();
    },
  };

  return {state, actions};
}
