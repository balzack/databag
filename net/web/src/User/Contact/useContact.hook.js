import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../AppContext/AppContext';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getListingMessage } from '../../Api/getListingMessage';
import { addCard } from '../../Api/addCard';
import { removeCard } from '../../Api/removeCard';

export function useContact() {
  
  const [state, setState] = useState({
    status: null,
    handle: '',
    name: '',
    location: '',
    description: '',
    imageUrl: null,
    node: '',
    cardId: '',
    showButtons: {},
    busy: false,
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
    save: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          let message = await getListingMessage(state.node, guid);
          let card = await addCard(app.state.token, message);
        }
        catch (err) {
          window.alert(err);
        }
        updateState({ busy: false });
      }
    },
    connect: () => {
    },
    disconnect: () => {
    },
    ignore: () => {
    },
    cancel: () => {
    },
    remove: async () => {
      if (!state.busy) {
        updateState({ busy: true  });
        try {
          await removeCard(app.state.token, state.cardId);
          navigate('/user');
        }
        catch (err) {
          window.alert(err);
        }
        updateState({ busy: false });
      }
    },
    saveRequest: () => {
    },
    saveAccept: () => {
    },
  };

  useEffect(() => {
    if (app?.state?.access === 'user') {
      let card = app.actions.getCard(guid);
      if (card) {
        let profile = card.data.cardProfile;
        updateState({ cardId: card.id });
        updateState({ handle: profile.handle });
        updateState({ name: profile.name });
        updateState({ description: profile.description });
        updateState({ location: profile.location });
        updateState({ node: profile.node });
        if (card.data.cardProfile.imageSet) {
          updateState({ imageUrl: app.actions.getCardImageUrl(card.id, card.revision) });
        }
        else {
          updateState({ imageUrl: '' });
        }
        let status = card.data.cardDetail.status;
        if (status === 'connected') {
          updateState({ status: 'connected' });
          updateState({ showButtons: { disconnect: true, remove: true }});
        }
        if (status === 'connecting') {
          updateState({ status: 'connecting' });
          updateState({ showButtons: { cancel: true, remove: true }});
        }
        if (status === 'pending') {
          updateState({ status: 'requested' });
          updateState({ showButtons: { ignore: true, save: true, saveAccept: true }});
        }
        if (status === 'confirmed') {
          updateState({ status: 'disconnected' });
          updateState({ showButtons: { remove: true, connect: true }});
        }
        if (status === 'requested') {
          updateState({ status: 'requested' });
          updateState({ showButtons: { ignore: true, accept: true }});
        }
      }
      else if (data.state) {
        updateState({ handle: data.state.handle });
        updateState({ name: data.state.name });
        updateState({ description: data.state.description });
        updateState({ location: data.state.location });
        updateState({ node: data.state.node });
        if (data.state.imageSet) {
          updateState({ imageUrl: app.actions.getRegistryImageUrl(data.state.node, guid, data.state.revision) });
        }
        else {
          updateState({ imageUrl: '' });
        }
        updateState({ status: 'unsaved' });
        updateState({ showButtons: { save: true, saveRequest: true }});
      }
    }
  }, [app, guid])

  return { state, actions };
}
