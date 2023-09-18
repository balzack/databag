import { useState, useEffect, useRef, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { CardContext } from 'context/CardContext';
import { ProfileContext } from 'context/ProfileContext';
import { getListingMessage } from 'api/getListingMessage';
import { getListingImageUrl } from 'api/getListingImageUrl';
import { addFlag } from 'api/addFlag';
import { getCardByGuid } from 'context/cardUtil';
import { getLanguageStrings } from 'constants/Strings';
import avatar from 'images/avatar.png';

export function useContact(contact) {

  const [state, setState] = useState({
    name: null,
    handle: null,
    node: null,
    location: null,
    description: null,
    status: null,
    cardId: null,
    guid: null,
    busy: false,
    offsync: false,

    
    strings: getLanguageStrings(),
    imageSource: null,
    imageWidth: null,
    imageHeight: null,
    detailWidth: null,
    username: null,
  });

  const dimensions = useWindowDimensions();
  const card = useContext(CardContext);
  const profile = useContext(ProfileContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { width, height } = dimensions;
    if (height > width) {
      updateState({ imageWidth: width, imageHeight: width, detailWidth: width + 2 });
    }
    else {
      updateState({ imageWidth: height, imageHeight: height, detailWidth: width + 2 });
    }
  }, [dimensions]);

  useEffect(() => {
    const contactCard = getCardByGuid(card.state.cards, contact?.guid);
    const { server } = profile.state;
    if (contactCard) {
      const { offsync, profile, detail, cardId } = contactCard.card;
      const { name, handle, node, location, description, guid, imageSet, revision } = profile;
      const host = node ? node : server;
      
      const username = `${handle}/${node}`
      const imageSource = imageSet ? { uri: card.actions.getCardImageUrl(cardId) } : avatar;
      updateState({ offsync, name, handle, node: server, location, description, imageSource, username, cardId, guid, status: detail.status });
    }
    else {
      const { guid, handle, node, name, location, description, imageSet } = contact || {};
      const host = node ? node : server;
      
      const username = `${handle}/${node}`
      const imageSource = imageSet ? { uri: getListingImageUrl(server, guid) } : avatar;
      updateState({ guid, handle, node: host, name, location, description, imageSource, username, offsync: false, status: null });
    }
  }, [contact, card.state, profile.state]);

  const applyAction = async (action) => {
    if (!state.busy) {
      try {
        updateState({ busy: true });
        await action();
        updateState({ busy: false });
      }
      catch (err) {
        console.log(err);
        updateState({ busy: false });
        throw new Error("failed to update contact");
      }
    }
    else {
      throw new Error("operation in progress");
    }
  }

  const actions = {
    saveAndConnect: async () => {
      await applyAction(async () => {
        let profile = await getListingMessage(state.node, state.guid);
        let added = await card.actions.addCard(profile);
        await card.actions.setCardConnecting(added.id);
        let open = await card.actions.getCardOpenMessage(added.id);
        let contact = await card.actions.setCardOpenMessage(state.node, open);
        if (contact.status === 'connected') {
          await card.actions.setCardConnected(added.id, contact.token, contact);
        }
      });
    },
    confirmAndConnect: async () => {
      await applyAction(async () => {
        await card.actions.setCardConfirmed(state.cardId);
        await card.actions.setCardConnecting(state.cardId);
        let open = await card.actions.getCardOpenMessage(state.cardId);
        let contact = await card.actions.setCardOpenMessage(state.node, open);
        if (contact.status === 'connected') {
          await card.actions.setCardConnected(state.cardId, contact.token, contact);
        }
      });
    },
    saveContact: async () => {
      await applyAction(async () => {
        let message = await getListingMessage(state.node, state.guid);
        await card.actions.addCard(message);
      });
    },
    disconnectContact: async () => {
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
    confirmContact: async () => {
      await applyAction(async () => {
        await card.actions.setCardConfirmed(state.cardId);
      });
    },
    ignoreContact: async () => {
      await applyAction(async () => {
        await card.actions.setCardConfirmed(state.cardId);
      });
    },
    closeDelete: async () => {
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
      });
    },
    deleteContact: async () => {
      await applyAction(async () => {
        await card.actions.removeCard(state.cardId);
      });
    },
    connectContact: async () => {
      await applyAction(async () => {
        await card.actions.setCardConnecting(state.cardId);
        let message = await card.actions.getCardOpenMessage(state.cardId);
        let contact = await card.actions.setCardOpenMessage(state.node, message);
        if (contact.status === 'connected') {
          await card.actions.setCardConnected(state.cardId, contact.token, contact);
        }
      });
    },
    blockContact: async () => {
      await applyAction(async () => {
        await card.actions.setCardFlag(state.cardId);
      });
    },
    reportContact: async () => {
      await addFlag(state.node, state.guid);
    },
    resync: () => {
      card.actions.resyncCard(state.cardId);
    },
  };

  return { state, actions };
}


