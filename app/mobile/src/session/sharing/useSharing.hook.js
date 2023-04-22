import { useState, useRef, useEffect, useContext } from 'react';
import { ChannelContext } from 'context/ChannelContext';
import { CardContext } from 'context/CardContext';
import { AccountContext } from 'context/AccountContext';
import { ProfileContext } from 'context/ProfileContext';
import { getChannelSeals, isUnsealed, getContentKey, encryptChannelSubject, decryptChannelSubject, decryptTopicSubject } from 'context/sealUtil';
import { getCardByGuid } from 'context/cardUtil';
import { getChannelSubjectLogo } from 'context/channelUtil';

export function useSharing() {
  const [state, setState] = useState({
    channels: [],
  });

  const channel = useContext(ChannelContext);
  const card = useContext(CardContext);
  const account = useContext(AccountContext);
  const profile = useContext(ProfileContext);
 
  const resync = useRef(false); 
  const syncing = useRef(false);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const setChannelItem = async (cardId, channelId, item) => {
    const timestamp = item.summary.lastTopic.created;

    // decrypt subject and message
    let locked = false;
    let unlocked = false;
    if (item.detail.dataType === 'sealed') {
      locked = true;
      const seals = getChannelSeals(item.detail.data);
      if (isUnsealed(seals, account.state.sealKey)) {
        unlocked = true;
      }
    }

    let message;
    if (item?.detail?.dataType === 'sealed') {
      if (typeof item?.unsealedSummary?.message?.text === 'string') {
        message = item.unsealedSummary.message.text;
      }
    }
    if (item.detail.dataType === 'superbasic') {
      if (item.summary.lastTopic.dataType === 'superbasictopic') {
        try {
          const data = JSON.parse(item.summary.lastTopic.data);
          if (typeof data.text === 'string') {
            message = data.text;
          }
        }
        catch(err) {
          console.log(err);
        }
      }
    }

    const profileGuid = profile.state?.identity?.guid;
    const { logo, subject } = getChannelSubjectLogo(cardId, profileGuid, item, card.state.cards, card.actions.getCardImageUrl);

    return { cardId, channelId, subject, message, logo, timestamp, locked, unlocked };
  }

  useEffect(() => {
    syncChannels();
  }, [account.state, card.state, channel.state]);

  const syncChannels = async () => {
    if (syncing.current) {
      resync.current = true;
    }
    else {
      syncing.current = true;

      const items = [];
      channel.state.channels.forEach((item, channelId) => {
        items.push({ channelId, channelItem: item });
      });
      card.state.cards.forEach((cardItem, cardId) => {
        cardItem.channels.forEach((channelItem, channelId) => {
          items.push({ cardId, channelId, channelItem });
        });
      });
      const channels = [];
      for (let i = 0; i < items.length; i++) {
        const { cardId, channelId, channelItem } = items[i];
        channels.push(await setChannelItem(cardId, channelId, channelItem));
      }
      const filtered = channels.filter(item => {
        if (!item.locked || item.unlocked) {
          return true;
        }
        return false;
      });
      const sorted = filtered.sort((a, b) => {
        const aCreated = a?.timestamp;
        const bCreated = b?.timestamp;
        if (aCreated === bCreated) {
          return 0;
        }
        if (!aCreated || aCreated < bCreated) {
          return 1;
        }
        return -1;
      });
      updateState({ channels: sorted });

      syncing.current = false;
      if(resync.current) {
        resync.current = false;
        await syncChannels();
      }
    }
  };

  const actions = {
  };

  return { state, actions };
}


