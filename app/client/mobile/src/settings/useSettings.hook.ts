import {useEffect, useState, useContext, useRef} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';

const DEBOUNCE_MS = 1000;

export function useSettings() {
  const display = useContext(DisplayContext) as ContextType;
  const app = useContext(AppContext) as ContextType;
  const debounce = useRef(setTimeout(() => {}, 0));

  const [state, setState] = useState({
    config: {} as Config,
    profile: {} as Profile,
    profileSet: false,
    imageUrl: null,
    strings: display.state.strings,
    all: false,
    password: '',
    confirm: '',
    remove: '',
    username: '',
    taken: false,
    checked: true,
    searchable: null as null | boolean,
    pushEnabled: null as null | boolean,
    mfaEnabled: null as null | boolean,
    name: '',
    description: '',
    location: '',
    handle: '',
    secretText: '',
    secretImage: '',
    code: '',
    sealPassword: '',
    sealConfirm: '',
    sealDelete: '',
    secretCopied: false,
    monthFirstDate: true,
    createSealed: false,
    fontSize: 0,
    fullDayTime: false,
    allowUnsealed: false,
    blockedContacts: [] as {cardId: string; timestamp: number}[],
    blockedChannels: [] as {cardId: string | null; channelId: string; timestamp: number}[],
    blockedMessages: [] as {cardId: string | null; channelId: string; topicId: string; timestamp: number}[],
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  const getSession = () => {
    const session = app.state?.session;
    const settings = session?.getSettings();
    const identity = session?.getIdentity();
    if (!settings || !identity) {
      console.log('session not set in settings hook');
    }
    return {settings, identity};
  };

  useEffect(() => {
    const {settings, identity} = getSession();
    const setConfig = (config: Config) => {
      const {searchable, pushEnabled, allowUnsealed, mfaEnabled} = config;
      updateState({config, searchable, pushEnabled, allowUnsealed, mfaEnabled});
    };
    settings.addConfigListener(setConfig);
    const setProfile = (profile: Profile) => {
      const {handle, name, location, description} = profile;
      const url = identity.getProfileImageUrl();
      updateState({
        profile,
        handle,
        name,
        location,
        description,
        imageUrl: url,
        profileSet: true,
      });
    };
    identity.addProfileListener(setProfile);
    return () => {
      settings.removeConfigListener(setConfig);
      identity.removeProfileListener(setProfile);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const {fullDayTime, monthFirstDate, fontSize, createSealed} = app.state;
    updateState({fullDayTime, monthFirstDate, fontSize, createSealed});
  }, [app.state]);

  useEffect(() => {
    const {strings, dateFormat, timeFormat, layout} = display.state;
    updateState({
      layout,
      strings,
      dateFormat,
      timeFormat,
    });
  }, [display.state]);

  const actions = {
    setLanguage: (language: string) => {
      app.actions.setLanguage(language);
    },
    setCreateSealed: (createSealed: boolean) => {
      app.actions.setCreateSealed(createSealed);
    },
    clearWelcome: () => {
      app.actions.setShowWelcome(false);
    },
    getUsernameStatus: async (username: string) => {
      const {settings} = getSession();
      return await settings.getUsernameStatus(username);
    },
    setLogin: async () => {
      const {settings} = getSession();
      await settings.setLogin(state.handle, state.password);
    },
    enableNotifications: async () => {
      updateState({pushEnabled: true});
      const {settings} = getSession();
      await settings.enableNotifications();
    },
    disableNotifications: async () => {
      updateState({pushEnabled: false});
      const {settings} = getSession();
      await settings.disableNotifications();
    },
    enableRegistry: async () => {
      updateState({searchable: true});
      const {settings} = getSession();
      await settings.enableRegistry();
    },
    disableRegistry: async () => {
      updateState({searchable: false});
      const {settings} = getSession();
      await settings.disableRegistry();
    },
    enableMFA: async () => {
      const {settings} = getSession();
      const {secretImage, secretText} = await settings.enableMFA();
      updateState({secretImage, secretText});
    },
    disableMFA: async () => {
      const {settings} = getSession();
      await settings.disableMFA();
    },
    confirmMFA: async () => {
      const {settings} = getSession();
      await settings.confirmMFA(state.code);
    },
    setCode: (code: string) => {
      updateState({code});
    },
    copySecret: () => {
      navigator.clipboard.writeText(state.secretText);
      updateState({secretCopied: true});
      setTimeout(() => {
        updateState({secretCopied: false});
      }, 1000);
    },
    setSeal: async () => {
      const {settings} = getSession();
      await settings.setSeal(state.sealPassword);
    },
    clearSeal: async () => {
      const {settings} = getSession();
      await settings.clearSeal();
    },
    unlockSeal: async () => {
      const {settings} = getSession();
      await settings.unlockSeal(state.sealPassword);
    },
    forgetSeal: async () => {
      const {settings} = getSession();
      await settings.forgetSeal();
    },
    updateSeal: async () => {
      const {settings} = getSession();
      await settings.updateSeal(state.sealPassword);
    },
    setProfileData: async (name: string, location: string, description: string) => {
      const {identity} = getSession();
      await identity.setProfileData(name, location, description);
    },
    setProfileImage: async (image: string) => {
      const {identity} = getSession();
      await identity.setProfileImage(image);
    },
    getProfileImageUrl: () => {
      const {identity} = getSession();
      return identity.getProfileImageUrl();
    },
    setDateFormat: (format: string) => {
      display.actions.setDateFormat(format);
    },
    setTimeFormat: (format: string) => {
      display.actions.setTimeFormat(format);
    },
    setAll: (all: boolean) => {
      updateState({all});
    },
    logout: async () => {
      await app.actions.accountLogout(state.all);
    },
    remove: async () => {
      await app.actions.accountRemove();
    },
    setHandle: (handle: string) => {
      updateState({handle, taken: false, checked: false});
      clearTimeout(debounce.current);
      if (!handle || handle === state.profile.handle) {
        updateState({available: true, checked: true});
      } else {
        debounce.current = setTimeout(async () => {
          const {settings} = getSession();
          try {
            const available = await settings.getUsernameStatus(handle);
            updateState({taken: !available, checked: true});
          } catch (err) {
            console.log(err);
          }
        }, DEBOUNCE_MS);
      }
    },
    setPassword: (password: string) => {
      updateState({password});
    },
    setConfirm: (confirm: string) => {
      updateState({confirm});
    },
    setRemove: (remove: string) => {
      updateState({remove});
    },
    setName: (name: string) => {
      updateState({name});
    },
    setLocation: (location: string) => {
      updateState({location});
    },
    setDescription: (description: string) => {
      updateState({description});
    },
    setDetails: async () => {
      const {identity} = getSession();
      const {name, location, description} = state;
      await identity.setProfileData(name, location, description);
    },
    setSealDelete: (sealDelete: string) => {
      updateState({sealDelete});
    },
    setSealPassword: (sealPassword: string) => {
      updateState({sealPassword});
    },
    setSealConfirm: (sealConfirm: string) => {
      updateState({sealConfirm});
    },
    setFullDayTime: async (flag: boolean) => {
      try {
        await app.actions.setFullDayTime(flag);
      } catch (err) {
        console.log(err);
      }
    },
    setMonthFirstDate: async (flag: boolean) => {
      try {
        await app.actions.setMonthFirstDate(flag);
      } catch (err) {
        console.log(err);
      }
    },
    setFontSize: async (fontSize: number) => {
      try {
        await app.actions.setFontSize(fontSize);
      } catch (err) {
        console.log(err);
      }
    },
    loadBlockedMessages: async () => {
      const settings = app.state.session.getSettings();
      const blockedMessages = await settings.getBlockedTopics();
      updateState({blockedMessages});
    },
    unblockMessage: async (cardId: string | null, channelId: string, topicId: string) => {
      const content = app.state.session.getContent();
      await content.clearBlockedChannelTopic(cardId, channelId, topicId);
      const blockedMessages = state.blockedMessages.filter(blocked => blocked.cardId !== cardId || blocked.channelId !== channelId || blocked.topicId !== topicId);
      updateState({blockedMessages});
    },
    loadBlockedChannels: async () => {
      const settings = app.state.session.getSettings();
      const blockedChannels = await settings.getBlockedChannels();
      updateState({blockedChannels});
    },
    unblockChannel: async (cardId: string | null, channelId: string) => {
      const content = app.state.session.getContent();
      await content.setBlockedChannel(cardId, channelId, false);
      const blockedChannels = state.blockedChannels.filter(blocked => blocked.cardId !== cardId || blocked.channelId !== channelId);
      updateState({blockedChannels});
    },
    loadBlockedContacts: async () => {
      const settings = app.state.session.getSettings();
      const blockedContacts = await settings.getBlockedCards();
      updateState({blockedContacts});
    },
    unblockContact: async (cardId: string) => {
      const contact = app.state.session.getContact();
      await contact.setBlockedCard(cardId, false);
      const blockedContacts = state.blockedContacts.filter(blocked => blocked.cardId !== cardId);
      updateState({blockedContacts});
    },
    getTimestamp: (created: number) => {
      const now = Math.floor(new Date().getTime() / 1000);
      const date = new Date(created * 1000);
      const offset = now - created;
      if (offset < 43200) {
        if (state.timeFormat === '12h') {
          return date.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'});
        } else {
          return date.toLocaleTimeString('en-GB', {hour: 'numeric', minute: '2-digit'});
        }
      } else if (offset < 31449600) {
        if (state.dateFormat === 'mm/dd') {
          return date.toLocaleDateString('en-US', {day: 'numeric', month: 'numeric'});
        } else {
          return date.toLocaleDateString('en-GB', {day: 'numeric', month: 'numeric'});
        }
      } else {
        if (state.dateFormat === 'mm/dd') {
          return date.toLocaleDateString('en-US');
        } else {
          return date.toLocaleDateString('en-GB');
        }
      }
    },
  };

  return {state, actions};
}
