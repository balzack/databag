import { useContext, useState, useRef, useEffect } from 'react';
import { StoreContext } from 'context/StoreContext';
import { ChannelContext } from 'context/ChannelContext';
import { CardContext } from 'context/CardContext';
import { AccountContext } from 'context/AccountContext';
import { SettingsContext } from 'context/SettingsContext';
import { ProfileContext } from 'context/ProfileContext';
import { getCardByGuid } from 'context/cardUtil';
import { isUnsealed, getChannelSeals, getContentKey, decryptChannelSubject, decryptTopicSubject } from 'context/sealUtil';

export function useChannels() {

  const [filter, setFilter] = useState();

  const [state, setState] = useState({
    display: null,
    channels: [],
    showAdd: false,
    allowAdd: false,
    strings: {} as Record<string,string>,
    menuStyle: {},
  });

  const profile = useContext(ProfileContext);
  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const account = useContext(AccountContext);
  const store = useContext(StoreContext);
  const settings = useContext(SettingsContext);

  const channels = useRef(new Map());

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const syncChannelDetail = (item, cardValue, channelValue) => {

    // extract member info
    let memberCount = 0;
    let names = [];
    let img = null;
    let logo = null;
    if (cardValue) {
      const profile = cardValue?.data?.cardProfile;
      if (profile?.name) {
        names.push(profile.name);
      }
      if (profile?.imageSet) {
        img = null;
        logo = card.actions.getCardImageUrl(cardValue.id);
      }
      else {
        img = 'avatar';
        logo = null;
      }
      memberCount++;
    }
    for (let guid of channelValue?.data?.channelDetail?.members) {
      if (guid !== profile.state.identity.guid) {
        const contact = getCardByGuid(card.state.cards, guid);
        const profile = contact?.data?.cardProfile;
        if (profile?.name) {
          names.push(profile.name);
        }
        if (profile?.imageSet) {
          img = null;
          logo = card.actions.getCardImageUrl(contact.id);
        }
        else {
          img = 'avatar';
          logo = null;
        }
        memberCount++;
      }
    }

    // set logo and label
    if (memberCount === 0) {
      item.img = 'solution';
      item.label = state.strings.notes;
    }
    else if (memberCount === 1) {
      item.logo = logo;
      item.img = img;
      item.label = names.join(',');
    }
    else {
      item.img = 'appstore';
      item.label = names.join(',');
    }

    // update title on detailRevision or sealKey changes
    const sealKey = account.state.sealKey;
    const detailRevision = channelValue?.data?.detailRevision;
    if (item.detailRevision !== detailRevision || item.sealKey !== sealKey) {
      const detail = channelValue.data?.channelDetail;
      if (detail?.dataType === 'sealed') {
        item.locked = true;
        try {
          const { sealKey } = account.state;
          const seals = getChannelSeals(detail.data);
          if (isUnsealed(seals, sealKey)) {
            item.unlocked = true;
            if (!item.contentKey) {
              item.contentKey = getContentKey(seals, sealKey);
            }
            const unsealed = decryptChannelSubject(detail.data, item.contentKey);
            item.title = unsealed?.subject;
          }
          else {
            item.unlocked = false;
            item.contentKey = null;
            item.title = null;
          }
        }
        catch(err) {
          console.log(err);
          item.unlocked = false;
        }
      }
      else if (detail?.dataType === 'superbasic') {
        item.locked = false;
        item.unlocked = true;
        try {
          const data = JSON.parse(detail.data);
          item.title = data.subject;
        }
        catch(err) {
          console.log(err);
          item.title = null;
        }
      }
      item.detailRevision = detailRevision;
      item.sealKey = sealKey;
    }

    if (item.title == null || item.title === '' || typeof item.title !== 'string') {
      item.subject = item.label;
    }
    else {
      item.subject = item.title;
    }
  }


  const syncChannelSummary = (item, channelValue) => {

    const sealKey = account.state.sealKey;
    const topicRevision = channelValue?.data?.topicRevision;
    if (item.topicRevision !== topicRevision || item.sealKey !== sealKey) {
      const topic = channelValue.data?.channelSummary?.lastTopic;
      item.updated = topic?.created;
      if (topic?.dataType === 'superbasictopic') {
        try {
          const data = JSON.parse(topic.data);
          item.message = data.text;
        }
        catch (err) {
          console.log(err);
        }
      }
      else if (topic?.dataType === 'sealedtopic') {
        try {
          if (item.contentKey) {
            const unsealed = decryptTopicSubject(topic.data, item.contentKey);
            item.message = unsealed?.message?.text;
          }
          else {
            item.message = null;
          }
        }
        catch(err) {
          console.log(err);
          item.message = null;
        }
      }

      // set updated revision
      item.topicRevision = topicRevision;
      item.sealKey = sealKey;
    }
  };

  useEffect(() => {
    const login = store.state['login:timestamp'];
    const conversations = new Map();
    card.state.cards.forEach((cardValue, cardId) => {
      cardValue.channels.forEach((channelValue, channelId) => {
        const key = `${channelId}::${cardId}`;
        let item = channels.current.get(key);
        if (!item) {
          item = { cardId, channelId };
        }

        syncChannelDetail(item, cardValue, channelValue);
        syncChannelSummary(item, channelValue);

        const revision = store.state[key];
        const topicRevision = channelValue.data?.topicRevision;
        if (login && item.updated && item.updated > login && topicRevision !== revision) {
          item.updatedFlag = true;
        }
        else {
          item.updatedFlag = false;
        }
        conversations.set(key, item);
      });
    });
    channel.state.channels.forEach((channelValue, channelId) => {
      const key = `${channelId}::${undefined}`;
      let item = channels.current.get(key);
      if (!item) {
        item = { channelId };
      }
      syncChannelDetail(item, null, channelValue);
      syncChannelSummary(item, channelValue);

      const revision = store.state[key];
      const topicRevision = channelValue.data?.topicRevision;
      if (login && item.updated && item.updated > login && topicRevision !== revision) {
        item.updatedFlag = true;
      }
      else {
        item.updatedFlag = false;
      }
      conversations.set(key, item);
    });
    channels.current = conversations;

    const merged = Array.from(conversations.values());
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

    const filtered = merged.filter((item) => {
      if (filter) {
        const subject = item.subject?.toUpperCase();
        if (subject) {
          return subject.includes(filter);
        }
        else {
          return false;
        }
      }
      else {
        return true;
      }
    });

    const sealKey = account.state.sealKey?.public && account.state.sealKey?.private;
    const allowUnsealed = account.state.status?.allowUnsealed;
    const allowAdd = allowUnsealed || sealKey;

    updateState({ channels: filtered, allowAdd });

    // eslint-disable-next-line
  }, [account.state, store.state, card.state, channel.state, filter]);

  useEffect(() => {
    const { display, strings, menuStyle } = settings.state;
    updateState({ display, strings, menuStyle });
  }, [settings.state]);

  const actions = {
    onFilter: (value) => {
      setFilter(value?.toUpperCase());
    },
    setShowAdd: () => {
      updateState({ showAdd: true });
    },
    clearShowAdd: () => {
      updateState({ showAdd: false });
    },
  };

  return { state, actions };
}
