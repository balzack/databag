import { useContext, useState, useEffect, useRef } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { ProfileContext } from 'context/ProfileContext';
import { CardContext } from 'context/CardContext';

export function useTopicItem(topic) {

  const [guid, setGuid] = useState(null);

  const [state, setState] = useState({
    name: null,
    handle: null,
    imageUrl: null,
    message: null,
    created: null,
    status: null,
    transform: null,
    assets: [],
  });

  const profile = useContext(ProfileContext);
  const card = useContext(CardContext);
  const conversation = useContext(ConversationContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {

    const { status, transform, data } = topic.data.topicDetail;
    let message;
    let assets = [];
    if (status === 'confirmed') {
      try {
        message = JSON.parse(data);
        if (transform === 'complete') {
          if (message.assets) {
            assets = message.assets;
            delete message.assets;
          }
        }
      }
      catch(err) {
        console.log(err);
      }
    }

    if (profile.state.init && card.state.init && conversation.state.init) {
      const { guid, created } = topic.data.topicDetail;
      if (profile.state.profile.guid == guid) {
        const { name, handle, imageUrl } = profile.actions.getProfile();
        updateState({ name, handle, imageUrl, status, message, transform, assets, created });
      }
      else {
        const { name, handle, imageUrl } = card.actions.getCardProfileByGuid(guid);
        updateState({ name, handle, imageUrl, status, message, transform, assets, created });
      }
    }
  }, [profile, card, conversation, topic]);

  const actions = {
    getAssetUrl: (assetId) => {
      return conversation.actions.getAssetUrl(topic.id, assetId);
    }
  };

  return { state, actions };
}
