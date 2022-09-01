import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';
import { ConversationContext } from 'context/ConversationContext';

export function useAddTopic(cardId, channelId) {
  
  const [state, setState] = useState({
    enableImage: null,
    enableAudio: null,
    enableVideo: null,
    assets: [],
    messageText: null,
    textColor: '#444444',
    textColorSet: false,
    textSize: 14,
    textSizeSet: false,
    busy: false,
  });

  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const conversation = useContext(ConversationContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  };

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

  useEffect(() => {
    const { enableImage, enableAudio, enableVideo } = conversation.state;
    updateState({ enableImage, enableAudio, enableVideo });
  }, [conversation]);

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
        try {
          updateState({ busy: true });
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
          updateState({ busy: false, messageText: null, textColor: '#444444', textColorSet: false,
              textSize: 12, textSizeSet: false, assets: [] });
        }
        catch(err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error("failed to post topic");
        }
      }
      else {
        throw new Error("operation in progress");
      }
    },
  };

  return { state, actions };
}

