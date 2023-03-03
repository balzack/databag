import { useState, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { CardContext } from 'context/CardContext';
import { ProfileContext } from 'context/ProfileContext';
import { AccountContext } from 'context/AccountContext';
import moment from 'moment';
import { useWindowDimensions } from 'react-native';
import Colors from 'constants/Colors';
import { getCardByGuid } from 'context/cardUtil';
import { getChannelSeals, isUnsealed, getContentKey, decryptTopicSubject } from 'context/sealUtil';

export function useTopicItem(item, hosting, remove, contentKey) {

  const [state, setState] = useState({
    name: null,
    nameSet: null,
    known: null,
    logo: null,
    timestamp: null,
    message: null,
    carousel: false,
    carouselIndex: 0,
    width: null,
    height: null,
    activeId: null,
    fontSize: 14,
    fontColor: Colors.text,
    editable: false,
    deletable: false,
    assets: [],
  });

  const conversation = useContext(ConversationContext);
  const profile = useContext(ProfileContext);
  const card = useContext(CardContext);
  const account = useContext(AccountContext);
  const dimensions = useWindowDimensions();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ width: dimensions.width, height: dimensions.height });
  }, [dimensions]);

  useEffect(() => {

    const { topicId, revision, detail, unsealedDetail } = item;
    const { guid, created, dataType, data, status, transform } = detail || {};

    let name, nameSet, known, logo;
    const identity = profile.state?.identity;
    if (guid === identity.guid) {
      known = true;
      if (identity.name) {
        name = identity.name;
      }
      else {
        name = `${identity.handle}@${identity.node}`;
      }
      const img = profile.state.imageUrl;
      if (img) {
        logo = img;
      }
      else {
        logo = 'avatar';
      }
    }
    else {
      const contact = getCardByGuid(card.state.cards, guid)?.card;
      if (contact) {
        logo = contact.profile?.imageSet ? card.actions.getCardImageUrl(contact.cardId) : null;

        known = true;
        if (contact.profile.name) {
          name = contact.profile.name;
          nameSet = true;
        }
        else {
          name = `${contact.profile.handle}@${contact.profile.node}`;
          nameSet = false;
        }
      }
      else {
        name = "unknown";
        nameSet = false;
        known = false;
        logo = null;
      }
    }

    let parsed, sealed, message, assets, fontSize, fontColor;
    if (dataType === 'superbasictopic') {
      try {
        sealed = false;
        parsed = JSON.parse(data);
        message = parsed.text;
        assets = parsed.assets;
        if (parsed.textSize === 'small') {
          fontSize = 10;
        }
        else if (parsed.textSize === 'large') {
          fontSize = 20;
        }
        else {
          fontSize = 14;
        }
        if (parsed.textColor) {
          fontColor = parsed.textColor;
        }
        else {
          fontColor = Colors.text;
        }
      }
      catch (err) {
        console.log(err);
      }
    }
    else if (dataType === 'sealedtopic') {
      if (unsealedDetail) {
        sealed = false;
        parsed = unsealedDetail.message;
        message = parsed?.text;
        if (parsed?.textSize === 'small') {
          fontSize = 10;
        }
        else if (parsed?.textSize === 'large') {
          fontSize = 20;
        }
        else {
          fontSize = 14;
        }
        if (parsed?.textColor) {
          fontColor = parsed?.textColor;
        }
        else {
          fontColor = Colors.text;
        }
      }
      else {
        sealed = true;
        unsealTopic(topicId, revision, detail);
      }
    }

    let timestamp;
    const date = new Date(created * 1000);
    const now = new Date();
    const offset = now.getTime() - date.getTime();
    if(offset < 86400000) {
      timestamp = moment(date).format('h:mma');
    }
    else if (offset < 31449600000) {
      timestamp = moment(date).format('M/DD');
    }
    else {
      timestamp = moment(date).format('M/DD/YYYY');
    }

    const editable = guid === identity?.guid && parsed;
    const deletable = editable || hosting;

    updateState({ logo, name, nameSet, known, sealed, message, fontSize, fontColor, timestamp, transform, status, assets, deletable, editable, editData: parsed, editMessage: message });
  }, [conversation.state, card.state, account.state, item]);

  const unsealTopic = async (topicId, revision, topicDetail) => {
    try {
console.log("UNSEAL", topicId);
      const channelDetail = conversation.state.channel?.detail;
      const seals = getChannelSeals(channelDetail?.data);
      const sealKey = account.state.sealKey;
      if (isUnsealed(seals, sealKey)) {
        const contentKey = await getContentKey(seals, sealKey);
        const unsealed = decryptTopicSubject(topicDetail.data, contentKey);
        await conversation.actions.unsealTopic(topicId, revision, unsealed);
      }
    }
    catch(err) {
      console.log(err);
    }
  };

  const actions = {
    showCarousel: (index) => {
      updateState({ carousel: true, carouselIndex: index });
    },
    hideCarousel: () => {
      updateState({ carousel: false });
    },
    setActive: (activeId) => {
      updateState({ activeId });
    },
  };

  return { state, actions };
}

