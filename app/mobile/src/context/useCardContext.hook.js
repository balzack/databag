import { useState, useRef, useContext } from 'react';
import { StoreContext } from 'context/StoreContext';
import { getCards } from 'api/getCards';
import { getCardProfile } from 'api/getCardProfile';
import { getCardDetail } from 'api/getCardDetail';

import { getContactChannels } from 'api/getContactChannels';
import { getContactChannelTopics } from 'api/getContactChannelTopics';
import { getContactChannelDetail } from 'api/getContactChannelDetail';
import { getContactChannelSummary } from 'api/getContactChannelSummary';

export function useCardContext() {
  const [state, setState] = useState({
  });
  const store = useContext(StoreContext);

  const session = useRef(null);
  const curRevision = useRef(null);
  const setRevision = useRef(null);
  const syncing = useRef(false);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const sync = async () => {
    if (!syncing.current && setRevision.current !== curRevision.current) {
      syncing.current = true;

      try {
        const revision = curRevision.current;
        const { server, appToken, guid } = session.current;

        // get and store
        const delta = await getCards(server, appToken, setRevision.current);

        for (let card of delta) {
          if (card.data) {
            if (card.data.cardDetail && card.data.cardProfile) {
              await store.actions.setCardItem(guid, card);
            }
            else {
              const view = await store.actions.getCardItemView(guid, card.id);
              if (view == null) {
                console.log('alert: expected card not synced');
                let assembled = JSON.parse(JSON.stringify(card));
                assembled.data.cardDetail = await getCardDetail(server, appToken, card.id);
                assembled.data.cardProfile = await getCardProfile(server, appToken, card.id);
                await store.actions.setCardItem(guid, assembled);
              }
              else {
                if (view.detailRevision != detailRevision) {
                  const detail = await getCardDetail(server, appToken, card.id);
                  await store.actions.setCardItemDetail(guid, card.id, detailRevision, detail);
                }
                if (view.profileRevision != profileRevision) {
                  const profile = await getCardProfile(server, appToken, card.id);
                  await store.actions.setCardItemProfile(guid, card.id, profileRevision, profile);
                }
              }
            }

            const status = await store.actions.getCardItemStatus(guid, card.id);
            const cardServer = status.profile.node;
            const cardToken = status.profile.guid + '.' + status.detail.token;
            if (status.detail.status === 'connected') {
              try {
                const { notifiedView, notifiedProfile, notifiedArticle, notifiedChannel } = card.data;
                if (status.notifiedView !== notifiedView) {
                  await store.actions.clearCardChannelItems(guid, card.id);
                  await updateCardChannelItems(card.id, cardServer, cardToken, notifiedView, null);
                  await store.actions.setCardItemNotifiedChannel(guid, card.id, notifiedChannel);
                  await store.actions.setCardItemNotifiedView(guid, card.id, notifiedView);
                }
                else {
                  if (status.notifiedChannel != notifiedChannel) {
                    await updateCardChannelItems(card.id, cardServer, cardToken, status.notifiedChannel)
                    await store.actions.setCardItemNotifiedChannel(guid, card.id, notifiedView, notifiedChannel);
                  }
                }
                if (status.notifiedProflile != notifiedProfile) {
                  // TODO update contact profile if different
                  await store.actions.setCardItemNotifiedProfile(guid, card.id, notifiedProfile);
                }
                if (status.offsync) {
                  await store.actions.clearCardItemOffsync(guid, card.id);
                }
              }
              catch(err) {
                console.log(err);
                await store.actions.setCardItemOffsync(guid, card.id);
              } 
            }
          }
          else {
            //TODO clear card channel topics
            await store.actions.clearCardChannelItems(guid, card.id); 
            await store.actions.clearCardItem(guid, card.id);
          }
        }

        setRevision.current = revision;
        await store.actions.setCardRevision(guid, revision);
      }
      catch(err) {
        console.log(err);
        syncing.current = false;
        return;
      }

      syncing.current = false;
      sync();
    }
  };

  const updateCardChannelItems = async (cardId, cardServer, cardToken, notifiedView, notifiedChannel) => {
    const { guid } = session.current;
    const delta = await getContactChannels(cardServer, cardToken, notifiedView, notifiedChannel);
    for (let channel of delta) {
      if (channel.data) {
        if (channel.data.channelDetail && channel.data.channelSummary) {
          await store.actions.setCardChannelItem(guid, cardId, channel);
        }
        else {
          const { detailRevision, topicRevision, channelDetail, channelSummary } = channel.data;
          const view = await store.actions.getCardChannelItemView(guid, cardId, channel.id);
          if (view == null) {
            console.log('alert: expected channel not synced');
            let assembled = JSON.parse(JSON.stringify(channel));
            assembled.data.channelDetail = await getChannelDetail(cardServer, cardToken, channel.id);
            assembled.data.channelSummary = await getChannelSummary(cardServer, cardToken, channel.id);
            await store.actions.setCardChannelItem(guid, cardId, assembled);
          }
          else {
            if (view.detailRevision != detailRevision) {
              const detail = await getChannelDetail(cardServer, cardToken, channel.id);
              await store.actions.setCardChannelItemDetail(guid, cardId, channel.id, detailRevision, detail);
            }
            if (view.topicRevision != topicRevision) {
              const summary = await getChannelSummary(cardServer, channel.id);
              await store.actions.setCardChannelItemSummary(guid, cardId, channel.id, topicRevision, summary);
            }
            await store.actions.setCardChannelItemRevision(guid, cardId, channel.revision);
          }
        }
      }
      else {
        await store.actions.clearCardChannelItem(guid, cardId, channel.id);
      }
    }
  }

  const actions = {
    setSession: async (access) => {
      const { guid, server, appToken } = access;

      // load

      const revision = await store.actions.getCardRevision(guid);

      // update
 
      setRevision.current = revision;
      curRevision.current = revision;
      session.current = access;
    },
    clearSession: () => {
      session.current = {};
      updateState({ account: null });
    },
    setRevision: (rev) => {
      curRevision.current = rev;
      sync();
    },
  }

  return { state, actions }
}

