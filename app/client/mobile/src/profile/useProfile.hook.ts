import {useState, useContext, useEffect} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';
import {Card, Profile} from 'databag-client-sdk';
import {ContactParams} from './Profile';

export function useProfile(params: ContactParams) {
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    layout: 'small' as null | string,
    strings: display.state.strings,
    cards: [] as Card[],
    profile: {} as {} | Profile,
    guid: '',
    name: '',
    handle: '',
    node: '',
    location: '',
    description: '',
    imageUrl: null as string | null,
    cardId: null as string | null,
    status: '',
    offsync: false,
    statusLabel: '',
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const { layout, strings } = display.state;
    updateState({ layout, strings });
  }, [display.state]);

  useEffect(() => {
    const guid = params.guid;
    const handle = params.handle ? params.handle : '';
    const node = params.node ? params.node : '';
    const name = params.name ? params.name : '';
    const location = params.location ? params.location : '';
    const description = params.description ? params.description : '';
    const imageUrl = params.imageUrl ? params.imageUrl : null;
    const cardId = params.cardId ? params.cardId : null;
    const status = params.status ? params.status : '';
    const offsync = params.offsync ? params.offsync : false;
    updateState({
      guid,
      handle,
      node,
      name,
      location,
      description,
      imageUrl,
      cardId,
      status,
      offsync,
    });
  }, [params]);

  const getStatusLabel = (card?: Card) => {
    if (card) {
      const {status, offsync} = card;
      if (status === 'confirmed') {
        return 'savedStatus';
      }
      if (status === 'pending') {
        return 'pendingStatus';
      }
      if (status === 'requested') {
        return 'requestedStatus';
      }
      if (status === 'connecting') {
        return 'connectingStatus';
      }
      if (status === 'connected' && !offsync) {
        return 'connectedStatus';
      }
      if (status === 'connected' && offsync) {
        return 'offsyncStatus';
      }
    }
    return 'unknownStatus';
  };

  useEffect(() => {
    const saved = state.cards.find(card => card.guid === state.guid);
    const statusLabel = getStatusLabel(saved);
    if (saved) {
      const {handle, node, name, location, description, imageUrl, cardId, status, offsync} = saved;
      updateState({
        handle,
        node,
        name,
        location,
        description,
        imageUrl,
        cardId,
        status,
        offsync,
        statusLabel,
      });
    } else {
      updateState({cardId: null, status: '', offsync: false, statusLabel});
    }
  }, [state.cards, state.guid]);

  useEffect(() => {
    const contact = app.state.session?.getContact();
    const identity = app.state.session?.getIdentity();
    const setCards = (cards: Card[]) => {
      updateState({cards});
    };
    const setProfile = (profile: Profile) => {
      updateState({profile});
    };
    contact.addCardListener(setCards);
    identity.addProfileListener(setProfile);
    return () => {
      contact.removeCardListener(setCards);
      identity.removeProfileListener(setProfile);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actions = {
    save: async () => {
      const contact = app.state.session?.getContact();
      await contact.addCard(state.node, state.guid);
    },
    saveAndConnect: async () => {
      const contact = app.state.session?.getContact();
      await contact.addAndConnectCard(state.node, state.guid);
    },
    remove: async () => {
      const contact = app.state.session?.getContact();
      await contact.removeCard(state.cardId);
    },
    connect: async () => {
      const contact = app.state.session?.getContact();
      await contact.connectCard(state.cardId);
    },
    disconnect: async () => {
      const contact = app.state.session?.getContact();
      await contact.disconnectCard(state.cardId);
    },
    ignore: async () => {
      const contact = app.state.session?.getContact();
      await contact.ignoreCard(state.cardId);
    },
    deny: async () => {
      const contact = app.state.session?.getContact();
      await contact.denyCard(state.cardId);
    },
    confirm: async () => {
      const contact = app.state.session?.getContact();
      await contact.confirmCard(state.cardId);
    },
    cancel: async () => {
      const contact = app.state.session?.getContact();
      await contact.disconnectCard(state.cardId);
    },
    accept: async () => {
      const contact = app.state.session?.getContact();
      await contact.connectCard(state.cardId);
    },
    resync: async () => {
      const contact = app.state.session?.getContact();
      await contact.resyncCard(state.cardId);
    },
    block: async () => {
      const contact = app.state.session?.getContact();
      await contact.setBlockedCard(state.cardId, true);
    },
    report: async () => {
      const contact = app.state.session?.getContact();
      await contact.flagCard(state.cardId);
    },
  };

  return {state, actions};
}
