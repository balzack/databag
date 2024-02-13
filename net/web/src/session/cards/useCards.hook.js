import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';
import { SettingsContext } from 'context/SettingsContext';
import { StoreContext } from 'context/StoreContext';
import { ChannelContext } from 'context/ChannelContext';
import { AccountContext } from 'context/AccountContext';
import { RingContext } from 'context/RingContext';
import { encryptChannelSubject } from 'context/sealUtil';

export function useCards() {

  const [filter, setFilter] = useState(null);

  const [state, setState] = useState({
    tooltip: false,
    sorted: false,
    display: 'small',
    enableIce: false,
    sealable: false,
    allowUnsealed: false,
    cards: [],
  });

  const ring = useContext(RingContext);
  const account = useContext(AccountContext);
  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const store = useContext(StoreContext);
  const settings = useContext(SettingsContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { display } = settings.state;
    updateState({ display });
  }, [settings.state]);

  useEffect(() => {
    const { seal, sealKey, status } = account.state;
    const allowUnsealed = account.state.status?.allowUnsealed;
    if (seal?.publicKey && sealKey?.public && sealKey?.private && seal.publicKey === sealKey.public) {
      updateState({ sealable: true, allowUnsealed, enableIce: status?.enableIce });
    }
    else {
      updateState({ sealable: false, allowUnsealed, enableIce: status?.enableIce });
    }
  }, [account.state]);

  useEffect(() => {
    const contacts = Array.from(card.state.cards.values()).map(item => {
      const profile = item?.data?.cardProfile;
      const detail = item?.data?.cardDetail;

      const cardId = item.id;
      const updated = detail?.statusUpdated;
      const status = detail?.status;
      const offsync = item.offsync;
      const guid = profile?.guid;
      const name = profile?.name;
      const node = profile?.node;
      const seal = profile?.seal;
      const token = detail?.token;
      const handle = profile?.node ? `${profile.handle}@${profile.node}` : profile.handle;
      const logo = profile?.imageSet ? card.actions.getCardImageUrl(item.id) : null;
      return { cardId, guid, updated, offsync, status, name, node, token, handle, logo, seal };
    });

    let latest = 0;
    contacts.forEach(contact => {
      if (latest < contact.updated) {
        latest = contact.updated;
      }
    });
    store.actions.setValue('cards:updated', latest);
 
    let filtered = contacts.filter(contact => {
      if (!filter) {
        return true;
      }
      if (!contact.name) {
        return false;
      }
      return contact.name.toUpperCase().includes(filter);
    });

    if (state.sorted) {
      filtered.sort((a, b) => {
        let aName = a?.name;
        let bName = b?.name;
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
        const aUpdated = a?.updated;
        const bUpdated = b?.updated;
        if (aUpdated === bUpdated) {
          return 0;
        }
        if (!aUpdated || (aUpdated < bUpdated)) {
          return 1;
        }
        return -1;
      });
    }

    updateState({ cards: filtered });

    // eslint-disable-next-line
  }, [card.state, state.sorted, filter]);

  useEffect(() => {
    if (settings.state.display === 'small') {
      updateState({ tooltip: false });
    }
    else {
      updateState({ tooltip: true });
    }
  }, [settings.state]);

  const actions = {
    onFilter: (value) => {
      setFilter(value.toUpperCase());
    },
    setSort: (value) => {
      updateState({ sorted: value });
    },
    resync: async (cardId) => {
      await card.actions.resyncCard(cardId);
    },
    message: async (cardId) => {
      let channelId = null;
      channel.state.channels.forEach((entry, id) => {
        const cards = entry?.data?.channelDetail?.contacts?.cards || [];
        const subject = entry?.data?.channelDetail?.data || '';
        if (cards.length === 1 && cards[0] === cardId && subject === '{"subject":null}') {
          channelId = entry.id;
        }
      });
      if (channelId != null) {
        return channelId;
      }
      if (state.sealable && !state.allowUnsealed) {
        const keys = [ account.state.sealKey.public ];
        keys.push(card.state.cards.get(cardId).data.cardProfile.seal);
        const sealed = encryptChannelSubject(state.subject, keys);
        const conversation = await channel.actions.addChannel('sealed', sealed, [ cardId ]);
        return conversation.id;
      }
      else {
        const conversation = await channel.actions.addChannel('superbasic', { subject: null }, [ cardId ]);
        return conversation.id;
      }
    },
    call: async (contact) => {
      const { cardId, node, guid, token } = contact;
      await ring.actions.call(cardId, node, `${guid}.${token}`);
    },
  };

  return { state, actions };
}
