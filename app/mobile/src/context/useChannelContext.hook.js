import { useState, useRef, useContext } from 'react';
import { StoreContext } from 'context/StoreContext';
import { getChannels } from 'api/getChannels';
import { getChannelDetail } from 'api/getChannelDetail';
import { getChannelSummary } from 'api/getChannelSummary';

export function useChannelContext() {
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

        const delta = await getChannels(server, appToken, setRevision.current);
        for (let channel of delta) {
          if (channel.data) {
            if (channel.data.channelDetail && channel.data.channelSummary) {
              await store.actions.setChannelItem(guid, channel);
            }
            else {
              const { detailRevision, topicRevision, channelDetail, channelSummary } = channel.data;
              const view = await store.actions.getChannelItemView(guid, channel.id);
              if (view.detailRevision != detailRevision) {
                const detail = await getChannelDetail(server, appToken, channel.id);
                await store.actions.setChannelItemDetail(guid, channel.id, detailRevision, detail);
              }
              if (view.topicRevision != topicRevision) {
                const summary = await getChannelSummary(server, appToken, channel.id);
                await store.actions.setChannelItemSummary(guid, channel.id, topicRevision, summary);
              }
              await store.actions.setChannelItemRevision(guid, channel.revision);
            }
          }
          else {
            await store.actions.clearChannelItem(guid, channel.id);
          }
        }

        setRevision.current = revision;
        await store.actions.setChannelRevision(guid, revision);
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

      const revision = await store.actions.getChannelRevision(guid);

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

