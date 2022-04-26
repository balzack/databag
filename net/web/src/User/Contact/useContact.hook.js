import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getListingMessage } from 'api/getListingMessage';
import { getListingImageUrl } from 'api/getListingImageUrl';

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
  const card = useContext(CardContext);

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
          await card.actions.addCard(message);
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
          await card.actions.setCardConfirmed(state.cardId);
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
          await card.actions.setCardConnecting(state.cardId);
          let message = await card.actions.getCardOpenMessage(state.cardId);
          let contact = await card.actions.setCardOpenMessage(state.node, message);
          if (contact.status === 'connected') {
            await card.actions.setCardConnected(state.cardId, contact.token, contact.viewRevision, contact.articleRevision, contact.channelRevision, contact.profileRevision);
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
          await card.actions.setCardConfirmed(state.cardId);
          try {
            let message = await card.actions.getCardCloseMessage(state.cardId);
            await card.actions.setCardCloseMessage(state.node, message);
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
          await card.actions.removeCard(state.cardId);
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
          await card.actions.setCardConfirmed(state.cardId);
          try {
            let message = await card.actions.getCardCloseMessage(state.cardId);
            await card.actions.setCardCloseMessage(state.node, message);
            await card.actions.removeCard(state.cardId);
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
          let added = await card.actions.addCard(profile);
          await card.actions.setCardConnecting(added.id);
          let open = await card.actions.getCardOpenMessage(added.id);
          let contact = await card.actions.setCardOpenMessage(state.node, open);
          if (contact.status === 'connected') {
            await card.actions.setCardConnected(added.id, contact.token, contact.viewRevision, contact.articleRevision, contact.channelRevision, contact.profileRevision);
          }
        }
        catch (err) {
          window.alert(err);
        }
        updateState({ busy: false });
      }
    },
  };

  const updateContact = () => {
    let contact = card.actions.getCardByGuid(guid);
    if (contact) {
      let profile = contact.data.cardProfile;
      updateState({ cardId: contact.id });
      updateState({ handle: profile.handle });
      updateState({ name: profile.name });
      updateState({ description: profile.description });
      updateState({ location: profile.location });
      updateState({ node: profile.node });
      if (contact.data.cardProfile.imageSet) {
        updateState({ imageUrl: card.actions.getImageUrl(contact.id) });
      }
      else {
        updateState({ imageUrl: '' });
      }
      let status = contact.data.cardDetail.status;
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
        updateState({ imageUrl: getListingImageUrl(data.state.node, guid, data.state.revision) });
      }
      else {
        updateState({ imageUrl: '' });
      }
      updateState({ status: 'unsaved' });
      updateState({ showButtons: { save: true, saveRequest: true }});
    }
  }
  
  useEffect(() => {
    if (card.state.init) {
      updateContact();
    }
  }, [card, guid])

  return { state, actions };
}
