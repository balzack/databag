import { useContext, useState, useEffect } from 'react';
import { StoreContext } from 'context/StoreContext';
import { ChannelContext } from 'context/ChannelContext';
import { CardContext } from 'context/CardContext';
import { AccountContext } from 'context/AccountContext';
import { ViewportContext } from 'context/ViewportContext';

export function useChannels() {

  const [state, setState] = useState({
    display: null,
    channels: [],
    sealable: false,
    filter: null,
    busy: false,

    showAdd: false,
    subject: null,
    members: new Set(),
    seal: false,
  });

  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const account = useContext(AccountContext);
  const store = useContext(StoreContext);
  const viewport = useContext(ViewportContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { seal, sealKey } = account.state;
    if (seal?.publicKey && sealKey?.public && sealKey?.private && seal.publicKey === sealKey.public) {
      updateState({ seal: false, sealable: true });
    }
    else {
      updateState({ seal: false, sealable: false });
    }
  }, [account]);

  useEffect(() => {
    const merged = [];
    card.state.cards.forEach((cardValue, cardId) => {
      cardValue.channels.forEach((channelValue, channelId) => {
        const updated = channelValue.data?.channelSummary?.lastTopic?.created;
        merged.push({ updated, cardId, channelId });
      });
    });
    channel.state.channels.forEach((channelValue, channelId) => {
      const updated = channelValue.data?.channelSummary?.lastTopic?.created;
      merged.push({ updated, channelId });
    });

    merged.sort((a, b) => {
      const aUpdated = a.updated;
      const bUpdated = b.updated;
      if (aUpdated === bUpdated) {
        return 0;
      }
      if (!aUpdated || aUpdated < bUpdated) {
        return 1;
      }
      return -1;
    });

    updateState({ channels: merged });

    // eslint-disable-next-line
  }, [channel, card]);

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  const actions = {
    addChannel: async () => {
      let added;
      if (!state.busy) {
        try {
          updateState({ busy: true });
          const cards = Array.from(state.members.values());
          if (state.seal) {
            const keys = [ account.state.sealKey.public ];
            cards.forEach(id => {
              keys.push(card.state.cards.get(id).data.cardProfile.seal);
            });
            added = await channel.actions.addSealedChannel(cards, state.subject, keys);
          }
          else {
            added = await channel.actions.addBasicChannel(cards, state.subject);
          }
          updateState({ busy: false });
        }
        catch(err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error("failed to create new channel");
        }
      }
      else {
        throw new Error("operation in progress");
      }
      return added.id;
    },
    setSeal: (seal) => {
      if (seal) {
        const cards = Array.from(state.members.values());
        const members = new Set(state.members);
        cards.forEach(id => {
          if (!(card.state.cards.get(id)?.data?.cardProfile?.seal)) {
            members.delete(id);
          }    
        });
        updateState({ seal: true, members });
      }
      else {
        updateState({ seal: false });
      }
    },
    onFilter: (value) => {
      updateState({ filter: value.toUpperCase() });
    },
    setShowAdd: () => {
      updateState({ showAdd: true, seal: false, members: new Set(), subject: null });
    },
    clearShowAdd: () => {
      updateState({ showAdd: false });
    },
    onMember: (string) => {
      const members = new Set(state.members);
      if (members.has(string)) {
        members.delete(string);
      }
      else {
        members.add(string);
      }
      updateState({ members });
    },
    setSubject: (subject) => {
      updateState({ subject });
    },
    cardFilter: (card) => {
      if (state.seal) {
        return card?.data?.cardDetail?.status === 'connected' && card?.data?.cardProfile?.seal;
      }
      return card?.data?.cardDetail?.status === 'connected';
    },
  };

  return { state, actions };
}
