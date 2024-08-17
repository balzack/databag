import { useState, useEffect, useRef, useContext } from 'react';
import { CardContext } from '../../context/CardContext';
import { RingContext } from '../../context/RingContext';
import { AccountContext } from '../../context/AccountContext';
import { ProfileContext } from '../../context/ProfileContext';
import { getLanguageStrings } from '../../constants/Strings';

export function useCards() {

  const [state, setState] = useState({
    cards: [],
    enableIce: false,
    sealable: false,
    allowUnsealed: false,
    strings: getLanguageStrings(),
    sort: false,
    filter: null,
  });

  const profile = useContext(ProfileContext);
  const account = useContext(AccountContext);
  const card = useContext(CardContext);
  const ring = useContext(RingContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { enableIce, allowUnsealed } = account.state.status || {};
    const { status, sealKey } = account.state;
    if (status?.seal?.publicKey && sealKey?.public && sealKey?.private && sealKey?.public === status.seal.publicKey) {
      updateState({ sealable: true, allowUnsealed, enableIce });
    }
    else {
      updateState({ sealable: false, allowUnsealed, enableIce });
    }
  }, [account.state]);

  const setCardItem = (item) => {
    const { profile, detail, cardId, blocked, offsync } = item.card || { profile: {}, detail: {} }
    const { name, handle, node, guid, location, description, imageSet, seal } = profile;

    return {
      cardId: cardId,
      name: name,
      handle: handle,
      username: node ? `${handle}/${node}` : handle,
      node: node,
      guid: guid,
      location: location,
      description: description,
      status: detail.status,
      token: detail.token,
      seal: seal,
      offsync: offsync,
      blocked: blocked,
      updated: detail.statusUpdated,
      logo: imageSet ? card.actions.getCardImageUrl(cardId) : 'avatar',
    }
  };

  useEffect(() => {
    const cards = Array.from(card.state.cards.values());
    const items = cards.map(setCardItem);
    const filtered = items.filter(item => {
      if (item.blocked) {
        return false;
      }
      if (!state.filter) {
        return true;
      }
      const lower = state.filter.toLowerCase();
      if (item.name) {
        if (item.name.toLowerCase().includes(lower)) {
          return true;
        }
      }
      if (item.handle) {
        if (item.handle.toLowerCase().includes(lower)) {
          return true;
        }
      }
      return false;
    })
    if (state.sort) {
      filtered.sort((a, b) => {
        const aName = a?.name?.toLowerCase();
        const bName = b?.name?.toLowerCase();
        if (aName === bName) {
          return 0;
        }
        if (!aName || (aName < bName)) {
          return -1;
        }
        return 1;
      });
    }
    else {
      filtered.sort((a, b) => {
        if (a.updated === b.updated) {
          return 0;
        }
        if (!a.updated || (a.updated < b.updated)) {
          return 1;
        }
        return -1;
      });
    }
    updateState({ cards: filtered }); 
  }, [card, state.filter, state.sort]);

  const actions = {
    call: async (card) => {
      const { cardId, guid, node, token } = card || {};
      const server = node ? node : profile.state.server;
      await ring.actions.call(cardId, server, `${guid}.${token}`);
    },
    setFilter: (filter) => {
      updateState({ filter });
    },
    setSort: (sort) => {
      updateState({ sort });
    },
  };

  return { state, actions };
}


