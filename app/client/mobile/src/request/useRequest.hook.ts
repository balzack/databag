import {useState, useContext, useEffect, useRef} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';
import {Profile} from 'databag-client-sdk';

export function useRequest() {
  const update = useRef(null as string | null);
  const updating = useRef(false);
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    strings: display.state.strings,
    profiles: [] as Profile[],
    contacts: [] as Profile[],
    cards: new Set<string>(),
    guid: null as null | string,
    node: null as null | string,
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  const getRegistry = async (server: string) => {
    update.current = server;
    if (!updating.current) {
      while (update.current != null) {
        updating.current = true;
        const param = update.current;
        update.current = null;
        try {
          const contact = app.state.session?.getContact();
          const profiles = await contact.getRegistry(null, param);
          updateState({profiles});
        } catch (err) {
          console.log(err);
          updateState({profiles: []});
        }
        updating.current = false;
      }
    }
  };

  useEffect(() => {
    updateState({contacts: state.profiles.filter((profile: Profile) => profile.guid !== state.guid)});
  }, [state.profiles, state.guid]);

  useEffect(() => {
    const identity = app.state?.session?.getIdentity();
    const contact = app.state?.session?.getContact();
    const setCards = (cards: Card[]) => {
      const guids = new Set<string>();
      cards.forEach(card => {
        guids.add(card.guid);
      });
      updateState({cards: guids});
    };
    const setProfile = (profile: Profile) => {
      const {guid, node} = profile;
      updateState({node, guid});
    };
    if (identity && contact) {
      identity.addProfileListener(setProfile);
      contact.addCardListener(setCards);
      return () => {
        identity.removeProfileListener(setProfile);
        contact.removeCardListener(setCards);
      };
    }
  }, [app.state.session]);

  useEffect(() => {
    const {layout} = display.state;
    updateState({layout});
  }, [display.state]);

  useEffect(() => {
    getRegistry(state.node);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.node]);

  const actions = {
    saveAndConnect: async (server: string, guid: string) => {
      const contact = app.state.session?.getContact();
      await contact.addAndConnectCard(server, guid);
    },
    clearWelcome: () => {
      app.actions.setShowWelcome(false);
    },
  };

  return {state, actions};
}
