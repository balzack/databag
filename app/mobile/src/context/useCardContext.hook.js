import { useState, useRef, useContext } from 'react';
import { StoreContext } from 'context/StoreContext';
import { getCards } from 'api/getCards';
import { getCardProfile } from 'api/getCardProfile';
import { getCardDetail } from 'api/getCardDetail';

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
console.log("DELTA:", delta);

        for (let card of delta) {
          if (card.data) {
            if (card.data.cardDetail && card.data.cardProfile) {
              await store.actions.setCardItem(guid, card);
            }
            else {
              const { detailRevision, profileRevision, cardDetail, cardProfile, notifiedView, notifiedArticle, notifiedProfile, notifiedChannel } = channel.data;
              const view = await store.actions.getCardItemView(guid, card.id);
              if (view.detailRevision != detailRevision) {
                const detail = await getCardDetail(server, appToken, card.id);
                await store.actions.setCardItemDetail(guid, card.id, detailRevision, detail);
              }
              if (view.profileRevision != profileRevision) {
                const profile = await getCardProfile(server, appToken, card.id);
                await store.actions.setCardItemProfile(guid, card.id, profileRevision, profile);
              }
              if (view.notifiedView != notifiedView) {
                // TODO clear contact and channels
                // TODO get articles
                await store.actions.setCardNotifiedArticle(guid, card.id, notifiedArticle);
                // TODO get channels
                await store.actions.setCardNotifiedChannel(guid, card.id, notifiedChannel);
                
                await store.actions.setCardNotifiedView(guid, card.id, notifiedView);
              }
              else {
                if (view.notifiedArticle != notifiedArticle) {
                  // TODO get article delta
                  await store.actions.setCardNotifiedArticle(guid, card.id, notifiedArticle);
                }
                if (view.notifiedChannel != notifiedChannel) {
                  // TODO get channel delta
                  await store.actions.setCardNotifiedChannel(guid, card.id, notifiedChannel);
                }
              }
              if (view.notifiedProflile != notifiedProfile) {
                // TODO update contact profile
                await store.actions.setCardNotifiedProfile(guid, card.id, notifiedProfile);
              }
            }
          }
          else {
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

