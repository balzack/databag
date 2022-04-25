import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { addChannelTopic } from '../../../Api/addChannelTopic';
import { addContactChannelTopic } from '../../../Api/addContactChannelTopic';
import { CardContext } from '../../../AppContext/CardContext';
import { ChannelContext } from '../../../AppContext/ChannelContext';

export function useAddTopic() {

  const [state, setState] = useState({
    assets: [],
    messageText: null,
    messageColor: null,
    messageSize: null,
    backgroundColor: null,
    busy: false,
  });

  const { cardId, channelId } = useParams();
  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const addAsset = (value) => {
    setState((s) => {
      s.assets.push(value);
      return { ...s };
    });
  }

  const actions = {
    addImage: (image) => { addAsset(image) },
    addVideo: (video) => { addAsset(video) },
    addAudio: (audio) => { addAsset(audio) },
    addIframe: (iframe) => { addAsset(iframe) },
    removeAsset: (idx) => {},
    setMessageText: (value) => {
      updateState({ messageText: value });
    },
    setMessageColor: (value) => {
      updateState({ messageColor: value });
    },
    setMessageWeight: (value) => {
      updateState({ messageWeight: value });
    },
    setMessageSize: (value) => {
      updateState({ messageSize: value });
    },
    setBackgroundColor: (value) => {
      updateState({ backgroundColor: value });
    },
    addTopic: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          let message = { text: state.messageText, textColor: state.messageColor,
              textSize: state.messageSize, backgroundColor: state.backgroundColor };
          if (cardId) {
            await card.actions.addChannelTopic(cardId, channelId, message, []);
          }
          else {
            await channel.actions.addChannelTopic(channelId, message, []);
          }
          updateState({ messageText: null, messageColor: null, messageSize: null, backgroundColor: null });
        }
        catch(err) {
          window.alert(err);
        }
        updateState({ busy: false });
      }
    },
  };

  return { state, actions };
}


