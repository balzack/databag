import {useState, useContext, useEffect} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';
import {Config} from 'databag-client-sdk';

export function useAssemble() {
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    sealUnlocked: false,
    sealSet: false,
    createSealed: false,
    allowUnsealed: false,
    strings: display.state.strings,
    connected: [] as Card[],
  });

  const compare = (a: Card, b: Card) => {
    const aval = `${a.handle}/${a.node}`.toLowerCase();
    const bval = `${b.handle}/${b.node}`.toLowerCase();
    if (aval < bval) {
      return -1;
    } else if (aval > bval) {
      return 1;
    }
    return 0;
  };

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const contact = app.state?.session?.getContact();
    const settings = app.state?.session?.getSettings();
    const setConfig = (config: Config) => {
      const {sealSet, sealUnlocked, allowUnsealed} = config;
      updateState({sealSet, sealUnlocked, allowUnsealed});
    };
    const setCards = (cards: Card[]) => {
      const sorted = cards.sort(compare);
      const connected = [] as Card[];
      sorted.forEach(card => {
        if (card.status === 'connected') {
          connected.push(card);
        }
      });
      updateState({connected});
    };
    if (settings && contact) {
      contact.addCardListener(setCards);
      settings.addConfigListener(setConfig);
      return () => {
        settings.removeConfigListener(setConfig);
        contact.removeCardListener(setCards);
      };
    }
  }, [app.state.session]);

  useEffect(() => {
    const createSealed = app.state.createSealed;
    updateState({createSealed});
  }, [app.state.createSealed]);

  useEffect(() => {
    const {strings, layout} = display.state;
    updateState({strings, layout});
  }, [display.state]);

  const actions = {
    setFocus: async (cardId: string | null, channelId: string) => {
      await app.actions.setFocus(cardId, channelId);
    },
    addTopic: async (sealed: boolean, subject: string, contacts: string[]) => {
      const content = app.state.session.getContent();
      if (sealed) {
        const topic = await content.addChannel(true, 'sealed', {subject}, contacts);
        return topic.id;
      } else {
        const topic = await content.addChannel(false, 'superbasic', {subject}, contacts);
        return topic.id;
      }
    },
  };

  return {state, actions};
}
