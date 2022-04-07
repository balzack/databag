import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../../../AppContext/AppContext';
import { useNavigate } from 'react-router-dom';
import { addChannel } from '../../../../Api/addChannel';

export function useChannels() {

  const [state, setState] = useState({
    startCards: [],
    startSubject: '',
    startDescription: '',
    busy: false,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const navigate = useNavigate();
  const app = useContext(AppContext);

  const actions = {
    getCardImageUrl: app?.actions?.getCardImageurl,
    getCards: app?.actions?.getConnectedCards,
    setStartCards: (cards) => updateState({ startCards: cards }),
    setStartSubject: (value) => updateState({ startSubject: value }),
    setStartDescription: (value) => updateState({ startDescription: value }),
    addChannel: async () => { 
      let done = false;
      if (!state.busy) {
        updateState({ busy: true });
        try {
          let channel = await addChannel(app.state.token, state.startCards, state.startSubject, state.startDescription);
          console.log(channel);
          done = true;
        }
        catch (err) {
          window.alert(err);
        }
        updateState({ busy: false });
      }
      return done;
    }
  };

  useEffect(() => {
    if (app?.state?.Data?.channels) {
      updateState({ channels: app.state.Data.channels });
    }
    else {
      updateState({ channels: [] });
    }
  }, [app])

  return { state, actions };
}

