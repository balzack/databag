import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';

export function useAddTopic() {

  const [state, setState] = useState({
    assets: [],
    messageText: null,
    textColor: '#444444',
    textColorSet: false,
    textSize: 14,
    textSizeSet: false,
    busy: false,
  });

  const { cardId, channelId } = useParams();
  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);

  useEffect(() => {
      updateState({
      assets: [],
      messageText: null,
      textColor: '#444444',
      textColorSet: false,
      textSize: 14,
      textSizeSet: false,
      busy: false,
    });
  }, [cardId, channelId]);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const addAsset = (value) => {
    setState((s) => {
      let assets = [...s.assets, value];
      return { ...s, assets };
    });
  }

  const updateAsset = (index, value) => {
    setState((s) => {
      s.assets[index] = { ...s.assets[index], ...value };
      return { ...s };
    });
  }

  const removeAsset = (index) => {
    setState((s) => {
      s.assets.splice(index, 1);
      let assets = [...s.assets];
      return { ...s, assets };
    });
  }

  const actions = {
    addImage: (image) => { 
      let url = URL.createObjectURL(image);
      addAsset({ image, url }) 
    },
    addVideo: (video) => { 
      let url = URL.createObjectURL(video);
      addAsset({ video, url, position: 0 }) 
    },
    addAudio: (audio) => {
      let url = URL.createObjectURL(audio);
      addAsset({ audio, url, label: '' }) 
    },
    setLabel: (index, label) => {
      updateAsset(index, { label });
    },
    setPosition: (index, position) => {
      updateAsset(index, { position });
    },
    removeAsset: (idx) => { removeAsset(idx) },
    setTextColor: (value) => {
      updateState({ textColorSet: true, textColor: value });
    },
    setMessageText: (value) => {
      updateState({ messageText: value });
    },
    setTextSize: (value) => {
      updateState({ textSizeSet: true, textSize: value });
    },
    addTopic: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          let message = {
            text: state.messageText,
            textColor: state.textColorSet ? state.textColor : null,
            textSize: state.textSizeSet ? state.textSize : null, 
          };
          if (cardId) {
            await card.actions.addChannelTopic(cardId, channelId, message, state.assets);
          }
          else {
            await channel.actions.addChannelTopic(channelId, message, state.assets);
          }
          updateState({ messageText: null, textColor: '#444444', textColorSet: false, textSize: 12, textSizeSet: false, assets: [] });
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


