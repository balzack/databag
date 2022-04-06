import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../AppContext/AppContext';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getListingMessage } from '../../Api/getListingMessage';
import { addCard } from '../../Api/addCard';
import { removeCard } from '../../Api/removeCard';
import { setCardConnecting, setCardConnected, setCardConfirmed } from '../../Api/setCardStatus';
import { getCardOpenMessage } from '../../Api/getCardOpenMessage';
import { setCardOpenMessage } from '../../Api/setCardOpenMessage';
import { getCardCloseMessage } from '../../Api/getCardCloseMessage';
import { setCardCloseMessage } from '../../Api/setCardCloseMessage';

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
    confirm: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          await setCardConfirmed(app.state.token, state.cardId);
        }
        catch (err) {
          window.alert(err);
        }
        updateState({ busy: false });
      }
    },
    connect: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          await setCardConnecting(app.state.token, state.cardId);
          let message = await getCardOpenMessage(app.state.token, state.cardId);
          let contact = await setCardOpenMessage(state.node, message);
          if (contact.status === 'connected') {
            await setCardConnected(app.state.token, state.cardId, contact.token, contact.viewRevision, contact.articleRevision, contact.channelRevision, contact.profileRevision);
          }
        }
        catch (err) {
          window.alert(err);
        }
        updateState({ busy: false });
      }
    },
    disconnect: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          await setCardConfirmed(app.state.token, state.cardId);
          try {
            let message = await getCardCloseMessage(app.state.token, state.cardId);
            await setCardCloseMessage(state.node, message);
          }
          catch (err) {
            console.log(err);
          }
        }
        catch (err) {
          window.alert(err);
        }
        updateState({ busy: false });
      }
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
    disconnectRemove: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          await setCardConfirmed(app.state.token, state.cardId);
          try {
            let message = await getCardCloseMessage(app.state.token, state.cardId);
            await setCardCloseMessage(state.node, message);
            await removeCard(app.state.token, state.cardId);
            navigate('/user');
          }
          catch (err) {
            console.log(err);
          }
        }
        catch (err) {
          window.alert(err);
        }
        updateState({ busy: false });
      }
    },
    saveConnect: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          let profile = await getListingMessage(state.node, guid);
          let card = await addCard(app.state.token, profile);
          await setCardConnecting(app.state.token, card.id);
          let open = await getCardOpenMessage(app.state.token, card.id);
          let contact = await setCardOpenMessage(state.node, open);
          if (contact.status === 'connected') {
            await setCardConnected(app.state.token, card.id, contact.token, contact.viewRevision, contact.articleRevision, contact.channelRevision, contact.profileRevision);
          }
        }
        catch (err) {
          window.alert(err);
        }
        updateState({ busy: false });
      }
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
          updateState({ showButtons: { disconnect: true, disconnectRemove: true }});
        }
        if (status === 'connecting') {
          updateState({ status: 'connecting' });
          updateState({ showButtons: { cancel: true, disconnectRemove: true }});
        }
        if (status === 'pending') {
          updateState({ status: 'pending' });
          updateState({ showButtons: { ignore: true, confirm: true, confirmConnect: true }});
        }
        if (status === 'confirmed') {
          updateState({ status: 'confirmed' });
          updateState({ showButtons: { remove: true, connect: true }});
        }
        if (status === 'requested') {
          updateState({ status: 'requested' });
          updateState({ showButtons: { deny: true, accept: true }});
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
