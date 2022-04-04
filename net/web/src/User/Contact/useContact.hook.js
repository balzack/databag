import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../AppContext/AppContext';
import { useNavigate, useLocation, useParams } from "react-router-dom";

export function useContact() {
  
  const [state, setState] = useState({
    status: null,
    handle: '',
    name: '',
    location: '',
    description: '',
    imageUrl: null,
  });

  const data = useLocation();
  const { guid } = useParams();
  const navigate = useNavigate();
  const app = useContext(AppContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    close: () => {
      navigate('/user')
    },
  };

  useEffect(() => {
    if (app?.state?.access === 'user') {
      let card = app.actions.getCard(guid);
      if (card) {
        updateState({ handle: card.data.cardProfile.handle });
        updateState({ name: card.data.cardProfile.name });
        updateState({ description: card.data.cardProfile.description });
        updateState({ location: card.data.cardProfile.location });
        if (card.data.cardProfile.imageSet) {
          updateState({ imageUrl: app.actions.getCardImageUrl(card.id, card.revision) });
        }
        else {
          updateState({ imageUrl: '' });
        }
      }
      else if (data.state) {
        updateState({ handle: data.state.handle });
        updateState({ name: data.state.name });
        updateState({ description: data.state.description });
        updateState({ location: data.state.location });
        if (data.state.imageSet) {
          updateState({ imageUrl: app.actions.getRegistryImageUrl(data.state.node, guid, data.state.revision) });
        }
        else {
          updateState({ imageUrl: '' });
        }
      }
    }
  }, [app, guid])

  return { state, actions };
}
