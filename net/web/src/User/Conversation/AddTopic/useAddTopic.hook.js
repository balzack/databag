import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAddTopic() {

  const [state, setState] = useState({
    assets: [],
    messageText: null,
    messageColor: null,
    messageWeight: null,
    messageSize: null,
    backgroundColor: null,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const addAsset = (value) => {
    setState((s) => {
      s.assets.push(value);
      return { ...s };
    });
  }

  const navigate = useNavigate();

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
    addTopic: () => {},
  };

  return { state, actions };
}


