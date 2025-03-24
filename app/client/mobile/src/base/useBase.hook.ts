import {useState, useContext, useEffect} from 'react';
import {DisplayContext} from '../context/DisplayContext';
import {AppContext} from '../context/AppContext';
import {ContextType} from '../context/ContextType';

export function useBase() {
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    strings: display.state.strings,
    profileSet: null as null | boolean,
    cardSet: null as null | boolean,
    channelSet: null as null | boolean,
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const setProfile = (profile: Profile) => {
      updateState({profileSet: Boolean(profile.name)});
    };
    const setCards = (cards: Card[]) => {
      updateState({cardSet: cards.length > 0});
    };
    const setChannels = ({channels, cardId}: {channels: Channel[]; cardId: string | null}) => {
      updateState({channelSet: cardId && channels.length > 0});
    };

    const {identity, contact, content} = app.state.session;
    identity.addProfileListener(setProfile);
    contact.addCardListener(setCards);
    content.addChannelListener(setChannels);

    return () => {
      identity.removeProfileListener(setProfile);
      contact.removeCardListener(setCards);
      content.removeChannelListener(setChannels);
    };
  }, [app.state.session]);

  const actions = {};

  return {state, actions};
}
