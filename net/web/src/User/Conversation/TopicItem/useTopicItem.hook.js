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
  });

  const profile = useContext(ProfileContext);
  const card = useContext(CardContext);
  const conversation = useContext(ConversationContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    let message;
    try {
      message = JSON.parse(topic.data.topicDetail.data).text;
    }
    catch(err) {
      console.log(err);
    }

    if (profile.state.init && card.state.init && conversation.state.init) {
      const topicGuid = topic.data.topicDetail.guid;
      if (profile.state.profile.guid == topicGuid) {
        const { name, handle, imageUrl } = profile.actions.getProfile();
        updateState({ name, handle, imageUrl, message });
      }
      else {
        const { name, handle, imageUrl } = card.actions.getCardProfileByGuid(topicGuid);
        updateState({ name, handle, imageUrl, message });
      }   
    }
  }, [profile, card, conversation, topic]);

  const actions = {
  };

  return { state, actions };
}
