import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { addChannelTopic } from '../../../Api/addChannelTopic';
import { AppContext } from '../../../AppContext/AppContext';

export function useAddTopic() {

  const [state, setState] = useState({
    assets: [],
    messageText: null,
    messageColor: null,
    messageSize: null,
    backgroundColor: null,
    busy: false,
  });

  const { contact, channel } = useParams();
  const app = useContext(AppContext);

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
if (!contact) {
          let message = { text: state.messageText, textColor: state.messageColor,
              textSize: state.messageSize, backgroundColor: state.backgroundColor };
          await addChannelTopic(app.state.token, channel, message, []);
}
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


