import { useContext, useState, useRef, useEffect } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { encryptTopicSubject } from 'context/sealUtil';
import Resizer from "react-image-file-resizer";

export function useAddTopic(contentKey) {
  
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

  const conversation = useContext(ConversationContext);
  const objects = useRef([]);

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

  const clearObjects = () => {
    objects.current.forEach(object => {
      URL.revokeObjectURL(object);
    });
    objects.current = [];
  }

  useEffect(() => {
    updateState({ assets: [] });
    return () => { console.log("RETURN CLEAR"); clearObjects() };
  }, [contentKey]);

  useEffect(() => {
    const { enableImage, enableAudio, enableVideo } = conversation.state.channel?.data?.channelDetail || {};
    updateState({ enableImage, enableAudio, enableVideo });
  }, [conversation.state.channel?.data?.channelDetail]);

  const actions = {
    addImage: async (image) => {
      let url = URL.createObjectURL(image);
      addAsset({ image, url });
      objects.current.push(url);
    },
    addVideo: async (video) => {
      let url = URL.createObjectURL(video);
      addAsset({ video, url, position: 0 })
      objects.current.push(url);
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
    removeAsset: (idx) => {
      removeAsset(idx) 
    },
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
          const type = contentKey ? 'sealedtopic' : 'superbasictopic';
          const message = (assets) => {
            if (contentKey) {
              if (assets?.length) {
                console.log('assets not yet supported on sealed channels');
              }
              const message = { 
                text: state.messageText,
                textColor: state.textColorSet ? state.textColor : null,
                textSize: state.textSizeSet ? state.textSize : null,
              }
              return encryptTopicSubject({ message }, contentKey);
            }
            else {
              if (assets?.length) {
                return {
                  assets,
                  text: state.messageText,
                  textColor: state.textColorSet ? state.textColor : null,
                  textSize: state.textSizeSet ? state.textSize : null,
                }
              }
              else {
                return {
                  text: state.messageText,
                  textColor: state.textColorSet ? state.textColor : null,
                  textSize: state.textSizeSet ? state.textSize : null,
                }
              }
            }
          };
          await conversation.actions.addTopic(type, message, state.assets);
          updateState({ busy: false, messageText: null, textColor: '#444444', textColorSet: false,
              textSize: 12, textSizeSet: false, assets: [] });
          clearObjects();
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

async function getImageThumb(url) {
  return new Promise(resolve => {
    Resizer.imageFileResizer(url, 192, 192, 'JPEG', 50, 0,
    uri => {
      resolve(uri);
    }, 'base64', 128, 128 );
  });
}

async function getVideoThumb(url, pos) {
  return new Promise((resolve, reject) => {
    var video = document.createElement("video");
    var timeupdate = function (ev) {
      video.removeEventListener("timeupdate", timeupdate);
      video.pause();
      setTimeout(() => {
        var canvas = document.createElement("canvas");
        if (video.videoWidth > video.videoHeight) {
          canvas.width = 192;
          canvas.height = Math.floor((192 * video.videoHeight / video.videoWidth));
        }
        else {
          canvas.height  = 192;
          canvas.width = Math.floor((192 * video.videoWidth / video.videoHeight));
        }
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
        var image = canvas.toDataURL("image/jpeg", 0.75);
        resolve(image); 
        canvas.remove();
        video.remove();
      }, 1000);
    };
    video.addEventListener("timeupdate", timeupdate);
    video.preload = "metadata";
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.currentTime = pos;
    video.play();
  });
}
