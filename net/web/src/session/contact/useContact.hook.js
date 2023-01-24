import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';
import { ViewportContext } from 'context/ViewportContext';
import { getListingImageUrl } from 'api/getListingImageUrl';
import { getListingMessage } from 'api/getListingMessage';
import { getCardByGuid } from 'context/cardUtil';

export function useContact(guid, listing, close) {

  const [state, setState] = useState({
    logo: null,
    name: null,
    cardId: null,
    location: null,
    description: null,
    handle: null,
    node: null,
    removed: false,
    status: null,
    busy: false,
    buttonStatus: 'button idle',
  });

  const card = useContext(CardContext);
  const viewport = useContext(ViewportContext);  

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const statusMap = (status) => {
    if (status === 'confirmed') {
      return 'saved';
    }
    if (status === 'requested') {
      return 'request received';
    }
    if (status === 'connecting') {
      return 'request sent';
    }
    return status;
  }

  useEffect(() => {
    const contact = getCardByGuid(card.state.cards, guid);
    if (contact) {
      const profile = contact?.data?.cardProfile;
      const detail = contact?.data?.cardDetail;
      const { imageSet, name, location, description, handle, node } = profile;      
      const status = statusMap(detail.status);
      const cardId = contact.id;
      const logo = imageSet ? card.actions.getCardImageUrl(cardId) : null;
      updateState({ logo, name, location, description, handle, node, status, cardId });
    }
    else if (listing) {
      const { imageSet, name, location, description, handle, node } = listing;
      const logo = imageSet ? getListingImageUrl(node, guid) : null;
      updateState({ logo, name, location, description, handle, node, status: 'unsaved', cardId: null });
    }
    else {
      updateState({ removed: true });
    }
    // eslint-disable-next-line
  }, [card.state, guid, listing]); 

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport.state]);

  const applyAction = async (action) => {
    if (!state.busy) {
      try {
        updateState({ busy: true, buttonStatus: 'button busy', action });
        await action();
        updateState({ busy: false, buttonStatus: 'button idle' });
      }
      catch (err) {
        console.log(err);
        updateState({ busy: false, buttonStatus: 'button idle' });
        throw new Error("failed to update contact");
      }
    }
    else {
      throw new Error("operation in progress");
    }
  }

  const actions = {
    saveContact: async () => {
      await applyAction(async () => {
        let message = await getListingMessage(state.node, guid);
        await card.actions.addCard(message);
      });
    },
    confirmContact: async() => {
      await applyAction(async () => {
        await card.actions.setCardConfirmed(state.cardId);
      });
    },
    saveConnect: async () => {
      await applyAction(async () => {
        let profile = await getListingMessage(state.node, guid);
        let added = await card.actions.addCard(profile);
        await card.actions.setCardConnecting(added.id);
        let open = await card.actions.getCardOpenMessage(added.id);
        let contact = await card.actions.setCardOpenMessage(state.node, open);
        if (contact.status === 'connected') {
          await card.actions.setCardConnected(added.id, contact.token, contact);
        }
      });
    },
    deleteContact: async () => {
      await applyAction(async () => {
        await card.actions.removeCard(state.cardId);
        close();
      });
    },
    connect: async () => {
      await applyAction(async () => {
        await card.actions.setCardConnecting(state.cardId);
        let message = await card.actions.getCardOpenMessage(state.cardId);
        let contact = await card.actions.setCardOpenMessage(state.node, message);
        if (contact.status === 'connected') {
          await card.actions.setCardConnected(state.cardId, contact.token, contact);
        }
      });
    },
    disconnect: async () => {
      await applyAction(async () => {
        await card.actions.setCardConfirmed(state.cardId);
        try {
          let message = await card.actions.getCardCloseMessage(state.cardId);
          await card.actions.setCardCloseMessage(state.node, message);
        }
        catch (err) {
          console.log(err);
        }
      });
    },
    disconnectRemove: async () => {
      await applyAction(async () => {
        await card.actions.setCardConfirmed(state.cardId);
        try {
          let message = await card.actions.getCardCloseMessage(state.cardId);
          await card.actions.setCardCloseMessage(state.node, message);
        }
        catch (err) {
          console.log(err);
        }
        await card.actions.removeCard(state.cardId);
        close();
      });
    },
    remove: async () => {
      await applyAction(async () => {
        await card.actions.removeCard(state.cardId);
        close();
      });
    },
  };

  return { state, actions };
}

