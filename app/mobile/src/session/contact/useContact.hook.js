import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContext } from 'context/CardContext';
import { useWindowDimensions } from 'react-native'
import { getListingMessage } from 'api/getListingMessage';
import config from 'constants/Config';

export function useContact(contact, close) {

  const [state, setState] = useState({
    tabbed: null,
    name: null,
    handle: null,
    node: null,
    location: null,
    description: null,
    logo: null,
    status: null,
    cardId: null,
    guid: null,
    busy: false,
    offsync: false,
  });

  const dimensions = useWindowDimensions();
  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (dimensions.width > config.tabbedWidth) {
      updateState({ tabbed: false });
    }
    else {
      updateState({ tabbed: true });
    }
  }, [dimensions]);

  useEffect(() => {
    let stateSet = false;
    if (contact?.card) {
      const selected = card.state.cards.get(contact.card);
      if (selected) {
        const { offsync, profile, detail, cardId } = selected;
        const { name, handle, node, location, description, guid, imageSet, revision } = profile;
        const logo = imageSet ? card.actions.getCardLogo(cardId, revision) : 'avatar';
        updateState({ offsync, name, handle, node, location, description, logo, cardId, guid, status: detail.status });
        stateSet = true;
      }
    }
    if (!stateSet && contact?.account) {
      const { handle, name, node, logo, guid } = contact.account;
      const selected = card.actions.getByGuid(guid);
      if (selected) {
        const { offsync, cardId, profile, detail } = selected;
        const { name, handle, node, location, description, guid, imageSet, revision } = profile;
        const logo = imageSet ? card.actions.getCardLogo(cardId, revision) : 'avatar';
        updateState({ offsync, name, handle, node, location, description, logo, cardId, guid, status: detail.status });
        stateSet = true;
      }
      else {
        const { name, handle, node, location, description, logo, guid } = contact.account;
        updateState({ offsync: false, name, handle, node, location, description, logo, guid, cardId: null, status: null });
        stateSet = true;
      }
    }
    if (!stateSet) {
      setState({});
    }
  }, [contact, card]);

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
        close();
      });
    },
    deleteContact: async () => {
      await applyAction(async () => {
        await card.actions.removeCard(state.cardId);
        close();
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
        await card.actions.setCardBlocked(state.cardId);
        close();
      });
    },
    resync: () => {
      card.actions.resync(contact.card);
    },
  };

  return { state, actions };
}

