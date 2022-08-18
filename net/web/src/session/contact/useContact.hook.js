import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';
import { ProfileContext } from 'context/ProfileContext';
import { ViewportContext } from 'context/ViewportContext';
import { getListingImageUrl } from 'api/getListingImageUrl';
import { getListingMessage } from 'api/getListingMessage';

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
    init: false,
    status: null,
    busy: false,
    buttonStatus: 'button idle',
  });

  const card = useContext(CardContext);
  const profile = useContext(ProfileContext);
  const viewport = useContext(ViewportContext);  

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    let logo, name, location, description, handle, node, status, cardId;
    let contact = card.actions.getCardByGuid(guid);
    if (contact) {
      let cardProfile = contact?.data?.cardProfile;
      let cardDetail = contact?.data?.cardDetail;
      cardId = contact.id;
      handle = cardProfile.handle;
      node = cardProfile.node;
      logo = card.actions.getImageUrl(contact.id);
      name = cardProfile.name;
      location = cardProfile.location;
      description = cardProfile.description;
      status = cardDetail.status;
    }
    else if (listing) {
      handle = listing.handle;
      cardId = null;
      node = listing.node;
      logo = listing.imageSet ? getListingImageUrl(listing.node, listing.guid) : null;
      name = listing.name;
      location = listing.location;
      description = listing.description;
      status = 'disconnected';
    }
    else {
      updateState({ removed: true });
    }
    updateState({ init: true, logo, name, location, description, handle, node, status, cardId });
  }, [card, guid, listing]); 

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

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

